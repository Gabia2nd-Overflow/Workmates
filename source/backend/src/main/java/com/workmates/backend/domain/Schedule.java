package com.workmates.backend.domain;

import java.time.LocalDateTime;

import com.workmates.backend.constant.DomainConstants;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "schedule")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@SQLDelete(sql = "UPDATE schedule SET is_deleted = true WHERE id = ?")
// 스케줄 삭제 후, findall로도 보이지 않게 하는 코드 -> 관리자는 삭제된 일정도 볼 수 있게 할 거면 @filter로 바꿔야 하니 참고할 것.
@Where(clause = "is_deleted = false")
public class Schedule { // 작업 일정

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private long id; // 스케쥴 아이디

    @Column(name = "title", nullable = false, length = DomainConstants.ID_MAX_LEN)
    private String title; // 스케쥴 제목

    @Column(name = "content", nullable = false, length = DomainConstants.COMMENT_MAX_LEN)
    private String content; // 스케쥴 설명

    @Column(name = "start_date", nullable = false)
    @Builder.Default
    private LocalDateTime startDate = LocalDateTime.now(); // 스케쥴 시작 일시. 기본적으로 LocalDateTime.now()

    @Column(name = "due_date", nullable = false)
    @Builder.Default
    private LocalDateTime dueDate = LocalDateTime.now(); // 스케쥴 마감 일시. 기본적으로 LocalDateTime.now()지만 명시적으로 지정할 필요가 있음

    // @Column(name = "written_in", nullable = false)
    // @Builder.Default
    // private String writtenIn = DomainConstants.DEFAULT_LANGUAGE; // 스케쥴이 등록된 언어. 기본적으로 한국어

    @Enumerated(EnumType.STRING)
    @Column(name = "importancy", nullable = false, length = 10) // LOW, MEDIUM, HIGH
    @Builder.Default
    private Importance importancy = Importance.MEDIUM; // 스케쥴의 중요도. 기본 설정: MEDIUM

    @Column(name = "is_completed", nullable = false)
    @Builder.Default
    private Boolean isCompleted = false; // 스케쥴의 달성 여부. 기본적으로 false

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false; // 스케쥴의 삭제 여부. 기본적으로 false

    @Column(name = "workshop_id", nullable = false)
    private Long workshopId; // 스케쥴이 등록된 워크샵 아이디

    @Column(name = "writer_id", nullable = false)
    private String writerId; // 스케쥴을 등록한 사용자 아이디
}