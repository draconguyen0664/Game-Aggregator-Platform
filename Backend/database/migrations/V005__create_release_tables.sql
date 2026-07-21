CREATE TABLE environments (
    id CHAR(36) PRIMARY KEY,
    code ENUM('SANDBOX', 'PRODUCTION') NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    configuration JSON NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT uk_environments_code UNIQUE (code)
);

CREATE TABLE releases (
    id CHAR(36) PRIMARY KEY,
    game_id CHAR(36) NOT NULL,
    game_version_id CHAR(36) NOT NULL,
    release_status ENUM('DRAFT', 'APPROVED', 'PUBLISHED', 'ROLLED_BACK') NOT NULL DEFAULT 'DRAFT',
    release_notes TEXT NULL,
    approved_by CHAR(36) NULL,
    published_at TIMESTAMP(6) NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_releases_game FOREIGN KEY (game_id) REFERENCES games(id),
    CONSTRAINT fk_releases_version FOREIGN KEY (game_version_id) REFERENCES game_versions(id),
    CONSTRAINT fk_releases_approver FOREIGN KEY (approved_by) REFERENCES users(id)
);

CREATE TABLE deployments (
    id CHAR(36) PRIMARY KEY,
    release_id CHAR(36) NOT NULL,
    environment_id CHAR(36) NOT NULL,
    deployment_status ENUM('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'ROLLED_BACK') NOT NULL DEFAULT 'QUEUED',
    started_at TIMESTAMP(6) NULL,
    completed_at TIMESTAMP(6) NULL,
    details JSON NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_deployments_release FOREIGN KEY (release_id) REFERENCES releases(id),
    CONSTRAINT fk_deployments_environment FOREIGN KEY (environment_id) REFERENCES environments(id)
);
