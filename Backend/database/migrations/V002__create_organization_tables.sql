CREATE TABLE organizations (
    id CHAR(36) PRIMARY KEY,
    organization_type ENUM('PLATFORM', 'STUDIO', 'PUBLISHER', 'CLIENT') NOT NULL,
    slug VARCHAR(120) NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    status ENUM('ACTIVE', 'SUSPENDED', 'CLOSED') NOT NULL DEFAULT 'ACTIVE',
    metadata JSON NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT uk_organizations_slug UNIQUE (slug)
);

CREATE TABLE organization_memberships (
    organization_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    membership_role VARCHAR(100) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (organization_id, user_id),
    CONSTRAINT fk_memberships_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    CONSTRAINT fk_memberships_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
