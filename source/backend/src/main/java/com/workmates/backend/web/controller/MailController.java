package com.workmates.backend.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.workmates.backend.service.MailService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mail")
@RequiredArgsConstructor
public class MailController {
    
    private final MailService mailService;

    // @GetMapping("/{mailId}") // 개별 메일 반환
    // public ResponseEntity<MailDto.ReadResponse> readMail(
    //     @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
    //     @Valid @RequestBody UserDto.QuitRequest request
    // ) {
    //     return ResponseEntity.ok(userService.getUserInfo(principal.getUsername()));
    // }

    // @GetMapping("") // 수신한 메일 전체 반환
    // public ResponseEntity<MailDto.ReceiveResponse> receiveMail(
    //     @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
    //     @Valid @RequestBody UserDto.QuitRequest request
    // ) {
    //     return ResponseEntity.ok(userService.getUserInfo(principal.getUsername()));
    // }

    // @PostMapping("") // 메일 전송
    // public ResponseEntity<MailDto.SendResponse> sendMail(
    //     @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
    //     @Valid @RequestBody UserDto.QuitRequest request
    // ) {
    //     return ResponseEntity.ok(userService.getUserInfo(principal.getUsername()));
    // }
}
