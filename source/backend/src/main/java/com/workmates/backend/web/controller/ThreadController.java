package com.workmates.backend.web.controller;

import com.workmates.backend.service.ThreadService;
import com.workmates.backend.web.dto.ThreadDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workshops/{workshopId}/threads")
@RequiredArgsConstructor
public class ThreadController {

    private final ThreadService threadService;

@PostMapping
public ResponseEntity<ThreadDto.Response> createThread(
        @PathVariable Long workshopId,
        @RequestBody ThreadDto.Request request
) {
    request.setWorkshopId(workshopId); // 강제로 DTO에 세팅
    return ResponseEntity.ok(threadService.createThread(request));
}


    @GetMapping
    public ResponseEntity<List<ThreadDto.Response>> getThreadsByWorkshop(@PathVariable Long workshopId) {
        return ResponseEntity.ok(threadService.getThreadsByWorkshop(workshopId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThreadDto.Response> getThreadById(@PathVariable Long id) {
        return ResponseEntity.ok(threadService.getThreadById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ThreadDto.Response> updateThread(
            @PathVariable Long id,
            @RequestBody ThreadDto.Request request) {
        return ResponseEntity.ok(threadService.updateThread(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteThread(@PathVariable Long id) {
        threadService.deleteThread(id);
        return ResponseEntity.noContent().build();
    }
}
