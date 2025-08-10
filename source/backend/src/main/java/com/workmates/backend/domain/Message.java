package com.workmates.backend.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
// import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    @Column(name = "MESSAGE_ID")
    private Long message_id; // 메세지 아이디

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "CHATROOM_ID")
    @Column(name = "MESSAGE_CONTENT", nullable = false, length = DomainConstants.COMMENT_MAX_LEN)
    private String message_content; // 메세지 내용

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "USER_ID")
    @Column(name = "MESSAGE_ATTACHMENT_URL", unique = true)
    @Builder.Default
    private String message_attachment_url = null; // 메세지 첨부파일들의 url. 기본적으로 null

    @Column(name = "MESSAGE_WRITTEN_AT", nullable = false)
    @Builder.Default
    private LocalDateTime message_written_at = LocalDateTime.now(); // 메세지 작성일시. 기본적으로 LocalDateTime.now()

    @Column(name = "MESSAGE_WRITTEN_IN", nullable = false)
    @Builder.Default
    private String message_written_in = DomainConstants.DEFAULT_LANGUAGE; // 메세지가 작성된 언어. 기본적으로 한국어

    @Column(name = "MESSAGE_IS_DELETED", nullable = false)
    @Builder.Default
    private Boolean message_is_deleted = false; // 메세지 삭제 여부. 기본적으로 false

    @Column(name = "MESSAGE_WRITER_ID", nullable = false, length = DomainConstants.ID_MAX_LEN)
    private String message_writer_id; // 메세지를 작성한 사용자 아이디

    @Column(name = "MESSAGE_ROOT_LOUNGE_ID", nullable = false)
    private Long message_root_lounge_id; // 메세지가 작성된 라운지 아이디
}
