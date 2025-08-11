package com.workmates.backend.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.workmates.backend.domain.Lounge;
import com.workmates.backend.domain.Message;
import com.workmates.backend.domain.User;
import com.workmates.backend.repository.LoungeRepository;
import com.workmates.backend.repository.MessageRepository;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.web.dto.MessageDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatSocketService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final LoungeRepository loungeRepository;
    private final MessageBroadcastService broadcastService; // ✅ 주입

    public MessageDto.ChatSocketResponse saveAndSend(MessageDto.ChatSocketRequest request) {

        // 1. 유저, 채팅방 조회
        User writer = userRepository.findById(request.getWriterId())
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재하지 않습니다."));
        Lounge lounge = loungeRepository.findById(request.getLoungeId())
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다."));

        // 2. 메시지 저장
        Message message = Message.builder()
                .loungeId(lounge.getId())
                .writerId(writer.getId())
                .content(request.getContent())
                .build();
        Message saved = messageRepository.save(message);
        
        // 3. 응답 DTO 생성
        MessageDto.ChatSocketResponse response = MessageDto.ChatSocketResponse.from(saved);

        broadcastService.sendCreated(response); // ✅ 여기로 위임

        log.info("채팅 메시지 전송 완료: {}", response);
        return response;
    }
}
