package com.workmates.backend.service;

import com.workmates.backend.web.dto.MateDto;
import org.springframework.stereotype.Service;

@Service
public class MateService {
    
    public MateDto.SearchResponse search(MateDto.SearchRequest request) {
        // 현재는 더미 반환
        return null;
    }
}
