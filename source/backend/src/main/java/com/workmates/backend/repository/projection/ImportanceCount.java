package com.workmates.backend.repository.projection;

import com.workmates.backend.domain.Importance;

public interface ImportanceCount {
    Importance getImportancy();
    Long getCnt();
}