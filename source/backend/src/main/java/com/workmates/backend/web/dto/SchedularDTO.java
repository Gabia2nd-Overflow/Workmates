package com.workmates.backend.web.dto;

import lombok.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchedularDTO {
    private Long id;
    private String title;
    private String context;
    private Date startDate;
    private Date dueDate;
    private String location;
    private String importancy;
    private Boolean completed;
    private Date createdAt;
}
