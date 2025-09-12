package com.workmates.backend.service;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.config.MailConfig;
import com.workmates.backend.repository.MailRepository;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.web.dto.MailDto.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MailService {
    
    private final MailRepository mailRepository;
    private final UserRepository userRepository;
    private final ConcurrentHashMap<String, MailConfig> mailConfig = new ConcurrentHashMap<>();

    public ReadMailResponse readMail(String id, ReadMailRequest request) {
        return ReadMailResponse.builder().build();
    }

    @Transactional
    public ReceiveMailResponse receiveMail(String id, ReceiveMailRequest request) {
        return ReceiveMailResponse.builder().build();
    }

    @Transactional
    public SendMailResponse sendMail(String id, SendMailRequest request) {
        return SendMailResponse.builder().build();
    }
}

