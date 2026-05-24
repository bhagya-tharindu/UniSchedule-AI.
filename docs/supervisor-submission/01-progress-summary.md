# UniSchedule AI — Progress Summary & Next Steps

**Student:** [Your Full Name]  
**Student ID:** [Student ID]  
**Programme:** [Programme]  
**Supervisor:** [Supervisor Name]  
**Date:** [Date]  
**Document version:** 1.0 (Week 3 submission)

---

## 1. Project title

**UniSchedule AI — Intelligent University Meeting Scheduler**

---

## 2. Problem statement

Universities rely heavily on fixed semester timetables, yet a large proportion of academic activity depends on **ad-hoc meetings** (student–lecturer consultations, project group meetings, supervision sessions, and administrative coordination). These meetings are often arranged manually via email, messaging applications, or informal room booking, which leads to:

- Scheduling conflicts and double-booked rooms  
- Delays in coordination between students and lecturers  
- Poor utilization of university resources  
- Frustration and reduced academic productivity  

Generic scheduling platforms (designed for corporate environments) and traditional timetable systems do not adequately support **intelligent, academic-aware, ad-hoc meeting management** with natural language interaction and real-time clash detection.

---

## 3. Project objectives

1. Design and implement an academic-aware intelligent meeting scheduling platform for universities.  
2. Integrate **hybrid AI** combining constraint-based scheduling and Natural Language Processing (NLP) for meeting requests.  
3. Provide **real-time clash detection** across time, participants, and rooms.  
4. Support **automated resource allocation** under university constraints (availability, capacity, exam periods).  
5. **Evaluate** the system empirically, including comparison of manual vs AI-assisted scheduling performance.  

---

## 4. Technology stack

The implementation uses a modern **decoupled web architecture** suitable for a research prototype and future deployment:

| Layer | Technology | Role |
|-------|------------|------|
| **Frontend** | Next.js (React) + TypeScript | User interface for students and lecturers |
| **Backend** | Laravel (PHP) | REST API, scheduling logic, clash detection, NLP integration |
| **Database** | MySQL | Persistent storage (users, meetings, rooms, constraints) |
| **Data access** | Laravel Eloquent ORM | Migrations, models, relationships |
| **Authentication** | Laravel Sanctum | Secure API access between Next.js and Laravel (`auth:sanctum` middleware) |
| **NLP / AI** | LLM API or external service (via Laravel HTTP client) | Natural language meeting requests (hybrid with rule-based validation) |

**Architecture summary:** The Next.js application sends authenticated requests to Laravel API endpoints. Laravel enforces academic constraints and clash rules before writing to MySQL. This stack aligns with the system design pack (Document 5) and security plan (Document 6).

---

## 5. Alignment with supervisor feedback

This submission focuses on the research-oriented components requested in supervisor feedback:

- Measurable research problems and research gap  
- Research methodology and evaluation framework  
- System architecture and design documentation  
- Security and reliability considerations  
- Primary data collection planned for Week 4 (survey not included in this pack)  

---

## 6. Work completed (update checkboxes honestly)

| Item | Status |
|------|--------|
| Research questions and methodology drafted | [ ] Done [ ] In progress |
| Literature sources collected (target: 8–12) | [ ] Done [ ] In progress |
| Research gap and contribution written | [ ] Done [ ] In progress |
| Requirements and MoSCoW defined | [ ] Done [ ] In progress |
| Architecture, ER, use case, and flow diagrams | [ ] Done [ ] In progress |
| Evaluation metrics and study design drafted | [ ] Done [ ] In progress |
| Ethics pathway identified | [ ] Done [ ] In progress [ ] Not started |

---

## 7. Work planned — Weeks 4–6

| Week | Development | Research / dissertation |
|------|-------------|------------------------|
| **4** | Laravel migrations (MySQL); scheduling engine v1; clash detection; Sanctum auth | Ethics submission; survey launch; 3–5 interview appointments |
| **5** | NLP pipeline v1 via Laravel (intent + date/time + participants) | Literature review expansion; preliminary survey analysis |
| **6** | End-to-end prototype (Next.js → Laravel API → MySQL) | Link requirements to survey themes; supervisor demo |

---

## 8. Risks and mitigation

| Risk | Mitigation |
|------|------------|
| Scope too large for solo timeline | Strict MoSCoW; defer calendar sync and advanced analytics if needed |
| NLP/LLM complexity | Hybrid design: rules/CSP for validation; NLP for parsing only |
| Low survey participation | University channels; supervisor support; peer networks |
| Research vs implementation imbalance | Weekly writing targets alongside coding |

---

## 9. Feedback requested from supervisor

1. Are the **research questions (RQ1–RQ5)** and metrics appropriate for dissertation standard?  
2. Is the **research gap** and contribution clearly articulated?  
3. Is the **MoSCoW Must** list achievable and sufficient?  
4. What **ethics process** is required before survey/interview distribution?  
5. Is the **evaluation design** (manual vs AI-assisted comparison) acceptable?  

---

## 10. Submission contents (this pack)

1. Progress summary (this document)  
2. Research foundation  
3. Literature review progress  
4. Requirements and MoSCoW  
5. System design pack  
6. Evaluation, security, and ethics  

**Not included:** survey questionnaire, survey results, implementation code (Week 4+).

---

*End of document*
