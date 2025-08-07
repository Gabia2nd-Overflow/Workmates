# 메시지 수정 & 삭제 기능 요약 (Workmates 메신저)
- 이 문서는 메시지 수정/삭제 기능을 중심으로 백엔드 및 프론트엔드 코드 구조와 주요 변경사항을 정리한 요약본입니다.
# ✅ 1. 전체 흐름 구조
[React] ChatroomDetail.jsx
   └── [수정/삭제 요청]
         ↓
[Axios API 요청]
   └── [Spring Boot] @PatchMapping / @DeleteMapping
         ↓
   └── MessageService → MessageRepository
         ↓
   └── DB 반영 (isDeleted, content 수정)
         ↓
   └── WebSocket (/sub/chatrooms.{chatroomId})로 결과 전송
         ↓
[React] WebSocket 수신 후 메시지 목록 상태 업데이트

# 2.백엔드 수정사항
# 📌 MessageController.java
@PatchMapping("/{id}")
public ResponseEntity<MessageDTO.ChatSocketResponse> editMessage(
        @PathVariable("id") Long messageId,
        @RequestBody EditMessageRequest request
) {
    MessageDTO.ChatSocketResponse updated =
            messageService.editMessage(messageId, request.getSenderId(), request.getContent());

    return ResponseEntity.ok(updated);
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteMessage(
        @PathVariable("id") Long messageId,
        @RequestBody DeleteMessageRequest request
) {
    messageService.deleteMessage(messageId, request.getSenderId());
    return ResponseEntity.noContent().build();
}

# 📌 MessageDTO.java
@Data
public static class EditMessageRequest {
    private Long senderId;
    private String content;
}

@Data
public static class DeleteMessageRequest {
    private Long senderId;
}

# 📌 Message.java (Entity)
    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean deleted = false;

    private LocalDateTime deletedAt;
    private LocalDateTime updatedAt; 
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    public void markAsDeleted() {
        this.deleted = true;
        this.deletedAt = LocalDateTime.now();
    }
# 📌 MessageRepository.java
List<Message> findAllByChatroomIdAndDeletedFalseOrderByCreatedAtAsc(Long chatroomId);
Optional<Message> findByIdAndDeletedFalse(Long id);

# 🎨 3. 프론트엔드 수정 사항
# 📌 api.js
export const messageAPI = {
  editMessage: (chatroomId, messageId, data) =>
    api.patch(`/chatrooms/${chatroomId}/messages/${messageId}`, data),
  deleteMessage: (chatroomId, messageId, data) =>
    api.delete(`/chatrooms/${chatroomId}/messages/${messageId}`, { data }),
};
# 📌 ChatroomDetail.jsx
# 수정 핸들러
const handleEdit = async (messageId) => {
  await messageAPI.editMessage(chatroomId, messageId, {
    senderId: userId,
    content: editInput,
  });
  setMessages(prev => prev.map(msg =>
    msg.id === messageId ? { ...msg, content: editInput } : msg
  ));
};
# 삭제 핸들러
const handleDelete = async (messageId) => {
  await messageAPI.deleteMessage(chatroomId, messageId, {
    senderId: userId,
  });
  setMessages(prev => prev.filter(msg => msg.id !== messageId));
};
# key 중복 해결 (에러사항 해결.)
<div key={`${msg.id}-${msg.updatedAt || ""}`}>
🧾 결과 정리
항목	내용
수정 방식	PATCH + WebSocket 재전송 후 클라이언트 상태 업데이트
삭제 방식	DELETE → DB 상태 변경 → 클라이언트 메시지 목록에서 제거
오류 해결	중복 key, CORS, WebSocket 메시지 중복 처리 완료
UI 반영	수정 버튼 → textarea, 삭제 버튼 → 삭제 수행