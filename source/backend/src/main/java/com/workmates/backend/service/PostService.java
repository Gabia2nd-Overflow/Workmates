package com.workmates.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.domain.Post;
import com.workmates.backend.repository.PostRepository;
import com.workmates.backend.web.dto.PostDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    // 단일 게시글 조회
    public PostDto.Response getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));
        return PostDto.Response.from(post);
    }

    // 특정 thread의 게시글 조회
    public List<PostDto.Response> getPostsByThread(Long threadId) {
        return postRepository.findByThreadId(threadId)
                .stream()
                .map(PostDto.Response::from)
                .collect(Collectors.toList());
    }

    // 게시글 생성
    public PostDto.Response createPost(PostDto.Request request, String username) {
        if (request.getThreadId() == null) {
            throw new IllegalArgumentException("threadId는 필수입니다.");
        }

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .category(request.getCategory())
                .author(username)
                .writerId(username)
                .writerNickname(username) // JWT 기반
                .threadId(request.getThreadId()) // 필수
                .createdAt(LocalDateTime.now())
                .writtenAt(LocalDateTime.now())
                .isDeleted(false)
                .views(0)
                .writtenIn("unknown")
                .build();

        postRepository.save(post);
        return PostDto.Response.from(post);
    }

    // 조회수 증가
    @Transactional
    public void increaseViews(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));
        post.setViews(post.getViews() + 1);
    }
}
