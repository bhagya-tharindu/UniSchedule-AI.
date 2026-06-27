# UniSchedule AI

**Intelligent University Meeting Scheduler** — Final Year Project (University of Canterbury).

**Local project path:** `D:\UniScheduleAI`

## Quick start

See **[SETUP.md](SETUP.md)** for backend + frontend run instructions.

| Folder | Stack |
|--------|--------|
| `backend/` | Laravel 13 + Sanctum REST API |
| `frontend/` | Next.js + TypeScript |
| `docs/` | FYP research & supervisor pack |

## Quick links

| Resource | Location |
|----------|----------|
| **Supervisor submission pack (Week 3)** | [docs/supervisor-submission/](docs/supervisor-submission/) |
| **Project notes (planning, stack, timeline)** | [docs/PROJECT-NOTES.md](docs/PROJECT-NOTES.md) |
| **Cursor AI rules (auto context)** | [.cursor/rules/](.cursor/rules/) + [AGENTS.md](AGENTS.md) |
| **Email to supervisor** | [docs/supervisor-submission/EMAIL-template.md](docs/supervisor-submission/EMAIL-template.md) |

## Technology stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js + TypeScript |
| Backend | Laravel (REST API) |
| Database | MySQL |
| Authentication | Laravel Sanctum |
| NLP | LLM API via Laravel (hybrid with constraint engine) |

## Backup this project

Copy the entire `UniSchedule-AI` folder to:

- A **GitHub/GitLab** repository, and/or  
- **OneDrive / Google Drive**

Do not rely only on Cursor chat history — files in this folder are your source of truth.

## GitHub repository

**Remote:** [https://github.com/bhagya-tharindu/UniSchedule-AI.](https://github.com/bhagya-tharindu/UniSchedule-AI.)

```powershell
git add -A
git commit -m "Your message"
git push
```

## Status

- Week 3: Research + system design documents (see `docs/supervisor-submission/`)
- Week 4: Laravel API (auth, meetings, clash detection), Next.js UI shell — see `SETUP.md`
- Week 5: NLP pipeline v1, natural language booking UI — see `SETUP.md` §3b and `docs/week5-supervisor-demo.md`
- Survey / ethics: instruments in `docs/research/` — launch after supervisor confirms
