package com.workmates.backend.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.workmates.backend.service.FileUploadService;
import com.workmates.backend.web.dto.MessageDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/messages")
public class MessageFileController {

    private final FileUploadService fileUploadService;

    @PostMapping("/files")
    public ResponseEntity<MessageDto.FileUploadResponse> uploadFile(
            @RequestParam("file") MultipartFile file) {

        MessageDto.FileUploadResponse response = fileUploadService.upload(file);
        return ResponseEntity.ok(response);
    }
}
