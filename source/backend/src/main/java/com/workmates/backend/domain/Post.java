package com.workmates.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.workmates.backend.util.DomainUtil;

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

    // @Builder.Default
    // @Column(name = "written_in", nullable = false)
    // private String writtenIn = "unknown";

    @Column(name = "category")
    private String category;

    // @Column(name = "created_at")
    // private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        // if (createdAt == null) createdAt = LocalDateTime.now();
        if (writtenAt == null) writtenAt = LocalDateTime.now();
    }
}
