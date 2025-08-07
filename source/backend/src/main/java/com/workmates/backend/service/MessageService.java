package com.workmates.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.domain.Chatroom;
import com.workmates.backend.domain.Message;
import com.workmates.backend.domain.User;
import com.workmates.backend.repository.ChatroomRepository;
import com.workmates.backend.repository.MessageRepository;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.web.dto.MessageDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatroomRepository chatroomRepository;
    private final UserRepository userRepository;
    private final MessageBroadcastService broadcastService;
    @Transactional
    public Message sendMessage(Long chatroomId, Long userId, String content) {
        Chatroom chatroom = chatroomRepository.findById(chatroomId)
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 없습니다."));

        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 없습니다."));

        Message message = new Message(chatroom, sender, content);
        return messageRepository.save(message);
    }

    
    @Transactional(readOnly = true)
    public List<Message> getMessages(Long chatroomId) {
        return messageRepository.findAllByChatroomIdAndDeletedFalseOrderByCreatedAtAsc(chatroomId);
    }

    @Transactional
    public MessageDTO.ChatSocketResponse editMessage(Long messageId, Long editorId, String newContent) {
        Message message = messageRepository.findByIdAndDeletedFalse(messageId)
            .orElseThrow(() -> new IllegalArgumentException("삭제할 메시지를 찾을 수 없습니다."));

        if (!message.getSender().getId().equals(editorId)) {
            throw new IllegalStateException("본인의 메시지만 수정할 수 있습니다.");
        }

        message.updateContent(newContent); // content 필드 수정
        MessageDTO.ChatSocketResponse dto = MessageDTO.ChatSocketResponse.from(message);
        broadcastService.sendUpdated(dto); // WebSocket 전송

        return dto;
    }
    @Transactional
    public void deleteMessage(Long messageId, Long editorId) {
        Message message = messageRepository.findByIdAndDeletedFalse(messageId)
            .orElseThrow(() -> new IllegalArgumentException("삭제할 메시지를 찾을 수 없습니다."));

        if (!message.getSender().getId().equals(editorId)) {
            throw new IllegalStateException("본인의 메시지만 삭제할 수 있습니다.");
        }

        message.markAsDeleted(); // deleted = true 처리
        broadcastService.sendDeleted(message.getChatroom().getId(), message.getId()); // WebSocket 전송
    }
}
