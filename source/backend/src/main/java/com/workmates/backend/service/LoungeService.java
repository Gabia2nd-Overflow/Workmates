package com.workmates.backend.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.domain.Lounge;
import com.workmates.backend.repository.LoungeRepository;
import com.workmates.backend.web.dto.LoungeDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LoungeService {

    private final LoungeRepository loungeRepository;

    @Transactional
    public LoungeDto.Response create(Long workshopId, LoungeDto.CreateRequest req) {
        if (loungeRepository.existsByWorkshopIdAndNameAndIsDeletedFalse(workshopId, req.getName())) {
            throw new IllegalArgumentException("이미 존재하는 라운지 이름입니다.");
        }
        Lounge l = Lounge.builder()
                .name(req.getName())
                .isDeleted(false)
                .workshopId(workshopId) // ✅ 경로 변수로 받은 workshopId를 저장
                .build();
        return LoungeDto.Response.fromEntity(loungeRepository.save(l));
    }

    public List<LoungeDto.Response> list(Long workshopId) {
        return loungeRepository.findAllByWorkshopIdAndIsDeletedFalse(workshopId)
                .stream().map(LoungeDto.Response::fromEntity).toList();
    }

    public LoungeDto.Response get(Long workshopId, Long loungeId) {
        Lounge l = loungeRepository.findByIdAndWorkshopIdAndIsDeletedFalse(loungeId, workshopId)
                .orElseThrow(() -> new NoSuchElementException("Lounge not found"));
        return LoungeDto.Response.fromEntity(l);
    }

    @Transactional
    public LoungeDto.Response update(Long workshopId, Long loungeId, LoungeDto.UpdateRequest req) {
        Lounge l = loungeRepository.findByIdAndWorkshopIdAndIsDeletedFalse(loungeId, workshopId)
                .orElseThrow(() -> new NoSuchElementException("Lounge not found"));
        if (req.getName() != null && !req.getName().isBlank()) {
            if (loungeRepository.existsByWorkshopIdAndNameAndIsDeletedFalse(workshopId, req.getName())) {
                throw new IllegalArgumentException("이미 존재하는 라운지 이름입니다.");
            }
            l.setName(req.getName());
        }
        return LoungeDto.Response.fromEntity(l); // 더티체킹
    }

    @Transactional
    public void delete(Long workshopId, Long loungeId) {
        Lounge l = loungeRepository.findByIdAndWorkshopIdAndIsDeletedFalse(loungeId, workshopId)
                .orElseThrow(() -> new NoSuchElementException("Lounge not found"));
        l.setIsDeleted(true); // 소프트 삭제
    }
}