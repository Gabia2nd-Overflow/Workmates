// com.workmates.backend.web.controller.PostController
package com.workmates.backend.web.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.workmates.backend.service.PostService;
import com.workmates.backend.web.dto.PostDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/workshops/{workshopId}/threads")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    /** 특정 Thread의 게시글 목록 */
    @GetMapping("/{threadId}/posts")
    public ResponseEntity<List<PostDto.Response>> list(
            @PathVariable Long workshopId, // TODO: thread–workshop 정합성 검증에 사용
            @PathVariable Long threadId
    ) {
        return ResponseEntity.ok(postService.getPostsByThread(threadId));
    }

    /** 게시글 생성 */
    @PostMapping("/{threadId}/posts")
    public ResponseEntity<PostDto.Response> create(
            @PathVariable Long workshopId,
            @PathVariable Long threadId,
            @RequestBody PostDto.CreateRequest req,
            @AuthenticationPrincipal(expression = "username") String username
    ) {
        // nickname은 서비스에서 username으로 fallback 하도록 null 전달
        return ResponseEntity.ok(postService.create(threadId, req, username, null));
    }

    /** 게시글 단건 조회 */
    @GetMapping("/{threadId}/posts/{postId}")
    public ResponseEntity<PostDto.Response> get(
            @PathVariable Long workshopId,
            @PathVariable Long threadId,
            @PathVariable Long postId
    ) {
        return ResponseEntity.ok(postService.getPostById(postId));
    }

    /** 게시글 수정 */
    @PatchMapping("/{threadId}/posts/{postId}")
    public ResponseEntity<PostDto.Response> update(
            @PathVariable Long workshopId,
            @PathVariable Long threadId,
            @PathVariable Long postId,
            @RequestBody PostDto.UpdateRequest req,
            @AuthenticationPrincipal(expression = "username") String username
    ) {
        return ResponseEntity.ok(postService.update(postId, req, username));
    }

    /** 게시글 삭제(소프트) */
    @DeleteMapping("/{threadId}/posts/{postId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long workshopId,
            @PathVariable Long threadId,
            @PathVariable Long postId,
            @AuthenticationPrincipal(expression = "username") String username
    ) {
        postService.softDelete(postId, username);
        return ResponseEntity.noContent().build();
    }

    /** (옵션) 조회수 증가 */
    @PatchMapping("/{threadId}/posts/{postId}/views")
    public ResponseEntity<Void> increaseViews(
            @PathVariable Long workshopId,
            @PathVariable Long threadId,
            @PathVariable Long postId
    ) {
        postService.increaseViews(postId);
        return ResponseEntity.noContent().build();
    }
}