package com.workmates.backend.service;

<<<<<<< HEAD
import java.util.List;
=======
import java.time.LocalDateTime;
>>>>>>> 5d4567d3411b5da87b8597c527f310d468205364

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

<<<<<<< HEAD
import com.workmates.backend.domain.Comment;
import com.workmates.backend.domain.Post;
import com.workmates.backend.repository.CommentRepository;
import com.workmates.backend.repository.PostRepository;
import com.workmates.backend.web.dto.*;
=======
import com.workmates.backend.domain.Post;
import com.workmates.backend.repository.PostRepository;
import com.workmates.backend.web.dto.PostDto;
>>>>>>> 5d4567d3411b5da87b8597c527f310d468205364

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
<<<<<<< HEAD
    private final CommentRepository commentRepository;
    // private final JwtUtil jwtUtil;
=======
>>>>>>> 5d4567d3411b5da87b8597c527f310d468205364

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
<<<<<<< HEAD
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
=======
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));
        post.setViews(post.getViews() + 1);
    }



>>>>>>> 5d4567d3411b5da87b8597c527f310d468205364

}
