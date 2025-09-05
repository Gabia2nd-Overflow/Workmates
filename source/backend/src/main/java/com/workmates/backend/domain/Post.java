package com.workmates.backend.domain;

import java.time.LocalDateTime;

import com.workmates.backend.util.DomainUtil;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "POST")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Builder.Default
    @Column(name = "attachment_url", unique = true)
    private String attachmentUrl = null;

    @Column(name = "content", nullable = false, length = DomainUtil.POST_MAX_LEN)
    private String content;

    @Builder.Default
    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "thread_id", nullable = false)
    private Long threadId;

    @Column(name = "title")
    private String title;

    @Builder.Default
    @Column(name = "writer_id", nullable = false, length = DomainUtil.ID_MAX_LEN)
    private String writerId = "unknown";

    @Builder.Default
    @Column(name = "view_count", nullable = false)
    private Integer viewCount = 0;

    @Builder.Default
    @Column(name = "writer_nickname", nullable = false, length = DomainUtil.ID_MAX_LEN)
    private String writerNickname = "unknown";

    @Builder.Default
    @Column(name = "written_at", nullable = false)
    private LocalDateTime writtenAt = LocalDateTime.now();

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
