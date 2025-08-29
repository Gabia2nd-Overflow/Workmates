// ✅ 기존 UserDTO 기준으로 변경된 AuthController
package com.workmates.backend.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workmates.backend.config.JwtTokenProvider;
import com.workmates.backend.service.UserService;
import com.workmates.backend.web.dto.UserDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/check-id") // 회원가입 - 아이디 중복확인
    public ResponseEntity<UserDto.CheckIdResponse> checkId(@Valid @RequestBody UserDto.CheckIdRequest request) {
        return ResponseEntity.ok(userService.checkId(request));
    }
    
    @PostMapping("/verify-email") // 회원가입 - 이메일 중복확인 및 인증 절차 시작/인증 코드 재전송
    public ResponseEntity<UserDto.VerifyEmailResponse> verifyEmail(@Valid @RequestBody UserDto.VerifyEmailRequest request) {
        return ResponseEntity.ok(userService.verifyEmail(request));
    }

    @PostMapping("/verify-email/confirm") // 회원가입 - 이메일 인증 시도
    public ResponseEntity<UserDto.ConfirmEmailResponse> confirmEmail(@Valid @RequestBody UserDto.ConfirmEmailRequest request) {
        return ResponseEntity.ok(userService.confirmEmail(request));
    }
    
    @PostMapping("/signup") // 회원가입
    public ResponseEntity<UserDto.UserResponse> signUp(@Valid @RequestBody UserDto.SignUpRequest request) {
        return ResponseEntity.ok(userService.signUp(request));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto.LoginResponse> login(@Valid @RequestBody UserDto.LoginRequest request) {
        UserDto.LoginResponse loginResponse = userService.login(request);
        String token = jwtTokenProvider.generateToken(loginResponse.getId());
        loginResponse.setToken(token);
        return ResponseEntity.ok(loginResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto.UserResponse> getMyInfo(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            if (jwtTokenProvider.validateToken(jwt)) {
                String username = jwtTokenProvider.getUsernameFromToken(jwt);
                return ResponseEntity.ok(userService.getUserInfo(username));
            }
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto.UserResponse> updateMyInfo(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody UserDto.UpdateRequest request) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            if (jwtTokenProvider.validateToken(jwt)) {
                String username = jwtTokenProvider.getUsernameFromToken(jwt);
                return ResponseEntity.ok(userService.updateUser(username, request));
            }
        }
        return ResponseEntity.badRequest().build();
    }
}
