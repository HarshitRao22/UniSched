# UniSched — Smart Exam Scheduling and Timetable Management System

A full-stack B.Tech CSE university project that automates exam timetable
generation and lets administrators manage the schedule manually — built with
Spring Boot, React, and MySQL.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Running Locally](#setup--running-locally)
- [Demo Credentials](#demo-credentials)
- [API Reference](#api-reference)
- [Scheduling Algorithm](#scheduling-algorithm)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)

---

## Overview

UniSched is an admin-facing web application for university examination
departments. It covers the full lifecycle of exam planning:

1. Maintain records of students, faculty, courses, and rooms.
2. Define exam dates and time slots.
3. Generate a conflict-free timetable in one click using a rule-based algorithm.
4. Manually adjust individual exam assignments after generation.
5. Export the final timetable as a PDF.

The project ships with a **demo data seeder** — on first startup against an
empty database the application automatically inserts realistic sample data
(120 students, 10 faculty, 12 courses, 6 rooms, 8 exam slots) so it is ready
to demonstrate immediately.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Backend framework | Spring Boot 3.2 |
| Security | Spring Security + JWT (jjwt 0.12) |
| ORM | Spring Data JPA / Hibernate |
| Database | MySQL 8.0 |
| PDF export | iText 7 |
| API docs | Swagger / OpenAPI 3 |
| Frontend framework | React 18 + Vite |
| Styling | Tailwind CSS |
| State management | Zustand |
| HTTP client | Axios |
| Icons | react-icons |

---

## Features

### Implemented Modules

| Module | Description |
|---|---|
| **Authentication** | Admin login with JWT, protected routes, logout |
| **Student Management** | Add, edit, delete, search students |
| **Faculty Management** | Add, edit, delete faculty members |
| **Course Management** | Add, edit, delete courses; assign faculty |
| **Room Management** | Add, edit, delete rooms with capacity |
| **Exam Slot Management** | Create exam dates and time windows |
| **Timetable Generation** | One-click rule-based scheduling algorithm |
| **Manual Timetable Editor** | Edit any exam's room or slot after generation |
| **Dashboard** | Live counts of all entities and scheduled exams |
| **PDF Export** | Download the complete timetable as a PDF |
| **Demo Data Seeder** | Realistic Indian university sample data on first run |

### Scheduling Rules Enforced

- Every course gets exactly one exam.
- A room cannot host two exams in the same time slot.
- Room capacity must not be exceeded.
- Students from the same branch and semester cannot have two exams at the same time.
- A faculty member cannot supervise two exams in the same time slot.

All four rules are also re-validated when an administrator manually edits an exam.

---

## Project Structure

```
exam-scheduling-system/
├── backend/
│   └── src/main/java/com/examscheduler/
│       ├── config/           # Security config, demo data seeder
│       ├── controller/       # REST controllers (one per module)
│       ├── dto/              # Request / response DTOs
│       ├── entity/           # JPA entities
│       ├── exception/        # Global exception handler, custom exceptions
│       ├── repository/       # Spring Data JPA repositories
│       ├── security/         # JWT token provider, auth filter
│       └── service/          # Business logic, scheduling algorithm, PDF
│
└── frontend/
    └── src/
        ├── components/       # Shared UI kit + EditTimetableModal
        │   └── ui/           # Button, Input, Modal, Badge, etc.
        ├── context/          # Toast notification context
        ├── layouts/          # MainLayout (sidebar + header)
        ├── pages/            # One page per module
        ├── services/         # Axios API wrappers
        └── store/            # Zustand auth store
```

---

## Prerequisites

| Tool | Minimum version | Download |
|---|---|---|
| Java JDK | 21 | https://adoptium.net |
| Maven | 3.9 (or use `./mvnw`) | bundled as wrapper |
| Node.js | 18 | https://nodejs.org |
| MySQL | 8.0 | https://mysql.com |

---

## Setup & Running Locally

### 1. Create the database

```sql
mysql -u root -p

CREATE DATABASE exam_scheduler_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 2. Configure the database connection

Edit `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/exam_scheduler_db?useSSL=false&serverTimezone=UTC
    username: root          # your MySQL username
    password: yourpassword  # your MySQL password
```

### 3. Start the backend

```bash
cd backend
./mvnw spring-boot:run
```

The backend starts on **http://localhost:8080**.  
Hibernate creates all tables automatically on first run.  
The demo data seeder runs once and populates the database.

### 4. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on **http://localhost:5173**.

### 5. Open the app

Navigate to http://localhost:5173 and log in with the credentials below.

---

## Demo Credentials

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin123` |

---

## Demo Data

On first startup against an empty database the seeder inserts:

| Entity | Count | Notes |
|---|---|---|
| Admin | 1 | `admin` / `admin123` |
| Departments | 4 | CSE, IT, ECE, Mechanical |
| Faculty | 10 | 3 CSE, 3 IT, 2 ECE, 2 Mech |
| Students | 120 | 30 per department, same semester per dept |
| Courses | 12 | 3 per department |
| Rooms | 6 | Capacities 40–120 |
| Exam slots | 8 | 4 dates × 2 slots/day, starting 7 days out |

Each branch+semester group has 30 students, which fits any of the six rooms,
so the algorithm produces a complete timetable with zero unscheduled courses
out of the box.

The seeder is guarded with `repository.count() == 0` checks on every table —
restarting the application never creates duplicates.

---

## API Reference

All endpoints are under the base path `/api` and require a Bearer JWT token
in the `Authorization` header, except `/api/auth/login`.

Interactive documentation is available at:
**http://localhost:8080/api/swagger-ui.html**

### Quick reference

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current admin info |
| GET/POST/PUT/DELETE | `/api/students` | Student CRUD |
| GET | `/api/students/search?query=` | Search students |
| GET | `/api/students/count` | Count |
| GET/POST/PUT/DELETE | `/api/faculties` | Faculty CRUD |
| GET/POST/PUT/DELETE | `/api/courses` | Course CRUD |
| GET/POST/PUT/DELETE | `/api/rooms` | Room CRUD |
| GET/POST/DELETE | `/api/exam-slots` | Exam slot management |
| POST | `/api/schedule/generate` | Run scheduling algorithm |
| GET | `/api/schedule` | View current timetable |
| PUT | `/api/schedule/{id}` | Manually edit one exam |
| DELETE | `/api/schedule` | Clear timetable |
| GET | `/api/schedule/count` | Scheduled exam count |
| GET | `/api/schedule/export/pdf` | Download PDF |

---

## Scheduling Algorithm

The algorithm lives entirely in `SchedulingService.java` and is a
**deterministic, rule-based, first-fit greedy** scheduler — no AI, no graph
coloring, no genetic algorithms.

**Steps:**

1. Count students per branch+semester group (cached).
2. Sort courses by descending student count so large classes get first pick of rooms.
3. For each course, walk exam slots in date/time order.
   - Skip a slot if the same student group already has an exam there.
   - Skip a slot if the assigned faculty already has an exam there.
   - For each slot, walk rooms in id order.
     - Skip if room capacity < student count.
     - Skip if room is already taken in this slot.
     - Otherwise assign — done for this course.
4. Any course that found no valid slot is reported as "unscheduled".

Because the algorithm is fully deterministic, running "Generate Timetable"
twice on the same data produces the same result.

---

## Database Schema

Hibernate creates and manages all tables automatically (`ddl-auto: update`).

```
admins
  id, username (unique), password (bcrypt), email (unique),
  full_name, active, created_at, updated_at

students
  id, student_id (unique), full_name, email (unique),
  branch, semester, created_at, updated_at

faculties
  id, faculty_id (unique), full_name, email (unique),
  department, created_at, updated_at

courses
  id, course_code (unique), course_name, credits, branch, semester,
  faculty_id → faculties.id (nullable), created_at, updated_at

rooms
  id, room_number (unique), capacity, building, created_at, updated_at

exam_slots
  id, exam_date, start_time, end_time, created_at, updated_at

scheduled_exams
  id, course_id → courses.id, room_id → rooms.id,
  exam_slot_id → exam_slots.id, student_count,
  manually_modified (default false), created_at
```

---

## Troubleshooting

**Backend fails to start — "Access denied for user 'root'"**  
Update `username` and `password` in `application.yml` to match your MySQL installation.

**Port 8080 already in use**  
```bash
# macOS / Linux
lsof -i :8080 | grep LISTEN
kill -9 <PID>
```
Or change `server.port` in `application.yml`.

**npm install fails**  
Ensure Node.js ≥ 18 is installed: `node -v`. Delete `node_modules` and `package-lock.json` then retry.

**"Failed to load dashboard" after login**  
The JWT token may be stale from a previous session. Clear `localStorage` in the browser dev tools and log in again.

**Timetable shows "unscheduled" courses**  
Add more exam slots or rooms with sufficient capacity, then regenerate.

**PDF download is blank**  
Generate a timetable first, then export.

---

*B.Tech CSE Final Year Project — Smart Exam Scheduling and Timetable Management System*
