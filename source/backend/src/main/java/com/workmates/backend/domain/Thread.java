package com.workmates.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "THREAD")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Thread { // 게시판
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id; // 스레드 아이디

    @Column(name = "name", nullable = false, length = DomainConstants.ID_MAX_LEN)
    private String name; // 스레드 이름

    @Column(name = "isDeleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false; // 스레드 폐쇄 여부. 기본적으로 false

    @Column(name = "workshopId", nullable = false)
    private Long workshopId; // 스레드가 속한 워크샵 아이디
}
