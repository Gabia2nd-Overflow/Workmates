// com.workmates.backend.service.PostService
package com.workmates.backend.service;

import java.time.LocalDateTime;
import java.util.List;

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

    @Transactional(readOnly = true)
    public List<PostDto.Response> getPostsByThread(Long threadId) {
        return postRepository.findByThreadIdAndIsDeletedFalseOrderByCreatedAtDesc(threadId)
            .stream().map(PostDto.Response::from).toList();
    }

    @Transactional(readOnly = true)
    public PostDto.Response getPostById(Long id) {
        Post post = postRepository.findByIdAndIsDeletedFalse(id)
            .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));
        return PostDto.Response.from(post);
    }

    @Transactional
    public PostDto.Response create(Long threadId, PostDto.CreateRequest req, String username, String nickname) {
        if (threadId == null) throw new IllegalArgumentException("threadId는 필수입니다.");
        if (req.getTitle() == null || req.getContent() == null) {
            throw new IllegalArgumentException("title, content는 필수입니다.");
        }

        Post post = Post.builder()
            .threadId(threadId)
            .title(req.getTitle())
            .content(req.getContent())
            .category(req.getCategory())
            .writerId(username)
            .writerNickname(nickname != null ? nickname : username)
            .viewCount(0)
            .isDeleted(false)
            .writtenAt(LocalDateTime.now())
            .createdAt(LocalDateTime.now())
            .build();

        postRepository.save(post);
        return PostDto.Response.from(post);
    }

    @Transactional
    public PostDto.Response update(Long postId, PostDto.UpdateRequest req, String username) {
        Post post = postRepository.findByIdAndIsDeletedFalse(postId)
            .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));

        // 소유자 검증(선택): 정책에 따라 주석 해제
        // if (!post.getWriterId().equals(username)) throw new AccessDeniedException("수정 권한 없음");

        if (req.getTitle() != null) post.setTitle(req.getTitle());
        if (req.getContent() != null) post.setContent(req.getContent());
        if (req.getCategory() != null) post.setCategory(req.getCategory());
        return PostDto.Response.from(post);
    }

    @Transactional
    public void softDelete(Long postId, String username) {
        Post post = postRepository.findByIdAndIsDeletedFalse(postId)
            .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));
        // if (!post.getWriterId().equals(username)) throw new AccessDeniedException("삭제 권한 없음");
        post.setIsDeleted(true);
    }

    @Transactional
    public void increaseViews(Long postId) {
        Post post = postRepository.findByIdAndIsDeletedFalse(postId)
            .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));
        post.setViewCount(post.getViewCount() + 1);
    }
}