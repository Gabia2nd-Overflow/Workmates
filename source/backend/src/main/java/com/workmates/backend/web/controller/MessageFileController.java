package com.workmates.backend.web.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
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

    @PostMapping(value = "/files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MessageDto.FileUploadResponse> uploadAndBindToMessage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("workshopId") Long workshopId,
            @RequestParam("loungeId")   Long loungeId,
            @RequestParam("messageId")  Long messageId,
            @AuthenticationPrincipal User principal
    ) {
        String uploaderId = principal.getUsername();
        var resp = fileUploadService.uploadForMessage(file, uploaderId, workshopId, loungeId, messageId);
        return ResponseEntity.ok(resp); // { fileUrl }
    }
}
