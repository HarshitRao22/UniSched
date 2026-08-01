package com.examscheduler.repository;

import com.examscheduler.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByStudentId(String studentId);

    Optional<Student> findByEmail(String email);

    boolean existsByStudentId(String studentId);

    boolean existsByEmail(String email);

    List<Student> findByFullNameContainingIgnoreCaseOrStudentIdContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String fullName, String studentId, String email);

    List<Student> findByBranchAndSemester(String branch, Integer semester);
}
