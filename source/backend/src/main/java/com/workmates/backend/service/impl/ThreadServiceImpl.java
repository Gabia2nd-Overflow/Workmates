package com.workmates.backend.service.impl;

import com.workmates.backend.domain.Thread;
import com.workmates.backend.repository.ThreadRepository;
import com.workmates.backend.service.ThreadService;
import com.workmates.backend.web.dto.ThreadDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ThreadServiceImpl implements ThreadService {

    private final ThreadRepository threadRepository;

    @Override
    public ThreadDto.Response createThread(ThreadDto.Request request) {
        Thread thread = Thread.builder()
                .name(request.getName())
                .workshopId(request.getWorkshopId())
                .isDeleted(false)
                .build();
        Thread saved = threadRepository.save(thread);
        return toResponse(saved);
    }

    @Override
    public List<ThreadDto.Response> getThreadsByWorkshop(Long workshopId) {
        return threadRepository.findByWorkshopIdAndIsDeletedFalse(workshopId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ThreadDto.Response getThreadById(Long id) {
        Thread thread = threadRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Thread not found: " + id));
        return toResponse(thread);
    }

    @Override
    public ThreadDto.Response updateThread(Long id, ThreadDto.Request request) {
        Thread thread = threadRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Thread not found: " + id));
        thread.setName(request.getName());
        return toResponse(thread);
    }

    @Override
    public void deleteThread(Long id) {
        Thread thread = threadRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Thread not found: " + id));
        thread.setIsDeleted(true);
    }

    private ThreadDto.Response toResponse(Thread thread) {
        return ThreadDto.Response.builder()
                .id(thread.getId())
                .name(thread.getName())
                .isDeleted(thread.getIsDeleted())
                .workshopId(thread.getWorkshopId())
                .build();
    }
}
