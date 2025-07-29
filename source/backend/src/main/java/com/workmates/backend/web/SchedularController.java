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
    public ResponseEntity<SchedularDTO> create(@RequestBody SchedularDTO schedular) {
        return ResponseEntity.ok(schedularService.createSchedule(schedular));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchedularDTO> update(@PathVariable Long id, @RequestBody SchedularDTO updated) {
        return ResponseEntity.ok(schedularService.updateSchedule(id, updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        schedularService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<SchedularDTO>> getAll() {
        return ResponseEntity.ok(schedularService.getAllSchedules());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(schedularService.getScheduleStats());
    }
}
