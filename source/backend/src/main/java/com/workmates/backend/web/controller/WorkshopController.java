package com.workmates.backend.web.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User; // 스프링 기본 User
import org.springframework.web.bind.annotation.*;

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
            @AuthenticationPrincipal User principal,
            @RequestBody @Valid WorkshopDto.CreateRequest req
    ) {
        String userId = principal.getUsername(); // = JWT subject (id)
        return workshopService.create(userId, req);
    }

    @GetMapping
    public List<WorkshopDto.Response> list(@AuthenticationPrincipal User principal) {
        return workshopService.listForUser(principal.getUsername());
    }

    @GetMapping("/{id}")
    public WorkshopDto.Response get(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal
    ) {
        return workshopService.getForUser(id, principal.getUsername());
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