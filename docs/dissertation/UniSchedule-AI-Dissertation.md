# UniSchedule AI: An Intelligent University Meeting Scheduler

**A dissertation submitted in partial fulfilment of the requirements for the degree of [Programme]**

**University of Canterbury**  
**Modules U10834 / U10838 (IS40 / IP40)** — Individual Study / Individual Project

**Student name:** [Your Full Name]  
**Student ID:** [Student ID]  
**Supervisor:** [Supervisor Name]  
**Date:** [Date]

---

## Abstract

Ad-hoc academic meetings between students and lecturers are often coordinated through email, messaging applications, and informal room booking. These practices can produce timetable clashes, delays, and inefficient use of rooms. Generic corporate scheduling tools provide limited support for university-specific constraints such as teaching availability, room capacity, and examination periods.

This dissertation presents **UniSchedule AI**, a research-led web platform for intelligent university meeting scheduling. The system combines academic-aware constraint handling, real-time clash detection, room allocation, and a hybrid artificial intelligence approach in which natural language processing interprets booking requests while deterministic backend rules validate feasibility before any meeting is stored. The artefact is implemented as a **Next.js** frontend and a **Laravel** REST API with **MySQL** storage and **Laravel Sanctum** authentication. Delivered capabilities include role-based access, form and natural-language booking with user confirmation, alternative slot suggestions, and online meeting delivery (UniSchedule/Jitsi and external links).

The research addresses five measurable questions concerning scheduling difficulty, clash prevalence, academic constraint compliance, coordination time under manual versus AI-assisted conditions, and user satisfaction. Methodology follows a design-science and mixed-methods strategy: literature synthesis, requirements analysis, incremental prototype development, automated technical testing, and a planned comparative booking experiment and user acceptance study, supported by survey and interview instruments (subject to ethics approval). Automated feature tests currently verify clash detection, NLP parsing, catalog access, and meeting delivery behaviour. Primary participant data collection is prepared but not yet administered; full empirical answers to behavioural research questions therefore remain for completion after ethics confirmation.

The work contributes a practical, hybrid-AI scheduling artefact, a requirements traceability matrix linking features to research questions, and an evaluation framework for academic ad-hoc meeting coordination.

**Keywords:** university scheduling; clash detection; natural language processing; hybrid AI; design science; higher education

---

## Acknowledgements

The author wishes to thank [Supervisor Name] for supervision and guidance throughout this project. Thanks are also due to family and friends for their support during the final year of study. Primary data collection involving survey and interview participants had not commenced at the time of writing; no external research participants contributed data to this report.

---

## Table of Contents

1. Introduction  
2. Literature Review  
3. Methodology  
4. Requirements and System Analysis  
5. System Design  
6. Implementation  
7. Testing and Evaluation  
8. Legal and Ethical Considerations  
9. Conclusion and Future Work  
References  
Appendix A — Survey Questionnaire  
Appendix B — Interview Guide  
Appendix C — Ethics Checklist  
Appendix D — Requirements Traceability Matrix  
Appendix E — Glossary  
Appendix F — User Guide  

---

## List of Figures

| Figure | Caption | Source file (insert in Word) |
|--------|---------|------------------------------|
| 5.1 | System context | `Week3/Charts/System_context_diagram.png` |
| 5.2 | High-level architecture | `Week3/Charts/High-level architecture diagram-2026-05-24-143147.png` |
| 5.3 | Use case diagram | `Week3/Charts/Use case diagram-2026-05-24-143429.png` |
| 5.4 | Entity–relationship diagram | `Week3/Charts/Entity–Relationship_diagram.png` |
| 5.5 | Scheduling workflow | `Week3/Charts/Scheduling workflow-2026-05-24-143740.png` |
| 5.6 | Sequence diagram — book meeting | `Week3/Charts/Sequence diagram — Book meeting-2026-05-24-144004.png` |
| 5.7 | AI / NLP decision flow | `Week3/Charts/AI NLP decision flow-2026-05-24-143820.png` |
| 5.8 | Clash detection flow | `Week3/Charts/Clash_detection_flow.png` |
| 5.9 | Deployment view | `Week3/Charts/Deployment view (conceptual)-2026-05-24-144109.png` |

---

## List of Tables

Key tables appear within chapters (research questions, literature matrix, requirements, MoSCoW, evaluation metrics, automated test coverage, aims checklist).

---

---

# Chapter 1 — Introduction


---

## 1.1 Background

Universities rely on fixed semester timetables for lectures, laboratories, and examinations, yet everyday academic work also depends on **ad-hoc meetings**: student–lecturer consultations, project supervision, group coursework discussions, and administrative coordination. These interactions are frequently arranged through email, messaging applications, shared calendars, and informal room booking. Such practices can produce clashes, delays, and under-utilised rooms (McKay, Morton and Maltbie, 2017; Song, Ashktorab and Malone, 2025).

Generic corporate scheduling tools (for example Microsoft Outlook or Google Calendar) expose free/busy information and support general-purpose meetings, but they do not inherently encode **university-specific** constraints such as teaching loads, examination blackout periods, room capacity policies, or academic roles. Traditional institutional timetabling systems, by contrast, optimise semester-scale course and examination schedules and offer limited support for rapid, user-driven ad-hoc booking with intelligent clash handling.

Recent advances in artificial intelligence (AI), including constraint-based validation and natural language processing (NLP), create opportunities for scheduling assistants that interpret conversational requests while enforcing academic rules. This dissertation investigates that opportunity through the design, implementation, and empirical evaluation of **UniSchedule AI**, an intelligent university meeting scheduler.

---

## 1.2 Research problem and motivation

The practical problem addressed by this project is the difficulty of coordinating ad-hoc academic meetings without introducing participant or room conflicts, and without relying solely on lengthy manual negotiation. The problem is motivated by information systems and applied AI concerns: socio-technical coordination overhead, trustworthy automation, and the gap between theoretical timetabling research and deployable student–lecturer tools.

### 1.2.1 Measurable research problems

| ID | Research problem | Research question | Measurement approach |
|----|------------------|-------------------|----------------------|
| **P1** | Difficulty managing ad-hoc meetings in academic environments | **RQ1:** To what extent do students and lecturers experience difficulty scheduling ad-hoc academic meetings? | Survey (frequency, time spent); optional task observation |
| **P2** | Resource conflicts and scheduling inefficiencies | **RQ2:** How prevalent are timetable clashes and resource conflicts in university meeting scheduling? | Clash rate in controlled test scenarios; survey on clash frequency |
| **P3** | Limitations of generic scheduling platforms | **RQ3:** Do generic scheduling tools fail to satisfy academic constraints (exams, teaching load, room capacity)? | Constraint violation count vs academic-aware engine |
| **P4** | Time wastage from manual coordination | **RQ4:** Does AI-assisted scheduling reduce coordination time compared with manual methods? | Paired comparison: manual vs UniSchedule task completion time |
| **P5** | Impact on productivity and collaboration | **RQ5:** Does intelligent scheduling improve user satisfaction and perceived academic productivity? | UAT satisfaction scores; optional analytics on meeting patterns |

---

## 1.3 Research gap

Existing approaches exhibit complementary limitations:

| Area | Limitation |
|------|------------|
| **Commercial schedulers** | Designed for corporate workflows; weak support for academic roles, exam periods, and ad-hoc university meetings |
| **Traditional timetable systems** | Focus on fixed semester/module timetabling; limited ad-hoc meeting intelligence |
| **Academic optimisation research** | Strong theoretical work on timetabling and constraint satisfaction; limited integration into practical, user-facing systems |
| **NLP assistants** | Growing use in general domains; limited research on NLP-driven scheduling within educational institutions |
| **Clash and resource management** | Often manual or fragmented across email, spreadsheets, and room booking tools |

