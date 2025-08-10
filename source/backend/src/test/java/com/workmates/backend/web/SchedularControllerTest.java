package com.workmates.backend.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.workmates.backend.service.SchedularService;
import com.workmates.backend.web.controller.SchedularController;
import com.workmates.backend.web.dto.ScheduleDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@WebMvcTest(SchedularController.class)
@AutoConfigureMockMvc(addFilters = false) // 🔥 보안 필터 비활성화하여 테스트 단순화
class SchedularControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SchedularService schedularService;

    @Autowired
    private ObjectMapper objectMapper;

    private ScheduleDto.Response sampleResponse;

    @BeforeEach
    void setUp() {
        sampleResponse = ScheduleDto.Response.builder()
                .id(1L)
                .title("회의")
                .context("테스트 내용")
                .startDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plusDays(1))
                .location("회의실")
                .importancy("HIGH")
                .completed(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void create_shouldReturnCreatedSchedule() throws Exception {
        when(schedularService.createSchedule(any())).thenReturn(sampleResponse);

        mockMvc.perform(post("/api/schedules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new ScheduleDto.CreateRequest("회의", "테스트 내용",
                                        LocalDateTime.now(), LocalDateTime.now().plusDays(1),
                                        "회의실", "HIGH")
                        )))
                .andDo(print()) // 🔥 응답 JSON 디버깅
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("회의"))
                .andExpect(jsonPath("$.completed").value(false));
    }

    @Test
    void update_shouldReturnUpdatedSchedule() throws Exception {
        when(schedularService.updateSchedule(eq(1L), any())).thenReturn(sampleResponse);

        ScheduleDto.UpdateRequest updateRequest = new ScheduleDto.UpdateRequest(
                "회의", "수정된 내용", LocalDateTime.now(),
                LocalDateTime.now().plusDays(2), "회의실B", "LOW", true
        );

        mockMvc.perform(put("/api/schedules/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("회의"))
                .andExpect(jsonPath("$.completed").value(false)); // ✅ service mock이 반환하는 값 기준
    }

    @Test
    void delete_shouldReturnNoContent() throws Exception {
        Mockito.doNothing().when(schedularService).deleteSchedule(1L);

        mockMvc.perform(delete("/api/schedules/1"))
                .andDo(print())
                .andExpect(status().isNoContent());

        verify(schedularService, times(1)).deleteSchedule(1L);
    }

    @Test
    void getAll_shouldReturnListOfSchedules() throws Exception {
        when(schedularService.getAllSchedules()).thenReturn(Collections.singletonList(sampleResponse));

        mockMvc.perform(get("/api/schedules"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("회의"));
    }

    @Test
    void getStats_shouldReturnStats() throws Exception {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", 5L);
        stats.put("completed", 2L);
        stats.put("dueSoon", 1L);

        when(schedularService.getScheduleStats()).thenReturn(stats);

        mockMvc.perform(get("/api/schedules/stats"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(5))
                .andExpect(jsonPath("$.completed").value(2))
                .andExpect(jsonPath("$.dueSoon").value(1));
    }
}