AI-Based Student Grievance Management System

A full-stack web application for managing student grievances in academic institutions. The system combines role-based access control, grievance lifecycle management, evidence uploads, and an AI-powered analysis service for category prediction, fake-complaint detection, duplicate detection, anomaly detection, and risk assessment.

📌 Table of Contents

Architecture Overview

Technology Stack

Key Features

Project Structure

Prerequisites

Getting Started

1. Database Setup

2. Backend Setup

3. AI Microservice

4. Frontend Setup

Configuration

User Roles & Access

First-Time Super Admin Setup

Registration Flow

API Endpoints

AI Analysis Pipeline

File Upload & Evidence

Security Model

Common Issues & Troubleshooting

🏗️ Architecture Overview

                    HTTP / REST
┌───────────────────────────┐
│     Angular 17 Frontend   │
│       localhost:2020      │
└─────────────┬─────────────┘
              │
              │ JWT + REST API
              ▼
┌───────────────────────────┐
│   Spring Boot 3.2 Backend │
│       localhost:2718      │
└─────────────┬─────────────┘
              │
              │ Async REST
              ▼
┌───────────────────────────┐
│   AI Python Microservice  │
│       localhost:8000      │
└───────────────────────────┘

              │
              ▼
┌───────────────────────────┐
│         MySQL 8            │
│       grievance_db         │
└───────────────────────────┘

Components

Frontend: Angular 17 single-page application with role-based routing and lazy-loaded components.

Backend: Spring Boot 3.2 REST API responsible for authentication, grievance management, evidence storage, authorization, and AI orchestration.

AI Microservice: External Python service that analyzes grievance content. The backend includes a graceful fallback when the AI service is unavailable.

Database: MySQL 8 with Hibernate/JPA schema management.

🛠️ Technology Stack

Layer

Technology

Version

Frontend Framework

Angular

17

Frontend Charts

Chart.js + ng2-charts

4.4 / 5.0

Backend Framework

Spring Boot

3.2.0

Programming Language

Java

17

ORM

Spring Data JPA / Hibernate

—

Security

Spring Security + JJWT

0.11.5

Database

MySQL

8

Backend Build Tool

Maven

3.x

Frontend Build Tool

Angular CLI

17

AI Service

Python

External service

✨ Key Features

👨‍🎓 Student

Submit grievances with title, description, category, type, and optional evidence.

Track submitted grievances and their current status.

View common or duplicate grievances detected by the system.

Edit pending grievances.

View AI analysis and risk assessment results.

👨‍🏫 Faculty

View grievances assigned to them.

Review and update grievance status.

Add resolution notes.

Validate incidents reported through grievances.

Handle grievances when designated as grievance resolvers.

🏫 College Admin

View college-level dashboard statistics.

Manage departments, students, and faculty.

Assign grievances to faculty manually or automatically.

Manage faculty resolver designations.

Trigger manual AI re-analysis.

Monitor grievances within their college.

👑 Super Admin

View system-wide dashboards and reports.

Create, update, and delete colleges.

View students and faculty across all colleges.

Generate registration tokens for onboarding.

View system-wide grievance analytics.

🤖 AI Features

The external AI microservice provides:

Category prediction with confidence score.

Priority prediction with confidence score.

Fake-complaint detection with confidence score.

Duplicate detection with similarity score.

Anomaly detection with anomaly score.

Risk assessment based on AI results.

Local duplicate-detection fallback when the AI service is unavailable.

Risk levels:

CRITICAL
HIGH
MEDIUM
LOW

📁 Project Structure

AI-Based-Student-Grievance-Management-System/
│
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/grievance/management/
│           │   ├── GrievanceManagementApplication.java
│           │   ├── config/
│           │   ├── controller/
│           │   ├── dto/
│           │   ├── entity/
│           │   ├── enums/
│           │   ├── exception/
│           │   ├── repository/
│           │   ├── security/
│           │   ├── service/
│           │   └── util/
│           │
│           └── resources/
│               └── application.properties
│
└── frontend/
    ├── package.json
    ├── angular.json
    ├── tsconfig.json
    └── src/
        └── app/
            ├── auth/
            ├── student/
            ├── faculty/
            ├── college-admin/
            ├── super-admin/
            ├── core/
            │   ├── guards/
            │   ├── interceptors/
            │   ├── models/
            │   └── services/
            └── shared/
                └── components/

