package com.workmates.backend.service;

import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.workmates.backend.constant.ServiceConstants;
import com.workmates.backend.domain.User;
import com.workmates.backend.repository.MateRepository;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.web.dto.MateDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MateService {
    
    private final MateRepository mateRepository;
    private final UserRepository userRepository;

    public MateDto.SearchResponse search(MateDto.SearchRequest request) {
        if(!Pattern.matches(ServiceConstants.ID_REGEX, request.getId())) { // 정규표현식에 맞지 않은 아이디가 요청될 경우 검색 거부
            throw new IllegalArgumentException("올바르지 않은 사용자 아이디입니다.");
        }

        User user = userRepository.findById(request.getId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        return MateDto.SearchResponse.builder()
            .id(user.getId())
            .nickname(user.getNickname())
            .imageUrl(user.getImageUrl())
            .build();
    }
}
