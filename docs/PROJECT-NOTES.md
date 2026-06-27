# UniSchedule AI — Project Notes

**Purpose:** Single reference for your FYP — saved from planning work so you do not depend on Cursor chat history.

**Last updated:** June 2026 (Week 5 — NLP pipeline v1)

---

## 1. Project summary

**Title:** UniSchedule AI — Intelligent University Meeting Scheduler

**Problem:** Universities need ad-hoc academic meeting scheduling beyond fixed semester timetables. Manual coordination causes clashes, delays, and poor room use. Generic corporate tools lack academic constraints and NLP-based booking.

**Solution:** Web platform with academic-aware scheduling, real-time clash detection, resource allocation, hybrid AI (constraints + NLP), and empirical evaluation.

**Supervisor focus:** Research contribution (RQs, gap, methodology, evaluation) — not implementation only.

---

## 2. Technology stack (confirmed)

| Layer | Technology | Notes |
|-------|------------|--------|
| Frontend | **Next.js** + TypeScript | Calls Laravel API |
| Backend | **Laravel** | REST API, scheduling, clash logic |
| Database | **MySQL** | Eloquent ORM, migrations |
| Auth | **Laravel Sanctum** | `auth:sanctum` on API routes; tokens from Next.js |
| NLP | LLM API via Laravel HTTP client | Parsing; validation stays in Laravel |
| Diagrams | draw.io / Mermaid in docs | Export for dissertation |

**Architecture:** `Next.js → HTTPS → Laravel API → MySQL`

---

## 3. Research questions (RQ1–RQ5)

| RQ | Focus | Measure |
|----|--------|---------|
| RQ1 | Ad-hoc meeting difficulty | Survey; task time |
| RQ2 | Resource clashes | Clash rate in tests |
| RQ3 | Generic tools vs academic rules | Constraint violations |
| RQ4 | Manual vs AI scheduling time | Comparative experiment |
| RQ5 | Satisfaction / productivity | UAT, satisfaction scores |

**Research type:** Applied research + experimental evaluation.

---

## 4. MoSCoW (scope control)

### Must have

- Sanctum auth + student/lecturer roles  
- Meeting CRUD + clash detection + academic constraints  
- NLP (or hybrid) meeting requests  
- Room allocation  
- Survey + evaluation (manual vs AI)  
- Dissertation diagrams + literature (Harvard)  

### Should have

- Alternative slot suggestions  
- Calendar sync (Google/Outlook)  
- Analytics dashboard  

### Won't have (Future Work)

- Voice assistant, mobile app, LMS integration, ML preference learning  

### Minimum acceptable version (if behind)

Form-based booking + strong clash detection + simplified NLP + survey evaluation + manual vs system comparison.

---

## 5. Supervisor submission pack (Week 3)

**Folder:** `docs/supervisor-submission/`

| # | File | Export as |
|---|------|-----------|
| 1 | `01-progress-summary.md` | PDF |
| 2 | `02-research-foundation.md` | PDF |
| 3 | `03-literature-review.md` | PDF (Harvard refs included) |
| 4 | `04-requirements-moscow.md` | PDF |
| 5 | `05-system-design-pack.md` | PDF |
| 6 | `06-evaluation-security-ethics.md` | PDF |
| — | `EMAIL-template.md` | Paste into email |

**Not sent in Week 3 pack:** survey, recovery plan document, working code (unless you have it).

**Before sending:** Replace all `[Your Full Name]`, `[Student ID]`, `[Supervisor Name]`, `[Date]`.

---

## 6. 12-week plan (Weeks 4–12)

**Source:** Merged from your Cursor plan (`personalized_fyp_plan_f697e383.plan.md`) + `docs/supervisor-submission/06-evaluation-security-ethics.md`.

**Pace:** 15–20 h/week (~40% research/writing, ~60% build; shift to ~70% writing in Weeks 10–12).

**Weekly habit:** 3 dev tasks + 1 research task + 1 dissertation subsection; brief supervisor email every Friday with evidence only (no invented progress).

### 6.1 Week 4 — complete

