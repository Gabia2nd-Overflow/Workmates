package com.workmates.backend.web.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    @GetMapping("/mailbox")
    public ResponseEntity<Map<String, Object>> refreshMailbox( // 메일함 새로고침(메일 서버에서 메일 DB를 갱신)
        @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
    ) {
        mailService.refreshMailBox(principal.getUsername());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "메일 수신 작업을 수행중입니다.");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{mailId}") // 개별 메일 반환
    public ResponseEntity<MailDto.ReadMailResponse> readMail(
        @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
        @PathVariable Long mailId
    ) {
        return ResponseEntity.ok(mailService.readMail(principal.getUsername(), mailId));
    }

    @GetMapping("") // 사용자가 수신한 메일 목록 반환
    public ResponseEntity<Page<MailDto.MailResponse>> getReceivedMailPage(
        @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(mailService.getReceivedMailPage(principal.getUsername(), PageRequest.of(page, size)));
    }

    @GetMapping("/sent") // 사용자가 송신한 메일 목록 반환
    public ResponseEntity<Page<MailDto.MailResponse>> getSentMailPage(
        @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(mailService.getSentMailPage(principal.getUsername(), PageRequest.of(page, size)));
    }
    
    @PostMapping("") // 메일 전송
    public ResponseEntity<MailDto.SendMailResponse> sendMail(
        @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
        @Valid @RequestBody MailDto.SendMailRequest request
    ) {
        return ResponseEntity.ok(mailService.sendMail(principal.getUsername(), request));
    }

    // // 주소록 조회
    // @GetMapping("/address")
    // public ResponseEntity<MailDto.GetAddressListResponse> getAddressList( 
    //     @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
    // ) {
    //     return ResponseEntity.ok(mailService.getAddressList(principal.getUsername()));
    // }

    // // 주소록에 주소 추가
    // @PostMapping("/address")
    // public ResponseEntity<MailDto.AppendAddressResponse> appendAddress( 
    //     @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
    //     @Valid @RequestBody MailDto.AppendAddressRequest request
    // ) {
    //     return ResponseEntity.ok(mailService.appendAddress(principal.getUsername(), request));
    // }

    // // 주소록 수정/삭제
    // @PatchMapping("/address")
    // public ResponseEntity<MailDto.UpdateAddressResponse> updateAddress( 
    //     @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
    //     @Valid @RequestBody MailDto.UpdateAddressRequest request
    // ) {
    //     return ResponseEntity.ok(mailService.updateAddress(principal.getUsername(), request));
    // }
}
