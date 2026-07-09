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
| admin@unischedule.test | admin |
| student@unischedule.test | student |
| lecturer@unischedule.test | lecturer |

Public registration is **disabled**. Only admins create users (Admin → Users).

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

- Sanctum token auth (login, logout, me); admin-only user creation
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

### Optional LLM config (`backend/.env`) — Groq free tier

Uses any **OpenAI-compatible** API. Groq example:

```
OPENAI_API_KEY=gsk_your_key_from_console.groq.com
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=llama-3.1-8b-instant
OPENAI_TIMEOUT=30
OPENAI_VERIFY_SSL=false
```

On Windows, if PHP lacks CA certificates you may see **cURL error 60** and silent fallback to rules. `OPENAI_VERIFY_SSL=false` is for **local demo only**; use `true` in production (or install a CA bundle in `php.ini`).

After changing `.env`:

```powershell
php artisan config:clear
```

Restart `php artisan serve`. Parse a natural-language request — the UI badge should show **LLM** (not Rule-based).

Without a key, the rule-based parser handles demo utterances such as:
*"Book a supervision with Dr Jane Lecturer next Tuesday at 2pm online"*

## 3c. Week 6 features implemented

- End-to-end vertical slice polish (form + NLP → clash → book → dashboard)
- `GET /api/v1/users` and `GET /api/v1/rooms` for participant and room pickers
- Clickable alternative slot suggestions on clash
- Requirements traceability matrix: `docs/research/requirements-traceability.md`
- Supervisor demo script: `docs/week6-supervisor-demo.md`

## 3d. Meeting delivery (Jitsi + external links)

- **UniSchedule (Jitsi):** auto-creates a room on `JITSI_BASE_URL` (default `https://meet.jit.si`)
- **External link:** paste Zoom / Teams / Meet / any `https` URL
- Dashboard **Join** — Jitsi opens in-app (`/dashboard/meetings/{id}/join`); external opens in a new tab
- **Meet now** — one-click instant Jitsi meeting (30 min, starts now) and opens Join

## 3e. Courses, exams, and lecture timetables

- **Courses** (admin): enrol users; set **per-course exam periods** (different courses can have different exam weeks)
- Booking is blocked only if a **participant is enrolled** in a course with an active exam period on that date
- Optional **campus-wide blackouts** (admin) still block everyone
- **My timetable** — weekly lecture/lab slots (admin-managed); meetings cannot overlap them
- **My course exams** — read-only list of exam periods for your enrolments
- Seeded: COSC261 (student+lecturer, exams 1–7 Sep 2026), INFO213 (student only, exams 15–21 Sep 2026)
- **Meet now** still uses `force` and can bypass these rules; normal schedule / NLP / check-clash enforce them

```powershell
cd D:\UniScheduleAI\backend
php artisan migrate
php artisan db:seed
```

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
