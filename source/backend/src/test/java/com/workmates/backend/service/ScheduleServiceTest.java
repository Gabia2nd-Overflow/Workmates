package com.workmates.backend.service;

import com.workmates.backend.domain.Schedule;
import com.workmates.backend.repository.ScheduleRepository;
import com.workmates.backend.web.dto.ScheduleDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ScheduleServiceTest {

    @Mock
    private ScheduleRepository scheduleRepository;

    @InjectMocks
    private ScheduleService scheduleService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createSchedule_shouldSaveAndReturnDto() {
        ScheduleDto.CreateRequest dto = new ScheduleDto.CreateRequest("회의", "내용", LocalDateTime.now(), LocalDateTime.now().plusDays(1), "HIGH");
        Schedule entity = new Schedule(); entity.setTitle("회의");

        when(scheduleRepository.save(any(Schedule.class))).thenReturn(entity);

        ScheduleDto.Response result = scheduleService.createSchedule(dto);

        assertEquals("회의", result.getTitle());
        verify(scheduleRepository, times(1)).save(any(Schedule.class));
    }

    @Test
    void updateSchedule_shouldUpdateExistingEntity() {
        Long id = 1L;
        Schedule existing = new Schedule(); existing.setId(id); existing.setTitle("원본");
        ScheduleDto.UpdateRequest dto = new ScheduleDto.UpdateRequest("수정", "내용", LocalDateTime.now(), LocalDateTime.now().plusDays(1), "LOW", true);

        when(scheduleRepository.findById(id)).thenReturn(Optional.of(existing));
        when(scheduleRepository.save(existing)).thenReturn(existing);

        ScheduleDto.Response result = scheduleService.updateSchedule(id, dto);

        assertEquals("수정", result.getTitle());
        verify(scheduleRepository, times(1)).save(existing);
    }

    @Test
    void updateSchedule_shouldThrowExceptionWhenNotFound() {
        when(scheduleRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> scheduleService.updateSchedule(99L, mock(ScheduleDto.UpdateRequest.class)));
    }

    @Test
    void deleteSchedule_shouldDeleteById() {
        Long id = 1L;

        scheduleService.deleteSchedule(id);

        verify(scheduleRepository, times(1)).deleteById(id);
    }

    @Test
    void getAllSchedules_shouldReturnListOfDto() {
        Schedule s1 = new Schedule(); s1.setTitle("일정1");
        Schedule s2 = new Schedule(); s2.setTitle("일정2");
        when(scheduleRepository.findAll()).thenReturn(Arrays.asList(s1, s2));

        List<ScheduleDto.Response> result = scheduleService.getAllSchedules();

        assertEquals(2, result.size());
        assertEquals("일정1", result.get(0).getTitle());
    }

    @Test
    void getScheduleStats_shouldReturnCorrectCounts() {
        when(scheduleRepository.count()).thenReturn(5L);
        when(scheduleRepository.countByIsCompleted(true)).thenReturn(2L);
        when(scheduleRepository.findByDueDateBefore(any(LocalDateTime.class)))
                .thenReturn(Collections.singletonList(new Schedule()));

        Map<String, Long> stats = scheduleService.getScheduleStats();

        assertEquals(5L, stats.get("total"));
        assertEquals(2L, stats.get("isCompleted"));
        assertEquals(1L, stats.get("dueSoon"));
    }
}