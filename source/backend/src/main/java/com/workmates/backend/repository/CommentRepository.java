package com.workmates.backend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workmates.backend.domain.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long>{
    
    Page<Comment> findByPostIdAndIsDeletedFalseOrderByIdAsc(Long postId, Pageable pageable);
    Optional<Comment> findByIdAndIsDeletedFalse(Long id);
}
