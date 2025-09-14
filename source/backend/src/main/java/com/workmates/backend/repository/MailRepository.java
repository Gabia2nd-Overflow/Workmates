package com.workmates.backend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.workmates.backend.domain.Mail;

public interface MailRepository extends JpaRepository<Mail, Long> {
    
    public Page<Mail> findAllByFromOrderByWrittenAtDesc(String from, Pageable pageable);

    public Page<Mail> findAllByToOrderByWrittenAtDesc(String to, Pageable pageable);

    public Optional<Mail> findByMailIdAndUserId(Long mailId, String userId);

    public boolean existsByMessageId(String MessageId);
    
}
