# UniSchedule AI — System Design (Chapter 4 Draft)

**Student:** [Your Full Name] | **ID:** [Student ID] | **Date:** [Date]  
**Status:** Week 6 draft (expand from design pack diagrams)

---

## 1. Introduction

This chapter describes the architecture and design of UniSchedule AI, an intelligent university meeting scheduler. The design supports hybrid AI (NLP interpretation + deterministic constraint validation) and empirical evaluation of manual versus AI-assisted booking.

Detailed diagrams live in [`05-system-design-pack.md`](05-system-design-pack.md); this draft organises them into dissertation chapter form.

---

## 2. Design goals

| Goal | Design response |
|------|-----------------|
| Academic-aware scheduling | Clash and availability rules in Laravel services |
| Trustworthy AI | NLP proposes; user confirms; rules gate persist |
| Measurable evaluation | Clear form path vs NLP path for RQ4 timing |
| Secure API | Laravel Sanctum; role field on users |
| Maintainability | Thin controllers; domain services |

---

## 3. High-level architecture

```
Next.js (TypeScript)  --HTTPS/JSON-->  Laravel REST API  -->  MySQL
                                              |
                                    NlpSchedulingService
                                    SchedulingService
                                    ClashDetectionService
                                              |
                                    Optional OpenAI-compatible LLM
```

**Rationale:** Decoupled frontend/backend allows independent UI iteration and keeps LLM keys server-side only.

---

## 4. Component view

| Component | Responsibility |
|-----------|----------------|
| Next.js UI | Auth screens, dashboard, form + NL booking |
| Auth (Sanctum) | Register, login, bearer tokens |
| Catalog API | List users and rooms for booking UI |
| Meeting API | CRUD, parse-nlp, check-clash |
| NlpSchedulingService | Text → structured proposal (LLM or rules) |
| SchedulingService | Persist meetings; alternative slots |
| ClashDetectionService | Participant, room, availability, policy checks |
| MySQL | Users, meetings, rooms, availabilities, clash_records |

---

## 5. Data design (summary)

Core entities (see ER in design pack):

- **User** — name, email, role (`student` \| `lecturer`)
- **Meeting** — organizer, room, title, start/end, status
- **MeetingParticipant** — meeting_id, user_id, response
- **Room** — name, building, capacity, is_active
- **Availability** — user_id, day_of_week, start/end time
- **ConstraintRule** — e.g. exam blackout windows
- **ClashRecord** — logged conflicts for analysis

---

## 6. Key workflows

### 6.1 Form booking

1. User enters title, times, optional room and participants.  
2. Optional `POST /meetings/check-clash`.  
3. `POST /meetings` runs clash detection; rejects or saves.  

### 6.2 NLP booking (hybrid)

1. User enters natural language.  
2. `POST /meetings/parse-nlp` → structured proposal + clash preview.  
3. UI fills form; user edits and confirms.  
4. Same persist path as form booking.

### 6.3 Clash and alternatives

On conflict, `SchedulingService::suggestAlternativeSlots` proposes nearby free slots; UI applies a slot with one click.

---

## 7. AI / NLP design

| Layer | Technology | Role |
|-------|------------|------|
| Interpretation | OpenAI-compatible LLM **or** rule parser | Intent + entities |
| Validation | PHP services | Hard constraints |
| Confirmation | UI | Human-in-the-loop |

Parser mode is returned as `parser: "llm" | "rules"` for transparency in demos and evaluation.

---

## 8. Security design

- Sanctum personal access tokens from Next.js  
- Password hashing via Laravel  
- Meeting access limited to organizer/participants  
- No LLM keys in the browser  

See [`06-evaluation-security-ethics.md`](06-evaluation-security-ethics.md).

---

## 9. Remaining chapter work (Week 7+)

- [ ] Export draw.io versions of all mermaid diagrams  
- [ ] Sequence diagram screenshots in dissertation figures  
- [ ] Expand ER with attribute-level detail  
- [ ] Link RTM themes after survey responses  

---

*End of draft*
