// com/workmates/backend/domain/Attachment.java
package com.workmates.backend.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Column(nullable = false, length = 500)
    private String fileUrl;        // ✅ URL만 관리

    @Column(nullable = false)
    private String uploaderId;

    private Long workshopId;       // nullable
    private Long loungeId;         // nullable

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TargetType targetType; // UNASSIGNED / MESSAGE (→ 추후 POST/COMMENT 추가)

    private Long targetId;         // Message.id (→ 추후 Post/Comment id)

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    void onCreate() {
        if (uploadedAt == null) uploadedAt = LocalDateTime.now();
        if (targetType == null) targetType = TargetType.UNASSIGNED;
    }
}