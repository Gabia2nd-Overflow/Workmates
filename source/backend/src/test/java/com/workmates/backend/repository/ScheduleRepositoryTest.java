package com.workmates.backend.repository;

import com.workmates.backend.domain.Schedule;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")   // ✅ application-test.yml 사용 강제
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ScheduleRepositoryTest {

    @Autowired
    private ScheduleRepository scheduleRepository;

    private Schedule createSampleSchedule(String title) {
        return Schedule.builder()
                .title(title)
                .content("테스트 컨텍스트")
                .startDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plusDays(1))
                .importancy("HIGH")
                .isCompleted(false)
                .build();
    }

    @Test
    @DisplayName("스케줄 생성 및 조회 테스트")
    void testCreateAndFind() {
        Schedule saved = scheduleRepository.save(createSampleSchedule("테스트 일정"));
        Optional<Schedule> found = scheduleRepository.findById(saved.getId());
        assertTrue(found.isPresent());
    }

    @Test
    @DisplayName("스케줄 수정 테스트")
    void testUpdate() {
        Schedule schedule = scheduleRepository.save(createSampleSchedule("원본 일정"));
        schedule.setTitle("수정된 일정");
        Schedule updated = scheduleRepository.save(schedule);
        assertEquals("수정된 일정", updated.getTitle());
    }

    @Test
    @DisplayName("스케줄 삭제 테스트")
    void testDelete() {
        Schedule schedule = scheduleRepository.save(createSampleSchedule("삭제 일정"));
        Long id = schedule.getId();
        scheduleRepository.delete(schedule);
        assertFalse(scheduleRepository.findById(id).isPresent());
    }

    @Test
    @DisplayName("모든 스케줄 조회 테스트")
    void testFindAll() {
        scheduleRepository.save(createSampleSchedule("일정1"));
        scheduleRepository.save(createSampleSchedule("일정2"));
        List<Schedule> schedules = scheduleRepository.findAll();
        assertTrue(schedules.size() >= 2);
    }
}