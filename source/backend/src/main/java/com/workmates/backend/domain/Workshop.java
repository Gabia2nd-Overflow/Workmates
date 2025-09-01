package com.workmates.backend.domain;

import com.workmates.backend.constant.DomainConstants;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "WORKSHOP")
@Getter 
@Setter 
@Builder
@NoArgsConstructor 
@AllArgsConstructor
public class Workshop { // 워크샵

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id; // 워크샵 아이디

    @Column(name = "name", nullable = false, unique = true, length = DomainConstants.ID_MAX_LEN)
    private String name; // 워크샵 이름

    @Column(name = "image_url", unique = true)
    @Builder.Default
    private String imageUrl = null; // 워크샵 아이콘 이미지 url. 기본적으로 null

    @Column(name = "description", length = DomainConstants.COMMENT_MAX_LEN)
    private String description; // 워크샵 설명

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false; // 워크샵 폐쇄 여부. 기본적으로 false
}