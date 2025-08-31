package com.workmates.backend.domain;

import java.time.LocalDateTime;

import com.workmates.backend.constant.DomainConstants;

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
    @Column(name = "id")
    private Long id; // 댓글 식별 번호

    @Column(name = "root_id")
    @Builder.Default
    private Long rootId = null; // 현재 댓글이 대댓글이라면 원댓글의 comment_id. 기본적으로 null

    @Column(name = "depth", nullable = false)
    @Builder.Default
    private Integer depth = 0; // 현재 댓글이 달린 깊이(대댓글이라면 값이 1 이상). 기본적으로 0

    @Column(name = "content", nullable = false, length = DomainConstants.COMMENT_MAX_LEN)
    private String content; // 댓글 내용

    @Column(name = "written_at", nullable = false)
    @Builder.Default
    private LocalDateTime writtenAt = LocalDateTime.now(); // 댓글 작성일시. 기본적으로 LocalDateTime.now()

    @Column(name = "written_in", nullable = false)
    @Builder.Default
    private String writtenIn = DomainConstants.DEFAULT_LANGUAGE; // 댓글이 작성된 언어. 기본적으로 한국어

    @Column(name = "attachment_url", unique = true)
    @Builder.Default
    private String attachmentUrl = null; // 댓글 첨부파일들이 저장된 url. 기본적으로 null 

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false; // 댓글 삭제 여부. 기본적으로 false

    @Column(name = "writer_id", nullable = false, length = DomainConstants.ID_MAX_LEN)
    private String writerId; // 댓글 작성자 아이디

    @Column(name = "writer_nickname", nullable = false, unique = true, length = DomainConstants.ID_MAX_LEN)
    private String writerNickname; // 댓글 작성자 닉네임

    @Column(name = "post_id", nullable = false)
    private Long postId; // 댓글이 작성된 게시글 아이디
}
