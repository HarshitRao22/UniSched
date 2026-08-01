package com.examscheduler.service;

import com.examscheduler.dto.ExamSlotDTO;
import com.examscheduler.entity.ExamSlot;
import com.examscheduler.exception.ResourceNotFoundException;
import com.examscheduler.repository.ExamSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExamSlotService {

    @Autowired
    private ExamSlotRepository examSlotRepository;

    public List<ExamSlotDTO> getAllSlots() {
        return examSlotRepository.findAllByOrderByExamDateAscStartTimeAsc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ExamSlotDTO getSlotById(Long id) {
        ExamSlot slot = examSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam slot not found with id: " + id));
        return convertToDTO(slot);
    }

    public ExamSlotDTO createSlot(ExamSlotDTO dto) {
        if (!dto.getEndTime().isAfter(dto.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        ExamSlot slot = ExamSlot.builder()
                .examDate(dto.getExamDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .build();

        ExamSlot saved = examSlotRepository.save(slot);
        return convertToDTO(saved);
    }

    public ExamSlotDTO updateSlot(Long id, ExamSlotDTO dto) {
        ExamSlot slot = examSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam slot not found with id: " + id));

        if (!dto.getEndTime().isAfter(dto.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        slot.setExamDate(dto.getExamDate());
        slot.setStartTime(dto.getStartTime());
        slot.setEndTime(dto.getEndTime());

        ExamSlot updated = examSlotRepository.save(slot);
        return convertToDTO(updated);
    }

    public void deleteSlot(Long id) {
        ExamSlot slot = examSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam slot not found with id: " + id));
        examSlotRepository.delete(slot);
    }

    public long getTotalSlots() {
        return examSlotRepository.count();
    }

    private ExamSlotDTO convertToDTO(ExamSlot slot) {
        return ExamSlotDTO.builder()
                .id(slot.getId())
                .examDate(slot.getExamDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .createdAt(slot.getCreatedAt())
                .updatedAt(slot.getUpdatedAt())
                .build();
    }
}
