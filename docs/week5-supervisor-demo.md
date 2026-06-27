# Week 5 Supervisor Demo Script — NLP Pipeline v1

**Duration:** ~10 minutes  
**Prerequisites:** Backend and frontend running (see [SETUP.md](../SETUP.md))

---

## 1. Setup (before meeting)

```powershell
cd D:\UniScheduleAI\backend
php artisan migrate --seed
php artisan serve
```

```powershell
cd D:\UniScheduleAI\frontend
npm run dev
```

Open `http://localhost:3000` and log in as **student@unischedule.test** / **password**.

Optional: set `OPENAI_API_KEY` in `backend/.env` to demo LLM parser (`parser: llm`); otherwise rule-based parser works offline (`parser: rules`).

---

## 2. Demo flow A — Form booking (Week 4 baseline, ~2 min)

1. Dashboard → **Schedule meeting**
2. Stay on **Form** tab
3. Enter title, weekday slot 10:00–11:00, room ID **1**
4. Click **Check clashes** → show clean slot
5. **Create meeting** → confirm on dashboard

**Talking point:** Deterministic clash detection and academic availability rules run in Laravel before persist.

---

## 3. Demo flow B — Natural language booking (~5 min)

1. Open **Schedule meeting** → **Natural language** tab
2. Enter utterance:

   > Book a supervision with Dr Jane Lecturer next Tuesday at 2pm in ENG-101

3. Click **Parse request**
4. Show parsed preview:
   - Intent: `book`
   - Parser: `rules` or `llm`
   - Confidence score
   - Matched participant and room
5. Point out **editable confirmation fields** (hybrid AI — user confirms before booking)
6. Click **Check clashes** (or note clashes from parse response)
7. **Create meeting**

**Talking point:** NLP interprets; Laravel validates constraints and clash rules — no silent incorrect booking.

---

## 4. Demo flow C — Clash detection (~2 min)

1. Book a second meeting overlapping the same slot/room
2. Parse or form-submit conflicting time
3. Show clash messages and **alternative slot suggestions**

**Talking point:** Supports RQ2 (clash metrics) and evaluation test scenarios.

---

## 5. API evidence (optional, ~1 min)

```powershell
# Login token from browser localStorage, or:
curl -X POST http://localhost:8000/api/v1/meetings/parse-nlp `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -H "Content-Type: application/json" `
  -d "{\"text\": \"Book consultation with Dr Jane Lecturer tomorrow at 3pm\"}"
```

Show JSON: structured proposal + `has_clashes` + `suggestions`.

---

## 6. Research progress to report

| Item | Status |
|------|--------|
| NLP pipeline v1 | Implemented |
| Ethics / survey pack | Ready in `docs/research/` — launch after supervisor confirms |
| Literature Ch. 2 | ~60% (Week 5 draft) |
| Methodology Ch. 3 | Draft started |

---

## 7. Questions for supervisor

1. Is hybrid NLP + confirm step sufficient for Week 5, or require clarification dialogue now?
2. Ethics: exempt survey or full HEC application?
3. Approve survey instrument in `docs/research/survey-questionnaire.md`?

---

## 8. Troubleshooting

| Issue | Fix |
|-------|-----|
| Parse returns no time | Edit start/end manually; rule parser needs weekday + time phrases |
| Participant not matched | Use seeded name "Dr Jane Lecturer" or register matching user |
| 401 on API | Re-login; token in localStorage |
| LLM errors | Unset `OPENAI_API_KEY`; rule-based fallback runs automatically |

---

*End of demo script*
