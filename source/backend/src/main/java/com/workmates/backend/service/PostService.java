package com.workmates.backend.service;

import java.time.LocalDateTime;

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

    // 게시글 조회
    public PostDto.Response getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));
        return PostDto.Response.from(post);
    }

    // 게시글 생성
    public PostDto.Response createPost(PostDto.Request request, String username) {
        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .category(request.getCategory())
                .author(username) // JWT에서 추출된 username
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
