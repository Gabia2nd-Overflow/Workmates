package com.workmates.backend.web.controller;

import com.workmates.backend.service.LoungeService;
import com.workmates.backend.web.dto.LoungeDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatrooms")
public class ChatroomController {

    private final LoungeService chatroomService;

    @PostMapping
    public ResponseEntity<LoungeDto.Response> create(@RequestBody LoungeDto.CreateRequest request) {
        return ResponseEntity.ok(chatroomService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<LoungeDto.Response>> findAll() {
        return ResponseEntity.ok(chatroomService.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        chatroomService.delete(id);
        return ResponseEntity.noContent().build();
    }
}