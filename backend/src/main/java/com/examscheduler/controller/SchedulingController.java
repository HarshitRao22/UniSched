package com.examscheduler.controller;

import com.examscheduler.dto.ManualEditRequest;
import com.examscheduler.dto.ScheduleGenerationResult;
import com.examscheduler.dto.ScheduledExamDTO;
import com.examscheduler.service.PdfReportService;
import com.examscheduler.service.SchedulingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/schedule")
@Tag(name = "Exam Scheduling", description = "Rule-based exam timetable generation endpoints")
public class SchedulingController {

    @Autowired
    private SchedulingService schedulingService;

    @Autowired
    private PdfReportService pdfReportService;

    @PostMapping("/generate")
    @Operation(summary = "Generate the exam timetable using the rule-based algorithm")
    public ResponseEntity<ScheduleGenerationResult> generateSchedule() {
        return ResponseEntity.ok(schedulingService.generateSchedule());
    }

    @GetMapping
    @Operation(summary = "Get the currently generated timetable")
    public ResponseEntity<List<ScheduledExamDTO>> getCurrentSchedule() {
        return ResponseEntity.ok(schedulingService.getCurrentSchedule());
    }

    @GetMapping("/count")
    @Operation(summary = "Get total scheduled exam count")
    public ResponseEntity<Map<String, Long>> getTotalScheduledExams() {
        return ResponseEntity.ok(Map.of("total", schedulingService.getTotalScheduledExams()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Manually edit a single scheduled exam (room and/or time slot)")
    public ResponseEntity<ScheduledExamDTO> updateScheduledExam(
            @PathVariable Long id,
            @Valid @RequestBody ManualEditRequest request) {
        return ResponseEntity.ok(schedulingService.updateScheduledExam(id, request));
    }

    @GetMapping("/export/pdf")
    @Operation(summary = "Export the current timetable as a PDF")
    public ResponseEntity<byte[]> exportTimetablePdf() {
        List<ScheduledExamDTO> schedule = schedulingService.getCurrentSchedule();
        byte[] pdfBytes = pdfReportService.generateTimetablePdf(schedule);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
                ContentDisposition.attachment().filename("exam-timetable.pdf").build());

        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }

    @DeleteMapping
    @Operation(summary = "Clear the current timetable")
    public ResponseEntity<Void> clearSchedule() {
        schedulingService.clearSchedule();
        return ResponseEntity.noContent().build();
    }
}
