package com.workmates.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.domain.Lounge;
import com.workmates.backend.domain.Message;
import com.workmates.backend.domain.User;
import com.workmates.backend.repository.LoungeRepository;
import com.workmates.backend.repository.MessageRepository;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.web.dto.MessageDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MessageService {

    private final MessageRepository messageRepository;
    private final LoungeRepository loungeRepository;
    private final UserRepository userRepository;
    private final MessageBroadcastService broadcastService;

    // ===== 공통 검증 =====
    private Lounge requireLounge(Long workshopId, Long loungeId) {
        Lounge lounge = loungeRepository.findById(loungeId)
                .orElseThrow(() -> new IllegalArgumentException("라운지가 존재하지 않습니다."));
        if (!lounge.getWorkshopId().equals(workshopId)) {
            throw new IllegalArgumentException("라운지가 요청한 워크샵에 속하지 않습니다.");
        }
        if (Boolean.TRUE.equals(lounge.getIsDeleted())) {
            throw new IllegalStateException("삭제된 라운지입니다.");
        }
        return lounge;
    }

    private User requireUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));
    }

    // ===== 메시지 생성 =====
    @Transactional
    public MessageDto.ChatSocketResponse sendMessage(Long workshopId, Long loungeId,
                                                     String userId, String content) {
        Lounge lounge = requireLounge(workshopId, loungeId);
        User sender = requireUser(userId);

            // 기존 생성 방식 유지
        Message m = new Message(lounge.getId(), sender.getId(), content);

        // ✅ 닉네임 채워주기 (null/blank면 userId로 대체)
        String nickname = (sender.getNickname() != null && !sender.getNickname().isBlank())
                ? sender.getNickname()
                : sender.getId();
        m.setWriterNickname(nickname);   // ★ 이 한 줄이 핵심

        Message saved = messageRepository.save(m);


        MessageDto.ChatSocketResponse dto = MessageDto.ChatSocketResponse.from(saved, workshopId);
        broadcastService.sendCreated(dto);
        return dto;
    }

    // ===== 메시지 목록 =====
    public List<MessageDto.MessageResponse> getMessages(Long workshopId, Long loungeId) {
        requireLounge(workshopId, loungeId);
        return messageRepository.findAllByLoungeIdAndIsDeletedFalse(loungeId)
                .stream().map(MessageDto.MessageResponse::from).toList();
    }

    // ===== 메시지 수정 =====
    @Transactional
    public MessageDto.ChatSocketResponse editMessage(Long workshopId, Long loungeId,
                                                     Long messageId, String editorId, String newContent) {
        requireLounge(workshopId, loungeId);

        Message message = messageRepository.findByIdAndIsDeletedFalse(messageId)
                .orElseThrow(() -> new IllegalArgumentException("수정할 메시지를 찾을 수 없습니다."));

        if (!message.getLoungeId().equals(loungeId)) {
            throw new IllegalArgumentException("메시지가 해당 라운지에 속하지 않습니다.");
        }
        if (!message.getWriterId().equals(editorId)) {
            throw new IllegalStateException("본인의 메시지만 수정할 수 있습니다.");
        }

        message.setContent(newContent);

        // ✅ 반드시 workshopId를 같이 넘김 (현재 from 시그니처)
        MessageDto.ChatSocketResponse dto = MessageDto.ChatSocketResponse.from(message, workshopId);
        broadcastService.sendUpdated(dto);
        return dto;
    }

    // ===== 메시지 삭제(소프트) =====
    @Transactional
    public void deleteMessage(Long workshopId, Long loungeId,
                              Long messageId, String editorId) {
        requireLounge(workshopId, loungeId);

        Message message = messageRepository.findByIdAndIsDeletedFalse(messageId)
                .orElseThrow(() -> new IllegalArgumentException("삭제할 메시지를 찾을 수 없습니다."));

        if (!message.getLoungeId().equals(loungeId)) {
            throw new IllegalArgumentException("메시지가 해당 라운지에 속하지 않습니다.");
        }
        if (!message.getWriterId().equals(editorId)) {
            throw new IllegalStateException("본인의 메시지만 삭제할 수 있습니다.");
        }

        message.setDeleted(true);

        // ✅ 3개 인자 버전으로 호출 (workshopId, loungeId, messageId)
        broadcastService.sendDeleted(workshopId, loungeId, messageId);
    }
}