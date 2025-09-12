package com.workmates.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import com.workmates.backend.domain.User;

@Repository
public interface UserRepository extends JpaRepository<User, String>{

    boolean existsById(@NonNull String id); // 아이디 존재여부 검증

    boolean existsByEmail(String email); // 이메일 존재여부 검증
}
