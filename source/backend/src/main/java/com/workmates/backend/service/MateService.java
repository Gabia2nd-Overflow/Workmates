package com.workmates.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.constant.ServiceConstants;
import com.workmates.backend.domain.Mate;
import com.workmates.backend.domain.MateId;
import com.workmates.backend.domain.User;
import com.workmates.backend.repository.BlockRepository;
import com.workmates.backend.repository.MateRepository;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.web.dto.MateDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MateService {
    
    private final MateRepository mateRepository;
    private final UserRepository userRepository;
    private final BlockRepository blockRepository;

    public MateDto.MatelistResponse matelist(String id) {
        if(!Pattern.matches(ServiceConstants.ID_REGEX, id)) {
            throw new IllegalArgumentException("올바르지 않은 사용자 아이디입니다.");
        }

        List<Mate> matelist = new ArrayList<>();
        
        return MateDto.MatelistResponse.builder()
                .matelist(matelist)
                .build();
    }

    public MateDto.SearchResponse search(MateDto.SearchRequest request) {
        if(!Pattern.matches(ServiceConstants.ID_REGEX, request.getId())) { // 정규표현식에 맞지 않은 아이디가 요청될 경우 검색 거부
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
        if(!Pattern.matches(ServiceConstants.ID_REGEX, request.getSenderId()) ||
           !Pattern.matches(ServiceConstants.ID_REGEX, request.getReceiverId())) { // 정규표현식에 맞지 않은 아이디가 요청될 경우 초대 거부
            throw new IllegalArgumentException("올바르지 않은 사용자 아이디입니다.");
        }

        MateId id = new MateId(request.getSenderId(), request.getReceiverId());
        MateId swapId = new MateId(request.getReceiverId(), request.getSenderId());
        boolean isDuplicateInvitation = mateRepository.findById(id).isPresent() || // 이미 DB에 존재하는 친구 요청인지 두 유형을 검사
                                        mateRepository.findById(swapId).isPresent();

        if(!isDuplicateInvitation) {
            mateRepository
                .save(Mate.builder()
                .senderId(request.getSenderId())
                .receiverId(request.getReceiverId())
                .build()
            );
        }

        return MateDto.AppendResponse.builder()
            .inviteSent(!isDuplicateInvitation)
            .build();
    }

    @Transactional
    public MateDto.RemoveResponse remove(MateDto.RemoveRequest request) {
        if(!Pattern.matches(ServiceConstants.ID_REGEX, request.getId()) ||
           !Pattern.matches(ServiceConstants.ID_REGEX, request.getTargetId())) { // 정규표현식에 맞지 않은 아이디가 요청될 경우 초대 거부
            throw new IllegalArgumentException("올바르지 않은 삭제 요청입니다.");
        }

        MateId id = new MateId(request.getId(), request.getTargetId());
        MateId swapId = new MateId(request.getTargetId(), request.getId());
        
        if(mateRepository.findById(id).isPresent()) {
            mateRepository.deleteById(id);
        } else if(mateRepository.findById(swapId).isPresent()) {
            mateRepository.deleteById(swapId);
        } else {
            throw new IllegalArgumentException("삭제 요청을 처리할 수 없습니다.");
        }

        return MateDto.RemoveResponse.builder()
            .isRemoved(true)
            .build();
    }
}
