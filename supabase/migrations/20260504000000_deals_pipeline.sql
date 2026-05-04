-- Agent-to-Client (A2C) deal pipeline
-- Private to Charles and his agent (hello@charlesjackson.dev)

CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT,
  contact_name TEXT,
  contact_email TEXT,
  value NUMERIC(12, 2),
  currency TEXT NOT NULL DEFAULT 'CAD',
  stage TEXT NOT NULL DEFAULT 'lead'
    CHECK (stage IN ('lead', 'contacted', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  notes TEXT,
  source TEXT,
  deadline DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_deals_stage ON deals (stage);
CREATE INDEX idx_deals_created_by ON deals (created_by);

CREATE TRIGGER set_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pipeline users only" ON deals
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') IN (
      'charlesdotdirect@gmail.com',
      'hello@charlesjackson.dev'
    )
  )
  WITH CHECK (
    (auth.jwt() ->> 'email') IN (
      'charlesdotdirect@gmail.com',
      'hello@charlesjackson.dev'
    )
  );
