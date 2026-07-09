# Chapter 7 — Testing and Evaluation

**Student:** [Your Full Name] | **ID:** [Student ID] | **Date:** [Date]

**Note:** Results tables use `[PENDING DATA]` until automated tests, survey, UAT, and the comparative study are complete. Do not invent numbers.

---

## 7.1 Introduction

This chapter reports how UniSchedule AI was tested and evaluated. Evaluation combines **quantitative metrics**, **comparative experiments**, and **user acceptance testing**, as required for research-quality final year work. Findings are related to RQ1–RQ5 and to the original aim in Chapter 1.

---

## 7.2 Evaluation framework and metrics

| Metric | Definition | Target / method | Research link |
|--------|------------|-----------------|---------------|
| **Scheduling accuracy** | % of test cases where time, room, and participants match ground truth | ≥ 20 scripted scenarios | RQ3, RQ4 |
| **Clash detection rate** | % of known conflicts correctly identified | Injected clash test set | RQ2 |
| **False negative rate** | Clashes missed by system | Should approach 0 for critical rules | RQ2 |
| **Response time** | Server latency for schedule request (mean, p95) | Performance test script | NFR1 |
| **Task completion time** | Seconds to complete booking task | Manual versus AI comparison | RQ4 |
| **User satisfaction** | Likert scale or System Usability Scale (SUS) | Post-UAT questionnaire | RQ5 |
| **Recommendation acceptance** | % of suggested alternative slots accepted | Logged during UAT | RQ5 |
| **Task success rate** | % of UAT participants completing tasks without help | Moderated/unmoderated UAT | Usability |

---

## 7.3 Testing strategy

| Level | Scope | Tools / method | Status |
|-------|--------|----------------|--------|
| **Unit / feature** | Clash detector, NLP parse, meeting API | PHPUnit (`php artisan test`) | Partial — expand scenarios |
| **Integration** | NLP → scheduler → database | API feature tests | Partial |
| **System** | End-to-end booking workflows | Manual demos + automated E2E | In progress |
| **Performance** | Response time under repeated requests | Script / Postman / k6 | Pending |
| **UAT** | Real users, scripted tasks | Observation + questionnaire | Pending |
| **Security** | Auth bypass, role escalation | Manual checklist | Pending |

Existing automated coverage includes clash detection tests and NLP parse meeting tests (`ClashDetectionTest`, `NlpParseMeetingTest`, and related feature tests). Target: at least **20** scripted clash and scheduling scenarios before submission.

---

## 7.4 Technical test results

### 7.4.1 Scheduling accuracy and clash detection (RQ2, RQ3)

| Scenario category | Cases planned | Cases run | Pass | Fail | Notes |
|-------------------|---------------|-----------|------|------|-------|
| Participant overlap | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | |
| Room double-booking | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | |
| Availability window | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | |
| Capacity / policy | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | |
| NLP parse → valid book | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | |
| **Overall accuracy** | ≥20 | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | |

| Metric | Result |
|--------|--------|
| Clash detection rate | [PENDING DATA] |
| False negative rate (critical rules) | [PENDING DATA] |

**Figure 7.1 — Clash detection results chart** — `[PENDING DATA]`

### 7.4.2 Performance (NFR1)

| Endpoint | Mean (ms) | p95 (ms) | Target |
|----------|-----------|----------|--------|
| `POST /meetings` | [PENDING DATA] | [PENDING DATA] | &lt; 3000 ms |
| `POST /meetings/parse-nlp` | [PENDING DATA] | [PENDING DATA] | &lt; 3000 ms |
| `POST /meetings/check-clash` | [PENDING DATA] | [PENDING DATA] | &lt; 3000 ms |

---

## 7.5 Survey findings (RQ1, RQ2, RQ5)

Instrument: Appendix A. Target sample n ≥ 20.

| Item | Result |
|------|--------|
| Responses (n) | [PENDING DATA] |
| Role mix (student / lecturer / other) | [PENDING DATA] |
| Mean difficulty of ad-hoc scheduling (Q3) | [PENDING DATA] |
| Typical coordination time (Q5) | [PENDING DATA] |
| Clash frequency (Q6) | [PENDING DATA] |
| Trust in AI-assisted clash checking (Q10) | [PENDING DATA] |
| Willingness to use natural language (Q11) | [PENDING DATA] |

**Figure 7.2 — Survey summary charts** — `[PENDING DATA]`

Open-text themes (Q13) and links to requirements: **[PENDING DATA]** — update Appendix D.

---

## 7.6 Interview findings (RQ1, RQ4, RQ5)

Instrument: Appendix B. Target 3–5 participants.

