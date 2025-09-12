package com.workmates.backend.domain;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mail",
    indexes = {
        @Index(name = "idx_from", columnList = "from"),
        @Index(name = "idx_to", columnList = "to"),
        @Index(name = "idx_message_id", columnList = "messageId"),
        @Index(name = "idx_user_id", columnList = "user_id")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mail {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "mail_id")
    private Long mailId;

    @Column(name = "message-id", nullable = false, unique = true)
    private String messageId;
    
    @Column(name = "from", nullable = false)
    private String from;
    
    @Column(name = "to", nullable = false)
    private String to;
    
    @Column(name = "subject", nullable = false)
    private String subject;
    
    @Column(name = "content", columnDefinition = "LONGTEXT")
    private String content;
    
    @Column(name = "written_at", nullable = false)
    @Builder.Default
    private LocalDateTime writtenAt = LocalDateTime.now();

    @Column(name = "attachment_url")
    @Builder.Default
    private String attachmentUrl = null;
        
    @Column(name = "user_id", nullable =  false)
    private String userId;  // 메일을 송수신한 사용자 아이디
}