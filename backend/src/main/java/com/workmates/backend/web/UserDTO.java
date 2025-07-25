package com.workmates.backend.web;


import java.time.LocalDateTime;

import com.workmates.backend.domain.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class UserDTO {
    //회원가입
    @Data //@GETTER, @SETTER, @TOSTRING @EqualsAndHashCode @RequiredArgsConstructor
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignUpRequest {
        private String username;
        private String email;
        private String password;
        private String nickname;
    }

    //로그인 요청
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String username;
        private String password;
    }

    //로그인 응답.
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {
        private String token;
        private String username;
        private String email;
        private String nickname;
        private User.Role role;
    }
     //회원 상세 조회.
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private Long id;
        private String username;
        private String email;
        private String nickname;
        private User.Role role;
        private LocalDateTime createdAt;
        
        public static UserResponse from(User user) {
            return UserResponse.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .nickname(user.getNickname())
                    .role(user.getRole())
                    .createdAt(user.getCreatedAt())
                    .build();
        }
    }
    // 마이 페이지 정보 수정
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String nickname;
        private String email;
    }
}
