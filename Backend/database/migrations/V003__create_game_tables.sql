CREATE TABLE games (
    id CHAR(36) PRIMARY KEY,
    publisher_organization_id CHAR(36) NOT NULL,
    slug VARCHAR(160) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status ENUM('DRAFT', 'REVIEW', 'ACTIVE', 'SUSPENDED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    configuration JSON NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT uk_games_slug UNIQUE (slug),
    CONSTRAINT fk_games_publisher FOREIGN KEY (publisher_organization_id) REFERENCES organizations(id)
);

CREATE TABLE game_studios (
    game_id CHAR(36) NOT NULL,
    studio_organization_id CHAR(36) NOT NULL,
    PRIMARY KEY (game_id, studio_organization_id),
    CONSTRAINT fk_game_studios_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    CONSTRAINT fk_game_studios_studio FOREIGN KEY (studio_organization_id) REFERENCES organizations(id)
);

CREATE TABLE game_versions (
    id CHAR(36) PRIMARY KEY,
    game_id CHAR(36) NOT NULL,
    version_name VARCHAR(100) NOT NULL,
    artifact_uri VARCHAR(1000) NULL,
    checksum_sha256 CHAR(64) NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT uk_game_versions UNIQUE (game_id, version_name),
    CONSTRAINT fk_game_versions_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);
