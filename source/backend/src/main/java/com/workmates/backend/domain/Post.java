package com.workmates.backend.domain;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "post",
    indexes = {
        @Index(name = "idx_post_thread_created", columnList = "thread_id, created_at"),
        @Index(name = "idx_post_view_count", columnList = "view_count")
    }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 게시글이 속한 스레드 (FK 숫자 보관 방식) */
    @Column(name = "thread_id", nullable = false)
    private Long threadId;

    /** 제목/본문/카테고리 */
    @Column(nullable = false, length = 200)
    private String title;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT") // ← 명시
    private String content;

    @Column(name="replyCount",nullable=false)
    private long replyCount=0;

    /** 작성자 (하위호환/조회 최적화용 비정규화 컬럼) */
    @Column(name = "writer_id", nullable = false, length = 50)
    @Builder.Default
    private String writerId = "unknown";

    @Column(name = "writer_nickname", nullable = false, length = 50)
    @Builder.Default
    private String writerNickname = "unknown";

    /** 조회수/삭제 플래그 */
    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Integer viewCount = 0;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    /** 생성/작성/수정 시각 */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "written_at", nullable = false)
    private LocalDateTime writtenAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        final LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (writtenAt == null) writtenAt = now;
        if (viewCount == null) viewCount = 0;
        if (isDeleted == null) isDeleted = false;
        if (writerId == null) writerId = "unknown";
        if (writerNickname == null) writerNickname = "unknown";
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}