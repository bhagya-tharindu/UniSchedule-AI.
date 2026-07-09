# Chapter 5 — System Design

**Student:** [Your Full Name] | **ID:** [Student ID] | **Date:** [Date]

---

## 5.1 Introduction

This chapter describes the architecture and design of UniSchedule AI. The design supports hybrid AI (NLP interpretation plus deterministic constraint validation) and empirical evaluation of manual versus AI-assisted booking. Diagrams are referenced from exported figures under `Week3/Charts/`; insert them into Word as Figures 5.1–5.8.

---

## 5.2 Design goals

| Goal | Design response |
|------|-----------------|
| Academic-aware scheduling | Clash and availability rules in Laravel services |
| Trustworthy AI | NLP proposes; user confirms; rules gate persist |
| Measurable evaluation | Clear form path versus NLP path for RQ4 timing |
| Secure API | Laravel Sanctum; role field on users |
| Maintainability | Thin controllers; domain services |

---

## 5.3 Technology stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (React) + TypeScript |
| Backend | Laravel (PHP) — REST API |
| Database | MySQL |
| ORM / data access | Laravel Eloquent |
| Authentication | Laravel Sanctum (API tokens) |
| NLP | OpenAI-compatible LLM API called from Laravel; rule-based fallback |

**Architecture pattern:** `Next.js → HTTPS/JSON → Laravel REST API → MySQL`

**Rationale:** A decoupled frontend and backend allows independent UI iteration and keeps LLM API keys server-side only.

---

## 5.4 System context

**Figure 5.1 — System context diagram**  
*Source: `Week3/Charts/System_context_diagram.png` — insert in Word.*

Students and lecturers use the Next.js web application, which communicates with the Laravel REST API. Data are stored in MySQL. Laravel handles scheduling logic, Sanctum-protected routes, and optional calendar/NLP integrations. A coordinator actor is reserved for Should-have analytics features.

---

## 5.5 High-level architecture

**Figure 5.2 — High-level architecture**  
*Source: `Week3/Charts/High-level architecture diagram-2026-05-24-143147.png`*

| Component | Responsibility |
|-----------|----------------|
| Next.js UI | Auth screens, dashboard, form and natural-language booking |
| Auth (Sanctum) | Register, login, bearer tokens |
| Catalog API | List users and rooms for booking UI |
| Meeting API | CRUD, parse-nlp, check-clash |
| NlpSchedulingService | Text → structured proposal (LLM or rules) |
| SchedulingService | Persist meetings; alternative slots |
| ClashDetectionService | Participant, room, availability, policy checks |
| MySQL | Users, meetings, rooms, availabilities, clash records |

---

## 5.6 Use cases

**Figure 5.3 — Use case diagram**  
*Source: `Week3/Charts/Use case diagram-2026-05-24-143429.png`*

Core use cases cover authentication, meeting lifecycle (create, reschedule, cancel, view), NLP booking requests, clash handling, room allocation, and optional analytics for lecturers or coordinators.

---

## 5.7 Data design

**Figure 5.4 — Entity–relationship diagram**  
*Source: `Week3/Charts/Entity–Relationship_diagram.png`*

Core entities:

| Entity | Key attributes / notes |
|--------|------------------------|
| **User** | name, email, role (`student` \| `lecturer`) |
| **Meeting** | organizer, room, title, start/end, status, optional meeting mode / join URL |
| **MeetingParticipant** | meeting_id, user_id, response |
| **Room** | name, building, capacity, is_active |
| **Availability** | user_id, day_of_week, start/end time |
| **ConstraintRule** | e.g. exam blackout windows |
| **ClashRecord** | logged conflicts for analysis |

Users have availability slots and participate in meetings. Meetings are linked to rooms. Constraint rules encode exam periods and policies. Clash records audit detected conflicts.

### Data management

