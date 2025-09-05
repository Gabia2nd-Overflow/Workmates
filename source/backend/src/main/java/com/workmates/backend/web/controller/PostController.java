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
@RequestMapping("/api/workshops/{workshopId}/threads/{threadId}/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;


    @GetMapping
    public ResponseEntity<List<PostDto.Response>> getPostsByThread(
            @PathVariable Long workshopId,
            @PathVariable Long threadId
    ) {
        List<PostDto.Response> posts = postService.getPostsByThread(threadId);
        return ResponseEntity.ok(posts);
    }

    @PostMapping
    public ResponseEntity<PostDto.Response> createPost(
            @PathVariable Long workshopId,
            @PathVariable Long threadId,
            @RequestBody PostDto.Request request,
            @AuthenticationPrincipal User principal
    ) {
        request.setThreadId(threadId);
        PostDto.Response response = postService.createPost(request, principal.getUsername());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{postId}/views")
    public ResponseEntity<Void> increaseViews(@PathVariable Long postId) {
        postService.increaseViews(postId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDto.Response> getPostById(
            @PathVariable Long workshopId,
            @PathVariable Long threadId,
            @PathVariable Long postId
    ) {
        PostDto.Response response = postService.getPostById(postId);
        return ResponseEntity.ok(response);
    }
    
}
