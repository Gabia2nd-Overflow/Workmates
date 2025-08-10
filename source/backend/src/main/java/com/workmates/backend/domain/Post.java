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
    @Column(name = "id")
    private Long id; // 게시글 아이디

    @Column(name = "title", nullable = false, length = DomainConstants.ID_MAX_LEN)
    private String title; // 게시글 제목

    @Column(name = "content", nullable = false, length = DomainConstants.POST_MAX_LEN)
    private String content; // 게시글 내용

    @Column(name = "attachmentUrl", unique = true)
    @Builder.Default
    private String attachmentUrl = null; // 게시글 첨부파일들의 url. 기본적으로 null

    @Column(name = "writtenAt", nullable = false)
    @Builder.Default
    private LocalDateTime writtenAt = LocalDateTime.now(); // 게시글 작성일시. 기본적으로 LocalDateTime.now()

    @Column(name = "writtenIn", nullable = false)
    @Builder.Default
    private String writtenIn = DomainConstants.DEFAULT_LANGUAGE; // 게시글이 작성된 언어. 기본적으로 한국어
    
    @Column(name = "isDeleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false; // 게시글의 삭제 여부. 기본적으로 false

    @Column(name = "writerId", nullable = false, length = DomainConstants.ID_MAX_LEN)
    private String writerId; // 게시글을 작성한 사용자 아이디

    @Column(name = "threadId", nullable = false)
    private Long threadId; // 게시글이 작성된 스레드 아이디
}
