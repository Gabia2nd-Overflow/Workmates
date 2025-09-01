package com.workmates.backend.domain;

// WorkshopMemberId.java
import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkshopMemberId implements Serializable {
    private String memberId;
    private Long workshopId;
}