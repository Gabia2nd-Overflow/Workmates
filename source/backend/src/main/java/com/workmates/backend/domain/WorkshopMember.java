package com.workmates.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "WORKSHOP_MEMBER")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkshopMember { // 채팅방 참가자

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "WORKSHOP_MEMBER_ID", length = DomainConstants.ID_MAX_LEN)
    private String workshop_member_id; // 워크샵에 참가한 사용자의 아이디

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "WORKSHOP_MEMBER_WORKSHOP_ID")
    private Long workshop_member_workshop_id; // 사용자가 참가한 워크샵의 아이디
}