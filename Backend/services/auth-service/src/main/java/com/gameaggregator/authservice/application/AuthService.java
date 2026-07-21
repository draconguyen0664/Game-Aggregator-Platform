package com.gameaggregator.authservice.application;

import static com.gameaggregator.authservice.api.AuthDtos.*;

import com.gameaggregator.authservice.domain.*;
import com.gameaggregator.authservice.infrastructure.*;
import com.gameaggregator.platform.core.common.exception.DomainException;
import com.gameaggregator.platform.core.common.exception.NotFoundException;
import java.time.Instant;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Transactional
public class AuthService {
    private final AuthUserRepository users; private final AuthSessionRepository sessions; private final RefreshTokenRepository refreshTokens; private final PasswordResetTokenRepository resets; private final PasswordEncoder passwords; private final TokenService tokens; private final PasswordResetNotifier notifier;
    public AuthService(AuthUserRepository users,AuthSessionRepository sessions,RefreshTokenRepository refreshTokens,PasswordResetTokenRepository resets,PasswordEncoder passwords,TokenService tokens,PasswordResetNotifier notifier){this.users=users;this.sessions=sessions;this.refreshTokens=refreshTokens;this.resets=resets;this.passwords=passwords;this.tokens=tokens;this.notifier=notifier;}
    public UserView register(RegisterRequest request){String email=request.email().trim().toLowerCase();if(users.existsByEmailIgnoreCase(email))throw new DomainException("EMAIL_EXISTS","Email is already registered",HttpStatus.CONFLICT);AuthUser user=users.save(new AuthUser(email,passwords.encode(request.password()),request.displayName().trim()));return view(user);}
    public TokenPair login(LoginRequest request,String userAgent,String ip){AuthUser user=users.findByEmailIgnoreCase(request.email()).orElseThrow(this::badCredentials);if(!user.isEnabled()||user.isLocked())throw new DomainException("ACCOUNT_LOCKED","Account is locked or disabled",HttpStatus.LOCKED);if(!passwords.matches(request.password(),user.getPasswordHash())){user.loginFailed();throw badCredentials();}user.loginSucceeded();AuthSession session=sessions.save(new AuthSession(user.getId(),trim(userAgent,500),trim(ip,64)));return issue(user,session);}
    public TokenPair refresh(RefreshRequest request){RefreshToken old=refreshTokens.findByTokenHash(tokens.hash(request.refreshToken())).orElseThrow(this::invalidRefresh);if(!old.isUsable())throw invalidRefresh();AuthSession session=sessions.findById(old.getSessionId()).filter(AuthSession::isActive).orElseThrow(this::invalidRefresh);AuthUser user=users.findById(old.getUserId()).filter(AuthUser::isEnabled).orElseThrow(this::invalidRefresh);old.revoke();session.touch();return issue(user,session);}
    public void logout(LogoutRequest request){refreshTokens.findByTokenHash(tokens.hash(request.refreshToken())).ifPresent(token->{token.revoke();sessions.findById(token.getSessionId()).ifPresent(AuthSession::revoke);});}
    public void forgot(ForgotPasswordRequest request){users.findByEmailIgnoreCase(request.email()).ifPresent(user->{String raw=tokens.resetToken();resets.save(new PasswordResetToken(user.getId(),tokens.hash(raw),Instant.now().plusSeconds(1800)));notifier.send(user.getEmail(),raw);});}
    public void reset(ResetPasswordRequest request){PasswordResetToken reset=resets.findByTokenHash(tokens.hash(request.token())).filter(PasswordResetToken::isUsable).orElseThrow(()->new DomainException("INVALID_RESET_TOKEN","Reset token is invalid or expired",HttpStatus.BAD_REQUEST));AuthUser user=users.findById(reset.getUserId()).orElseThrow(()->new NotFoundException("USER_NOT_FOUND","User was not found"));user.changePassword(passwords.encode(request.newPassword()));reset.use();refreshTokens.findByUserId(user.getId()).forEach(RefreshToken::revoke);sessions.findByUserIdOrderByCreatedAtDesc(user.getId()).forEach(AuthSession::revoke);}
    @Transactional(readOnly=true) public UserView me(UUID id){return users.findById(id).map(this::view).orElseThrow(()->new NotFoundException("USER_NOT_FOUND","User was not found"));}
    @Transactional(readOnly=true) public SessionsView sessionViews(UUID userId){return new SessionsView(sessions.findByUserIdOrderByCreatedAtDesc(userId).stream().map(s->new SessionView(s.getId(),s.getUserAgent(),s.getIpAddress(),s.getLastSeenAt(),s.getRevokedAt())).toList());}
    public void revokeSession(UUID userId,UUID sessionId){AuthSession s=sessions.findById(sessionId).filter(x->x.getUserId().equals(userId)).orElseThrow(()->new NotFoundException("SESSION_NOT_FOUND","Session was not found"));s.revoke();}
    private TokenPair issue(AuthUser user,AuthSession session){TokenService.IssuedTokens issued=tokens.issue(user,session.getId());refreshTokens.save(new RefreshToken(user.getId(),session.getId(),issued.refreshHash(),issued.refreshExpiresAt()));return issued.pair();}
    private UserView view(AuthUser u){return new UserView(u.getId(),u.getEmail(),u.getDisplayName());} private DomainException badCredentials(){return new DomainException("INVALID_CREDENTIALS","Email or password is invalid",HttpStatus.UNAUTHORIZED);} private DomainException invalidRefresh(){return new DomainException("INVALID_REFRESH_TOKEN","Refresh token is invalid or expired",HttpStatus.UNAUTHORIZED);} private String trim(String v,int max){return v==null?null:v.substring(0,Math.min(v.length(),max));}
}
