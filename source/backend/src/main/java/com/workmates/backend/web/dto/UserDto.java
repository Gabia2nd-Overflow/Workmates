package com.workmates.backend.web.dto;

import java.time.LocalDateTime;

import com.workmates.backend.domain.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class UserDto {

    // 아이디 중복확인 요청
    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CheckIdRequest {
        private String id;
    }

    // 아이디 중복확인 응답
    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CheckIdResponse {
        private Boolean isOk;
    }

    // 이메일 인증 코드 전송 및 재전송 요청
    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyEmailRequest {
        private String email;
        private LocalDateTime requestTime;
    }

    // 이메일 인증 코드 전송 및 재전송 응답
    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyEmailResponse {
        private Boolean isCodeSent;
    }

    // 이메일 인증 확인 요청
    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConfirmEmailRequest {
        private String email;
        private String verificationCode;
        private LocalDateTime requestTime;
    }

    // 이메일 인증 확인 응답
    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConfirmEmailResponse {
        private Boolean isConfirmed;
    }

    // 회원가입
    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignUpRequest {
        private String id;
        private String password;
        private String nickname;
        private String email;
    }

    // 로그인 요청
    @Data
    @Builder
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String id;
        private String password;
    }

    // 로그인 응답
    @Data
    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {
        private String id;
        private String token;
        private String email;
        private String nickname;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private String id;
        private String nickname;
        private String email;
        private String emailPassword;
        private String imageUrl;

        public static UserResponse from(User user) {
            return UserResponse.builder()
                    .id(user.getId())
                    .nickname(user.getNickname())
                    .email(user.getEmail())
                    .emailPassword(user.getEmailPassword())
                    .imageUrl(user.getImageUrl())
                    .build();
        }
    }

    // 마이 페이지 정보 수정
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String currentPassword;
        private String newPassword;
        private String newNickname;
        private String newEmailPassword;
        private String newImageUrl;
        private Boolean deleteAccount;
    }

    // 마이 페이지 정보 수정 응답
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateResponse {
        Boolean isUpdated;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdatePasswordRequest {

    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdatePasswordResponse {
        
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuitRequest {

    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuitResponse {
        
    }
}
