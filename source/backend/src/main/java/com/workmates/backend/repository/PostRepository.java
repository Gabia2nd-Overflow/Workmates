// com.workmates.backend.repository.PostRepository
package com.workmates.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workmates.backend.domain.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByThreadIdAndIsDeletedFalseOrderByCreatedAtDesc(Long threadId);
    boolean existsByIdAndThreadId(Long id, Long threadId); // 댓글 계층일치 검증용.
    Optional<Post> findByIdAndIsDeletedFalse(Long id);

    Page<Post> findAllByCategoryContainingIgnoreCase(String category, Pageable pageable);
}