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
    private ScheduleRepository schedularRepository;

    @InjectMocks
    private SchedularService schedularService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createSchedule_shouldSaveAndReturnDto() {
        ScheduleDto.CreateRequest dto = new ScheduleDto.CreateRequest("회의", "내용", LocalDateTime.now(), LocalDateTime.now().plusDays(1), "회의실", "HIGH");
        Schedule entity = new Schedule(); entity.setTitle("회의");

        when(schedularRepository.save(any(Schedule.class))).thenReturn(entity);

        ScheduleDto.Response result = schedularService.createSchedule(dto);

        assertEquals("회의", result.getTitle());
        verify(schedularRepository, times(1)).save(any(Schedule.class));
    }

    @Test
    void updateSchedule_shouldUpdateExistingEntity() {
        Long id = 1L;
        Schedule existing = new Schedule(); existing.setId(id); existing.setTitle("원본");
        ScheduleDto.UpdateRequest dto = new ScheduleDto.UpdateRequest("수정", "내용", LocalDateTime.now(), LocalDateTime.now().plusDays(1), "회의실B", "LOW", true);

        when(schedularRepository.findById(id)).thenReturn(Optional.of(existing));
        when(schedularRepository.save(existing)).thenReturn(existing);

        ScheduleDto.Response result = schedularService.updateSchedule(id, dto);

        assertEquals("수정", result.getTitle());
        verify(schedularRepository, times(1)).save(existing);
    }

    @Test
    void updateSchedule_shouldThrowExceptionWhenNotFound() {
        when(schedularRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> schedularService.updateSchedule(99L, mock(ScheduleDto.UpdateRequest.class)));
    }

    @Test
    void deleteSchedule_shouldDeleteById() {
        Long id = 1L;

        schedularService.deleteSchedule(id);

        verify(schedularRepository, times(1)).deleteById(id);
    }

    @Test
    void getAllSchedules_shouldReturnListOfDto() {
        Schedule s1 = new Schedule(); s1.setTitle("일정1");
        Schedule s2 = new Schedule(); s2.setTitle("일정2");
        when(schedularRepository.findAll()).thenReturn(Arrays.asList(s1, s2));

        List<ScheduleDto.Response> result = schedularService.getAllSchedules();

        assertEquals(2, result.size());
        assertEquals("일정1", result.get(0).getTitle());
    }

    @Test
    void getScheduleStats_shouldReturnCorrectCounts() {
        when(schedularRepository.count()).thenReturn(5L);
        when(schedularRepository.countByCompleted(true)).thenReturn(2L);
        when(schedularRepository.findByDueDateBefore(any(LocalDateTime.class)))
                .thenReturn(Collections.singletonList(new Schedule()));

        Map<String, Long> stats = schedularService.getScheduleStats();

        assertEquals(5L, stats.get("total"));
        assertEquals(2L, stats.get("completed"));
        assertEquals(1L, stats.get("dueSoon"));
    }
}