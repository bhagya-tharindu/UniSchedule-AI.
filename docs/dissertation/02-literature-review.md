# Chapter 2 — Literature Review

**Student:** [Your Full Name] | **ID:** [Student ID] | **Date:** [Date]  
**Status:** ~60% complete — expand with 2–3 further IEEE/ACM sources and survey theme integration before submission.

---

## 2.1 Introduction

Scheduling is fundamental to university operations. While substantial research addresses **course and examination timetabling** at semester scale, everyday academic work also depends on **ad-hoc meetings** between students, lecturers, and administrators. These interactions are often coordinated manually through email, messaging tools, and informal room booking, which can produce clashes, delays, and under-utilised resources (McKay, Morton and Maltbie, 2017; Song, Ashktorab and Malone, 2025).

Recent advances in **artificial intelligence (AI)**, including constraint programming, optimisation, and large language models (LLMs), create opportunities for intelligent scheduling assistants that interpret natural language requests, enforce academic constraints, and detect conflicts in real time. However, the literature remains fragmented across operational research (timetabling), human–computer interaction (group scheduling), and NLP (temporal information extraction).

This chapter synthesises relevant work across five themes: (1) automated university timetabling; (2) constraint satisfaction and optimisation; (3) meeting coordination and calendar systems; (4) NLP and AI assistants for scheduling; and (5) resource allocation and university platforms. Section 2.7 presents a critical synthesis and research gap; Section 2.8 links findings to UniSchedule AI. Full Harvard references appear in the References section at the end of the dissertation.

---

## 2.2 Automated university timetabling

University timetabling is a well-established combinatorial optimisation problem. Schaerf (1999) provides a foundational survey, describing timetabling as assigning lectures between teachers and students over a fixed horizon (typically one week) subject to diverse constraints. The survey highlights solution techniques from operational research and artificial intelligence, including genetic algorithms, tabu search, simulated annealing, and **constraint satisfaction**.

Burke and Petrovic (2002) outline research directions, emphasising that university timetabling extends beyond examinations to course scheduling, multicriteria decision-making, and case-based reasoning. They argue for systems with greater **generality** and practical deployability—an aim shared by applied final-year projects. Petrovic and Burke (2004) further consolidate university timetabling within the broader scheduling literature, noting variant problem definitions across institutions and the centrality of hard and soft constraints.

Empirical studies of real universities reinforce the complexity of the problem. Burke et al. (1996) surveyed ninety-five British universities and reported diverse practices, manual and automated methods, and varying quality criteria for acceptable timetables. Carter and Laporte (1996) review practical examination timetabling developments, illustrating how institutional rules shape feasible solutions.

Benchmark competitions have driven methodological progress. The International Timetabling Competition 2019 (ITC 2019) defined a realistic course timetabling problem involving classes, rooms, student enrolment, and distribution constraints (Müller, Rudová and Müllerová, 2025). Winning and follow-up approaches employ **mixed-integer programming (MIP)**, graph-based formulations, and matheuristics to handle large instances (Müller, Rudová and Müllerová, 2025). Lach and Lübbecke (2008) demonstrate robust integer programming for curriculum-based course timetabling on benchmark instances from the University of Udine, achieving strong lower bounds and competitive solutions.

More recently, Legéay et al. (2022) propose a **domain-specific modelling language** for university timetabling that unifies course scheduling, resource allocation, and student sectioning. Their work compiles declarative rules into constraint programming models (for example MiniZinc), reflecting a trend toward explicit, verifiable constraint representation—relevant to academic-aware meeting schedulers that must encode availability, capacity, and policy rules.

### Critical comment

Timetabling research primarily targets **semester-scale** problems rather than **ad-hoc** meetings. Solutions are often batch-oriented and institution-specific, with limited support for conversational interaction or rapid rescheduling by individual students and lecturers. UniSchedule AI therefore does not duplicate full semester timetabling engines; instead, it applies constraint and clash-detection principles at the granularity of meetings and consultations.

---

## 2.3 Constraint satisfaction, optimisation, and clash detection

Constraint Satisfaction Problems (CSP) provide a formal basis for scheduling: variables (for example time slots, rooms), domains, and constraints (no overlap, capacity, availability). Schaerf (1999) and Burke and Petrovic (2002) document widespread use of CSP-related methods in timetabling. ITC 2019 instances explicitly combine hard constraints (feasibility) with soft constraints (penalties), a pattern mirrored in meeting scheduling where some rules are mandatory (exam blackout) and others are preferences (preferred room).

Clash detection is a specialised form of constraint checking. In university timetabling, **student conflicts** occur when a student cannot attend two classes simultaneously; analogous conflicts arise in ad-hoc scheduling when participants or rooms are double-booked. Müller, Rudová and Müllerová (2025) note that minimising student conflicts is a core objective in real-world timetabling—conceptually parallel to minimising participant and room clashes in meeting booking.

