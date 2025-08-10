package com.workmates.backend.web.dto;

import java.time.LocalDateTime;

import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.domain.Message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class MessageDto {

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
    @Transactional(readOnly = true)
    public static class MessageResponse {

        private Long id;
        private String senderNickname;
        private String content;
        private LocalDateTime createdAt;

        // 엔티티를 DTO로 바꿔주는 메서드
        public static MessageResponse from(Message message) {
            return MessageResponse.builder()
                    .id(message.getId())
                    .senderNickname(message.getSender().getNickname())
                    .content(message.getContent())
                    .createdAt(message.getCreatedAt())
                    .build();
        }
    }
    // ---------------------------- WebSocket ------------------------------

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChatSocketRequest {

        private Long chatroomId;
        private Long senderId;
        private String content;
        private String type;        // TEXT or FILE
        private String fileUrl;     // ✅ 추가
        private String fileName;    // ✅ 추가
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChatSocketResponse {
        private Long id;
        private Long chatroomId;
        private String senderNickname;
        private String content;
        private String timestamp;
        private LocalDateTime createdAt;

        public static ChatSocketResponse from(Message message) {
            return ChatSocketResponse.builder()
                    .id(message.getId())                          // ✅ 메시지 ID 추가
                    .chatroomId(message.getChatroom().getId())
                    .senderNickname(message.getSender().getNickname())
                    .content(message.getContent())
                    .createdAt(message.getCreatedAt())
                    .build();
        }
    }

    //-------------------------------
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FileUploadResponse {

        private String fileUrl;
        private String fileName;

        public static FileUploadResponse from(String fileUrl, String fileName) {
            return FileUploadResponse.builder()
                    .fileUrl(fileUrl)
                    .fileName(fileName)
                    .build();
        }
    }

    // -----------------------------------Edit Delete----------------------------------------------
     // ✏️ 메시지 수정 요청 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EditMessageRequest {
        private Long senderId;
        private String content;
    }

    // 🗑️ 메시지 삭제 요청 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DeleteMessageRequest {
        private Long senderId;
    }
}
