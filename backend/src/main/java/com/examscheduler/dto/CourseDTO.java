package com.examscheduler.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDTO {

    private Long id;

    @NotBlank(message = "Course code is required")
    private String courseCode;

    @NotBlank(message = "Course name is required")
    private String courseName;

    @NotNull(message = "Credits is required")
    private Integer credits;

    @NotBlank(message = "Branch is required")
    private String branch;

    @NotNull(message = "Semester is required")
    private Integer semester;

    private Long facultyId;
    private String facultyName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
