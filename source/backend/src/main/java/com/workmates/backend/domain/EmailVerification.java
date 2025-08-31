package com.workmates.backend.domain;

import java.time.LocalDateTime;

import com.workmates.backend.constant.DomainConstants;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "EMAIL_VERIFICATION")
@Getter
@Setter
@Builder
@NoArgsConstructor
public class EmailVerification { // 이메일 인증
    
    @Id
    @Column(name = "email")
    private String email; // 이메일 인증 주소

    @Column(name = "code", nullable = false, length = DomainConstants.CODE_LENGTH)
    private String code; // 이메일 인증을 위한 6자리 코드값

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt; // 코드 만료 일시

    public EmailVerification(String email, String code, LocalDateTime requestedAt) {
        this.email = email;
        this.code = code;
        this.expiresAt = requestedAt.plusMinutes(DomainConstants.CODE_EXPIRES_IN);
    }
}
