package com.workmates.backend.web.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workmates.backend.domain.Message;
import com.workmates.backend.service.MessageService;
import com.workmates.backend.web.dto.MessageDto;
import com.workmates.backend.web.dto.MessageDto.DeleteMessageRequest;
import com.workmates.backend.web.dto.MessageDto.EditMessageRequest;
import com.workmates.backend.web.dto.MessageDto.SendMessageRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatrooms/{chatroomId}/messages")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageDto.MessageResponse> sendMessage(
            @PathVariable Long chatroomId,
            @RequestBody SendMessageRequest request) {
        System.out.println("받은 userId = " + request.getUserId());
        System.out.println("받은 content = " + request.getContent());
        Message message = messageService.sendMessage(
                chatroomId,
                request.getUserId(),
                request.getContent()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(MessageDto.MessageResponse.from(message));
    }

    @GetMapping
    public ResponseEntity<List<MessageDto.MessageResponse>> getMessages(@PathVariable Long chatroomId) {
        List<MessageDto.MessageResponse> messages = messageService.getMessages(chatroomId).stream()
                .map(MessageDto.MessageResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(messages);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<MessageDto.ChatSocketResponse> editMessage(
            @PathVariable("id") Long messageId,
            @RequestBody EditMessageRequest request
    ) {
        MessageDto.ChatSocketResponse updated =
                messageService.editMessage(messageId, request.getSenderId(), request.getContent());

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable("id") Long messageId,
            @RequestBody DeleteMessageRequest request
    ) {
        messageService.deleteMessage(messageId, request.getSenderId());
        return ResponseEntity.noContent().build();
    }
}
