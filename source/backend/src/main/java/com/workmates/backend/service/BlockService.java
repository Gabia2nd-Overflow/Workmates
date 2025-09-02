package com.workmates.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public BlocklistResponse blocklist(String id) {
        return null;
    }

    @Transactional
    public BlockResponse block(BlockRequest request) {
        return null;
    }

    @Transactional
    public UnblockResponse unblock(UnblockRequest request) {
        return null;
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
