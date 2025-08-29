package com.workmates.backend.repository;

import com.workmates.backend.domain.Importance;
import com.workmates.backend.domain.Schedule;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
class ScheduleRepositoryTest {

    @Autowired ScheduleRepository scheduleRepository;

    @Test
    @DisplayName("findByWorkshopId: 소프트 삭제 항목은 @Where로 자동 제외")
    void findByWorkshopId_excludesSoftDeleted() {
        Schedule keep = Schedule.builder()
                .title("보존").content("...")
                .startDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plusHours(1))
                .importancy(Importance.LOW)
                .isCompleted(false)
                .isDeleted(false)
                .workshopId(10L).writerId("alice")
                .build();

        Schedule softDeleted = Schedule.builder()
                .title("삭제됨").content("...")
                .startDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plusHours(1))
                .importancy(Importance.HIGH)
                .isCompleted(false)
                .isDeleted(true) // 소프트 삭제
                .workshopId(10L).writerId("bob")
                .build();

        scheduleRepository.save(keep);
        scheduleRepository.save(softDeleted);

        List<Schedule> found = scheduleRepository.findByWorkshopId(10L);
        assertEquals(1, found.size());
        assertEquals("보존", found.get(0).getTitle());
    }
}