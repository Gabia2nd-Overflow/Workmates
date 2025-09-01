package com.workmates.backend.domain;

import com.workmates.backend.constant.DomainConstants;

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
@Table(name = "LOUNGE")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lounge { // 채팅방

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id; // 채팅방 아이디

    @Column(name = "name", nullable = false, length = DomainConstants.ID_MAX_LEN)
    private String name; // 채팅방 이름

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false; // 채팅방 폐쇄 여부. 기본적으로 false

    @Column(name = "workshop_id", nullable = false)
    private Long workshopId; // 채팅방이 등록된 워크샵 아이디 
}
