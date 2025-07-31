package com.workmates.backend.web;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workmates.backend.domain.Message;
import com.workmates.backend.service.MessageService;
import com.workmates.backend.web.dto.MessageDTO;
import com.workmates.backend.web.dto.MessageDTO.SendMessageRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatrooms/{chatroomId}/messages")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageDTO.MessageResponse> sendMessage(
            @PathVariable Long chatroomId,
            @RequestBody SendMessageRequest request) {
        System.out.println("받은 userId = " + request.getUserId());
        System.out.println("받은 content = " + request.getContent());
        Message message = messageService.sendMessage(
                chatroomId,
                request.getUserId(),
                request.getContent()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(MessageDTO.MessageResponse.from(message));
    }

    @GetMapping
    public ResponseEntity<List<MessageDTO.MessageResponse>> getMessages(@PathVariable Long chatroomId) {
        List<MessageDTO.MessageResponse> messages = messageService.getMessages(chatroomId).stream()
                .map(MessageDTO.MessageResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(messages);
    }
}
