package com.workmates.backend.web.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.workmates.backend.service.WorkshopService;
import com.workmates.backend.web.dto.WorkshopDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/workshops")
@RequiredArgsConstructor
public class WorkshopController {

    private final WorkshopService workshopService;

    @PostMapping
    public WorkshopDto.Response create(
            @RequestHeader("X-User-Id") String userId,      // ✅ DEV 헤더
            @RequestBody @Valid WorkshopDto.CreateRequest req
    ) {
        return workshopService.create(userId, req);
    }

    // ✅ DEV 전용: 헤더로 받은 userId 기준 "내 워크샵만" 목록
    @GetMapping
    public List<WorkshopDto.Response> list(
            @RequestHeader("X-User-Id") String userId
    ) {
        return workshopService.listForUser(userId);
    }

    // ✅ DEV 전용: 헤더로 받은 userId 기준 상세 (멤버십 체크 포함)
    @GetMapping("/{id}")
    public WorkshopDto.Response get(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") String userId
    ) {
        return workshopService.getForUser(id, userId);
    }

    @PatchMapping("/{id}")
    public WorkshopDto.Response update(
            @PathVariable Long id,
            @RequestBody WorkshopDto.UpdateRequest req) {
        return workshopService.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        workshopService.softDelete(id);
    }

}
