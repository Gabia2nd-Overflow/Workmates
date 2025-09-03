package com.workmates.backend.domain;

import com.workmates.backend.constant.DomainConstants;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
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
@IdClass(MateId.class)
public class Mate { // 사용자 친구 등록 여부
    
    @Id
    @Column(name = "sender_id", length = DomainConstants.ID_MAX_LEN)
    private String senderId; // 친구 요청을 보낸 사용자 아이디

    @Id
    @Column(name = "receiver_id", length = DomainConstants.ID_MAX_LEN)
    private String receiverId; // 친구 요청의 대상이 된 사용자 아이디

    @Column(name = "is_accepted", nullable = false)
    @Builder.Default
    private Boolean isAccepted = false; // sender가 보낸 친구 요청의 수락 여부. 기본적으로 false
}

