package com.workmates.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.domain.Mate;
import com.workmates.backend.domain.MateId;
import com.workmates.backend.domain.User;
import com.workmates.backend.repository.MateRepository;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.util.ServiceUtil;
import com.workmates.backend.web.dto.MateDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Service
@RequiredArgsConstructor
public class MateService {

    private final MateRepository mateRepository;
    private final UserRepository userRepository;

    public MateDto.MatelistResponse matelist(String id) {
        if (!ServiceUtil.validateId(id)) {
            throw new IllegalArgumentException("올바르지 않은 사용자 아이디입니다.");
        }

        List<Mate> mates = mateRepository.findAllBySenderIdOrReceiverId(id);
        List<MateInfo> matelist = new ArrayList<>();

        for (Mate mate : mates) {
            Boolean requesterIsSender = mate.getSenderId().equals(id);

            // 상태 계산 추가
            MateStatus status;
            if (Boolean.TRUE.equals(mate.getIsAccepted())) {
                status = MateStatus.FRIEND;
            } else if (Boolean.TRUE.equals(requesterIsSender)) {
                status = MateStatus.PENDING_SENT; // 내가 보낸 요청 (아직 수락 전)
            } else {
                status = MateStatus.PENDING_RECEIVED; // 상대가 보낸 요청 (내가 수락 / 거절해야 함)
            }

            Optional<User> targetUser = userRepository
                    .findById(requesterIsSender ? mate.getReceiverId() : mate.getSenderId());

            if (targetUser.isPresent()) {
                User user = targetUser.get();

                matelist.add(
                        MateInfo.builder()
                                .id(user.getId())
                                .nickname(user.getNickname())
                                .imageUrl(user.getImageUrl())
                                .isAccepted(mate.getIsAccepted())
                                .requesterIsSender(requesterIsSender)
                                .status(status) // 계산된 상태를 응답에 포함
                                .build());
            }
        }

        return MateDto.MatelistResponse.builder()
                .matelist(matelist)
                .build();
    }

    public MateDto.SearchResponse search(MateDto.SearchRequest request) {
        if (!ServiceUtil.validateId(request.getId())) { // 정규표현식에 맞지 않은 아이디가 요청될 경우 검색 거부
            throw new IllegalArgumentException("올바르지 않은 사용자 아이디입니다.");
        }

        User user = userRepository.findById(request.getId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        return MateDto.SearchResponse.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .imageUrl(user.getImageUrl())
                .build();
    }

    @Transactional
    public MateDto.AppendResponse append(MateDto.AppendRequest request) {
        if (!ServiceUtil.validateId(request.getSenderId()) ||
                !ServiceUtil.validateId(request.getReceiverId()) ||
                request.getSenderId().equals(request.getReceiverId())) { // 정규표현식에 맞지 않은 아이디 또는 송신자와 수신자가 같은 요청이 전달될 경우
                                                                         // 초대 거부
            throw new IllegalArgumentException("올바르지 않은 요청입니다. - 아이디 형식 또는 아이디 중복");
        }

        MateId id = new MateId(request.getSenderId(), request.getReceiverId());
        MateId swapId = new MateId(request.getReceiverId(), request.getSenderId());
        boolean isDuplicateInvitation = mateRepository.findById(id).isPresent() || // 이미 DB에 존재하는 친구 요청인지 두 유형을 검사
                mateRepository.findById(swapId).isPresent();

        if (!isDuplicateInvitation) {
            mateRepository
                    .save(Mate.builder()
                            .senderId(request.getSenderId())
                            .receiverId(request.getReceiverId())
                            .build());
        }

        return MateDto.AppendResponse.builder()
                .inviteSent(!isDuplicateInvitation)
                .build();
    }

    @Transactional
    public MateDto.AppendHandleResponse appendHandle(MateDto.AppendHandleRequest request) {
        if (!ServiceUtil.validateId(request.getSenderId()) ||
                !ServiceUtil.validateId(request.getReceiverId()) ||
                request.getSenderId().equals(request.getReceiverId())) { // 정규표현식에 맞지 않은 아이디 또는 송수신자가 일치하는 요청이 전달될 경우 처리
                                                                         // 거부
            throw new IllegalArgumentException("올바르지 않은 요청입니다. - 아이디 형식 또는 아이디 중복");
        }

        MateId mateId = new MateId(request.getSenderId(), request.getReceiverId());
        if (!mateRepository.findById(mateId).isPresent())
            throw new IllegalArgumentException("친구 요청이 존재하지 않습니다.");
        Integer handleResult = null;

        if (request.getIsAccepted()) {
            mateRepository.AcceptMateRequest(mateId.getSenderId(), mateId.getReceiverId());
            handleResult = 1;
        } else { // 친구 요청 거절
            mateRepository.deleteById(mateId);
            handleResult = 2;
        }

        return MateDto.AppendHandleResponse.builder()
                .handleResult(handleResult)
                .build();
    }

    @Transactional
    public MateDto.RemoveResponse remove(MateDto.RemoveRequest request) {
        if (!ServiceUtil.validateId(request.getId()) ||
                !ServiceUtil.validateId(request.getTargetId()) ||
                request.getId().equals(request.getTargetId())) { // 정규표현식에 맞지 않은 아이디 또는 송수신자가 일치하는 요청이 전달될 경우 처리 거부
            throw new IllegalArgumentException("올바르지 않은 요청입니다.");
        }

        MateId id = new MateId(request.getId(), request.getTargetId());
        MateId swapId = new MateId(request.getTargetId(), request.getId());

        if (mateRepository.findById(id).isPresent()) {
            mateRepository.deleteById(id);
        } else if (mateRepository.findById(swapId).isPresent()) {
            mateRepository.deleteById(swapId);
        } else {
            throw new IllegalArgumentException("삭제 요청을 처리할 수 없습니다.");
        }

        return MateDto.RemoveResponse.builder()
                .isRemoved(true)
                .build();
    }

    @Data
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MateInfo {
        String id;
        String nickname;
        String imageUrl;
        Boolean isAccepted;
        Boolean requesterIsSender; // true면 목록 조회자가 sender, false면 receiver
        MateStatus status; // FRIEND | PENDING_SENT | PENDING_RECEIVED
    }

    public enum MateStatus {
        FRIEND, // 서로 수락된 친구
        PENDING_SENT, // 내가 보낸 대기중 요청
        PENDING_RECEIVED // 내가 받아야 하는 대기중 요청
    }
}
