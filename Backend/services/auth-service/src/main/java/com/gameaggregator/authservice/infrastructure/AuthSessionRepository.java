package com.gameaggregator.authservice.infrastructure;
import com.gameaggregator.authservice.domain.AuthSession; import java.util.List; import java.util.UUID; import org.springframework.data.jpa.repository.JpaRepository;
public interface AuthSessionRepository extends JpaRepository<AuthSession,UUID>{List<AuthSession> findByUserIdOrderByCreatedAtDesc(UUID userId);}
