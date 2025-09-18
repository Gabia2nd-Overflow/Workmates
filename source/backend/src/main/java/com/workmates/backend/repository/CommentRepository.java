package com.workmates.backend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.workmates.backend.domain.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long>{
    
    Page<Comment> findByPostIdAndIsDeletedFalseOrderByIdAsc(Long postId, Pageable pageable);
    // 트리 표현을 위해 "원댓글 그룹 → 댓글 id" 순으로 정렬
    @Query("""
        select c from Comment c
        where c.postId = :postId and c.isDeleted = false
        order by coalesce(c.rootId, c.id) asc, c.id asc
    """)
    Page<Comment> pageByPostIdOrderByThreaded(Long postId, Pageable pageable);

    Optional<Comment> findByIdAndIsDeletedFalse(Long id);

    @Query(value = "select count(*) from comment where post_id = :postId and is_deleted = false", nativeQuery = true)
    Long countByPostId(Long postId);

    
}
