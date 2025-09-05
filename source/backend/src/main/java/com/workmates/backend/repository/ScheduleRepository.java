package com.workmates.backend.repository;

import com.workmates.backend.domain.Schedule;
import com.workmates.backend.repository.projection.ImportanceCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // --- 워크샵별 총계/완료 ---
    long countByWorkshopIdAndIsDeletedFalse(Long workshopId);
    long countByWorkshopIdAndIsCompletedTrueAndIsDeletedFalse(Long workshopId);

    // --- 워크샵별 D-7 "이하" (양끝 포함 Between) ---
    long countByWorkshopIdAndIsCompletedFalseAndIsDeletedFalseAndDueDateBetween(
            Long workshopId,
            LocalDateTime startInclusive,
            LocalDateTime endInclusive
    );

    // --- 워크샵별 연체(마감 지남) 미완료 ---
    long countByWorkshopIdAndIsCompletedFalseAndIsDeletedFalseAndDueDateLessThan(
            Long workshopId,
            LocalDateTime nowExclusive
    );

    // --- 워크샵별 미완료 리스트: 마감일 오름차순 ---
    List<Schedule> findByWorkshopIdAndIsCompletedFalseAndIsDeletedFalseOrderByDueDateAsc(Long workshopId);

    // --- 워크샵별 중요도별 미완료 카운트 (필드명: importancy) ---
    @Query("""
        select s.importancy as importancy, count(s) as cnt
        from Schedule s
        where s.isDeleted = false
          and s.isCompleted = false
          and s.workshopId = :workshopId
        group by s.importancy
    """)
    List<ImportanceCount> countIncompleteGroupByImportanceForWorkshop(@Param("workshopId") Long workshopId);

    List<Schedule> findByIsCompleted(boolean isCompleted);

    long countByIsCompleted(boolean isCompleted);

    List<Schedule> findByDueDateBefore(LocalDateTime dueDate);

    List<Schedule> findByWorkshopId(Long workshopId);
}