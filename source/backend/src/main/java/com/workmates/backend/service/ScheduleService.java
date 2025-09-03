package com.workmates.backend.service;

import com.workmates.backend.domain.Importance;
import com.workmates.backend.domain.Schedule;
import com.workmates.backend.repository.ScheduleRepository;
import com.workmates.backend.web.dto.ScheduleDto;
import com.workmates.backend.web.dto.ScheduleStatsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    // 생성: writerId / workshopId는 DTO 외부에서 주입(컨트롤러에서 PathVariable/인증으로 추출)
    @Transactional
    public ScheduleDto.Response createSchedule(ScheduleDto.CreateRequest dto, Long workshopId, String writerId) {
        validateDates(dto.getStartDate(), dto.getDueDate()); // 400
        ensureWorkshopAccess(workshopId, writerId); // 403
        Schedule entity = toEntity(dto, workshopId, writerId);
        return ScheduleDto.Response.from(scheduleRepository.save(entity));
    }

    // 수정: (현재 접근 제어 파라미터 없음 — 정책 확정 후 currentUserId 받아서 가드 추가 권장)
    @Transactional
    public ScheduleDto.Response updateSchedule(Long id, ScheduleDto.UpdateRequest dto) {
        return scheduleRepository.findById(id).map(sched -> {
            validateDates(dto.getStartDate(), dto.getDueDate()); // 400
            sched.setTitle(dto.getTitle());
            sched.setContent(dto.getContent());
            sched.setStartDate(dto.getStartDate());
            sched.setDueDate(dto.getDueDate());
            // UpdateRequest.importancy 는 String → Enum 안전 파싱
            sched.setImportancy(parseImportance(dto.getImportancy()));
            // Boolean 오토언박싱 NPE 방지
            sched.setIsCompleted(Boolean.TRUE.equals(dto.getIsCompleted()));

            return ScheduleDto.Response.from(scheduleRepository.save(sched));
        }).orElseThrow(() -> new NoSuchElementException("Schedule not found")); // 404
    }

    // @SQLDelete + @Where 사용 시, 실제로는 UPDATE isDeleted=true 로 동작.
    @Transactional
    public void deleteSchedule(Long id) {
        // (정책 확정 후) currentUserId 받아서 워크샵 접근 가드/작성자 권한 체크 권장
        scheduleRepository.deleteById(id);
    }

    // 워크샵 단위 조회 (다른 사용자 일정 포함)
    public List<ScheduleDto.Response> getSchedulesForWorkshop(Long workshopId, String userId) {
        ensureWorkshopAccess(workshopId, userId); // 403
        return scheduleRepository.findByWorkshopId(workshopId).stream()
                .map(ScheduleDto.Response::from)
                .collect(Collectors.toList());
    }

    // 통계: 키명 "completed" 로 정정
    public Map<String, Long> getScheduleStats() {
        long total = scheduleRepository.count();
        long completed = scheduleRepository.countByIsCompleted(true);
        long dueSoon = scheduleRepository.findByDueDateBefore(LocalDateTime.now().plusDays(7))
                .stream()
                .filter(s -> !Boolean.TRUE.equals(s.getIsCompleted()))
                .count();

        Map<String, Long> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("isCompleted", completed); // ← 키명 수정
        stats.put("dueSoon", dueSoon);
        return stats;
    }

    // ---------- 내부 헬퍼 ----------
    private void validateDates(LocalDateTime start, LocalDateTime due) {
        if (start == null || due == null) {
            throw new IllegalArgumentException("시작일과 마감일은 필수입니다.");
        }
        if (start.isAfter(due)) {
            throw new IllegalArgumentException("시작일은 마감일보다 이후일 수 없습니다.");
        }
    }

    private void ensureWorkshopAccess(Long workshopId, String userId) {
        if (workshopId == null || userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("workshopId와 사용자 식별자는 필수입니다.");
        }
    }

    private Schedule toEntity(ScheduleDto.CreateRequest dto, Long workshopId, String writerId) {
        return Schedule.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .startDate(dto.getStartDate())
                .dueDate(dto.getDueDate())
                .importancy(dto.getImportancy() != null ? dto.getImportancy() : Importance.MEDIUM)
                .isCompleted(false) // 새 일정은 기본 미완료
                .workshopId(workshopId)
                .writerId(writerId)
                .build();
    }

    private Importance parseImportance(String value) {
        if (value == null || value.isBlank()) {
            return Importance.MEDIUM;
        }
        try {
            return Importance.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            // 잘못된 값이 들어오면 기본값으로 보정
            return Importance.MEDIUM;
        }
    }

    public ScheduleStatsDto getWorkshopStats(Long workshopId) {
        long total = scheduleRepository.countByWorkshopIdAndIsDeletedFalse(workshopId);
        long completed = scheduleRepository.countByWorkshopIdAndIsCompletedTrueAndIsDeletedFalse(workshopId);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime plus7 = now.plusDays(7);

        long dueSoon = scheduleRepository
                .countByWorkshopIdAndIsCompletedFalseAndIsDeletedFalseAndDueDateBetween(workshopId, now, plus7);

        long overdue = scheduleRepository
                .countByWorkshopIdAndIsCompletedFalseAndIsDeletedFalseAndDueDateLessThan(workshopId, now);

        Map<Importance, Long> byImportance = new EnumMap<>(Importance.class);
        for (Importance i : Importance.values()) byImportance.put(i, 0L);
        scheduleRepository.countIncompleteGroupByImportanceForWorkshop(workshopId)
                .forEach(row -> byImportance.put(row.getImportancy(), row.getCnt()));

        double rate = (total == 0) ? 0.0 : (completed * 100.0 / total);

        return new ScheduleStatsDto(
                total,
                completed,
                rate,
                dueSoon,
                overdue,     // ← 연체 카운트 추가
                byImportance
        );
    }

    public List<ScheduleDto.Response> listIncompleteForWorkshop(Long workshopId) {
        List<Schedule> entities =
                scheduleRepository.findByWorkshopIdAndIsCompletedFalseAndIsDeletedFalseOrderByDueDateAsc(workshopId);
        return entities.stream().map(ScheduleDto.Response::from).toList();
    }
}