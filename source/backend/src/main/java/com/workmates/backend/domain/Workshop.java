package com.workmates.backend.domain;

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
    @Column(name = "WORKSHOP_ID")
    private Long workshop_id; // 워크샵 아이디

    @Column(name = "WORKSHOP_NAME", nullable = false, unique = true, length = DomainConstants.ID_MAX_LEN)
    private String workshop_name; // 워크샵 이름

    @Column(name = "WORKSHOP_ICON_IMAGE_URL", unique = true)
    @Builder.Default
    private String workshop_icon_image_url = null; // 워크샵 아이콘 이미지 url. 기본적으로 null

    @Column(name = "WORKSHOP_DESCRIPTION", length = DomainConstants.COMMENT_MAX_LEN)
    private String workshop_description; // 워크샵 설명

    @Column(name = "WORKSHOP_IS_DELETED", nullable = false)
    @Builder.Default
    private Boolean workshop_is_deleted = false; // 워크샵 폐쇄 여부. 기본적으로 false
}