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


# 📡 실시간 채팅 기능 요약 및 WebSocket 설명

## ✅ 1. 전체 기능 요약

현재 구현한 실시간 채팅 기능은 **STOMP 프로토콜 기반 WebSocket 통신 구조**로 동작합니다.  
클라이언트(React)와 서버(Spring Boot)가 실시간으로 메시지를 주고받으며, 서버는 DB에 메시지를 저장하고 브로드캐스트합니다.

---

## 🧭 2. 메시지 흐름 구조

text
[React Client] --(SockJS+STOMP)--> [Spring WebSocket 서버]
     |                                     |
     |---- SEND --> /pub/chat.send --------|
     |                                     |
     |<--- SUBSCRIBE /sub/chatroom.1 <-----|
     |                                     |
     |<=== 메시지 broadcast from 서버 ====>|

##  3. 주요 엔드포인트 설명
경로	설명
/ws-stomp	클라이언트가 최초로 연결하는 WebSocket 엔드포인트
/pub/chat.send	클라이언트가 메시지를 서버로 보낼 때 사용하는 경로
/sub/chatroom.{id}	클라이언트가 메시지를 수신하기 위해 구독하는 경로

## 🔧 4. 사용하는 기술 스택
- Spring Boot 
1. @EnableWebSocketMessageBroker
2. SimpMessagingTemplate로 서버에서 메시지 전송

- STOMP 프로토콜

1. WebSocket 위에서 메시지 통신을 쉽게 관리할 수 있는 프로토콜

- SockJS

1. WebSocket을 지원하지 않는 환경에서도 fallback 처리 가능

- React

1. 클라이언트 측에서 STOMP 클라이언트 라이브러리 사용

2. 메시지 송수신 및 화면 반영 구현

## 📶 5. WebSocket이란?
WebSocket은 클라이언트와 서버 간의 실시간 양방향 통신을 가능하게 하는 프로토콜입니다.

HTTP는 요청 → 응답 모델이지만, WebSocket은 연결을 유지하면서 서버가 클라이언트에게 자유롭게 메시지를 보낼 수 있습니다.

## 📌 6. 왜 WebSocket이 필요한가?
이유	설명
실시간성	채팅, 알림 등 즉시 반응이 필요한 앱에서 필수
효율적인 통신	기존 HTTP Polling 방식보다 훨씬 적은 리소스로 실시간 처리 가능
양방향 지원	서버에서 클라이언트로 즉시 메시지를 보낼 수 있음 (Push 가능)

## ✅ 7. 실제 동작 확인 결과
메시지를 /pub/chat.send로 전송 시:

서버는 DB에 저장

해당 채팅방을 구독 중인 사용자에게 /sub/chatroom.{id} 경로로 메시지 전송

로그에서 DB insert 및 convertAndSend() 메시지 전송 확인

정상 작동 확인: 메시지 실시간 송수신 성공

## ✅ 8. 결론
이 시스템은 WebSocket + STOMP를 활용한 실시간 채팅 서비스이며,
유저가 보낸 메시지를 서버가 저장하고, 구독자에게 실시간으로 전달하는 구조입니다.
이는 협업 도구, 메신저, 알림 서비스 등 다양한 곳에서 핵심적으로 활용됩니다.