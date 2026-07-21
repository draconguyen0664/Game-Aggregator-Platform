CREATE TABLE api_keys (
    id CHAR(36) PRIMARY KEY,
    organization_id CHAR(36) NOT NULL,
    key_prefix VARCHAR(32) NOT NULL,
    secret_hash VARCHAR(255) NOT NULL,
    name VARCHAR(150) NOT NULL,
    environment ENUM('SANDBOX', 'PRODUCTION') NOT NULL,
    scopes JSON NOT NULL,
    last_used_at TIMESTAMP(6) NULL,
    expires_at TIMESTAMP(6) NULL,
    revoked_at TIMESTAMP(6) NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT uk_api_keys_prefix UNIQUE (key_prefix),
    CONSTRAINT fk_api_keys_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

CREATE INDEX idx_api_keys_organization_environment ON api_keys (organization_id, environment);
