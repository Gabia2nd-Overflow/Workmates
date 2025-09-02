package com.workmates.backend.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
@RequestMapping("/api/mate")
public class MateController {
    
    private final MateService mateService;

    @GetMapping("/{id}")
    public ResponseEntity<MatelistResponse> matelist(@PathVariable @Valid String id) {
        return ResponseEntity.ok(mateService.matelist(id));    
    }

    @PostMapping("/search")
    public ResponseEntity<SearchResponse> search(@RequestBody @Valid SearchRequest request) {
        return ResponseEntity.ok(mateService.search(request));
    }

    @PostMapping("/append")
    public ResponseEntity<AppendResponse> append(@RequestBody @Valid AppendRequest request) {
        return ResponseEntity.ok(mateService.append(request));
    }

    @PostMapping("/remove")
    public ResponseEntity<RemoveResponse> remove(@RequestBody @Valid RemoveRequest request) {
        return ResponseEntity.ok(mateService.remove(request));
    }
}
