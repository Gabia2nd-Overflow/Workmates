package com.workmates.backend.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.workmates.backend.domain.EmailVerification;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, String>{
    
    Optional<EmailVerification> findByEmail(String email);

    @Modifying
    @Query(value = "DELETE FROM EMAIL_VERIFICATION e WHERE e.expires_at < :now", nativeQuery = true)
    void deleteExpiredCodes(LocalDateTime now);

    @Modifying
    @Query(value = "UPDATE EMAIL_VERIFICATION SET code = :code, expires_at = :expiresAt, is_confirmed = :isConfirmed WHERE email = :email", nativeQuery = true)
    void updateCode(String email, String code, LocalDateTime expiresAt, Boolean isConfirmed);
}