For implementation, modern solvers include MIP, SAT, and theorem provers such as Z3. Open-source academic schedulers demonstrate how room, faculty, and time-slot constraints can be validated automatically before committing a schedule. UniSchedule AI adopts this principle: **deterministic validation** of proposals before acceptance, regardless of whether the user interface is form-based or NLP-driven.

### Critical comment

Optimisation literature often reports performance on benchmarks without delivering end-user systems for daily ad-hoc use. UniSchedule AI contributes by embedding constraint checking and clash detection in a **practical web application** intended for students and lecturers, with evaluation metrics such as clash reduction and scheduling accuracy.

---

## 2.4 Meeting coordination, calendars, and productivity

Separate from institutional timetabling, **group meeting scheduling** has been studied in human–computer interaction and information systems. Song, Ashktorab and Malone (2025) observe that existing tools (polls, shared calendars) are often **static**: every attendee sees the full option space, which increases cognitive load and partial or inconsistent availability responses. Their system, **Togedule**, uses LLMs to adaptively adjust the pool and presentation of time options, reducing attendee mental load and improving organiser decision speed in controlled experiments.

Coordination overhead is significant even before meetings occur. McKay, Morton and Maltbie (2017) studied how schedulers spend time interacting with stakeholders, finding unpredictable workflows and substantial **informational work** compared with decision-making—supporting the view that scheduling is not a single algorithmic step but a socio-technical process. Romano and Nunamaker (2001) and Ducheneaut and Bellotti (2001) (cited in Song et al., 2025) document inefficiencies in email-based coordination and calendar use, including back-and-forth messaging and burden on organisers.

Commercial platforms (for example Microsoft Outlook, Google Calendar) expose **free/busy** information via APIs, enabling programmatic availability queries (Microsoft, 2024). Such APIs support integration but do not encode **university-specific** constraints (teaching loads, exam periods, room policies) unless extended by custom application logic—motivating bespoke academic schedulers.

### Critical comment

Corporate calendar ecosystems optimise general-purpose meetings; they rarely enforce academic roles, room capacity rules, or intelligent alternative generation grounded in university policy. UniSchedule AI targets this contextual gap while optionally integrating external calendars as a secondary synchronisation layer (Should-have / Future Work if not delivered).

---

## 2.5 Natural language processing and AI scheduling assistants

NLP enables users to express scheduling intent conversationally. Patra et al. (2021) present **SHERLOCK** (ScHeduling Entity Recovery by LOoking at Contextual Knowledge), which extracts **task-specific** date-time entities and **negation constraints** for meeting scheduling—outperforming generic temporal extraction by focusing only on entities relevant to booking. Their work reports substantial gains in F-score for scheduling-relevant entities, highlighting that general-purpose temporal parsers are insufficient for domain tasks.

LLM-based **multi-agent** calendar assistants represent a recent trend. Wijerathne et al. (2025) describe **ScheduleMe**, where a supervisory agent coordinates specialised agents for checking availability, creating, modifying, and deleting Google Calendar events via natural language. The architecture emphasises modularity, clarification dialogue, and mandatory conflict checking before creation—design patterns aligned with UniSchedule AI’s hybrid model (NLP for interpretation, deterministic rules for validation).

Song et al. (2025) extend LLM use to **adaptive group availability**, while Patra et al. (2021) focus on accurate temporal semantics. Together, these studies suggest a research-informed architecture: NLP/LLM layers handle parsing and disambiguation; backend services enforce constraints, clashes, and resource allocation.

Patra et al. (2021) also demonstrate that scheduling-specific temporal extraction outperforms generic parsers—a justification for domain-focused prompts and post-parse validation rather than end-to-end LLM booking. Song et al. (2025) show LLMs can reduce cognitive load in group scheduling UIs; UniSchedule AI applies a related principle through **adaptive feedback** (clash messages and alternative slots) while requiring explicit user confirmation of parsed fields. This confirmation step mitigates known LLM risks (hallucinated times, wrong participants) and aligns with human-in-the-loop guidelines for human–AI interaction (Amershi et al., 2019).

### Critical comment

NLP scheduling research often targets **personal** or **corporate** calendars, not multi-role university environments with lecturers, students, and rooms. Few studies combine NLP meeting requests with **academic constraint engines** and empirical evaluation in higher education—a core contribution area for UniSchedule AI.

---

## 2.6 Resource allocation and university scheduling platforms

Room and resource allocation is integral to university scheduling. Legéay et al. (2022) model rooms, lecturers, students, and groups within a unified timetabling language, including capacity and compatibility constraints. ITC 2019 similarly penalises unsuitable room-time assignments (Müller, Rudová and Müllerová, 2025).

