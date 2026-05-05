BEGIN;

-- ============================================================
-- Gamification System
-- Tracks user XP, streaks, achievements, leaderboards,
-- explorer events, activity feed, and cosmetic unlocks.
-- ============================================================

-- ============================================================
-- Tables
-- ============================================================

-- Single row per user: full gamification state as JSONB
-- Generated columns extract key fields for indexing/leaderboards
CREATE TABLE IF NOT EXISTS user_progress (
  user_id        UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  state          JSONB        NOT NULL DEFAULT '{}',
  total_xp       INTEGER      GENERATED ALWAYS AS (COALESCE((state->>'totalXp')::int, 0)) STORED,
  current_streak INTEGER      GENERATED ALWAYS AS (COALESCE((state->>'currentStreak')::int, 0)) STORED,
  display_name   TEXT         DEFAULT '',
  avatar_url     TEXT         DEFAULT '',
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Weekly XP snapshots for weekly leaderboard
CREATE TABLE IF NOT EXISTS xp_weekly (
  user_id     UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_id     TEXT         NOT NULL, -- ISO week format e.g. '2026-W19'
  xp_earned   INTEGER      NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, week_id)
);

-- Explorer events: page visits, easter eggs, curiosity actions
-- UNIQUE constraint prevents duplicate XP awards for the same event
CREATE TABLE IF NOT EXISTS explorer_events (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type  TEXT         NOT NULL, -- 'page_visit', 'easter_egg', 'interaction'
  event_key   TEXT         NOT NULL, -- e.g. 'page:projects', 'egg:konami'
  xp_awarded  INTEGER      NOT NULL DEFAULT 0,
  metadata    JSONB        DEFAULT '{}',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  UNIQUE(user_id, event_key)
);

-- Public activity feed for social features
CREATE TABLE IF NOT EXISTS activity_feed (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type  TEXT         NOT NULL, -- 'achievement', 'level_up', 'streak_milestone', 'course_complete', 'explorer'
  payload     JSONB        NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Cosmetic unlocks: themes, visual items earned through progression
CREATE TABLE IF NOT EXISTS unlocked_cosmetics (
  user_id     UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cosmetic_id TEXT         NOT NULL, -- 'theme-midnight', 'theme-ghost', 'theme-terminal'
  unlocked_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, cosmetic_id)
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_user_progress_total_xp
  ON user_progress(total_xp DESC);

CREATE INDEX IF NOT EXISTS idx_xp_weekly_week
  ON xp_weekly(week_id, xp_earned DESC);

CREATE INDEX IF NOT EXISTS idx_activity_feed_recent
  ON activity_feed(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_explorer_events_user
  ON explorer_events(user_id);

-- ============================================================
-- Triggers
-- ============================================================

-- Reuse the update_updated_at() function from course_engine migration
CREATE TRIGGER trg_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_xp_weekly_updated_at
  BEFORE UPDATE ON xp_weekly
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Functions
-- ============================================================

-- Global leaderboard: top users ranked by total XP
CREATE OR REPLACE FUNCTION get_leaderboard(limit_count INT DEFAULT 10)
RETURNS TABLE (
  user_id        UUID,
  display_name   TEXT,
  avatar_url     TEXT,
  total_xp       INTEGER,
  current_streak INTEGER,
  rank           BIGINT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    up.user_id,
    up.display_name,
    up.avatar_url,
    up.total_xp,
    up.current_streak,
    ROW_NUMBER() OVER (ORDER BY up.total_xp DESC, up.created_at ASC) AS rank
  FROM user_progress up
  WHERE up.total_xp > 0
  ORDER BY up.total_xp DESC, up.created_at ASC
  LIMIT limit_count;
$$;

-- Weekly leaderboard: top users for a specific ISO week
CREATE OR REPLACE FUNCTION get_weekly_leaderboard(target_week TEXT, limit_count INT DEFAULT 10)
RETURNS TABLE (
  user_id      UUID,
  display_name TEXT,
  avatar_url   TEXT,
  xp_earned    INTEGER,
  rank         BIGINT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    xw.user_id,
    up.display_name,
    up.avatar_url,
    xw.xp_earned,
    ROW_NUMBER() OVER (ORDER BY xw.xp_earned DESC, xw.updated_at ASC) AS rank
  FROM xp_weekly xw
  JOIN user_progress up ON up.user_id = xw.user_id
  WHERE xw.week_id = target_week
    AND xw.xp_earned > 0
  ORDER BY xw.xp_earned DESC, xw.updated_at ASC
  LIMIT limit_count;
$$;

-- Get a single user's global rank position
CREATE OR REPLACE FUNCTION get_user_rank(target_user_id UUID)
RETURNS TABLE (
  user_id        UUID,
  display_name   TEXT,
  total_xp       INTEGER,
  current_streak INTEGER,
  rank           BIGINT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    ranked.user_id,
    ranked.display_name,
    ranked.total_xp,
    ranked.current_streak,
    ranked.rank
  FROM (
    SELECT
      up.user_id,
      up.display_name,
      up.total_xp,
      up.current_streak,
      ROW_NUMBER() OVER (ORDER BY up.total_xp DESC, up.created_at ASC) AS rank
    FROM user_progress up
    WHERE up.total_xp > 0
  ) ranked
  WHERE ranked.user_id = target_user_id;
$$;

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE user_progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_weekly          ENABLE ROW LEVEL SECURITY;
ALTER TABLE explorer_events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed      ENABLE ROW LEVEL SECURITY;
ALTER TABLE unlocked_cosmetics ENABLE ROW LEVEL SECURITY;

-- Service role: full access on all tables
CREATE POLICY "Service role full access" ON user_progress
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON xp_weekly
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON explorer_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON activity_feed
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON unlocked_cosmetics
  FOR ALL USING (auth.role() = 'service_role');

-- user_progress: authenticated can read all (leaderboard), write own
CREATE POLICY "Anyone can view leaderboard" ON user_progress
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- xp_weekly: authenticated can read all (weekly leaderboard), write own
CREATE POLICY "Anyone can view weekly leaderboard" ON xp_weekly
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own weekly xp" ON xp_weekly
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly xp" ON xp_weekly
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- explorer_events: read/write own only
CREATE POLICY "Users can view own explorer events" ON explorer_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own explorer events" ON explorer_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own explorer events" ON explorer_events
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- activity_feed: read all (public feed), insert own only
CREATE POLICY "Anyone can view activity feed" ON activity_feed
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own activity" ON activity_feed
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- unlocked_cosmetics: read/write own only
CREATE POLICY "Users can view own cosmetics" ON unlocked_cosmetics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cosmetics" ON unlocked_cosmetics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

COMMIT;
