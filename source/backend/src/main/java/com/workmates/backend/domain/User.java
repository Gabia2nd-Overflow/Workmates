package com.workmates.backend.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity //데이터베이스와 매핑(영속성 컨텍스트 - EntityManager)
@Getter
@Setter
@Builder
@NoArgsConstructor //기본 생성자
@AllArgsConstructor //모든 필드를 매개변수로 받는 생성자
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_ID")
    private Long id;
    //unique = true 중복안됨, nullable : false : NOT NULL
    @Column(name = "USERNAME", unique = true, nullable = false, length = 50)
    private String username;
    
    @Column(name = "EMAIL", unique = true, nullable = false, length = 100)
    private String email;
    
    @Column(name = "PASSWORD", nullable = false, length = 255)
    private String password;
    
    @Column(name = "NICKNAME", length = 50)
    private String nickname;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "ROLE", nullable = false)
    private Role role;

    // 엔티티 생성일자.,
    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;
    //엔티티 수정일자
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;
    // 저장전 동작 (insert into 전에 자동실행.)
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (role == null) {
            role = Role.USER;
        }
    }
    //수정전 동작.
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

     public enum Role {
        USER, ADMIN
    }
}