| Topic | Approach |
|-------|----------|
| **Data sources** | User profiles, seed timetable data, room master list |
| **Validation** | Server-side validation on all inputs; reject invalid date ranges |
| **Storage** | MySQL relational model via Laravel migrations |
| **Sample data** | Seed script for development (users, rooms, sample meetings) |
| **Privacy** | Role-based queries; no public exposure of lecturer personal calendars |

---

## 5.8 Key workflows

### 5.8.1 Scheduling workflow

**Figure 5.5 — Scheduling workflow**  
*Source: `Week3/Charts/Scheduling workflow-2026-05-24-143740.png`*

Every booking passes constraint validation and clash detection before commit. Alternative slots are offered when conflicts occur.

### 5.8.2 Form booking

1. User enters title, times, optional room and participants.
2. Optional `POST /meetings/check-clash`.
3. `POST /meetings` runs clash detection; rejects or saves.

### 5.8.3 NLP booking (hybrid)

1. User enters natural language.
2. `POST /meetings/parse-nlp` returns a structured proposal and clash preview.
3. UI fills the form; user edits and confirms.
4. Same persist path as form booking.

### 5.8.4 Clash and alternatives

On conflict, `SchedulingService::suggestAlternativeSlots` proposes nearby free slots; the UI applies a slot with one click.

### 5.8.5 Sequence — book meeting

**Figure 5.6 — Sequence diagram (book meeting)**  
*Source: `Week3/Charts/Sequence diagram — Book meeting-2026-05-24-144004.png`*

Illustrates end-to-end interaction for NLP-driven booking with clash checking before database commit.

---

## 5.9 AI / NLP design

**Figure 5.7 — AI / NLP decision flow**  
*Source: `Week3/Charts/AI NLP decision flow-2026-05-24-143820.png`*

| Layer | Technology | Role |
|-------|------------|------|
| Interpretation | OpenAI-compatible LLM **or** rule parser | Intent + entities |
| Validation | PHP services | Hard constraints |
| Confirmation | UI | Human-in-the-loop |

**Principle:** Critical scheduling decisions are **validated deterministically**; NLP/LLM assists **interpretation**, not unchecked booking. Ambiguous input triggers clarification rather than silent incorrect booking. Parser mode (`llm` or `rules`) is returned for transparency in demos and evaluation.

### Clash detection design

**Figure 5.8 — Clash detection flow**  
*Source: `Week3/Charts/Clash_detection_flow.png`*

| Clash type | Description |
|------------|-------------|
| **Temporal** | Overlapping start/end times for same participant |
| **Room** | Double booking of same room |
| **Availability** | Outside declared availability windows |
| **Policy** | Violation of exam blackout or capacity |

---

## 5.10 Security design

- Sanctum personal access tokens from Next.js
- Password hashing via Laravel
- Meeting access limited to organiser and participants
- No LLM keys in the browser
- Input validation on all API endpoints
- HTTPS for deployment

Further discussion appears in Chapter 8.

---

## 5.11 HCI considerations

- Dual input modes (structured form and natural language) support different user preferences (RQ5).
- Explicit **confirm-before-commit** for NLP proposals aligns with human–AI interaction guidelines (Amershi et al., 2019).
- Clash messages and clickable alternative slots reduce recovery effort when the first choice fails (FR8).
- Dashboard lists personal meetings; join links support online delivery modes where implemented.

A short user guide is provided in Appendix F.

---

## 5.12 Deployment view

**Figure 5.9 — Deployment view (conceptual)**  
*Source: `Week3/Charts/Deployment view (conceptual)-2026-05-24-144109.png`*

Production deployment uses HTTPS. Next.js is served separately or alongside Laravel; API routes run on Laravel with Sanctum token validation. MySQL runs on a local or hosted instance. NLP/LLM is called from Laravel with rate limiting where applicable.

---

## 5.13 Chapter summary

The design realises MoSCoW Must-have requirements through a modular Laravel service layer, a Next.js presentation layer, and a hybrid AI pipeline that separates interpretation from validation. The next chapter describes how this design was implemented.

---

*End of Chapter 5*
