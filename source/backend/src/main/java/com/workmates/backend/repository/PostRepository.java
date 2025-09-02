package com.workmates.backend.repository;

import com.workmates.backend.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByThreadId(Long threadId);
}
