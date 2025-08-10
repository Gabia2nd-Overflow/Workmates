package com.workmates.backend.service;

import lombok.RequiredArgsConstructor;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.workmates.backend.web.dto.MessageDto;

@Component
@RequiredArgsConstructor
public class MessageBroadcastService {

    private final SimpMessagingTemplate messagingTemplate;

    private String topic(Long chatroomId) {
        return "/sub/chatrooms." + chatroomId;
    }

    public void sendCreated(MessageDto.ChatSocketResponse response) {
        String destination = "/sub/chatrooms." + response.getChatroomId();
        messagingTemplate.convertAndSend(destination, response);
    }

    public void sendUpdated(MessageDto.ChatSocketResponse response) {
        String destination = "/sub/chatrooms." + response.getChatroomId();
        messagingTemplate.convertAndSend(destination, response);
    }

    public void sendDeleted(Long chatroomId, Long messageId) {
        messagingTemplate.convertAndSend("/sub/chatrooms." + chatroomId, messageId);
    }
}