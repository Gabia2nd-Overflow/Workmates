package com.workmates.backend.service;

import com.workmates.backend.domain.Schedule;
import com.workmates.backend.repository.ScheduleRepository;
import com.workmates.backend.web.dto.ScheduleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository schedularRepository;

    public ScheduleDto.Response createSchedule(ScheduleDto.CreateRequest dto) {
        Schedule entity = toEntity(dto);
        return ScheduleDto.Response.from(schedularRepository.save(entity));
    }

    public ScheduleDto.Response updateSchedule(Long id, ScheduleDto.UpdateRequest dto) {
        return schedularRepository.findById(id).map(sched -> {
            sched.setTitle(dto.getTitle());
            sched.setContent(dto.getContent());
            sched.setStartDate(dto.getStartDate());
            sched.setDueDate(dto.getDueDate());
            sched.setImportancy(dto.getImportancy());
            sched.setIsCompleted(dto.getIsCompleted());
            return ScheduleDto.Response.from(schedularRepository.save(sched));
        }).orElseThrow(() -> new NoSuchElementException("Schedule not found"));
    }

    public void deleteSchedule(Long id) {
        schedularRepository.deleteById(id);
    }

    public List<ScheduleDto.Response> getAllSchedules() {
        return schedularRepository.findAll().stream()
                .map(ScheduleDto.Response::from)
                .collect(Collectors.toList());
    }

    public Map<String, Long> getScheduleStats() {
        long total = schedularRepository.count();
        long completed = schedularRepository.countByIsCompleted(true);
        long dueSoon = schedularRepository.findByDueDateBefore(LocalDateTime.now().plusDays(7))
                                          .stream()
                                          .filter(s -> !s.getIsCompleted())
                                          .count();

        Map<String, Long> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("isCompleted", completed);
        stats.put("dueSoon", dueSoon);
        return stats;
    }

    private Schedule toEntity(ScheduleDto.CreateRequest dto) {
        return Schedule.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .startDate(dto.getStartDate())
                .dueDate(dto.getDueDate())
                .importancy(dto.getImportancy())
                .isCompleted(false) // 새 일정은 기본적으로 미완료
                .build();
    }
}