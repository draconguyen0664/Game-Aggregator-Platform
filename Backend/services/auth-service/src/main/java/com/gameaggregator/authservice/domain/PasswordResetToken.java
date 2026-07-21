package com.gameaggregator.authservice.domain;

import com.gameaggregator.platform.core.common.persistence.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="password_reset_tokens")
public class PasswordResetToken extends BaseEntity {
    @Column(nullable=false) private UUID userId;
    @Column(nullable=false,unique=true,length=64) private String tokenHash;
    @Column(nullable=false) private Instant expiresAt;
    private Instant usedAt;
    protected PasswordResetToken(){}
    public PasswordResetToken(UUID userId,String tokenHash,Instant expiresAt){this.userId=userId;this.tokenHash=tokenHash;this.expiresAt=expiresAt;}
    public UUID getUserId(){return userId;} public boolean isUsable(){return usedAt==null&&expiresAt.isAfter(Instant.now());} public void use(){usedAt=Instant.now();}
}
