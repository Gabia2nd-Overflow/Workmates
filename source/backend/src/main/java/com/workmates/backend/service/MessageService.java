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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatroomRepository chatroomRepository;
    private final UserRepository userRepository;

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
        return messageRepository.findAllByChatroomIdOrderByCreatedAtAsc(chatroomId);
    }
}
