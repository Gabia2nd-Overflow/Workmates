// ✅ 기존 UserDTO 기준으로 변경된 AuthController
package com.workmates.backend.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workmates.backend.config.JwtTokenProvider;
import com.workmates.backend.service.UserService;
import com.workmates.backend.web.dto.UserDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

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

    @PostMapping("/auth/login")
    public ResponseEntity<UserDto.LoginResponse> login(@Valid @RequestBody UserDto.LoginRequest request) {
        UserDto.LoginResponse loginResponse = userService.login(request);
        String token = jwtTokenProvider.generateToken(loginResponse.getId());
        loginResponse.setToken(token);
        return ResponseEntity.ok(loginResponse);
    }

    //토큰 파싱을 직접 하지 말고 똑같이 @AuthenticationPrincipal로 바꿀 수 있다. 기존코드와 차이 확인.
    @GetMapping("/user-info")
    public ResponseEntity<UserDto.UserResponse> getMyInfo(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
        return ResponseEntity.ok(userService.getUserInfo(principal.getUsername()));
    }

    @PutMapping("/user-info")
    public ResponseEntity<UserDto.UserResponse> updateMyInfo(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
            @Valid @RequestBody UserDto.UpdateRequest request) {
        return ResponseEntity.ok(userService.updateUser(principal.getUsername(), request));
    }
}
