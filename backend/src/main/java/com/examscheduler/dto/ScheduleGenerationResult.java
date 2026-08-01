package com.examscheduler.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleGenerationResult {

    private int totalCourses;
    private int scheduledCount;
    private int unscheduledCount;
    private List<String> unscheduledCourses;
    private List<ScheduledExamDTO> schedule;
}
