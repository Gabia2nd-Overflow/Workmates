package com.workmates.backend.web;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.workmates.backend.service.ChatSocketService;
import com.workmates.backend.web.dto.MessageDTO;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
public class ChatSocketController {

    private final ChatSocketService chatSocketService;

    @MessageMapping("/chat.send") // 클라이언트가 pub/chat.send 로 메시지 전송
    @SendTo("/sub/chatroom.{chatroomId}") // 구독자들에게 메시지 전송
    public MessageDTO.ChatSocketResponse handleChatSocket(
            MessageDTO.ChatSocketRequest request) {

        return chatSocketService.saveAndSend(request);
    }
    /**
     * WebSocket으로 메시지를 수신하여 처리.
     * 클라이언트 → /pub/chat.send 로 메시지 전송 시 실행됨.
     */
}