**Gap statement:** There is a gap between generic scheduling tools and university-specific operational needs for intelligent, ad-hoc, constraint-aware meeting management with NLP interaction, real-time clash detection, and empirical evaluation in an academic context. UniSchedule AI addresses this gap through a practical system plus measurable evaluation. A fuller critical synthesis is presented in Chapter 2.

---

## 1.4 Aim and objectives

### 1.4.1 Aim

To design, implement, and evaluate an intelligent university meeting scheduling platform that reduces coordination overhead and scheduling clashes by combining academic-aware constraints with hybrid AI (NLP interpretation and deterministic validation).

### 1.4.2 Objectives

1. Review literature on university timetabling, meeting coordination, constraint satisfaction, and NLP scheduling assistants, and articulate a research gap.
2. Elicit and prioritise requirements (MoSCoW) for students and lecturers, traced to RQ1–RQ5.
3. Design a secure web architecture (Next.js, Laravel, MySQL, Sanctum) with clear separation of NLP interpretation and constraint validation.
4. Implement meeting management, clash detection, room allocation, and hybrid natural-language booking.
5. Evaluate the artefact using automated tests, a comparative manual versus AI-assisted study, and user acceptance testing, supported by survey and interview data where ethics approval permits.
6. Critically assess outcomes against the original aim and propose future work.

---

## 1.5 Research contribution

This project contributes:

1. **Academic-aware intelligent scheduling** — constraints for availability, room capacity, and policy rules (for example examination blackouts).
2. **Hybrid AI integration** — deterministic constraint and clash validation combined with NLP (or LLM-assisted) parsing of natural language meeting requests.
3. **Real-time clash detection** — temporal, participant, and room conflict identification with alternative slot suggestions.
4. **Automated resource allocation** — room assignment under capacity and availability rules.
5. **Empirical evaluation** — primary data (survey/interviews) and experimental comparison of manual versus AI-assisted scheduling, reported in Chapter 7.

Optional hypotheses (to be confirmed or rejected in Chapter 7):

- **H1:** UniSchedule detects and prevents more scheduling clashes than manual coordination in equivalent scenarios.
- **H2:** AI-assisted scheduling completes booking tasks in less time than manual methods.
- **H3:** Users report higher satisfaction when intelligent alternative slots are offered.

---

## 1.6 Development methodology and modelling techniques

The project adopts an **incremental prototype** software development approach within a **design science** framing (Hevner et al., 2004): an IT artefact is built and evaluated against defined metrics. Modelling techniques include:

- Stakeholder personas and MoSCoW prioritisation (Chapter 4)
- System context, component, use case, entity–relationship, sequence, and workflow diagrams (Chapter 5)
- Requirements traceability matrix linking functional requirements to research questions and implementation evidence (Appendix D)

The technology stack is: **Next.js** (TypeScript) frontend, **Laravel** REST API, **MySQL**, and **Laravel Sanctum** authentication. NLP is invoked from Laravel; scheduling decisions are validated deterministically before persistence.

---

## 1.7 Scope and limitations

**In scope (Must-have):** authentication and roles; meeting create/update/cancel; clash detection; academic constraints; hybrid NLP booking; room allocation; evaluation study and dissertation documentation.

**Out of scope (Future Work):** voice assistant; native mobile application; LMS integration; machine learning preference learning; multi-campus enterprise deployment.

Limitations include a pilot-scale deployment, English-language NLP in version 1, and reliance on sample timetable and room data where full institutional integration is unavailable. Primary data collection depends on ethics approval and participant recruitment; incomplete data will be reported honestly in Chapter 7.

---

## 1.8 Outline of subsequent chapters

| Chapter | Content |
|---------|---------|
| **2** | Literature review and research gap |
| **3** | Research methodology and evaluation design |
| **4** | Requirements and system analysis |
| **5** | System design (architecture, data, AI flows) |
| **6** | Implementation of the artefact |
| **7** | Testing, evaluation, and findings |
| **8** | Legal and ethical considerations |
| **9** | Conclusion, critical reflection, and future work |

References follow Chapter 9. Appendices contain research instruments, the requirements traceability matrix, a glossary, and a short user guide.

---

---

# Chapter 2 — Literature Review


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


---

---

# Chapter 3 — Methodology


---

## 3.1 Introduction

This chapter describes the research methodology for UniSchedule AI, an applied research project that combines artefact development with empirical evaluation. The methodology aligns with research questions RQ1–RQ5 (Chapter 1) and the evaluation framework detailed in Chapter 7. Legal and ethical procedures are summarised here and expanded in Chapter 8.

---

## 3.2 Research paradigm and approach

| Element | Choice | Rationale |
|---------|--------|-----------|
| **Paradigm** | Pragmatism / applied research | Delivers a working system plus measurable outcomes |
| **Strategy** | Design and creation + experiment | Prototype + comparative manual versus AI study |
| **Data** | Mixed methods | Survey (quantitative) + interviews (qualitative) + system metrics |

The project does not claim generalisable theory alone; it contributes an **evaluated artefact** and evidence on scheduling efficiency in an academic context, consistent with design science research in information systems (Hevner et al., 2004).

### 3.2.1 Methodology phases

| Phase | Activities | Outputs |
|-------|------------|---------|
| **1. Literature review** | Systematic search; critical synthesis; Harvard referencing | Chapter 2; literature matrix |
| **2. Requirements gathering** | Document analysis; survey and interviews | Requirements specification; traceability (Appendix D) |
| **3. System design** | Architecture, ER, use cases, workflows, AI flows | Chapter 5; design diagrams |
| **4. AI model design** | Constraints; NLP pipeline; hybrid decision logic | AI design section; diagrams |
| **5. Development** | Incremental implementation (Next.js, Laravel, MySQL) | Prototype; Git repository |
| **6. Testing** | Unit, integration, system, UAT | Test reports (Chapter 7) |
| **7. Evaluation** | Metrics; manual versus AI study; statistical summary | Results chapter; charts |

---

## 3.3 Research questions and methods map

| RQ | Question | Primary method | Secondary method |
|----|----------|----------------|------------------|
| RQ1 | Ad-hoc meeting difficulty | Online survey (target n ≥ 20) | Interviews (3–5) |
| RQ2 | Clash prevalence | Controlled test scenarios (≥20) | Survey Q6–Q7 |
| RQ3 | Academic constraint compliance | Constraint violation count in tests | Literature comparison |
| RQ4 | Manual versus AI coordination time | Paired comparative experiment | Interview themes |
| RQ5 | Satisfaction / productivity | UAT questionnaire (5–8 users) | Survey Q10–Q12 |

---

## 3.4 Primary data collection

### 3.4.1 Survey

- **Instrument:** Appendix A
- **Sample:** Students and lecturers (target n ≥ 20)
- **Ethics:** Information sheet and consent before launch (Appendix C; Chapter 8)
- **Analysis:** Descriptive statistics; Likert means; thematic coding for open text
- **Status:** Instruments prepared (Appendix A); administration follows ethics confirmation (Chapter 8).

### 3.4.2 Semi-structured interviews

- **Guide:** Appendix B
- **Sample:** 3–5 participants (mixed roles)
- **Analysis:** Thematic analysis; link themes to the requirements traceability matrix (Appendix D)
- **Status:** Guide prepared (Appendix B); recruitment follows ethics confirmation.

---

## 3.5 System development methodology

Development follows an **incremental prototype** model aligned with a twelve-week plan:

| Sprint | Deliverable |
|--------|-------------|
| Week 4 | Auth, meeting CRUD, clash detection, form UI |
| Week 5 | NLP pipeline v1, parse → confirm → book |
| Week 6 | End-to-end vertical slice polish |
| Week 7+ | Test expansion, UAT, comparative study |

**Version control:** Git; tagged release at submission (`v1.0-submission`). Modelling techniques include use cases, entity–relationship diagrams, sequence diagrams, and workflow charts (Chapter 5).

---

## 3.6 Hybrid AI design methodology

