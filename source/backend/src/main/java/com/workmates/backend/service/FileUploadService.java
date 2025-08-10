package com.workmates.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.workmates.backend.web.dto.MessageDto.FileUploadResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final String uploadDir = System.getProperty("user.dir") + "/uploads";

    public FileUploadResponse upload(MultipartFile file) {
        try {
            String originalFileName = file.getOriginalFilename();
            String uniqueName = UUID.randomUUID() + "_" + originalFileName;
            Path path = Paths.get(uploadDir, uniqueName);

            Files.createDirectories(path.getParent()); // 디렉토리 생성
            file.transferTo(path.toFile());

            return FileUploadResponse.builder()
                    .fileName(originalFileName)
                    .fileUrl("/files/" + uniqueName) // URL은 서버 설정에 맞게
                    .build();
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 실패", e);
        }
    }
}