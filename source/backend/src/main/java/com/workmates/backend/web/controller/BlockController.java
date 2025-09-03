package com.workmates.backend.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workmates.backend.service.BlockService;
import com.workmates.backend.web.dto.BlockDto.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/block")
public class BlockController {
    
    private final BlockService blockService;

    @GetMapping("/{id}")
    public ResponseEntity<BlocklistResponse> blocklist(@PathVariable @Valid String id) {
        return ResponseEntity.ok(blockService.blocklist(id));    
    }

    @PostMapping("/block-user")
    public ResponseEntity<BlockResponse> block(@RequestBody @Valid BlockRequest request) {
        return ResponseEntity.ok(blockService.block(request));
    }

    @PostMapping("/unblock-user")
    public ResponseEntity<UnblockResponse> unblock(@RequestBody @Valid UnblockRequest request) {
        return ResponseEntity.ok(blockService.unblock(request));
    }
}

