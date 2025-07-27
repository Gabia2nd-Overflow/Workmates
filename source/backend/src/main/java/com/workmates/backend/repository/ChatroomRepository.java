package com.workmates.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workmates.backend.domain.Chatroom;

public interface ChatroomRepository extends JpaRepository<Chatroom, Long>{

}
