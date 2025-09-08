package com.workmates.backend.repository;

import com.workmates.backend.domain.Thread;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ThreadRepository extends JpaRepository<Thread, Long> {
    List<Thread> findByWorkshopIdAndIsDeletedFalse(Long workshopId);
     boolean existsByIdAndWorkshopId(Long id, Long workshopId);// workshopid 검증용
}
