package com.gameaggregator.authservice.domain;

import com.gameaggregator.platform.core.common.persistence.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="auth_sessions")
public class AuthSession extends BaseEntity {
    @Column(nullable=false) private UUID userId;
    @Column(length=500) private String userAgent;
    @Column(length=64) private String ipAddress;
    @Column(nullable=false) private Instant lastSeenAt=Instant.now();
    private Instant revokedAt;
    protected AuthSession(){}
    public AuthSession(UUID userId,String userAgent,String ipAddress){this.userId=userId;this.userAgent=userAgent;this.ipAddress=ipAddress;}
    public UUID getUserId(){return userId;} public String getUserAgent(){return userAgent;} public String getIpAddress(){return ipAddress;} public Instant getLastSeenAt(){return lastSeenAt;} public Instant getRevokedAt(){return revokedAt;}
    public boolean isActive(){return revokedAt==null;} public void touch(){lastSeenAt=Instant.now();} public void revoke(){revokedAt=Instant.now();}
}