UniSchedule AI uses a **hybrid architecture** informed by Patra et al. (2021) and Wijerathne et al. (2025):

1. **Interpretation layer** — NLP/LLM or rule-based parser extracts intent and entities from natural language.
2. **Validation layer** — Deterministic Laravel services enforce academic constraints and clash detection before database commit.
3. **Confirmation layer** — The user reviews parsed fields in the UI (no silent booking).

This separation ensures reproducible evaluation: the constraint engine can be tested independently of NLP variability.

**Implementation artefacts:**

- `NlpSchedulingService` — parse text → structured meeting proposal
- `POST /api/v1/meetings/parse-nlp` — proposal plus clash preview
- `SchedulingService` / `ClashDetectionService` — authoritative persist and validation path

Parser mode is exposed as `parser: "llm" | "rules"` for transparency in demos and evaluation.

---

## 3.7 Evaluation methodology

### 3.7.1 Technical evaluation

| Metric | Method | Target week |
|--------|--------|-------------|
| Scheduling accuracy | ≥20 scripted scenarios versus ground truth | Week 7+ |
| Clash detection rate | Injected conflict test set | Week 7+ |
| API response time | Mean and p95 on parse/book endpoints | Week 10 |

### 3.7.2 Comparative study (RQ4)

| Element | Description |
|---------|-------------|
| **Design** | Within-subjects or between-subjects comparison — manual (email/spreadsheet template) versus UniSchedule AI |
| **Tasks** | 3–5 standardised booking scenarios (Chapter 7) |
| **Measures** | Completion time, errors/clashes, subjective difficulty (1–5) |
| **Analysis** | Mean/median; paired t-test or Wilcoxon if sample size allows (confirm with supervisor) |

### 3.7.3 User acceptance testing (RQ5)

- 5–8 participants; moderated tasks; satisfaction Likert or System Usability Scale (SUS)
- Pilot then full analysis; results reported in Chapter 7

---

## 3.8 Validity, reliability, and limitations

| Concern | Mitigation | Limitation |
|---------|------------|------------|
| Construct validity | Metrics tied explicitly to RQs | Prototype may not reflect full production load |
| Internal validity | Same scenarios for manual versus AI | Learning effect if within-subjects |
| External validity | Mixed student/lecturer sample | Single-institution generalisation |
| Reliability | Automated clash tests; documented scripts | NLP parser variance with LLM |

---

## 3.9 Ethics and data management

- Minimal personal data (role, scheduling opinions)
- Anonymised reporting; pseudonyms for interviews
- Secure storage; deletion after marking unless consent for retention
- Full procedures: Chapter 8 and Appendix C

Primary data collection involving students, lecturers, or staff proceeds only after following the University of Canterbury ethics process (or as directed by the supervisor).

---

## 3.10 Chapter summary

This chapter established a pragmatic, design-science methodology combining incremental software development with mixed-methods evaluation. Research questions map to survey, interview, automated testing, comparative experiment, and UAT instruments. The following chapter presents requirements and system analysis derived from stakeholders, MoSCoW prioritisation, and (where available) primary data themes.

---

---

# Chapter 4 — Requirements and System Analysis


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

Primary-data themes (email back-and-forth, double-booking, trust in AI, form versus natural language preference) are mapped in Appendix D as responses arrive after ethics-approved collection.

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

---

# Chapter 5 — System Design


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

---

# Chapter 6 — Implementation


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
| Documentation | `docs/` supervisor pack and dissertation report |
| Testing | `php artisan test` for backend feature/unit suites |
| Release | Tag `v1.0-submission` at freeze |

---

## 6.11 Chapter summary

The implemented artefact provides authenticated meeting management, deterministic clash and constraint checking, room allocation, and hybrid natural-language booking with human confirmation. The following chapter describes testing strategies and empirical evaluation against RQ1–RQ5.

---

---

# Chapter 7 — Testing and Evaluation

## 7.1 Introduction

This chapter reports how UniSchedule AI has been tested and how it is evaluated against research questions RQ1–RQ5. Evaluation combines **automated technical testing** (completed for core scheduling behaviours), **prepared primary-data instruments** (survey, interviews, ethics pathway), and a **specified comparative and user-acceptance design** for behavioural measures. Participant-facing studies had not been administered at the time of writing; results that depend on human participants are therefore described as planned rather than claimed.

---

## 7.2 Evaluation framework and metrics

| Metric | Definition | Method | Research link | Status in this report |
|--------|------------|--------|---------------|------------------------|
| **Clash detection correctness** | Known conflicts correctly identified | Automated feature tests | RQ2, RQ3 | Reported (Section 7.4) |
| **NLP parse behaviour** | Intent, participants, times, room/mode handling | Automated API tests | RQ3, NLP | Reported (Section 7.4) |
| **Catalog and delivery** | Users/rooms listing; Jitsi/external modes | Automated API tests | Usability, FR9 | Reported (Section 7.4) |
| **Scheduling accuracy (expanded)** | ≥20 scripted scenarios versus ground truth | Extend test suite | RQ3, RQ4 | Design complete; suite to be expanded |
| **Response time** | Mean and p95 for schedule endpoints | Performance script | NFR1 | Design complete; not yet measured |
| **Task completion time** | Manual versus AI-assisted booking | Comparative study | RQ4 | Design complete; not yet run |
| **User satisfaction** | Likert or SUS after UAT | UAT questionnaire | RQ5 | Design complete; not yet run |
| **Survey attitudes** | Difficulty, clash frequency, AI trust | Online survey (Appendix A) | RQ1, RQ2, RQ5 | Instruments ready; not yet administered |

---

## 7.3 Testing strategy

| Level | Scope | Method | Progress |
|-------|--------|--------|----------|
| **Feature / service** | Clash detector, NLP parse, catalog, meeting delivery | PHPUnit (`php artisan test`) | Implemented for core scenarios (Section 7.4) |
| **Integration** | NLP → clash preview → booking path | API feature tests | Partial (parse and clash paths covered) |
| **System** | End-to-end UI workflows | Manual supervisor demos (Weeks 4–6) | Demonstrated: login, form book, NLP parse–confirm–book, clash alternatives |
| **Performance** | Latency under load | Scripted requests | Planned |
| **UAT** | Representative users, scripted tasks | Observation + questionnaire | Planned after ethics |
| **Security** | Unauthenticated access, validation | Automated auth checks + manual review | Auth required on protected routes (tested for NLP and catalog) |

---

## 7.4 Automated technical results (completed)

Automated tests are implemented under `backend/tests/Feature/` and exercise the Laravel services and API. The following scenarios are covered.

### 7.4.1 Clash detection (`ClashDetectionTest`) — RQ2, RQ3

| Test | Behaviour verified |
|------|--------------------|
| Overlapping participant meetings | Detects participant-type clash when a user is already booked in an overlapping interval |
| Non-overlapping times | Returns no clash when the same participant has a non-overlapping meeting |
| Within availability window | Allows a meeting that falls inside a declared availability window |
| Outside availability window | Detects an availability-type clash when the meeting falls outside the window |

These tests support **H1** at the technical level: the engine can identify participant and availability conflicts that manual coordination often discovers only after the fact. Room double-booking and policy (exam blackout) checks are implemented in `ClashDetectionService` and exercised through the booking API; expanding the automated suite to twenty or more named scenarios remains recommended before final submission.

### 7.4.2 Natural language parsing (`NlpParseMeetingTest`) — hybrid AI

| Test | Behaviour verified |
|------|--------------------|
| Authentication required | Unauthenticated `POST /api/v1/meetings/parse-nlp` returns 401 |
| Online / Jitsi mode ignores campus room | Rule parser extracts intent `book`, participant (e.g. Dr Jane Lecturer), start/end times, and clears room when meeting mode is online |
| Online keyword ignores room | Utterances containing “online” do not bind a campus room |
| Empty text validation | Empty `text` returns validation errors |
| Clash preview without room | After an existing online meeting is booked, parse-nlp returns a structured proposal and a boolean `has_clashes` for participant conflicts |

