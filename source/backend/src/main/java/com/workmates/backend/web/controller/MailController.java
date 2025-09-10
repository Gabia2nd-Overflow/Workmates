package com.workmates.backend.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.workmates.backend.service.MailService;
import com.workmates.backend.web.dto.MailDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mail")
@RequiredArgsConstructor
public class MailController {
    
    private final MailService mailService;

    @GetMapping("/{mailId}") // 개별 메일 반환
    public ResponseEntity<MailDto.ReadMailResponse> readMail(
        @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
        @Valid @RequestBody MailDto.ReadMailRequest request
    ) {
        return ResponseEntity.ok(mailService.readMail(principal.getUsername(), request));
    }

    @GetMapping("") // 수신한 메일 전체 반환
    public ResponseEntity<MailDto.ReceiveMailResponse> receiveMail(
        @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
        @Valid @RequestBody MailDto.ReceiveMailRequest request
    ) {
        return ResponseEntity.ok(mailService.receiveMail(principal.getUsername(), request));
    }

    @PostMapping("") // 메일 전송
    public ResponseEntity<MailDto.SendMailResponse> sendMail(
        @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
        @Valid @RequestBody MailDto.SendMailRequest request
    ) {
        return ResponseEntity.ok(mailService.sendMail(principal.getUsername(), request));
    }
}
