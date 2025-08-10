package com.workmates.backend.repository;

import com.workmates.backend.domain.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findByIsCompleted(boolean isCompleted);

    long countByIsCompleted(boolean isCompleted);

    List<Schedule> findByDueDateBefore(LocalDateTime dueDate);
}