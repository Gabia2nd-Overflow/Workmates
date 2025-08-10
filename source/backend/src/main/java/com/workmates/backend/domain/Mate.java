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
@Table(name = "MATE")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mate { // 사용자 친구 등록/차단 여부 - 차단은 구현하면 +@. 안해도 무관
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SENDER_ID", length = DomainConstants.ID_MAX_LEN)
    private String sender_id; // 요청을 보낸 사용자 아이디

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RECEIVER_ID", length = DomainConstants.ID_MAX_LEN)
    private String receiver_id; // 요청의 대상이 된 사용자 아이디

    @Column(name = "MATE_IS_ACCEPTED", nullable = false)
    @Builder.Default
    private Boolean mate_is_accepted = false; // sender가 보낸 친구 요청의 수락 여부. 기본적으로 false

    @Column(name = "MATE_IS_BLOCKED", nullable = false)
    @Builder.Default
    private Boolean mate_is_blocked = false; // 사용자 차단 여부. 기본적으로 false
}
