-- Namespace pipeline tables with ac_ (Agent-to-Client) prefix
ALTER TABLE deals RENAME TO ac_deals;
ALTER TABLE deal_activity RENAME TO ac_deal_activity;
ALTER INDEX idx_deals_stage RENAME TO idx_ac_deals_stage;
ALTER INDEX idx_deals_created_by RENAME TO idx_ac_deals_created_by;
ALTER INDEX idx_deal_activity_deal_id RENAME TO idx_ac_deal_activity_deal_id;
ALTER INDEX idx_deal_activity_created_at RENAME TO idx_ac_deal_activity_created_at;
