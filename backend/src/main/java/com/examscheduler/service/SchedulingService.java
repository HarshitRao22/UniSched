package com.examscheduler.service;

import com.examscheduler.dto.ManualEditRequest;
import com.examscheduler.dto.ScheduleGenerationResult;
import com.examscheduler.dto.ScheduledExamDTO;
import com.examscheduler.entity.Course;
import com.examscheduler.entity.ExamSlot;
import com.examscheduler.entity.Room;
import com.examscheduler.entity.ScheduledExam;
import com.examscheduler.entity.Student;
import com.examscheduler.exception.ResourceNotFoundException;
import com.examscheduler.repository.CourseRepository;
import com.examscheduler.repository.ExamSlotRepository;
import com.examscheduler.repository.RoomRepository;
import com.examscheduler.repository.ScheduledExamRepository;
import com.examscheduler.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Simple rule-based exam scheduling algorithm.
 *
 * Courses are first sorted by descending student count (larger classes get
 * first pick of slots/rooms). Then, for every course in that order, the
 * algorithm walks through exam slots (in date/time order) and rooms (in id
 * order) and assigns the FIRST combination that satisfies all rules.
 * No backtracking, no optimization, no AI/ML/graph-coloring - just
 * sequential first-fit checking.
 *
 * Rules enforced:
 *  1. Each course gets exactly one exam.
 *  2. A room cannot host two exams in the same slot.
 *  3. Room capacity must not be exceeded (capacity >= number of students
 *     taking that course, where "students of a course" = students sharing
 *     the course's branch and semester).
 *  4. No student sits two exams in the same slot (enforced by blocking a
 *     slot for a branch+semester group once a course from that group is
 *     placed there).
 *  5. No faculty member is assigned to two exams in the same slot.
 */
@Service
@Transactional
public class SchedulingService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ExamSlotRepository examSlotRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ScheduledExamRepository scheduledExamRepository;

    public ScheduleGenerationResult generateSchedule() {
        // Start clean every time the timetable is (re)generated.
        scheduledExamRepository.deleteAll();

        List<Course> courses = courseRepository.findAll();
        List<Room> rooms = roomRepository.findAll();
        List<ExamSlot> slots = examSlotRepository.findAllByOrderByExamDateAscStartTimeAsc();

        List<String> unscheduled = new ArrayList<>();
        List<ScheduledExam> placed = new ArrayList<>();

        // Tracks which room+slot combos are already taken.
        Set<String> roomSlotTaken = new HashSet<>();
        // Tracks which branch+semester groups already have an exam in a given slot
        // (this is what prevents a student from having two exams at once).
        Set<String> groupSlotTaken = new HashSet<>();
        // Tracks which faculty members already have an exam in a given slot.
        Set<String> facultySlotTaken = new HashSet<>();

        // Cache student counts per branch+semester so we don't re-query repeatedly.
        Map<String, Integer> groupSizeCache = new HashMap<>();
        for (Course course : courses) {
            String groupKey = course.getBranch() + "|" + course.getSemester();
            groupSizeCache.computeIfAbsent(groupKey, k -> {
                List<Student> matching = studentRepository.findByBranchAndSemester(
                        course.getBranch(), course.getSemester());
                return matching.size();
            });
        }

        // Sort courses by descending student count first, so larger classes
        // get first pick of available rooms and slots. Still fully
        // deterministic - ties keep their original relative order.
        List<Course> orderedCourses = courses.stream()
                .sorted((a, b) -> {
                    int sizeA = groupSizeCache.get(a.getBranch() + "|" + a.getSemester());
                    int sizeB = groupSizeCache.get(b.getBranch() + "|" + b.getSemester());
                    return Integer.compare(sizeB, sizeA);
                })
                .collect(Collectors.toList());

        for (Course course : orderedCourses) {
            String groupKey = course.getBranch() + "|" + course.getSemester();
            int studentCount = groupSizeCache.get(groupKey);
            Long facultyId = course.getFaculty() != null ? course.getFaculty().getId() : null;

            boolean scheduledThisCourse = false;

            for (ExamSlot slot : slots) {
                String groupSlotKey = groupKey + "@" + slot.getId();
                if (groupSlotTaken.contains(groupSlotKey)) {
                    // A course for the same students is already in this slot - skip slot.
                    continue;
                }

                String facultySlotKey = facultyId != null ? facultyId + "@" + slot.getId() : null;
                if (facultySlotKey != null && facultySlotTaken.contains(facultySlotKey)) {
                    // This course's faculty already has an exam in this slot - skip slot.
                    continue;
                }

                for (Room room : rooms) {
                    if (room.getCapacity() < studentCount) {
                        continue; // Rule: room capacity must not be exceeded.
                    }

                    String roomSlotKey = room.getId() + "@" + slot.getId();
                    if (roomSlotTaken.contains(roomSlotKey)) {
                        continue; // Rule: a room cannot host two exams in the same slot.
                    }

                    // All rules satisfied - assign this room and slot.
                    ScheduledExam exam = ScheduledExam.builder()
                            .course(course)
                            .room(room)
                            .examSlot(slot)
                            .studentCount(studentCount)
                            .build();

                    placed.add(exam);
                    roomSlotTaken.add(roomSlotKey);
                    groupSlotTaken.add(groupSlotKey);
                    if (facultySlotKey != null) {
                        facultySlotTaken.add(facultySlotKey);
                    }
                    scheduledThisCourse = true;
                    break;
                }

                if (scheduledThisCourse) {
                    break;
                }
            }

            if (!scheduledThisCourse) {
                unscheduled.add(course.getCourseCode() + " - " + course.getCourseName());
            }
        }

        List<ScheduledExam> saved = scheduledExamRepository.saveAll(placed);

        List<ScheduledExamDTO> scheduleDTOs = saved.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ScheduleGenerationResult.builder()
                .totalCourses(courses.size())
                .scheduledCount(saved.size())
                .unscheduledCount(unscheduled.size())
                .unscheduledCourses(unscheduled)
                .schedule(scheduleDTOs)
                .build();
    }

    public List<ScheduledExamDTO> getCurrentSchedule() {
        return scheduledExamRepository.findAllByOrderByExamSlot_ExamDateAscExamSlot_StartTimeAsc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void clearSchedule() {
        scheduledExamRepository.deleteAll();
    }

    public long getTotalScheduledExams() {
        return scheduledExamRepository.count();
    }

    /**
     * Manual editor: update a single scheduled exam's room and/or slot.
     * Runs the same four conflict checks as the auto-scheduler but
     * scoped to the specific row being edited (self-exclusion prevents
     * false positives when the room/slot hasn't actually changed).
     */
    public ScheduledExamDTO updateScheduledExam(Long id, ManualEditRequest req) {
        ScheduledExam exam = scheduledExamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheduled exam not found with id: " + id));

        Room newRoom = roomRepository.findById(req.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + req.getRoomId()));

        ExamSlot newSlot = examSlotRepository.findById(req.getExamSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Exam slot not found with id: " + req.getExamSlotId()));

        Course course = exam.getCourse();

        // 1. Room capacity must not be exceeded.
        if (newRoom.getCapacity() < exam.getStudentCount()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Room " + newRoom.getRoomNumber() + " capacity (" + newRoom.getCapacity() +
                    ") is less than the number of students (" + exam.getStudentCount() + ") for this course.");
        }

        // 2. Room must not already be used in this slot by another exam.
        if (scheduledExamRepository.existsByRoomAndSlotExcluding(newRoom.getId(), newSlot.getId(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Room " + newRoom.getRoomNumber() + " is already booked in the " +
                    newSlot.getExamDate() + " " + newSlot.getStartTime() + "–" + newSlot.getEndTime() + " slot.");
        }

        // 3. No student (same branch+semester group) can have two exams in the same slot.
        if (scheduledExamRepository.existsByGroupAndSlotExcluding(
                course.getBranch(), course.getSemester(), newSlot.getId(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Students in " + course.getBranch() + " Sem " + course.getSemester() +
                    " already have an exam in the " +
                    newSlot.getExamDate() + " " + newSlot.getStartTime() + "–" + newSlot.getEndTime() + " slot.");
        }

        // 4. Faculty must not be supervising another exam in the same slot.
        if (course.getFaculty() != null) {
            if (scheduledExamRepository.existsByFacultyAndSlotExcluding(
                    course.getFaculty().getId(), newSlot.getId(), id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        course.getFaculty().getFullName() +
                        " is already supervising another exam in the " +
                        newSlot.getExamDate() + " " + newSlot.getStartTime() + "–" + newSlot.getEndTime() + " slot.");
            }
        }

        exam.setRoom(newRoom);
        exam.setExamSlot(newSlot);
        exam.setManuallyModified(true);

        ScheduledExam saved = scheduledExamRepository.save(exam);
        return convertToDTO(saved);
    }

    private ScheduledExamDTO convertToDTO(ScheduledExam exam) {
        return ScheduledExamDTO.builder()
                .id(exam.getId())
                .courseId(exam.getCourse().getId())
                .courseCode(exam.getCourse().getCourseCode())
                .courseName(exam.getCourse().getCourseName())
                .branch(exam.getCourse().getBranch())
                .semester(exam.getCourse().getSemester())
                .roomId(exam.getRoom().getId())
                .roomNumber(exam.getRoom().getRoomNumber())
                .facultyName(exam.getCourse().getFaculty() != null ? exam.getCourse().getFaculty().getFullName() : null)
                .examSlotId(exam.getExamSlot().getId())
                .examDate(exam.getExamSlot().getExamDate())
                .startTime(exam.getExamSlot().getStartTime())
                .endTime(exam.getExamSlot().getEndTime())
                .studentCount(exam.getStudentCount())
                .manuallyModified(exam.getManuallyModified())
                .build();
    }
}
