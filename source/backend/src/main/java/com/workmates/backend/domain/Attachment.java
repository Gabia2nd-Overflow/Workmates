// com/workmates/backend/domain/Attachment.java
package com.workmates.backend.domain;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attachment",
       indexes = {
         @Index(name = "idx_target", columnList = "targetType,targetId"),
         @Index(name = "idx_uploader", columnList = "uploaderId")
       })
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Attachment {

    public enum TargetType { UNASSIGNED, MESSAGE /*, POST, COMMENT*/ }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false) private String fileUrl;
    @Column(nullable=false) private String fileName;
    @Column(nullable=false) private String uploaderId;

    private Long workshopId;   // nullable
    private Long loungeId;     // nullable

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private TargetType targetType; // UNASSIGNED, MESSAGE(→추후 POST/COMMENT 추가)

    private Long targetId;     // Message.id (→추후 Post/Comment id)

    @Column(nullable=false)
    private LocalDateTime uploadedAt;

    @PrePersist
    void onCreate() {
        if (uploadedAt == null) uploadedAt = LocalDateTime.now();
        if (targetType == null) targetType = TargetType.UNASSIGNED;
    }
}