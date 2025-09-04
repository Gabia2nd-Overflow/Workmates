package com.workmates.backend.web.dto;

import com.workmates.backend.domain.Comment;
import com.workmates.backend.domain.Post;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class PostDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostRequest {
        private Long id;
        private String title;
        private String content;
        private String writerNickname;
        private Integer viewCount;
        private String writtenAt;

        public static PostRequest from(Post post) {
            PostRequest dto = new PostRequest();
            dto.setId(post.getId());
            dto.setTitle(post.getTitle());
            dto.setContent(post.getContent());
            dto.setWriterNickname(post.getWriterNickname());
            dto.setViewCount(post.getViewCount());
            dto.setWrittenAt(post.getWrittenAt().toString());
            return dto;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostResponse {
        private Long id;
        private String title;
        private String content;
        private String writerNickname;
        private Integer viewCount;
        private String writtenAt;

        public static PostResponse from(Post post) {
            PostResponse dto = new PostResponse();
            dto.setId(post.getId());
            dto.setTitle(post.getTitle());
            dto.setContent(post.getContent());
            dto.setWriterNickname(post.getWriterNickname());
            dto.setViewCount(post.getViewCount());
            dto.setWrittenAt(post.getWrittenAt().toString());
            return dto;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentRequest {
        private String content;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentResponse {
        private Long id;
        private String content;
        private String writerNickname;
        private String writtenAt;

        public static CommentResponse from(Comment comment) {
            CommentResponse dto = new CommentResponse();
            dto.setId(comment.getId());
            dto.setContent(comment.getContent());
            dto.setWriterNickname(comment.getWriterNickname());
            dto.setWrittenAt(comment.getWrittenAt().toString());
            return dto;
        }
    }
}
