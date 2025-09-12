package com.workmates.backend.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.workmates.backend.domain.Schedule.Importance;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ScheduleTest {

    @Test
    @DisplayName("빌더 기본값: importancy=MEDIUM, isCompleted=false, isDeleted=false")
    void builder_defaults() {
        var now = LocalDateTime.now();
        Schedule s = Schedule.builder()
                .title("t").content("c")
                .startDate(now)
                .dueDate(now.plusHours(1))
                .workshopId(10L)
                .writerId("alice")
                .build();

        assertEquals(Importance.MEDIUM, s.getImportancy());
        assertFalse(Boolean.TRUE.equals(s.getIsCompleted()));
        assertFalse(Boolean.TRUE.equals(s.getIsDeleted()));
    }

    @Test
    @DisplayName("Enum Importance 설정/조회")
    void importance_enum_set_get() {
        Schedule s = Schedule.builder()
                .title("t").content("c")
                .startDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plusHours(1))
                .workshopId(10L).writerId("alice")
                .importancy(Importance.HIGH)
                .build();

        assertEquals(Importance.HIGH, s.getImportancy());
    }
}