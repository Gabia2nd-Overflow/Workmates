package com.workmates.backend.web.dto;

import com.workmates.backend.domain.Lounge;
import lombok.*;

public class LoungeDto {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CreateRequest {
        private String name;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id; // 라운지 아이디
        private String name; // 라운지 이름 

        public static Response fromEntity(Lounge lounge) {
            return Response.builder()
                    .id(lounge.getId())
                    .name(lounge.getName())
                    .build();
        }
    }
}