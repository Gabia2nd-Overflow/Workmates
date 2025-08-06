package com.workmates.backend.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class SchedularTest {

    @Test
    @DisplayName("Schedular 엔티티 생성 및 Getter/Setter 동작 테스트")
    void testSchedularCreation() {
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime due = start.plusDays(2);

        Schedular schedular = new Schedular();
        schedular.setId(1L);
        schedular.setTitle("팀 회의");
        schedular.setContext("주간 회의");
        schedular.setStartDate(start);
        schedular.setDueDate(due);
        schedular.setLocation("회의실 A");
        schedular.setImportancy("HIGH");
        schedular.setCompleted(false);

        assertEquals(1L, schedular.getId());
        assertEquals("팀 회의", schedular.getTitle());
        assertEquals("주간 회의", schedular.getContext());
        assertEquals(start, schedular.getStartDate());
        assertEquals(due, schedular.getDueDate());
        assertEquals("회의실 A", schedular.getLocation());
        assertEquals("HIGH", schedular.getImportancy());
        assertFalse(schedular.getCompleted());
    }

    @Test
    @DisplayName("Builder 패턴을 사용한 객체 생성 테스트")
    void testSchedularBuilder() {
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime due = start.plusDays(1);

        Schedular schedular = Schedular.builder()
                .title("단위 테스트 일정")
                .context("Builder 테스트")
                .startDate(start)
                .dueDate(due)
                .location("온라인")
                .importancy("MEDIUM")
                .completed(true)
                .build();

        assertEquals("단위 테스트 일정", schedular.getTitle());
        assertEquals("Builder 테스트", schedular.getContext());
        assertEquals(start, schedular.getStartDate());
        assertEquals(due, schedular.getDueDate());
        assertEquals("온라인", schedular.getLocation());
        assertEquals("MEDIUM", schedular.getImportancy());
        assertTrue(schedular.getCompleted());
    }

    @Test
    @DisplayName("equals 및 hashCode 동작 확인")
    void testEqualsAndHashCode() {
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime due = start.plusDays(1);

        Schedular s1 = Schedular.builder()
                .id(1L)
                .title("동등성 일정")
                .context("테스트")
                .startDate(start)
                .dueDate(due)
                .location("A")
                .importancy("LOW")
                .completed(false)
                .build();

        Schedular s2 = Schedular.builder()
                .id(1L)
                .title("동등성 일정")
                .context("테스트")
                .startDate(start)
                .dueDate(due)
                .location("A")
                .importancy("LOW")
                .completed(false)
                .build();

        assertEquals(s1, s2);
        assertEquals(s1.hashCode(), s2.hashCode());
    }
}