package com.workmates.backend.repository;

import java.util.List;
import java.util.Optional; // ✅ 이 줄이 반드시 필요

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workmates.backend.domain.Workshop;

@Repository
public interface WorkshopRepository extends JpaRepository<Workshop, Long> {
    // 소프트 삭제 제외 목록
    List<Workshop> findAllByIsDeletedFalse();

    // 상세 조회(삭제 제외)
    Optional<Workshop> findByIdAndIsDeletedFalse(Long id);

    boolean existsByIdAndIsDeletedFalse(Long id);
}