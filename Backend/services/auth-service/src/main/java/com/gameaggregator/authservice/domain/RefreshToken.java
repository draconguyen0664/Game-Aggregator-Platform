package com.gameaggregator.authservice.domain;

import com.gameaggregator.platform.core.common.persistence.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="refresh_tokens")
public class RefreshToken extends BaseEntity {
    @Column(nullable=false) private UUID userId;
    @Column(nullable=false) private UUID sessionId;
    @Column(nullable=false,unique=true,length=64) private String tokenHash;
    @Column(nullable=false) private Instant expiresAt;
    private Instant revokedAt;
    protected RefreshToken(){}
    public RefreshToken(UUID userId,UUID sessionId,String tokenHash,Instant expiresAt){this.userId=userId;this.sessionId=sessionId;this.tokenHash=tokenHash;this.expiresAt=expiresAt;}
    public UUID getUserId(){return userId;} public UUID getSessionId(){return sessionId;}
    public boolean isUsable(){return revokedAt==null&&expiresAt.isAfter(Instant.now());} public void revoke(){revokedAt=Instant.now();}
}
