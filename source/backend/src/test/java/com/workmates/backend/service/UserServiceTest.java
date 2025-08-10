package com.workmates.backend.service;

import com.workmates.backend.domain.User;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.web.dto.UserDto.SignUpRequest;
import com.workmates.backend.web.dto.UserDto;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void 회원가입_정상작동_테스트() {
        // given
        SignUpRequest request = SignUpRequest.builder()
                .id("testuser")
                .password("1234")
                .nickname("테스터")
                .build();

        // when
        UserDto.UserResponse savedUser = userService.signUp(request);

        // then - 1단계: 서비스 응답값 검증
        assertThat(savedUser.getUsername()).isEqualTo("testuser");

        // then
        Optional<User> result = userRepository.findByUsername("testuser");
        assertThat(result).isPresent();
        assertThat(result.get().getNickname()).isEqualTo("테스터");
    }

    @AfterEach
    void cleanUp() {
        userRepository.deleteAll();
    }
}