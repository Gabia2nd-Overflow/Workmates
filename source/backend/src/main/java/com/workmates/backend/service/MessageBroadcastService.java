package com.workmates.backend.service;

import lombok.RequiredArgsConstructor;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.workmates.backend.web.dto.MessageDto;

@Component
@RequiredArgsConstructor
public class MessageBroadcastService {

    private final SimpMessagingTemplate messagingTemplate;

    private String topic(Long workshopId, Long loungeId) {
        return String.format("/sub/workshops.%d.lounges.%d", workshopId, loungeId);
    }

    public void sendCreated(MessageDto.ChatSocketResponse resp) {
        messagingTemplate.convertAndSend(topic(resp.getWorkshopId(), resp.getLoungeId()), resp);
    }

    public void sendUpdated(MessageDto.ChatSocketResponse resp) {
        messagingTemplate.convertAndSend(topic(resp.getWorkshopId(), resp.getLoungeId()), resp);
    }

    public void sendDeleted(Long workshopId, Long loungeId, Long messageId) {
        messagingTemplate.convertAndSend(topic(workshopId, loungeId), messageId);
    }
}