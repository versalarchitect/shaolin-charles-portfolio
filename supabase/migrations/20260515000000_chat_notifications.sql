BEGIN;

CREATE TABLE IF NOT EXISTS chat_notifications (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID         NOT NULL,
  sender_id       UUID         NOT NULL,
  sender_name     TEXT         NOT NULL DEFAULT '',
  message_id      UUID         NOT NULL,
  channel_id      UUID         NOT NULL,
  channel_name    TEXT         NOT NULL DEFAULT '',
  message_preview TEXT         NOT NULL DEFAULT '',
  read            BOOLEAN      NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_notif_user
  ON chat_notifications(user_id, read, created_at DESC);

ALTER TABLE chat_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON chat_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert notifications"
  ON chat_notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own notifications"
  ON chat_notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE chat_notifications;

COMMIT;
