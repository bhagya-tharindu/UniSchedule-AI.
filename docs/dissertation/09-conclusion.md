# Chapter 9 — Conclusion and Future Work

**Student:** [Your Full Name] | **ID:** [Student ID] | **Date:** [Date]

---

## 9.1 Introduction

This chapter critically evaluates UniSchedule AI against the aim and objectives stated in Chapter 1, summarises contributions and limitations, and outlines future work. Outcomes are related to research questions RQ1–RQ5; empirical claims remain provisional until Chapter 7 results are complete.

---

## 9.2 Summary of the project

UniSchedule AI is a research-led web platform for ad-hoc university meeting scheduling. The artefact combines:

- Academic-aware constraint handling and real-time clash detection
- Room allocation under capacity rules
- Hybrid AI: natural language interpretation with deterministic validation and user confirmation
- A Next.js frontend, Laravel REST API, MySQL storage, and Laravel Sanctum authentication

The research design links literature (Chapter 2), methodology (Chapter 3), requirements (Chapter 4), design and implementation (Chapters 5–6), evaluation (Chapter 7), and legal/ethical compliance (Chapter 8).

---

## 9.3 Aims and objectives checklist

| Objective | Outcome |
|-----------|---------|
| 1. Literature review and research gap | Completed in Chapter 2 (~60% at skeleton stage; expand before submission) |
| 2. Requirements (MoSCoW) traced to RQ1–RQ5 | Completed in Chapter 4; RTM in Appendix D |
| 3. Secure web architecture design | Completed in Chapter 5 |
| 4. Implement meetings, clash, rooms, hybrid NLP | Implemented (vertical slice); polish ongoing |
| 5. Evaluate with tests, comparative study, UAT, survey/interviews | Plan complete; **[PENDING DATA]** for results |
| 6. Critical assessment and future work | This chapter |

**Overall aim:** To design, implement, and evaluate an intelligent university meeting scheduling platform that reduces coordination overhead and scheduling clashes.

**Assessment versus aim:** [PENDING DATA — write after evaluation results. Example structure: The artefact demonstrates … Evaluation suggests … Limitations include …]

---

## 9.4 Contributions

1. **Practical artefact** — a deployable prototype for student–lecturer ad-hoc meeting booking with academic constraints.
2. **Hybrid AI pattern** — NLP/LLM or rule-based interpretation separated from deterministic clash and constraint validation.
3. **Evaluation framework** — metrics and instruments for RQ1–RQ5 (technical, comparative, UAT, survey/interview).
4. **Research positioning** — explicit gap between semester timetabling, corporate calendars, and NLP assistants (Chapter 2).

---

## 9.5 Critical reflection

### Strengths

- Clear separation of interpretation and validation supports trustworthy AI and reproducible testing.
- MoSCoW prioritisation kept scope aligned with a twelve-week FYP.
- Requirements traceability links software features to research questions.
- Dual booking paths (form and NLP) enable fair comparative timing for RQ4.

### Weaknesses and limitations

- Pilot-scale data and sample rooms/timetables limit external validity.
- Literature review requires further sources and Harvard audit before submission.
- Primary data and full evaluation results were not available at the skeleton stage.
- Should-have features (calendar sync, analytics dashboard) may be incomplete or deferred.
- NLP quality depends on LLM configuration; rule fallback covers demos but not all utterances.

### Lessons learned

- Research-led FYPs require early ethics planning; instruments alone are insufficient without approval and recruitment.
- Hybrid AI is more defensible for academic assessment than end-to-end LLM booking.
- Incremental delivery (auth → clash → NLP → polish) reduced integration risk.

---

## 9.6 Future work

The following items were explicitly out of scope (Won't have) or deferred Should-have features:

| Enhancement | Rationale |
|-------------|-----------|
| Voice-based scheduling assistant | Accessibility and hands-free booking |
| Machine learning preference prediction | Personalised slot ranking over time |
| Native mobile application | On-the-go booking |
| Smart classroom / IoT integration | Live room occupancy |
| AI chatbot for proactive suggestions | Organiser assistance |
| Full LMS integration (Moodle, etc.) | Institutional embedding |
| Calendar synchronisation (Google/Outlook) | Reduce double entry |
| Analytics dashboard | Support RQ5 with utilisation metrics |
| Multi-campus enterprise deployment | Scale and policy administration |

Future research could also enlarge the comparative study sample, run multi-institution trials, and publish controlled evaluations of hybrid NLP schedulers in higher education—addressing the evaluation gap identified in Chapter 2.

---

## 9.7 Concluding remarks

UniSchedule AI addresses a practical and research-relevant problem: ad-hoc academic meeting coordination under university constraints. By combining a working web artefact with a measurable evaluation plan, the project meets the expectation that final-year work contribute more than implementation alone. Completion of primary data collection and results analysis will allow definitive answers to RQ1–RQ5 and a final judgement on whether hybrid AI reduces coordination overhead in this academic context.

---

*End of Chapter 9*
