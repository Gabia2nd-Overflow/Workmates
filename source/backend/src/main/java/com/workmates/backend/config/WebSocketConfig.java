package com.workmates.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * 클라이언트 → 서버로 메시지 보낼 때 접두사
     * 예: /pub/chat.send
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/sub"); // 서버 → 클라이언트 응답
        registry.setApplicationDestinationPrefixes("/pub"); // 클라이언트 → 서버 요청
    }

    /**
     * 웹소켓 연결 주소 설정
     * 프론트가 WebSocket 연결을 시작할 주소 (ex. /ws-stomp)
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-stomp") // WebSocket 연결 주소
                .setAllowedOriginPatterns("*") // CORS 허용
                ; // SockJS fallback 지원
    }
}

