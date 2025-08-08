package com.workmates.backend.web.dto;

import java.time.LocalDateTime;

import com.workmates.backend.domain.Workshop;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class WorkshopDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private String workshopName;
        private String workshopIconImage; // nullable
        private String workshopDescription; // nullable
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String workshopName;
        private String workshopIconImage;
        private String workshopDescription;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long workshopId;
        private String workshopName;
        private String workshopIconImage;
        private String workshopDescription;
        private boolean workshopIsDeleted;

        public static Response from(Workshop w) {
            return Response.builder()
                .workshopId(w.getId())
                .workshopName(w.getName())
                .workshopIconImage(w.getIconImage())
                .workshopDescription(w.getDescription())
                .workshopIsDeleted(w.isDeleted())
                .build();
        }
    }
}
