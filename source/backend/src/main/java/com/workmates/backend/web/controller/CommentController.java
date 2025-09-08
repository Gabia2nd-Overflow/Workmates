package com.workmates.backend.web.controller;

import com.workmates.backend.service.CommentService;
import com.workmates.backend.web.dto.CommentDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/workshops/{workshopId}/threads/{threadId}/posts/{postId}/comments")
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public Page<CommentDto.Response> list(
        @PathVariable Long workshopId,
        @PathVariable Long threadId,
        @PathVariable Long postId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return commentService.list(workshopId, threadId, postId, PageRequest.of(page, size));
    }

    @PostMapping
    public CommentDto.Response create(
        @PathVariable Long workshopId,
        @PathVariable Long threadId,
        @PathVariable Long postId,
        @Valid @RequestBody CommentDto.CreateRequest req,
        Principal principal
    ) {
        String userId = principal.getName();
        String nickname = userId; // TODO: JWT 'nickname' 클레임 사용 시 치환
        return commentService.create(workshopId, threadId, postId, userId, nickname, req);
    }

    @PatchMapping("/{commentId}")
    public CommentDto.Response update(
        @PathVariable Long workshopId,
        @PathVariable Long threadId,
        @PathVariable Long postId,
        @PathVariable Long commentId,
        @Valid @RequestBody CommentDto.UpdateRequest req,
        Principal principal
    ) {
        String userId = principal.getName();
        return commentService.update(workshopId, threadId, postId, commentId, userId, req);
    }

    @DeleteMapping("/{commentId}")
    public void delete(
        @PathVariable Long workshopId,
        @PathVariable Long threadId,
        @PathVariable Long postId,
        @PathVariable Long commentId,
        Principal principal
    ) {
        String userId = principal.getName();
        commentService.delete(workshopId, threadId, postId, commentId, userId);
    }
}