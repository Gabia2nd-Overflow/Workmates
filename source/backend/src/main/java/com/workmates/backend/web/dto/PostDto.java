package com.workmates.backend.web.dto;

import com.workmates.backend.domain.Post;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

public class PostDto {

    @Getter
    @Setter
    public static class Request {
        private String title;
        private String content;
        private String category;
    }

    @Getter
    public static class Response {
        private Long id;
        private String title;
        private String content;
        private String category;
        private String author;
        private String writerId;
        private String writerNickname;
        private String createdAt;
        private String writtenAt;

        public Response(Post post) {
            this.id = post.getId();
            this.title = post.getTitle();
            this.content = post.getContent();
            this.category = post.getCategory();
            this.author = post.getAuthor();
            this.writerId = post.getWriterId();
            this.writerNickname = post.getWriterNickname();
            this.createdAt = post.getCreatedAt() != null ? post.getCreatedAt().toString() : null;
            this.writtenAt = post.getWrittenAt() != null ? post.getWrittenAt().toString() : null;
        }
    }
}
