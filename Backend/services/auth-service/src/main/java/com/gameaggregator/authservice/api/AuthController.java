package com.gameaggregator.authservice.api;

import static com.gameaggregator.authservice.api.AuthDtos.*;
import com.gameaggregator.authservice.application.AuthService;
import com.gameaggregator.platform.core.common.web.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Map;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import com.gameaggregator.platform.core.common.exception.DomainException;
import org.springframework.beans.factory.annotation.Value;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/auth")
public class AuthController {
    private final AuthService auth; private final String registrationKey; public AuthController(AuthService auth,@Value("${security.internal-registration-key}") String registrationKey){this.auth=auth;this.registrationKey=registrationKey;}
    @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED) public ApiResponse<UserView> register(@RequestHeader("X-Internal-Registration-Key") String key,@Valid @RequestBody RegisterRequest r){if(!MessageDigest.isEqual(key.getBytes(StandardCharsets.UTF_8),registrationKey.getBytes(StandardCharsets.UTF_8)))throw new DomainException("INTERNAL_REGISTRATION_DENIED","Internal registration key is invalid",HttpStatus.FORBIDDEN);return ApiResponse.success(auth.register(r));}
    @PostMapping("/login") public ApiResponse<TokenPair> login(@Valid @RequestBody LoginRequest r,HttpServletRequest http){return ApiResponse.success(auth.login(r,http.getHeader("User-Agent"),clientIp(http)));}
    @PostMapping("/refresh") public ApiResponse<TokenPair> refresh(@Valid @RequestBody RefreshRequest r){return ApiResponse.success(auth.refresh(r));}
    @PostMapping("/logout") public ApiResponse<Map<String,Boolean>> logout(@Valid @RequestBody LogoutRequest r){auth.logout(r);return ApiResponse.success(Map.of("loggedOut",true));}
    @PostMapping("/forgot-password") public ApiResponse<Map<String,String>> forgot(@Valid @RequestBody ForgotPasswordRequest r){auth.forgot(r);return ApiResponse.success(Map.of("message","If the account exists, reset instructions will be sent"));}
    @PostMapping("/reset-password") public ApiResponse<Map<String,Boolean>> reset(@Valid @RequestBody ResetPasswordRequest r){auth.reset(r);return ApiResponse.success(Map.of("reset",true));}
    @GetMapping("/me") public ApiResponse<UserView> me(@AuthenticationPrincipal Jwt jwt){return ApiResponse.success(auth.me(UUID.fromString(jwt.getSubject())));}
    @GetMapping("/sessions") public ApiResponse<SessionsView> sessions(@AuthenticationPrincipal Jwt jwt){return ApiResponse.success(auth.sessionViews(UUID.fromString(jwt.getSubject())));}
    @DeleteMapping("/sessions/{id}") public ApiResponse<Map<String,Boolean>> revoke(@AuthenticationPrincipal Jwt jwt,@PathVariable UUID id){auth.revokeSession(UUID.fromString(jwt.getSubject()),id);return ApiResponse.success(Map.of("revoked",true));}
    private String clientIp(HttpServletRequest request){String forwarded=request.getHeader("X-Forwarded-For");return forwarded==null?request.getRemoteAddr():forwarded.split(",")[0].trim();}
}
