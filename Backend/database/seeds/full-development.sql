-- Full idempotent development dataset for all web portals.
-- Run only against local/development databases.
SET @tenant_a = UUID_TO_BIN('10000000-0000-0000-0000-000000000001');
SET @tenant_b = UUID_TO_BIN('10000000-0000-0000-0000-000000000002');
SET @admin = UUID_TO_BIN('00000000-0000-0000-0000-000000000001');
SET @studio_a = UUID_TO_BIN('20000000-0000-0000-0000-000000000001');
SET @studio_b = UUID_TO_BIN('20000000-0000-0000-0000-000000000002');
SET @publisher_a = UUID_TO_BIN('30000000-0000-0000-0000-000000000001');
SET @publisher_b = UUID_TO_BIN('30000000-0000-0000-0000-000000000002');
SET @client_org_a = UUID_TO_BIN('40000000-0000-0000-0000-000000000001');
SET @client_org_b = UUID_TO_BIN('40000000-0000-0000-0000-000000000002');
SET @app_web = UUID_TO_BIN('41000000-0000-0000-0000-000000000001');
SET @app_mobile = UUID_TO_BIN('41000000-0000-0000-0000-000000000002');
SET @app_partner = UUID_TO_BIN('41000000-0000-0000-0000-000000000003');
SET @env_sandbox = UUID_TO_BIN('42000000-0000-0000-0000-000000000001');
SET @env_prod = UUID_TO_BIN('42000000-0000-0000-0000-000000000002');
SET @env_mobile = UUID_TO_BIN('42000000-0000-0000-0000-000000000003');
SET @game_a = UUID_TO_BIN('50000000-0000-0000-0000-000000000001');
SET @game_b = UUID_TO_BIN('50000000-0000-0000-0000-000000000002');
SET @game_c = UUID_TO_BIN('50000000-0000-0000-0000-000000000003');
SET @game_d = UUID_TO_BIN('50000000-0000-0000-0000-000000000004');
SET @version_a = UUID_TO_BIN('51000000-0000-0000-0000-000000000001');
SET @version_b = UUID_TO_BIN('51000000-0000-0000-0000-000000000002');
SET @version_c = UUID_TO_BIN('51000000-0000-0000-0000-000000000003');
SET @build_a = UUID_TO_BIN('52000000-0000-0000-0000-000000000001');
SET @build_b = UUID_TO_BIN('52000000-0000-0000-0000-000000000002');
SET @build_c = UUID_TO_BIN('52000000-0000-0000-0000-000000000003');
SET @release_a = UUID_TO_BIN('53000000-0000-0000-0000-000000000001');
SET @release_b = UUID_TO_BIN('53000000-0000-0000-0000-000000000002');
SET @contract_a = UUID_TO_BIN('60000000-0000-0000-0000-000000000001');

USE tenant_service;
INSERT INTO tenants(id,slug,name,status,created_at,updated_at) VALUES
(@tenant_a,'northwind-games','Northwind Games','ACTIVE',NOW(6),NOW(6)),
(@tenant_b,'atlas-publishing','Atlas Publishing','ACTIVE',NOW(6),NOW(6))
ON DUPLICATE KEY UPDATE name=VALUES(name),status=VALUES(status),updated_at=NOW(6);
INSERT INTO organizations(id,tenant_id,slug,name,type,created_at,updated_at) VALUES
(@studio_a,@tenant_a,'aurora-studio','Aurora Studio','STUDIO',NOW(6),NOW(6)),
(@studio_b,@tenant_b,'pixel-forge','Pixel Forge','STUDIO',NOW(6),NOW(6)),
(@publisher_a,@tenant_a,'northwind-publishing','Northwind Publishing','PUBLISHER',NOW(6),NOW(6)),
(@client_org_a,@tenant_a,'nova-client','Nova Interactive','CLIENT',NOW(6),NOW(6))
ON DUPLICATE KEY UPDATE name=VALUES(name),type=VALUES(type),updated_at=NOW(6);
INSERT INTO tenant_members(id,tenant_id,user_id,status,created_at,updated_at) VALUES
(UUID_TO_BIN('11000000-0000-0000-0000-000000000001'),@tenant_a,@admin,'ACTIVE',NOW(6),NOW(6))
ON DUPLICATE KEY UPDATE status='ACTIVE',updated_at=NOW(6);

