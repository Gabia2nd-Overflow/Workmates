package com.workmates.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.domain.User;
import com.workmates.backend.domain.Workshop;
import com.workmates.backend.repository.WorkshopRepository;
import com.workmates.backend.web.dto.WorkshopDTO;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WorkshopService {

    private final WorkshopRepository workshopRepository;

    public WorkshopDTO.Response create(WorkshopDTO.CreateRequest req) {
        Workshop w = Workshop.builder()
                .name(req.getWorkshopName())
                .iconImage(req.getWorkshopIconImage())
                .description(req.getWorkshopDescription())
                .build();
            
        Workshop saved = workshopRepository.save(w); // 인스턴스 메서드로 호출
        return WorkshopDTO.Response.from(saved);
    }

    @Transactional(readOnly = true)
    public List<WorkshopDTO.Response> list() {
        return workshopRepository.findAllByIsDeletedFalseOrderByIdDesc()
                .stream().map(WorkshopDTO.Response::from).toList();
    }

    @Transactional(readOnly = true)
    public WorkshopDTO.Response get(Long id) {
        Workshop w = workshopRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new NoSuchElementException("Workshop not found"));
        return WorkshopDTO.Response.from(w);
    }

    public WorkshopDTO.Response update(Long id, WorkshopDTO.UpdateRequest req) {
        Workshop w = workshopRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new NoSuchElementException("Workshop not found"));
        if (req.getWorkshopName() != null) w.setName(req.getWorkshopName());
        if (req.getWorkshopIconImage() != null) w.setIconImage(req.getWorkshopIconImage());
        if (req.getWorkshopDescription() != null) w.setDescription(req.getWorkshopDescription());
        return WorkshopDTO.Response.from(w); // 더티체킹
    }

    public void softDelete(Long id) {
        Workshop w = workshopRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new NoSuchElementException("Workshop not found"));
        w.setDeleted(true);
    }
}
