CREATE TABLE opening (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    eco_code VARCHAR(10),
    moves TEXT NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT false,
    user_id UUID REFERENCES app_user(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_opening_user_id ON opening(user_id);
CREATE INDEX idx_opening_is_public ON opening(is_public);
CREATE INDEX idx_opening_eco_code ON opening(eco_code);
