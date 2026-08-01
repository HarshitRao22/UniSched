# TESTING.md — Smart Exam Scheduling and Timetable Management System

This is a manual, step-by-step checklist for demonstrating and verifying
the project locally. Run through it top to bottom before any demo.

## 0. Setup

```bash
cd backend
./mvnw spring-boot:run
```
```bash
cd frontend
npm install
npm run dev
```

On first startup against an **empty database**, the `DataSeeder` automatically
inserts demo data:
- 1 admin account (`admin` / `admin123`)
- 4 departments (Computer Science Engineering, Information Technology,
  Electronics & Communication, Mechanical Engineering)
- 10 faculty members
- 40 students (spread across the 4 departments, semesters 3–8)
- 12 courses (3 per department, each linked to a faculty member)
- 6 rooms (capacities 40–120)
- 8 exam slots (4 dates × 2 time slots/day, starting 7 days from today)

If any of these tables already contain data, the seeder skips that table —
it never inserts duplicates. To re-seed from scratch, drop the database
(or the relevant tables) and restart the backend.

## 1. Authentication

- [ ] Open the app — should redirect to `/login`
- [ ] Log in with `admin` / `admin123` — should redirect to `/dashboard`
- [ ] Try an incorrect password — should show a clear error, not a blank/broken page
- [ ] Refresh the page while logged in — should stay logged in (token persisted)
- [ ] Click Logout — should return to `/login` and block access to `/dashboard` if you hit Back

## 2. Dashboard

- [ ] Dashboard loads without "Failed to load dashboard"
- [ ] Total Students shows **40** (on fresh seed)
- [ ] Total Faculty shows **10**
- [ ] Total Courses shows **12**
- [ ] Total Rooms shows **6**
- [ ] Total Scheduled Exams shows **0** until you generate a timetable (see section 6)

## 3. Student Management

- [ ] Students page loads and lists the 40 seeded students
- [ ] Search by name/ID/email returns correct filtered results
- [ ] Add a new student — appears in the list immediately
- [ ] Edit a student — changes are saved and reflected in the table
- [ ] Try creating a duplicate Student ID or email — should show a clear duplicate error, not a crash
- [ ] Delete a student — removed from the list, confirmation prompt shown first
- [ ] Dashboard "Total Students" count updates after add/delete

## 4. Faculty Management

- [ ] Faculty page loads and lists the 10 seeded faculty members
- [ ] Add a new faculty member
- [ ] Edit a faculty member
- [ ] Delete a faculty member **not** assigned to any course
- [ ] Dashboard "Total Faculty" count updates after add/delete

## 5. Course Management

- [ ] Courses page loads and lists the 12 seeded courses, each showing its assigned faculty
- [ ] Add a new course and assign a faculty member from the dropdown
- [ ] Edit a course (change credits, branch, semester, or faculty)
- [ ] Delete a course
- [ ] Dashboard "Total Courses" count updates after add/delete

## 6. Room Management

- [ ] Rooms page loads and lists the 6 seeded rooms
- [ ] Add a new room
- [ ] Edit a room's capacity
- [ ] Delete a room
- [ ] Dashboard "Total Rooms" count updates after add/delete

## 7. Exam Slots

- [ ] Exam Slots page loads and lists the 8 seeded slots
- [ ] Add a new exam slot (date + start/end time)
- [ ] Delete an exam slot

## 8. Timetable Generation

- [ ] Go to the Timetable page, click **Generate Timetable**
- [ ] Summary cards show: Total Courses = 12, Scheduled = (up to 12), Unscheduled = remainder (if any)
- [ ] No room is double-booked in the same slot (spot-check a few rows)
- [ ] No two courses from the same branch+semester share a slot (this is the "no student double-booked" rule)
- [ ] No two courses with the same faculty share a slot (faculty conflict rule)
- [ ] Dashboard "Total Scheduled Exams" count updates to match the scheduled count
- [ ] Re-click Generate — timetable regenerates cleanly (old rows cleared first, no duplicates pile up)
- [ ] Click Clear — timetable empties, dashboard count returns to 0

## 9. Reports / Filtering

- [ ] On the Timetable page, filter by date — only matching rows shown
- [ ] Filter by course name/code — only matching rows shown
- [ ] Filter by room — only matching rows shown
- [ ] Filter by branch/department — only matching rows shown
- [ ] Combine multiple filters — results narrow correctly
- [ ] Clear filters — full list returns

## 10. PDF Export

- [ ] With a timetable generated, click **Export PDF**
- [ ] A file named `exam-timetable.pdf` downloads
- [ ] Opening the PDF shows a readable table: date, time, course, branch/semester, room, student count
- [ ] Export with no timetable generated — should fail gracefully with a clear message, not crash the page

## 11. Navigation & General UI

- [ ] Every sidebar link (Dashboard, Students, Faculty, Courses, Rooms, Exam Slots, Timetable) loads its page without console errors
- [ ] Browser back/forward between pages doesn't break the layout
- [ ] All error messages shown to the user are readable sentences, not raw stack traces or "[object Object]"
- [ ] All success actions (add/edit/delete/generate/export) give some visible confirmation (updated list, closed modal, downloaded file)

## 12. Logout / Session

- [ ] Logout works from any page
- [ ] After logout, manually navigating to `/dashboard` or `/students` redirects back to `/login`
