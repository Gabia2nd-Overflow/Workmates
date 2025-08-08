package com.workmates.backend.web;

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
import com.workmates.backend.web.dto.WorkshopDTO;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/workshops")
@RequiredArgsConstructor
public class WorkshopController {

    private final WorkshopService workshopService;

    @PostMapping
    public WorkshopDTO.Response create(@RequestBody @Valid WorkshopDTO.CreateRequest req) {
        return workshopService.create(req);
    }

    @GetMapping
    public List<WorkshopDTO.Response> list() {
        return workshopService.list();
    }

    @GetMapping("/{id}")
    public WorkshopDTO.Response get(@PathVariable Long id) {
        return workshopService.get(id);
    }

    @PatchMapping("/{id}")
    public WorkshopDTO.Response update(
            @PathVariable Long id,
            @RequestBody WorkshopDTO.UpdateRequest req) {
        return workshopService.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        workshopService.softDelete(id);
    }
}
