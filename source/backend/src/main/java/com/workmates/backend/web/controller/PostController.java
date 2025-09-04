package com.workmates.backend.web.controller;

import com.workmates.backend.domain.Post;
import com.workmates.backend.service.PostService;
import com.workmates.backend.web.dto.PostDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import jakarta.validation.Valid;
import java.util.List;


@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostDto.Response> createPost(
            @RequestBody PostDto.Request request,
            @AuthenticationPrincipal User principal
    ) {
        String username = principal.getUsername(); // JWT에서 추출된 username
        PostDto.Response response = postService.createPost(request, username);
        return ResponseEntity.ok(response);
    }

    // 특정 게시글 조회
<<<<<<< HEAD
    @GetMapping("/{postId}")
    public ResponseEntity<PostDto.Response> getPost(@PathVariable Long postId) {
        Post post = postService.getPostById(id);
        return ResponseEntity.ok(PostDto.Response.from(post));
=======
    @GetMapping("/{id}")
    public ResponseEntity<PostDto.Response> getPost(@PathVariable Long id) {
        PostDto.Response response = postService.getPostById(id);
        return ResponseEntity.ok(response);
>>>>>>> 5d4567d3411b5da87b8597c527f310d468205364
    }

    // 게시글 조회수 증가 (JWT 필요없음, 누구나 증가 가능)
    @PostMapping("/{id}/views")
    public ResponseEntity<Void> increaseViews(@PathVariable Long id) {
        postService.increaseViews(id);
        return ResponseEntity.ok().build();
    }
}
