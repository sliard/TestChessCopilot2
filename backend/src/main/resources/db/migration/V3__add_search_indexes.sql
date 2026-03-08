-- V3 : Index pour la recherche d'ouvertures
-- Extension pg_trgm pour recherche partielle
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Index trigram pour recherche par nom (LIKE '%...')
CREATE INDEX idx_opening_name_trgm ON opening USING gin(name gin_trgm_ops);

-- Index prefix pour recherche par coups
CREATE INDEX idx_opening_moves_prefix ON opening(moves varchar_pattern_ops);

-- Index composite user_id + is_public
CREATE INDEX idx_opening_user_public ON opening(user_id, is_public);
