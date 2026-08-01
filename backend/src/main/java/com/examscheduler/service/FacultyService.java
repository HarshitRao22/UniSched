package com.examscheduler.service;

import com.examscheduler.dto.FacultyDTO;
import com.examscheduler.entity.Faculty;
import com.examscheduler.exception.DuplicateResourceException;
import com.examscheduler.exception.ResourceNotFoundException;
import com.examscheduler.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FacultyService {

    @Autowired
    private FacultyRepository facultyRepository;

    public List<FacultyDTO> getAllFaculties() {
        return facultyRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public FacultyDTO getFacultyById(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));
        return convertToDTO(faculty);
    }

    public FacultyDTO createFaculty(FacultyDTO dto) {
        if (facultyRepository.existsByFacultyId(dto.getFacultyId())) {
            throw new DuplicateResourceException("Faculty ID already exists: " + dto.getFacultyId());
        }
        if (facultyRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + dto.getEmail());
        }

        Faculty faculty = Faculty.builder()
                .facultyId(dto.getFacultyId())
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .department(dto.getDepartment())
                .build();

        Faculty saved = facultyRepository.save(faculty);
        return convertToDTO(saved);
    }

    public FacultyDTO updateFaculty(Long id, FacultyDTO dto) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));

        if (!faculty.getFacultyId().equals(dto.getFacultyId())
                && facultyRepository.existsByFacultyId(dto.getFacultyId())) {
            throw new DuplicateResourceException("Faculty ID already exists: " + dto.getFacultyId());
        }
        if (!faculty.getEmail().equals(dto.getEmail())
                && facultyRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + dto.getEmail());
        }

        faculty.setFacultyId(dto.getFacultyId());
        faculty.setFullName(dto.getFullName());
        faculty.setEmail(dto.getEmail());
        faculty.setDepartment(dto.getDepartment());

        Faculty updated = facultyRepository.save(faculty);
        return convertToDTO(updated);
    }

    public void deleteFaculty(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));
        facultyRepository.delete(faculty);
    }

    public long getTotalFaculties() {
        return facultyRepository.count();
    }

    private FacultyDTO convertToDTO(Faculty faculty) {
        return FacultyDTO.builder()
                .id(faculty.getId())
                .facultyId(faculty.getFacultyId())
                .fullName(faculty.getFullName())
                .email(faculty.getEmail())
                .department(faculty.getDepartment())
                .createdAt(faculty.getCreatedAt())
                .updatedAt(faculty.getUpdatedAt())
                .build();
    }
}
