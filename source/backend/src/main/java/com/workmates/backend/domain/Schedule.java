package com.workmates.backend.domain;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "SCHEDULE")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Schedule { // 작업 일정

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "SCHEDULE_ID")
    private long schedule_id; // 스케쥴 아이디

    @Column(name = "SCHEDULE_TITLE", nullable = false, length = DomainConstants.ID_MAX_LEN)
    private String schedule_title; // 스케쥴 제목

    @Column(name = "SCHEDULE_CONTENT", nullable = false, length = DomainConstants.COMMENT_MAX_LEN)
    private String schedule_content; // 스케쥴 설명

    @Column(name = "SCHEDULE_START_DATE", nullable = false)
    @Builder.Default
    private LocalDateTime schedule_start_date = LocalDateTime.now(); // 스케쥴 시작 일시. 기본적으로 LocalDateTime.now()

    @Column(name = "SCHEDULE_DUE_DATE", nullable = false)
    @Builder.Default
    private LocalDateTime schedule_due_date = LocalDateTime.now(); // 스케쥴 마감 일시. 기본적으로 LocalDateTime.now()지만 명시적으로 지정할 필요가 있음

    @Column(name = "SCHEDULE_WRITTEN_IN", nullable = false)
    @Builder.Default
    private String schedule_WRITTEN_in = DomainConstants.DEFAULT_LANGUAGE; // 스케쥴이 등록된 언어. 기본적으로 한국어

    @Column(name = "SCHEDULE_IMPORTANCY", nullable = false, length = DomainConstants.ID_MAX_LEN) // 보통 중요 긴급
    @Builder.Default
    private String schedule_importancy = "보통"; // 스케쥴의 중요도. 기본적으로 보통

    @Column(name = "SCHEDULE_IS_COMPLETED", nullable = false)
    @Builder.Default
    private Boolean schedule_is_completed = false; // 스케쥴의 달성 여부. 기본적으로 false

    @Column(name = "SCHEDULE_IS_DELETED", nullable = false)
    @Builder.Default
    private Boolean schedule_is_deleted = false; // 스케쥴의 삭제 여부. 기본적으로 false

    @Column(name = "SCHEDULE_ROOT_WORKSHOP_ID", nullable = false)
    private Long schedule_root_workshop_id; // 스케쥴이 등록된 워크샵 아이디
}