Parser mode is exposed as `rules` when no LLM key is configured, supporting reproducible evaluation. When an OpenAI-compatible key is present, the service may use an LLM path; critical validation still occurs in Laravel before persist.

### 7.4.3 Catalog API (`CatalogTest`)

| Test | Behaviour verified |
|------|--------------------|
| Lists users and rooms | Authenticated user receives other users and rooms for booking pickers |
| Authentication required | Unauthenticated catalog access is rejected |

### 7.4.4 Meeting delivery (`MeetingDeliveryTest`)

| Test | Behaviour verified |
|------|--------------------|
| Jitsi mode | Creates a meeting with an auto-generated UniSchedule/Jitsi join URL |
| External link mode | Accepts an external HTTPS meeting URL |
| External URL required | Rejects external mode without a URL |

### 7.4.5 Summary of technical evaluation

Fourteen focused feature tests currently document core Must-have behaviour for clash detection, hybrid NLP interpretation, catalog support, and meeting delivery. Manual end-to-end demos (documented in project demo scripts) confirm that students and lecturers can register or log in, book via form or natural language with confirmation, receive clash feedback and alternative slots, and join online meetings. These results address the **technical** components of RQ2 and RQ3. They do not yet replace a full twenty-scenario accuracy matrix or performance benchmarks (NFR1), which remain part of the evaluation plan.

---

## 7.5 Primary data instruments (prepared, not yet administered)

Survey and interview instruments are complete and appear in Appendices A and B. The ethics checklist and consent wording appear in Appendix C. At the time of writing:

- Ethics pathway confirmation with the supervisor was still required before launch.
- No survey responses or interview transcripts had been collected.
- Therefore **no participant statistics, quotes, or satisfaction scores are reported**.

This is an honest limitation of the present report, not an absence of research design. Once administered, survey items Q3–Q5 address RQ1, Q6–Q7 address RQ2, and Q10–Q12 address RQ5; interview themes will update the requirements traceability matrix (Appendix D).

---

## 7.6 Comparative study design (RQ4) — planned

The comparative study tests whether UniSchedule AI reduces coordination time and clashes compared with manual scheduling.

| Element | Description |
|---------|-------------|
| **Conditions** | (A) Manual — email or spreadsheet template; (B) UniSchedule AI (form and/or NLP path) |
| **Tasks** | (1) Book a consultation with limited lecturer availability; (2) group meeting with room capacity ≥ 4; (3) attempt a conflicting booking; (4) reschedule; (5) optional natural-language booking |
| **Participants** | 5–8 users (mix of students and lecturers), after ethics approval |
| **Measures** | Completion time, errors/clashes, subjective difficulty (1–5) |
| **Analysis** | Mean/median comparison; paired tests if sample size allows (supervisor guidance) |

Results of this study are **not available in this report** because the study has not yet been run. The design is fully specified so that findings can be inserted without changing the methodology chapter.

---

## 7.7 User acceptance testing (RQ5) — planned

UAT will use scripted tasks aligned with FR3–FR7 (create meeting, clash handling, NLP confirm, alternatives, personal meeting list). Sessions of 15–30 minutes will record success, errors, and post-task satisfaction (Likert or SUS). Pilot then full analysis will follow ethics approval. No UAT scores are claimed here.

HCI features already implemented to support acceptance include dual input modes (form and natural language), confirm-before-commit for NLP proposals, and clickable alternative slots—consistent with human–AI interaction guidance (Amershi et al., 2019).

---

## 7.8 Discussion: progress against research questions

| RQ | Current answer based on completed work |
|----|----------------------------------------|
| **RQ1** | Not yet answered empirically. Survey and interview instruments are ready to measure perceived difficulty and coordination effort. |
| **RQ2** | Partially answered at the technical level: automated tests show the system detects participant overlap and availability violations; survey items on clash frequency remain to be administered. |
| **RQ3** | Partially answered: academic constraints (availability, capacity, policy rules) are enforced in the scheduling engine and reflected in tests and booking rejection behaviour; a larger scenario suite will strengthen the claim. |
| **RQ4** | Not yet answered. Comparative study design is specified; timing data require participants. |
| **RQ5** | Not yet answered. UAT and survey trust/satisfaction items are prepared. |

### Relation to literature

Technical results align with the hybrid pattern advocated in the literature: NLP for interpretation and deterministic validation for commitment (Patra et al., 2021; Wijerathne et al., 2025). Design science framing (Hevner et al., 2004) is satisfied by delivering an artefact plus an evaluation plan that combines technical and behavioural metrics. Coordination overhead (McKay et al., 2017) motivates RQ4; that comparison remains the principal outstanding empirical contribution.

### Hypotheses

| Hypothesis | Status |
|------------|--------|
| H1 — more clashes prevented than manual coordination | Supported in principle by automated clash detection; comparative human study pending |
| H2 — AI-assisted booking faster than manual | Pending comparative study |
| H3 — higher satisfaction with alternative slots | Pending UAT |

---

## 7.9 Limitations of the evaluation to date

- Primary data collection awaits ethics confirmation and recruitment.
- Automated coverage is focused rather than exhaustive (fewer than twenty named scenarios).
- Performance (p95 latency) has not been measured under load.
- Single-institution pilot context limits generalisation.
- NLP quality may vary when an external LLM is enabled; rule-based mode supports reproducible demos and tests.

---

## 7.10 Chapter summary

UniSchedule AI has been evaluated technically through automated feature tests covering clash detection, hybrid NLP parsing, catalog access, and meeting delivery, complemented by end-to-end supervisor demos. Primary research instruments and a full comparative/UAT design are in place for RQ1, RQ4, and RQ5, but participant results are not yet available and are not invented in this report. The next chapter addresses legal and ethical obligations governing both the software and the research process.

---

# Chapter 8 — Legal and Ethical Considerations


---

## 8.1 Introduction

This chapter addresses legal and ethical issues relevant to UniSchedule AI as both a software system and a research project involving human participants. Module guidance requires explicit treatment of legal and ethical considerations; where an issue does not apply, that is stated.

---

## 8.2 Legal considerations

### 8.2.1 Data protection

The system stores personal data including names, email addresses, roles, availability windows, and meeting metadata (participants, times, rooms). Processing of such data engages data protection principles under applicable New Zealand privacy law (Privacy Act 2020) and, where relevant to comparative discussion, principles analogous to the UK GDPR (lawfulness, purpose limitation, data minimisation, security, and storage limitation).

**Application in UniSchedule AI:**

- Collect only data necessary for scheduling and evaluation (name, email, role, availability, meeting details).
- Restrict meeting visibility to organisers and participants.
- Use password hashing and Sanctum-protected API routes.
- Do not expose lecturer personal calendars publicly.
- For research data, retain only until dissertation submission plus an agreed period (Appendix C), then delete unless consent for retention is given.

Participants in surveys and interviews are informed of purpose, voluntary participation, and anonymisation (Appendix C).

### 8.2.2 Computer misuse

Unauthorised access to computer systems is prohibited under applicable computer misuse legislation (for example, in the UK, the Computer Misuse Act 1990; analogous offences exist in New Zealand under the Crimes Act). The project does not involve penetration testing of third-party systems without authorisation.

**Application in UniSchedule AI:**

- Authentication is required for protected API routes.
- Role-based access limits actions (for example, only organisers update or cancel their meetings).
- Security testing is limited to the project’s own application (auth bypass and role escalation checks on the prototype).
- API keys for optional LLM services are stored server-side only, never in the browser.

### 8.2.3 Intellectual property and third-party materials

Third-party libraries (Next.js, Laravel, and dependencies) are used under their respective open-source licences. Diagrams, literature, and any adapted figures are acknowledged via Harvard references. LLM providers’ terms of service apply when an external API key is configured.

