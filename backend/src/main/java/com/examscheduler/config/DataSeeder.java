package com.examscheduler.config;

import com.examscheduler.entity.*;
import com.examscheduler.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Demo Data Seeder.
 *
 * Populates the database with realistic sample data the FIRST time the
 * application starts against an empty database, so the project is ready
 * to demo immediately without manual data entry.
 *
 * Each table is seeded independently and only if it is currently empty,
 * so re-running the application (or running it against a database that
 * already has data) never creates duplicates.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ExamSlotRepository examSlotRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String[] DEPARTMENTS = {
            "Computer Science Engineering",
            "Information Technology",
            "Electronics & Communication",
            "Mechanical Engineering"
    };

    // Short codes used to build student/faculty/course IDs per department.
    private static final String[] DEPT_CODES = {"CSE", "IT", "ECE", "MECH"};

    // Each department's students (and therefore its courses) are concentrated
    // into ONE semester, so every branch+semester group lands in a realistic
    // 25-40 student range instead of being thinly spread across many semesters.
    private static final int[] DEPARTMENT_SEMESTER = {3, 5, 3, 5};

    private static final String[] FIRST_NAMES = {
            "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan",
            "Krishna", "Ishaan", "Ananya", "Diya", "Saanvi", "Aadhya", "Kiara", "Myra",
            "Anika", "Riya", "Ira", "Navya", "Rohan", "Karan", "Nikhil", "Aman",
            "Priya", "Neha", "Pooja", "Sneha", "Rahul", "Varun", "Siddharth", "Tanvi",
            "Meera", "Kavya", "Yash", "Dev", "Arnav", "Tara", "Aryan", "Sara"
    };

    private static final String[] LAST_NAMES = {
            "Sharma", "Verma", "Gupta", "Mehta", "Patel", "Reddy", "Nair", "Iyer",
            "Singh", "Kumar", "Joshi", "Rao", "Desai", "Kapoor", "Malhotra", "Chopra"
    };

    @Override
    @Transactional
    public void run(String... args) {
        seedAdmin();
        List<Faculty> faculties = seedFaculty();
        seedStudents();
        seedRooms();
        seedExamSlots();
        seedCourses(faculties);
    }

    private void seedAdmin() {
        if (adminRepository.count() > 0) {
            return;
        }
        Admin admin = Admin.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .email("admin@exam.com")
                .fullName("System Administrator")
                .active(true)
                .build();
        adminRepository.save(admin);
    }

    private List<Faculty> seedFaculty() {
        if (facultyRepository.count() > 0) {
            return facultyRepository.findAll();
        }

        List<Faculty> faculties = new ArrayList<>();
        int nameIndex = 0;

        for (int deptIndex = 0; deptIndex < DEPARTMENTS.length; deptIndex++) {
            // ~2-3 faculty per department, 10 total across 4 departments.
            int countForDept = deptIndex < 2 ? 3 : 2;
            for (int i = 1; i <= countForDept; i++) {
                String firstName = FIRST_NAMES[nameIndex % FIRST_NAMES.length];
                String lastName = LAST_NAMES[nameIndex % LAST_NAMES.length];
                nameIndex++;

                String facultyId = String.format("FAC-%s-%02d", DEPT_CODES[deptIndex], i);
                String email = ("dr." + firstName + "." + lastName + "@university.edu").toLowerCase();

                Faculty faculty = Faculty.builder()
                        .facultyId(facultyId)
                        .fullName("Dr. " + firstName + " " + lastName)
                        .email(email)
                        .department(DEPARTMENTS[deptIndex])
                        .build();
                faculties.add(faculty);
            }
        }

        return facultyRepository.saveAll(faculties);
    }

    private void seedStudents() {
        if (studentRepository.count() > 0) {
            return;
        }

        List<Student> students = new ArrayList<>();
        int studentNumber = 1;
        int nameIndex = 0;

        // 30 students per department (4 x 30 = 120 total), all concentrated
        // into that department's designated semester - this is what gives
        // each branch+semester group a realistic size (~30 students) when
        // the timetable is generated.
        for (int deptIndex = 0; deptIndex < DEPARTMENTS.length; deptIndex++) {
            int semester = DEPARTMENT_SEMESTER[deptIndex];
            for (int i = 0; i < 30; i++) {
                String firstName = FIRST_NAMES[nameIndex % FIRST_NAMES.length];
                String lastName = LAST_NAMES[(nameIndex + 3) % LAST_NAMES.length];
                nameIndex++;

                String studentId = String.format("STU-%s-%03d", DEPT_CODES[deptIndex], studentNumber);
                String email = (firstName + "." + lastName + studentNumber + "@student.university.edu").toLowerCase();

                Student student = Student.builder()
                        .studentId(studentId)
                        .fullName(firstName + " " + lastName)
                        .email(email)
                        .branch(DEPARTMENTS[deptIndex])
                        .semester(semester)
                        .build();
                students.add(student);
                studentNumber++;
            }
        }

        studentRepository.saveAll(students);
    }

    private List<Room> seedRooms() {
        if (roomRepository.count() > 0) {
            return roomRepository.findAll();
        }

        String[][] roomData = {
                {"101", "40", "Main Block"},
                {"102", "60", "Main Block"},
                {"103", "80", "Main Block"},
                {"201", "100", "Annex Block"},
                {"202", "120", "Annex Block"},
                {"203", "90", "Annex Block"}
        };

        List<Room> rooms = new ArrayList<>();
        for (String[] data : roomData) {
            rooms.add(Room.builder()
                    .roomNumber("Room " + data[0])
                    .capacity(Integer.parseInt(data[1]))
                    .building(data[2])
                    .build());
        }

        return roomRepository.saveAll(rooms);
    }

    private List<ExamSlot> seedExamSlots() {
        if (examSlotRepository.count() > 0) {
            return examSlotRepository.findAll();
        }

        List<ExamSlot> slots = new ArrayList<>();
        LocalTime[][] times = {
                {LocalTime.of(9, 0), LocalTime.of(11, 0)},
                {LocalTime.of(13, 0), LocalTime.of(15, 0)}
        };

        // 4 exam dates, 2 slots per day = 8 slots, starting one week from now.
        LocalDate startDate = LocalDate.now().plusDays(7);
        for (int day = 0; day < 4; day++) {
            LocalDate examDate = startDate.plusDays(day);
            for (LocalTime[] time : times) {
                slots.add(ExamSlot.builder()
                        .examDate(examDate)
                        .startTime(time[0])
                        .endTime(time[1])
                        .build());
            }
        }

        return examSlotRepository.saveAll(slots);
    }

    private void seedCourses(List<Faculty> faculties) {
        if (courseRepository.count() > 0) {
            return;
        }

        // courseName, branchIndex (matches DEPARTMENTS/DEPT_CODES), credits
        // Semester is no longer set per-course here - it always matches the
        // department's single designated semester (DEPARTMENT_SEMESTER), so
        // every course's student group is the full 30-student department group.
        Object[][] courseData = {
                {"Data Structures & Algorithms", 0, 4},
                {"Database Management Systems", 0, 4},
                {"Operating Systems", 0, 3},
                {"Web Technologies", 1, 3},
                {"Cloud Computing", 1, 3},
                {"Information Security", 1, 4},
                {"Digital Electronics", 2, 4},
                {"Signals & Systems", 2, 3},
                {"Microprocessors", 2, 4},
                {"Thermodynamics", 3, 4},
                {"Fluid Mechanics", 3, 3},
                {"Machine Design", 3, 4}
        };

        List<Course> courses = new ArrayList<>();
        int courseNumber = 1;
        int[] facultyCursorPerDept = new int[DEPARTMENTS.length];

        for (Object[] data : courseData) {
            String name = (String) data[0];
            int deptIndex = (Integer) data[1];
            int credits = (Integer) data[2];
            int semester = DEPARTMENT_SEMESTER[deptIndex];

            String courseCode = String.format("%s-%03d", DEPT_CODES[deptIndex], courseNumber);
            courseNumber++;

            // Round-robin through faculty in the same department, so courses
            // don't all pile onto a single faculty member.
            List<Faculty> deptFaculty = faculties.stream()
                    .filter(f -> f.getDepartment().equals(DEPARTMENTS[deptIndex]))
                    .toList();
            Faculty assignedFaculty = null;
            if (!deptFaculty.isEmpty()) {
                int cursor = facultyCursorPerDept[deptIndex] % deptFaculty.size();
                assignedFaculty = deptFaculty.get(cursor);
                facultyCursorPerDept[deptIndex]++;
            }

            Course course = Course.builder()
                    .courseCode(courseCode)
                    .courseName(name)
                    .credits(credits)
                    .branch(DEPARTMENTS[deptIndex])
                    .semester(semester)
                    .faculty(assignedFaculty)
                    .build();
            courses.add(course);
        }

        courseRepository.saveAll(courses);
    }
}