📋 Prerequisites

Install the following before running the project:

Tool

Minimum Version

Check Command

Java JDK

17

java -version

Maven

3.6+

mvn -version

Node.js

18+

node -v

npm

9+

npm -v

MySQL

8.0+

mysql --version

Angular CLI

17

ng version

Install Angular CLI if required:

npm install -g @angular/cli@17

🚀 Getting Started

1. Database Setup

Start your MySQL server and create the database:

CREATE DATABASE grievance_db;

Hibernate automatically creates and updates the required tables using:

spring.jpa.hibernate.ddl-auto=update

No manual schema migration is required for the initial setup.

2. Backend Setup

Navigate to the backend:

cd backend

Configure MySQL

Open:

backend/src/main/resources/application.properties

Update your MySQL credentials:

spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

Configure JWT Secret

Generate a secure Base64-encoded secret.

Linux / macOS

openssl rand -base64 32

Windows PowerShell

[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Max 256) }))

Add the generated value:

jwt.secret=YOUR_BASE64_SECRET_KEY

⚠️ Security: Never commit your real database password or JWT secret to GitHub. Use environment variables or a local configuration file for production deployments.

Run the Backend

For development:

mvn spring-boot:run

Or build and run the JAR:

mvn clean package
java -jar target/grievance-management-1.0.0.jar

Backend URL:

http://localhost:2718

3. AI Microservice

The AI server is a separate Python service and is not included in this repository.

The backend communicates with:

POST http://localhost:8000/analyze

Expected Request

{
  "title": "string",
  "description": "string",
  "grievance_id": "string"
}

Expected Response

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

AI Service Unavailable

If the AI service is unavailable:

The grievance is still saved.

The analysis status becomes "AI analysis pending".

Local duplicate detection can still run using word-overlap similarity.

Other grievance-management features continue to work.

4. Frontend Setup

Navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start the Angular development server:

npm start

Frontend URL:

http://localhost:2020

