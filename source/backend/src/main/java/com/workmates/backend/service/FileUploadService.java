// com/workmates/backend/service/FileUploadService.java
package com.workmates.backend.service;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.workmates.backend.domain.Attachment;
import com.workmates.backend.domain.Attachment.TargetType;
import com.workmates.backend.domain.Message;
import com.workmates.backend.repository.AttachmentRepository;
import com.workmates.backend.repository.LoungeRepository;
import com.workmates.backend.repository.MessageRepository;
import com.workmates.backend.web.dto.MessageDto.FileUploadResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final AttachmentRepository attachmentRepository;
    private final MessageRepository messageRepository;
    private final LoungeRepository loungeRepository;

    private final String uploadDir = System.getProperty("user.dir") + "/uploads";

    @Transactional
    public FileUploadResponse uploadForMessage(MultipartFile file,
                                               String uploaderId,
                                               Long workshopId,
                                               Long loungeId,
                                               Long messageId) {
        try {
            // 1) 로컬 저장(파일명 충돌 방지)
            String original = file.getOriginalFilename();
            String unique = UUID.randomUUID() + "_" + (original == null ? "file" : original);
            Path path = Paths.get(uploadDir, unique);
            Files.createDirectories(path.getParent());
            file.transferTo(path.toFile());
            String url = "/files/" + unique;

            // 2) 라운지-워크샵 정합성
            var lounge = loungeRepository.findById(loungeId)
                    .orElseThrow(() -> new IllegalArgumentException("라운지가 존재하지 않습니다."));
            if (!workshopId.equals(lounge.getWorkshopId())) {
                throw new IllegalArgumentException("라운지가 요청한 워크샵에 속하지 않습니다.");
            }

            // 3) 메시지 검증 + 작성자 권한
            Message msg = messageRepository.findById(messageId)
                    .orElseThrow(() -> new IllegalArgumentException("메시지를 찾을 수 없습니다."));
            if (!msg.getLoungeId().equals(loungeId)) {
                throw new IllegalArgumentException("메시지가 해당 라운지에 속하지 않습니다.");
            }
            if (!msg.getWriterId().equals(uploaderId)) {
                throw new org.springframework.security.access.AccessDeniedException("작성자만 첨부할 수 있습니다.");
            }

            // 4) 메시지에 URL 반영
            msg.setAttachmentUrl(url); // 더티체킹

            // 5) 첨부 기록(가벼운 저장, 실패 시 롤백)
            attachmentRepository.save(
                Attachment.builder()
                    .fileUrl(url)
                    .uploaderId(uploaderId)
                    .workshopId(workshopId)
                    .loungeId(loungeId)
                    .targetType(TargetType.MESSAGE)
                    .targetId(messageId)
                    .build()
            );

            return FileUploadResponse.from(url);
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 실패", e);
        }
    }

    @Transactional
    public String uploadFile(MultipartFile file, String uploaderId) {
        try {
            String original = file.getOriginalFilename();
            String unique = UUID.randomUUID() + "_" + (original == null ? "file" : original);
            Path path = Paths.get(uploadDir, unique);
            Files.createDirectories(path.getParent());
            file.transferTo(path.toFile());
            String url = "/files/" + unique;


            attachmentRepository.save(
                Attachment.builder()
                    .fileUrl(url)
                    .uploaderId(uploaderId)
                    // .workshopId(workshopId)
                    // .loungeId(loungeId)
                    // .targetType(TargetType.MESSAGE)
                    // .targetId(messageId)
                    .build()
            );

            return url;
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 실패", e);
        }
    }
}