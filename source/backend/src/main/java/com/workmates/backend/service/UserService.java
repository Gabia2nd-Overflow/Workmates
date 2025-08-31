package com.workmates.backend.service;

import java.util.Random;
import java.util.regex.Pattern;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.config.MailVerificationConfig;
import com.workmates.backend.constant.DomainConstants;
import com.workmates.backend.constant.ServiceConstants;
import com.workmates.backend.domain.EmailVerification;
import com.workmates.backend.domain.User;
import com.workmates.backend.repository.EmailVerificationRepository;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.web.dto.UserDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    
    private final UserRepository userRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailVerificationConfig mailVerificationConfig;

    public UserDto.CheckIdResponse checkId(UserDto.CheckIdRequest request) {
        if(!Pattern.matches(ServiceConstants.ID_REGEX, request.getId())) { // 정규표현식에 위반되는 아이디가 요청으로 전달된 경우
            throw new IllegalArgumentException("올바르지 않은 아이디입니다.");
        }

        if(userRepository.existsById(request.getId())) { // DB에 이미 존재하는 아이디가 요청으로 전달된 경우
            throw new IllegalArgumentException("이미 사용중인 아이디입니다.");
        }

        return UserDto.CheckIdResponse.builder() // 사용에 문제없는 아이디임을 전달
                .isOk(true)
                .build();
    }

    @Transactional
    public UserDto.VerifyEmailResponse verifyEmail(UserDto.VerifyEmailRequest request) {
        if(!Pattern.matches(ServiceConstants.EMAIL_REGEX, request.getEmail())) { // 정규표현식에 위반되는 이메일이 요청으로 전달된 경우
            throw new IllegalArgumentException("올바르지 않은 이메일입니다.");
        }

        EmailVerification emailVerification = new EmailVerification(request.getEmail(), generateCode(), request.getRequestTime());

        if(emailVerificationRepository.findByEmail(request.getEmail()).isPresent()) { // DB에 이미 이메일이 존재한다면 재전송 요청이므로 DB를 갱신
            emailVerificationRepository.updateCode(emailVerification.getEmail(), emailVerification.getCode(), request.getRequestTime());
        } else { // 그렇지 않다면 새로 인증하는 이메일이므로 DB에 요청을 삽입
            emailVerificationRepository.save(emailVerification);
        }

        mailVerificationConfig.sendVerificationEmail(emailVerification.getEmail(), emailVerification.getCode());

        return UserDto.VerifyEmailResponse.builder()
                .isCodeSent(true)
                .build();
    }

    @Transactional
    public UserDto.ConfirmEmailResponse confirmEmail(UserDto.ConfirmEmailRequest request) {
        if(!Pattern.matches(ServiceConstants.EMAIL_REGEX, request.getEmail()) ||
            !Pattern.matches(ServiceConstants.CODE_REGEX, request.getVerificationCode())) { // 정규표현식에 위반되는 이메일이 요청으로 전달된 경우, 잘못된 코드가 요청으로 전달된 경우
            throw new IllegalArgumentException("올바르지 않은 인증 요청입니다.");
        }

        EmailVerification emailVerification = emailVerificationRepository.findByEmail(request.getEmail()) // DB에서 요청과 이메일이 일치하는 코드가 있는지 확인하고 존재하지 않으면 에러 발생
                        .orElseThrow(() -> new IllegalArgumentException("올바르지 않은 인증 요청입니다. 이메일을 확인해주세요.")); 
        

        if(request.getRequestTime().isAfter(emailVerification.getExpiresAt())) { // 코드가 만료된 경우
            throw new IllegalArgumentException("이미 만료된 코드입니다.");
        }

        return UserDto.ConfirmEmailResponse.builder() // 올바른 인증 요청이라면 코드의 일치 여부를 반환
                .isConfirmed(request.getVerificationCode().equals(emailVerification.getCode()))
                .build();
    }

    @Transactional
    public UserDto.UserResponse signUp(UserDto.SignUpRequest request) {

        if(!Pattern.matches(ServiceConstants.ID_REGEX, request.getId()) ||
            !Pattern.matches(ServiceConstants.PW_REGEX, request.getPassword()) ||
            !Pattern.matches(ServiceConstants.NICKNAME_REGEX, request.getNickname()) ||
            !Pattern.matches(ServiceConstants.EMAIL_REGEX, request.getEmail())) { // 가입 요청의 항목들이 정규표현식과 맞지 않을 경우 요청 처리 거부
            throw new IllegalArgumentException("잘못된 가입 요청입니다.");
        }

        // 중복 검사
        if (userRepository.existsById(request.getId())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
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

    private String generateCode() {
        StringBuilder codeBuilder = new StringBuilder();
        Random random = new Random(System.nanoTime());

        for(int i = 0; i < DomainConstants.CODE_LENGTH; ++i) {
            codeBuilder.append((char)(random.nextInt(10) + '0'));
        }

        return codeBuilder.toString();
    }

    
}
