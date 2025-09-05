package com.workmates.backend.web.dto;

import lombok.*;
import java.time.LocalDateTime;
import com.workmates.backend.domain.Post;

public class PostDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String title;
        private String content;
        private String writerNickname;
        private Integer viewCount;
        private String writtenAt;

<<<<<<< HEAD
        public static Response from(Post post) {
            return Response.builder()
                    .id(post.getId())
                    .title(post.getTitle())
                    .content(post.getContent())
                    .writerNickname(post.getWriterNickname())
                    .views(post.getViews())
                    .createdAt(post.getCreatedAt() != null ? post.getCreatedAt().toString() : "")
                    .build();
=======
        public static PostRequest from(Post post) {
            PostRequest dto = new PostRequest();
            dto.setId(post.getId());
            dto.setTitle(post.getTitle());
            dto.setContent(post.getContent());
            dto.setWriterNickname(post.getWriterNickname());
            dto.setViewCount(post.getViewCount());
            dto.setWrittenAt(post.getWrittenAt().toString());
            return dto;
>>>>>>> 227c7e06314ef4113cc579db29de93b0af1794a1
        }
    }

    @Getter
    @Setter
    public static class Request {
        private String title;
        private String content;
        private String category;
<<<<<<< HEAD
        private Long threadId; // 필수
=======
        private String writerId; // JWT에서 추출된 username
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

>>>>>>> 227c7e06314ef4113cc579db29de93b0af1794a1
    }
}