Industry platforms (for example integrated timetabling and room-booking systems for higher education) demonstrate demand for **self-service booking**, estate management, and analytics on occupancy versus booked capacity. Agentic campus prototypes illustrate emerging architectures but are often institution-specific research demonstrators rather than evaluated dissertation artefacts with defined research questions.

Analytics on room utilisation, meeting load, and peak periods can support research on collaboration patterns (RQ5). Such analytics require reliable event data and consistent clash handling—linking resource management literature to system evaluation.

### Critical comment

Commercial and prototype systems validate practical need but seldom publish **comparative empirical studies** (manual versus AI-assisted scheduling) in peer-reviewed form. UniSchedule AI addresses this through planned experimental evaluation and user acceptance testing (Chapter 7).

---

## 2.7 Literature matrix

| Author(s) & year | Focus | Method / approach | Limitation | Relevance to UniSchedule AI |
|------------------|-------|-------------------|------------|----------------------------|
| Schaerf (1999) | Automated timetabling survey | Review of OR & AI methods | Semester timetabling, not ad-hoc meetings | Foundational constraints & techniques |
| Burke and Petrovic (2002) | University timetabling directions | Heuristics, multicriteria, CBR | Limited end-user NLP interaction | Research positioning & AI methods |
| Burke et al. (1996) | UK examination timetabling | Institutional survey | Not technical implementation | Requirements & stakeholder context |
| Müller et al. (2025) | ITC 2019 real-world timetabling | Optimisation, student conflicts | Batch semester scheduling | Clash metrics & constraint models |
| Lach and Lübbecke (2008) | Curriculum timetabling | Integer programming | Benchmark-focused | Optimisation rigour |
| Legéay et al. (2022) | UTP modelling language | Constraint programming | Not meeting-level UX | Academic constraint modelling |
| Patra et al. (2021) | NLP for scheduling | SHERLOCK temporal/negation extraction | Email assistant context | NLP pipeline design |
| Song et al. (2025) | Group meeting scheduling | LLM adaptive availability UI | Not university policy engine | Usability & LLM interaction |
| Wijerathne et al. (2025) | Calendar multi-agent system | LLM + tool orchestration | Personal Google Calendar | Hybrid AI architecture |
| McKay et al. (2017) | Scheduler time use | Empirical observation | Manufacturing-oriented | Coordination overhead (RQ4) |
| Carter and Laporte (1996) | Examination timetabling | Practical developments review | Exams only | Institutional constraints |
| Microsoft (2024) | Calendar free/busy API | API documentation | No academic rules | Calendar sync (Should-have) |
| Hevner et al. (2004) | Design science in IS | Conceptual framework | Not scheduling-specific | Methodology framing |
| Amershi et al. (2019) | Human–AI interaction guidelines | Design guidelines | General HCI | Confirm-before-commit UX |

---

## 2.8 Critical synthesis and research gap

The literature reveals three largely separate streams:

1. **University timetabling (OR/AI)** — strong on constraints and optimisation, weak on ad-hoc user interaction and deployable student–lecturer interfaces.
2. **Meeting coordination (HCI)** — strong on user burden and group tools, weak on academic rules and institutional resource policies.
3. **NLP/LLM assistants** — strong on parsing and dialogue, weak on verified academic scheduling and published university evaluations.

**Research gap:** There is limited work that integrates **academic-aware constraints**, **real-time clash detection**, **automated resource allocation**, **NLP-based meeting requests**, and **empirical comparison with manual scheduling** within a single university-oriented system.

Design science research (DSR) positions the development of IT artefacts alongside rigorous evaluation (Hevner et al., 2004). For UniSchedule AI, the artefact is the scheduling platform; evaluation combines **technical metrics** (clash detection, scheduling accuracy) and **behavioural metrics** (task time, satisfaction). McKay et al. (2017) quantify coordination overhead before meetings occur—supporting RQ4’s manual versus system comparison. Few NLP calendar papers report **controlled comparative studies** in educational settings; the evaluation design in Chapter 3 therefore addresses an under-reported evaluation gap.

**UniSchedule AI contribution (proposed):**

- Hybrid AI: NLP/LLM interpretation + deterministic CSP/rule-based validation.
- Ad-hoc academic meeting focus rather than full semester timetabling replacement.
- Evaluation framework: scheduling accuracy, clash reduction, response time, user satisfaction, manual versus AI-assisted tasks.
- Primary data from students and lecturers (subject to ethics approval).

---

## 2.9 Conclusion

This review establishes that university scheduling research provides robust foundations in constraints, optimisation, and clash avoidance, while NLP and LLM research offers modern interaction paradigms. Meeting coordination studies confirm significant user overhead in manual and static tools. UniSchedule AI is positioned to bridge these areas through a practical, research-evaluated platform for intelligent university meeting scheduling.

**Remaining work before submission:** add 2–3 further sources from IEEE/ACM digital libraries; complete Harvard citation audit; integrate survey and interview themes once primary data are available.

---

*End of Chapter 2*
