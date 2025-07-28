package com.workmates.backend.service;

import com.workmates.backend.domain.Chatroom;
import com.workmates.backend.repository.ChatroomRepository;
import com.workmates.backend.web.dto.ChatroomDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatroomService {

    private final ChatroomRepository chatroomRepository;

    //생성
    public ChatroomDTO.Response create(ChatroomDTO.CreateRequest request) {
        Chatroom chatroom = Chatroom.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        return ChatroomDTO.Response.fromEntity(chatroomRepository.save(chatroom));
    }

    //조회
    public List<ChatroomDTO.Response> findAll() {
        return chatroomRepository.findAll().stream()
                .map(ChatroomDTO.Response::fromEntity)
                .collect(Collectors.toList());
    }

    //삭제
    public void delete(Long chatroomId) {
        chatroomRepository.deleteById(chatroomId);
    }
}