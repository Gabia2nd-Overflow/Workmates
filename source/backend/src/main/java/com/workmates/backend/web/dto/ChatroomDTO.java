package com.workmates.backend.web.dto;

import com.workmates.backend.domain.Lounge;
import lombok.*;

public class ChatroomDTO {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CreateRequest {
        private String name;
        private String description;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id; //chatroom id
        private String name; // 보낸 유저 이름 
        private String description; // 내용.

        public static Response fromEntity(Lounge chatroom) {
            return Response.builder()
                    .id(chatroom.getId())
                    .name(chatroom.getName())
                    .description(chatroom.getDescription())
                    .build();
        }
    }
}