# authorization-service
Evaluates tenant permission, user/tenant ownership, target environment, and resource state. It calls tenant-service through HTTP and stores decision audits only in authorization_service; it never reads another service database.
