package com.workmates.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import com.workmates.backend.domain.User;

@Repository
public interface UserRepository extends JpaRepository<User, String>{

    Optional<User> findById(@NonNull String id); // 아이디를 기준으로 사용자 검색
 
    boolean existsById(@NonNull String id); // 아이디 존재여부 검증

    boolean existsByEmail(String email); // 이메일 존재여부 검증
}
