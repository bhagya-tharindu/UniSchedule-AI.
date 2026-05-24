# UniSchedule AI — Requirements & MoSCoW

**Student:** [Your Full Name] | **ID:** [Student ID] | **Date:** [Date]  
**Version:** 0.1

---

## 1. Purpose

This document defines functional and non-functional requirements for UniSchedule AI and prioritizes features using the **MoSCoW** method. Requirements will be traced to research questions and, from Week 4 onward, to survey and interview findings.

---

## 2. Stakeholders and personas

### 2.1 Student

- **Goals:** Book meetings with lecturers; avoid clashes with classes; use simple language or forms.  
- **Pain points:** Email delays; uncertain lecturer availability; room booking confusion.  

### 2.2 Lecturer

- **Goals:** Manage availability; approve or reschedule meetings; minimize clashes with teaching.  
- **Pain points:** Multiple channels for requests; double-booked office hours; manual calendar updates.  

### 2.3 Academic coordinator (Should-have)

- **Goals:** Oversee room usage; resolve conflicts; view utilization reports.  

### 2.4 University administrator (Could-have)

- **Goals:** Configure policies (exam periods, blackout dates, room lists).  

---

## 3. Functional requirements

| ID | Requirement | Priority | Research link |
|----|-------------|----------|---------------|
| **FR1** | User registration and secure login | Must | Security |
| **FR2** | Role-based access (student, lecturer) | Must | Security |
| **FR3** | Create meeting (title, participants, time, room) | Must | RQ1, RQ4 |
| **FR4** | Reschedule and cancel meetings | Must | RQ1 |
| **FR5** | Real-time clash detection (time, room, participants) | Must | RQ2 |
| **FR6** | Academic constraint validation (availability, capacity, exam rules) | Must | RQ3 |
| **FR7** | Natural language meeting request processing | Must | NLP research |
| **FR8** | Suggest alternative time slots when clash occurs | Should | RQ2, RQ5 |
| **FR9** | Automated room/resource allocation | Must | RQ2 |
| **FR10** | View personal timetable/meeting list | Must | Usability |
| **FR11** | Calendar synchronization (Google/Outlook/iCal) | Should | Integration |
| **FR12** | Analytics dashboard (utilization, peaks, loads) | Should | RQ5 |
| **FR13** | Notifications (email/in-app) | Could | Usability |
| **FR14** | Admin configuration of rooms and policies | Could | RQ3 |

---

## 4. Non-functional requirements

| ID | Category | Requirement |
|----|----------|-------------|
| **NFR1** | Performance | Schedule request response target: **< 3 seconds** under normal load (measured in evaluation) |
| **NFR2** | Security | Laravel Sanctum authentication; secure password hashing; HTTPS in deployment |
| **NFR3** | Privacy | Minimize stored personal data; role-based data access |
| **NFR4** | Usability | Interface understandable by non-technical university users |
| **NFR5** | Reliability | No silent clash failures; errors logged and shown to user |
| **NFR6** | Maintainability | Modular services (Auth, NLP, Scheduler, Clash, Resources) |
| **NFR7** | Scalability | Support pilot cohort (50–200 users) for evaluation |
| **NFR8** | Compatibility | Modern web browsers (Chrome, Edge, Firefox latest) |

---

## 5. MoSCoW prioritization

### 5.1 Must have

- Authentication and role-based access (FR1, FR2)  
- Core meeting CRUD (FR3, FR4)  
- Clash detection (FR5)  
- Academic constraints (FR6)  
- NLP-based or hybrid input for meeting requests (FR7)  
- Room allocation (FR9)  
- Personal meeting view (FR10)  
- Evaluation study (manual vs AI) and documentation  

### 5.2 Should have

- Alternative slot recommendations (FR8)  
- Calendar synchronization (FR11)  
- Analytics dashboard (FR12)  
- Coordinator role (partial FR14)  

### 5.3 Could have

- Notifications (FR13)  
- Full admin panel  
- Exportable reports for coordinators  

### 5.4 Won't have (this project timeframe)

| Excluded | Rationale |
|----------|-----------|
| Voice-based scheduling assistant | Future work |
| Machine learning preference prediction | Future work |
| Native mobile application | Future work; web-first |
| Smart classroom / IoT integration | Future work |
| Full LMS integration (Moodle, etc.) | Future work |
| Multi-campus enterprise deployment | Out of scope for FYP |

---

## 6. User stories (sample)

| ID | As a… | I want to… | So that… |
|----|-------|-------------|----------|
| **US1** | Student | book a meeting with my lecturer in natural language | I save coordination time |
| **US2** | Lecturer | see clash warnings before confirming | I avoid double bookings |
| **US3** | Student | receive suggested alternative slots | I can book quickly when my first choice fails |
| **US4** | Lecturer | set my weekly availability | students only book feasible times |
| **US5** | System | block bookings during exam periods | academic policy is enforced |

---

## 7. Requirements traceability

| Requirement | Research question | Supervisor theme |
|-------------|-------------------|------------------|
| FR5, FR6 | RQ2, RQ3 | Clash detection; academic constraints |
| FR7 | RQ4 | NLP research |
| FR8, FR9 | RQ2 | Resource allocation |
| FR11 | — | Calendar synchronization |
| FR12 | RQ5 | Analytics research |
| Evaluation | RQ4, RQ5 | Manual vs AI; user satisfaction |

---

## 8. Assumptions and constraints

- Pilot deployment uses a **defined set of rooms** and **sample timetable data** if full university integration is unavailable.  
- Users have web access; no native mobile app in v1.  
- English-language NLP for meeting requests in v1.  
- Primary data collection begins **Week 4** after ethics guidance.  

---

*End of document*
