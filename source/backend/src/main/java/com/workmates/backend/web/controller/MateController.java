package com.workmates.backend.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workmates.backend.service.MateService;
import com.workmates.backend.web.dto.MateDto.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mate")
public class MateController {
    
    private final MateService mateService;

    @PostMapping("/search")
    public ResponseEntity<SearchResponse> search(@RequestBody @Valid SearchRequest request) {
        return ResponseEntity.ok(mateService.search(request));
    }

    @PostMapping("/invite")
    public ResponseEntity<InviteResponse> inivte(@RequestBody @Valid InviteRequest request) {
        return ResponseEntity.ok(mateService.invite(request));
    }
}
