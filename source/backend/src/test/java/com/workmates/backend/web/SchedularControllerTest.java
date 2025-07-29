package com.workmates.backend.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.workmates.backend.service.SchedularService;
import com.workmates.backend.web.dto.SchedularDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SchedularController.class)
public class SchedularControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SchedularService schedularService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("스케줄 생성 테스트")
    void testCreateSchedule() throws Exception {
        SchedularDTO dto = SchedularDTO.builder()
                .title("회의")
                .context("회의 준비")
                .startDate(new Date())
                .dueDate(new Date(System.currentTimeMillis() + 86400000))
                .location("회의실")
                .importancy("HIGH")
                .completed(false)
                .build();

        Mockito.when(schedularService.createSchedule(any())).thenReturn(dto);

        mockMvc.perform(post("/api/schedules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("회의"));
    }

    @Test
    @DisplayName("스케줄 전체 조회 테스트")
    void testGetAllSchedules() throws Exception {
        List<SchedularDTO> list = List.of(
                SchedularDTO.builder().id(1L).title("1").build(),
                SchedularDTO.builder().id(2L).title("2").build()
        );

        Mockito.when(schedularService.getAllSchedules()).thenReturn(list);

        mockMvc.perform(get("/api/schedules"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @DisplayName("스케줄 수정 테스트")
    void testUpdateSchedule() throws Exception {
        SchedularDTO updated = SchedularDTO.builder()
                .id(1L)
                .title("수정된 제목")
                .build();

        Mockito.when(schedularService.updateSchedule(Mockito.eq(1L), any())).thenReturn(updated);

        mockMvc.perform(put("/api/schedules/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("수정된 제목"));
    }

    @Test
    @DisplayName("스케줄 삭제 테스트")
    void testDeleteSchedule() throws Exception {
        mockMvc.perform(delete("/api/schedules/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("스케줄 통계 조회 테스트")
    void testGetStats() throws Exception {
        Map<String, Long> stats = Map.of("total", 10L, "completed", 7L, "dueSoon", 2L);
        Mockito.when(schedularService.getScheduleStats()).thenReturn(stats);

        mockMvc.perform(get("/api/schedules/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(10))
                .andExpect(jsonPath("$.completed").value(7))
                .andExpect(jsonPath("$.dueSoon").value(2));
    }
}