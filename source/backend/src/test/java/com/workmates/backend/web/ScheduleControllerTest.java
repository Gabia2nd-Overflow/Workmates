package com.workmates.backend.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.workmates.backend.domain.Importance;
import com.workmates.backend.service.ScheduleService;
import com.workmates.backend.web.controller.ScheduleController;
import com.workmates.backend.web.dto.ScheduleDto;
import com.workmates.backend.web.dto.ScheduleStatsDto;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.EnumMap;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@WebMvcTest(controllers = ScheduleController.class)
class ScheduleControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean ScheduleService scheduleService;

    @Test
    @DisplayName("워크샵 일정 조회: 200 OK")
    @WithMockUser(username = "alice") // SecurityContext에 사용자 주입
    void getSchedulesForWorkshop_ok() throws Exception {
        Long workshopId = 10L;
        List<ScheduleDto.Response> list = List.of(
                ScheduleDto.Response.builder()
                        .id(1L).title("회의").content("리뷰")
                        .startDate(LocalDateTime.of(2025,9,1,10,0))
                        .dueDate(LocalDateTime.of(2025,9,1,11,0))
                        .importancy(Importance.MEDIUM).isCompleted(false).build()
        );

        when(scheduleService.getSchedulesForWorkshop(eq(workshopId), eq("alice"))).thenReturn(list);

        mockMvc.perform(get("/api/workshops/{workshopId}/schedules", workshopId))
               .andDo(print())
               .andExpect(status().isOk())
               .andExpect(jsonPath("$[0].id").value(1))
               .andExpect(jsonPath("$[0].title").value("회의"));
    }

    @Test
    @DisplayName("워크샵 일정 생성: 201 Created (writerId는 인증 컨텍스트에서 주입)")
    @WithMockUser(username = "alice")
    void createSchedule_created() throws Exception {
        Long workshopId = 10L;
        var req = ScheduleDto.CreateRequest.builder()
                .title("디자인 회의")
                .content("UI/UX 리뷰")
                .startDate(LocalDateTime.of(2025,9,1,10,0))
                .dueDate(LocalDateTime.of(2025,9,1,12,0))
                .importancy(Importance.HIGH)
                .build();

        var resp = ScheduleDto.Response.builder()
                .id(100L)
                .title(req.getTitle())
                .content(req.getContent())
                .startDate(req.getStartDate())
                .dueDate(req.getDueDate())
                .importancy(Importance.HIGH)
                .isCompleted(false)
                .build();

        when(scheduleService.createSchedule(any(ScheduleDto.CreateRequest.class), eq(workshopId), eq("alice")))
                .thenReturn(resp);

        mockMvc.perform(post("/api/workshops/{workshopId}/schedules", workshopId).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
               .andDo(print())
               .andExpect(status().isCreated())
               .andExpect(jsonPath("$.id").value(100))
               .andExpect(jsonPath("$.title").value("디자인 회의"));
    }

    @Test
    @DisplayName("일정 수정: 200 OK")
    @WithMockUser(username = "alice")
    void updateSchedule_ok() throws Exception {
        Long id = 100L;
        var req = ScheduleDto.UpdateRequest.builder()
                .title("수정된 제목")
                .content("수정된 내용")
                .startDate(LocalDateTime.of(2025,9,1,10,0))
                .dueDate(LocalDateTime.of(2025,9,1,12,0))
                .importancy("HIGH")
                .isCompleted(true)
                .build();

        var resp = ScheduleDto.Response.builder()
                .id(id)
                .title(req.getTitle())
                .content(req.getContent())
                .startDate(req.getStartDate())
                .dueDate(req.getDueDate())
                .importancy(Importance.HIGH)
                .isCompleted(true)
                .build();

        when(scheduleService.updateSchedule(eq(id), any(ScheduleDto.UpdateRequest.class))).thenReturn(resp);

        mockMvc.perform(put("/api/schedules/{id}", id).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
               .andDo(print())
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.title").value("수정된 제목"))
               .andExpect(jsonPath("$.importancy").value("HIGH"))
               .andExpect(jsonPath("$.isCompleted").value(true));
    }

    @Test
    @DisplayName("일정 삭제: 204 No Content")
    @WithMockUser(username = "alice")
    void deleteSchedule_noContent() throws Exception {
        Long id = 100L;
        Mockito.doNothing().when(scheduleService).deleteSchedule(id);

        mockMvc.perform(delete("/api/schedules/{id}", id).with(csrf()))
               .andDo(print())
               .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("미완료 목록: GET /api/workshops/{id}/schedules/incomplete → 200 & dueDate 오름차순")
    @WithMockUser(username = "alice")
    void listIncompleteForWorkshop_ok() throws Exception {
        Long workshopId = 10L;

        List<ScheduleDto.Response> list = List.of(
                ScheduleDto.Response.builder()
                        .id(2L).title("보드 리팩터링")
                        .startDate(LocalDateTime.of(2025, 9, 1, 10, 0))
                        .dueDate(LocalDateTime.of(2025, 9, 1, 10, 30))
                        .importancy(Importance.MEDIUM).isCompleted(false).build(),
                ScheduleDto.Response.builder()
                        .id(3L).title("디자인 리뷰")
                        .startDate(LocalDateTime.of(2025, 9, 1, 10, 0))
                        .dueDate(LocalDateTime.of(2025, 9, 1, 11, 0))
                        .importancy(Importance.HIGH).isCompleted(false).build()
        );
        when(scheduleService.listIncompleteForWorkshop(workshopId)).thenReturn(list);

        mockMvc.perform(get("/api/workshops/{workshopId}/schedules/incomplete", workshopId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(2L))
                .andExpect(jsonPath("$[1].id").value(3L));
        }

        @Test
@DisplayName("워크샵 통계: GET /api/workshops/{id}/schedules/stats → 200")
@WithMockUser(username = "alice")
void getWorkshopStats_ok() throws Exception {
    Long workshopId = 10L;
    Map<Importance, Long> byImp = new EnumMap<>(Importance.class);
    byImp.put(Importance.LOW, 1L);
    byImp.put(Importance.MEDIUM, 2L);
    byImp.put(Importance.HIGH, 3L);

    var dto = new ScheduleStatsDto(
            10,   // total
            4,    // completedCount
            40.0, // completionRate
            2,    // dueSoonCount
            1,    // overdueCount
            byImp // incompleteByImportance
    );
    when(scheduleService.getWorkshopStats(workshopId)).thenReturn(dto);

    mockMvc.perform(get("/api/workshops/{workshopId}/schedules/stats", workshopId))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.total").value(10))
           .andExpect(jsonPath("$.completedCount").value(4))
           .andExpect(jsonPath("$.completionRate").value(40.0))
           .andExpect(jsonPath("$.dueSoonCount").value(2))
           .andExpect(jsonPath("$.overdueCount").value(1))
           .andExpect(jsonPath("$.incompleteByImportance.HIGH").value(3));
}
}