package com.workmates.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.domain.Workshop;
import com.workmates.backend.repository.WorkshopRepository;
import com.workmates.backend.web.dto.WorkshopDto;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WorkshopService {

    private final WorkshopRepository workshopRepository;

    public WorkshopDto.Response create(WorkshopDto.CreateRequest req) {
        Workshop w = Workshop.builder()
                .name(req.getWorkshopName())
                .imageUrl(req.getWorkshopIconImage())
                .description(req.getWorkshopDescription())
                .build();
            
        Workshop saved = workshopRepository.save(w); // 인스턴스 메서드로 호출
        return WorkshopDto.Response.from(saved);
    }

    @Transactional(readOnly = true)
    public List<WorkshopDto.Response> list() {
        return workshopRepository.findAllByIsDeletedFalse()
                .stream().map(WorkshopDto.Response::from).toList();
    }

    @Transactional(readOnly = true)
    public WorkshopDto.Response get(Long id) {
        Workshop w = workshopRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new NoSuchElementException("Workshop not found"));
        return WorkshopDto.Response.from(w);
    }

    public WorkshopDto.Response update(Long id, WorkshopDto.UpdateRequest req) {
        Workshop w = workshopRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new NoSuchElementException("Workshop not found"));
        if (req.getWorkshopName() != null) w.setName(req.getWorkshopName());
        if (req.getWorkshopIconImage() != null) w.setImageUrl(req.getWorkshopIconImage());
        if (req.getWorkshopDescription() != null) w.setDescription(req.getWorkshopDescription());
        return WorkshopDto.Response.from(w); // 더티체킹
    }

    public void softDelete(Long id) {
        Workshop w = workshopRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new NoSuchElementException("Workshop not found"));
        w.setIsDeleted(true);
    }
}
