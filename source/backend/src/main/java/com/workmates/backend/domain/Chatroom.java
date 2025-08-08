package com.workmates.backend.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity // 데이터베이스와 매핑(영속성 컨텍스트 - EntityManager)
@Getter
@Setter
@Builder
@NoArgsConstructor // 기본 생성자
@AllArgsConstructor // 모든 필드를 매개변수로 받는 생성자
public class Chatroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CHATROOM_ID")
    private Long id; // 채팅방 번호.

    @Column(name = "CHATROOM_NAME", nullable = false, length = 100)
    private String name; // 채팅방 이름.

    @Column(name = "CHATROOM_DESCRIPTION", length = 500)
    private String description; // 채팅방에 대한 소개/설명을 저장하는 필드입니다.

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt; // 시간.

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }


    /*
     * @PrePersist
     * JPA에서 제공하는 라이프사이클 콜백 어노테이션입니다.
     * 
     * 이게 붙은 onCreate() 메서드는 엔티티가 처음 저장되기 전에 자동 실행됩니다.
     * 
     * 즉, chatroomRepository.save(chatroom) 할 때 자동으로 실행돼요.
     * 엔티티가 처음 저장되기 직전에 실행돼서, createdAt에 현재 시간을 넣습니다.
     */
}
