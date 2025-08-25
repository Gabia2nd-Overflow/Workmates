package com.workmates.backend.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ScheduleTest {

    @Test
    @DisplayName("Schedule 엔티티 생성 및 Getter/Setter 동작 테스트")
    void testScheduleCreation() {
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime due = start.plusDays(2);

        Schedule schedule = new Schedule();
        schedule.setId(1L);
        schedule.setTitle("팀 회의");
        schedule.setContent("주간 회의");
        schedule.setStartDate(start);
        schedule.setDueDate(due);
        schedule.setImportancy("HIGH");
        schedule.setIsCompleted(false);

        assertEquals(1L, schedule.getId());
        assertEquals("팀 회의", schedule.getTitle());
        assertEquals("주간 회의", schedule.getContent());
        assertEquals(start, schedule.getStartDate());
        assertEquals(due, schedule.getDueDate());
        assertEquals("HIGH", schedule.getImportancy());
        assertFalse(schedule.getIsCompleted());
    }

    @Test
    @DisplayName("Builder 패턴을 사용한 객체 생성 테스트")
    void testScheduleBuilder() {
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime due = start.plusDays(1);

        Schedule schedule = Schedule.builder()
                .title("단위 테스트 일정")
                .content("Builder 테스트")
                .startDate(start)
                .dueDate(due)
                .importancy("MEDIUM")
                .isCompleted(true)
                .build();

        assertEquals("단위 테스트 일정", schedule.getTitle());
        assertEquals("Builder 테스트", schedule.getContent());
        assertEquals(start, schedule.getStartDate());
        assertEquals(due, schedule.getDueDate());
        assertEquals("MEDIUM", schedule.getImportancy());
        assertTrue(schedule.getIsCompleted());
    }

    @Test
    @DisplayName("equals 및 hashCode 동작 확인")
    void testEqualsAndHashCode() {
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime due = start.plusDays(1);

        Schedule s1 = Schedule.builder()
                .id(1L)
                .title("동등성 일정")
                .content("테스트")
                .startDate(start)
                .dueDate(due)
                .importancy("LOW")
                .isCompleted(false)
                .build();

        Schedule s2 = Schedule.builder()
                .id(1L)
                .title("동등성 일정")
                .content("테스트")
                .startDate(start)
                .dueDate(due)
                .importancy("LOW")
                .isCompleted(false)
                .build();

        assertEquals(s1, s2);
        assertEquals(s1.hashCode(), s2.hashCode());
    }
}