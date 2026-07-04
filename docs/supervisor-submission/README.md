# UniSchedule AI — Supervisor Submission Pack

Research and system design documents for supervisor review.

## Documents

| File | Title | Export as PDF |
|------|--------|----------------|
| [01-progress-summary.md](01-progress-summary.md) | Progress Summary & Next Steps | `01-progress-summary.pdf` |
| [02-research-foundation.md](02-research-foundation.md) | Research Foundation | `02-research-foundation.pdf` |
| [03-literature-review.md](03-literature-review.md) | Literature Review (~60%, Week 5) | `03-literature-review.pdf` |
| [03-methodology-draft.md](03-methodology-draft.md) | Methodology Chapter 3 (Week 5 draft) | `03-methodology-draft.pdf` |
| [04-requirements-moscow.md](04-requirements-moscow.md) | Requirements & MoSCoW | `04-requirements-moscow.pdf` |
| [04-system-design-chapter-draft.md](04-system-design-chapter-draft.md) | System Design Chapter 4 (Week 6 draft) | `04-system-design-chapter-draft.pdf` |
| [05-system-design-pack.md](05-system-design-pack.md) | System Design Pack (diagrams) | `05-system-design-pack.pdf` |
| [06-evaluation-security-ethics.md](06-evaluation-security-ethics.md) | Evaluation, Security & Ethics | `06-evaluation-security-ethics.pdf` |
| [EMAIL-template.md](EMAIL-template.md) | Email to supervisor | — |

## Week 5 additions (repo)

| Path | Purpose |
|------|---------|
| [../research/](../research/) | Ethics checklist, survey, interview guide |
| [../week5-supervisor-demo.md](../week5-supervisor-demo.md) | NLP demo script |
| [../week6-supervisor-demo.md](../week6-supervisor-demo.md) | Vertical-slice demo script |
| [../research/requirements-traceability.md](../research/requirements-traceability.md) | Requirements traceability matrix |

## Before you send

1. Replace `[Your Full Name]`, `[Student ID]`, `[Supervisor Name]`, and `[Date]` in every file.
2. In `03-literature-review.md`, replace placeholder references with your real Harvard references.
3. In `05-system-design-pack.md`, recreate diagrams in draw.io using the mermaid/ASCII guides, or export mermaid from VS Code/GitHub.
4. In `01-progress-summary.md`, tick only items you have actually completed.
5. Export each `.md` to PDF (Word: File → Open → Save as PDF, or use Pandoc).

## Combined PDF (optional)

Merge all six PDFs in order 01–06 for one attachment.

## Technology stack (confirmed)

| Layer | Technology |
|-------|------------|
| Frontend | Next.js + TypeScript |
| Backend | Laravel (REST API) |
| Database | MySQL |
| Authentication | Laravel Sanctum |

## Week 5–6 status

- NLP pipeline v1 — [../week5-supervisor-demo.md](../week5-supervisor-demo.md)
- Vertical slice polish — [../week6-supervisor-demo.md](../week6-supervisor-demo.md)
- Primary research instruments in [../research/](../research/) — launch after ethics sign-off
- RTM — [../research/requirements-traceability.md](../research/requirements-traceability.md)
