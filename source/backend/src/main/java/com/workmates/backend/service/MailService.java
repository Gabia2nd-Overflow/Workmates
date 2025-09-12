package com.workmates.backend.service;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.config.MailConfig;
import com.workmates.backend.domain.Mail;
import com.workmates.backend.repository.MailRepository;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.web.dto.MailDto.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MailService {
    
    private final MailRepository mailRepository;
    private final UserRepository userRepository;
    private final ConcurrentHashMap<String, MailConfig> mailConfigCache = new ConcurrentHashMap<>();

    public ReadMailResponse readMail(String id, Long mailId) {
        Optional<Mail> mail = mailRepository.findById(mailId);
        if(!mail.isPresent()) {
            throw new IllegalArgumentException("요청받은 메일을 찾을 수 없습니다.");
        }

        Mail mailEntity = mail.get();
        if(!mailEntity.getUserId().equals(id)) {
            throw new IllegalArgumentException("해당 메일에 접근할 수 없습니다.");
        }
        
        return ReadMailResponse.builder().build();
    }

    @Transactional
    public ReceiveMailResponse receiveMail(String id) {
        MailConfig config = mailConfigCache.get(id);

        if(config == null) {

        }
        
        return ReceiveMailResponse.builder().build();
    }

    @Transactional
    public SendMailResponse sendMail(String id, SendMailRequest request) {
        MailConfig config = mailConfigCache.get(id);

        if(config == null) {

        }

        return SendMailResponse.builder().build();
    }
}

