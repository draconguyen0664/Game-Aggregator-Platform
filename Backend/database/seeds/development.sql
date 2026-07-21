-- Development-only seed data. Never execute automatically in production.
INSERT INTO users (id, email, external_subject, display_name, status) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@game-aggregator.local', 'bootstrap-platform-admin', 'Platform Admin', 'ACTIVE')
ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), status = VALUES(status);

INSERT INTO roles (id, code, name, description) VALUES
('10000000-0000-0000-0000-000000000001', 'PLATFORM_ADMIN', 'Platform Administrator', 'Full platform administration'),
('10000000-0000-0000-0000-000000000002', 'STUDIO_ADMIN', 'Studio Administrator', 'Manages a studio and its games'),
('10000000-0000-0000-0000-000000000003', 'CLIENT_ADMIN', 'Client Administrator', 'Manages client integrations')
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description);

INSERT INTO permissions (id, code, description) VALUES
('20000000-0000-0000-0000-000000000001', 'platform.manage', 'Manage platform settings'),
('20000000-0000-0000-0000-000000000002', 'organization.manage', 'Manage organizations'),
('20000000-0000-0000-0000-000000000003', 'game.manage', 'Manage game catalog'),
('20000000-0000-0000-0000-000000000004', 'release.manage', 'Manage releases'),
('20000000-0000-0000-0000-000000000005', 'contract.manage', 'Manage commercial contracts')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT IGNORE INTO user_roles (user_id, role_id) VALUES
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001');

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT '10000000-0000-0000-0000-000000000001', id FROM permissions;

INSERT INTO organizations (id, organization_type, slug, display_name, status) VALUES
('30000000-0000-0000-0000-000000000001', 'PLATFORM', 'game-aggregator', 'Game Aggregator Platform', 'ACTIVE'),
('30000000-0000-0000-0000-000000000002', 'STUDIO', 'demo-studio', 'Demo Studio', 'ACTIVE'),
('30000000-0000-0000-0000-000000000003', 'PUBLISHER', 'demo-publisher', 'Demo Publisher', 'ACTIVE'),
('30000000-0000-0000-0000-000000000004', 'CLIENT', 'demo-client', 'Demo Client', 'ACTIVE')
ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), status = VALUES(status);

INSERT IGNORE INTO organization_memberships (organization_id, user_id, membership_role) VALUES
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'OWNER');

INSERT INTO games (id, publisher_organization_id, slug, title, description, status) VALUES
('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', 'demo-game', 'Demo Game', 'Development seed game', 'ACTIVE')
ON DUPLICATE KEY UPDATE title = VALUES(title), status = VALUES(status);

INSERT IGNORE INTO game_studios (game_id, studio_organization_id) VALUES
('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002');

INSERT INTO environments (id, code, display_name) VALUES
('50000000-0000-0000-0000-000000000001', 'SANDBOX', 'Sandbox'),
('50000000-0000-0000-0000-000000000002', 'PRODUCTION', 'Production')
ON DUPLICATE KEY UPDATE display_name = VALUES(display_name);
