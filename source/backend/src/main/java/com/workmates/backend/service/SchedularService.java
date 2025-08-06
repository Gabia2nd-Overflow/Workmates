package com.workmates.backend.service;

import com.workmates.backend.domain.Schedular;
import com.workmates.backend.repository.SchedularRepository;
import com.workmates.backend.web.dto.SchedularDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SchedularService {

    private final SchedularRepository schedularRepository;

    public SchedularDTO.Response createSchedule(SchedularDTO.CreateRequest dto) {
        Schedular entity = toEntity(dto);
        return SchedularDTO.Response.from(schedularRepository.save(entity));
    }

    public SchedularDTO.Response updateSchedule(Long id, SchedularDTO.UpdateRequest dto) {
        return schedularRepository.findById(id).map(sched -> {
            sched.setTitle(dto.getTitle());
            sched.setContext(dto.getContext());
            sched.setStartDate(dto.getStartDate());
            sched.setDueDate(dto.getDueDate());
            sched.setLocation(dto.getLocation());
            sched.setImportancy(dto.getImportancy());
            sched.setCompleted(dto.getCompleted());
            return SchedularDTO.Response.from(schedularRepository.save(sched));
        }).orElseThrow(() -> new NoSuchElementException("Schedule not found"));
    }

    public void deleteSchedule(Long id) {
        schedularRepository.deleteById(id);
    }

    public List<SchedularDTO.Response> getAllSchedules() {
        return schedularRepository.findAll().stream()
                .map(SchedularDTO.Response::from)
                .collect(Collectors.toList());
    }

    public Map<String, Long> getScheduleStats() {
        long total = schedularRepository.count();
        long completed = schedularRepository.countByCompleted(true);
        long dueSoon = schedularRepository.findByDueDateBefore(LocalDateTime.now().plusDays(7))
                                          .stream()
                                          .filter(s -> !s.getCompleted())
                                          .count();

        Map<String, Long> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("completed", completed);
        stats.put("dueSoon", dueSoon);
        return stats;
    }

    private Schedular toEntity(SchedularDTO.CreateRequest dto) {
        return Schedular.builder()
                .title(dto.getTitle())
                .context(dto.getContext())
                .startDate(dto.getStartDate())
                .dueDate(dto.getDueDate())
                .location(dto.getLocation())
                .importancy(dto.getImportancy())
                .completed(false) // 새 일정은 기본적으로 미완료
                .build();
    }
}