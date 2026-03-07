-- V3 : Search performance indexes for the opening table
--
-- Adds specialized indexes to support text search and filtering patterns
-- that the standard B-tree indexes from V2 cannot cover efficiently.

-- ============================================================================
-- 1. Trigram index on name — enables fast LIKE '%query%' (leading wildcard)
--    The existing idx_opening_name (B-tree) only helps with prefix matches.
--    A GIN trigram index supports arbitrary substring matching.
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_opening_name_trgm
    ON opening USING gin(name gin_trgm_ops);

-- ============================================================================
-- 2. Pattern ops index on moves — enables fast LIKE 'e4 e5%' prefix searches
--    Uses varchar_pattern_ops for locale-independent prefix matching on moves.
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_opening_moves_prefix
    ON opening(moves varchar_pattern_ops);

-- ============================================================================
-- 3. Composite index on (user_id, is_public) — supports filtered queries
--    such as "show my private openings" or "show public openings by user X".
--    Covers the common WHERE user_id = ? AND is_public = ? pattern.
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_opening_user_public
    ON opening(user_id, is_public);
