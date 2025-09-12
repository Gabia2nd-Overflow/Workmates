package com.workmates.backend.domain;

import com.workmates.backend.util.DomainUtil;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "USER",
    indexes = {
        @Index(name = "idx_email", columnList = "email"),
    }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User { // 사용자
    
    @Id
    @Column(name = "id", length = DomainUtil.ID_MAX_LEN)
    private String id; // 사용자 아이디

    @Column(name = "nickname", nullable = false, unique = true, length = DomainUtil.ID_MAX_LEN)
    private String nickname; // 사용자 닉네임
    
    @Column(name = "password", nullable = false, length = DomainUtil.POST_MAX_LEN) // 암호화때문에 32로는 택도없음
    private String password; // 사용자 비밀번호
    
    // @Column(name = "bio", length = DomainConstants.COMMENT_MAX_LEN)
    // private String bio; // 사용자 프로필 소개
    
    @Column(name = "image_url", unique = true)
    @Builder.Default
    private String imageUrl = null; // 사용자의 프로필 이미지가 저장된 url. 기본적으로 null

    // @Column(name = "language", nullable = false)
    // @Builder.Default
    // private String language = DomainConstants.DEFAULT_LANGUAGE; // 사용자가 사용하는 언어. 기본적으로 한국어

    @Column(name = "email", unique = true, length = DomainUtil.COMMENT_MAX_LEN)
    private String email; // 이메일 계정 주소

    @Column(name = "email_password", length = DomainUtil.COMMENT_MAX_LEN)
    private String emailPassword; // 이메일 계정이 사용하는 비밀번호 - 구글 앱 비밀번호 등
    
    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false; // 사용자 탈퇴 여부. 기본적으로 false
}
