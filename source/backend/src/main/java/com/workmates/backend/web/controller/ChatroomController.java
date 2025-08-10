package com.workmates.backend.web;

import com.workmates.backend.service.ChatroomService;
import com.workmates.backend.web.dto.ChatroomDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatrooms")
public class ChatroomController {

    private final ChatroomService chatroomService;

    @PostMapping
    public ResponseEntity<ChatroomDTO.Response> create(@RequestBody ChatroomDTO.CreateRequest request) {
        return ResponseEntity.ok(chatroomService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<ChatroomDTO.Response>> findAll() {
        return ResponseEntity.ok(chatroomService.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        chatroomService.delete(id);
        return ResponseEntity.noContent().build();
    }
}