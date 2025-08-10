package com.workmates.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.workmates.backend.domain.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{

    Optional<User> findById(String id);

    Optional<User> findByNickname(String nickname);
 
    boolean existsByNickname(String nickname);

    // boolean existsByEmail(String email); MailRepository에서 구현

    // @Query("SELECT m FROM User m WHERE m.username = :username OR m.email = :email")
    // Optional<User> findByUsernameOrEmail(@Param("username") String username, @Param("email") String email);
    // 닉네임 또는 이메일을 인자로 받아 사용자를 반환해야 함. MailRepository가 구체화되면 그때 구현 위치를 결정할 것 
}
