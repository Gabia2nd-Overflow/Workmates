package com.workmates.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.constant.ServiceConstants;
import com.workmates.backend.domain.Mate;
import com.workmates.backend.domain.MateId;
import com.workmates.backend.domain.User;
import com.workmates.backend.repository.MateRepository;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.web.dto.MateDto;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MateService {
    
    private final MateRepository mateRepository;
    private final UserRepository userRepository;

    public MateDto.MatelistResponse matelist(String id) {
        if(!Pattern.matches(ServiceConstants.ID_REGEX, id)) {
            throw new IllegalArgumentException("올바르지 않은 사용자 아이디입니다.");
        }

        List<Mate> matelist = new ArrayList<>();

        matelist.addAll(mateRepository.findAllBySenderIdOrReceiverId(id));
        
        return MateDto.MatelistResponse.builder()
                .matelist(matelist)
                .build();
    }

    public MateDto.SearchResponse search(MateDto.SearchRequest request) {

        // 현재는 더미 반환
        return null;

    }
}
