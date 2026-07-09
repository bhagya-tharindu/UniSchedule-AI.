# UniSchedule AI — Literature Review

**Student:** [Your Full Name]  
**Student ID:** [Student ID]  
**Programme:** [Programme]  
**Supervisor:** [Supervisor Name]  
**Date:** [Date]  
**Document version:** 1.0 (Week 3 submission — draft chapter)

---

## Abstract

This literature review examines research on university scheduling, intelligent meeting coordination, constraint-based optimisation, natural language processing (NLP) for calendar systems, and resource allocation in higher education. The review identifies a gap between semester-level timetabling systems, generic corporate scheduling tools, and the need for academic-aware, ad-hoc meeting management with intelligent clash detection and empirical evaluation. The review informs the research design of **UniSchedule AI — Intelligent University Meeting Scheduler**.

**Keywords:** university scheduling, timetabling, constraint satisfaction, meeting coordination, natural language processing, intelligent systems, resource allocation.

---

## 1. Introduction

Scheduling is fundamental to university operations. While substantial research addresses **course and examination timetabling** at semester scale, everyday academic work also depends on **ad-hoc meetings** between students, lecturers, and administrators. These interactions are often coordinated manually through email, messaging tools, and informal room booking, which can produce clashes, delays, and under-utilised resources (McKay, Morton and Maltbie, 2017; Song, Ashktorab and Malone, 2025).

Recent advances in **artificial intelligence (AI)**, including constraint programming, optimisation, and large language models (LLMs), create opportunities for intelligent scheduling assistants that interpret natural language requests, enforce academic constraints, and detect conflicts in real time. However, the literature remains fragmented across operational research (timetabling), human–computer interaction (group scheduling), and NLP (temporal information extraction).

This review synthesises relevant work across five themes: (1) automated university timetabling; (2) constraint satisfaction and optimisation; (3) meeting coordination and calendar systems; (4) NLP and AI assistants for scheduling; and (5) resource allocation and university platforms. Section 6 presents a critical synthesis and research gap; Section 7 links findings to UniSchedule AI; Section 8 lists references in Harvard format.

---

## 2. Automated university timetabling

University timetabling is a well-established combinatorial optimisation problem. Schaerf (1999) provides a foundational survey, describing timetabling as assigning lectures between teachers and students over a fixed horizon (typically one week) subject to diverse constraints. The survey highlights solution techniques from operational research and artificial intelligence, including genetic algorithms, tabu search, simulated annealing, and **constraint satisfaction**.

Burke and Petrovic (2002) outline recent research directions, emphasising that university timetabling extends beyond examinations to course scheduling, multicriteria decision-making, and case-based reasoning. They argue for systems with greater **generality** and practical deployability—an aim shared by modern final-year and applied research projects. Petrovic and Burke (2004) further consolidate university timetabling within the broader scheduling literature, noting variant problem definitions across institutions and the centrality of hard and soft constraints.

Empirical studies of real universities reinforce the complexity of the problem. Burke et al. (1996) surveyed ninety-five British universities and reported diverse practices, manual and automated methods, and varying quality criteria for acceptable timetables. Carter and Laporte (1996) review practical examination timetabling developments, illustrating how institutional rules shape feasible solutions.

Benchmark competitions have driven methodological progress. The International Timetabling Competition 2019 (ITC 2019) defined a realistic course timetabling problem involving classes, rooms, student enrolment, and distribution constraints (Müller, Rudová and Müllerová, 2025). Winning and follow-up approaches employ **mixed-integer programming (MIP)**, graph-based formulations, and matheuristics to handle large instances (Müller, Rudová and Müllerová, 2025). Lach and Lübbecke (2008) demonstrate robust integer programming for curriculum-based course timetabling on benchmark instances from the University of Udine, achieving strong lower bounds and competitive solutions.

More recently, Legéay et al. (2022) propose a **domain-specific modelling language** for university timetabling that unifies course scheduling, resource allocation, and student sectioning. Their work compiles declarative rules into constraint programming models (e.g. MiniZinc), reflecting a trend toward explicit, verifiable constraint representation—relevant to academic-aware meeting schedulers that must encode availability, capacity, and policy rules.

### Critical comment

Timetabling research primarily targets **semester-scale** problems rather than **ad-hoc** meetings. Solutions are often batch-oriented and institution-specific, with limited support for conversational interaction or rapid rescheduling by individual students and lecturers. UniSchedule AI therefore does not duplicate full semester timetabling engines; instead, it applies constraint and clash-detection principles at the granularity of meetings and consultations.

