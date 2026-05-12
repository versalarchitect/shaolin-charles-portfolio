BEGIN;

CREATE TABLE IF NOT EXISTS simulation_runs (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email      text        NOT NULL,
  persona_level   text        NOT NULL CHECK (persona_level IN ('beginner', 'intermediate', 'advanced')),
  persona_name    text        NOT NULL,
  status          text        NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
  config          jsonb       NOT NULL DEFAULT '{}',
  report          jsonb,
  stats           jsonb,
  error           text,
  started_at      timestamptz NOT NULL DEFAULT now(),
  completed_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_simulation_runs_user ON simulation_runs(user_email);
CREATE INDEX idx_simulation_runs_status ON simulation_runs(status);
CREATE INDEX idx_simulation_runs_started ON simulation_runs(started_at DESC);

ALTER TABLE simulation_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON simulation_runs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin read own runs" ON simulation_runs
  FOR SELECT USING (
    auth.jwt() ->> 'email' = user_email
    AND (auth.jwt() ->> 'email') IN ('charlesdotdirect@gmail.com', 'hello@charlesjackson.dev', 'jay@charlesjackson.dev')
  );

CREATE POLICY "Admin insert own runs" ON simulation_runs
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'email' = user_email
    AND (auth.jwt() ->> 'email') IN ('charlesdotdirect@gmail.com', 'hello@charlesjackson.dev', 'jay@charlesjackson.dev')
  );

CREATE POLICY "Admin update own runs" ON simulation_runs
  FOR UPDATE USING (
    auth.jwt() ->> 'email' = user_email
    AND (auth.jwt() ->> 'email') IN ('charlesdotdirect@gmail.com', 'hello@charlesjackson.dev', 'jay@charlesjackson.dev')
  );

COMMIT;
