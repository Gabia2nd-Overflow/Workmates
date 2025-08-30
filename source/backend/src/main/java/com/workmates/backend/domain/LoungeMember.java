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
    @Column(name = "member_id", length = DomainConstants.ID_MAX_LEN)
    private String memberId; // 채팅방에 참가한 사용자의 아이디

    @Column(name = "member_nickname", nullable = false, unique = true, length = DomainConstants.ID_MAX_LEN)
    private String memberNickname; // 채팅방에 참가한 사용자의 닉네임

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lounge_id")
    private Long loungeId; // 사용자가 참가한 채팅방의 아이디
}
