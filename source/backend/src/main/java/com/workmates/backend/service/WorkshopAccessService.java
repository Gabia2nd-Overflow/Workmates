package com.workmates.backend.service;

public interface WorkshopAccessService {
    boolean hasAccess(Long workshopId, String userId);
}
