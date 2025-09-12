package com.workmates.backend.repository.projection;

import com.workmates.backend.domain.Schedule.*;

public interface ImportanceCount {
    Importance getImportancy();
    Long getCnt();
}