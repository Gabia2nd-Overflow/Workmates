package com.workmates.backend.web.controller;

import com.workmates.backend.web.dto.ScheduleDto;
import com.workmates.backend.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService schedularService;

    @PostMapping
    public ResponseEntity<ScheduleDto.Response> create(@RequestBody ScheduleDto.CreateRequest request) {
        return ResponseEntity.ok(schedularService.createSchedule(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScheduleDto.Response> update(@PathVariable Long id,
                                                        @RequestBody ScheduleDto.UpdateRequest request) {
        return ResponseEntity.ok(schedularService.updateSchedule(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        schedularService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ScheduleDto.Response>> getAll() {
        return ResponseEntity.ok(schedularService.getAllSchedules());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(schedularService.getScheduleStats());
    }
}