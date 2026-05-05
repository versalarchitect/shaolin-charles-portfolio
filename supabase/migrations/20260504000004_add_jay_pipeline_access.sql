-- Grant jay@charlesjackson.dev pipeline access (same as hello@charlesjackson.dev)

-- deals table
DROP POLICY "Pipeline users only" ON ac_deals;
CREATE POLICY "Pipeline users only" ON ac_deals
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') IN (
      'charlesdotdirect@gmail.com',
      'hello@charlesjackson.dev',
      'jay@charlesjackson.dev'
    )
  )
  WITH CHECK (
    (auth.jwt() ->> 'email') IN (
      'charlesdotdirect@gmail.com',
      'hello@charlesjackson.dev',
      'jay@charlesjackson.dev'
    )
  );

-- deal_activity table
DROP POLICY "Pipeline users only" ON ac_deal_activity;
CREATE POLICY "Pipeline users only" ON ac_deal_activity
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') IN (
      'charlesdotdirect@gmail.com',
      'hello@charlesjackson.dev',
      'jay@charlesjackson.dev'
    )
  )
  WITH CHECK (
    (auth.jwt() ->> 'email') IN (
      'charlesdotdirect@gmail.com',
      'hello@charlesjackson.dev',
      'jay@charlesjackson.dev'
    )
  );
