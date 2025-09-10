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

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        MailConfig other = (MailConfig) obj;
        if (userId == null) {
            if (other.userId != null)
                return false;
        } else if (!userId.equals(other.userId))
            return false;
        return true;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((userId == null) ? 0 : userId.hashCode());
        return result;
    }
}