USE studio_service;
INSERT INTO studios(id,tenant_id,slug,name,owner_user_id,status,settings,created_at) VALUES
(@studio_a,@tenant_a,'aurora-studio','Aurora Studio',@admin,'ACTIVE','{"timezone":"Asia/Bangkok","defaultRegion":"APAC"}',NOW(6)),
(@studio_b,@tenant_b,'pixel-forge','Pixel Forge',@admin,'ACTIVE','{"timezone":"UTC","defaultRegion":"GLOBAL"}',NOW(6))
ON DUPLICATE KEY UPDATE name=VALUES(name),status=VALUES(status),settings=VALUES(settings);
INSERT INTO studio_members(id,studio_id,user_id,email,role,state,invite_token,expires_at) VALUES
(UUID_TO_BIN('21000000-0000-0000-0000-000000000001'),@studio_a,@admin,'admin@game-aggregator.local','OWNER','ACTIVE',NULL,NULL),
(UUID_TO_BIN('21000000-0000-0000-0000-000000000002'),@studio_a,NULL,'producer@aurora.example','PRODUCER','INVITED','development-invite-token',DATE_ADD(NOW(6),INTERVAL 7 DAY)),
(UUID_TO_BIN('21000000-0000-0000-0000-000000000003'),@studio_b,NULL,'developer@pixelforge.example','DEVELOPER','ACTIVE',NULL,NULL)
ON DUPLICATE KEY UPDATE role=VALUES(role),state=VALUES(state);
INSERT INTO studio_contacts(id,studio_id,type,value,primary_contact) VALUES
(UUID_TO_BIN('22000000-0000-0000-0000-000000000001'),@studio_a,'EMAIL','hello@aurora.example',1),
(UUID_TO_BIN('22000000-0000-0000-0000-000000000002'),@studio_a,'DISCORD','aurora-games',0)
ON DUPLICATE KEY UPDATE value=VALUES(value),primary_contact=VALUES(primary_contact);

USE publisher_service;
INSERT INTO publishers(id,tenant_id,slug,name,owner_user_id) VALUES
(@publisher_a,@tenant_a,'northwind-publishing','Northwind Publishing',@admin),
(@publisher_b,@tenant_b,'atlas-publishing','Atlas Publishing',@admin)
ON DUPLICATE KEY UPDATE name=VALUES(name),owner_user_id=VALUES(owner_user_id);
INSERT INTO publisher_team(id,publisher_id,user_id,role) VALUES
(UUID_TO_BIN('31000000-0000-0000-0000-000000000001'),@publisher_a,@admin,'OWNER')
ON DUPLICATE KEY UPDATE role=VALUES(role);

