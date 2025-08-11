package com.workmates.backend.service;

import com.workmates.backend.web.dto.LoungeDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class LoungeServiceTest {

    @Autowired
    private LoungeService loungeService;

    @Test
    void 채팅방_생성_및_조회_테스트() {
        // given
        LoungeDto.CreateRequest request = LoungeDto.CreateRequest.builder()
                .name("test-room")
                .build();

        // when
        LoungeDto.Response response = loungeService.create(request);
        List<LoungeDto.Response> allRooms = loungeService.findAll();

        // then
        assertThat(response.getName()).isEqualTo("test-room");

        List<String> names = allRooms.stream()
                .map(LoungeDto.Response::getName)
                .toList();

        assertThat(names).contains("test-room");
    }
}
