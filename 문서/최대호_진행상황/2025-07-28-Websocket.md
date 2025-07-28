# ✅ 1단계: WebSocket 구조 개요
🔹 목표 기능
사용자가 채팅방에 접속하면,

메시지를 입력하고 전송했을 때,

모든 접속자에게 실시간 메시지가 전송됨

🔧 WebSocket 구성 요소와 계층 구조
계층	구성 요소	설명
Controller	MessageWebSocketHandler 또는 ChatWebSocketController	WebSocket 메시지를 수신/전송 처리
Service	WebSocketChatService	메시지 전송 로직, 저장 호출 등 처리
Repository	MessageRepository	메시지를 DB에 저장 (선택)

🧩 구조 흐름 (3계층 설계 반영)
text
복사
편집
[웹 프론트엔드 (React + WebSocket 연결)]
      ⬇️
[WebSocketController] ← @ServerEndpoint 또는 @MessageMapping
      ⬇️
[ChatService / WebSocketService]
      ⬇️
[MessageRepository (JPA)] → DB
      ⬆️
[브로드캐스트 전송] → 연결된 사용자에게 메시지 전송
✅ 개발 순서 제안 (Step-by-step)
1. WebSocket 설정 클래스 생성 (핸들러/엔드포인트 등록)
WebSocketConfig.java

2. WebSocket 핸들러/컨트롤러 생성
ChatWebSocketHandler 혹은 ChatWebSocketController

@MessageMapping, @SendTo, 또는 TextWebSocketHandler 방식 중 선택

3. WebSocketService 생성
메시지 저장, 전송 대상 결정 등 핵심 로직

4. MessageRepository 활용
기존 JPA 저장 방식 유지

5. WebSocket 접속 테스트
Postman 또는 WebSocket Client / 프론트

✅ 예를 들어…
클래스 이름	역할
WebSocketConfig	WebSocket 연결을 위한 설정
ChatSocketController	메시지 수신/전송 처리 (Controller 계층)
ChatSocketService	메시지 저장/전송 로직 (Service 계층)
MessageRepository	메시지 영속화 (Repository 계층)
---
## 전체 흐름 요약.
[React WebSocket Client]
   ⬇
SEND /pub/chat.send
   ⬇
@Controller (ChatSocketController)
   ⬇
ChatSocketService.saveAndBroadcast()
   ⬇
MessageRepository.save()
   ⬇
@SendTo /sub/chatroom.{roomId}
   ⬆
브라우저에게 메시지 전송됨