### 8.2.4 Statement on other legal issues

No additional legal regimes (for example medical device regulation or financial services regulation) apply to this academic scheduling prototype. Calendar synchronisation with Google or Microsoft (Should-have / Future Work) would require compliance with those providers’ OAuth and API terms if implemented.

---

## 8.3 Ethical considerations

### 8.3.1 Research ethics (human participants)

Primary data collection involves students, lecturers, or staff through:

- An online survey (target n ≥ 20)
- Semi-structured interviews (3–5 participants)
- User acceptance testing and comparative booking tasks (5–8 participants)

These activities proceed only after following the **University of Canterbury** ethics process (or as directed by the supervisor). Low-risk surveys about scheduling practices may qualify for exempt or expedited review; the supervisor confirms the pathway. Approval references, when obtained, are recorded in project notes.

**Ethical principles applied:**

| Principle | Application |
|-----------|-------------|
| Informed consent | Information sheet and consent statements (Appendix C) |
| Voluntary participation | Right to withdraw without penalty |
| Confidentiality | Anonymised reporting; interview pseudonyms (P1, P2, …) |
| Minimal risk | No sensitive health or assessment data; scheduling opinions only |
| Data security | Password-protected storage; limited retention |

This dissertation contains **no participant data** until collection is complete and approved. Instruments are provided in Appendices A–C.

### 8.3.2 AI ethics and trustworthy automation

Hybrid AI introduces ethical obligations around transparency and user control:

- NLP proposals are **confirmed by the user** before booking (no silent commits).
- Parser mode (`llm` or `rules`) can be disclosed for evaluation transparency.
- Deterministic clash and constraint checks reduce the risk of harmful incorrect bookings.
- Users are not deceived about AI involvement in interpretation.

These choices align with human–AI interaction guidance emphasising appropriate trust and confirmation (Amershi et al., 2019).

### 8.3.3 Academic integrity and AI-assisted writing

Where university policy requires disclosure of AI tools used in producing the dissertation, the author states that AI assistance (for example Cursor) was used for **structuring documents and organising literature**, and that the author **verified** references, scope, technical decisions, and all claims. Wording should be adjusted to the official University of Canterbury policy before submission.

---

## 8.4 Security and reliability (operational ethics)

Reliable systems reduce harm from failed or conflicting bookings:

- Database transactions for booking commits where appropriate
- Logging of errors and clash events
- No silent clash failures (errors shown to the user)
- Regular version control and tagged releases

Security measures (Sanctum, hashing, validation, HTTPS in deployment) are described in Chapters 5 and 6.

---

## 8.5 Chapter summary

Legal considerations centre on data protection, computer misuse prevention, and third-party licensing. Ethical considerations centre on informed consent for primary research, anonymisation, and trustworthy hybrid AI with human confirmation. The final chapter critically evaluates the project against its aims and outlines future work.

---

---

# Chapter 9 — Conclusion and Future Work

## 9.1 Introduction

This chapter critically evaluates UniSchedule AI against the aim and objectives stated in Chapter 1, summarises contributions and limitations, and outlines future work. Assessment distinguishes **what has been delivered** (artefact, design, methodology, instruments, automated tests) from **what remains for primary-data evaluation** (survey, interviews, comparative study, UAT).

---

## 9.2 Summary of work completed

UniSchedule AI is a research-led web platform for ad-hoc university meeting scheduling. The project has delivered:

- A literature-informed research gap and five measurable research questions (Chapters 1–2)
- A design-science methodology and evaluation framework (Chapter 3)
- MoSCoW requirements and a requirements traceability matrix (Chapter 4, Appendix D)
- System design with architecture, data model, and hybrid AI flows (Chapter 5)
- A working implementation: Sanctum authentication and roles; meeting create/update/cancel; clash detection; availability and capacity constraints; room catalog; hybrid NLP booking with confirm-before-commit; alternative slot suggestions; online meeting delivery (Jitsi and external links) (Chapter 6)
- Automated feature tests and manual end-to-end demos (Chapter 7)
- Legal and ethical analysis and research instruments (Chapter 8, Appendices A–C, F)

The technology stack is Next.js, Laravel, MySQL, and Laravel Sanctum, with optional OpenAI-compatible NLP and a rule-based fallback.

---

## 9.3 Aims and objectives checklist

| Objective | Outcome |
|-----------|---------|
| 1. Literature review and research gap | Completed (Chapter 2) |
| 2. Requirements (MoSCoW) traced to RQ1–RQ5 | Completed (Chapter 4; Appendix D) |
| 3. Secure web architecture design | Completed (Chapter 5) |
| 4. Implement meetings, clash, rooms, hybrid NLP | Completed as a vertical-slice prototype (Chapter 6) |
| 5. Evaluate with tests, comparative study, UAT, survey/interviews | **Partially completed:** automated tests and demos done; participant studies designed and instrumented but not yet administered (Chapter 7) |
| 6. Critical assessment and future work | This chapter |

**Overall aim:** To design, implement, and evaluate an intelligent university meeting scheduling platform that reduces coordination overhead and scheduling clashes by combining academic-aware constraints with hybrid AI.

**Assessment versus aim:** The design and implementation objectives have been met for Must-have scope. Technical evaluation shows that clash detection and hybrid NLP interpretation behave as specified under automated tests. Full evaluation of coordination-time reduction and user satisfaction (RQ4, RQ5), and of perceived scheduling difficulty in the target population (RQ1), awaits ethics-approved primary data collection. The project therefore delivers a research-ready artefact and partial evaluation, with a clear path to complete the empirical claims.

---

## 9.4 Contributions

1. **Practical artefact** — a deployable prototype for student–lecturer ad-hoc meeting booking with academic constraints and online delivery options.
2. **Hybrid AI pattern** — NLP/LLM or rule-based interpretation separated from deterministic clash and constraint validation, with mandatory user confirmation.
3. **Evaluation framework** — metrics and instruments for RQ1–RQ5, plus automated tests for core scheduling behaviours.
4. **Research positioning** — explicit gap between semester timetabling, corporate calendars, and NLP assistants (Chapter 2).
5. **Traceability** — requirements linked to research questions and implementation evidence (Appendix D).

---

## 9.5 Critical reflection

### Strengths

- Clear separation of interpretation and validation supports trustworthy AI and reproducible testing.
- MoSCoW prioritisation kept scope aligned with a final-year timeframe.
- Requirements traceability links software features to research questions.
- Dual booking paths (form and NLP) enable fair comparative timing for RQ4 once participants are recruited.
- Honest reporting of incomplete primary data avoids overstating findings.

### Weaknesses and limitations

- Pilot-scale data and sample rooms/timetables limit external validity.
- Automated test coverage should be expanded toward twenty or more named scenarios.
- Primary data and behavioural evaluation results were not available at the time of writing.
- Should-have features (calendar synchronisation, analytics dashboard) were deferred.
- NLP quality depends on configuration; rule fallback covers demos and tests but not all natural utterances.

### Lessons learned

- Research-led projects require early ethics planning; instruments alone do not produce results without approval and recruitment.
- Hybrid AI is more defensible for academic assessment than end-to-end LLM booking.
- Incremental delivery (auth → clash → NLP → polish → delivery modes) reduced integration risk.

---

## 9.6 Future work

| Enhancement | Rationale |
|-------------|-----------|
| Administer survey, interviews, comparative study, and UAT | Complete RQ1, RQ4, RQ5 |
| Expand automated scenario suite and performance tests | Strengthen RQ2, RQ3, NFR1 |
| Calendar synchronisation (Google/Outlook) | Reduce double entry |
| Analytics dashboard | Support utilisation analysis for RQ5 |
| Voice-based scheduling assistant | Accessibility |
| Machine learning preference prediction | Personalised slot ranking |
| Native mobile application | On-the-go booking |
| LMS integration | Institutional embedding |
| Multi-campus enterprise deployment | Scale and policy administration |

---

