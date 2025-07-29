package com.workmates.backend.service;

import com.workmates.backend.domain.Schedular;
import com.workmates.backend.repository.SchedularRepository;
import com.workmates.backend.web.dto.SchedularDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SchedularService {

    private final SchedularRepository schedularRepository;

    public SchedularDTO createSchedule(SchedularDTO dto) {
        Schedular entity = toEntity(dto);
        return toDTO(schedularRepository.save(entity));
    }

    public SchedularDTO updateSchedule(Long id, SchedularDTO dto) {
        return schedularRepository.findById(id).map(sched -> {
            sched.setTitle(dto.getTitle());
            sched.setContext(dto.getContext());
            sched.setStartDate(dto.getStartDate());
            sched.setDueDate(dto.getDueDate());
            sched.setLocation(dto.getLocation());
            sched.setImportancy(dto.getImportancy());
            sched.setCompleted(dto.getCompleted());
            return toDTO(schedularRepository.save(sched));
        }).orElseThrow(() -> new NoSuchElementException("Schedule not found"));
    }

    public void deleteSchedule(Long id) {
        schedularRepository.deleteById(id);
    }

    public List<SchedularDTO> getAllSchedules() {
        return schedularRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Map<String, Long> getScheduleStats() {
        long total = schedularRepository.count();
        long completed = schedularRepository.countByCompleted(true);

        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_YEAR, 7);
        Date oneWeekLater = cal.getTime();
        long dueSoon = schedularRepository.findByDueDateBefore(oneWeekLater)
                                          .stream()
                                          .filter(s -> !s.getCompleted())
                                          .count();

        Map<String, Long> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("completed", completed);
        stats.put("dueSoon", dueSoon);
        return stats;
    }

    private SchedularDTO toDTO(Schedular s) {
        return SchedularDTO.builder()
                .id(s.getId())
                .title(s.getTitle())
                .context(s.getContext())
                .startDate(s.getStartDate())
                .dueDate(s.getDueDate())
                .location(s.getLocation())
                .importancy(s.getImportancy())
                .completed(s.getCompleted())
                .createdAt(java.sql.Timestamp.valueOf(s.getCreatedAt()))
                .build();
    }

    private Schedular toEntity(SchedularDTO dto) {
        return Schedular.builder()
                .title(dto.getTitle())
                .context(dto.getContext())
                .startDate(dto.getStartDate())
                .dueDate(dto.getDueDate())
                .location(dto.getLocation())
                .importancy(dto.getImportancy())
                .completed(dto.getCompleted() != null && dto.getCompleted())
                .build();
    }
}
