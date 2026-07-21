-- +goose Up
CREATE TABLE consumed_usage_events(event_id VARCHAR(255) PRIMARY KEY,consumed_at TIMESTAMP(6) NOT NULL);
CREATE TABLE usage_aggregates(id BIGINT AUTO_INCREMENT PRIMARY KEY,period_type VARCHAR(10) NOT NULL,period_start TIMESTAMP NOT NULL,tenant_id VARCHAR(36) NOT NULL,client_id VARCHAR(36) NOT NULL,game_id VARCHAR(36) NOT NULL,api_key_id VARCHAR(36) NOT NULL,endpoint VARCHAR(191) NOT NULL,method VARCHAR(10) NOT NULL,request_count BIGINT NOT NULL,error_count BIGINT NOT NULL,latency_ms_sum BIGINT NOT NULL,request_bytes BIGINT NOT NULL,response_bytes BIGINT NOT NULL,UNIQUE(period_type,period_start,tenant_id,client_id,game_id,api_key_id,endpoint,method));
-- +goose Down
DROP TABLE usage_aggregates;
DROP TABLE consumed_usage_events;