package com.workmates.backend.web.dto;

import java.time.LocalDateTime;

import com.workmates.backend.domain.Message;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class MessageDto {

    // ======= REST 공용 DTO (필요 시 유지) =======
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SendMessageRequest {
        @NotBlank private String writerId;
        @NotBlank private String content;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class MessageResponse {
        private Long id;
        private String writerId;
        private String writerNickname; // ✅ 추가
        private String content;
        private LocalDateTime writtenAt;

        public static MessageResponse from(Message message) {
            return MessageResponse.builder()
                    .id(message.getId())
                    .writerId(message.getWriterId())
                    .writerNickname(message.getWriterNickname()) // ✅ 추가
                    .content(message.getContent())
                    .writtenAt(message.getWrittenAt())
                    .build();
        }
    }

    // ======= WebSocket 전용 =======
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ChatSocketRequest {
        @NotNull private Long workshopId;  // ✅ 추가
        @NotNull private Long loungeId;
        @NotBlank private String writerId;
        @NotBlank private String content;
        private String fileUrl;    // 선택
        private String fileName;   // 선택
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ChatSocketResponse {
        private Long id;
        private Long workshopId;   // ✅ 추가
        private Long loungeId;
        
        private String writerId;
        private String writerNickname; // ✅ 추가
        private String content;
        private LocalDateTime writtenAt;

        public static ChatSocketResponse from(Message message, Long workshopId) {
            return ChatSocketResponse.builder()
                    .id(message.getId())
                    .workshopId(workshopId)
                    .loungeId(message.getLoungeId())
                    .writerId(message.getWriterId())
                    .writerNickname(message.getWriterNickname()) // ✅ 추가
                    .content(message.getContent())
                    .writtenAt(message.getWrittenAt())
                    .build();
        }
    }

    // ======= 파일 =======
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class FileUploadResponse {
        private String fileUrl;
        public static FileUploadResponse from(String fileUrl) {
            return FileUploadResponse.builder().fileUrl(fileUrl).build();
        }
    }

    // ======= 수정/삭제 =======
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class EditMessageRequest {
        @NotNull private Long messageId;
        @NotBlank private String writerId;
        @NotBlank private String content;
        private String fileUrl;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DeleteMessageRequest {
        @NotNull private Long messageId;
        @NotBlank private String writerId;
    }
}