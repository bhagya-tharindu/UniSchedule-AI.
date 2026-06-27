# UniSchedule AI — Methodology (Chapter 3 Draft)

**Student:** [Your Full Name] | **ID:** [Student ID] | **Date:** [Date]  
**Status:** Week 5 draft (~40% complete)

---

## 1. Introduction

This chapter describes the research methodology for UniSchedule AI, an applied research project that combines artefact development with empirical evaluation. The methodology aligns with RQ1–RQ5 and the evaluation framework in [`06-evaluation-security-ethics.md`](06-evaluation-security-ethics.md).

---

## 2. Research paradigm and approach

| Element | Choice | Rationale |
|---------|--------|-----------|
| **Paradigm** | Pragmatism / applied research | Delivers a working system plus measurable outcomes |
| **Strategy** | Design and creation + experiment | Prototype + comparative manual vs AI study |
| **Data** | Mixed methods | Survey (quantitative) + interviews (qualitative) + system metrics |

The project does not claim generalisable theory alone; it contributes an **evaluated artefact** and evidence on scheduling efficiency in an academic context (Hevner et al., 2004 — design science framing, to verify with supervisor).

---

## 3. Research questions and methods map

| RQ | Question | Primary method | Secondary method |
|----|----------|----------------|------------------|
| RQ1 | Ad-hoc meeting difficulty | Online survey (n ≥ 20) | Interviews (3–5) |
| RQ2 | Clash prevalence | Controlled test scenarios (≥20) | Survey Q6–Q7 |
| RQ3 | Academic constraint compliance | Constraint violation count in tests | Literature comparison |
| RQ4 | Manual vs AI coordination time | Paired comparative experiment | Interview themes |
| RQ5 | Satisfaction / productivity | UAT questionnaire (5–8 users) | Survey Q10–Q12 |

---

## 4. Primary data collection

### 4.1 Survey

- **Instrument:** [`docs/research/survey-questionnaire.md`](../research/survey-questionnaire.md)
- **Sample:** Students and lecturers at UC (target n ≥ 20)
- **Ethics:** Information sheet + consent before launch ([`docs/research/ethics-checklist.md`](../research/ethics-checklist.md))
- **Analysis:** Descriptive statistics; Likert means; thematic coding for open text

### 4.2 Semi-structured interviews

- **Guide:** [`docs/research/interview-guide.md`](../research/interview-guide.md)
- **Sample:** 3–5 participants (mixed roles)
- **Analysis:** Thematic analysis; link themes to requirements traceability matrix

---

## 5. System development methodology

Development follows an **incremental prototype** model aligned with the 12-week plan ([`PROJECT-NOTES.md`](../PROJECT-NOTES.md) §6):

| Sprint | Deliverable |
|--------|-------------|
| Week 4 | Auth, meeting CRUD, clash detection, form UI |
| Week 5 | NLP pipeline v1, parse → confirm → book |
| Week 6 | End-to-end vertical slice polish |
| Week 7+ | Test expansion, UAT, comparative study |

**Version control:** Git; tagged release at submission (`v1.0-submission`).

---

## 6. Hybrid AI design methodology

UniSchedule AI uses a **hybrid architecture** (Patra et al., 2021; Wijerathne et al., 2025):

1. **Interpretation layer** — NLP/LLM or rule-based parser extracts intent and entities from natural language.
2. **Validation layer** — Deterministic Laravel services enforce academic constraints and clash detection before database commit.
3. **Confirmation layer** — User reviews parsed fields in the UI (no silent booking).

This separation ensures reproducible evaluation: the constraint engine can be tested independently of NLP variability.

**Week 5 implementation:**

- `NlpSchedulingService` — parse text → `ParsedMeetingRequest` DTO
- `POST /api/v1/meetings/parse-nlp` — proposal + clash preview
- Existing `SchedulingService` — authoritative persist path

---

## 7. Evaluation methodology

### 7.1 Technical evaluation

| Metric | Method | Target week |
|--------|--------|-------------|
| Scheduling accuracy | ≥20 scripted scenarios vs ground truth | Week 7 |
| Clash detection rate | Injected conflict test set | Week 7 |
| API response time | Mean and p95 on parse/book endpoints | Week 10 |

### 7.2 Comparative study (RQ4)

- **Design:** Within-subjects or between-subjects comparison — manual (email template) vs UniSchedule AI
- **Tasks:** 3–5 standardised booking scenarios (see `06-evaluation-security-ethics.md` §3.3)
- **Measures:** Completion time, errors/clashes, subjective difficulty (1–5)
- **Analysis:** Mean/median; paired t-test or Wilcoxon if sample allows (supervisor approval)

### 7.3 User acceptance testing (RQ5)

- 5–8 participants; moderated tasks; satisfaction Likert or SUS
- Pilot in Week 9; full analysis in Week 10–11

---

## 8. Validity, reliability, and limitations

| Concern | Mitigation | Limitation |
|---------|------------|------------|
| Construct validity | Metrics tied explicitly to RQs | Prototype may not reflect full production load |
| Internal validity | Same scenarios for manual vs AI | Learning effect if within-subjects |
| External validity | UC context; mixed student/lecturer sample | Single-institution generalisation |
| Reliability | Automated clash tests; documented scripts | NLP parser variance with LLM |

---

## 9. Ethics and data management

- Minimal personal data (role, scheduling opinions)
- Anonymised reporting; pseudonyms for interviews
- Secure storage; deletion after marking unless consent for retention
- See [`docs/research/ethics-checklist.md`](../research/ethics-checklist.md)

---

## 10. Chapter outline (remaining work)

- [ ] Expand design-science positioning with supervisor-approved citation
- [ ] Add sample size justification for survey and UAT
- [ ] Insert RTM link to survey/interview themes (Week 6)
- [ ] Add data analysis plan detail (SPSS/Excel/R — tool TBD)
- [ ] Harvard reference audit
- [ ] Confirm AI tool disclosure per UC policy in dissertation appendix

---

## References (Harvard — draft)

Hevner, A.R., March, S.T., Park, J. and Ram, S. (2004) 'Design science in information systems research', *MIS Quarterly*, 28(1), pp. 75–105.

Patra, B., Fufa, C., Bhattacharya, P. and Lee, C. (2021) 'To schedule or not to schedule: extracting task specific temporal entities and associated negation constraints', *arXiv preprint* arXiv:2012.02594.

Wijerathne, O., Nimasha, A., Fernando, D., de Silva, N. and Perera, S. (2025) 'ScheduleMe: multi-agent calendar assistant', *arXiv preprint* arXiv:2509.25693.

---

*End of draft*
