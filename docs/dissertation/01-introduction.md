# Chapter 1 — Introduction

**Student:** [Your Full Name] | **ID:** [Student ID] | **Date:** [Date]

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

*End of Chapter 1*
