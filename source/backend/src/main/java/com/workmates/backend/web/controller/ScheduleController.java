package com.workmates.backend.web.controller;

import com.workmates.backend.service.ScheduleService;
import com.workmates.backend.web.dto.ScheduleDto;
import com.workmates.backend.web.dto.ScheduleStatsDto;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 워크샵 단위 스케줄 컨트롤러
 * - 목록/생성: /api/workshops/{workshopId}/schedules
 * - 수정/삭제: /api/schedules/{id}
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    // 같은 워크샵의 모든 일정 조회 (현재 사용자 접근 권한 확인 포함)
    @GetMapping("/workshops/{workshopId}/schedules")
    public ResponseEntity<List<ScheduleDto.Response>> getForWorkshop(@PathVariable Long workshopId) {
        String currentUserId = currentUserId();
        return ResponseEntity.ok(scheduleService.getSchedulesForWorkshop(workshopId, currentUserId));
    }

    // 일정 생성 (writerId는 인증 컨텍스트에서, workshopId는 경로 변수에서)
    @PostMapping("/workshops/{workshopId}/schedules")
    public ResponseEntity<ScheduleDto.Response> create(
            @PathVariable Long workshopId,
            @RequestBody ScheduleDto.CreateRequest dto
    ) {
        String currentUserId = currentUserId();
        ScheduleDto.Response created = scheduleService.createSchedule(dto, workshopId, currentUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // 일정 수정 (작성자 제한 정책은 추후 팀 정책 확정 후 서비스 레벨에서 추가 권장)
    @PutMapping("/schedules/{id}")
    public ResponseEntity<ScheduleDto.Response> update(
            @PathVariable Long id,
            @RequestBody ScheduleDto.UpdateRequest dto
    ) {
        return ResponseEntity.ok(scheduleService.updateSchedule(id, dto));
    }

    // 일정 삭제 (소프트 삭제: @SQLDelete에 의해 isDeleted=true 업데이트)
    @DeleteMapping("/schedules/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }

    // --- 내부 헬퍼 ---
    // 인증 컨텍스트에서 현재 사용자 ID를 추출
    private String currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            // GlobalExceptionHandler가 500으로 잡지 않도록, 명확한 400 메시지 전달.
            throw new IllegalArgumentException("인증 정보가 유효하지 않습니다. 로그인 상태를 확인해 주세요.");
        }
        return auth.getName();
    }

    //워크샵별 대시보드 통계 (연체 포함)
    @GetMapping("/workshops/{workshopId}/schedules/stats")
    public ResponseEntity<ScheduleStatsDto> getWorkshopStats(@PathVariable Long workshopId) {
        ScheduleStatsDto dto = scheduleService.getWorkshopStats(workshopId);
        return ResponseEntity.ok(dto);
    }

    //워크샵별 미완료 목록 (마감일 오름차순)
    @GetMapping("/workshops/{workshopId}/schedules/incomplete")
    public ResponseEntity<List<ScheduleDto.Response>> listIncompleteForWorkshop(
            @PathVariable Long workshopId
    ) {
    List<ScheduleDto.Response> list = scheduleService.listIncompleteForWorkshop(workshopId);
    return ResponseEntity.ok(list);
    }
}