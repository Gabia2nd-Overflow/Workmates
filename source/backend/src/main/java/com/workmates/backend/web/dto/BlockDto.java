package com.workmates.backend.web.dto;

import java.util.List;

import com.workmates.backend.service.BlockService;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class BlockDto {
    
    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BlockRequest { // 사용자 차단 요청
        private String id;
        private String targetId;
    };

    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BlockResponse { // 사용자 차단 요청 응답
        private Boolean isBlocked;
    };

    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UnblockRequest { // 차단 해제 요청
        private String id;
        private String targetId;
    };

    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UnblockResponse { // 차단 해제 요청 응답
        private Boolean isUnblocked;
    };

    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BlocklistResponse { // 차단목록 조회 요청 응답
        private List<BlockService.BlockedUserInfo> blocklist; 
    };
}