# AI-Based Student Grievance Management System

A full-stack web application for managing student grievances in academic institutions. It combines role-based access control, file evidence upload, and an AI microservice that automatically analyses each grievance for category prediction, fake-complaint detection, duplicate detection, and risk assessment.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Database Setup](#1-database-setup)
  - [2. Backend (Spring Boot)](#2-backend-spring-boot)
  - [3. AI Microservice](#3-ai-microservice)
  - [4. Frontend (Angular)](#4-frontend-angular)
- [Configuration Reference](#configuration-reference)
- [User Roles & Access](#user-roles--access)
- [First-Time Setup: Creating the Super Admin](#first-time-setup-creating-the-super-admin)
- [Registration Flow](#registration-flow)
- [API Endpoints](#api-endpoints)
- [AI Analysis Pipeline](#ai-analysis-pipeline)
- [File Upload](#file-upload)
- [Security Model](#security-model)
- [Common Issues & Troubleshooting](#common-issues--troubleshooting)

---

## Architecture Overview

```
┌─────────────────────────┐      HTTP / REST      ┌───────────────────────────┐
│  Angular 17 Frontend    │ ◄──────────────────── │  Spring Boot 3.2 Backend  │
│  localhost:2020         │ ──────────────────────►│  localhost:2718            │
└─────────────────────────┘   JWT in headers      └───────────┬───────────────┘
                                                               │ REST (async)
                                                               ▼
                                                  ┌────────────────────────────┐
                                                  │  AI Python Microservice    │
                                                  │  localhost:8000            │
                                                  └────────────────────────────┘
                                                               │
                                                  ┌────────────▼───────────────┐
                                                  │  MySQL 8 Database          │
                                                  │  grievance_db              │
                                                  └────────────────────────────┘
```

- **Frontend** — Angular 17 SPA with role-based routing and lazy-loaded components.
- **Backend** — Spring Boot 3.2 REST API handling auth, grievance lifecycle, evidence storage, and AI orchestration.
- **AI Microservice** — A separate Python server (not included in this repo) that accepts grievance text and returns analysis results. The backend has a graceful fallback if it is unreachable.
- **Database** — MySQL 8. Tables are auto-managed by Hibernate (`ddl-auto=update`); no migrations needed.

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend Framework | Angular | 17 |
| Frontend Charts | Chart.js + ng2-charts | 4.4 / 5.0 |
| Backend Framework | Spring Boot | 3.2.0 |
| Language | Java | 17 |
| ORM | Spring Data JPA / Hibernate | — |
| Security | Spring Security + JWT (JJWT) | 0.11.5 |
| Database | MySQL | 8 |
| Build Tool (Backend) | Maven | 3.x |
| Build Tool (Frontend) | Angular CLI | 17 |

---

## Features

### Student
- Submit grievances with title, description, category, type, and optional file attachments
- Track all submitted grievances and their live status
- View AI-detected common/duplicate grievances
- Edit pending grievances
- View AI analysis and risk assessment results

### Faculty
- View grievances assigned to them
- Review and update grievance status (IN_PROGRESS, RESOLVED, REJECTED, etc.)
- Validate incidents reported against grievances

### College Admin
- Full dashboard with college-level statistics
- Manage departments, students, and faculty within their college
- Assign grievances to faculty members (manual or auto-assign)
- Manage faculty resolver designations
- Trigger manual AI re-analysis

### Super Admin
- System-wide dashboard and reports
- Create, update, and delete colleges
- View all students and faculty across all colleges
- Generate scoped registration tokens for onboarding new users
- View system-wide grievance analytics

### AI Features (via the external microservice)
- **Category prediction** with confidence score
- **Priority prediction** with confidence score
- **Fake-complaint detection** with confidence score
- **Duplicate detection** with similarity score (+ local word-overlap fallback)
- **Anomaly detection** with anomaly score
- **Risk assessment** — automatically derived from AI flags (CRITICAL / HIGH / MEDIUM / LOW)

---

## Project Structure

```
AI-Based-Student-Grievance-Management-System/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/grievance/management/
│       │   ├── GrievanceManagementApplication.java
│       │   ├── config/          # CORS, JWT, RestTemplate, Security, Web
│       │   ├── controller/      # 9 REST controllers
│       │   ├── dto/             # 10 request/response DTOs
│       │   ├── entity/          # 14 JPA entities
│       │   ├── enums/           # 7 enums (Role, Status, Priority, etc.)
│       │   ├── exception/       # GlobalExceptionHandler + custom exceptions
│       │   ├── repository/      # 14 Spring Data JPA repositories
│       │   ├── security/        # JwtService, JwtAuthFilter, UserDetailsService
│       │   ├── service/         # 13 business-logic services
│       │   └── util/            # FileStorageUtil, TokenGenerator
│       └── resources/
│           └── application.properties
└── frontend/
    ├── package.json
    ├── angular.json
    ├── tsconfig.json
    └── src/app/
        ├── auth/                # Login, student/faculty/admin registration
        ├── student/             # 6 student views
        ├── faculty/             # 4 faculty views
        ├── college-admin/       # 6 college admin views
        ├── super-admin/         # 6 super admin views
        ├── core/
        │   ├── guards/          # authGuard, roleGuard
        │   ├── interceptors/    # authInterceptor (JWT header injection)
        │   ├── models/          # TypeScript interfaces
        │   └── services/        # 9 HTTP services
        └── shared/components/   # Reusable UI components
```

---

## Prerequisites

Make sure you have the following installed before you start:

| Tool | Minimum Version | Check Command |
|---|---|---|
| Java JDK | 17 | `java -version` |
| Maven | 3.6+ | `mvn -version` |
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| MySQL | 8.0+ | `mysql --version` |
| Angular CLI | 17 | `ng version` |

Install Angular CLI if not present:
```bash
npm install -g @angular/cli@17
```

---

## Getting Started

### 1. Database Setup

Start your MySQL server and create the database:

```sql
mysql -u root -p

-- In the MySQL shell:
CREATE DATABASE grievance_db;
EXIT;
```

Hibernate will automatically create all tables on first boot. No schema scripts are needed.

---

### 2. Backend (Spring Boot)

**Step 1 — Configure the application**

Open `backend/src/main/resources/application.properties` and update the following values:

```properties
# Change to your MySQL credentials
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Replace with a real Base64-encoded 256-bit secret
# Generate one with: openssl rand -base64 32
jwt.secret=YOUR_BASE64_SECRET_KEY
```

> ⚠️ **Important:** The default `jwt.secret` in the file is a placeholder string and will cause startup errors or weak security. Always replace it before running.

**Step 2 — Build and run**

```bash
cd backend

# Run directly with Maven (recommended for development)
mvn spring-boot:run

# Or build a JAR and run it
mvn clean package
java -jar target/grievance-management-1.0.0.jar
```

The backend will be available at **http://localhost:2718**

On first startup, Hibernate creates all required tables in `grievance_db` automatically.

**Generate a JWT secret (one-time)**

On Linux/Mac:
```bash
openssl rand -base64 32
```

On Windows (PowerShell):
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Max 256) }))
```

Paste the output as the value of `jwt.secret` in `application.properties`.

---

### 3. AI Microservice

The AI server is a **separate Python service** (not included in this repository). The Spring Boot backend calls `POST http://localhost:8000/analyze` asynchronously after each grievance submission.

**Expected request body:**
```json
{
  "title": "string",
  "description": "string",
  "grievance_id": "string"
}
```

**Expected response body:**
```json
{
  "category_confidence": 0.92,
  "priority_confidence": 0.85,
  "is_fake": false,
  "fake_confidence": 0.03,
  "is_duplicate": false,
  "duplicate_of_id": null,
  "similarity_score": null,
  "is_anomaly": false,
  "anomaly_score": 0.1,
  "notes": "string"
}
```

> **No AI server?** The backend has a graceful fallback — if the AI server is unreachable, the grievance is still saved successfully and the analysis record shows `"AI analysis pending"`. The local duplicate-detection fallback (word-overlap cosine similarity) will still run.

---

### 4. Frontend (Angular)

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be available at **http://localhost:2020**

It proxies all `/api/**` calls to `http://localhost:2718` (configured via the environment file at `src/environments/environment.ts`). Make sure the backend is running first.

**Build for production:**
```bash
npm run build
```
The compiled output will be in `frontend/dist/`.

---

## Configuration Reference

All backend configuration lives in `backend/src/main/resources/application.properties`:

| Property | Default | Description |
|---|---|---|
| `server.port` | `2718` | Backend server port |
| `spring.datasource.url` | `jdbc:mysql://localhost:3306/grievance_db` | MySQL connection URL |
| `spring.datasource.username` | `root` | MySQL username |
| `spring.datasource.password` | `Neyash` | MySQL password — **change this** |
| `spring.jpa.hibernate.ddl-auto` | `update` | Auto-manages schema from entities |
| `jwt.secret` | placeholder | Base64 256-bit secret — **must be replaced** |
| `jwt.expiration` | `86400000` | JWT TTL in ms (24 hours) |
| `spring.servlet.multipart.max-file-size` | `10MB` | Max size per uploaded file |
| `spring.servlet.multipart.max-request-size` | `50MB` | Max total upload request size |
| `file.upload-dir` | `uploads` | Directory for evidence files (relative to working dir) |
| `ai.server.url` | `http://localhost:8000` | AI microservice base URL |
| `spring.task.execution.pool.core-size` | `5` | Async thread pool — core threads |
| `spring.task.execution.pool.max-size` | `10` | Async thread pool — max threads |

---

## User Roles & Access

| Role | Description | Default Route |
|---|---|---|
| `STUDENT` | Submits and tracks their own grievances | `/student/dashboard` |
| `FACULTY` | Reviews grievances assigned to them, validates incidents | `/faculty/dashboard` |
| `COLLEGE_ADMIN` | Manages their college — faculty, students, grievances, departments | `/college-admin/dashboard` |
| `SUPER_ADMIN` | Full system access — colleges, reports, token generation | `/super-admin/dashboard` |

---

## First-Time Setup: Creating the Super Admin

There is no seeded data. The Super Admin account must be created directly in the database on first setup.

**Step 1 — Hash a password**

Use BCrypt to hash a password. You can use an online tool like [bcrypt-generator.com](https://bcrypt-generator.com/) with 10 rounds, or run this Java snippet:

```java
System.out.println(new BCryptPasswordEncoder().encode("yourPassword"));
```

**Step 2 — Insert the User record**

```sql
INSERT INTO users (email, password, first_name, last_name, role, enabled)
VALUES ('superadmin@system.com', '$2a$10$YOUR_BCRYPT_HASH', 'Super', 'Admin', 'SUPER_ADMIN', true);
```

**Step 3 — Insert the SuperAdmin profile record**

```sql
INSERT INTO super_admins (user_id)
VALUES (LAST_INSERT_ID());
```

**Step 4 — Log in**

Use these credentials at **http://localhost:2020/auth/login**.

---

## Registration Flow

New users cannot self-register freely. All registrations require a **Registration Token** issued by the Super Admin. This prevents unauthorized access.

1. Log in as Super Admin → navigate to **Token Generator** (`/super-admin/token-generator`)
2. Generate a token scoped to the desired role (e.g., `STUDENT`) and college
3. Share the token with the user
4. The user visits the appropriate registration page:
   - Students → `/auth/register/student`
   - Faculty → `/auth/register/faculty`
   - College Admins → `/auth/register/college-admin`
5. They enter their details and the registration token
6. On success, they receive a JWT and are redirected to their dashboard

Tokens are single-use and expire after **7 days**.

---

## API Endpoints

All endpoints are prefixed with `/api`. Secured endpoints require `Authorization: Bearer <jwt>`.

### Auth — Public
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Login, returns JWT |
| `POST` | `/api/auth/register/student` | Register a student (requires token) |
| `POST` | `/api/auth/register/faculty` | Register faculty (requires token) |
| `POST` | `/api/auth/register/college-admin` | Register college admin (requires token) |

### Tokens — Public + Super Admin
| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/api/tokens/validate` | Public | Validate a registration token |
| `POST` | `/api/tokens/generate` | SUPER_ADMIN | Generate a new registration token |
| `GET` | `/api/tokens` | SUPER_ADMIN | List all tokens |

### Grievances
| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/api/grievances` | STUDENT | Submit a new grievance (supports file upload) |
| `GET` | `/api/grievances` | COLLEGE_ADMIN, SUPER_ADMIN | Get all grievances |
| `GET` | `/api/grievances/my` | STUDENT | Get current student's grievances |
| `GET` | `/api/grievances/assigned` | FACULTY | Get grievances assigned to current faculty |
| `GET` | `/api/grievances/common` | STUDENT | Get common/duplicate grievances |
| `GET` | `/api/grievances/{id}` | Any authenticated | Get a grievance by ID |
| `PUT` | `/api/grievances/{id}` | STUDENT | Update a grievance |
| `PATCH` | `/api/grievances/{id}/status` | FACULTY, COLLEGE_ADMIN | Update status + optional resolution note |

### AI Analysis
| Method | Endpoint | Role | Description |
|---|---|---|---|
| `GET` | `/api/ai/analysis/{grievanceId}` | Any authenticated | Get stored AI analysis |
| `POST` | `/api/ai/analyze/{grievanceId}` | COLLEGE_ADMIN, SUPER_ADMIN | Manually trigger AI analysis |
| `GET` | `/api/ai/risk/{grievanceId}` | Any authenticated | Get risk assessment |

### College Admin
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/college-admin/dashboard` | Dashboard statistics |
| `GET/POST` | `/api/college-admin/departments` | List / create departments |
| `GET` | `/api/college-admin/faculty` | List faculty |
| `GET` | `/api/college-admin/students` | List students |
| `GET` | `/api/college-admin/grievances` | List grievances for the college |
| `POST` | `/api/college-admin/grievances/{id}/assign` | Assign grievance to faculty |

### Super Admin
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/super-admin/dashboard` | System-wide statistics |
| `GET/POST` | `/api/super-admin/colleges` | List / create colleges |
| `PUT` | `/api/super-admin/colleges/{id}` | Update a college |
| `DELETE` | `/api/super-admin/colleges/{id}` | Delete a college |
| `GET` | `/api/super-admin/faculty` | All faculty system-wide |
| `GET` | `/api/super-admin/students` | All students system-wide |
| `GET` | `/api/super-admin/reports` | System analytics report |

### Faculty & Students
| Method | Endpoint | Role | Description |
|---|---|---|---|
| `GET` | `/api/faculty` | COLLEGE_ADMIN, SUPER_ADMIN | All faculty |
| `GET` | `/api/faculty/profile` | FACULTY | Current faculty's profile |
| `PATCH` | `/api/faculty/{id}/resolver` | COLLEGE_ADMIN | Toggle resolver status |
| `GET` | `/api/students` | COLLEGE_ADMIN, SUPER_ADMIN | All students |
| `GET` | `/api/students/profile` | STUDENT | Current student's profile |

### Evidence
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/evidence/grievance/{grievanceId}` | Upload evidence files |
| `GET` | `/api/evidence/grievance/{grievanceId}` | List evidence for a grievance |
| `GET` | `/api/evidence/{id}/download` | Download an evidence file |
| `DELETE` | `/api/evidence/{id}` | Delete an evidence file |

---

## AI Analysis Pipeline

1. Student submits a grievance → backend saves it with status `SUBMITTED` and priority `MEDIUM`
2. `AIService.analyzeGrievanceAsync()` fires in a background thread (`@Async`)
3. Backend posts `{ title, description, grievance_id }` to `POST http://localhost:8000/analyze`
4. Response is parsed into an `AIAnalysis` entity and saved
5. `RiskAssessmentService.assessRisk()` runs immediately after:
   - Anomaly detected → +40 points
   - Fake complaint detected → −20 points
   - Anomaly score contributes up to +30 points
   - Final score clamped to [0, 100]
   - CRITICAL ≥ 75 | HIGH ≥ 50 | MEDIUM ≥ 25 | LOW < 25
6. Risk level `CRITICAL` or `HIGH` sets `requiresImmediateAction = true`
7. If the AI server is unreachable, analysis shows `"AI analysis pending"` and the local **DuplicateDetectionService** runs a word-overlap similarity check as a fallback

---

## File Upload

Evidence files (images, PDFs, documents) can be attached to grievances at submission time or uploaded separately.

- Files are stored locally under `uploads/grievances/{grievanceId}/`
- Filenames are UUID-renamed to prevent conflicts
- Max file size: **10 MB** per file; max request size: **50 MB**
- The `uploads/` directory is created automatically on first use
- There is no cloud storage integration — all files live on the server's filesystem

---

## Security Model

- **Authentication:** Stateless JWT (HS256, 24-hour TTL). No session cookies, no refresh tokens.
- **Token storage (frontend):** `localStorage` under `grievance_token`.
- **All requests** from the frontend automatically get `Authorization: Bearer <token>` injected by `authInterceptor`.
- **Public endpoints:** `/api/auth/**` and `/api/tokens/validate` only.
- **Role enforcement:** Both Spring Security's `@PreAuthorize` on controller methods and Angular `roleGuard` on frontend routes.
- **Passwords:** BCrypt-hashed — never stored in plain text.
- **CORS:** Restricted to `http://localhost:2020` in development. Update `CorsConfig.java` for any other origin.
- **Registration gating:** No user can register without a valid, non-expired, single-use `RegistrationToken`.

---

## Common Issues & Troubleshooting

**Backend fails to start — "Access denied for user"**
- Verify `spring.datasource.username` and `spring.datasource.password` in `application.properties` match your MySQL installation.

**Backend fails to start — JWT key error**
- The default `jwt.secret` is a placeholder. Replace it with a real Base64-encoded 256-bit key (see [Getting Started > Backend](#2-backend-spring-boot)).

**Frontend shows "Network Error" or blank data**
- Make sure the backend is running on port 2718 before starting the frontend.
- Check that `src/environments/environment.ts` points to `http://localhost:2718/api`.

**AI analysis always shows "pending"**
- The AI microservice at `http://localhost:8000` is either not running or not responding. The backend degrades gracefully — all other features work normally.

**Cannot register a new user — "Invalid token"**
- Registration requires a token generated by the Super Admin. Generate one via `/super-admin/token-generator` or `POST /api/tokens/generate`.
- Tokens expire after 7 days and are single-use.

**Faculty never gets auto-assigned grievances**
- Faculty must have `isGrievanceResolver = true`. A College Admin can toggle this via the Resolver Management page or `PATCH /api/faculty/{id}/resolver`.

**File uploads fail**
- Check that the `uploads/` directory exists and the application has write permission to it.
- Verify the file does not exceed the 10 MB per-file limit.

**CORS errors in the browser**
- Ensure the frontend is running on `localhost:2020`. The backend's CORS config only allows that exact origin. If you change the frontend port, update `CorsConfig.java` accordingly.
