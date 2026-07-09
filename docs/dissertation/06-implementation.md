# Chapter 6 — Implementation

**Student:** [Your Full Name] | **ID:** [Student ID] | **Date:** [Date]

---

## 6.1 Introduction

This chapter describes the digital artefact developed for UniSchedule AI. Implementation follows the design in Chapter 5 and the incremental prototype plan in Chapter 3. Source code is maintained in a Git repository ([https://github.com/bhagya-tharindu/UniSchedule-AI.](https://github.com/bhagya-tharindu/UniSchedule-AI.)). Local setup instructions are documented in `SETUP.md` at the project root.

---

## 6.2 Repository structure

```
UniSchedule-AI/
├── frontend/          # Next.js + TypeScript
├── backend/           # Laravel REST API + Sanctum
├── docs/              # FYP documentation and dissertation
├── SETUP.md           # Local run instructions
└── README.md
```

| Layer | Path | Role |
|-------|------|------|
| Presentation | `frontend/src/` | Pages, API client, auth state |
| API | `backend/app/Http/` | Controllers, form requests, resources |
| Domain services | `backend/app/Services/` | Scheduling, clash, NLP |
| Models | `backend/app/Models/` | Eloquent entities |
| Persistence | `backend/database/migrations/` | Schema |
| Tests | `backend/tests/` | Feature and unit tests |

---

## 6.3 Development environment

| Requirement | Version / notes |
|-------------|-----------------|
| PHP | 8.2+ with Composer |
| Node.js | 20+ with npm |
| Database | MySQL 8 (recommended) or SQLite for local development |
| Backend server | `php artisan serve` → `http://localhost:8000/api/v1` |
| Frontend server | `npm run dev` → `http://localhost:3000` |

Demo accounts (seeded; password `password`):

| Email | Role |
|-------|------|
| student@unischedule.test | student |
| lecturer@unischedule.test | lecturer |

---

## 6.4 Authentication and roles (FR1, FR2)

Laravel Sanctum issues personal access tokens consumed by the Next.js client. Protected routes use the `auth:sanctum` middleware. Users store a `role` field (`student` or `lecturer`). Meeting update and cancel operations are restricted to the organiser via policies or controller checks.

**UI:** Registration and login pages; token stored client-side for subsequent API calls.

**[INSERT SCREENSHOT: login / register]**

---

## 6.5 Meeting management (FR3, FR4, FR10)

### Backend

- `MeetingController` exposes REST endpoints for list, create, update, delete, clash check, and NLP parse.
- `StoreMeetingRequest` / `UpdateMeetingRequest` validate inputs (title, times, room, participants, optional meeting mode).
- `MeetingResource` shapes JSON responses for the frontend.
- `SchedulingService` persists meetings and suggests alternative slots when clashes occur.

### Frontend

- Dashboard lists the authenticated user’s meetings (`GET /meetings`).
- New meeting page supports form-based booking and an NLP tab.
- Meeting delivery modes include UniSchedule (Jitsi) rooms and external join links (Zoom/Teams/Meet), with an in-app join page where applicable.

**[INSERT SCREENSHOT: dashboard meeting list]**  
**[INSERT SCREENSHOT: new meeting form]**

---

## 6.6 Clash detection and academic constraints (FR5, FR6, FR9)

`ClashDetectionService` evaluates proposals before commit:

| Check | Behaviour |
|-------|-----------|
| Participant time overlap | Blocks double-booking of the same person |
| Room double-booking | Blocks concurrent use of the same room |
| Availability windows | Warns or blocks outside declared availability |
| Room capacity | Validates participant count against room capacity |
| Policy rules | Exam blackout / constraint rules from the database |

Conflicts surface as validation errors to the UI; optional `POST /meetings/check-clash` supports pre-submit checks. Alternative slots are returned for one-click application (FR8).

**[INSERT SCREENSHOT: clash warning and alternative slots]**

---

## 6.7 Hybrid NLP pipeline (FR7)

`NlpSchedulingService` implements the interpretation layer:

1. Accept natural language text from `POST /api/v1/meetings/parse-nlp`.
2. Parse via OpenAI-compatible LLM when `OPENAI_API_KEY` is configured; otherwise use a **rule-based fallback**.
3. Resolve participants and rooms against catalog data (`GET /users`, `GET /rooms`).
4. Return a structured proposal, parser mode (`llm` | `rules`), and clash preview.
5. User confirms or edits fields in the UI; booking uses the same `SchedulingService` persist path as the form.

Example demo utterance (rule parser):

> Book a supervision with Dr Jane Lecturer next Tuesday at 2pm in ENG-101

This design ensures NLP never silently commits invalid meetings, supporting trustworthy evaluation under RQ4 and RQ5.

**[INSERT SCREENSHOT: natural language tab with confirm step]**

---

## 6.8 Catalog and supporting APIs

| Endpoint (illustrative) | Purpose |
|-------------------------|---------|
| `POST /auth/register`, `POST /auth/login` | Registration and token issue |
| `GET /meetings`, `POST /meetings` | Meeting list and create |
| `POST /meetings/check-clash` | Pre-submit clash check |
| `POST /meetings/parse-nlp` | NLP proposal |
| `GET /users`, `GET /rooms` | Participant and room pickers |

---

## 6.9 Incremental delivery summary

| Phase | Features delivered |
|-------|--------------------|
| Week 4 | Sanctum auth; meeting CRUD; clash detection; form UI; seed data |
| Week 5 | NLP pipeline v1; parse → confirm → book; NLP feature tests |
| Week 6 | Vertical-slice polish; catalog APIs; clickable alternatives; RTM |
| Later | Meeting delivery (Jitsi / external links); further test expansion |

Features deferred per MoSCoW (calendar sync, full analytics, notifications) are documented as Future Work in Chapter 9.

---

## 6.10 Project management

| Practice | Application |
|----------|-------------|
| Version control | Git; remote GitHub repository |
| Incremental sprints | Weekly Must-have targets (Chapter 3) |
| Documentation | `docs/` supervisor pack and dissertation skeleton |
| Testing | `php artisan test` for backend feature/unit suites |
| Release | Tag `v1.0-submission` at freeze |

---

## 6.11 Chapter summary

The implemented artefact provides authenticated meeting management, deterministic clash and constraint checking, room allocation, and hybrid natural-language booking with human confirmation. The following chapter describes testing strategies and empirical evaluation against RQ1–RQ5.

---

*End of Chapter 6*
