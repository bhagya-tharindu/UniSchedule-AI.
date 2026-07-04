# UniSchedule AI — Local setup

Project root: **`D:\UniScheduleAI`**

## Prerequisites

- PHP 8.2+ and Composer
- Node.js 20+ and npm
- MySQL 8 (recommended) or SQLite for quick local dev

## 1. Backend (Laravel)

```powershell
cd D:\UniScheduleAI\backend
copy .env.example .env
php artisan key:generate
```

### MySQL (production-style)

Create database `unischedule`, then in `.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=unischedule
DB_USERNAME=root
DB_PASSWORD=your_password
```

### SQLite (quick start)

Default `.env` may already use SQLite. Ensure `database/database.sqlite` exists:

```powershell
New-Item -ItemType File -Force database\database.sqlite
```

### Migrate and seed

```powershell
php artisan migrate
php artisan db:seed
```

Demo accounts (password: `password`):

| Email | Role |
|-------|------|
| student@unischedule.test | student |
| lecturer@unischedule.test | lecturer |

### Run API

```powershell
php artisan serve
```

API base: `http://localhost:8000/api/v1`

## 2. Frontend (Next.js)

```powershell
cd D:\UniScheduleAI\frontend
copy .env.local.example .env.local
npm install
npm run dev
```

Open: `http://localhost:3000`

## 3. Week 4 features implemented

- Sanctum token auth (register, login, logout, me)
- Meeting CRUD with organizer-only update/cancel
- Clash detection (participant overlap, availability, room, policy rules)
- Alternative slot suggestions on clash check
- Demo seed data (users, rooms, availabilities)

## 3b. Week 5 features implemented

- **NLP pipeline v1:** `POST /api/v1/meetings/parse-nlp`
- Hybrid parser: OpenAI-compatible LLM when `OPENAI_API_KEY` set; rule-based fallback otherwise
- Natural language tab on booking page with parse → confirm → book flow
- Clash preview included in NLP parse response
- Tests: `NlpParseMeetingTest` (run with `php artisan test`)

### Optional LLM config (`backend/.env`)

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

Without a key, the rule-based parser handles demo utterances such as:
*"Book a supervision with Dr Jane Lecturer next Tuesday at 2pm in ENG-101"*

## 3c. Week 6 features implemented

- End-to-end vertical slice polish (form + NLP → clash → book → dashboard)
- `GET /api/v1/users` and `GET /api/v1/rooms` for participant and room pickers
- Clickable alternative slot suggestions on clash
- Requirements traceability matrix: `docs/research/requirements-traceability.md`
- Supervisor demo script: `docs/week6-supervisor-demo.md`

## 4. Tests

```powershell
cd D:\UniScheduleAI\backend
php artisan test
```

## 5. GitHub

Remote: `https://github.com/bhagya-tharindu/UniSchedule-AI.`

```powershell
cd D:\UniScheduleAI
git add .
git commit -m "Week 4: Laravel API, clash detection, Next.js shell"
git push
```
