# UniSchedule AI — Research Foundation

**Student:** [Your Full Name] | **ID:** [Student ID] | **Date:** [Date]

---

## 1. Introduction

UniSchedule AI is an intelligent university meeting and collaboration scheduling platform that combines **academic-aware constraint handling**, **real-time clash detection**, **resource allocation**, and **Natural Language Processing (NLP)** to support ad-hoc academic scheduling. This document defines the research problems, gap, contribution, methodology, and AI approach underpinning the project.

---

## 2. Measurable research problems

| ID | Research problem | Research question | Measurement approach |
|----|------------------|-------------------|----------------------|
| **P1** | Difficulty managing ad-hoc meetings in academic environments | **RQ1:** To what extent do students and lecturers experience difficulty scheduling ad-hoc academic meetings? | Survey (frequency, time spent); optional task observation |
| **P2** | Resource conflicts and scheduling inefficiencies | **RQ2:** How prevalent are timetable clashes and resource conflicts in university meeting scheduling? | Clash rate in controlled test scenarios; survey on clash frequency |
| **P3** | Limitations of generic scheduling platforms | **RQ3:** Do generic scheduling tools fail to satisfy academic constraints (exams, teaching load, room capacity)? | Constraint violation count vs academic-aware engine |
| **P4** | Time wastage from manual coordination | **RQ4:** Does AI-assisted scheduling reduce coordination time compared with manual methods? | Paired comparison: manual vs UniSchedule task completion time |
| **P5** | Impact on productivity and collaboration | **RQ5:** Does intelligent scheduling improve user satisfaction and perceived academic productivity? | UAT satisfaction scores; optional analytics on meeting patterns |

---

## 3. Research gap

### 3.1 Limitations of existing approaches

| Area | Limitation |
|------|------------|
| **Commercial schedulers** | Designed for corporate workflows; weak support for academic roles, exam periods, and ad-hoc university meetings |
| **Traditional timetable systems** | Focus on fixed semester/module timetabling; limited ad-hoc meeting intelligence |
| **Academic optimization research** | Strong theoretical work on timetabling and CSP; limited integration into practical, user-facing deployable systems |
| **NLP assistants** | Growing use in general domains; limited research on NLP-driven scheduling within educational institutions |
| **Clash and resource management** | Often manual or fragmented across email, spreadsheets, and room booking tools |

### 3.2 Research gap statement

There is a gap between **generic scheduling tools** and **university-specific operational needs** for intelligent, ad-hoc, constraint-aware meeting management with **NLP interaction**, **real-time clash detection**, and **empirical evaluation** in an academic context. UniSchedule AI addresses this gap through a practical system plus measurable evaluation.

---

## 4. Research contribution

This project contributes:

1. **Academic-aware intelligent scheduling** — constraints for lectures, exams, lecturer availability, and room capacity.  
2. **Hybrid AI integration** — deterministic constraint satisfaction / rules combined with NLP (or LLM-assisted) parsing of natural language meeting requests.  
3. **Real-time clash detection** — temporal, participant, and room conflict identification with alternative slot suggestions.  
4. **Automated resource allocation** — room assignment under capacity and availability rules.  
5. **Empirical evaluation** — primary data (survey/interviews) and experimental comparison of manual vs AI-assisted scheduling.  

---

## 5. Research methodology

### 5.1 Research type

- **Applied research** — builds a working artefact to address a practical problem.  
- **Experimental evaluation** — compares system performance and user outcomes against manual baselines and defined metrics.  

### 5.2 Methodology phases

| Phase | Activities | Outputs |
|-------|------------|---------|
| **1. Literature review** | Systematic search; critical synthesis; Harvard referencing | Chapter 2; literature matrix |
| **2. Requirements gathering** | Document analysis; **survey and interviews (Week 4+)** | Requirements spec; traceability |
| **3. System design** | Architecture, ER, use cases, workflows, AI flows | Design pack (Document 5) |
| **4. AI model design** | CSP/constraints; NLP pipeline; hybrid decision logic | AI design section; diagrams |
| **5. Development** | Incremental implementation (Next.js, Laravel, MySQL); version control | Prototype; Git repository |
| **6. Testing** | Unit, integration, system, UAT | Test reports |
| **7. Evaluation** | Metrics; manual vs AI study; statistical summary | Results chapter; charts |

### 5.3 Data collection methods (planned Week 4+)

| Method | Purpose | Participants |
|--------|---------|--------------|
| **Online survey** | Quantify scheduling difficulties, clashes, satisfaction | Students, lecturers (target n ≥ 20) |
| **Semi-structured interviews** | Qualitative depth on workflows and trust in AI | 3–5 across roles |
| **Observation (optional)** | Current coordination practices | Small sample |

---

## 6. AI and intelligent scheduling approach

### 6.1 Constraint handling

Academic constraints modeled include:

- Lecturer and student **availability windows**  
- **Room capacity** and room type  
- **Existing timetable** commitments (lectures, labs)  
- **Exam periods** and blackout rules  
- **Maximum meetings per day** (optional policy rule)  

**Techniques:** Constraint Satisfaction Problem (CSP) formulation or rule-based validation with heuristic search for feasible slots.

### 6.2 Clash detection

| Clash type | Description |
|------------|-------------|
| **Temporal** | Overlapping start/end times for same participant |
| **Room** | Double booking of same room |
| **Policy** | Violation of exam blackout or capacity |

### 6.3 Hybrid AI model

| Component | Role |
|-----------|------|
| **NLP layer** | Parse natural language: intent (book/reschedule/cancel), entities (people, room, date/time) |
| **Constraint engine** | Validate feasibility; reject or repair invalid proposals |
| **Optimizer/heuristic** | Rank alternative slots by distance, availability, and preferences |
| **LLM (optional)** | Disambiguation and clarification dialogue when input is incomplete |

**Principle:** Critical scheduling decisions are **validated deterministically**; NLP/LLM assists **interpretation**, not unchecked booking.

### 6.4 Research hypotheses (optional)

- **H1:** UniSchedule detects and prevents more scheduling clashes than manual coordination in equivalent scenarios.  
- **H2:** AI-assisted scheduling completes booking tasks in less time than manual methods.  
- **H3:** Users report higher satisfaction when intelligent alternative slots are offered.  

---

## 7. Analytics research component (Should-have)

If implemented, the analytics dashboard will support research on:

- Room utilization patterns  
- Lecturer meeting load  
- Peak scheduling times  
- Collaboration frequency  

Statistical summaries and visualizations will support discussion under **RQ5**.

---

## 8. Conclusion

UniSchedule AI is positioned as a **research-led** final year project combining software engineering with empirical evaluation. This foundation document will be expanded in the dissertation introduction and methodology chapters following supervisor approval.

---

*End of document*
