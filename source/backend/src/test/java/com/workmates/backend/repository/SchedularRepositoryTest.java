package com.workmates.backend.repository;

import com.workmates.backend.domain.Schedular;
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
class SchedularRepositoryTest {

    @Autowired
    private SchedularRepository schedularRepository;

    private Schedular createSampleSchedule(String title) {
        return Schedular.builder()
                .title(title)
                .context("테스트 컨텍스트")
                .startDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plusDays(1))
                .location("회의실 A")
                .importancy("HIGH")
                .completed(false)
                .build();
    }

    @Test
    @DisplayName("스케줄 생성 및 조회 테스트")
    void testCreateAndFind() {
        Schedular saved = schedularRepository.save(createSampleSchedule("테스트 일정"));
        Optional<Schedular> found = schedularRepository.findById(saved.getId());
        assertTrue(found.isPresent());
    }

    @Test
    @DisplayName("스케줄 수정 테스트")
    void testUpdate() {
        Schedular schedular = schedularRepository.save(createSampleSchedule("원본 일정"));
        schedular.setTitle("수정된 일정");
        Schedular updated = schedularRepository.save(schedular);
        assertEquals("수정된 일정", updated.getTitle());
    }

    @Test
    @DisplayName("스케줄 삭제 테스트")
    void testDelete() {
        Schedular schedular = schedularRepository.save(createSampleSchedule("삭제 일정"));
        Long id = schedular.getId();
        schedularRepository.delete(schedular);
        assertFalse(schedularRepository.findById(id).isPresent());
    }

    @Test
    @DisplayName("모든 스케줄 조회 테스트")
    void testFindAll() {
        schedularRepository.save(createSampleSchedule("일정1"));
        schedularRepository.save(createSampleSchedule("일정2"));
        List<Schedular> schedules = schedularRepository.findAll();
        assertTrue(schedules.size() >= 2);
    }
}