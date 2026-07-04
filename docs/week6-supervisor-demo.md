# Week 6 Supervisor Demo — End-to-End Vertical Slice

**Duration:** ~12 minutes  
**Goal:** Show the full path: **UI → Laravel API → NLP (optional LLM) → clash engine → MySQL → dashboard**

---

## 1. Setup

```powershell
cd D:\UniScheduleAI\backend
php artisan migrate --seed
php artisan serve
```

```powershell
cd D:\UniScheduleAI\frontend
npm run dev
```

Open `http://localhost:3000`  
Login: **student@unischedule.test** / **password**

Optional LLM: set `OPENAI_API_KEY` in `backend/.env` (badge shows **LLM** vs **Rule-based**).

---

## 2. Vertical-slice story (talking points)

```
User utterance / form
  → POST /meetings/parse-nlp  (NLP suggests structure)
  → User reviews fields + participants + room
  → POST /meetings/check-clash  (deterministic rules)
  → POST /meetings  (persist only if valid)
  → GET /meetings  (dashboard list)
```

**Hybrid AI:** NLP interprets; Laravel always validates before save.

---

## 3. Demo flow A — Form booking (~3 min)

1. **New meeting** → **Form** tab  
2. Title: `Project check-in`  
3. Weekday slot 10:00–11:00  
4. Room: **ENG-101**  
5. Participant: tap **Dr Jane Lecturer**  
6. **Check clashes** → green “no clashes”  
7. **Create meeting** → toast → appears on dashboard  

**Point:** Rooms and users load from API (`GET /rooms`, `GET /users`).

---

## 4. Demo flow B — Natural language (~4 min)

1. **Natural language** tab  
2. Utterance:

   > Book a supervision with Dr Jane Lecturer next Tuesday at 2pm in ENG-101

3. **Parse request** → badges (intent, parser, confidence)  
4. Form auto-fills; participant chip selected  
5. Review → **Create meeting**  

**Point:** Confirm-before-book; no silent AI booking.

---

## 5. Demo flow C — Clash + alternatives (~3 min)

1. Book a second meeting on the **same slot/room** (or overlapping participant)  
2. **Check clashes** → red messages  
3. Click an **Alternative slot** button → times update  
4. **Create meeting** on the free slot  

**Point:** FR8 alternative suggestions; supports RQ2 evaluation.

---

## 6. Research status to report

| Item | Status |
|------|--------|
| Vertical slice (NLP + clash + MySQL + UI) | Ready |
| Requirements traceability (RTM) | `docs/research/requirements-traceability.md` |
| Survey / interviews | Instruments ready — launch after ethics |
| System design Ch. 4 draft | `docs/supervisor-submission/04-system-design-chapter-draft.md` |

---

## 7. Questions for supervisor

1. Is the hybrid NLP + confirm step sufficient for Must-have FR7?  
2. Approve survey launch from `docs/research/`?  
3. Prefer analytics (Week 8) or calendar sync deferred to Future Work?

---

*End of Week 6 demo script*