| Pseudonym | Role | Key themes | Requirement links |
|-----------|------|------------|-------------------|
| [PENDING DATA] | | | |

Thematic summary: **[PENDING DATA]**

---

## 7.7 Comparative study: manual versus AI-assisted (RQ4)

### 7.7.1 Design

| Element | Description |
|---------|-------------|
| **Objective** | Test whether UniSchedule AI reduces coordination time and clashes compared with manual scheduling |
| **Tasks** | 3–5 standardised booking scenarios |
| **Conditions** | (A) Manual — email/spreadsheet template; (B) UniSchedule AI prototype |
| **Participants** | 5–8 users (mix of students/lecturers) |
| **Measures** | Time to complete; number of clashes/errors; subjective difficulty (1–5) |
| **Analysis** | Mean/median; paired t-test or Wilcoxon if sample size allows |

### 7.7.2 Example scenarios

1. Book a student–lecturer consultation when the lecturer has limited availability.
2. Book a group project meeting requiring room capacity ≥ 4.
3. Attempt a conflicting booking — the system must detect the clash.
4. Reschedule an existing meeting to a new slot.
5. (Optional) Natural language: *"Book a meeting with Dr Smith Tuesday afternoon."*

### 7.7.3 Results

| Scenario | Manual mean time (s) | AI mean time (s) | Manual errors/clashes | AI errors/clashes | Difficulty (manual / AI) |
|----------|----------------------|------------------|------------------------|-------------------|--------------------------|
| 1 | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] |
| 2 | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] |
| 3 | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] |
| 4 | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] |
| 5 | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] |
| **Overall** | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] | [PENDING DATA] |

**Figure 7.3 — Manual versus AI task completion time** — `[PENDING DATA]`

Statistical test (if applicable): **[PENDING DATA]**

---

## 7.8 User acceptance testing (RQ5)

| Step | Activity | Status |
|------|----------|--------|
| 1 | Prepare UAT script aligned with FR3–FR7 | Pending |
| 2 | Recruit 5–8 participants | Pending |
| 3 | Conduct sessions (15–30 min); record time and errors | Pending |
| 4 | Administer satisfaction questionnaire | Pending |
| 5 | Analyse and present results | Pending |

| Measure | Result |
|---------|--------|
| Task success rate | [PENDING DATA] |
| Mean satisfaction / SUS | [PENDING DATA] |
| Recommendation acceptance (alternative slots) | [PENDING DATA] |

**Figure 7.4 — UAT satisfaction summary** — `[PENDING DATA]`

HCI observations (confirm-before-commit, form versus NLP preference): **[PENDING DATA]**

---

## 7.9 Discussion: answering the research questions

| RQ | Summary answer | Evidence |
|----|----------------|----------|
| **RQ1** | [PENDING DATA] | Survey / interviews |
| **RQ2** | [PENDING DATA] | Clash tests / survey Q6–Q7 |
| **RQ3** | [PENDING DATA] | Constraint violation tests |
| **RQ4** | [PENDING DATA] | Comparative study |
| **RQ5** | [PENDING DATA] | UAT / survey Q10–Q12 |

### Relation to literature

Findings should be discussed as a three-way conversation between the literature (Chapter 2), the methodology (Chapter 3), and the results above. In particular:

- Coordination overhead (McKay et al., 2017) and RQ4 timing results.
- Hybrid AI patterns (Patra et al., 2021; Wijerathne et al., 2025) and observed NLP reliability / confirmation UX.
- Design science evaluation (Hevner et al., 2004) and the balance of technical versus behavioural metrics.

**Discussion narrative:** [PENDING DATA — write after results are available]

### Hypotheses

| Hypothesis | Outcome |
|------------|---------|
| H1 — more clashes prevented than manual | [PENDING DATA] |
| H2 — AI-assisted booking faster than manual | [PENDING DATA] |
| H3 — higher satisfaction with alternative slots | [PENDING DATA] |

---

## 7.10 Difficulties and limitations of evaluation

| Issue | Impact | Mitigation / note |
|-------|--------|-------------------|
| Ethics / recruitment delay | Survey and interview *n* may be below target | Report actual *n*; discuss limited generalisation |
| Prototype scale | Not production load | Frame as pilot evaluation |
| NLP variance (LLM) | Non-deterministic parse quality | Report parser mode; rule fallback for reproducibility |
| Within-subjects learning | May bias comparative times | Counterbalance order if used |
| Single institution | External validity limited | State explicitly |

---

## 7.11 Chapter summary

This chapter defined the evaluation framework, testing levels, and instruments for RQ1–RQ5. Technical, survey, interview, comparative, and UAT results will be completed as data become available. The next chapter addresses legal and ethical considerations governing both the software and the research process.

---

*End of Chapter 7*
