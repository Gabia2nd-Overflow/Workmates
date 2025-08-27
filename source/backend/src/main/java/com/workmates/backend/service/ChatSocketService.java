package com.workmates.backend.service;

import org.springframework.stereotype.Service;


import com.workmates.backend.domain.Lounge;
import com.workmates.backend.domain.Message;
import com.workmates.backend.domain.User;
import com.workmates.backend.repository.LoungeRepository;
import com.workmates.backend.repository.MessageRepository;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.web.dto.MessageDto;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatSocketService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final LoungeRepository loungeRepository;
    private final MessageBroadcastService broadcastService;

    @Transactional
    public MessageDto.ChatSocketResponse saveAndSend(MessageDto.ChatSocketRequest req) {
        // 유저/라운지 조회
        User writer = userRepository.findById(req.getWriterId())
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재하지 않습니다."));
        Lounge lounge = loungeRepository.findById(req.getLoungeId())
                .orElseThrow(() -> new IllegalArgumentException("라운지가 존재하지 않습니다."));

        // 라운지-워크샵 소속 검증
        if (!lounge.getWorkshopId().equals(req.getWorkshopId())) {
            throw new IllegalArgumentException("라운지가 요청한 워크샵에 속하지 않습니다.");
        }

        // 메시지 저장
        Message saved = messageRepository.save(
                new Message(lounge.getId(), writer.getId(), req.getContent())
        );

        // 응답 DTO + 브로드캐스트
        MessageDto.ChatSocketResponse resp = MessageDto.ChatSocketResponse.from(saved, req.getWorkshopId());
        broadcastService.sendCreated(resp);
        log.info("채팅 메시지 전송: {}", resp);
        return resp;
    }
}