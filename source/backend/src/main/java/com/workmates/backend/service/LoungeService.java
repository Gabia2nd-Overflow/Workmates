package com.workmates.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.domain.Lounge;
import com.workmates.backend.repository.LoungeRepository;
import com.workmates.backend.web.dto.LoungeDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LoungeService {

    private final LoungeRepository loungeRepository;

    //생성
    public LoungeDto.Response create(LoungeDto.CreateRequest request) {
        Lounge chatroom = Lounge.builder()
                .name(request.getName())
                .build();

        return LoungeDto.Response.fromEntity(loungeRepository.save(chatroom));
    }

    //조회
    public List<LoungeDto.Response> findAll() {
        return loungeRepository.findAll().stream()
                .map(LoungeDto.Response::fromEntity)
                .collect(Collectors.toList());
    }

    //삭제
    public void delete(Long loungeId) {
        loungeRepository.deleteById(loungeId);
    }
}