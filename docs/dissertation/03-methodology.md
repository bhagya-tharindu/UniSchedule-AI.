# Chapter 3 — Methodology

**Student:** [Your Full Name] | **ID:** [Student ID] | **Date:** [Date]

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
- **Status:** Instruments ready; launch after ethics sign-off — **[PENDING DATA]**

### 3.4.2 Semi-structured interviews

- **Guide:** Appendix B
- **Sample:** 3–5 participants (mixed roles)
- **Analysis:** Thematic analysis; link themes to the requirements traceability matrix (Appendix D)
- **Status:** Guide ready; appointments after ethics — **[PENDING DATA]**

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

*End of Chapter 3*
