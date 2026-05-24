# UniSchedule AI — Project Notes

**Purpose:** Single reference for your FYP — saved from planning work so you do not depend on Cursor chat history.

**Last updated:** May 2026 (Week 3)

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

## 6. Timeline (Weeks 4–6)

| Week | Development | Research |
|------|-------------|----------|
| **4** | MySQL migrations; Laravel scheduler + clash; Sanctum login | Ethics; survey launch; interviews scheduled |
| **5** | NLP v1 via Laravel | Literature; survey analysis |
| **6** | End-to-end: Next.js → Laravel → MySQL | Requirements ↔ survey themes; demo |

**Hours:** Target 15–20 h/week.

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
├── README.md                 ← start here
├── docs/
│   ├── PROJECT-NOTES.md      ← this file
│   └── supervisor-submission/
│       ├── 01-progress-summary.md
│       ├── 02-research-foundation.md
│       ├── 03-literature-review.md
│       ├── 04-requirements-moscow.md
│       ├── 05-system-design-pack.md
│       ├── 06-evaluation-security-ethics.md
│       ├── EMAIL-template.md
│       └── README.md
└── (future: frontend/, backend/ for code)
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
- Optional: copy important chat answers into this file under Section 10.

### Full project plan (Cursor)

Plan file (if present): `personalized_fyp_plan_f697e383.plan.md` in your `.cursor/plans/` folder.

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