## 9.7 Concluding remarks

UniSchedule AI addresses a practical and research-relevant problem: ad-hoc academic meeting coordination under university constraints. The project has produced a working hybrid-AI web system, a documented research design, and technical evidence that clash detection and natural-language interpretation operate as intended. Completing primary data collection will allow definitive answers to the remaining research questions and a final judgement on whether hybrid AI reduces coordination overhead in this academic context. Until then, the contribution stands as a design-science artefact with partial evaluation and a fully specified path to empirical completion.

---

# References

All sources cited in the dissertation are listed below in **Harvard** style. Before submission: replace `[Date]` access dates; verify journal details against the University of Canterbury Harvard guide; add any new sources introduced during literature expansion.

---

Amershi, S., Weld, D., Vorvoreanu, M. and others (2019) 'Guidelines for human-AI interaction', in *Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems*, New York: ACM, pp. 1–13. doi: 10.1145/3290605.3300233.

Burke, E., Elliman, D., Ford, P. and Weare, R. (1996) 'Examination timetabling in British Universities: a survey', in Burke, E. and Ross, P. (eds) *Practice and Theory of Automated Timetabling*. Berlin: Springer, pp. 113–127.

Burke, E.K. and Petrovic, S. (2002) 'Recent research directions in automated timetabling', *European Journal of Operational Research*, 140(2), pp. 266–280. doi: 10.1016/S0377-2217(02)00069-3.

Carter, M.W. and Laporte, G. (1996) 'Recent developments in practical examination timetabling', in Burke, E. and Ross, P. (eds) *Practice and Theory of Automated Timetabling*. Berlin: Springer, pp. 3–21.

Hevner, A.R., March, S.T., Park, J. and Ram, S. (2004) 'Design science in information systems research', *MIS Quarterly*, 28(1), pp. 75–105.

Lach, G.W. and Lübbecke, M.E. (2008) 'Curriculum based course timetabling: new solutions to Udine benchmark instances', *Annals of Operations Research*, 194(1), pp. 405–419.

Legéay, M., Merceron, A., Schiemann, R. and others (2022) 'A constraint language for university timetabling problems', *Annals of Mathematics and Artificial Intelligence*. Available at: https://leria-info.univ-angers.fr/~marc.legeay/publi/2022_constraint_language_for_university_timetabling_problems.pdf (Accessed: [Date]).

McKay, K.N., Morton, T.E., Maltbie, T.A. and Huzurmayan, A. (2017) 'Scheduling the scheduling task: a time-management perspective on scheduling', *Cognition, Technology & Work*. doi: 10.1007/s10111-017-0443-1.

Microsoft Corporation (2024) 'Get free/busy schedule of Outlook calendar users and resources', *Microsoft Graph documentation*. Available at: https://learn.microsoft.com/en-us/graph/outlook-get-free-busy-schedule (Accessed: [Date]).

Müller, T., Rudová, H. and Müllerová, Z. (2025) 'Real-world university course timetabling at the International Timetabling Competition 2019', *Journal of Scheduling*, 28(2), pp. 247–267. doi: 10.1007/s10951-023-00801-w.

Patra, B., Fufa, C., Bhattacharya, P. and Lee, C. (2021) 'To schedule or not to schedule: extracting task specific temporal entities and associated negation constraints', *arXiv preprint* arXiv:2012.02594. Available at: https://arxiv.org/abs/2012.02594 (Accessed: [Date]).

Petrovic, S. and Burke, E.K. (2004) 'University timetabling', in Leung, J.Y.-T. (ed.) *Handbook of Scheduling: Algorithms, Models, and Performance Analysis*. Boca Raton, FL: CRC Press, ch. 45.

Romano, N.C. and Nunamaker, J.F. (2001) 'Meeting analysis: findings compared', *Group Decision and Negotiation*, 10(2), pp. 117–137.

Schaerf, A. (1999) 'A survey of automated timetabling', *Artificial Intelligence Review*, 13(2), pp. 87–127. doi: 10.1023/A:1006576209967.

Song, J., Ashktorab, Z. and Malone, T.W. (2025) 'Togedule: scheduling meetings with large language models and adaptive representations of group availability', *Proceedings of the ACM on Human-Computer Interaction*, 9(7), article CSCW332. doi: 10.1145/3757513.

Wijerathne, O., Nimasha, A., Fernando, D., de Silva, N. and Perera, S. (2025) 'ScheduleMe: multi-agent calendar assistant', *arXiv preprint* arXiv:2509.25693. Available at: https://arxiv.org/abs/2509.25693 (Accessed: [Date]).

---

## In-text citation quick guide (Harvard)

- One author: (Schaerf, 1999)
- Two authors: (Burke and Petrovic, 2002)
- Three or more authors: (Müller et al., 2025)
- Direct quote: include page number if available — e.g. (Patra et al., 2021, p. 4)
- Web/API: (Microsoft, 2024)

## Bibliography note

A **reference list** contains only works cited in the text (this file). A **bibliography** may additionally list background reading not cited. Unless the module handbook requires a separate bibliography, submit this reference list only.

## Sources to verify / add before submission

| Author(s) | Status |
|-----------|--------|
| Vlachogiannis et al. (2024) — LLM calendar assistants survey | Mentioned in earlier drafts; verify and add if cited |
| Ducheneaut and Bellotti (2001) | Cited via Song et al. (2025); add full entry if quoted directly |
| Privacy Act 2020 (NZ) / Computer Misuse Act 1990 (UK) | Add formal legal citations if required by markers |

---

---

# Appendix A — Survey Questionnaire

**Target sample:** n ≥ 20 (students and lecturers)  
**Estimated time:** 5–10 minutes  
**Platform:** Google Forms, Microsoft Forms, or Qualtrics

**Before launch:** Insert ethics information sheet and consent (see Appendix C).

---

## Section A — Demographics

**Q1. Your role at the university** (single choice)

- Student (undergraduate)
- Student (postgraduate)
- Lecturer / academic staff
- Professional staff (administration, IT, etc.)
- Other: ___

**Q2. How often do you schedule ad-hoc academic meetings?** (single choice)

- Never
- Less than once a month
- 1–3 times per month
- Weekly or more

---

## Section B — Scheduling difficulties (RQ1)

**Q3. How difficult is it to find a suitable time for ad-hoc meetings with students/lecturers?** (Likert 1–5)

1 = Very easy · 5 = Very difficult

**Q4. On average, how many emails or messages do you exchange before a meeting is confirmed?** (single choice)

- 0–1
- 2–4
- 5–9
- 10 or more

**Q5. How much time do you typically spend coordinating a single ad-hoc meeting?** (single choice)

- Less than 5 minutes
- 5–15 minutes
- 16–30 minutes
- More than 30 minutes

---

## Section C — Clashes and resources (RQ2)

**Q6. How often do scheduling clashes occur (double-booked people or rooms)?** (Likert 1–5)

1 = Never · 5 = Very often

**Q7. Which clash types have you experienced?** (multiple choice)

- Same person booked twice
- Room double-booked
- Meeting outside teaching availability
- Conflict with exam or assessment period
- None of the above

**Q8. How satisfied are you with current room booking tools at the university?** (Likert 1–5)

1 = Very dissatisfied · 5 = Very satisfied

---

## Section D — Tools and AI expectations (RQ5)

**Q9. Which tools do you currently use for meeting scheduling?** (multiple choice)

- Email
- Microsoft Outlook / Teams
- Google Calendar
- WhatsApp / messaging apps
- Spreadsheets
- University timetabling / room system
- Other: ___

**Q10. Would you trust an AI-assisted scheduler that checks clashes before confirming?** (Likert 1–5)

1 = Strongly disagree · 5 = Strongly agree

**Q11. Would you use natural language input (e.g. "Book supervision with Dr Smith Tuesday at 2pm")?** (single choice)

- Yes, frequently
- Yes, sometimes
- Unsure
- No

