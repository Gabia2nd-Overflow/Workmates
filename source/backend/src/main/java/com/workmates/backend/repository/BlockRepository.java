package com.workmates.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.workmates.backend.domain.Block;
import com.workmates.backend.domain.BlockId;

@Repository
public interface BlockRepository extends JpaRepository<Block, BlockId> {
    
    @Query(value = "SELECT target_id FROM BLOCK WHERE id = :id", nativeQuery = true)
    List<String> findAllByBlockerId(String id);
}
