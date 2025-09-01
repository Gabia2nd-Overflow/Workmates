package com.workmates.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workmates.backend.domain.Mate;
import com.workmates.backend.domain.MateId;

@Repository
public interface MateRepository extends JpaRepository<Mate, MateId> {
    
}
