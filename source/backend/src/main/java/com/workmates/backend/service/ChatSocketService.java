package com.workmates.backend.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.workmates.backend.domain.Chatroom;
import com.workmates.backend.domain.Message;
import com.workmates.backend.domain.User;
import com.workmates.backend.repository.ChatroomRepository;
import com.workmates.backend.repository.MessageRepository;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.web.dto.MessageDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatSocketService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ChatroomRepository chatroomRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public MessageDTO.ChatSocketResponse saveAndSend(MessageDTO.ChatSocketRequest request) {

        // 1. 유저, 채팅방 조회
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재하지 않습니다."));
        Chatroom chatroom = chatroomRepository.findById(request.getChatroomId())
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다."));

        // 2. 메시지 저장
        Message message = Message.builder()
                .chatroom(chatroom)
                .sender(sender)
                .content(request.getContent())
                .build();
        Message saved = messageRepository.save(message);
        
        // 3. 응답 DTO 생성
        MessageDTO.ChatSocketResponse response = MessageDTO.ChatSocketResponse.from(saved);

        // 4. WebSocket 구독자에게 전송
        String destination = "/sub/chatroom." + chatroom.getId(); // 구독 주소
        messagingTemplate.convertAndSend(destination, response);

        log.info("채팅 메시지 전송 완료: {}", response);
        return response;
    }
}