The frontend proxies /api/** requests to:

http://localhost:2718

Make sure the backend is running before using the frontend.

Production Build

npm run build

The compiled application will be generated inside:

frontend/dist/

⚙️ Configuration

Main backend configuration:

backend/src/main/resources/application.properties

Property

Default

Description

server.port

2718

Backend server port

spring.datasource.url

jdbc:mysql://localhost:3306/grievance_db

MySQL connection

spring.datasource.username

root

MySQL username

spring.datasource.password

Local value

MySQL password

spring.jpa.hibernate.ddl-auto

update

Hibernate schema management

jwt.secret

Placeholder

Base64 JWT secret

jwt.expiration

86400000

JWT validity in milliseconds

spring.servlet.multipart.max-file-size

10MB

Maximum individual file size

spring.servlet.multipart.max-request-size

50MB

Maximum request size

file.upload-dir

uploads

Evidence storage directory

ai.server.url

http://localhost:8000

AI service URL

spring.task.execution.pool.core-size

5

Async core threads

spring.task.execution.pool.max-size

10

Async maximum threads

👥 User Roles & Access

Role

Description

Default Route

STUDENT

Submit and track grievances

/student/dashboard

FACULTY

Review assigned grievances

/faculty/dashboard

COLLEGE_ADMIN

Manage college operations

/college-admin/dashboard

SUPER_ADMIN

Full system administration

/super-admin/dashboard

👑 First-Time Super Admin Setup

There is no seeded Super Admin account. The initial account must be created directly in the database.

1. Generate a BCrypt Password

You can generate a BCrypt hash using Java:

System.out.println(
    new BCryptPasswordEncoder().encode("yourPassword")
);

2. Insert the User

INSERT INTO users
(email, password, first_name, last_name, role, enabled)
VALUES
(
    'superadmin@system.com',
    '$2a$10$YOUR_BCRYPT_HASH',
    'Super',
    'Admin',
    'SUPER_ADMIN',
    true
);

3. Create the Super Admin Profile

INSERT INTO super_admins (user_id)
VALUES (LAST_INSERT_ID());

4. Login

Open:

http://localhost:2020

Then log in using the Super Admin credentials.

🔐 Registration Flow

New users cannot register freely. Registration requires a valid Registration Token generated by a Super Admin.

Flow

Super Admin
     │
     ▼
Generate Registration Token
     │
     ▼
Share Token with User
     │
     ▼
User Opens Registration Page
     │
     ▼
Enter Personal Details + Token
     │
     ▼
Token Validation
     │
     ▼
Account Created
     │
     ▼
JWT Generated
     │
     ▼
Role-Based Dashboard

Registration Pages

User

Route

Student

/auth/register/student

Faculty

/auth/register/faculty

College Admin

/auth/register/college-admin

Registration tokens are:

Single-use.

Valid for 7 days.

Scoped to the appropriate role and college.

🔌 API Endpoints

All API endpoints use the /api prefix.

Authenticated requests require:

Authorization: Bearer <JWT_TOKEN>

Authentication

Method

Endpoint

Description

POST

/api/auth/login

Login and receive JWT

POST

/api/auth/register/student

Register student

POST

/api/auth/register/faculty

Register faculty

POST

/api/auth/register/college-admin

Register college admin

Registration Tokens

Method

Endpoint

Role

Description

POST

/api/tokens/validate

Public

Validate registration token

POST

/api/tokens/generate

SUPER_ADMIN

Generate token

GET

/api/tokens

SUPER_ADMIN

List tokens

Grievances

Method

Endpoint

Role

Description

POST

/api/grievances

STUDENT

Submit grievance

GET

/api/grievances

Admin

Get grievances

GET

/api/grievances/my

STUDENT

Get student's grievances

GET

/api/grievances/assigned

FACULTY

Get assigned grievances

GET

/api/grievances/common

STUDENT

Get common/duplicate grievances

GET

/api/grievances/{id}

Authenticated

Get grievance

PUT

/api/grievances/{id}

STUDENT

Update grievance

PATCH

/api/grievances/{id}/status

Faculty/Admin

Update status

AI Analysis

Method

Endpoint

Role

Description

GET

/api/ai/analysis/{grievanceId}

Authenticated

Get AI analysis

POST

/api/ai/analyze/{grievanceId}

Admin

Trigger AI analysis

GET

/api/ai/risk/{grievanceId}

Authenticated

Get risk assessment

College Admin

Method

Endpoint

Description

GET

/api/college-admin/dashboard

Dashboard statistics

GET/POST

/api/college-admin/departments

List/create departments

GET

/api/college-admin/faculty

List faculty

GET

/api/college-admin/students

List students

GET

/api/college-admin/grievances

College grievances

POST

/api/college-admin/grievances/{id}/assign

Assign grievance

Super Admin

Method

Endpoint

Description

GET

/api/super-admin/dashboard

System dashboard

GET/POST

/api/super-admin/colleges

List/create colleges

PUT

/api/super-admin/colleges/{id}

Update college

DELETE

/api/super-admin/colleges/{id}

Delete college

GET

/api/super-admin/faculty

All faculty

GET

/api/super-admin/students

All students

GET

/api/super-admin/reports

System analytics

Faculty & Students

Method

Endpoint

Role

Description

GET

/api/faculty

Admin

List faculty

GET

/api/faculty/profile

Faculty

Current faculty profile

PATCH

/api/faculty/{id}/resolver

Admin

Toggle resolver status

GET

/api/students

Admin

List students

GET

/api/students/profile

Student

Current student profile

Evidence

Method

Endpoint

Description

POST

/api/evidence/grievance/{grievanceId}

Upload evidence

GET

/api/evidence/grievance/{grievanceId}

List evidence

GET

/api/evidence/{id}/download

Download evidence

DELETE

/api/evidence/{id}

Delete evidence

🤖 AI Analysis Pipeline

The grievance analysis process works asynchronously:

Student submits grievance
          │
          ▼
Backend saves grievance
Status = SUBMITTED
Priority = MEDIUM
          │
          ▼
AIService.analyzeGrievanceAsync()
          │
          ▼
POST /analyze
AI Microservice
          │
          ▼
AI Analysis Result
          │
          ▼
AIAnalysis Entity Saved
          │
          ▼
RiskAssessmentService
          │
          ▼
Risk Level
CRITICAL / HIGH / MEDIUM / LOW

Risk Calculation

The system uses AI results to calculate a risk score:

Anomaly detected → +40 points

Fake complaint detected → −20 points

Anomaly score → contributes up to +30 points

Final score is clamped between 0 and 100

Risk levels:

Score

Risk

75–100

CRITICAL

50–74

HIGH

25–49

MEDIUM

<25

LOW

CRITICAL and HIGH grievances are marked as requiring immediate action.

📎 File Upload & Evidence

Students can attach evidence when submitting a grievance or upload evidence separately.

Supported evidence can include:

Images

PDFs

Documents

Storage

Files are stored locally:

uploads/
└── grievances/
    └── {grievanceId}/

Upload Rules

Maximum individual file size: 10 MB

Maximum request size: 50 MB

Uploaded filenames are UUID-renamed.

The uploads/ directory is created automatically.

Files are stored on the server filesystem.

No cloud-storage integration is currently included.

🔒 Security Model

Authentication

Stateless JWT authentication.

HS256 signing.

JWT validity: 24 hours.

No session cookies.

No refresh tokens.

Frontend Token Handling

JWT is stored in:

localStorage

under:

grievance_token

The Angular authInterceptor automatically adds:

Authorization: Bearer <JWT>

to authenticated API requests.

Authorization

The system uses both:

Spring Security @PreAuthorize

Angular roleGuard

Password Security

Passwords are stored using:

BCrypt

Passwords are never stored as plain text.

CORS

Development frontend origin:

http://localhost:2020

If the frontend runs on another origin or port, update the backend CORS configuration.

Registration Security

Users cannot freely create accounts. Registration requires a valid:

Registration token

Role

College scope

Expiration period

Single-use token

🛠️ Common Issues & Troubleshooting

Backend: "Access denied for user"

Check:

spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

Make sure the credentials match your MySQL installation.

Backend: JWT Key Error

The default JWT secret is only a placeholder.

Generate a secure Base64 key and update:

jwt.secret=YOUR_BASE64_SECRET_KEY

Frontend: Network Error

Make sure the backend is running:

http://localhost:2718

Then verify that the frontend environment configuration points to:

http://localhost:2718/api

AI Analysis Remains "Pending"

Check whether the AI service is running:

http://localhost:8000

The backend will continue to work even when the AI service is unavailable.

Registration: "Invalid Token"

Registration requires a valid token.

Generate one through:

/super-admin/token-generator

or:

POST /api/tokens/generate

Remember:

Tokens expire after 7 days.

Tokens are single-use.

Faculty Not Receiving Auto-Assigned Grievances

The faculty member must be marked as:

isGrievanceResolver = true

A College Admin can change this through Resolver Management or:

PATCH /api/faculty/{id}/resolver

File Upload Failure

Check:

The uploads/ directory is writable.

The file is not larger than 10 MB.

The total request is not larger than 50 MB.

CORS Error

The backend allows:

http://localhost:2020

If the Angular application is running on another port, update the backend CORS configuration accordingly.

📌 Project Summary

The AI-Based Student Grievance Management System provides a centralized platform for students to submit and track grievances while enabling faculty and administrators to manage, prioritize, and resolve complaints efficiently.

The combination of:

Role-based access control

JWT authentication

Evidence management

AI-powered grievance analysis

Duplicate and fake-complaint detection

Risk assessment

College-level and system-wide dashboards

creates a structured and scalable approach to grievance management in academic institutions.

👨‍💻 Development

Built as a full-stack academic project using:

Angular + Spring Boot + MySQL + Python AI Microservice

