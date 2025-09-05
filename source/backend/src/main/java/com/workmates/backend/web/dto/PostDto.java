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
        private Integer views;
        private String createdAt;

        public static Response from(Post post) {
            return Response.builder()
                    .id(post.getId())
                    .title(post.getTitle())
                    .content(post.getContent())
                    .writerNickname(post.getWriterNickname())
                    .views(post.getViews())
                    .createdAt(post.getCreatedAt() != null ? post.getCreatedAt().toString() : "")
                    .build();
        }
    }

    @Getter
    @Setter
    public static class Request {
        private String title;
        private String content;
        private String category;
        private Long threadId; // 필수
    }
}
