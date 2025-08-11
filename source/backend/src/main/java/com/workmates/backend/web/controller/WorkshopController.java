package com.workmates.backend.web.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
    public WorkshopDto.Response create(@RequestBody @Valid WorkshopDto.CreateRequest req) {
        return workshopService.create(req);
    }

    @GetMapping
    public List<WorkshopDto.Response> list() {
        return workshopService.list();
    }

    @GetMapping("/{id}")
    public WorkshopDto.Response get(@PathVariable Long id) {
        return workshopService.get(id);
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