**Q12. What is most important in a university meeting scheduler?** (rank top 3)

- Clash detection
- Room allocation
- Lecturer availability
- Easy mobile access
- Natural language booking
- Integration with Outlook/Google Calendar

---

## Section E — Open comment (optional)

**Q13. Describe one frustrating scheduling experience at university.** (free text, optional)

---

## Analysis plan

| Question | Analysis |
|----------|----------|
| Q3, Q5 | Mean/median difficulty; themes for RQ1 |
| Q6, Q7 | Clash frequency distribution; RQ2 |
| Q10, Q11 | AI trust/acceptance; RQ5 |
| Q13 | Thematic coding (workflows, pain points) |

Export responses to CSV; link themes to the requirements traceability matrix (Appendix D).

---

---

# Appendix B — Semi-Structured Interview Guide

**Target:** 3–5 participants (mix of students and lecturers)  
**Duration:** 20–30 minutes  
**Format:** In person or video call (Zoom/Teams)

---

## Before the session

1. Send Appendix C information sheet 24–48 hours ahead
2. Confirm consent and recording preference
3. Assign pseudonym (P1, P2, …) for notes
4. Schedule at least **3 students** and **2 lecturers** if possible

### Scheduling template (email)

> Subject: UniSchedule AI research interview (20–30 min)
>
> Hi [Name],
>
> I'm [Your name], a final-year student at UC working on UniSchedule AI — a research project on university meeting scheduling. I'm looking for 3–5 volunteers for a short interview about how you currently schedule ad-hoc meetings.
>
> The session takes 20–30 minutes, can be done via Zoom, and your responses will be anonymised in my dissertation. I've attached an information sheet. Would any of these times work: [Option A], [Option B]?
>
> Thank you,  
> [Your name]

---

## Introduction (2 min)

- Thank participant; restate purpose and voluntary nature
- Confirm consent and recording
- Explain: no right/wrong answers; looking for real workflows

---

## Core questions

### A. Current workflow (RQ1)

1. Walk me through how you last arranged an ad-hoc meeting with a student/lecturer.
2. What tools do you use (email, calendar, messaging)? Why those?
3. What takes the most time — finding a slot, finding a room, or getting everyone to respond?

### B. Clashes and constraints (RQ2)

4. How often do clashes happen (people or rooms double-booked)?
5. Are there university rules that make scheduling harder (exams, teaching hours, room capacity)?
6. What happens when a clash is discovered — how do you fix it?

### C. Manual vs automated scheduling (RQ4)

7. If you had a system that proposed times and checked clashes automatically, what would you need to trust it?
8. Would you prefer typing a form or describing the meeting in natural language? Why?
9. What would make you **not** use an AI-assisted scheduler?

### D. Satisfaction and productivity (RQ5)

10. How does scheduling friction affect your academic work or teaching?
11. What one feature would most improve your scheduling experience?

### E. Wrap-up (3 min)

12. Anything else you think is important for a university meeting scheduler?
13. May I contact you for a short UAT session later in the project? (optional)

---

## Interviewer notes template

| Field | Record |
|-------|--------|
| Pseudonym | P_ |
| Role | student / lecturer |
| Date | |
| Key workflow steps | |
| Clash examples | |
| Trust / AI concerns | |
| Quotable themes | |
| Link to requirements | FR_ |

---

## Thematic coding (after 3+ interviews)

| Theme | Example quote | Requirement link |
|-------|---------------|------------------|
| Email back-and-forth | | FR3 booking |
| Room capacity ignored | | FR6 / FR9 room allocation |
| Distrust of auto-booking | | FR7 NLP confirm step |

Update Appendix D as themes emerge. Do not invent quotes.

---

---

# Appendix C — Ethics Checklist


---

## C.1 Purpose

This checklist supports ethics confirmation before launching the **survey** (target n ≥ 20) and **semi-structured interviews** (3–5 participants) described in Chapters 3 and 7.

---

## C.2 University of Canterbury pathway

| Action | Notes |
|--------|-------|
| Confirm with supervisor whether **Human Ethics Committee** review is required | Low-risk student/lecturer surveys about scheduling practices may qualify for **Category A / exempt** review — supervisor decides |
| If required, submit via UC Human Ethics Committee portal | Include project title, RQs, instruments, recruitment, storage |
| Attach **Participant Information Sheet** and **Consent Form** (templates below) | Plain language; right to withdraw |
| Store approval reference number in project notes | e.g. `HEC-2026-XXXX` |

**Ask supervisor:** "Is my survey + 3–5 interviews exempt, or do I need full HEC application?"

---

## C.3 Participant information sheet (summary)

Include in survey preamble and send before interviews:

- **Project title:** UniSchedule AI — Intelligent University Meeting Scheduler (Final Year Project)
- **Researcher:** [Your name], [email]
- **Supervisor:** [Supervisor name]
- **Purpose:** Understand scheduling difficulties and evaluate a prototype scheduling tool
- **What you will do:** Complete a 5–10 minute survey **or** a 20–30 minute interview
- **Voluntary:** You may stop at any time without penalty
- **Confidentiality:** Responses anonymised in the dissertation; no names in published results
- **Data storage:** Encrypted/local storage until project completion; deleted after marking unless you consent to retention
- **Contact:** [Your email] for questions or withdrawal

---

## C.4 Consent statement (survey)

> I am 18 or older. I have read the information sheet. I understand my participation is voluntary and I may withdraw without penalty. I consent to anonymous use of my responses in this research project.

☐ I agree to participate

---

## C.5 Consent statement (interview)

> I consent to a semi-structured interview about academic meeting scheduling. I understand the session may be audio-recorded for analysis only, transcripts will be anonymised, and I may skip any question or stop the interview at any time.

☐ I agree to participate  
☐ I agree to audio recording (optional — take notes only if declined)

---

## C.6 Data handling

| Data type | Storage | Retention |
|-----------|---------|-----------|
| Survey responses | Google Forms / Qualtrics export → password-protected folder | Until dissertation submission + 6 months |
| Interview audio/notes | Encrypted drive; pseudonym IDs (P1, P2…) | Same |
| Demographics | Role only (student/lecturer); no student ID numbers | Aggregated in dissertation |

**Do not collect:** passwords, full timetables with third-party personal data, or unnecessary contact details.

---

## C.7 Recruitment channels

- University student/lecturer mailing lists (with permission)
- Supervisor networks
- Peer networks (Computer Science / Engineering)
- **Avoid:** Cold messaging strangers; incentivised responses without ethics approval

---

## C.8 Sign-off (complete after supervisor meeting)

| Item | Done | Date |
|------|------|------|
| Supervisor confirmed ethics pathway | ☐ | |
| Information sheet approved | ☐ | |
| Survey published | ☐ | |
| Interview appointments scheduled (3–5) | ☐ | |
| Ethics reference logged | ☐ | |

---

---

# Appendix D — Requirements Traceability Matrix (RTM)

**Purpose:** Link MoSCoW requirements to research questions, implementation evidence, and primary-data themes (survey/interviews). Update the **Primary data** column as responses arrive. Do not invent themes or *n*.

**Sources:** Chapter 4; survey/interview instruments in Appendices A–B.

---

## D.1 Functional requirements

