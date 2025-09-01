package com.workmates.backend.domain;

import com.workmates.backend.constant.DomainConstants;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "WORKSHOP_MEMBER",
    // 워크샵 내부 닉네임 유일 (전역 unique=true 대신 복합 unique 권장)
    uniqueConstraints = @UniqueConstraint(
        name = "uk_workshop_nickname",
        columnNames = {"workshop_id", "member_nickname"}
    )
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(WorkshopMemberId.class)                           // ✅ 추가
@EqualsAndHashCode(of = {"memberId","workshopId"})         // ✅ 동일성 안정
public class WorkshopMember { // 채팅방 참가자
    @Id
    @Column(name = "member_id", length = DomainConstants.ID_MAX_LEN, nullable = false)
    private String memberId; // 사용자 ID

    @Id
    @Column(name = "workshop_id", nullable = false)
    private Long workshopId; // 워크샵 ID

    @Column(name = "member_nickname", nullable = false, length = DomainConstants.ID_MAX_LEN)
    private String memberNickname; // (워크샵 내) 닉네임
}