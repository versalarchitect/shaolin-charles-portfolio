BEGIN;

CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- Tables
-- ============================================================

CREATE TABLE IF NOT EXISTS source_events (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  source        text        NOT NULL,
  url           text        NOT NULL,
  title         text        NOT NULL,
  content_hash  text        NOT NULL UNIQUE,
  raw_content   text        NOT NULL,
  summary       text,
  fetched_at    timestamptz NOT NULL DEFAULT now(),
  published_at  timestamptz,
  metadata      jsonb       DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS knowledge_facts (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  statement       text          NOT NULL,
  category        text          NOT NULL CHECK (category IN (
                    'model_capability', 'pricing', 'sdk_api', 'pattern',
                    'deprecation', 'release', 'breaking_change', 'best_practice'
                  )),
  entities        text[]        NOT NULL DEFAULT '{}',
  confidence      numeric(3,2)  NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  source_event_id uuid          NOT NULL REFERENCES source_events(id) ON DELETE CASCADE,
  superseded_by   uuid          REFERENCES knowledge_facts(id) ON DELETE SET NULL,
  valid_from      timestamptz   NOT NULL DEFAULT now(),
  valid_until     timestamptz,
  embedding       vector(1536),
  created_at      timestamptz   NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS course_modules (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text        NOT NULL,
  description text        NOT NULL,
  slug        text        NOT NULL UNIQUE,
  order_index integer     NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lessons (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   uuid        NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title       text        NOT NULL,
  description text        NOT NULL,
  slug        text        NOT NULL,
  order_index integer     NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(module_id, slug)
);

CREATE TABLE IF NOT EXISTS content_blocks (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id            uuid        NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  order_index          integer     NOT NULL,
  heading              text,
  markdown             text        NOT NULL,
  depends_on_facts     uuid[]      NOT NULL DEFAULT '{}',
  last_regenerated_at  timestamptz NOT NULL DEFAULT now(),
  status               text        NOT NULL DEFAULT 'current' CHECK (status IN (
                         'current', 'at_risk', 'stale', 'regenerating'
                       )),
  version              integer     NOT NULL DEFAULT 1,
  regeneration_prompt  text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS regeneration_proposals (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  content_block_id  uuid        NOT NULL REFERENCES content_blocks(id) ON DELETE CASCADE,
  old_markdown      text        NOT NULL,
  new_markdown      text        NOT NULL,
  diff_summary      text        NOT NULL,
  change_type       text        NOT NULL CHECK (change_type IN ('patch', 'rewrite', 'deprecate')),
  confidence        numeric(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  triggered_by_facts uuid[]     NOT NULL DEFAULT '{}',
  status            text        NOT NULL DEFAULT 'pending' CHECK (status IN (
                      'pending', 'approved', 'rejected', 'applied'
                    )),
  created_at        timestamptz NOT NULL DEFAULT now(),
  reviewed_at       timestamptz
);

CREATE TABLE IF NOT EXISTS pipeline_runs (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at          timestamptz NOT NULL DEFAULT now(),
  completed_at        timestamptz,
  status              text        NOT NULL DEFAULT 'running' CHECK (status IN (
                        'running', 'completed', 'failed'
                      )),
  events_fetched      integer     NOT NULL DEFAULT 0,
  facts_extracted     integer     NOT NULL DEFAULT 0,
  blocks_flagged      integer     NOT NULL DEFAULT 0,
  proposals_generated integer     NOT NULL DEFAULT 0,
  error               text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_source_events_source        ON source_events(source);
CREATE INDEX IF NOT EXISTS idx_source_events_fetched_at    ON source_events(fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_source_events_content_hash  ON source_events(content_hash);

CREATE INDEX IF NOT EXISTS idx_knowledge_facts_category     ON knowledge_facts(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_facts_source_event ON knowledge_facts(source_event_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_facts_entities     ON knowledge_facts USING GIN(entities);
CREATE INDEX IF NOT EXISTS idx_knowledge_facts_valid        ON knowledge_facts(valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_knowledge_facts_superseded   ON knowledge_facts(superseded_by) WHERE superseded_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_content_blocks_lesson  ON content_blocks(lesson_id);
CREATE INDEX IF NOT EXISTS idx_content_blocks_status  ON content_blocks(status);
CREATE INDEX IF NOT EXISTS idx_content_blocks_depends ON content_blocks USING GIN(depends_on_facts);

CREATE INDEX IF NOT EXISTS idx_regen_proposals_block  ON regeneration_proposals(content_block_id);
CREATE INDEX IF NOT EXISTS idx_regen_proposals_status ON regeneration_proposals(status);

CREATE INDEX IF NOT EXISTS idx_pipeline_runs_status ON pipeline_runs(status);

-- ============================================================
-- Functions & Triggers
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_course_modules_updated_at
  BEFORE UPDATE ON course_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_content_blocks_updated_at
  BEFORE UPDATE ON content_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION flag_blocks_on_fact_supersession()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.superseded_by IS NOT NULL AND OLD.superseded_by IS NULL THEN
    UPDATE content_blocks
    SET status = 'at_risk', updated_at = now()
    WHERE NEW.id = ANY(depends_on_facts)
      AND status = 'current';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_fact_supersession
  AFTER UPDATE ON knowledge_facts
  FOR EACH ROW
  EXECUTE FUNCTION flag_blocks_on_fact_supersession();

-- ============================================================
-- Vector Similarity Search
-- ============================================================

CREATE OR REPLACE FUNCTION match_knowledge_facts(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id         uuid,
  statement  text,
  category   text,
  entities   text[],
  confidence numeric,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    kf.id,
    kf.statement,
    kf.category,
    kf.entities,
    kf.confidence,
    1 - (kf.embedding <=> query_embedding) AS similarity
  FROM knowledge_facts kf
  WHERE kf.superseded_by IS NULL
    AND kf.valid_until IS NULL
    AND 1 - (kf.embedding <=> query_embedding) > match_threshold
  ORDER BY kf.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE source_events          ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_facts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules         ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons                ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE regeneration_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_runs          ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON source_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON knowledge_facts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON course_modules
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON lessons
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON content_blocks
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON regeneration_proposals
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON pipeline_runs
  FOR ALL USING (auth.role() = 'service_role');

COMMIT;
