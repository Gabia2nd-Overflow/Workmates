package com.workmates.backend.domain;

import jakarta.persistence.Entity;
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
public class Comment { // 댓글 엔티티
    
    String content;

}
