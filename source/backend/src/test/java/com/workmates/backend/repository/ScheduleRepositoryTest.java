package com.workmates.backend.repository;

import com.workmates.backend.domain.Schedule;
import com.workmates.backend.domain.Schedule.*;
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

    @Test
    @DisplayName("미완료 목록: isCompleted=false && isDeleted=false && dueDate 오름차순")
    void findIncompleteByWorkshop_sorted() {
        Long ws = 10L;
        // given: 서로 다른 dueDate와 상태 섞어서 저장
        Schedule done = Schedule.builder()
                .title("완료건").content("...")
                .startDate(LocalDateTime.of(2025,9,1,9,0))
                .dueDate(LocalDateTime.of(2025,9,1,9,30))
                .importancy(Importance.LOW)
                .isCompleted(true).isDeleted(false)
                .workshopId(ws).writerId("u1").build();

        Schedule deleted = Schedule.builder()
                .title("삭제건").content("...")
                .startDate(LocalDateTime.of(2025,9,1,9,0))
                .dueDate(LocalDateTime.of(2025,9,1,9,45))
                .importancy(Importance.HIGH)
                .isCompleted(false).isDeleted(true)
                .workshopId(ws).writerId("u1").build();

        Schedule a = Schedule.builder()
                .title("A").content("...")
                .startDate(LocalDateTime.of(2025,9,1,10,0))
                .dueDate(LocalDateTime.of(2025,9,1,10,30))
                .importancy(Importance.MEDIUM)
                .isCompleted(false).isDeleted(false)
                .workshopId(ws).writerId("u1").build();

        Schedule b = Schedule.builder()
                .title("B").content("...")
                .startDate(LocalDateTime.of(2025,9,1,10,0))
                .dueDate(LocalDateTime.of(2025,9,1,11,0))
                .importancy(Importance.HIGH)
                .isCompleted(false).isDeleted(false)
                .workshopId(ws).writerId("u1").build();

        scheduleRepository.saveAll(List.of(done, deleted, b, a));

        // when
        List<Schedule> found =
                scheduleRepository.findByWorkshopIdAndIsCompletedFalseAndIsDeletedFalseOrderByDueDateAsc(ws);

        // then
        assertEquals(2, found.size());                  // 완료/삭제 제외
        assertEquals("A", found.get(0).getTitle());     // dueDate 오름차순
        assertEquals("B", found.get(1).getTitle());
    }
    @Test
@DisplayName("중요도별 미완료 카운트: 완료/삭제 제외하고 group by")
void countIncompleteGroupByImportance() {
    Long ws = 10L;

    // given: HIGH 3개(1개는 완료), MEDIUM 2개(1개는 삭제), LOW 1개(유효)
    scheduleRepository.saveAll(List.of(
        // HIGH 유효 2
        Schedule.builder().title("H1").content("c").importancy(Importance.HIGH).isCompleted(false).isDeleted(false)
                .startDate(LocalDateTime.of(2025,9,1,9,0)).dueDate(LocalDateTime.of(2025,9,2,9,0))
                .workshopId(ws).writerId("u").build(),
        Schedule.builder().title("H2").content("c").importancy(Importance.HIGH).isCompleted(false).isDeleted(false)
                .startDate(LocalDateTime.of(2025,9,1,9,0)).dueDate(LocalDateTime.of(2025,9,3,9,0))
                .workshopId(ws).writerId("u").build(),
        // HIGH 완료 1 (제외)
        Schedule.builder().title("H3").content("c").importancy(Importance.HIGH).isCompleted(true).isDeleted(false)
                .startDate(LocalDateTime.of(2025,9,1,9,0)).dueDate(LocalDateTime.of(2025,9,4,9,0))
                .workshopId(ws).writerId("u").build(),
        // MEDIUM 유효 1
        Schedule.builder().title("M1").content("c").importancy(Importance.MEDIUM).isCompleted(false).isDeleted(false)
                .startDate(LocalDateTime.of(2025,9,1,9,0)).dueDate(LocalDateTime.of(2025,9,2,9,0))
                .workshopId(ws).writerId("u").build(),
        // MEDIUM 삭제 1 (제외)
        Schedule.builder().title("M2").content("c").importancy(Importance.MEDIUM).isCompleted(false).isDeleted(true)
                .startDate(LocalDateTime.of(2025,9,1,9,0)).dueDate(LocalDateTime.of(2025,9,2,9,0))
                .workshopId(ws).writerId("u").build(),
        // LOW 유효 1
        Schedule.builder().title("L1").content("c").importancy(Importance.LOW).isCompleted(false).isDeleted(false)
                .startDate(LocalDateTime.of(2025,9,1,9,0)).dueDate(LocalDateTime.of(2025,9,2,9,0))
                .workshopId(ws).writerId("u").build()
    ));

    var rows = scheduleRepository.countIncompleteGroupByImportanceForWorkshop(ws);

    // then: HIGH=2, MEDIUM=1, LOW=1
    long high = rows.stream().filter(r -> r.getImportancy() == Importance.HIGH).mapToLong(r -> r.getCnt()).findFirst().orElse(0);
    long med  = rows.stream().filter(r -> r.getImportancy() == Importance.MEDIUM).mapToLong(r -> r.getCnt()).findFirst().orElse(0);
    long low  = rows.stream().filter(r -> r.getImportancy() == Importance.LOW).mapToLong(r -> r.getCnt()).findFirst().orElse(0);

    assertEquals(2, high);
    assertEquals(1, med);
    assertEquals(1, low);
    }
}