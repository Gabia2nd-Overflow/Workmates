package com.workmates.backend.web.controller;

import com.workmates.backend.web.dto.PostDto;
import com.workmates.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/threads/{threadId}/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<?> createPost(@PathVariable Long threadId,
                                        @RequestBody PostDto.Request request,
                                        @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            PostDto.Response response = postService.createPost(threadId, request, token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping
    public List<PostDto.Response> getPosts(@PathVariable Long threadId) {
        return postService.getPostsByThread(threadId);
    }
}
