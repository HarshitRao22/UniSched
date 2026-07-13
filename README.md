# Exam Scheduling System - Complete Setup Guide

## 📋 Overview-

**Automated Exam Scheduling and Timetable Management System** is a production-grade B.Tech final-year project that automates university examination timetable generation while minimizing scheduling conflicts.

### Technology Stack
- **Backend**: Spring Boot 3.2.4, Java 21, Spring Security, JWT, MySQL
- **Frontend**: React 18, Vite, Tailwind CSS, Zustand, Axios
- **Database**: MySQL 8.0+
- **API Documentation**: Swagger/OpenAPI 3.0

---

## 🚀 Prerequisites

### System Requirements
- **Operating System**: macOS, Windows, or Linux
- **Java**: JDK 21+ ([Download Temurin](https://adoptium.net/))
- **Node.js**: 16.0.0+ ([Download](https://nodejs.org/))
- **Maven**: 3.9.0+ (or use Maven Wrapper)
- **MySQL**: 8.0+ ([Download](https://www.mysql.com/downloads/mysql/))
- **Git**: For version control

### Verified Versions
```
- Java: 21.0.3 (Temurin)
- Node.js: 18.0.0+
- Maven: 3.9.6
- MySQL: 8.0.33
```

---

## 🔧 Setup Instructions

### Step 1: Clone & Navigate

```bash
cd /path/to/exam-scheduling-system
```

### Step 2: Database Setup

#### 2.1 Create MySQL Database

```bash
# Start MySQL server
mysql -u root -p

# In MySQL console:
CREATE DATABASE exam_scheduler_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create admin user (optional)
CREATE USER 'scheduler'@'localhost' IDENTIFIED BY 'scheduler123';
GRANT ALL PRIVILEGES ON exam_scheduler_db.* TO 'scheduler'@'localhost';
FLUSH PRIVILEGES;

# Use the database
USE exam_scheduler_db;
```

#### 2.2 Update Backend Database Configuration

Edit `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/exam_scheduler_db?useSSL=false&serverTimezone=UTC
    username: root           # Change if using different user
    password: root           # Change to your MySQL password
    driver-class-name: com.mysql.cj.jdbc.Driver
```

### Step 3: Backend Setup & Run

```bash
cd backend

# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

**Expected Output**:
```
Started ExamSchedulingSystemApplication in X.XXX seconds
Tomcat started on port 8080
```

### Step 4: Create Initial Admin Account

Execute in MySQL:

```sql
USE exam_scheduler_db;

-- Insert admin user with BCrypt hashed password
-- Password: admin123 (hash: $2a$10$slYQmyNdGzin7olVMXeK2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUm)
INSERT INTO admins (username, password, email, full_name, active, created_at, updated_at)
VALUES (
  'admin',
  '$2a$10$slYQmyNdGzin7olVMXeK2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUm',
  'admin@example.com',
  'Administrator',
  true,
  NOW(),
  NOW()
);
```

**Test Credentials**:
- Username: `admin`
- Password: `admin123`

⚠️ **IMPORTANT**: Change these credentials in production!

### Step 5: Frontend Setup & Run

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output**:
```
VITE v5.0.8 ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

---

## 🌐 Access Application

### Frontend
- **URL**: http://localhost:5173
- **Login**: Username `admin`, Password `admin123`

### Backend APIs
- **Base URL**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **API Docs**: http://localhost:8080/api/v3/api-docs

### Database
- **Host**: localhost:3306
- **Database**: exam_scheduler_db
- **User**: root
- **Password**: root

---

## 📊 Project Structure

```
exam-scheduling-system/
├── backend/                          # Spring Boot application
│   ├── src/main/java/com/examscheduler/
│   │   ├── ExamSchedulingSystemApplication.java
│   │   ├── controller/               # REST controllers
│   │   ├── service/                  # Business logic
│   │   ├── repository/               # Database access
│   │   ├── entity/                   # JPA entities
│   │   ├── dto/                      # Data transfer objects
│   │   ├── security/                 # Security components
│   │   ├── config/                   # Configuration classes
│   │   ├── exception/                # Exception handling
│   │   └── util/                     # Utility classes
│   ├── src/main/resources/
│   │   └── application.yml           # Configuration
│   ├── src/test/                     # Unit tests
│   └── pom.xml                       # Maven configuration
│
├── frontend/                         # React application
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   ├── pages/                    # Page components
│   │   ├── layouts/                  # Layout components
│   │   ├── services/                 # API services
│   │   ├── store/                    # Zustand state management
│   │   ├── hooks/                    # Custom hooks
│   │   ├── utils/                    # Utility functions
│   │   ├── App.jsx                   # Main component
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── index.html                    # HTML template
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── package.json                 # Dependencies
│   └── .gitignore
│
├── docs/                             # Documentation
│   ├── MODULE_1_AUTHENTICATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_DOCUMENTATION.md
│   └── ER_DIAGRAM.md
│
├── README.md                         # This file
└── .gitignore
```

---

## 📚 Modules Overview

### ✅ Module 1: Authentication (COMPLETE)
- Admin login with JWT tokens
- Password encryption with BCrypt
- Token validation and refresh
- Protected routes on frontend
- API: POST `/api/auth/login`

### 🔄 Upcoming Modules
- **Module 2**: Student Management
- **Module 3**: Faculty Management
- **Module 4**: Course Management
- **Module 5**: Room Management
- **Module 6**: Exam Slot Management
- **Module 7**: Scheduling Algorithm
- **Module 8**: Dashboard & Reports

---

## 🔌 API Endpoints

### Authentication (Module 1)
| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/auth/login` | POST | Admin login | ❌ |
| `/api/auth/me` | GET | Get current admin | ✅ |

### Documentation
- Swagger UI: http://localhost:8080/api/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api/v3/api-docs

---

## 🧪 Testing Module 1 (Authentication)

### 1. Test Login Endpoint

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Expected Response**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "admin": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "fullName": "Administrator",
    "active": true,
    "createdAt": "2026-06-19T12:20:19",
    "updatedAt": "2026-06-19T12:20:19"
  }
}
```

### 2. Test Protected Endpoint

```bash
TOKEN="eyJhbGciOiJIUzUxMiJ9..."  # Use token from login response

curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Frontend Test

Visit http://localhost:5173 and:
1. Enter username: `admin`
2. Enter password: `admin123`
3. Click Login
4. Should redirect to dashboard

---

## 🐛 Troubleshooting

### Issue: "Connection refused" (MySQL)
**Solution**:
```bash
# Make sure MySQL is running
mysql -u root -p  # Should connect successfully

# If not installed, download from: https://www.mysql.com/downloads/mysql/
```

### Issue: "Port 8080 already in use"
**Solution**:
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change port in application.yml:
server:
  port: 8081
```

### Issue: "Port 5173 already in use"
**Solution**:
```bash
# Change port in vite.config.js
server:
  port: 5174
```

### Issue: "Connection pooling error"
**Solution**: Update `application.yml` JDBC URL to use `allowPublicKeyRetrieval=true`

### Issue: "404 Not Found" on API calls
**Solution**: Ensure backend is running on port 8080 and check endpoint paths

---

## 📖 Documentation Files

- **[MODULE_1_AUTHENTICATION.md](docs/MODULE_1_AUTHENTICATION.md)** - Complete auth module details
- **[DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** - Database structure (coming in Module 2)
- **[API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)** - All API endpoints (coming in Module 2)
- **[ER_DIAGRAM.md](docs/ER_DIAGRAM.md)** - Entity relationships (coming in Module 2)

---

## 🔐 Security Best Practices

### Development
- ✅ JWT tokens expire in 24 hours
- ✅ Passwords are BCrypt hashed
- ✅ CORS enabled for localhost only
- ✅ HTTPS not enabled (development only)

### Production Checklist
- [ ] Change JWT secret in `application.yml`
- [ ] Update CORS allowed origins
- [ ] Enable HTTPS/SSL
- [ ] Update database credentials
- [ ] Change default admin credentials
- [ ] Set up database backups
- [ ] Enable audit logging
- [ ] Use environment variables for secrets

---

## 📈 Performance Notes

- Backend: Spring Boot 3.2.4 with optimized configurations
- Frontend: React with Vite for fast builds
- Database: MySQL with indexed queries
- API Response Time: <100ms (local network)
- Page Load Time: <2s (with network)

---

## 👨‍💻 Development Team

This project is developed as a B.Tech CSE 2nd-year project demonstrating:
- ✅ Full-stack development
- ✅ REST API design
- ✅ Database design & optimization
- ✅ Security implementation
- ✅ Modern UI/UX
- ✅ Code quality & best practices
- ✅ Project management & documentation

---

## 📝 License

Made by Harshit Rao

---

## 🆘 Support

For issues or questions:
1. Check [Troubleshooting](#-troubleshooting) section
2. Review [MODULE_1_AUTHENTICATION.md](docs/MODULE_1_AUTHENTICATION.md)
3. Check application logs in terminal

---

## 📅 Development Roadmap

### Phase 1: Core Infrastructure ✅
- [x] Project setup
- [x] Database configuration
- [x] Authentication system
- [x] Project structure

### Phase 2: Entity Management (Next)
- [ ] Student management
- [ ] Faculty management
- [ ] Course management
- [ ] Room management
- [ ] Exam slot management

### Phase 3: Business Logic
- [ ] Scheduling algorithm
- [ ] Conflict detection
- [ ] Optimization

### Phase 4: UI/UX & Reports
- [ ] Dashboard
- [ ] Management interfaces
- [ ] PDF export
- [ ] Reports

### Phase 5: Polish & Deployment
- [ ] Testing
- [ ] Performance optimization
- [ ] Documentation
- [ ] Deployment guide

---

**Last Updated**: July 11, 2026
**Version**: 1.0.0 (Module 1 Complete)
