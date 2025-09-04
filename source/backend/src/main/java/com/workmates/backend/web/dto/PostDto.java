package com.workmates.backend.web.dto;
import java.time.LocalDateTime;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import com.workmates.backend.domain.Comment;
import com.workmates.backend.domain.Post;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

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
            Response dto = new Response();
            dto.setId(post.getId());
            dto.setTitle(post.getTitle());
            dto.setContent(post.getContent());
            dto.setWriterNickname(post.getWriterNickname());
            dto.setViews(post.getViews());
            dto.setCreatedAt(post.getCreatedAt().toString());
            return dto;
        }
    }
    

    @Getter
    @Setter
    public static class Request {
        private String title;
        private String content;
        private String category;
        private String writerId; // JWT에서 추출된 username
    }

    @Getter
    @Setter
    public static class CommentRequest {
        private String content;
    }

    @Getter
    @Setter
    public static class CommentResponse {
        private Long id;
        private String content;
        private String writerNickname;
        private String createdAt;

    }
}
