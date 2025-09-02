package com.workmates.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workmates.backend.domain.Block;
import com.workmates.backend.domain.BlockId;

@Repository
public interface BlockRepository extends JpaRepository<Block, BlockId> {
    
}
