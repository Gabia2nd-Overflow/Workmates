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
    @Query("DELETE FROM EMAIL_VERIFICATION e where e.expires_at < :now")
    void deleteExpiredCodes(LocalDateTime now);

    @Modifying
    @Query("UPDATE EMAIL_VERIFICATION set code = :code, expires_at = :expiresAt where email = :email")
    void updateCode(String email, String code, LocalDateTime expiresAt);
}
