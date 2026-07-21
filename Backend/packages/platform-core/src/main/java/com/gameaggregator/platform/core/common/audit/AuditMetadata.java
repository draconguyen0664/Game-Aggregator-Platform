package com.gameaggregator.platform.core.common.audit;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.time.Instant;

@Embeddable
public class AuditMetadata {
    @Column(name = "created_by", updatable = false)
    private String createdBy;
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
    @Column(name = "updated_by")
    private String updatedBy;
    @Column(name = "updated_at")
    private Instant updatedAt;

    protected AuditMetadata() {}

    public AuditMetadata(String createdBy, Instant createdAt, String updatedBy, Instant updatedAt) {
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedBy = updatedBy;
        this.updatedAt = updatedAt;
    }

    public String getCreatedBy() { return createdBy; }
    public Instant getCreatedAt() { return createdAt; }
    public String getUpdatedBy() { return updatedBy; }
    public Instant getUpdatedAt() { return updatedAt; }
}
