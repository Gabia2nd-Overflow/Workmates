package com.workmates.backend.repository;

import java.util.List;
import java.util.Optional; // ✅ 이 줄이 반드시 필요

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workmates.backend.domain.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long>{

    List<Message> findAllByChatroomIdOrderByCreatedAtAsc(Long chatroomId);

     // ✅ 삭제되지 않은 메시지만 조회 (채팅방 목록용)
    List<Message> findAllByChatroomIdAndDeletedFalseOrderByCreatedAtAsc(Long chatroomId);

    // ✅ 수정/삭제용 (삭제된 메시지는 예외 처리)
    Optional<Message> findByIdAndDeletedFalse(Long id);
}
