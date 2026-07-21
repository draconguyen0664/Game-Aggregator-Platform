package com.gameaggregator.authservice.infrastructure;
import com.gameaggregator.authservice.domain.RefreshToken; import java.util.List; import java.util.Optional; import java.util.UUID; import org.springframework.data.jpa.repository.JpaRepository;
public interface RefreshTokenRepository extends JpaRepository<RefreshToken,UUID>{Optional<RefreshToken> findByTokenHash(String hash);List<RefreshToken> findByUserId(UUID userId);}
