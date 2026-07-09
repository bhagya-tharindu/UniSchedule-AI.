# Chapter 8 — Legal and Ethical Considerations

**Student:** [Your Full Name] | **ID:** [Student ID] | **Date:** [Date]

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

*End of Chapter 8*