USE client_service;
INSERT INTO client_organizations(id,tenant_id,slug,name) VALUES
(@client_org_a,@tenant_a,'nova-interactive','Nova Interactive'),
(@client_org_b,@tenant_b,'orbit-distribution','Orbit Distribution')
ON DUPLICATE KEY UPDATE name=VALUES(name);
INSERT INTO client_applications(id,organization_id,name,client_key,integration_status) VALUES
(@app_web,@client_org_a,'Nova Web Store','nova-web-store','ACTIVE'),
(@app_mobile,@client_org_a,'Nova Mobile','nova-mobile','TESTING'),
(@app_partner,@client_org_b,'Orbit Partner API','orbit-partner-api','PENDING')
ON DUPLICATE KEY UPDATE name=VALUES(name),integration_status=VALUES(integration_status);
INSERT INTO client_environments(id,application_id,name,state) VALUES
(@env_sandbox,@app_web,'SANDBOX','ACTIVE'),
(@env_prod,@app_web,'PRODUCTION','ACTIVE'),
(@env_mobile,@app_mobile,'SANDBOX','ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name),state=VALUES(state);
INSERT INTO client_allowlist(id,environment_id,type,value) VALUES
(UUID_TO_BIN('43000000-0000-0000-0000-000000000001'),@env_prod,'IP','203.0.113.10'),
(UUID_TO_BIN('43000000-0000-0000-0000-000000000002'),@env_prod,'DOMAIN','games.nova.example'),
(UUID_TO_BIN('43000000-0000-0000-0000-000000000003'),@env_sandbox,'IP','127.0.0.1')
ON DUPLICATE KEY UPDATE type=VALUES(type),value=VALUES(value);
INSERT INTO client_entitlements(id,application_id,game_id,territory,expires_at) VALUES
(UUID_TO_BIN('44000000-0000-0000-0000-000000000001'),@app_web,@game_a,'GLOBAL','2027-12-31 23:59:59.000000'),
(UUID_TO_BIN('44000000-0000-0000-0000-000000000002'),@app_web,@game_b,'APAC','2027-06-30 23:59:59.000000'),
(UUID_TO_BIN('44000000-0000-0000-0000-000000000003'),@app_mobile,@game_a,'SEA','2027-12-31 23:59:59.000000')
ON DUPLICATE KEY UPDATE territory=VALUES(territory),expires_at=VALUES(expires_at);

USE game_service;
INSERT INTO games(id,studio_id,publisher_id,slug,title,metadata,visibility,status,age_rating,created_at) VALUES
(@game_a,@studio_a,@publisher_a,'sky-realms','Sky Realms','{"genre":"RPG","platforms":["PC","Console"],"languages":["en","vi"]}','PUBLIC','ACTIVE','T',NOW(6)),
(@game_b,@studio_a,@publisher_a,'neon-racers','Neon Racers','{"genre":"Racing","platforms":["PC","Mobile"],"languages":["en","ja"]}','PUBLIC','ACTIVE','E10+',NOW(6)),
(@game_c,@studio_b,@publisher_b,'echo-tactics','Echo Tactics','{"genre":"Strategy","platforms":["PC"],"languages":["en"]}','UNLISTED','ACTIVE','T',NOW(6)),
(@game_d,@studio_b,NULL,'project-orbit','Project Orbit','{"genre":"Adventure","platforms":["PC"]}','PRIVATE','DRAFT','RP',NOW(6))
ON DUPLICATE KEY UPDATE title=VALUES(title),metadata=VALUES(metadata),visibility=VALUES(visibility),status=VALUES(status);
INSERT INTO taxonomies(id,type,code,name) VALUES
(UUID_TO_BIN('50100000-0000-0000-0000-000000000001'),'GENRE','rpg','Role Playing'),
(UUID_TO_BIN('50100000-0000-0000-0000-000000000002'),'GENRE','racing','Racing'),
(UUID_TO_BIN('50100000-0000-0000-0000-000000000003'),'PLATFORM','pc','PC')
ON DUPLICATE KEY UPDATE name=VALUES(name);
INSERT IGNORE INTO game_taxonomies(id,game_id,taxonomy_id) VALUES
(UUID_TO_BIN('50200000-0000-0000-0000-000000000001'),@game_a,UUID_TO_BIN('50100000-0000-0000-0000-000000000001')),
(UUID_TO_BIN('50200000-0000-0000-0000-000000000002'),@game_b,UUID_TO_BIN('50100000-0000-0000-0000-000000000002'));

USE game_media_service;
INSERT INTO game_media(id,game_id,type,object_key,content_type,size_bytes,status,created_at) VALUES
(UUID_TO_BIN('50500000-0000-0000-0000-000000000001'),@game_a,'THUMBNAIL','development/sky-realms/thumbnail.webp','image/webp',184320,'READY',NOW(6)),
(UUID_TO_BIN('50500000-0000-0000-0000-000000000002'),@game_a,'TRAILER','development/sky-realms/trailer.mp4','video/mp4',15728640,'READY',NOW(6)),
(UUID_TO_BIN('50500000-0000-0000-0000-000000000003'),@game_b,'BANNER','development/neon-racers/banner.webp','image/webp',524288,'READY',NOW(6))
ON DUPLICATE KEY UPDATE object_key=VALUES(object_key),status=VALUES(status);

USE version_service;
INSERT INTO game_versions(id,game_id,semantic_version,status,changelog,compatibility_json,supported_platforms_json,minimum_client_version,created_at,revision) VALUES
(@version_a,@game_a,'1.4.0','RELEASED','New region and performance improvements','{"saveFormat":"4"}','["windows","playstation","xbox"]','1.2.0',NOW(6),1),
(@version_b,@game_a,'1.5.0-beta.2','TESTING','Guild raids beta','{"saveFormat":"5"}','["windows"]','1.4.0',NOW(6),1),
(@version_c,@game_b,'2.1.0','APPROVED','New cars and city circuit','{"protocol":"2"}','["windows","android","ios"]','2.0.0',NOW(6),1)
ON DUPLICATE KEY UPDATE status=VALUES(status),changelog=VALUES(changelog),revision=revision+1;

USE build_service;
INSERT INTO game_builds(id,version_id,uploaded_by,metadata_json,status,artifact_key,checksum_sha256,file_size,content_type,created_at,revision) VALUES
(@build_a,@version_a,@admin,'{"runner":"github-actions","commit":"a1b2c3d"}','SUCCEEDED','builds/sky-realms/1.4.0/windows.zip',REPEAT('a',64),2147483648,'application/zip',NOW(6),1),
(@build_b,@version_b,@admin,'{"runner":"github-actions","commit":"e4f5a6b"}','RUNNING',NULL,NULL,0,NULL,NOW(6),1),
(@build_c,@version_c,@admin,'{"runner":"github-actions","commit":"b7c8d9e"}','FAILED',NULL,NULL,0,NULL,NOW(6),1)
ON DUPLICATE KEY UPDATE status=VALUES(status),metadata_json=VALUES(metadata_json),revision=revision+1;
INSERT INTO build_logs(id,build_id,level,message,created_at) VALUES
(UUID_TO_BIN('52100000-0000-0000-0000-000000000001'),@build_a,'INFO','Build and checksum completed',NOW(6)),
(UUID_TO_BIN('52100000-0000-0000-0000-000000000002'),@build_b,'INFO','Compiling game assets',NOW(6)),
(UUID_TO_BIN('52100000-0000-0000-0000-000000000003'),@build_c,'ERROR','Automated integration test failed',NOW(6))
ON DUPLICATE KEY UPDATE level=VALUES(level),message=VALUES(message);

USE release_service;
INSERT INTO releases(id,game_id,version_id,build_id,channel,status,release_notes,created_by,approved_by,approved_at,released_at,rollback_of_release_id,created_at,revision) VALUES
(@release_a,@game_a,@version_a,@build_a,'PRODUCTION','RELEASED','Sky Realms 1.4 global release',@admin,@admin,DATE_SUB(NOW(6),INTERVAL 5 DAY),DATE_SUB(NOW(6),INTERVAL 4 DAY),NULL,NOW(6),1),
(@release_b,@game_a,@version_b,@build_b,'SANDBOX','IN_REVIEW','Guild raids beta candidate',@admin,NULL,NULL,NULL,NULL,NOW(6),1)
ON DUPLICATE KEY UPDATE status=VALUES(status),release_notes=VALUES(release_notes),revision=revision+1;
INSERT INTO release_decisions(id,release_id,actor_id,decision,comment,created_at) VALUES
(UUID_TO_BIN('53100000-0000-0000-0000-000000000001'),@release_a,@admin,'APPROVED','QA and compliance checks passed',DATE_SUB(NOW(6),INTERVAL 5 DAY))
ON DUPLICATE KEY UPDATE decision=VALUES(decision),comment=VALUES(comment);

USE deployment_service;
INSERT INTO deployments(id,release_id,environment_id,status,requested_by,created_at,started_at,finished_at,revision) VALUES
(UUID_TO_BIN('54000000-0000-0000-0000-000000000001'),@release_a,@env_prod,'SUCCEEDED',@admin,DATE_SUB(NOW(6),INTERVAL 4 DAY),DATE_SUB(NOW(6),INTERVAL 4 DAY),DATE_SUB(NOW(6),INTERVAL 4 DAY),1),
(UUID_TO_BIN('54000000-0000-0000-0000-000000000002'),@release_b,@env_sandbox,'RUNNING',@admin,NOW(6),NOW(6),NULL,1)
ON DUPLICATE KEY UPDATE status=VALUES(status),finished_at=VALUES(finished_at),revision=revision+1;
INSERT INTO deployment_events(id,deployment_id,from_status,to_status,actor_id,message,created_at) VALUES
(UUID_TO_BIN('54100000-0000-0000-0000-000000000001'),UUID_TO_BIN('54000000-0000-0000-0000-000000000001'),'RUNNING','SUCCEEDED',@admin,'Production rollout completed',DATE_SUB(NOW(6),INTERVAL 4 DAY)),
(UUID_TO_BIN('54100000-0000-0000-0000-000000000002'),UUID_TO_BIN('54000000-0000-0000-0000-000000000002'),'QUEUED','RUNNING',@admin,'Sandbox deployment started',NOW(6))
ON DUPLICATE KEY UPDATE message=VALUES(message);

USE api_key_service;
INSERT INTO api_keys(id,tenant_id,client_id,environment_id,key_hash,key_prefix,last_four,scopes_json,ip_allowlist_json,quota,status,expires_at,revoked_at,created_at,rotated_at,version) VALUES
(UUID_TO_BIN('55000000-0000-0000-0000-000000000001'),@tenant_a,@app_web,@env_prod,REPEAT('1',64),'gak_live','A91F','["game:read","release:read"]','["203.0.113.10"]',1000000,'ACTIVE','2027-12-31 23:59:59.000000',NULL,NOW(6),NULL,1),
(UUID_TO_BIN('55000000-0000-0000-0000-000000000002'),@tenant_a,@app_web,@env_sandbox,REPEAT('2',64),'gak_test','7C2D','["game:read","release:read","build:read"]','["127.0.0.1"]',100000,'ACTIVE','2027-06-30 23:59:59.000000',NULL,NOW(6),NULL,1),
(UUID_TO_BIN('55000000-0000-0000-0000-000000000003'),@tenant_a,@app_mobile,@env_mobile,REPEAT('3',64),'gak_test','42BE','["game:read"]','[]',50000,'REVOKED',NULL,NOW(6),NOW(6),NULL,2)
ON DUPLICATE KEY UPDATE scopes_json=VALUES(scopes_json),quota=VALUES(quota),status=VALUES(status),version=version+1;

USE entitlement_service;
INSERT INTO entitlements(id,client_id,game_id,environment_id,region,start_date,end_date,status,contract_reference,version) VALUES
(UUID_TO_BIN('56000000-0000-0000-0000-000000000001'),@app_web,@game_a,@env_prod,'GLOBAL','2026-01-01','2027-12-31','ACTIVE','CTR-2026-001',1),
(UUID_TO_BIN('56000000-0000-0000-0000-000000000002'),@app_web,@game_b,@env_prod,'APAC','2026-03-01','2027-06-30','ACTIVE','CTR-2026-002',1),
(UUID_TO_BIN('56000000-0000-0000-0000-000000000003'),@app_mobile,@game_a,@env_mobile,'SEA','2026-04-01','2027-12-31','ACTIVE','CTR-2026-001',1)
ON DUPLICATE KEY UPDATE status=VALUES(status),end_date=VALUES(end_date),version=version+1;

USE contract_service;
INSERT INTO contracts(id,contract_number,status,created_by,created_at,terminated_at,termination_reason,revision) VALUES
(@contract_a,'CTR-2026-001','ACTIVE',@admin,NOW(6),NULL,NULL,1),
(UUID_TO_BIN('60000000-0000-0000-0000-000000000002'),'CTR-2026-002','IN_REVIEW',@admin,NOW(6),NULL,NULL,1)
ON DUPLICATE KEY UPDATE status=VALUES(status),revision=revision+1;
INSERT INTO contract_parties(id,contract_id,party_id,party_type,role) VALUES
(UUID_TO_BIN('61000000-0000-0000-0000-000000000001'),@contract_a,@studio_a,'STUDIO','LICENSOR'),
(UUID_TO_BIN('61000000-0000-0000-0000-000000000002'),@contract_a,@client_org_a,'CLIENT','LICENSEE')
ON DUPLICATE KEY UPDATE role=VALUES(role);
INSERT INTO contract_versions(id,contract_id,version_number,effective_date,expiration_date,territories_json,game_rights_json,revenue_agreement_json,attachment_key,status,approved_by) VALUES
(UUID_TO_BIN('62000000-0000-0000-0000-000000000001'),@contract_a,1,'2026-01-01','2027-12-31','["GLOBAL"]','["distribution","streaming"]','{"platform":0.15,"studio":0.55,"publisher":0.20,"client":0.10}','contracts/CTR-2026-001-v1.pdf','APPROVED',@admin)
ON DUPLICATE KEY UPDATE status=VALUES(status),revenue_agreement_json=VALUES(revenue_agreement_json);

USE revenue_service;
INSERT INTO revenue_rules(id,contract_id,game_id,name,status) VALUES
(UUID_TO_BIN('63000000-0000-0000-0000-000000000001'),@contract_a,@game_a,'Sky Realms standard split','ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name),status=VALUES(status);
INSERT INTO revenue_rule_versions(id,rule_id,version_number,effective_from,effective_to,calculation_method,platform_share,studio_share,publisher_share,client_share) VALUES
(UUID_TO_BIN('63100000-0000-0000-0000-000000000001'),UUID_TO_BIN('63000000-0000-0000-0000-000000000001'),1,'2026-01-01',NULL,'PERCENTAGE',0.15000,0.55000,0.20000,0.10000)
ON DUPLICATE KEY UPDATE effective_to=VALUES(effective_to);

USE ledger_service;
INSERT INTO revenue_transactions(id,idempotency_key,client_id,game_id,amount,currency,occurred_at,recorded_at) VALUES
(UUID_TO_BIN('64000000-0000-0000-0000-000000000001'),'seed-tx-001',@client_org_a,@game_a,18450.00,'USD',DATE_SUB(NOW(6),INTERVAL 10 DAY),NOW(6)),
(UUID_TO_BIN('64000000-0000-0000-0000-000000000002'),'seed-tx-002',@client_org_a,@game_b,9820.50,'USD',DATE_SUB(NOW(6),INTERVAL 5 DAY),NOW(6)),
(UUID_TO_BIN('64000000-0000-0000-0000-000000000003'),'seed-tx-003',@client_org_b,@game_c,4250.00,'USD',DATE_SUB(NOW(6),INTERVAL 2 DAY),NOW(6))
ON DUPLICATE KEY UPDATE amount=VALUES(amount),occurred_at=VALUES(occurred_at);
INSERT INTO revenue_allocations(id,transaction_id,beneficiary_id,beneficiary_type,amount) VALUES
(UUID_TO_BIN('64100000-0000-0000-0000-000000000001'),UUID_TO_BIN('64000000-0000-0000-0000-000000000001'),@studio_a,'STUDIO',10147.50),
(UUID_TO_BIN('64100000-0000-0000-0000-000000000002'),UUID_TO_BIN('64000000-0000-0000-0000-000000000001'),@publisher_a,'PUBLISHER',3690.00)
ON DUPLICATE KEY UPDATE amount=VALUES(amount);
INSERT INTO settlements(id,beneficiary_id,period_from,period_to,amount,status,created_at) VALUES
(UUID_TO_BIN('64200000-0000-0000-0000-000000000001'),@studio_a,'2026-06-01','2026-06-30',12650.25,'PAID',NOW(6))
ON DUPLICATE KEY UPDATE amount=VALUES(amount),status=VALUES(status);

USE billing_service;
INSERT INTO billing_plans(id,code,cycle,usage_quota,price,currency) VALUES
(UUID_TO_BIN('65000000-0000-0000-0000-000000000001'),'GROWTH-MONTHLY','MONTHLY',1000000,499.00,'USD')
ON DUPLICATE KEY UPDATE usage_quota=VALUES(usage_quota),price=VALUES(price);
INSERT INTO usage_records(id,idempotency_key,client_id,quantity,occurred_at) VALUES
(UUID_TO_BIN('65100000-0000-0000-0000-000000000001'),'seed-usage-001',@client_org_a,846240,DATE_SUB(NOW(6),INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE quantity=VALUES(quantity),occurred_at=VALUES(occurred_at);
INSERT INTO invoices(id,invoice_number,client_id,cycle_from,cycle_to,total,currency,payment_status,created_at) VALUES
(UUID_TO_BIN('65200000-0000-0000-0000-000000000001'),'INV-2026-0061',@client_org_a,'2026-06-01','2026-06-30',499.00,'USD','PAID',NOW(6)),
(UUID_TO_BIN('65200000-0000-0000-0000-000000000002'),'INV-2026-0071',@client_org_a,'2026-07-01','2026-07-31',624.50,'USD','PENDING',NOW(6))
ON DUPLICATE KEY UPDATE total=VALUES(total),payment_status=VALUES(payment_status);
INSERT INTO invoice_items(id,invoice_id,description,quantity,unit_price,amount) VALUES
(UUID_TO_BIN('65300000-0000-0000-0000-000000000001'),UUID_TO_BIN('65200000-0000-0000-0000-000000000001'),'Growth platform plan',1,499.00,499.00),
(UUID_TO_BIN('65300000-0000-0000-0000-000000000002'),UUID_TO_BIN('65200000-0000-0000-0000-000000000002'),'Growth platform plan and overage',1,624.50,624.50)
ON DUPLICATE KEY UPDATE amount=VALUES(amount);

USE webhook_service;
INSERT INTO webhook_endpoints(id,tenant_id,url,encrypted_secret,event_subscriptions_json,environment,active,timeout_ms,max_retries,revision) VALUES
(UUID_TO_BIN('66000000-0000-0000-0000-000000000001'),@tenant_a,'https://webhook.site/development-nova','development-encrypted-placeholder','["release.published","build.completed"]','PRODUCTION',1,5000,5,1),
(UUID_TO_BIN('66000000-0000-0000-0000-000000000002'),@tenant_a,'https://webhook.site/development-aurora','development-encrypted-placeholder','["deployment.completed","incident.created"]','SANDBOX',1,3000,3,1)
ON DUPLICATE KEY UPDATE event_subscriptions_json=VALUES(event_subscriptions_json),active=VALUES(active),revision=revision+1;
INSERT INTO webhook_deliveries(id,endpoint_id,event_id,event_type,payload,status,attempt_count,next_attempt_at,last_http_status,last_error,created_at,delivered_at,revision) VALUES
(UUID_TO_BIN('66100000-0000-0000-0000-000000000001'),UUID_TO_BIN('66000000-0000-0000-0000-000000000001'),'seed-event-001','release.published','{"releaseId":"53000000-0000-0000-0000-000000000001"}','DELIVERED',1,NOW(6),200,NULL,NOW(6),NOW(6),1),
(UUID_TO_BIN('66100000-0000-0000-0000-000000000002'),UUID_TO_BIN('66000000-0000-0000-0000-000000000002'),'seed-event-002','incident.created','{"severity":"SEV2"}','RETRYING',2,DATE_ADD(NOW(6),INTERVAL 5 MINUTE),503,'Development endpoint unavailable',NOW(6),NULL,2)
ON DUPLICATE KEY UPDATE status=VALUES(status),attempt_count=VALUES(attempt_count),revision=revision+1;

USE incident_service;
INSERT INTO incidents(id,incident_number,title,description,severity,status,assignee_id,related_deployment_id,created_at,acknowledged_at,resolved_at,postmortem,revision) VALUES
(UUID_TO_BIN('67000000-0000-0000-0000-000000000001'),'INC-2026-0042','Elevated API latency','P95 latency exceeded the production SLO','SEV2','INVESTIGATING',@admin,UUID_TO_BIN('54000000-0000-0000-0000-000000000001'),NOW(6),NOW(6),NULL,NULL,1),
(UUID_TO_BIN('67000000-0000-0000-0000-000000000002'),'INC-2026-0037','Webhook delivery delay','Kafka consumer lag delayed outgoing webhooks','SEV3','RESOLVED',@admin,NULL,DATE_SUB(NOW(6),INTERVAL 8 DAY),DATE_SUB(NOW(6),INTERVAL 8 DAY),DATE_SUB(NOW(6),INTERVAL 7 DAY),'Increased worker concurrency and added lag alerting.',2)
ON DUPLICATE KEY UPDATE status=VALUES(status),description=VALUES(description),revision=revision+1;
INSERT INTO incident_affected_services(id,incident_id,service_name) VALUES
(UUID_TO_BIN('67100000-0000-0000-0000-000000000001'),UUID_TO_BIN('67000000-0000-0000-0000-000000000001'),'api-key-gateway'),
(UUID_TO_BIN('67100000-0000-0000-0000-000000000002'),UUID_TO_BIN('67000000-0000-0000-0000-000000000002'),'webhook-service')
ON DUPLICATE KEY UPDATE service_name=VALUES(service_name);

USE audit_service;
INSERT INTO audit_logs(id,event_id,tenant_id,actor_id,action,resource_type,resource_id,request_id,correlation_id,ip_address,before_json,after_json,occurred_at,ingested_at) VALUES
(UUID_TO_BIN('68000000-0000-0000-0000-000000000001'),'seed-audit-001',@tenant_a,@admin,'CREATE','GAME','50000000-0000-0000-0000-000000000001','req-seed-001','corr-seed-001','127.0.0.1',NULL,'{"title":"Sky Realms"}',DATE_SUB(NOW(6),INTERVAL 14 DAY),NOW(6)),
(UUID_TO_BIN('68000000-0000-0000-0000-000000000002'),'seed-audit-002',@tenant_a,@admin,'DEPLOY','RELEASE','53000000-0000-0000-0000-000000000001','req-seed-002','corr-seed-002','127.0.0.1','{"status":"APPROVED"}','{"status":"RELEASED"}',DATE_SUB(NOW(6),INTERVAL 4 DAY),NOW(6)),
(UUID_TO_BIN('68000000-0000-0000-0000-000000000003'),'seed-audit-003',@tenant_a,@admin,'ROTATE_KEY','API_KEY','55000000-0000-0000-0000-000000000001','req-seed-003','corr-seed-003','127.0.0.1',NULL,'{"version":2}',NOW(6),NOW(6))
ON DUPLICATE KEY UPDATE action=VALUES(action),after_json=VALUES(after_json),occurred_at=VALUES(occurred_at);

USE analytics_service;
INSERT INTO usage_aggregates(id,period_type,period_start,tenant_id,client_id,game_id,api_key_id,endpoint,method,request_count,error_count,latency_ms_sum,request_bytes,response_bytes) VALUES
(700001,'DAY',DATE_SUB(CURRENT_DATE,INTERVAL 1 DAY),'10000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','55000000-0000-0000-0000-000000000001','/v1/games/sky-realms/session','POST',184320,142,23777280,75497472,188743680),
(700002,'DAY',CURRENT_DATE,'10000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000002','55000000-0000-0000-0000-000000000001','/v1/games/neon-racers/profile','GET',96240,87,10490160,29360128,92274688)
ON DUPLICATE KEY UPDATE request_count=VALUES(request_count),error_count=VALUES(error_count),latency_ms_sum=VALUES(latency_ms_sum);
