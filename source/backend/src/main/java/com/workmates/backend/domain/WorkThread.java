package com.workmates.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "WORKTHREAD")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkThread { // 게시판
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "THREAD_ID")
    private Long thread_id; // 스레드 아이디

    @Column(name = "THREAD_NAME", nullable = false, length = DomainConstants.ID_MAX_LEN)
    private String thread_name; // 스레드 이름

    @Column(name = "THREAD_IS_DELETED", nullable = false)
    @Builder.Default
    private Boolean thread_is_deleted = false; // 스레드 폐쇄 여부. 기본적으로 false

    @Column(name = "THREAD_ROOT_WORKSHOP_ID", nullable = false)
    private Long thread_root_workshop_id; // 스레드가 속한 워크샵 아이디
}
