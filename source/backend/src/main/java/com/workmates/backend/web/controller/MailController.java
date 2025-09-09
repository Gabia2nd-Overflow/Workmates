package com.workmates.backend.web.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workmates.backend.service.MailService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mail")
@RequiredArgsConstructor
public class MailController {
    
    private final MailService mailService;

    
    @PostMapping("/receive")
    public ResponseEntity<MailDto.ReceiveResponse> 

    @PostMapping("/send")
    
}
