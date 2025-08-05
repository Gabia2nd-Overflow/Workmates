package com.workmates.backend.web;

import com.workmates.backend.web.dto.SchedularDTO;
import com.workmates.backend.service.SchedularService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class SchedularController {

    private final SchedularService schedularService;

    @PostMapping
    public ResponseEntity<SchedularDTO.Response> create(@RequestBody SchedularDTO.CreateRequest request) {
        return ResponseEntity.ok(schedularService.createSchedule(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchedularDTO.Response> update(@PathVariable Long id,
                                                        @RequestBody SchedularDTO.UpdateRequest request) {
        return ResponseEntity.ok(schedularService.updateSchedule(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        schedularService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<SchedularDTO.Response>> getAll() {
        return ResponseEntity.ok(schedularService.getAllSchedules());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(schedularService.getScheduleStats());
    }
}