package com.workmates.backend.web.dto;

import java.time.LocalDateTime;

import com.workmates.backend.domain.Message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class MessageDTO {
        // 📩 메시지 전송 요청 DTO
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SendMessageRequest {
        private Long userId;
        private String content;
    }

    // 📬 메시지 응답 DTO
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessageResponse {
        private Long id;
        private String senderName;
        private String content;
        private LocalDateTime createdAt;

        // 엔티티를 DTO로 바꿔주는 메서드
        public static MessageResponse from(Message message) {
            return MessageResponse.builder()
                    .id(message.getId())
                    .senderName(message.getSender().getUsername())
                    .content(message.getContent())
                    .createdAt(message.getCreatedAt())
                    .build();
        }
    }
}
