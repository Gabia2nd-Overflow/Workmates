package com.workmates.backend.web.dto;

import java.util.List;

import com.workmates.backend.service.MateService.MateInfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class MateDto {
    
    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SearchRequest { // 사용자 검색 요청
        private String id;
    };

    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SearchResponse { // 사용자 검색 응답
        private String id;
        private String nickname;
        private String imageUrl;
    };

    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppendRequest { // 친구 추가 요청
        private String senderId;
        private String receiverId;
    };

    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppendResponse { // 친구 추가 요청 응답
        private Boolean inviteSent;
    };

    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppendHandleRequest { // 친구 추가 수락 및 거절 요청
        private String senderId;
        private String receiverId;
        private Boolean isAccepted;
    };

    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppendHandleResponse { // 친구 추가 수락 및 거절 응답
        private Integer handleResult;
    };

    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RemoveRequest { // 친구 삭제 요청
        private String id;
        private String targetId;
    };

    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RemoveResponse { // 친구 삭제 요청 응답
        private Boolean isRemoved;
    };

    @Data 
    @Getter 
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MatelistResponse { // 친구목록 조회 요청 응답
        private List<MateInfo> matelist;
    };
    
}
