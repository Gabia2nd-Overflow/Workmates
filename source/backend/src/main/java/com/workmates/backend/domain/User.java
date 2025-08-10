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
@Table(name = "USER")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User { // 사용자
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_ID", length = DomainConstants.ID_MAX_LEN)
    private Long user_id; // 사용자 아이디

    @Column(name = "USER_NICKNAME", nullable = false, unique = true, length = DomainConstants.ID_MAX_LEN)
    private String user_nickname; // 사용자 닉네임
    
    @Column(name = "USER_PASSWORD", nullable = false, length = DomainConstants.ID_MAX_LEN)
    private String user_password; // 사용자 비밀번호
    
    @Column(name = "USER_PROFILE_BIO", length = DomainConstants.COMMENT_MAX_LEN)
    private String user_profile_bio; // 사용자 프로필 소개
    
    @Column(name = "USER_PROFILE_IMAGE_URL", unique = true)
    @Builder.Default
    private String user_profile_image_url = null; // 사용자의 프로필 이미지가 저장된 url. 기본적으로 null

    @Column(name = "USER_LANGUAGE", nullable = false)
    @Builder.Default
    private String user_language = DomainConstants.DEFAULT_LANGUAGE; // 사용자가 사용하는 언어. 기본적으로 한국어
    
    @Column(name = "USER_IS_DELETED", nullable = false)
    @Builder.Default
    private Boolean user_is_deleted = false; // 사용자 탈퇴 여부. 기본적으로 false
}
