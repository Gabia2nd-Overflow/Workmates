package com.workmates.backend.repository;

import com.workmates.backend.domain.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SchedularRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByCompleted(boolean completed);
    long countByCompleted(boolean completed);
    List<Schedule> findByDueDateBefore(LocalDateTime date);
}