package com.examscheduler.service;

import com.examscheduler.dto.StudentDTO;
import com.examscheduler.entity.Student;
import com.examscheduler.exception.DuplicateResourceException;
import com.examscheduler.exception.ResourceNotFoundException;
import com.examscheduler.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return convertToDTO(student);
    }

    public List<StudentDTO> searchStudents(String query) {
        return studentRepository
                .findByFullNameContainingIgnoreCaseOrStudentIdContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        query, query, query)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public StudentDTO createStudent(StudentDTO dto) {
        if (studentRepository.existsByStudentId(dto.getStudentId())) {
            throw new DuplicateResourceException("Student ID already exists: " + dto.getStudentId());
        }
        if (studentRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + dto.getEmail());
        }

        Student student = Student.builder()
                .studentId(dto.getStudentId())
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .branch(dto.getBranch())
                .semester(dto.getSemester())
                .build();

        Student saved = studentRepository.save(student);
        return convertToDTO(saved);
    }

    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        if (!student.getStudentId().equals(dto.getStudentId())
                && studentRepository.existsByStudentId(dto.getStudentId())) {
            throw new DuplicateResourceException("Student ID already exists: " + dto.getStudentId());
        }
        if (!student.getEmail().equals(dto.getEmail())
                && studentRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + dto.getEmail());
        }

        student.setStudentId(dto.getStudentId());
        student.setFullName(dto.getFullName());
        student.setEmail(dto.getEmail());
        student.setBranch(dto.getBranch());
        student.setSemester(dto.getSemester());

        Student updated = studentRepository.save(student);
        return convertToDTO(updated);
    }

    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        studentRepository.delete(student);
    }

    public long getTotalStudents() {
        return studentRepository.count();
    }

    private StudentDTO convertToDTO(Student student) {
        return StudentDTO.builder()
                .id(student.getId())
                .studentId(student.getStudentId())
                .fullName(student.getFullName())
                .email(student.getEmail())
                .branch(student.getBranch())
                .semester(student.getSemester())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }
}
