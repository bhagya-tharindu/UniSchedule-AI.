# Requirements Traceability Matrix (RTM) — Week 6

**Purpose:** Link MoSCoW requirements to research questions, implementation evidence, and primary-data themes (survey/interviews). Update the **Primary data** column as responses arrive.

**Sources:** [`04-requirements-moscow.md`](../supervisor-submission/04-requirements-moscow.md), survey/interview instruments in this folder.

---

## 1. Functional requirements

| ID | Requirement | Priority | RQ | Implementation evidence | Primary data theme (fill when available) | Status |
|----|-------------|----------|-----|-------------------------|------------------------------------------|--------|
| FR1 | Registration and secure login | Must | Security | Sanctum tokens; `AuthController`; login/register UI | | Done |
| FR2 | Role-based access (student, lecturer) | Must | Security | `users.role`; policies on meeting update/cancel | | Done |
| FR3 | Create meeting (title, participants, time, room) | Must | RQ1, RQ4 | `POST /meetings`; participant chips; room select | | Done |
| FR4 | Reschedule and cancel meetings | Must | RQ1 | `PUT` / `DELETE /meetings/{id}` (API); UI cancel polish Week 7+ | | Partial (API) |
| FR5 | Real-time clash detection | Must | RQ2 | `ClashDetectionService`; `POST /meetings/check-clash` | | Done |
| FR6 | Academic constraints (availability, capacity, exam) | Must | RQ3 | Availability windows; room capacity; exam blackout rule | | Done (basic) |
| FR7 | Natural language meeting requests | Must | NLP | `NlpSchedulingService`; `POST /meetings/parse-nlp`; NL tab | | Done (hybrid) |
| FR8 | Alternative time slots on clash | Should | RQ2, RQ5 | `suggestAlternativeSlots`; clickable UI buttons | | Done |
| FR9 | Room / resource allocation | Must | RQ2 | Room model; select from `GET /rooms`; capacity check | | Done (basic) |
| FR10 | Personal meeting list | Must | Usability | Dashboard `GET /meetings` | | Done |
| FR11 | Calendar sync | Should | Integration | — | | Deferred |
| FR12 | Analytics dashboard | Should | RQ5 | — | | Week 8 or defer |
| FR13 | Notifications | Could | Usability | — | | Won't (this FYP) |
| FR14 | Admin config of rooms/policies | Could | RQ3 | Seeded rooms/rules only | | Minimal |

---

## 2. Non-functional requirements

| ID | Requirement | Evidence / plan | Status |
|----|-------------|-----------------|--------|
| NFR1 | Schedule response &lt; 3s | Measure p95 in Week 10 | Pending |
| NFR2 | Sanctum + hashed passwords | Implemented | Done |
| NFR3 | Minimal personal data; RBAC | Meeting list scoped to user | Done |
| NFR4 | Usable by non-technical users | Form + NL confirm flow; UAT Week 9 | In progress |
| NFR5 | No silent clash failures | ValidationException on clashes; UI alerts | Done |
| NFR6 | Modular services | Auth, NLP, Scheduling, Clash, Catalog | Done |
| NFR7 | Pilot cohort scale | Local prototype | Pending eval |
| NFR8 | Modern browsers | Next.js app | Done |

---

## 3. Survey / interview theme placeholders

Map themes here after ethics launch (do not invent results).

| Theme ID | Theme (example labels) | Linked FR | Linked RQ | Notes / n |
|----------|------------------------|-----------|-----------|-----------|
| T1 | Email back-and-forth / coordination time | FR3, FR7 | RQ1, RQ4 | |
| T2 | Double-booked people or rooms | FR5, FR8 | RQ2 | |
| T3 | Room capacity / finding rooms | FR9 | RQ2 | |
| T4 | Trust in auto-booking / AI | FR7 (confirm step) | RQ5 | |
| T5 | Preference for form vs natural language | FR3, FR7 | RQ5 | |

---

## 4. Evaluation mapping (Weeks 9–10)

| Evaluation activity | Requirements exercised | RQ |
|---------------------|------------------------|-----|
| Pilot UAT (scripted tasks) | FR3, FR5, FR7, FR8, FR10 | RQ5 |
| Manual vs AI-assisted timing | FR3 vs FR7 path | RQ4 |
| Clash injection tests (≥20) | FR5, FR6 | RQ2, RQ3 |

---

## 5. Update log

| Date | Change |
|------|--------|
| Week 6 | Initial RTM from implemented vertical slice |

---

*End of RTM*
