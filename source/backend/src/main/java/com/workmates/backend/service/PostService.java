package com.workmates.backend.service;

import com.workmates.backend.Util.JwtUtil;
import com.workmates.backend.domain.Post;
import com.workmates.backend.repository.PostRepository;
import com.workmates.backend.web.dto.PostDto;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final JwtUtil jwtUtil; // JWT 디코딩 유틸 클래스

    // 새 글 작성
    public PostDto.Response createPost(Long threadId, PostDto.Request request, String token) {
        Post post = new Post();
        post.setThreadId(threadId);
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setCategory(request.getCategory());
        post.setCreatedAt(LocalDateTime.now());

        // JWT에서 사용자 정보 추출
        String nickname = jwtUtil.getNicknameFromToken(token);
        String userId = jwtUtil.getUserIdFromToken(token);

        post.setWriterNickname(nickname != null ? nickname : "유저");
        post.setWriterId(userId != null ? userId : "user" + System.currentTimeMillis());
        post.setAuthor(nickname != null ? nickname : "유저");

        Post saved = postRepository.save(post);
        return new PostDto.Response(saved);
    }

    // 특정 Thread 기준 게시글 조회
    public List<PostDto.Response> getPostsByThread(Long threadId) {
        return postRepository.findByThreadId(threadId)
                .stream()
                .map(PostDto.Response::new)
                .collect(Collectors.toList());
    }

    // 조회수 증가
    public void increaseViews(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setViews((post.getViews() == null ? 0 : post.getViews()) + 1);
        postRepository.save(post);
    }
}
