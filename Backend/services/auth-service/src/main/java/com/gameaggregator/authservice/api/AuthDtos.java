package com.gameaggregator.authservice.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public final class AuthDtos {
    private AuthDtos(){}
    public record RegisterRequest(@Email @NotBlank String email,@NotBlank @Size(min=12,max=128) String password,@NotBlank @Size(max=150) String displayName){}
    public record LoginRequest(@Email @NotBlank String email,@NotBlank String password){}
    public record RefreshRequest(@NotBlank String refreshToken){}
    public record LogoutRequest(@NotBlank String refreshToken){}
    public record ForgotPasswordRequest(@Email @NotBlank String email){}
    public record ResetPasswordRequest(@NotBlank String token,@NotBlank @Size(min=12,max=128) String newPassword){}
    public record TokenPair(String tokenType,String accessToken,long expiresIn,String refreshToken){}
    public record UserView(UUID id,String email,String displayName){}
    public record SessionView(UUID id,String userAgent,String ipAddress,Instant lastSeenAt,Instant revokedAt){}
    public record SessionsView(List<SessionView> sessions){}
}
