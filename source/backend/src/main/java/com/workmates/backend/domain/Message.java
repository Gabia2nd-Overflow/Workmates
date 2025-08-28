package com.workmates.backend.domain;

import java.time.LocalDateTime;
import java.time.ZoneId;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
// import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "MESSAGE")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message { // 메세지

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id; // 메세지 아이디

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "CHATROOM_ID")
    @Column(name = "content", nullable = false, length = DomainConstants.COMMENT_MAX_LEN)
    private String content; // 메세지 내용

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "USER_ID")
    @Column(name = "attachmentUrl")
    @Builder.Default
    private String attachmentUrl = null; // 메세지 첨부파일들의 url. 기본적으로 null

    @Column(name = "writtenAt", nullable = false)
    @Builder.Default
    private LocalDateTime writtenAt = LocalDateTime.now(); // 메세지 작성일시. 기본적으로 LocalDateTime.now()

    @Column(name = "writtenIn", nullable = false)
    @Builder.Default
    private String writtenIn = DomainConstants.DEFAULT_LANGUAGE; // 메세지가 작성된 언어. 기본적으로 한국어

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean isDeleted = false; // 메세지 삭제 여부. 기본적으로 false

    @Column(name = "writerId", nullable = false, length = DomainConstants.ID_MAX_LEN)
    private String writerId; // 메세지를 작성한 사용자 아이디

    @Column(name = "writerNickname", nullable = false, length = DomainConstants.ID_MAX_LEN)
    private String writerNickname; // 메세지를 작성한 사용자의 닉네임

    @Column(name = "loungeId", nullable = false)
    private Long loungeId; // 메세지가 작성된 라운지 아이디

        // ✅ 편의 생성자를 유지하더라도 기본값/타임존 보장
    public Message(Long loungeId, String writerId, String content) {
        this.loungeId = loungeId;
        this.writerId = writerId;
        this.content  = content;
        this.isDeleted = false;
        this.writtenAt = LocalDateTime.now();
        this.writtenIn = ZoneId.of("Asia/Seoul").getId();
    }

    @PrePersist
    private void prePersist() {
        if (this.writtenAt == null) {
            this.writtenAt = LocalDateTime.now();
        }
        if (this.writtenIn == null) {
            this.writtenIn = ZoneId.of("Asia/Seoul").getId();
        }
    }
}
