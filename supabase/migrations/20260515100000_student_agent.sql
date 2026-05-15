BEGIN;

CREATE TABLE IF NOT EXISTS student_agent_state (
  id         TEXT PRIMARY KEY DEFAULT 'singleton',
  state      JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE student_agent_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON student_agent_state
  FOR ALL USING (auth.role() = 'service_role');

COMMIT;
