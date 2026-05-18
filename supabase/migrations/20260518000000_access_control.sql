-- Access control: tiers, beta codes, enrollments, and RPC functions

-- 1. Add access_tier to user_progress
ALTER TABLE user_progress
  ADD COLUMN IF NOT EXISTS access_tier TEXT NOT NULL DEFAULT 'none'
  CHECK (access_tier IN ('none', 'beta', 'paid', 'admin'));

CREATE INDEX IF NOT EXISTS idx_user_progress_tier ON user_progress(access_tier);

-- 2. Enrollments table (Stripe audit trail)
CREATE TABLE IF NOT EXISTS enrollments (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email                   TEXT,
  stripe_session_id       TEXT        UNIQUE,
  stripe_payment_intent_id TEXT,
  amount                  INTEGER,
  status                  TEXT        NOT NULL DEFAULT 'completed',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on enrollments"
  ON enrollments FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Users can read own enrollments"
  ON enrollments FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 3. Beta codes table
CREATE TABLE IF NOT EXISTS beta_codes (
  code         TEXT        PRIMARY KEY,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  redeemed_by  UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  redeemed_at  TIMESTAMPTZ
);

ALTER TABLE beta_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on beta_codes"
  ON beta_codes FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 4. get_access_tier() — returns the caller's access tier
CREATE OR REPLACE FUNCTION get_access_tier()
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER STABLE
AS $$
DECLARE
  v_tier TEXT;
  v_email TEXT;
BEGIN
  v_email := auth.jwt()->>'email';

  IF v_email IN ('charles@predictive.company', 'charlesdotdirect@gmail.com') THEN
    RETURN 'admin';
  END IF;

  SELECT access_tier INTO v_tier FROM user_progress WHERE user_id = auth.uid();
  RETURN COALESCE(v_tier, 'none');
END;
$$;

-- 5. check_lesson_access(lesson_id) — returns boolean
CREATE OR REPLACE FUNCTION check_lesson_access(p_lesson_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER STABLE
AS $$
DECLARE
  v_tier TEXT;
  v_email TEXT;
  v_required_tier TEXT;
BEGIN
  v_email := auth.jwt()->>'email';

  IF v_email IN ('charles@predictive.company', 'charlesdotdirect@gmail.com') THEN
    RETURN TRUE;
  END IF;

  SELECT access_tier INTO v_tier FROM user_progress WHERE user_id = auth.uid();
  v_tier := COALESCE(v_tier, 'none');

  -- Map lesson ID to required tier
  IF p_lesson_id LIKE 'p%' OR p_lesson_id LIKE '1-%' THEN
    v_required_tier := 'beta';
  ELSE
    v_required_tier := 'paid';
  END IF;

  IF v_tier = 'admin' THEN RETURN TRUE; END IF;
  IF v_tier = 'paid' THEN RETURN TRUE; END IF;
  IF v_tier = 'beta' AND v_required_tier = 'beta' THEN RETURN TRUE; END IF;

  RETURN FALSE;
END;
$$;

-- 6. redeem_beta_code(code) — atomic code redemption
CREATE OR REPLACE FUNCTION redeem_beta_code(p_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_claimed BOOLEAN;
BEGIN
  -- Atomic claim: only succeeds if code exists and is unredeemed
  UPDATE beta_codes
  SET redeemed_by = v_user_id, redeemed_at = now()
  WHERE code = p_code AND redeemed_by IS NULL;

  v_claimed := FOUND;

  IF NOT v_claimed THEN
    RETURN FALSE;
  END IF;

  -- Upgrade to beta (don't downgrade paid/admin)
  INSERT INTO user_progress (user_id, state, access_tier)
  VALUES (v_user_id, '{}', 'beta')
  ON CONFLICT (user_id) DO UPDATE
  SET access_tier = CASE
    WHEN user_progress.access_tier IN ('paid', 'admin') THEN user_progress.access_tier
    ELSE 'beta'
  END;

  RETURN TRUE;
END;
$$;