| Area | Target | Status (update as you go) |
|------|--------|---------------------------|
| **Dev** | Migrations; Sanctum auth; scheduler + clash; meeting CRUD; Next.js shell | **Done** — see `SETUP.md` §3 |
| **Dev** | Unit tests for clash detector | Done (`ClashDetectionTest`) — extend scenarios in Week 7 |
| **Research** | Ethics application / confirmation | Pack ready — `docs/research/`; launch after supervisor sign-off |
| **Research** | Survey live; interviews scheduled (3–5) | Instruments ready — publish after ethics |
| **Writing** | Literature Ch. 2 draft; gap section | ~60% — see `03-literature-review.md` §10 |
| **Deliverable** | Supervisor demo: login, book meeting, clash check | Done |

### 6.1b Week 5 — current (June 2026)

| Area | Target | Status |
|------|--------|--------|
| **Dev** | NLP pipeline v1 (`NlpSchedulingService`, `POST /meetings/parse-nlp`) | **Done** |
| **Dev** | NL input + confirm step on booking UI | **Done** |
| **Dev** | NLP feature tests (`NlpParseMeetingTest`) | **Done** |
| **Research** | Ethics checklist + survey + interview guide | **Done** (awaiting launch) |
| **Research** | Preliminary survey analysis | Pending responses |
| **Writing** | Literature ~60%; Methodology Ch. 3 draft | **In progress** |
| **Deliverable** | Demo: utterance → proposed slot → clash → book | See `docs/week5-supervisor-demo.md` |

### 6.2 Full schedule (Weeks 4–12)

| Week | Development | Research / dissertation | Deliverables / proof |
|------|-------------|-------------------------|----------------------|
| **4** | Scheduler + clash v1; Sanctum; DB migrations; Next.js auth + meetings UI | Ethics; survey launch; schedule 3–5 interviews; literature Ch. 2 draft | Demo: roles, CRUD, clash; CSP/clash documented; unit tests |
| **5** | **NLP pipeline v1** — parse text → structured request → scheduler (Laravel); validate before persist | Survey analysis (preliminary themes); literature ~60% | NLP flow diagram; demo: utterance → proposed slot |
| **6** | **End-to-end vertical slice** — NLP + scheduler + MySQL + UI; polish booking flow | Requirements ↔ survey/interview themes (RTM traceability) | Supervisor vertical-slice demo |
| **7** | Resource allocation polish; **alternative slot** UX; expand clash test suite (≥20 scenarios) | Literature review ~80%; **AI design chapter** draft | Evaluation test cases defined; scheduler/clash integration tests |
| **8** | **Should-have:** analytics dashboard v1 (utilization, peaks) **or** calendar sync spike — pick one if time tight | Analytics queries + charts for dissertation; security section draft | Dashboard screenshots **or** calendar spike notes |
| **9** | UI/UX refinement; error handling; freeze scope on new features | System testing chapter; **pilot UAT** (5–8 participants) | Test report; UAT script + screenshots |
| **10** | Bug fixes; performance tuning (API p95) | **Comparative evaluation** — manual vs AI-assisted (same scenarios) | Results tables/charts; dissertation Ch. 6–7 draft |
| **11** | **Feature freeze**; deployment/README; tag release `v1.0-submission` | Full dissertation integration; supervisor draft review | Complete draft to supervisor |
| **12** | Final fixes only | Proofread; Harvard reference audit; submission pack | Final report + code tag |

### 6.3 Evaluation milestones (by week)

| Week | Evaluation activity |
|------|---------------------|
| 4 | Finalize ≥20 test scenarios; ethics for survey |
| 7 | Unit + integration tests for scheduler and clash |
| 9 | Pilot UAT |
| 10 | Comparative study (manual vs AI); performance tests |
| 11 | Results chapter with charts |

### 6.4 Dissertation writing map

| Weeks | Chapters / artifacts |
|-------|----------------------|
| 4–5 | Ch. 2 Literature (gap, matrix); Ch. 3 Methodology draft |
| 6–7 | Ch. 4 System Design (architecture, ER, use cases, AI flow) |
| 8–9 | Ch. 5 Implementation; security/privacy section |
| 10–11 | Ch. 6 Evaluation (metrics, manual vs AI, UAT, limitations) |
| 11–12 | Ch. 7 Conclusion; Future Work; reference audit |

**Required diagrams:** system context, components, ER, use cases, scheduling sequence, AI decision flow, evaluation charts, UI screenshots.

### 6.5 MoSCoW vs weeks (what lands when)

