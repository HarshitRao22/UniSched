package com.examscheduler.controller;

import com.examscheduler.dto.FacultyDTO;
import com.examscheduler.service.FacultyService;
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
@RequestMapping("/faculties")
@Tag(name = "Faculty", description = "Faculty management endpoints")
public class FacultyController {

    @Autowired
    private FacultyService facultyService;

    @GetMapping
    @Operation(summary = "Get all faculty members")
    public ResponseEntity<List<FacultyDTO>> getAllFaculties() {
        return ResponseEntity.ok(facultyService.getAllFaculties());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get faculty member by id")
    public ResponseEntity<FacultyDTO> getFacultyById(@PathVariable Long id) {
        return ResponseEntity.ok(facultyService.getFacultyById(id));
    }

    @GetMapping("/count")
    @Operation(summary = "Get total faculty count")
    public ResponseEntity<Map<String, Long>> getTotalFaculties() {
        return ResponseEntity.ok(Map.of("total", facultyService.getTotalFaculties()));
    }

    @PostMapping
    @Operation(summary = "Create a new faculty member")
    public ResponseEntity<FacultyDTO> createFaculty(@Valid @RequestBody FacultyDTO dto) {
        FacultyDTO created = facultyService.createFaculty(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing faculty member")
    public ResponseEntity<FacultyDTO> updateFaculty(@PathVariable Long id, @Valid @RequestBody FacultyDTO dto) {
        return ResponseEntity.ok(facultyService.updateFaculty(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a faculty member")
    public ResponseEntity<Void> deleteFaculty(@PathVariable Long id) {
        facultyService.deleteFaculty(id);
        return ResponseEntity.noContent().build();
    }
}
