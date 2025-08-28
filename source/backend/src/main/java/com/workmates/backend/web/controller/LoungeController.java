package com.workmates.backend.web.controller;

import com.workmates.backend.service.LoungeService;
import com.workmates.backend.web.dto.LoungeDto;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.http.HttpStatus;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/workshops/{workshopId}/lounges")
@RequiredArgsConstructor
public class LoungeController {

    private final LoungeService loungeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LoungeDto.Response create(@PathVariable Long workshopId,
                                     @RequestBody @Valid LoungeDto.CreateRequest req) {
        return loungeService.create(workshopId, req);
    }

    @GetMapping
    public List<LoungeDto.Response> list(@PathVariable Long workshopId) {
        return loungeService.list(workshopId);
    }

    @GetMapping("/{loungeId}")
    public LoungeDto.Response get(@PathVariable Long workshopId, @PathVariable Long loungeId) {
        return loungeService.get(workshopId, loungeId);
    }

    @PatchMapping("/{loungeId}")
    public LoungeDto.Response update(@PathVariable Long workshopId, @PathVariable Long loungeId,
                                     @RequestBody @Valid LoungeDto.UpdateRequest req) {
        return loungeService.update(workshopId, loungeId, req);
    }

    @DeleteMapping("/{loungeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long workshopId, @PathVariable Long loungeId) {
        loungeService.delete(workshopId, loungeId);
    }
}