package com.workmates.backend.web.dto;

import java.time.LocalDateTime;
import com.workmates.backend.domain.Schedule;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ScheduleDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private String title;
        private String context;
        private LocalDateTime startDate;
        private LocalDateTime dueDate;
        private String location;
        private String importancy;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String title;
        private String context;
        private LocalDateTime startDate;
        private LocalDateTime dueDate;
        private String location;
        private String importancy;
        private Boolean completed;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String title;
        private String context;
        private LocalDateTime startDate;
        private LocalDateTime dueDate;
        private String location;
        private String importancy;
        private Boolean completed;
        private LocalDateTime createdAt;

        public static Response from(Schedule entity) {
            return Response.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .context(entity.getContext())
                .startDate(entity.getStartDate())
                .dueDate(entity.getDueDate())
                .location(entity.getLocation())
                .importancy(entity.getImportancy())
                .completed(entity.getCompleted())
                .createdAt(entity.getCreatedAt())
                .build();
        }
    }
}