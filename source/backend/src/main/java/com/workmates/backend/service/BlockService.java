package com.workmates.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.util.ServiceUtil;
import com.workmates.backend.domain.Block;
import com.workmates.backend.domain.Block.*;
import com.workmates.backend.domain.User;
import com.workmates.backend.repository.BlockRepository;
import com.workmates.backend.web.dto.BlockDto.BlockRequest;
import com.workmates.backend.web.dto.BlockDto.BlockResponse;
import com.workmates.backend.web.dto.BlockDto.BlocklistResponse;
import com.workmates.backend.web.dto.BlockDto.UnblockRequest;
import com.workmates.backend.web.dto.BlockDto.UnblockResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BlockService {

    private final BlockRepository blockRepository;
    private final UserRepository userRepository;
    
    public BlocklistResponse blocklist(String id) {
        if(!ServiceUtil.validateId(id)) {
            throw new IllegalArgumentException("올바르지 않은 요청입니다. - 아이디");
        }

        List<String> blockedUsers = blockRepository.findAllByBlockerId(id);
        List<BlockedUserInfo> blocklist = new ArrayList<>();

        for(String userId : blockedUsers) {
            Optional<User> u = userRepository.findById(userId);
            if(!u.isPresent()) continue;

            User user = u.get();
            blocklist.add(BlockedUserInfo.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .imageUrl(user.getImageUrl())
                .build());
        }

        return BlocklistResponse.builder()
            .blocklist(blocklist)
            .build();
    }

    @Transactional
    public BlockResponse block(BlockRequest request) {
        if(!ServiceUtil.validateId(request.getId()) ||
        !ServiceUtil.validateId(request.getTargetId()) ||
        request.getId().equals(request.getTargetId())) {
            throw new IllegalArgumentException("올바르지 않은 요청입니다. - 아이디 형식 또는 아이디 중복");
        }

        if(blockRepository.findById(
            BlockId.builder()
                .id(request.getId())
                .targetId(request.getTargetId())
                .build())
            .isPresent()
        ) {
            throw new IllegalArgumentException("이미 차단된 사용자입니다.");
        }

        blockRepository.save(
            Block.builder()
                .id(request.getId())
                .targetId(request.getTargetId())
                .build()
        );
        
        return BlockResponse.builder()
            .isBlocked(true)
            .build();
    }

    @Transactional
    public UnblockResponse unblock(UnblockRequest request) {
        if(!ServiceUtil.validateId(request.getId()) ||
        !ServiceUtil.validateId(request.getTargetId()) ||
        request.getId().equals(request.getTargetId())) {
            throw new IllegalArgumentException("올바르지 않은 요청입니다.");
        }

        BlockId blockId = BlockId.builder()
                                .id(request.getId())
                                .targetId(request.getTargetId())
                                .build();

        if(!blockRepository.findById(blockId).isPresent()) {
            throw new IllegalArgumentException("사용자의 차단 기록을 찾을 수 없습니다.");
        }

        blockRepository.deleteById(blockId);

        return UnblockResponse.builder()
            .isUnblocked(true)
            .build();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BlockedUserInfo {
        private String id;
        private String nickname;
        private String imageUrl;    
    }
}
