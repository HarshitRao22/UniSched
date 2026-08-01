package com.examscheduler.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduledExamDTO {

    private Long id;

    private Long courseId;
    private String courseCode;
    private String courseName;
    private String branch;
    private Integer semester;

    private Long roomId;
    private String roomNumber;

    private String facultyName;

    private Long examSlotId;
    private LocalDate examDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private Integer studentCount;
    private Boolean manuallyModified;
}
