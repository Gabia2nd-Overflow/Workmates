package com.workmates.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.workmates.backend.domain.User;

@Repository
public interface UserRepository extends JpaRepository<User, String>{

    Optional<User> findById(String id);

    Optional<User> findByNickname(String nickname);
 
    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);

    @Query("SELECT m FROM User m WHERE m.nickname = :nickname OR m.email = :email")
    Optional<User> findByNicknameOrEmail(@Param("nickname") String nickname, @Param("email") String email);
}
