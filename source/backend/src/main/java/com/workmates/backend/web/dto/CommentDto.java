package com.workmates.backend.web.dto;

import com.workmates.backend.domain.Comment;
import com.workmates.backend.util.DomainUtil;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

public class CommentDto {

    @Data
    public static class CreateRequest {
        /** 대댓글이면 부모 commentId, 아니면 null */
        private Long parentId;
        private String nickname;

        @NotBlank
        @Size(min = 1, max = DomainUtil.COMMENT_MAX_LEN)
        private String content;

        /** 선택: 단일 첨부 URL */
        private String attachmentUrl;
    }

    @Data
    public static class UpdateRequest {
        @NotBlank
        @Size(min = 1, max = DomainUtil.COMMENT_MAX_LEN)
        private String content;

        /** 선택: 첨부 URL 교체/제거(null로 보내면 변경 안 함) */
        private String attachmentUrl;
    }

    @Getter
    @Builder
    public static class Response {
        private Long id;
        private Long postId;
        private Long rootId;         // 원댓글 id (대댓글이면 원댓글 id, 아니면 null)
        private Integer depth;       // 0=원댓글, 1+=대댓글 깊이
        private String content;      // 삭제시 빈 문자열로 내려감
        private String attachmentUrl; // 삭제시 null
        private Boolean isDeleted;
        private String writerId;
        private String writerNickname;
        private LocalDateTime writtenAt;

        public static Response from(Comment c) {
            return Response.builder()
                .id(c.getId())
                .postId(c.getPostId())
                .rootId(c.getRootId())
                .depth(c.getDepth())
                .content(Boolean.TRUE.equals(c.getIsDeleted()) ? "" : c.getContent())
                .attachmentUrl(Boolean.TRUE.equals(c.getIsDeleted()) ? null : c.getAttachmentUrl())
                .isDeleted(c.getIsDeleted())
                .writerId(c.getWriterId())
                .writerNickname(c.getWriterNickname())
                .writtenAt(c.getWrittenAt())
                .build();
        }
    }
}