| ID | Requirement | Priority | RQ | Implementation evidence | Primary data theme (fill when available) | Status |
|----|-------------|----------|-----|-------------------------|------------------------------------------|--------|
| FR1 | Registration and secure login | Must | Security | Sanctum tokens; `AuthController`; login/register UI | | Done |
| FR2 | Role-based access (student, lecturer) | Must | Security | `users.role`; policies on meeting update/cancel | | Done |
| FR3 | Create meeting (title, participants, time, room) | Must | RQ1, RQ4 | `POST /meetings`; participant chips; room select | | Done |
| FR4 | Reschedule and cancel meetings | Must | RQ1 | `PUT` / `DELETE /meetings/{id}` (API); UI cancel polish | | Partial (API) |
| FR5 | Real-time clash detection | Must | RQ2 | `ClashDetectionService`; `POST /meetings/check-clash` | | Done |
| FR6 | Academic constraints (availability, capacity, exam) | Must | RQ3 | Availability windows; room capacity; exam blackout rule | | Done (basic) |
| FR7 | Natural language meeting requests | Must | NLP | `NlpSchedulingService`; `POST /meetings/parse-nlp`; NL tab | | Done (hybrid) |
| FR8 | Alternative time slots on clash | Should | RQ2, RQ5 | `suggestAlternativeSlots`; clickable UI buttons | | Done |
| FR9 | Room / resource allocation | Must | RQ2 | Room model; select from `GET /rooms`; capacity check | | Done (basic) |
| FR10 | Personal meeting list | Must | Usability | Dashboard `GET /meetings` | | Done |
| FR11 | Calendar sync | Should | Integration | — | | Deferred |
| FR12 | Analytics dashboard | Should | RQ5 | — | | Deferred or Week 8 |
| FR13 | Notifications | Could | Usability | — | | Won't (this FYP) |
| FR14 | Admin config of rooms/policies | Could | RQ3 | Seeded rooms/rules only | | Minimal |

---

## D.2 Non-functional requirements

| ID | Requirement | Evidence / plan | Status |
|----|-------------|-----------------|--------|
| NFR1 | Schedule response &lt; 3s | Measure p95 in evaluation (Chapter 7) | Pending |
| NFR2 | Sanctum + hashed passwords | Implemented | Done |
| NFR3 | Minimal personal data; RBAC | Meeting list scoped to user | Done |
| NFR4 | Usable by non-technical users | Form + NL confirm flow; UAT | In progress |
| NFR5 | No silent clash failures | ValidationException on clashes; UI alerts | Done |
| NFR6 | Modular services | Auth, NLP, Scheduling, Clash, Catalog | Done |
| NFR7 | Pilot cohort scale | Local prototype | Pending eval |
| NFR8 | Modern browsers | Next.js app | Done |

---

## D.3 Survey / interview theme placeholders

Map themes here after ethics launch.

| Theme ID | Theme (example labels) | Linked FR | Linked RQ | Notes / n |
|----------|------------------------|-----------|-----------|-----------|
| T1 | Email back-and-forth / coordination time | FR3, FR7 | RQ1, RQ4 | |
| T2 | Double-booked people or rooms | FR5, FR8 | RQ2 | |
| T3 | Room capacity / finding rooms | FR9 | RQ2 | |
| T4 | Trust in auto-booking / AI | FR7 (confirm step) | RQ5 | |
| T5 | Preference for form vs natural language | FR3, FR7 | RQ5 | |

---

## D.4 Evaluation mapping

| Evaluation activity | Requirements exercised | RQ |
|---------------------|------------------------|-----|
| Pilot UAT (scripted tasks) | FR3, FR5, FR7, FR8, FR10 | RQ5 |
| Manual vs AI-assisted timing | FR3 vs FR7 path | RQ4 |
| Clash injection tests (≥20) | FR5, FR6 | RQ2, RQ3 |

---

## D.5 Update log

| Date | Change |
|------|--------|
| Week 6 | Initial RTM from implemented vertical slice |
| Dissertation report | Included as Appendix D |

---

---

# Appendix E — Glossary

| Term | Definition |
|------|------------|
| **Ad-hoc meeting** | A meeting arranged outside the fixed semester timetable (e.g. supervision, consultation, group project). |
| **Clash detection** | Automated identification of conflicting bookings (participant time overlap, room double-booking, policy violations). |
| **Constraint rule** | A policy encoded in the system (e.g. examination blackout period) that restricts valid meeting times. |
| **CSP** | Constraint Satisfaction Problem — formal model of variables, domains, and constraints used in scheduling research. |
| **Design science** | Research approach that builds and evaluates IT artefacts to solve practical problems (Hevner et al., 2004). |
| **Hybrid AI** | Architecture in which NLP/LLM interprets user input while deterministic rules validate and commit schedules. |
| **Laravel Sanctum** | Laravel package for API token (and SPA) authentication used between Next.js and the Laravel API. |
| **LLM** | Large Language Model — optional external service used to parse natural language booking requests. |
| **MoSCoW** | Prioritisation method: Must, Should, Could, Won't have. |
| **NLP** | Natural Language Processing — techniques for interpreting human language input. |
| **RQ** | Research question (RQ1–RQ5 in this dissertation). |
| **RTM** | Requirements Traceability Matrix — links requirements to RQs, implementation, and primary data. |
| **Sanctum token** | Bearer token issued at login and sent with API requests. |
| **SUS** | System Usability Scale — standardised usability questionnaire (optional for UAT). |
| **UAT** | User Acceptance Testing — evaluation with representative end users. |
| **Vertical slice** | End-to-end implementation of a thin path through all layers (UI → API → DB) for a core feature. |

---

---

# Appendix F — User Guide

**Audience:** Students and lecturers using the UniSchedule AI prototype.  
**Prerequisites:** Modern web browser; account credentials (or registration).

Local development URLs (default): frontend `http://localhost:3000`; API `http://localhost:8000/api/v1`. See project `SETUP.md` for installation.

---

## F.1 Register and log in

1. Open the application in a browser.
2. Choose **Register** to create an account (name, email, password, role: student or lecturer), or **Login** with existing credentials.
3. On success, the dashboard lists meetings for the signed-in user.

Demo accounts (seeded environments only; password `password`):

| Email | Role |
|-------|------|
| student@unischedule.test | student |
| lecturer@unischedule.test | lecturer |


---

## F.2 View meetings (dashboard)

1. After login, the **Dashboard** shows upcoming and past meetings.
2. Use **Join** where a meeting has an online room (UniSchedule/Jitsi opens in-app; external links open in a new tab).
3. Use **Meet now** (if available) to start an instant short meeting.


---

## F.3 Book a meeting (form)

1. Open **New meeting** (or equivalent navigation).
2. Enter **title**, **start** and **end** times.
3. Select **participants** and optional **room** from the lists.
4. Choose meeting delivery mode if prompted (in-person, UniSchedule/Jitsi, or external link).
5. Optionally run a clash check, then **Submit**.
6. If a clash is reported, review the message and click a **suggested alternative slot**, or change times manually and resubmit.


---

## F.4 Book a meeting (natural language)

1. On the new meeting page, open the **Natural language** tab.
2. Type a request, for example:  
   `Book a supervision with Dr Jane Lecturer next Tuesday at 2pm in ENG-101`
3. Choose **Parse** (or equivalent). The system fills the form fields and may show a clash preview.
4. **Review and edit** all fields. Do not assume the parse is perfect.
5. Confirm and submit using the same booking path as the form.

**HCI note:** The system never books silently from NLP alone; confirmation is required.


---

## F.5 Handling clashes

When a booking conflicts with an existing meeting, room, availability window, or policy rule:

1. Read the error or warning message.
2. Apply a suggested alternative slot, or choose new times.
3. Resubmit.

---

## F.6 Cancel or update a meeting

1. From the dashboard, open the meeting (organiser only for update/cancel).
2. Use **Cancel** or edit fields and save.
3. Non-organisers cannot modify others’ meetings.

---

## F.7 Troubleshooting

| Problem | Suggested action |
|---------|------------------|
| Cannot log in | Check email/password; ensure API is running |
| Empty participant/room lists | Confirm catalog APIs and seed data |
| NLP parse fails | Rephrase with name, day, and time; or use the form |
| Clash on every attempt | Check existing meetings and room availability |
| Join link missing | Ensure meeting mode and URL were set at booking |

---

## F.8 Privacy reminder

Meetings and personal data are visible only to authorised users. Do not share login credentials. Research participation (survey/interview/UAT) is separate and voluntary (Appendix C).

---
