package com.workmates.backend.service;

import java.util.Random;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.constant.DomainConstants;
import com.workmates.backend.constant.ServiceConstants;
import com.workmates.backend.domain.EmailVerification;
import com.workmates.backend.domain.User;
import com.workmates.backend.repository.EmailVerificationRepository;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.web.dto.UserDto;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    
    private final UserRepository userRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Value("${spring.mail.username}")
    private String from;
    
    @Autowired 
    private JavaMailSenderImpl javaMailSender;

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

        EmailVerification emailVerification = new EmailVerification(request.getEmail(), generateCode(), request.getRequestTime(), false);

        if(emailVerificationRepository.findByEmail(request.getEmail()).isPresent()) { // DB에 이미 이메일이 존재한다면 재전송 요청이므로 DB를 갱신
            emailVerificationRepository.updateCode(emailVerification.getEmail(), emailVerification.getCode(), emailVerification.getExpiresAt(), emailVerification.getIsConfirmed());
        } else { // 그렇지 않다면 새로 인증하는 이메일이므로 DB에 요청을 삽입
            emailVerificationRepository.save(emailVerification);
        }

        sendVerificationEmail(emailVerification.getEmail(), emailVerification.getCode());

        return UserDto.VerifyEmailResponse.builder()
                .isCodeSent(true)
                .build();
    }

    @Transactional
    public UserDto.ConfirmEmailResponse confirmEmail(UserDto.ConfirmEmailRequest request) {
        if(!Pattern.matches(ServiceConstants.EMAIL_REGEX, request.getEmail()) ||
           !Pattern.matches(ServiceConstants.CODE_REGEX, request.getVerificationCode())) { // 정규표현식에 위반되는 이메일이 요청으로 전달된 경우 또는 잘못된 코드가 요청으로 전달된 경우
                throw new IllegalArgumentException("잘못된 인증 확인 요청입니다.");
        }

        EmailVerification emailVerification = emailVerificationRepository.findByEmail(request.getEmail()) // DB에서 요청과 이메일이 일치하는 코드가 있는지 확인하고 존재하지 않으면 에러 발생
                        .orElseThrow(() -> new IllegalArgumentException("올바르지 않은 인증 요청입니다. 이메일을 확인해주세요.")); 
        

        if(request.getRequestTime().isAfter(emailVerification.getExpiresAt())) { // 코드가 만료된 경우
            throw new IllegalArgumentException("이미 만료된 코드입니다.");
        }

        Boolean result = request.getVerificationCode().equals(emailVerification.getCode());
        
        if(result) {
            emailVerificationRepository.updateCode(emailVerification.getEmail(), emailVerification.getCode(), emailVerification.getExpiresAt(), result);
        }

        return UserDto.ConfirmEmailResponse.builder() // 올바른 인증 요청이라면 코드의 일치 여부를 반환
                .isConfirmed(result)
                .build();
    }

    @Transactional
    public UserDto.UserResponse signUp(UserDto.SignUpRequest request) {

        if(!Pattern.matches(ServiceConstants.ID_REGEX, request.getId())) {
            throw new IllegalArgumentException("잘못된 가입 요청입니다. - 아이디");
        }
        if(!Pattern.matches(ServiceConstants.PW_REGEX, request.getPassword())) {
            throw new IllegalArgumentException("잘못된 가입 요청입니다. - 비밀번호");
        }
        if(!Pattern.matches(ServiceConstants.NICKNAME_REGEX, request.getNickname())) {
            throw new IllegalArgumentException("잘못된 가입 요청입니다. - 닉네임");
        }
        if(!Pattern.matches(ServiceConstants.EMAIL_REGEX, request.getEmail())) {
            throw new IllegalArgumentException("잘못된 가입 요청입니다. - 이메일");
        }

        // 중복 검사
        if(userRepository.existsById(request.getId())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        // 메일 인증 검사
        EmailVerification emailVerification = emailVerificationRepository.findByEmail(request.getEmail()).
                                                orElseThrow(() -> new IllegalArgumentException("인증되지 않은 이메일입니다."));

        if(!emailVerification.getIsConfirmed()) {
            throw new IllegalArgumentException("인증되지 않은 이메일입니다.");
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

    public void sendVerificationEmail(String to, String verificationCode) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8"); 
            
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject("Workmates Email Verification Code");
            helper.setText("안녕하세요!\n\n" +
                        "이메일 인증을 위해 아래 인증코드를 입력해주세요.\n\n" +
                        "인증코드: " + verificationCode + "\n\n" +
                        "이 코드는 5분 후에 만료됩니다.\n\n");

            javaMailSender.send(message);
        }  catch(MessagingException | MailException e) {
            e.printStackTrace();
            throw new IllegalArgumentException("인증코드 전송에 실패했습니다.");
        }
    }
}
