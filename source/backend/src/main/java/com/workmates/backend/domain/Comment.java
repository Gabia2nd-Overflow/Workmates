package com.workmates.backend.domain;

import java.time.LocalDateTime;

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
    
    private Long id; // 댓글 식별 번호

    private Long root_id; // 현재 댓글이 대댓글이라면 원댓글의 식별 번호

    private Integer depth; // 댓글 깊이(현재 댓글이 원댓글이라면 깊이는 0)

    private String content; // 댓글 내용

    private LocalDateTime written_at; // 댓글 작성일시

    private String attachment_url; // 댓글 첨부파일 url

    private Boolean is_deleted; // 댓글 삭제 여부

    private String writer_id; // 댓글 작성자 아이디

    private Long post_id; // 댓글이 작성된 게시글 아이디
}
