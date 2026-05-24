# UniSchedule AI — Evaluation, Security & Ethics

**Student:** [Your Full Name] | **ID:** [Student ID] | **Date:** [Date]

---

## 1. Evaluation framework overview

The project will be evaluated using **quantitative metrics**, **comparative experiments**, and **user acceptance testing**, as required for research-quality final year work. Results will be reported with tables and charts in the dissertation.

---

## 2. Evaluation metrics

| Metric | Definition | Target / method | Research link |
|--------|------------|-----------------|---------------|
| **Scheduling accuracy** | % of test cases where time, room, and participants match ground truth | ≥ 20 scripted scenarios | RQ3, RQ4 |
| **Clash detection rate** | % of known conflicts correctly identified | Injected clash test set | RQ2 |
| **False negative rate** | Clashes missed by system | Should approach 0 for critical rules | RQ2 |
| **Response time** | Server latency for schedule request (mean, p95) | Performance test script | NFR1 |
| **Task completion time** | Seconds to complete booking task | Manual vs AI comparison | RQ4 |
| **User satisfaction** | Likert scale or System Usability Scale (SUS) | Post-UAT questionnaire | RQ5 |
| **Recommendation acceptance** | % of suggested alternative slots accepted | Logged during UAT | RQ5 |
| **Task success rate** | % of UAT participants completing tasks without help | Moderated/unmoderated UAT | Usability |

---

## 3. Comparative study design (manual vs AI-assisted)

### 3.1 Objective

Test **RQ4** and **RQ2**: whether UniSchedule AI reduces coordination time and clashes compared with manual scheduling.

### 3.2 Design

| Element | Description |
|---------|-------------|
| **Tasks** | 3–5 standardized booking scenarios (e.g. book 30-min meeting with lecturer X next week, avoid known lecture slot) |
| **Conditions** | (A) Manual — email/spreadsheet template; (B) UniSchedule AI prototype |
| **Participants** | 5–8 users (mix of students/lecturers) for UAT; survey n ≥ 20 for broader attitudes |
| **Measures** | Time to complete; number of clashes/errors; subjective difficulty (1–5) |
| **Analysis** | Mean/median comparison; discuss paired t-test or Wilcoxon if sample size allows (confirm with supervisor) |

### 3.3 Example scenarios

1. Book a student–lecturer consultation when lecturer has limited availability.  
2. Book a group project meeting requiring room capacity ≥ 4.  
3. Attempt conflicting booking — system must detect clash.  
4. Reschedule existing meeting to new slot.  
5. (Optional) Natural language: *"Book a meeting with Dr Smith Tuesday afternoon."*  

---

## 4. Testing plan

| Level | Scope | Tools / method |
|-------|--------|----------------|
| **Unit** | Clash detector, constraint checker, date/time parser | Automated tests (Jest, pytest, etc.) |
| **Integration** | NLP → scheduler → database | API tests |
| **System** | End-to-end booking workflows | Manual + automated E2E |
| **Performance** | Response time under repeated requests | Script / k6 / Postman runner |
| **UAT** | Real users, scripted tasks | Observation + questionnaire |
| **Security** | Auth bypass attempts, role escalation | Manual test checklist |

---

## 5. User Acceptance Testing (UAT) plan

| Step | Activity |
|------|----------|
| 1 | Prepare UAT script aligned with FR3–FR7 |
| 2 | Recruit 5–8 participants (via survey pool or university contacts) |
| 3 | Conduct sessions (15–30 min each); record time and errors |
| 4 | Administer satisfaction questionnaire |
| 5 | Analyse and present results in dissertation Chapter 6 |

---

## 6. Survey and interviews (planned Week 4+)

**Not attached to this submission.**

| Instrument | Content | Sample |
|------------|---------|--------|
| **Survey** | Scheduling difficulties, clash frequency, room booking, tool satisfaction, AI expectations | Target n ≥ 20 |
| **Interviews** | Ad-hoc workflows, trust in AI, privacy concerns | 3–5 participants |

Survey themes align with supervisor feedback and support RQ1, RQ2, and RQ5.

---

## 7. Security and reliability

### 7.1 Authentication and access control

- **Laravel Sanctum** for API authentication between Next.js and Laravel (token-based or SPA cookie session, depending on deployment)  
- Password hashing via Laravel’s built-in hashing (bcrypt via `Hash` facade)  
- Protected API routes using `auth:sanctum` middleware  
- Role-based access control (student vs lecturer vs coordinator) using Laravel policies/gates or role field on `users` table  

### 7.2 Data privacy

- Collect only necessary personal data (name, email, role, availability)  
- Inform participants via ethics information sheet (Week 4)  
- No sharing of participant data outside research context  

### 7.3 API and calendar security

- Input validation on all API endpoints  
- HTTPS for deployment  
- OAuth tokens for calendar APIs stored encrypted; minimal scopes  

### 7.4 Reliability

- Database transactions for booking commits  
- Logging of errors and clash events  
- Regular Git pushes and tagged releases at milestones  

---

## 8. Ethics statement

Primary data collection involving students, lecturers, or staff will commence in **Week 4** after following the **University of Canterbury ethics process** (or as directed by the supervisor).

This submission contains **no participant data**. Survey and interview materials will be submitted for ethics review before distribution. Participation will be voluntary, anonymous where possible, and participants may withdraw at any time.

**Supervisor confirmation requested:** Is full ethics approval required before circulating the survey?

---

## 9. Future enhancements (dissertation section)

- Voice-based scheduling assistant  
- Machine learning for long-term preference prediction  
- Native mobile application  
- Smart classroom integration  
- AI chatbot for proactive meeting suggestions  
- Integration with university LMS platforms  

---

## 10. Evaluation timeline

| Week | Evaluation activity |
|------|---------------------|
| 4 | Finalize test scenarios; ethics for survey |
| 7 | Unit/integration tests for scheduler and clash |
| 9 | Pilot UAT |
| 10 | Comparative study (manual vs AI); performance tests |
| 11 | Write results chapter with charts |

---

*End of document*
