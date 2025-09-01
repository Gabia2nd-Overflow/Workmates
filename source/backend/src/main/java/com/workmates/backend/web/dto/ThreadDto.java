package com.workmates.backend.web.dto;

import lombok.*;

public class ThreadDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String name;
        private Long workshopId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String name;
        private Boolean isDeleted;
        private Long workshopId;
    }
}
