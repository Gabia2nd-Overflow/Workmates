package com.workmates.backend.config;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import lombok.*;

@Data
public class MailConfig {

    // 해당 MailConfig의 대상인 사용자
    private final String userId;
    private final JavaMailSender mailSender;

    // 공통
    private String username;
    private String password;
    
    // 송신 세팅
    private String sendingProtocol;
    private String sendingHost;
    private String sendingPort;

    // 수신 세팅
    private String receivingProtocol;
    private String receivingHost;
    private String receivingPort;

    public MailConfig(String userId) {
        this.userId = userId;
        mailSender = new JavaMailSenderImpl();
    }
}
