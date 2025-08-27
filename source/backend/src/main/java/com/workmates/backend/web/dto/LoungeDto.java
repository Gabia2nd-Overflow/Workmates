package com.workmates.backend.web.dto;

import com.workmates.backend.domain.Lounge;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

public class LoungeDto {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CreateRequest {
        @NotBlank @Size(max = 100)
        private String name;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UpdateRequest {
        @Size(max = 100)
        private String name; // 부분 수정
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;          // 라운지 ID
        private String name;      // 라운지 이름
        private Long workshopId;  // 소속 워크샵 ID
        private boolean isDeleted;

        public static Response fromEntity(Lounge lounge) {
            return Response.builder()
                    .id(lounge.getId())
                    .name(lounge.getName())
                    .workshopId(lounge.getWorkshopId()) // ✅ 숫자 FK 직접 사용
                    .isDeleted(Boolean.TRUE.equals(lounge.getIsDeleted()))
                    .build();
        }
    }
}