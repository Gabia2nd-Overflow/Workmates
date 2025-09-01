package com.workmates.backend.config;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailVerificationConfig {
    
    @Value("${spring.mail.host}")
    private String host;

    @Value("${spring.mail.port}")
    private int port;

    @Value("${spring.mail.username}")
    private String username;

    @Value("${spring.mail.password}")
    private String password;

    @Value("${spring.mail.properties.mail.smtp.auth}")
    private boolean smtpAuth;

    @Value("${spring.mail.properties.mail.smtp.starttls.enable}")
    private boolean starttlsEnable;

    @Value("${spring.mail.properties.mail.smtp.starttls.required}")
    private boolean starttlsRequired;

    @Value("${spring.mail.properties.mail.smtp.timeout}")
    private int timeout;

    @Value("${spring.mail.properties.mail.smtp.connectiontimeout}")
    private int connectiontimeout;

    @Bean
    public JavaMailSenderImpl javaMailSender() {
        JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();
        
        javaMailSender.setHost(host);
        javaMailSender.setPort(port);
        javaMailSender.setUsername(username);
        javaMailSender.setPassword(password);
        javaMailSender.setDefaultEncoding("UTF-8");
        javaMailSender.setJavaMailProperties(applyMailProperties());

        return javaMailSender;
    }

    private Properties applyMailProperties() {
        Properties mailProperties = new Properties();

        mailProperties.setProperty("mail.transport.protocol", "smtp");
        mailProperties.setProperty("mail.smtp.auth", String.valueOf(smtpAuth));
        mailProperties.setProperty("mail.smtp.starttls.enable", String.valueOf(starttlsEnable));
        mailProperties.setProperty("mail.smtp.starttls.required", String.valueOf(starttlsRequired));
        mailProperties.setProperty("mail.smtp.connectiontimeout", String.valueOf(connectiontimeout));
        mailProperties.setProperty("mail.smtp.timeout", String.valueOf(timeout));
        mailProperties.setProperty("mail.mime.charset", "UTF-8");

        return mailProperties;
    }
}