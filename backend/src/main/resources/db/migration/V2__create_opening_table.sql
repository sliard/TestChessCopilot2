-- V2 : Table opening pour les ouvertures d'échecs
CREATE TABLE opening (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    eco_code VARCHAR(10),
    moves TEXT,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    user_id UUID REFERENCES app_user(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX idx_opening_user_id ON opening(user_id);
CREATE INDEX idx_opening_is_public ON opening(is_public);
CREATE INDEX idx_opening_eco_code ON opening(eco_code);
