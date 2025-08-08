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
@Table(name = "workshops")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Workshop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "workshop_id")
    private Long id;

    @Column(name = "workshop_name", nullable = false, length = 100)
    private String name;

    @Column(name = "workshop_icon_image", length = 255)
    private String iconImage;

    @Column(name = "workshop_description", length = 255)
    private String description;

    @Column(name = "workshop_is_deleted", nullable = false)
    private boolean isDeleted = false;
}