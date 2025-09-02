package com.workmates.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "post")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "attachment_url", unique = true)
    private String attachmentUrl;

    @Column(name = "content", nullable = false, length = 2048)
    private String content;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "thread_id", nullable = false)
    private Long threadId;

    @Column(name = "title")
    private String title;

    @Column(name = "writer_id", nullable = false, length = 32)
    private String writerId = "unknown";

    private Integer views = 0;

    @Column(name = "writer_nickname", nullable = false, length = 32)
    private String writerNickname = "unknown";


    @Column(name = "written_at", nullable = false)
    private LocalDateTime writtenAt = LocalDateTime.now();

    @Column(name = "written_in", nullable = false)
    private String writtenIn = "unknown";

    @Column(name = "author")
    private String author;

    @Column(name = "category")
    private String category;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (writtenAt == null) writtenAt = LocalDateTime.now();
    }
}
