package com.gameaggregator.authservice.domain;

import com.gameaggregator.platform.core.common.persistence.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "auth_users")
public class AuthUser extends BaseEntity {
    @Column(nullable = false, unique = true, length = 255) private String email;
    @Column(nullable = false, length = 100) private String passwordHash;
    @Column(nullable = false, length = 150) private String displayName;
    @Column(nullable = false) private boolean enabled = true;
    @Column(nullable = false) private int failedLoginAttempts;
    private Instant lockedUntil;

    protected AuthUser() {}
    public AuthUser(String email, String passwordHash, String displayName) { this.email=email; this.passwordHash=passwordHash; this.displayName=displayName; }
    public String getEmail(){return email;} public String getPasswordHash(){return passwordHash;} public String getDisplayName(){return displayName;}
    public boolean isEnabled(){return enabled;} public int getFailedLoginAttempts(){return failedLoginAttempts;} public Instant getLockedUntil(){return lockedUntil;}
    public boolean isLocked(){return lockedUntil != null && lockedUntil.isAfter(Instant.now());}
    public void loginSucceeded(){failedLoginAttempts=0;lockedUntil=null;}
    public void loginFailed(){failedLoginAttempts++;if(failedLoginAttempts>=5)lockedUntil=Instant.now().plusSeconds(900);}
    public void changePassword(String hash){passwordHash=hash;}
}
