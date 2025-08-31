package com.workmates.backend.config;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailVerifyConfig {
    
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

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);
        mailSender.setDefaultEncoding("UTF-8");

        mailSender.setJavaMailProperties(applyMailProperties());

        return mailSender;
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
}