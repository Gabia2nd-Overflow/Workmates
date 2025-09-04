package com.workmates.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.domain.Comment;
import com.workmates.backend.domain.Post;
import com.workmates.backend.repository.CommentRepository;
import com.workmates.backend.repository.PostRepository;
import com.workmates.backend.web.dto.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    // private final JwtUtil jwtUtil;

    // 게시글 조회
    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));
    }

    // 조회수 증가
    @Transactional
    public void increaseViews(Long postId) {
        Post post = getPostById(postId);
        post.setViewCount(post.getViewCount() + 1);
    }

    // 댓글 조회
    public List<PostDto.CommentResponse> getComments(Long postId) {
        return commentRepository.findAllByPostId(postId)
                .stream()
                .map(PostDto.CommentResponse::from)
                .toList();
    }

    // 댓글 작성
    @Transactional
    public PostDto.CommentResponse createComment(Long postId, PostDto.CommentRequest request, String token) {
        // String nickname = jwtUtil.extractNickname(token);

        Comment comment = Comment.builder()
                .postId(postId)
                .content(request.getContent())
                .writerNickname(request.)
                .build();

        commentRepository.save(comment);

        return PostDto.CommentResponse.from(comment);
    }
}
