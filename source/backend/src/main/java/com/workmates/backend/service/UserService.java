package com.workmates.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.domain.User;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.web.dto.UserDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserDto.UserResponse signUp(UserDto.SignUpRequest request) {
        // 중복 검사
        if (userRepository.existsById(request.getId())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
         // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .id(request.getId())
                .nickname(request.getNickname())
                .email(request.getEmail())
                .password(encodedPassword)
                .build();

        User savedUser = userRepository.save(user);
        return UserDto.UserResponse.from(savedUser);
    }

    public UserDto.LoginResponse login(UserDto.LoginRequest request) {
        User user = userRepository.findById(request.getId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return UserDto.LoginResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .build();
    }

    public UserDto.UserResponse getUserInfo(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        return UserDto.UserResponse.from(user);
    }

    @Transactional
    public UserDto.UserResponse updateUser(String id, UserDto.UpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (request.getNickname() != null) {
            user.setNickname(request.getNickname());
        }
        
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }

        return UserDto.UserResponse.from(user);
    }
}
