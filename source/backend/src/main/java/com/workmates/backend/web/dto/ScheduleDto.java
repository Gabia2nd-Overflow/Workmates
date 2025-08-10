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
        private String content;
        private LocalDateTime startDate;
        private LocalDateTime dueDate;
        private String importancy;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String title;
        private String content;
        private LocalDateTime startDate;
        private LocalDateTime dueDate;
        private String importancy;
        private Boolean isCompleted;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String title;
        private String content;
        private LocalDateTime startDate;
        private LocalDateTime dueDate;
        private String importancy;
        private Boolean isCompleted;

        public static Response from(Schedule entity) {
            return Response.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .startDate(entity.getStartDate())
                .dueDate(entity.getDueDate())
                .importancy(entity.getImportancy())
                .isCompleted(entity.getIsCompleted())
                .build();
        }
    }
}