---

## 3. Constraint satisfaction, optimisation, and clash detection

Constraint Satisfaction Problems (CSP) provide a formal basis for scheduling: variables (e.g. time slots, rooms), domains, and constraints (no overlap, capacity, availability). Schaerf (1999) and Burke and Petrovic (2002) document widespread use of CSP-related methods in timetabling. ITC 2019 instances explicitly combine hard constraints (feasibility) with soft constraints (penalties), a pattern mirrored in meeting scheduling where some rules are mandatory (exam blackout) and others are preferences (preferred room).

Clash detection is a specialised form of constraint checking. In university timetabling, **student conflicts** occur when a student cannot attend two classes simultaneously; analogous conflicts arise in ad-hoc scheduling when participants or rooms are double-booked. Müller, Rudová and Müllerová (2025) note that minimising student conflicts is a core objective in real-world timetabling—conceptually parallel to minimising participant and room clashes in meeting booking.

For implementation, modern solvers include MIP, SAT, and theorem provers such as Z3. Open-source academic schedulers (e.g. Z3-based course constraint frameworks) demonstrate how room, faculty, and time-slot constraints can be validated automatically before committing a schedule. UniSchedule AI adopts this principle: **deterministic validation** of proposals before acceptance, regardless of whether the user interface is form-based or NLP-driven.

### Critical comment

Optimisation literature often reports performance on benchmarks without delivering end-user systems for daily ad-hoc use. UniSchedule AI contributes by embedding constraint checking and clash detection in a **practical web application** intended for students and lecturers, with evaluation metrics such as clash reduction and scheduling accuracy.

---

## 4. Meeting coordination, calendars, and productivity

Separate from institutional timetabling, **group meeting scheduling** has been studied in human–computer interaction and information systems. Song, Ashktorab and Malone (2025) observe that existing tools (polls, shared calendars) are often **static**: every attendee sees the full option space, which increases cognitive load and partial or inconsistent availability responses. Their system, **Togedule**, uses LLMs to adaptively adjust the pool and presentation of time options, reducing attendee mental load and improving organiser decision speed in controlled experiments.

Coordination overhead is significant even before meetings occur. McKay, Morton and Maltbie (2017) studied how schedulers spend time interacting with stakeholders, finding unpredictable workflows and substantial **informational work** compared with decision-making—supporting the view that scheduling is not a single algorithmic step but a socio-technical process. Romano and Nunamaker (2001) and Ducheneaut and Bellotti (2001) (cited in Song et al., 2025) document inefficiencies in email-based coordination and calendar use, including back-and-forth messaging and burden on organisers.

Commercial platforms (e.g. Microsoft Outlook, Google Calendar) expose **free/busy** information via APIs, enabling programmatic availability queries (Microsoft, 2024). Such APIs support integration but do not encode **university-specific** constraints (teaching loads, exam periods, room policies) unless extended by custom application logic—motivating bespoke academic schedulers.

### Critical comment

Corporate calendar ecosystems optimise general-purpose meetings; they rarely enforce academic roles, room capacity rules, or intelligent alternative generation grounded in university policy. UniSchedule AI targets this contextual gap while optionally integrating external calendars as a secondary synchronisation layer.

---

## 5. Natural language processing and AI scheduling assistants

NLP enables users to express scheduling intent conversationally. Patra et al. (2021) present **SHERLOCK** (ScHeduling Entity Recovery by LOoking at Contextual Knowledge), which extracts **task-specific** date-time entities and **negation constraints** for meeting scheduling—outperforming generic temporal extraction by focusing only on entities relevant to booking. Their work reports substantial gains in F-score for scheduling-relevant entities, highlighting that general-purpose temporal parsers are insufficient for domain tasks.

LLM-based **multi-agent** calendar assistants represent a recent trend. Wijerathne et al. (2025) describe **ScheduleMe**, where a supervisory agent coordinates specialised agents for checking availability, creating, modifying, and deleting Google Calendar events via natural language. The architecture emphasises modularity, clarification dialogue, and mandatory conflict checking before creation—design patterns aligned with UniSchedule AI’s hybrid model (NLP for interpretation, deterministic rules for validation).

Song et al. (2025) extend LLM use to **adaptive group availability**, while Patra et al. (2021) focus on accurate temporal semantics. Together, these studies suggest a research-informed architecture: NLP/LLM layers handle parsing and disambiguation; backend services enforce constraints, clashes, and resource allocation.

