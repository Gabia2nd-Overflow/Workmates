package com.workmates.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workmates.backend.domain.Mail;

public interface MailRepository extends JpaRepository<Mail, Long> {
    
}
