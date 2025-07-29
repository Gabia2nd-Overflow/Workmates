// Schedular.java
package com.workmates.backend.domain;

import java.time.LocalDateTime;
import java.util.Date;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Schedular {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SCHEDULE_ID")
    private long id;

    @Column(name = "SCHEDULE_TITLE", nullable = false, length = 50)
    private String title;

    @Column(name = "SCHEDULE_CONTEXT", length = 300)
    private String context;

    @Column(name = "SCHEDULE_STARTDATE", nullable = false)
    private Date startDate;

    @Column(name = "SCHEDULE_DUEDATE", nullable = false)
    private Date dueDate;

    @Column(name = "SCHEDULE_LOCATION", length = 50)
    private String location;

    @Column(name = "SCHEDULE_IMPORTANCY", nullable = false)
    private String importancy;

    @Column(name = "SCHEDULE_COMPLETED", nullable = false)
    @Builder.Default
    private Boolean completed = false;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
