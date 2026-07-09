# Front Matter

**Status:** Skeleton draft — replace placeholders before submission.

---

## Title Page

**University of Canterbury**  
**[Programme]**  
**Modules U10834 / U10838 (IS40 / IP40)** — Individual Study / Individual Project

# UniSchedule AI: An Intelligent University Meeting Scheduler

**A dissertation submitted in partial fulfilment of the requirements for the degree of [Programme]**

**Student name:** [Your Full Name]  
**Student ID:** [Student ID]  
**Supervisor:** [Supervisor Name]  
**Date:** [Date]

---

## Abstract

*(Maximum 300 words. Self-contained; first impression for examiners.)*

Ad-hoc academic meetings between students and lecturers are often coordinated through email, messaging applications, and informal room booking. These practices can produce timetable clashes, delays, and inefficient use of rooms. Generic corporate scheduling tools provide limited support for university-specific constraints such as teaching availability, room capacity, and examination periods.

This dissertation presents **UniSchedule AI**, a research-led web platform for intelligent university meeting scheduling. The system combines academic-aware constraint handling, real-time clash detection, room allocation, and a hybrid artificial intelligence approach in which natural language processing interprets booking requests while deterministic backend rules validate feasibility before any meeting is stored. The artefact is implemented as a **Next.js** frontend and a **Laravel** REST API with **MySQL** storage and **Laravel Sanctum** authentication.

The research addresses five measurable questions concerning scheduling difficulty, clash prevalence, academic constraint compliance, coordination time under manual versus AI-assisted conditions, and user satisfaction. Methodology follows a design-science and mixed-methods strategy: literature synthesis, requirements analysis, incremental prototype development, automated technical testing, a comparative booking experiment, and user acceptance testing, supported by a survey and semi-structured interviews (subject to ethics approval).

*[PENDING DATA: one or two sentences summarising key evaluation findings once results are available.]*

The work contributes a practical, evaluated scheduling artefact and evidence on whether hybrid AI can reduce coordination overhead in an academic context, while identifying limitations and directions for future research.

**Word count (abstract):** *[count and confirm ≤300]*

**Keywords:** university scheduling; clash detection; natural language processing; hybrid AI; design science; higher education

---

## Acknowledgements

The author wishes to thank [Supervisor Name] for supervision and guidance throughout this project. Thanks are also due to participants who contributed survey responses and interviews *[if applicable; otherwise state: Primary data collection was not completed at the time of writing / no external participants contributed]*, and to family and friends for their support during the final year of study.

*[Edit to reflect actual help received. If no help was received from others, include a statement to that effect, as required by the module guidance.]*

---

## Table of Contents

*(Update page numbers in Word after assembly.)*

| Section | Page |
|---------|------|
| Abstract | |
| Acknowledgements | |
| Table of Contents | |
| List of Figures | |
| List of Tables | |
| Chapter 1 — Introduction | |
| Chapter 2 — Literature Review | |
| Chapter 3 — Methodology | |
| Chapter 4 — Requirements and System Analysis | |
| Chapter 5 — System Design | |
| Chapter 6 — Implementation | |
| Chapter 7 — Testing and Evaluation | |
| Chapter 8 — Legal and Ethical Considerations | |
| Chapter 9 — Conclusion and Future Work | |
| References | |
| Appendix A — Survey Questionnaire | |
| Appendix B — Interview Guide | |
| Appendix C — Ethics Checklist | |
| Appendix D — Requirements Traceability Matrix | |
| Appendix E — Glossary | |
| Appendix F — User Guide | |

---

## List of Figures

| Figure | Caption | Source |
|--------|---------|--------|
| 1.1 | System context (overview) | `Week3/Charts/System_context_diagram.png` |
| 5.1 | High-level architecture | `Week3/Charts/High-level architecture diagram-*.png` |
| 5.2 | Use case diagram | `Week3/Charts/Use case diagram-*.png` |
| 5.3 | Entity–relationship diagram | `Week3/Charts/Entity–Relationship_diagram.png` |
| 5.4 | Scheduling workflow | `Week3/Charts/Scheduling workflow-*.png` |
| 5.5 | AI / NLP decision flow | `Week3/Charts/AI NLP decision flow-*.png` |
| 5.6 | Clash detection flow | `Week3/Charts/Clash_detection_flow.png` |
| 5.7 | Sequence diagram — book meeting | `Week3/Charts/Sequence diagram — Book meeting-*.png` |
| 5.8 | Deployment view | `Week3/Charts/Deployment view-*.png` |
| 6.x | UI screenshots | `[INSERT SCREENSHOT]` |
| 7.x | Evaluation charts | `[PENDING DATA]` |

---

## List of Tables

| Table | Caption |
|-------|---------|
| 1.1 | Research questions and measurement approaches |
| 2.1 | Literature matrix |
| 3.1 | Research questions and methods map |
| 4.1 | Functional requirements |
| 4.2 | Non-functional requirements |
| 7.1 | Evaluation metrics |
| 7.2 | Technical test results | `[PENDING DATA]` |
| 7.3 | Manual vs AI-assisted comparison | `[PENDING DATA]` |
| 7.4 | UAT satisfaction summary | `[PENDING DATA]` |
| 9.1 | Aims and outcomes checklist |
