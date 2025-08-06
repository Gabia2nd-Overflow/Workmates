package com.workmates.backend.service;

import com.workmates.backend.domain.Schedular;
import com.workmates.backend.repository.SchedularRepository;
import com.workmates.backend.web.dto.SchedularDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SchedularServiceTest {

    @Mock
    private SchedularRepository schedularRepository;

    @InjectMocks
    private SchedularService schedularService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createSchedule_shouldSaveAndReturnDto() {
        SchedularDTO.CreateRequest dto = new SchedularDTO.CreateRequest("회의", "내용", LocalDateTime.now(), LocalDateTime.now().plusDays(1), "회의실", "HIGH");
        Schedular entity = new Schedular(); entity.setTitle("회의");

        when(schedularRepository.save(any(Schedular.class))).thenReturn(entity);

        SchedularDTO.Response result = schedularService.createSchedule(dto);

        assertEquals("회의", result.getTitle());
        verify(schedularRepository, times(1)).save(any(Schedular.class));
    }

    @Test
    void updateSchedule_shouldUpdateExistingEntity() {
        Long id = 1L;
        Schedular existing = new Schedular(); existing.setId(id); existing.setTitle("원본");
        SchedularDTO.UpdateRequest dto = new SchedularDTO.UpdateRequest("수정", "내용", LocalDateTime.now(), LocalDateTime.now().plusDays(1), "회의실B", "LOW", true);

        when(schedularRepository.findById(id)).thenReturn(Optional.of(existing));
        when(schedularRepository.save(existing)).thenReturn(existing);

        SchedularDTO.Response result = schedularService.updateSchedule(id, dto);

        assertEquals("수정", result.getTitle());
        verify(schedularRepository, times(1)).save(existing);
    }

    @Test
    void updateSchedule_shouldThrowExceptionWhenNotFound() {
        when(schedularRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> schedularService.updateSchedule(99L, mock(SchedularDTO.UpdateRequest.class)));
    }

    @Test
    void deleteSchedule_shouldDeleteById() {
        Long id = 1L;

        schedularService.deleteSchedule(id);

        verify(schedularRepository, times(1)).deleteById(id);
    }

    @Test
    void getAllSchedules_shouldReturnListOfDto() {
        Schedular s1 = new Schedular(); s1.setTitle("일정1");
        Schedular s2 = new Schedular(); s2.setTitle("일정2");
        when(schedularRepository.findAll()).thenReturn(Arrays.asList(s1, s2));

        List<SchedularDTO.Response> result = schedularService.getAllSchedules();

        assertEquals(2, result.size());
        assertEquals("일정1", result.get(0).getTitle());
    }

    @Test
    void getScheduleStats_shouldReturnCorrectCounts() {
        when(schedularRepository.count()).thenReturn(5L);
        when(schedularRepository.countByCompleted(true)).thenReturn(2L);
        when(schedularRepository.findByDueDateBefore(any(LocalDateTime.class)))
                .thenReturn(Collections.singletonList(new Schedular()));

        Map<String, Long> stats = schedularService.getScheduleStats();

        assertEquals(5L, stats.get("total"));
        assertEquals(2L, stats.get("completed"));
        assertEquals(1L, stats.get("dueSoon"));
    }
}