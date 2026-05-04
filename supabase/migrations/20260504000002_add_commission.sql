-- Variable agent commission (10–25%)
ALTER TABLE deals ADD COLUMN commission_pct NUMERIC(4, 1) NOT NULL DEFAULT 15
  CHECK (commission_pct >= 10 AND commission_pct <= 25);
