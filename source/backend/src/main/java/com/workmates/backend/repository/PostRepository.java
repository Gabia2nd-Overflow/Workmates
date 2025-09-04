package com.workmates.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workmates.backend.domain.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByThreadId(Long threadId);
}
