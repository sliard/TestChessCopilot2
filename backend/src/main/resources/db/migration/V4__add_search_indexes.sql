CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_opening_name_trgm ON opening USING gin(name gin_trgm_ops);
CREATE INDEX idx_opening_moves_prefix ON opening(moves varchar_pattern_ops);
CREATE INDEX idx_opening_user_public ON opening(user_id, is_public);
