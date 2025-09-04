// ✅ 기존 UserDTO 기준으로 변경된 AuthController
package com.workmates.backend.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.workmates.backend.service.UserService;
import com.workmates.backend.web.dto.UserDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/auth/check-id") // 회원가입 - 아이디 중복확인
    public ResponseEntity<UserDto.CheckIdResponse> checkId(@Valid @RequestBody UserDto.CheckIdRequest request) {
        return ResponseEntity.ok(userService.checkId(request));
    }
    
    @PostMapping("/auth/verify-email") // 회원가입 - 이메일 중복확인 및 인증 절차 시작/인증 코드 재전송
    public ResponseEntity<UserDto.VerifyEmailResponse> verifyEmail(@Valid @RequestBody UserDto.VerifyEmailRequest request) {
        return ResponseEntity.ok(userService.verifyEmail(request));
    }

    @PostMapping("/auth/confirm-email") // 회원가입 - 이메일 인증 시도
    public ResponseEntity<UserDto.ConfirmEmailResponse> confirmEmail(@Valid @RequestBody UserDto.ConfirmEmailRequest request) {
        return ResponseEntity.ok(userService.confirmEmail(request));
    }
    
    @PostMapping("/auth/signup") // 회원가입
    public ResponseEntity<UserDto.UserResponse> signUp(@Valid @RequestBody UserDto.SignUpRequest request) {
        return ResponseEntity.ok(userService.signUp(request));
    }

    @PostMapping("/auth/login") // 로그인 
    public ResponseEntity<UserDto.LoginResponse> login(@Valid @RequestBody UserDto.LoginRequest request) {
        UserDto.LoginResponse loginResponse = userService.login(request);

        return ResponseEntity.ok(loginResponse);
    }

    //토큰 파싱을 직접 하지 말고 똑같이 @AuthenticationPrincipal로 바꿀 수 있다. 기존코드와 차이 확인.
    @GetMapping("/user-info/{id}")
    public ResponseEntity<UserDto.UserResponse> getUserInfo(
            @PathVariable String id,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
        return ResponseEntity.ok(userService.getUserInfo(principal.getUsername()));
    }

    @PostMapping("/user-info/{id}")
    public ResponseEntity<UserDto.UserResponse> updateUserInfo(
            @PathVariable String id,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
            @Valid @RequestBody UserDto.UpdateRequest request) {
        return ResponseEntity.ok(userService.updateUserInfo(id, request));
    }

    @PostMapping("/user-info/{id}/update-password")
    public ResponseEntity<UserDto.UpdatePasswordResponse> updateUserPassword(
        @PathVariable String id,
        @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
        @Valid @RequestBody UserDto.UpdatePasswordRequest request
    ) {
        return ResponseEntity.ok(userService.updateUserPassword(id, request));
    }

    @PostMapping("user-info/{id}/quit")
    public ResponseEntity<UserDto.QuitResponse> quit(
        @PathVariable String id,
        @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
        @Valid @RequestBody UserDto.QuitRequest request
    ) {
        return ResponseEntity.ok(userService.quit(id, request));
    }

}
