package com.workmates.backend.web.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.workmates.backend.service.ChatSocketService;
import com.workmates.backend.web.dto.MessageDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
public class ChatSocketController {

    private final ChatSocketService chatSocketService;

    /**
     * 클라이언트가 /pub/chat.send 로 메시지를 전송하면 이 메서드가 실행됨.
     * 서비스단에서 메시지를 저장하고 구독자에게 직접 전송함.
     */
    @MessageMapping("/chat.send")
    public void handleChatSocket(MessageDto.ChatSocketRequest request) {
        chatSocketService.saveAndSend(request);
    }
}