package com.examscheduler.repository;

import com.examscheduler.entity.ScheduledExam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScheduledExamRepository extends JpaRepository<ScheduledExam, Long> {

    List<ScheduledExam> findAllByOrderByExamSlot_ExamDateAscExamSlot_StartTimeAsc();

    /** Room already booked in this slot (excluding the exam currently being edited). */
    @Query("SELECT COUNT(se) > 0 FROM ScheduledExam se " +
           "WHERE se.room.id = :roomId AND se.examSlot.id = :slotId AND se.id <> :excludeId")
    boolean existsByRoomAndSlotExcluding(
            @Param("roomId") Long roomId,
            @Param("slotId") Long slotId,
            @Param("excludeId") Long excludeId);

    /** Another exam for the same branch+semester already in this slot (same student group). */
    @Query("SELECT COUNT(se) > 0 FROM ScheduledExam se " +
           "WHERE se.course.branch = :branch AND se.course.semester = :semester " +
           "AND se.examSlot.id = :slotId AND se.id <> :excludeId")
    boolean existsByGroupAndSlotExcluding(
            @Param("branch") String branch,
            @Param("semester") Integer semester,
            @Param("slotId") Long slotId,
            @Param("excludeId") Long excludeId);

    /** Faculty member already supervising another exam in this slot. */
    @Query("SELECT COUNT(se) > 0 FROM ScheduledExam se " +
           "WHERE se.course.faculty.id = :facultyId AND se.examSlot.id = :slotId AND se.id <> :excludeId")
    boolean existsByFacultyAndSlotExcluding(
            @Param("facultyId") Long facultyId,
            @Param("slotId") Long slotId,
            @Param("excludeId") Long excludeId);
}
