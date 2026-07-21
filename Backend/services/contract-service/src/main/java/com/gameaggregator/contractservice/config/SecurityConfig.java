package com.gameaggregator.contractservice.config;

import java.nio.charset.StandardCharsets;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.OctetSequenceKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.proc.SecurityContext;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder(12);}
    @Bean SecretKey jwtKey(@Value("${security.jwt.secret}") String secret){if(secret.getBytes(StandardCharsets.UTF_8).length<32)throw new IllegalStateException("JWT secret must be at least 32 bytes");return new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),"HmacSHA256");}
    @Bean JwtEncoder jwtEncoder(SecretKey key){ OctetSequenceKey jwk=new OctetSequenceKey.Builder(key).algorithm(JWSAlgorithm.HS256).build(); return new NimbusJwtEncoder(new ImmutableJWKSet<SecurityContext>(new JWKSet(jwk))); }
    @Bean JwtDecoder jwtDecoder(SecretKey key){return NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();}
    @Bean SecurityFilterChain security(HttpSecurity http)throws Exception{return http.csrf(csrf->csrf.disable()).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).authorizeHttpRequests(a->a.requestMatchers("/actuator/health","/v3/api-docs/**","/swagger-ui/**").permitAll().anyRequest().authenticated()).oauth2ResourceServer(o->o.jwt(jwt->{})).build();}
}
