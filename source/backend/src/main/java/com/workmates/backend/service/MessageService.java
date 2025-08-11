package com.workmates.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.domain.Lounge;
import com.workmates.backend.domain.Message;
import com.workmates.backend.domain.User;
import com.workmates.backend.repository.LoungeRepository;
import com.workmates.backend.repository.MessageRepository;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.web.dto.MessageDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final LoungeRepository loungeRepository;
    private final UserRepository userRepository;
    private final MessageBroadcastService broadcastService;
    @Transactional
    public Message sendMessage(Long loungeId, String userId, String content) {
        Lounge lounge = loungeRepository.findById(loungeId)
                .orElseThrow(() -> new IllegalArgumentException("라운지가 존재하지 않습니다."));

        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        Message message = new Message(lounge.getId(), sender.getId(), content);
        return messageRepository.save(message);
    }

    
    @Transactional(readOnly = true)
    public List<Message> getMessages(Long loungeId) {
        return messageRepository.findAllByLoungeIdAndIsDeletedFalse(loungeId);
    }

    @Transactional
    public MessageDto.ChatSocketResponse editMessage(Long messageId, String editorId, String newContent) {
        Message message = messageRepository.findByIdAndIsDeletedFalse(messageId)
            .orElseThrow(() -> new IllegalArgumentException("삭제할 메시지를 찾을 수 없습니다."));

        if (!message.getWriterId().equals(editorId)) {
            throw new IllegalStateException("본인의 메시지만 수정할 수 있습니다.");
        }

        message.setContent(newContent); // content 필드 수정
        MessageDto.ChatSocketResponse dto = MessageDto.ChatSocketResponse.from(message);
        broadcastService.sendUpdated(dto); // WebSocket 전송

        return dto;
    }
    @Transactional
    public void deleteMessage(Long messageId, String editorId) {
        Message message = messageRepository.findByIdAndIsDeletedFalse(messageId)
            .orElseThrow(() -> new IllegalArgumentException("삭제할 메시지를 찾을 수 없습니다."));

        if (!message.getWriterId().equals(editorId)) {
            throw new IllegalStateException("본인의 메시지만 삭제할 수 있습니다.");
        }

        message.setIsDeleted(true); // deleted = true 처리
        broadcastService.sendDeleted(message.getLoungeId(), message.getId()); // WebSocket 전송
    }
}
