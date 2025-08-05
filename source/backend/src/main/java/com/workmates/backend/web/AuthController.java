// ✅ 기존 UserDTO 기준으로 변경된 AuthController
package com.workmates.backend.web;

import com.workmates.backend.config.JwtTokenProvider;
import com.workmates.backend.service.UserService;
import com.workmates.backend.web.dto.UserDTO;
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

    @PostMapping("/signup")
    public ResponseEntity<UserDTO.UserResponse> signUp(@Valid @RequestBody UserDTO.SignUpRequest request) {
        return ResponseEntity.ok(userService.signUp(request));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO.LoginResponse> login(@Valid @RequestBody UserDTO.LoginRequest request) {
        UserDTO.LoginResponse loginResponse = userService.login(request);
        String token = jwtTokenProvider.generateToken(loginResponse.getUsername());
        loginResponse.setToken(token);
        return ResponseEntity.ok(loginResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO.UserResponse> getMyInfo(@RequestHeader("Authorization") String token) {
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
    public ResponseEntity<UserDTO.UserResponse> updateMyInfo(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody UserDTO.UpdateRequest request) {
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