### Critical comment

NLP scheduling research often targets **personal** or **corporate** calendars, not multi-role university environments with lecturers, students, and rooms. Few studies combine NLP meeting requests with **academic constraint engines** and empirical evaluation in higher education—a core contribution area for UniSchedule AI.

---

## 6. Resource allocation and university scheduling platforms

Room and resource allocation is integral to university scheduling. Legéay et al. (2022) model rooms, lecturers, students, and groups within a unified timetabling language, including capacity and compatibility constraints. ITC 2019 similarly penalises unsuitable room-time assignments (Müller, Rudová and Müllerová, 2025).

Industry platforms (e.g. integrated timetabling and room-booking systems for higher education) demonstrate demand for **self-service booking**, estate management, and analytics on occupancy versus booked capacity. Agentic campus prototypes (e.g. multi-agent room booking with calendar tools) illustrate emerging architectures but are often institution-specific research demonstrators rather than evaluated dissertation artefacts with defined research questions.

Analytics on room utilisation, meeting load, and peak periods can support research on collaboration patterns (RQ5 in UniSchedule AI). Such analytics require reliable event data and consistent clash handling—linking resource management literature to system evaluation.

### Critical comment

Commercial and prototype systems validate practical need but seldom publish **comparative empirical studies** (manual vs AI-assisted scheduling) in peer-reviewed form. UniSchedule AI addresses this through planned experimental evaluation and user acceptance testing.

---

## 7. Literature matrix

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

---

## 8. Critical synthesis and research gap

The literature reveals three largely separate streams:

1. **University timetabling (OR/AI)** — strong on constraints and optimisation, weak on ad-hoc user interaction and deployable student–lecturer interfaces.  
2. **Meeting coordination (HCI)** — strong on user burden and group tools, weak on academic rules and institutional resource policies.  
3. **NLP/LLM assistants** — strong on parsing and dialogue, weak on verified academic scheduling and published university evaluations.

**Research gap:** There is limited work that integrates **academic-aware constraints**, **real-time clash detection**, **automated resource allocation**, **NLP-based meeting requests**, and **empirical comparison with manual scheduling** within a single university-oriented system.

**UniSchedule AI contribution (proposed):**

- Hybrid AI: NLP/LLM interpretation + deterministic CSP/rule-based validation.  
- Ad-hoc academic meeting focus rather than full semester timetabling replacement.  
- Evaluation framework: scheduling accuracy, clash reduction, response time, user satisfaction, manual vs AI-assisted tasks.  
- Primary data from students and lecturers (planned Week 4 onward).

---

## 9. Conclusion

This review establishes that university scheduling research provides robust foundations in constraints, optimisation, and clash avoidance, while NLP and LLM research offers modern interaction paradigms. Meeting coordination studies confirm significant user overhead in manual and static tools. UniSchedule AI is positioned to bridge these areas through a practical, research-evaluated platform for intelligent university meeting scheduling.

The next phase of research will expand this review with additional sources from IEEE/ACM digital libraries, refine Harvard citations against the University of Canterbury guide, and connect survey and interview findings to requirements traceability.

---

## References (Harvard)

Burke, E., Elliman, D., Ford, P. and Weare, R. (1996) 'Examination timetabling in British Universities: a survey', in Burke, E. and Ross, P. (eds) *Practice and Theory of Automated Timetabling*. Berlin: Springer, pp. 113–127.

Burke, E.K. and Petrovic, S. (2002) 'Recent research directions in automated timetabling', *European Journal of Operational Research*, 140(2), pp. 266–280. doi: 10.1016/S0377-2217(02)00069-3.

Carter, M.W. and Laporte, G. (1996) 'Recent developments in practical examination timetabling', in Burke, E. and Ross, P. (eds) *Practice and Theory of Automated Timetabling*. Berlin: Springer, pp. 3–21.

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

## Appendix: In-text citation quick guide (Harvard)

- One author: (Schaerf, 1999)  
- Two authors: (Burke and Petrovic, 2002)  
- Three+ authors: (Müller et al., 2025)  
- Direct quote: include page number if available — e.g. (Patra et al., 2021, p. 4)  
- Web/API: (Microsoft, 2024)

**Before submission:** Replace `[Date]` in references with your access date; verify Legéay et al. (2022) journal details in your university Harvard guide; add 2–3 Canterbury-approved sources if required by your department.

---

*End of document*
