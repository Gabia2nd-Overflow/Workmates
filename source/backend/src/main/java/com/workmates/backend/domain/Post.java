package com.workmates.backend.domain;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "POST")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post { // 게시글
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "POST_ID")
    private Long post_id; // 게시글 아이디

    @Column(name = "POST_TITLE", nullable = false, length = DomainConstants.ID_MAX_LEN)
    private String post_title; // 게시글 제목

    @Column(name = "POST_CONTENT", nullable = false, length = DomainConstants.POST_MAX_LEN)
    private String post_content; // 게시글 내용

    @Column(name = "POST_ATTACHMENT_URL", unique = true)
    @Builder.Default
    private String post_attachment_url = null; // 게시글 첨부파일들의 url. 기본적으로 null

    @Column(name = "POST_WRITTEN_AT", nullable = false)
    @Builder.Default
    private LocalDateTime post_written_at = LocalDateTime.now(); // 게시글 작성일시. 기본적으로 LocalDateTime.now()

    @Column(name = "POST_WRITTEN_IN", nullable = false)
    @Builder.Default
    private String post_written_in = DomainConstants.DEFAULT_LANGUAGE; // 게시글이 작성된 언어. 기본적으로 한국어
    
    @Column(name = "POST_IS_DELETED", nullable = false)
    @Builder.Default
    private Boolean post_is_deleted = false; // 게시글의 삭제 여부. 기본적으로 false

    @Column(name = "POST_WRITER_ID", nullable = false, length = DomainConstants.ID_MAX_LEN)
    private String post_writer_id; // 게시글을 작성한 사용자 아이디

    @Column(name = "POST_ROOT_THREAD_ID", nullable = false)
    private Long post_root_thread_id; // 게시글이 작성된 스레드 아이디
}
