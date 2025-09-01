package com.workmates.backend.web.dto;

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
}
