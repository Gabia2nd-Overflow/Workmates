package com.workmates.backend.web.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.workmates.backend.service.MessageService;
import com.workmates.backend.web.dto.MessageDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/workshops/{workshopId}/lounges/{loungeId}/messages")
@RequiredArgsConstructor
@Validated
public class MessageController {

    private final MessageService messageService;

    /**
     * 메시지 목록 조회 (초기 로딩)
     * GET /api/workshops/{wId}/lounges/{lId}/messages
     */
    @GetMapping
    public List<MessageDto.MessageResponse> list(
            @PathVariable Long workshopId,
            @PathVariable Long loungeId
    ) {
        return messageService.getMessages(workshopId, loungeId);
    }

    /**
     * 메시지 전송 (저장 + 웹소켓 브로드캐스트)
     * POST /api/workshops/{wId}/lounges/{lId}/messages
     * body: { writerId, content }
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MessageDto.ChatSocketResponse send(
            @PathVariable Long workshopId,
            @PathVariable Long loungeId,
            @RequestBody @Valid MessageDto.SendMessageRequest body,
            @AuthenticationPrincipal User principal // ★ 토큰에서 들어온 principal
    ) {
        String userId = principal.getUsername(); // ★ subject = userId
        return messageService.sendMessage(workshopId, loungeId, userId, body.getContent());
    }

    /**
     * 메시지 수정 (더티체킹 + 웹소켓 브로드캐스트)
     * PATCH /api/workshops/{wId}/lounges/{lId}/messages/{messageId}
     * body: { writerId, content, fileUrl? }
     */
    @PatchMapping("/{messageId}")
    public MessageDto.ChatSocketResponse edit(
            @PathVariable Long workshopId,
            @PathVariable Long loungeId,
            @PathVariable Long messageId,
            @RequestBody @Valid MessageDto.EditMessageRequest body,
            @AuthenticationPrincipal User principal
    ) {
        String editorId = principal.getUsername();
        return messageService.editMessage(workshopId, loungeId, messageId, editorId, body.getContent());
    }

    /**
     * 메시지 삭제(소프트) + 웹소켓 브로드캐스트
     * DELETE /api/workshops/{wId}/lounges/{lId}/messages/{messageId}
     * body: { writerId }
     */
    @DeleteMapping("/{messageId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long workshopId,
            @PathVariable Long loungeId,
            @PathVariable Long messageId,
            @RequestBody @Valid MessageDto.DeleteMessageRequest body, // ← body 없어도 되면 제거 가능
            @AuthenticationPrincipal User principal
    ) {
        String requesterId = principal.getUsername();
        messageService.deleteMessage(workshopId, loungeId, messageId, requesterId);
    }
}