| Priority | Feature | Target week |
|----------|---------|-------------|
| Must | Auth + roles (Sanctum) | 4 ✓ |
| Must | Meeting CRUD + clash + constraints | 4 ✓ |
| Must | NLP / hybrid booking | 5–6 |
| Must | Room allocation | 4–7 (basic in place; polish Week 7) |
| Must | Survey + manual vs AI evaluation | 4 (launch) → 10 (study) |
| Should | Alternative slot suggestions | 4 ✓ / UX Week 7 |
| Should | Analytics dashboard | 8 |
| Should | Calendar sync (Google/Outlook) | 8 or **defer** to Future Work |
| Won’t | Voice, mobile, LMS, ML preferences | Dissertation Future Work only |

### 6.6 If behind — minimum acceptable submission

Still required by submission:

- Form-based booking + **robust clash detection** + documented constraints  
- **Simplified NLP** (or documented hybrid with LLM)  
- **Survey + evaluation** with real numbers (manual vs system)  
- Research chapters: gap, method, evaluation — not only a user manual  

**Cut first:** calendar sync, full analytics, Could-have notifications.

### 6.7 Supervisor meeting agenda (standing)

1. Progress vs week table (§6.2)  
2. Literature: 2–3 new papers  
3. Primary data: survey **n**, interview themes  
4. Demo (5 min) or screen recording  
5. Evaluation: preliminary metrics  
6. Scope: explicit Yes/No on new features  

---

## 7. Evaluation metrics (dissertation)

- Scheduling accuracy (≥20 test scenarios)  
- Clash detection / reduction  
- API response time (mean, p95)  
- User satisfaction (UAT)  
- Manual vs AI-assisted task completion time  

---

## 8. Folder structure

```
UniSchedule-AI/
├── README.md
├── SETUP.md                  ← how to run locally
├── frontend/                 ← Next.js + TypeScript
├── backend/                  ← Laravel API + Sanctum
├── docs/
│   ├── PROJECT-NOTES.md      ← this file (living plan)
│   └── supervisor-submission/
│       ├── 01-progress-summary.md … 06-evaluation-security-ethics.md
│       └── EMAIL-template.md
```

---

## 9. How to save / back up this work

### Files (recommended)

1. **GitHub:** [bhagya-tharindu/UniSchedule-AI.](https://github.com/bhagya-tharindu/UniSchedule-AI.) (note: repo name ends with a `.`)  
2. Local folder is linked — use `git push` after commits.  
3. Export PDFs from markdown before each supervisor meeting.

### Cursor chat

- Chats are tied to the workspace; reopening this folder may show history.  
- **Do not rely on chat alone** — all deliverables are in `docs/`.  
- **Cursor rules:** `.cursor/rules/` — `unischedule-core.mdc` applies to every new chat automatically.  
- **AGENTS.md** at repo root gives agents a quick orientation.  
- Optional: copy important chat answers into this file under Section 13.

### Full project plan (Cursor)

Canonical 12-week detail also lives in:

- `C:\Users\bhagy\.cursor\plans\personalized_fyp_plan_f697e383.plan.md`  
- `C:\Users\bhagy\.cursor\plans\unischedule_ai_research_plan_931d5f10.plan.md`  

**This file (§6)** is the repo copy agents and you should use in new chats.

---

## 10. Supervisor feedback (summary)

Your supervisor asked you to strengthen:

- Measurable research problems and gap  
- Methodology and evaluation (not only code)  
- Primary data: surveys, interviews  
- AI/NLP and CSP/scheduling explained academically  
- Security, diagrams, Harvard references  
- Future work section in dissertation  

---

## 11. Questions to ask supervisor

1. Are RQ1–RQ5 and metrics acceptable?  
2. Ethics required before survey?  
3. Is MoSCoW Must list sufficient?  
4. Approve evaluation design (manual vs AI)?  
5. Any changes to tech stack (Next.js / Laravel / Sanctum / MySQL)?  

---

## 12. AI use (check university policy)

If Canterbury requires disclosure: state that Cursor AI assisted with **structuring** documents and literature organisation; you **verified** references, scope, and technical decisions. Adjust wording per official policy.

---

## 13. Your notes (add below)

<!-- Add supervisor meeting notes, decisions, and deadlines here -->

**Supervisor meeting date:**  

**Decisions:**  

**Next deadline:**  

---

*End of project notes*
