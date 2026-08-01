package com.examscheduler.controller;

import com.examscheduler.dto.ExamSlotDTO;
import com.examscheduler.service.ExamSlotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/exam-slots")
@Tag(name = "Exam Slots", description = "Exam date and time slot management endpoints")
public class ExamSlotController {

    @Autowired
    private ExamSlotService examSlotService;

    @GetMapping
    @Operation(summary = "Get all exam slots")
    public ResponseEntity<List<ExamSlotDTO>> getAllSlots() {
        return ResponseEntity.ok(examSlotService.getAllSlots());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get exam slot by id")
    public ResponseEntity<ExamSlotDTO> getSlotById(@PathVariable Long id) {
        return ResponseEntity.ok(examSlotService.getSlotById(id));
    }

    @GetMapping("/count")
    @Operation(summary = "Get total exam slot count")
    public ResponseEntity<Map<String, Long>> getTotalSlots() {
        return ResponseEntity.ok(Map.of("total", examSlotService.getTotalSlots()));
    }

    @PostMapping
    @Operation(summary = "Create a new exam slot")
    public ResponseEntity<ExamSlotDTO> createSlot(@Valid @RequestBody ExamSlotDTO dto) {
        ExamSlotDTO created = examSlotService.createSlot(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing exam slot")
    public ResponseEntity<ExamSlotDTO> updateSlot(@PathVariable Long id, @Valid @RequestBody ExamSlotDTO dto) {
        return ResponseEntity.ok(examSlotService.updateSlot(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an exam slot")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long id) {
        examSlotService.deleteSlot(id);
        return ResponseEntity.noContent().build();
    }
}
