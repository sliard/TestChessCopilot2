---
name: backend-migration
description: Generate database migrations with Flyway for Spring Boot 3.4.x and PostgreSQL 16. Use this when asked to create SQL migrations, schema changes, or database versioning.
---

# Database Migration Generation

Generate Flyway migrations following project conventions for Spring Boot 3.4.x with PostgreSQL 16.

## Required Dependencies

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>
</dependency>
```

## Configuration

```yaml
# application.yml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
    validate-on-migrate: true
```

## File Location

```
src/main/resources/
└── db/
    └── migration/
        ├── V1__create_app_user_table.sql
        ├── V2__create_product_table.sql
        ├── V3__add_category_to_product.sql
        └── R__seed_data.sql  (repeatable)
```

## Table Naming Convention

- **Singulier** snake_case : `product`, `category`, `order_item`, `app_user`
- ⚠️ Éviter les mots réservés PostgreSQL : `app_user` (pas `user`), `customer_order` (pas `order`)

## Naming Convention

```
V{version}__{description}.sql    # Versioned migration
R__{description}.sql             # Repeatable migration (re-run on change)
```

- Version: Sequential number (1, 2, 3...) or timestamp (20240115100000)
- Description: snake_case describing the change
- Double underscore `__` separates version from description

## Create Table Migration

```sql
-- V1__create_app_user_table.sql
CREATE TABLE app_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_app_user_email ON app_user(email);
CREATE INDEX idx_app_user_role ON app_user(role);

-- Comments
COMMENT ON TABLE app_user IS 'Application users';
COMMENT ON COLUMN app_user.email IS 'Unique email address for authentication';
```

## Create Table with Relations

```sql
-- V2__create_product_table.sql
CREATE TABLE category (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    category_id UUID REFERENCES category(id) ON DELETE SET NULL,
    created_by UUID REFERENCES app_user(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_product_name ON product(name);
CREATE INDEX idx_product_category ON product(category_id);
CREATE INDEX idx_product_price ON product(price);
```

## Add Column Migration

```sql
-- V3__add_image_url_to_product.sql
ALTER TABLE product 
ADD COLUMN image_url VARCHAR(500);

COMMENT ON COLUMN product.image_url IS 'URL of the product image';
```

## Add Column with Default and Backfill

```sql
-- V4__add_status_to_product.sql
-- Add column with default
ALTER TABLE product 
ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'DRAFT';

-- Backfill existing data
UPDATE product SET status = 'PUBLISHED' WHERE stock > 0;

-- Add index
CREATE INDEX idx_product_status ON product(status);

-- Add constraint
ALTER TABLE product 
ADD CONSTRAINT chk_product_status 
CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED'));
```

## Rename Column

```sql
-- V5__rename_product_description.sql
ALTER TABLE product 
RENAME COLUMN description TO short_description;

ALTER TABLE product 
ADD COLUMN long_description TEXT;
```

## Create Join Table (Many-to-Many)

```sql
-- V6__create_product_tag.sql
CREATE TABLE tag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_tag (
    product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tag(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
);

CREATE INDEX idx_product_tag_product ON product_tag(product_id);
CREATE INDEX idx_product_tag_tag ON product_tag(tag_id);
```

## Create Enum Type

```sql
-- V7__create_order_status_enum.sql
CREATE TYPE order_status AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);

CREATE TABLE customer_order (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app_user(id),
    status order_status NOT NULL DEFAULT 'PENDING',
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Add Index Migration

```sql
-- V8__add_search_indexes.sql
-- Full text search index
CREATE INDEX idx_product_search ON product 
USING GIN (to_tsvector('french', name || ' ' || COALESCE(short_description, '')));

-- Partial index
CREATE INDEX idx_product_published ON product(created_at) 
WHERE status = 'PUBLISHED';

-- Composite index
CREATE INDEX idx_product_category_price ON product(category_id, price DESC);
```

## Drop Column (with safety)

```sql
-- V9__remove_deprecated_column.sql
-- First, check if column exists to avoid errors in edge cases
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'product' AND column_name = 'old_column'
    ) THEN
        ALTER TABLE product DROP COLUMN old_column;
    END IF;
END $$;
```

## Add Constraint

```sql
-- V10__add_unique_constraint.sql
-- Unique constraint
ALTER TABLE product 
ADD CONSTRAINT uq_product_name_category 
UNIQUE (name, category_id);

-- Check constraint
ALTER TABLE app_user 
ADD CONSTRAINT chk_app_user_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
```

## Seed Data (Repeatable)

```sql
-- R__seed_category.sql
-- This will run every time the checksum changes

INSERT INTO category (id, name, description)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Electronics', 'Electronic devices and gadgets'),
    ('22222222-2222-2222-2222-222222222222', 'Clothing', 'Apparel and accessories'),
    ('33333333-3333-3333-3333-333333333333', 'Books', 'Books and publications')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = CURRENT_TIMESTAMP;
```

## Data Migration

```sql
-- V11__migrate_app_user_names.sql
-- Split full_name into first_name and last_name

-- Add new columns
ALTER TABLE app_user ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE app_user ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

-- Migrate data
UPDATE app_user 
SET 
    first_name = split_part(full_name, ' ', 1),
    last_name = CASE 
        WHEN position(' ' in full_name) > 0 
        THEN substring(full_name from position(' ' in full_name) + 1)
        ELSE NULL
    END
WHERE full_name IS NOT NULL;

-- Drop old column (in a separate migration for safety)
-- ALTER TABLE app_user DROP COLUMN full_name;
```

## Rollback Considerations

Flyway Community doesn't support automatic rollback. Create manual undo scripts:

```sql
-- U11__undo_migrate_app_user_names.sql (manual, not executed by Flyway)
ALTER TABLE app_user ADD COLUMN IF NOT EXISTS full_name VARCHAR(200);

UPDATE app_user 
SET full_name = TRIM(COALESCE(first_name, '') || ' ' || COALESCE(last_name, ''))
WHERE first_name IS NOT NULL OR last_name IS NOT NULL;

ALTER TABLE app_user DROP COLUMN first_name;
ALTER TABLE app_user DROP COLUMN last_name;
```

## Best Practices

1. **One change per migration** - Easier to track and debug
2. **Test migrations** - Run on a copy of production data
3. **Never modify** existing migrations - Create new ones instead
4. **Include comments** - Document complex migrations
5. **Use transactions** - PostgreSQL migrations are transactional by default
6. **Index separately** - Large index creations can be in separate migrations
7. **Consider downtime** - Some operations lock tables
8. **Tables au singulier** - `product` (pas `products`), `category` (pas `categories`)
9. **Mots réservés** - Préfixer si nécessaire : `app_user`, `customer_order`

## PostgreSQL-Specific Features

```sql
-- Generate UUID
DEFAULT gen_random_uuid()

-- Timestamp with timezone
TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

-- JSON columns
data JSONB NOT NULL DEFAULT '{}'::jsonb

-- Array columns
tags TEXT[] DEFAULT '{}'::text[]

-- Full text search
CREATE INDEX idx_search USING GIN (to_tsvector('french', content))
```
