package com.workmates.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.workmates.backend.domain.Attachment;
import com.workmates.backend.domain.Attachment.TargetType;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByTargetTypeAndTargetIdOrderByIdAsc(TargetType type, Long targetId);

    List<Attachment> findByUploaderIdOrderByUploadedAtDesc(String uploaderId);
}