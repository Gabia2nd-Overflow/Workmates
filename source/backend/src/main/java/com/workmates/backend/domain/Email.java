package com.workmates.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "EMAIL")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Email { // 웹메일 기능에서 사용할 이메일
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EMAIL_ADDRESS", length = DomainConstants.COMMENT_MAX_LEN)
    private String email_address; // 이메일 계정 주소

    @Column(name = "EMAIL_PASSWORD", nullable = false, length = DomainConstants.COMMENT_MAX_LEN)
    private String email_password; // 이메일 계정이 사용하는 비밀번호

    @Column(name = "EMAIL_OWNER_ID", nullable = false, unique = true, length = DomainConstants.ID_MAX_LEN)
    private String email_owner_id; // 이메일을 연결한 사용자 아이디
}
