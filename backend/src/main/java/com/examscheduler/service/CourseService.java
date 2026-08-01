package com.examscheduler.service;

import com.examscheduler.dto.CourseDTO;
import com.examscheduler.entity.Course;
import com.examscheduler.entity.Faculty;
import com.examscheduler.exception.DuplicateResourceException;
import com.examscheduler.exception.ResourceNotFoundException;
import com.examscheduler.repository.CourseRepository;
import com.examscheduler.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return convertToDTO(course);
    }

    public CourseDTO createCourse(CourseDTO dto) {
        if (courseRepository.existsByCourseCode(dto.getCourseCode())) {
            throw new DuplicateResourceException("Course code already exists: " + dto.getCourseCode());
        }

        Course course = Course.builder()
                .courseCode(dto.getCourseCode())
                .courseName(dto.getCourseName())
                .credits(dto.getCredits())
                .branch(dto.getBranch())
                .semester(dto.getSemester())
                .faculty(resolveFaculty(dto.getFacultyId()))
                .build();

        Course saved = courseRepository.save(course);
        return convertToDTO(saved);
    }

    public CourseDTO updateCourse(Long id, CourseDTO dto) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        if (!course.getCourseCode().equals(dto.getCourseCode())
                && courseRepository.existsByCourseCode(dto.getCourseCode())) {
            throw new DuplicateResourceException("Course code already exists: " + dto.getCourseCode());
        }

        course.setCourseCode(dto.getCourseCode());
        course.setCourseName(dto.getCourseName());
        course.setCredits(dto.getCredits());
        course.setBranch(dto.getBranch());
        course.setSemester(dto.getSemester());
        course.setFaculty(resolveFaculty(dto.getFacultyId()));

        Course updated = courseRepository.save(course);
        return convertToDTO(updated);
    }

    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        courseRepository.delete(course);
    }

    public long getTotalCourses() {
        return courseRepository.count();
    }

    private Faculty resolveFaculty(Long facultyId) {
        if (facultyId == null) {
            return null;
        }
        return facultyRepository.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + facultyId));
    }

    private CourseDTO convertToDTO(Course course) {
        return CourseDTO.builder()
                .id(course.getId())
                .courseCode(course.getCourseCode())
                .courseName(course.getCourseName())
                .credits(course.getCredits())
                .branch(course.getBranch())
                .semester(course.getSemester())
                .facultyId(course.getFaculty() != null ? course.getFaculty().getId() : null)
                .facultyName(course.getFaculty() != null ? course.getFaculty().getFullName() : null)
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}
