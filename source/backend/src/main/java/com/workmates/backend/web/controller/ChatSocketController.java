package com.workmates.backend.web.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import com.workmates.backend.service.ChatSocketService;
import com.workmates.backend.web.dto.MessageDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
public class ChatSocketController {

    private final ChatSocketService chatSocketService;

    @MessageMapping("/workshops.{workshopId}.lounges.{loungeId}.send")
    public void handleChatSocket(@DestinationVariable Long workshopId,
                                 @DestinationVariable Long loungeId,
                                 @Payload MessageDto.SendMessageRequest body) {
        // body: writerId, content
        MessageDto.ChatSocketRequest req = MessageDto.ChatSocketRequest.builder()
                .workshopId(workshopId)
                .loungeId(loungeId)
                .writerId(body.getWriterId())
                .content(body.getContent())
                .build();
        chatSocketService.saveAndSend(req);
    }
}