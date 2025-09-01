package com.workmates.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workmates.backend.domain.WorkshopMember;
import com.workmates.backend.domain.WorkshopMemberId;

public interface WorkshopMemberRepository
        extends JpaRepository<WorkshopMember, WorkshopMemberId> {

    List<WorkshopMember> findAllByMemberId(String memberId);
    boolean existsByMemberIdAndWorkshopId(String memberId, Long workshopId);
    // 가입, 추방, 체크, 멤버목록, 카운트 같은 관계 자체를 다루는 쿼리를 사용하는곳
}