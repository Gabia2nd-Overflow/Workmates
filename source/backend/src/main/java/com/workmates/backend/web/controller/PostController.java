package com.workmates.backend.web.controller;

import com.workmates.backend.domain.Post;
import com.workmates.backend.service.PostService;
import com.workmates.backend.web.dto.PostDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 특정 게시글 조회
    @GetMapping("/{id}")
    public ResponseEntity<PostDto.Response> getPost(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        return ResponseEntity.ok(PostDto.Response.from(post));
    }

    // 게시글 조회수 증가 (JWT 필요없음, 누구나 증가 가능)
    @PostMapping("/{id}/views")
    public ResponseEntity<Void> increaseViews(@PathVariable Long id) {
        postService.increaseViews(id);
        return ResponseEntity.ok().build();
    }

    // 특정 게시글 댓글 조회
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<PostDto.CommentResponse>> getComments(@PathVariable Long id) {
        List<PostDto.CommentResponse> comments = postService.getComments(id);
        return ResponseEntity.ok(comments);
    }

    // 댓글 작성 (JWT 필요)
    @PostMapping("/{id}/comments")
    public ResponseEntity<PostDto.CommentResponse> createComment(
            @PathVariable Long id,
            @RequestBody @Valid PostDto.CommentRequest request,
            @RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.replace("Bearer ", "");
        PostDto.CommentResponse comment = postService.createComment(id, request, token);
        return ResponseEntity.ok(comment);
    }
}
