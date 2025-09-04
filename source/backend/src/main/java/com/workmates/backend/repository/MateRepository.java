package com.workmates.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import com.workmates.backend.domain.Mate;
import com.workmates.backend.domain.MateId;

@Repository
public interface MateRepository extends JpaRepository<Mate, MateId> {
    
    public void deleteById(@NonNull MateId id);
    
    @Query(value = "SELECT * FROM MATE WHERE sender_id = :id OR receiver_id = :id", nativeQuery = true)
    public List<Mate> findAllBySenderIdOrReceiverId(String id);

    @Modifying
    @Query(value = "UPDATE MATE SET is_accepted = true where sender_id = :senderId and receiver_id = :receiverId", nativeQuery = true)
    public void AcceptMateRequest(@NonNull String senderId, @NonNull String receiverId);
}
