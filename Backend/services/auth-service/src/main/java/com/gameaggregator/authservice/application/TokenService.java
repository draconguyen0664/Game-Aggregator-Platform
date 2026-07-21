package com.gameaggregator.authservice.application;

import com.gameaggregator.authservice.api.AuthDtos.TokenPair;
import com.gameaggregator.authservice.domain.AuthUser;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;

@Service
public class TokenService {
    private static final Duration ACCESS_TTL=Duration.ofMinutes(15); private static final Duration REFRESH_TTL=Duration.ofDays(30);
    private final JwtEncoder encoder; private final SecureRandom random=new SecureRandom();
    public TokenService(JwtEncoder encoder){this.encoder=encoder;}
    public IssuedTokens issue(AuthUser user,UUID sessionId){
        Instant now=Instant.now();
        JwtClaimsSet claims=JwtClaimsSet.builder().issuer("auth-service").issuedAt(now).expiresAt(now.plus(ACCESS_TTL)).subject(user.getId().toString()).id(sessionId.toString()).claim("email",user.getEmail()).claim("roles",java.util.List.of("INTERNAL_USER")).build();
        String access=encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(),claims)).getTokenValue();
        byte[] bytes=new byte[48];random.nextBytes(bytes);String refresh=Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        return new IssuedTokens(new TokenPair("Bearer",access,ACCESS_TTL.toSeconds(),refresh),hash(refresh),now.plus(REFRESH_TTL));
    }
    public String resetToken(){byte[] b=new byte[32];random.nextBytes(b);return Base64.getUrlEncoder().withoutPadding().encodeToString(b);}
    public String hash(String value){try{return java.util.HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));}catch(Exception e){throw new IllegalStateException(e);}}
    public record IssuedTokens(TokenPair pair,String refreshHash,Instant refreshExpiresAt){}
}
