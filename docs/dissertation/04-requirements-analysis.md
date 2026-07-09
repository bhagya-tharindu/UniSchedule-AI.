# Chapter 4 — Requirements and System Analysis

**Student:** [Your Full Name] | **ID:** [Student ID] | **Date:** [Date]

---

## 4.1 Introduction

This chapter defines functional and non-functional requirements for UniSchedule AI and prioritises features using the **MoSCoW** method. Requirements are traced to research questions RQ1–RQ5 and, where primary data become available, to survey and interview themes (Appendix D). The analysis supports both research evaluation and software development deliverables.

---

## 4.2 Stakeholders and personas

### 4.2.1 Student

- **Goals:** Book meetings with lecturers; avoid clashes with classes; use simple language or forms.
- **Pain points:** Email delays; uncertain lecturer availability; room booking confusion.

### 4.2.2 Lecturer

- **Goals:** Manage availability; approve or reschedule meetings; minimise clashes with teaching.
- **Pain points:** Multiple channels for requests; double-booked office hours; manual calendar updates.

### 4.2.3 Academic coordinator (Should-have)

- **Goals:** Oversee room usage; resolve conflicts; view utilisation reports.

### 4.2.4 University administrator (Could-have)

- **Goals:** Configure policies (exam periods, blackout dates, room lists).

---

## 4.3 Current system and problem analysis

In the absence of a dedicated academic ad-hoc meeting platform, the “current system” is a fragmented socio-technical process:

1. Organiser proposes times via email or messaging.
2. Participants reply asynchronously with availability.
3. Room booking may use a separate institutional tool or informal agreement.
4. Conflicts are discovered late (double-booked people or rooms).

This analysis motivates automated clash detection (FR5), academic constraints (FR6), and optional natural language input (FR7) to reduce coordination steps measured under RQ4.

---

## 4.4 Functional requirements

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
| **FR11** | Calendar synchronisation (Google/Outlook/iCal) | Should | Integration |
| **FR12** | Analytics dashboard (utilisation, peaks, loads) | Should | RQ5 |
| **FR13** | Notifications (email/in-app) | Could | Usability |
| **FR14** | Admin configuration of rooms and policies | Could | RQ3 |

Implementation status is maintained in the requirements traceability matrix (Appendix D).

---

## 4.5 Non-functional requirements

| ID | Category | Requirement |
|----|----------|-------------|
| **NFR1** | Performance | Schedule request response target: **&lt; 3 seconds** under normal load (measured in evaluation) |
| **NFR2** | Security | Laravel Sanctum authentication; secure password hashing; HTTPS in deployment |
| **NFR3** | Privacy | Minimise stored personal data; role-based data access |
| **NFR4** | Usability | Interface understandable by non-technical university users |
| **NFR5** | Reliability | No silent clash failures; errors logged and shown to the user |
| **NFR6** | Maintainability | Modular services (Auth, NLP, Scheduler, Clash, Resources) |
| **NFR7** | Scalability | Support pilot cohort (50–200 users) for evaluation |
| **NFR8** | Compatibility | Modern web browsers (Chrome, Edge, Firefox latest) |

---

## 4.6 MoSCoW prioritisation

### 4.6.1 Must have

- Authentication and role-based access (FR1, FR2)
- Core meeting CRUD (FR3, FR4)
- Clash detection (FR5)
- Academic constraints (FR6)
- NLP-based or hybrid input for meeting requests (FR7)
- Room allocation (FR9)
- Personal meeting view (FR10)
- Evaluation study (manual versus AI) and documentation

### 4.6.2 Should have

- Alternative slot recommendations (FR8)
- Calendar synchronisation (FR11)
- Analytics dashboard (FR12)
- Coordinator role (partial FR14)

### 4.6.3 Could have

- Notifications (FR13)
- Full admin panel
- Exportable reports for coordinators

### 4.6.4 Won't have (this project timeframe)

| Excluded | Rationale |
|----------|-----------|
| Voice-based scheduling assistant | Future work |
| Machine learning preference prediction | Future work |
| Native mobile application | Future work; web-first |
| Smart classroom / IoT integration | Future work |
| Full LMS integration (Moodle, etc.) | Future work |
| Multi-campus enterprise deployment | Out of scope for FYP |

---

## 4.7 User stories (sample)

| ID | As a… | I want to… | So that… |
|----|-------|-------------|----------|
| **US1** | Student | book a meeting with my lecturer in natural language | I save coordination time |
| **US2** | Lecturer | see clash warnings before confirming | I avoid double bookings |
| **US3** | Student | receive suggested alternative slots | I can book quickly when my first choice fails |
| **US4** | Lecturer | set my weekly availability | students only book feasible times |
| **US5** | System | block bookings during exam periods | academic policy is enforced |

---

## 4.8 Requirements traceability

| Requirement | Research question | Supervisor theme |
|-------------|-------------------|------------------|
| FR5, FR6 | RQ2, RQ3 | Clash detection; academic constraints |
| FR7 | RQ4 | NLP research |
| FR8, FR9 | RQ2 | Resource allocation |
| FR11 | — | Calendar synchronisation |
| FR12 | RQ5 | Analytics research |
| Evaluation | RQ4, RQ5 | Manual versus AI; user satisfaction |

Primary-data themes (email back-and-forth, double-booking, trust in AI, form versus natural language preference) are mapped in Appendix D as responses arrive — **[PENDING DATA]**.

---

## 4.9 Assumptions and constraints

- Pilot deployment uses a **defined set of rooms** and **sample timetable data** if full university integration is unavailable.
- Users have web access; no native mobile app in v1.
- English-language NLP for meeting requests in v1.
- Primary data collection proceeds only after ethics guidance.

---

## 4.10 Chapter summary

Requirements analysis identified stakeholders, prioritised Must-have features for a research-evaluable prototype, and linked functional requirements to RQ1–RQ5. The next chapter presents the system design that realises these requirements.

---

*End of Chapter 4*
