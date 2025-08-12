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
    @Column(name = "memberId", length = DomainConstants.ID_MAX_LEN)
    private String memberId; // 워크샵에 참가한 사용자의 아이디

    @Column(name = "memberNickname", nullable = false, unique = true, length = DomainConstants.ID_MAX_LEN)
    private String memberNickname; // 워크샵에 참가한 사용자의 닉네임

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "workshopId")
    private Long workshopId; // 사용자가 참가한 워크샵의 아이디
}