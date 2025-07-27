package com.workmates.backend.service;

import com.workmates.backend.web.dto.ChatroomDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class ChatroomServiceTest {

    @Autowired
    private ChatroomService chatroomService;

    @Test
    void 채팅방_생성_및_조회_테스트() {
        // given
        ChatroomDTO.CreateRequest request = ChatroomDTO.CreateRequest.builder()
                .name("test-room")
                .description("테스트 채널입니다")
                .build();

        // when
        ChatroomDTO.Response response = chatroomService.create(request);
        List<ChatroomDTO.Response> allRooms = chatroomService.findAll();

        // then
        assertThat(response.getName()).isEqualTo("test-room");

        List<String> names = allRooms.stream()
                .map(ChatroomDTO.Response::getName)
                .toList();

        assertThat(names).contains("test-room");
    }
}
