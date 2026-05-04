-- Activity log for deal pipeline + realtime sync

CREATE TABLE deal_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL,
  deal_title TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('created', 'stage_changed', 'updated', 'deleted')),
  from_stage TEXT,
  to_stage TEXT,
  details TEXT,
  actor_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_deal_activity_deal_id ON deal_activity (deal_id);
CREATE INDEX idx_deal_activity_created_at ON deal_activity (created_at DESC);

ALTER TABLE deal_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pipeline users only" ON deal_activity
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

-- Enable realtime for deals table
ALTER PUBLICATION supabase_realtime ADD TABLE deals;
