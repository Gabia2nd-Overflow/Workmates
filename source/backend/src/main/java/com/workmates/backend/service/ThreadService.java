package com.workmates.backend.service;

import com.workmates.backend.web.dto.ThreadDto;
import java.util.List;

public interface ThreadService {
    ThreadDto.Response createThread(ThreadDto.Request request);
    List<ThreadDto.Response> getThreadsByWorkshop(Long workshopId);
    ThreadDto.Response getThreadById(Long id);
    ThreadDto.Response updateThread(Long id, ThreadDto.Request request);
    void deleteThread(Long id);
}
