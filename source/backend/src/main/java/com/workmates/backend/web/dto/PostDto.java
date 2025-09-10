// com.workmates.backend.web.dto.PostDto
package com.workmates.backend.web.dto;

import lombok.*;
import java.time.LocalDateTime;

import com.workmates.backend.domain.Post;

public class PostDto {

    @Getter @Setter
    public static class CreateRequest {
        private String title;
        private String content;
        private String category; // optional
    }

    @Getter @Setter
    public static class UpdateRequest {
        private String title;    // optional
        private String content;  // optional
        private String category; // optional
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private Long threadId;
        private String title;
        private String content;
        private String writerId;
        private String writerNickname;
        private Integer views;
        private long replyCount;
        private LocalDateTime createdAt;
        private LocalDateTime writtenAt;

        public static Response from(Post p) {
            return Response.builder()
                .id(p.getId())
                .threadId(p.getThreadId())
                .title(p.getTitle())
                .content(p.getContent())
                .writerId(p.getWriterId())
                .writerNickname(p.getWriterNickname())
                .views(p.getViewCount())
                .replyCount(p.getReplyCount())
                .createdAt(p.getCreatedAt())
                .writtenAt(p.getWrittenAt())
                .build();
        }
    }
}
