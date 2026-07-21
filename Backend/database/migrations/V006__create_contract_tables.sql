CREATE TABLE contracts (
    id CHAR(36) PRIMARY KEY,
    contract_number VARCHAR(100) NOT NULL,
    provider_organization_id CHAR(36) NOT NULL,
    client_organization_id CHAR(36) NOT NULL,
    status ENUM('DRAFT', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'TERMINATED') NOT NULL DEFAULT 'DRAFT',
    valid_from DATE NOT NULL,
    valid_until DATE NULL,
    terms JSON NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT uk_contracts_number UNIQUE (contract_number),
    CONSTRAINT fk_contracts_provider FOREIGN KEY (provider_organization_id) REFERENCES organizations(id),
    CONSTRAINT fk_contracts_client FOREIGN KEY (client_organization_id) REFERENCES organizations(id)
);

CREATE TABLE contract_games (
    contract_id CHAR(36) NOT NULL,
    game_id CHAR(36) NOT NULL,
    commercial_terms JSON NULL,
    PRIMARY KEY (contract_id, game_id),
    CONSTRAINT fk_contract_games_contract FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    CONSTRAINT fk_contract_games_game FOREIGN KEY (game_id) REFERENCES games(id)
);
