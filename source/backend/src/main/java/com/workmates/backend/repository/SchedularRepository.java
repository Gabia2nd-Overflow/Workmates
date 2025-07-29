package com.workmates.backend.repository;

import com.workmates.backend.domain.Schedular;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface SchedularRepository extends JpaRepository<Schedular, Long> {
    List<Schedular> findByCompleted(boolean completed);
    long countByCompleted(boolean completed);
    List<Schedular> findByDueDateBefore(Date date);
}
