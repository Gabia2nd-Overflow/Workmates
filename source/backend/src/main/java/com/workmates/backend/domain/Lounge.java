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
@Table(name = "LOUNGE")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lounge { // 채팅방

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "LOUNGE_ID")
    private Long lounge_id; // 채팅방 아이디

    @Column(name = "LOUNGE_NAME", nullable = false, length = DomainConstants.ID_MAX_LEN)
    private String lounge_name; // 채팅방 이름

    @Column(name = "LOUNGE_IS_DELETED", nullable = false)
    @Builder.Default
    private Boolean lounge_is_deleted = false; // 채팅방 폐쇄 여부. 기본적으로 false

    @Column(name = "LOUNGE_ROOT_WORKSHOP_ID", nullable = false)
    private Long lounge_root_workshop_id; // 채팅방이 등록된 워크샵 아이디 
}
