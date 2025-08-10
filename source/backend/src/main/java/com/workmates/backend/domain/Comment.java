package com.workmates.backend.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "COMMENT")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment { // 댓글
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "COMMENT_ID")
    private Long comment_id; // 댓글 식별 번호

    @Column(name = "COMMENT_ROOT_COMMENT_ID")
    @Builder.Default
    private Long comment_root_comment_id = null; // 현재 댓글이 대댓글이라면 원댓글의 comment_id. 기본적으로 null

    @Column(name = "COMMENT_DEPTH", nullable = false)
    @Builder.Default
    private Integer comment_depth = 0; // 현재 댓글이 달린 깊이(대댓글이라면 값이 1 이상). 기본적으로 0

    @Column(name = "COMMENT_CONTENT", nullable = false, length = DomainConstants.COMMENT_MAX_LEN)
    private String comment_content; // 댓글 내용

    @Column(name = "COMMENT_WRITTEN_AT", nullable = false)
    @Builder.Default
    private LocalDateTime comment_written_at = LocalDateTime.now(); // 댓글 작성일시. 기본적으로 LocalDateTime.now()

    @Column(name = "COMMENT_WRITTEN_IN", nullable = false)
    @Builder.Default
    private String comment_written_in = DomainConstants.DEFAULT_LANGUAGE; // 댓글이 작성된 언어. 기본적으로 한국어

    @Column(name = "COMMENT_ATTACHMENT_URL", unique = true)
    @Builder.Default
    private String comment_attachment_url = null; // 댓글 첨부파일들이 저장된 url. 기본적으로 null 

    @Column(name = "COMMENT_IS_DELETED", nullable = false)
    @Builder.Default
    private Boolean comment_is_deleted = false; // 댓글 삭제 여부. 기본적으로 false

    @Column(name = "COMMENT_WRITER_ID", nullable = false, length = DomainConstants.ID_MAX_LEN)
    private String comment_writer_id; // 댓글 작성자 아이디

    @Column(name = "COMMENT_ROOT_POST_ID", nullable = false)
    private Long comment_root_post_id; // 댓글이 작성된 게시글 아이디
}
