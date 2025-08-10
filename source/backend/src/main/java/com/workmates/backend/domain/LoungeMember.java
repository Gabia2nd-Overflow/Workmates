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
@Table(name = "LOUNGE_MEMBER")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoungeMember { // 채팅방 참가자

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LOUNGE_MEMBER_ID", length = DomainConstants.ID_MAX_LEN)
    private String lounge_member_id; // 채팅방에 참가한 사용자의 아이디

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LOUNGE_MEMBER_LOUNGE_ID")
    private Long lounge_member_lounge_id; // 사용자가 참가한 채팅방의 아이디
}
