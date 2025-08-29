// ✅ 기존 UserDTO 기준으로 변경된 AuthController
package com.workmates.backend.web.controller;

import com.workmates.backend.config.JwtTokenProvider;
import com.workmates.backend.service.UserService;
import com.workmates.backend.web.dto.UserDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/signup/check/id") // 회원가입 - 아이디 중복확인
    public ResponseEntity<UserDto.CheckUserid> checkUserId() {
        return ResponseEntity.ok();
    }
    
    @PostMapping("/signup/auth/email") // 회원가입 - 이메일 중복확인 및 인증
    public ResponseEntity<UserDto.AuthEmail> authEmail() {
        return ResponseEntity.ok();
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
