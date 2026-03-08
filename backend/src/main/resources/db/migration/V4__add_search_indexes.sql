-- Feature 006: Search & filtering indexes
-- Adds optimized indexes for multi-criteria search on openings

-- Trigram extension for partial text matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Replace basic B-tree index with trigram GIN index for name search
DROP INDEX IF EXISTS idx_opening_name;
CREATE INDEX idx_opening_name_trgm ON opening USING gin (name gin_trgm_ops);

-- Index for ECO code prefix search
CREATE INDEX idx_opening_eco_code ON opening (eco_code);

-- Index for moves prefix search
CREATE INDEX idx_opening_moves_prefix ON opening (moves varchar_pattern_ops);

-- Composite index for user + visibility filtering
CREATE INDEX idx_opening_user_public ON opening (user_id, is_public);
