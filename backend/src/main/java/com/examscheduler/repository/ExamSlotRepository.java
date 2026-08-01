package com.examscheduler.repository;

import com.examscheduler.entity.ExamSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExamSlotRepository extends JpaRepository<ExamSlot, Long> {

    List<ExamSlot> findAllByOrderByExamDateAscStartTimeAsc();
}
