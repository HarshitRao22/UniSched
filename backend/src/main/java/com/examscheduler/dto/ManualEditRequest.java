package com.examscheduler.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManualEditRequest {

    @NotNull(message = "Room ID is required")
    private Long roomId;

    @NotNull(message = "Exam slot ID is required")
    private Long examSlotId;
}
