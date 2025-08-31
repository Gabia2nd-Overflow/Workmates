package com.workmates.backend.config;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Configuration
public class MailVerificationConfig {
    
    @Value("${mail-verify.host}")
    private String host;

    @Value("${mail-verify.port}")
    private int port;

    @Value("${mail-verify.username}")
    private String username;

    @Value("${mail-verify.password}")
    private String password;

    @Value("${mail-verify.properties.mail.smtp.auth}")
    private boolean smtpAuth;

    @Value("${mail-verify.properties.mail.smtp.starttls.enable}")
    private boolean starttlsEnable;

    @Value("${mail-verify.properties.mail.smtp.starttls.required}")
    private boolean starttlsRequired;

    @Value("${mail-verify.properties.mail.smtp.timeout}")
    private int timeout;

    @Value("${mail-verify.properties.mail.smtp.connectionTimeout}")
    private int connectionTimeout;

    private final JavaMailSenderImpl javaMailSender;

    public MailVerificationConfig() {
        javaMailSender = new JavaMailSenderImpl();

        javaMailSender.setHost(host);
        javaMailSender.setPort(port);
        javaMailSender.setUsername(username);
        javaMailSender.setPassword(password);
        javaMailSender.setDefaultEncoding("UTF-8");

        javaMailSender.setJavaMailProperties(applyMailProperties());
    }

    private Properties applyMailProperties() {
        Properties mailProperties = new Properties();

        mailProperties.setProperty("mail.transport.protocol", "smtp");
        mailProperties.setProperty("mail.smtp.auth", String.valueOf(smtpAuth));
        mailProperties.setProperty("mail.smtp.starttls.enable", String.valueOf(starttlsEnable));
        mailProperties.setProperty("mail.smtp.starttls.required", String.valueOf(starttlsRequired));

        mailProperties.setProperty("mail.smtp.connectiontimeout", String.valueOf(connectionTimeout));
        mailProperties.setProperty("mail.smtp.timeout", String.valueOf(timeout));

        mailProperties.setProperty("mail.mime.charset", "UTF-8");

        return mailProperties;
    }

    public void sendVerificationEmail(String to, String verificationCode) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8"); 
            
            helper.setFrom(username);
            message.setSubject("Workmates Email Verification Code");
            message.setText("안녕하세요!\n\n" +
                        "이메일 인증을 위해 아래 인증코드를 입력해주세요.\n\n" +
                        "인증코드: " + verificationCode + "\n\n" +
                        "이 코드는 5분 후에 만료됩니다.\n\n");

            javaMailSender.send(message);
        }  catch(MessagingException | MailException e) {
            throw new IllegalArgumentException("인증코드 전송에 실패했습니다.");
        }
    }
}