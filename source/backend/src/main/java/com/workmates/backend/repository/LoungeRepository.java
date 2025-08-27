package com.workmates.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workmates.backend.domain.Lounge;

@Repository
public interface LoungeRepository extends JpaRepository<Lounge, Long>{
    List<Lounge> findAllByWorkshopIdAndIsDeletedFalse(Long workshopId);
    Optional<Lounge> findByIdAndWorkshopIdAndIsDeletedFalse(Long loungeId, Long workshopId);
    boolean existsByWorkshopIdAndNameAndIsDeletedFalse(Long workshopId, String name);
}
