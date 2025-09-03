package com.workmates.backend.service;

import com.workmates.backend.domain.Importance;
import com.workmates.backend.domain.Schedule;
import com.workmates.backend.repository.ScheduleRepository;
import com.workmates.backend.web.dto.ScheduleDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ScheduleServiceTest {

    @Mock ScheduleRepository scheduleRepository;

    @InjectMocks ScheduleService scheduleService;

    @Test
    @DisplayName("생성 성공: writerId/workshopId 주입 및 날짜 검증")
    void createSchedule_success() {
        var dto = ScheduleDto.CreateRequest.builder()
                .title("회의").content("리뷰")
                .startDate(LocalDateTime.of(2025,9,1,10,0))
                .dueDate(LocalDateTime.of(2025,9,1,11,0))
                .importancy(Importance.MEDIUM)
                .build();

        when(scheduleRepository.save(any(Schedule.class))).thenAnswer(inv -> inv.getArgument(0));

        var res = scheduleService.createSchedule(dto, 10L, "alice");

        verify(scheduleRepository).save(argThat(s ->
                s.getWorkshopId().equals(10L)
                        && "alice".equals(s.getWriterId())
                        && s.getImportancy() == Importance.MEDIUM
                        && Boolean.FALSE.equals(s.getIsCompleted())
        ));
        assertEquals("회의", res.getTitle());
    }

    @Test
    @DisplayName("생성 실패: startDate > dueDate → IllegalArgumentException")
    void createSchedule_invalidDates() {
        var dto = ScheduleDto.CreateRequest.builder()
                .title("회의").content("리뷰")
                .startDate(LocalDateTime.of(2025,9,1,12,0))
                .dueDate(LocalDateTime.of(2025,9,1,11,0))
                .build();

        assertThrows(IllegalArgumentException.class,
                () -> scheduleService.createSchedule(dto, 10L, "alice"));
        verifyNoInteractions(scheduleRepository);
    }

    @Test
    @DisplayName("수정 성공: UpdateRequest.importancy(String) → Enum 파싱")
    void updateSchedule_parsesEnum() {
        var existing = Schedule.builder()
                .id(1L).title("t").content("c")
                .startDate(LocalDateTime.of(2025,9,1,10,0))
                .dueDate(LocalDateTime.of(2025,9,1,11,0))
                .importancy(Importance.MEDIUM)
                .isCompleted(false)
                .workshopId(10L).writerId("alice")
                .build();

        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(scheduleRepository.save(any(Schedule.class))).thenAnswer(inv -> inv.getArgument(0));

        var req = ScheduleDto.UpdateRequest.builder()
                .title("수정제목").content("수정내용")
                .startDate(existing.getStartDate())
                .dueDate(existing.getDueDate())
                .importancy("HIGH")
                .isCompleted(true)
                .build();

        var res = scheduleService.updateSchedule(1L, req);

        assertEquals(Importance.HIGH, res.getImportancy());
        assertTrue(res.getIsCompleted());
        verify(scheduleRepository).save(any(Schedule.class));
    }

    @Test
    @DisplayName("수정 실패: 대상 없음 → NoSuchElementException(404 핸들됨)")
    void updateSchedule_notFound() {
        when(scheduleRepository.findById(99L)).thenReturn(Optional.empty());
        var req = ScheduleDto.UpdateRequest.builder()
                .title("x").content("y")
                .startDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plusHours(1))
                .importancy("LOW")
                .isCompleted(false)
                .build();

        assertThrows(NoSuchElementException.class, () -> scheduleService.updateSchedule(99L, req));
    }

    @Test
    @DisplayName("삭제: deleteById 호출(@SQLDelete로 소프트 삭제)")
    void deleteSchedule_callsRepository() {
        doNothing().when(scheduleRepository).deleteById(1L);
        scheduleService.deleteSchedule(1L);
        verify(scheduleRepository).deleteById(1L);
    }
}