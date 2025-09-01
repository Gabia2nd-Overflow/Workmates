package com.workmates.backend.service;

import org.springframework.stereotype.Service;

import com.workmates.backend.web.dto.MateDto;

@Service
public class MateService {
    
    public MateDto.SearchResponse search(MateDto.SearchRequest request) {
        // TODO: 구현 전까지는 빈 응답 반환 (null 말고)
        return new MateDto.SearchResponse(); // 빌더/정적팩토리 있으면 그걸로 empty 반환
    }
}
