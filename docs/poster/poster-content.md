# UniSchedule AI — Poster Content (Ready to paste into PowerPoint)

**Tool:** PowerPoint  
**Stage:** Week 3 (research + design, no results yet)  
**Word target:** 300–500 words  
**Slide size:** A1 landscape — Design → Slide Size → Custom → 84.1 cm × 59.4 cm

---

## HOW TO USE THIS FILE

1. Open PowerPoint → set slide size to A1 landscape.
2. Copy each section below into its PowerPoint text box.
3. Follow the formatting notes in [brackets].
4. Replace all [PLACEHOLDER] items before printing.

---

## ══════════════════════════════════════════════════════
## TITLE BAR — Full width, dark navy background (#1A2550)
## ══════════════════════════════════════════════════════

[Font: Arial Bold, 72pt, White text, centred]

UniSchedule AI — Intelligent University Meeting Scheduler

[Font: Arial, 36pt, White, centred — below title]

[Your Full Name]  |  [Student ID]  |  BEng Computer Science  |  University of Canterbury  |  2026

---

## ══════════════════════════════════════════════════════
## COLUMN 1 (Left column)
## ══════════════════════════════════════════════════════

---

### SECTION 1.1 — INTRODUCTION
[Box: thin green border #5CB85C, white background. Heading: Arial Bold 40pt navy. Body: Arial 28pt black, left-justified]

**Introduction**

University students and lecturers depend on ad-hoc meetings — consultations, project sessions, and supervision appointments — to support academic progress. These meetings are currently arranged manually through email and informal room booking, causing:

- Scheduling conflicts and double-booked rooms
- Delays in student–lecturer coordination
- Poor room utilisation and wasted time

Generic corporate scheduling platforms and fixed semester timetable systems do not support intelligent, academic-aware, ad-hoc meeting management with natural language interaction and real-time clash detection.

---

### SECTION 1.2 — RESEARCH GAP
[Box: thin green border. Heading: Arial Bold 40pt navy. Body: Arial 28pt black]

**Research Gap**

[In PowerPoint: create 3 small icon boxes side by side with short labels]

► **Corporate tools** — designed for business workflows; ignore academic roles and exam periods

► **Timetable systems** — handle fixed semester schedules only; no ad-hoc intelligence

► **Academic literature** — strong optimization theory; limited practical deployable systems

There is a gap between generic scheduling tools and the university-specific need for intelligent, constraint-aware, NLP-driven meeting management with empirical evaluation.

---

### SECTION 1.3 — RESEARCH OBJECTIVES
[Box: thin green border. Heading: Arial Bold 40pt navy. Body: Arial 28pt black]

**Research Objectives**

| RQ | Question | Measure |
|----|----------|---------|
| RQ1 | How difficult is ad-hoc academic scheduling? | Survey + task time |
| RQ2 | How common are timetable clashes? | Clash rate in tests |
| RQ3 | Do generic tools fail academic rules? | Constraint violations |
| RQ4 | Does AI scheduling reduce coordination time? | Manual vs AI tasks |
| RQ5 | Does intelligent scheduling improve satisfaction? | UAT scores |

---

## ══════════════════════════════════════════════════════
## COLUMN 2 (Middle column)
## ══════════════════════════════════════════════════════

---

### SECTION 2.1 — SYSTEM ARCHITECTURE
[Box: thin green border. Heading: Arial Bold 40pt navy]
[In PowerPoint: recreate diagram below using Insert → SmartArt → Hierarchy or manual boxes + arrows]

**System Architecture**

```
┌─────────────────────────┐
│   Next.js Frontend      │  ← Student / Lecturer UI
└──────────┬──────────────┘
           ↓ HTTPS
┌─────────────────────────┐
│   Laravel REST API      │
│  ┌────────────────────┐ │
│  │  Sanctum Auth      │ │  ← Role-based access
│  │  Scheduling Engine │ │  ← Academic constraints
│  │  Clash Detection   │ │  ← Time / Room / Person
│  │  NLP Service       │ │  ← Natural language input
│  │  Room Allocator    │ │  ← Capacity rules
│  └────────────────────┘ │
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│   MySQL Database        │  ← Users, Meetings, Rooms
└─────────────────────────┘
```

[PowerPoint colour guide: Navy boxes for API services, Green boxes for AI components, Light grey for database]

---

### SECTION 2.2 — KEY FEATURES
[Box: thin green border. Heading: Arial Bold 40pt navy]
[In PowerPoint: use a 2×3 grid of icon + label pairs]

**Key Features**

🔐  **Sanctum Auth**          ⚡  **Real-time Clash Detection**

🗣  **NLP Meeting Requests**  🏫  **Academic Room Allocation**

📅  **Constraint Engine**     📊  **Analytics Dashboard**

[Note: Replace emoji with professional PowerPoint icons — Insert → Icons]

---

### SECTION 2.3 — RESEARCH METHODOLOGY
[Box: thin green border. Heading: Arial Bold 40pt navy]
[In PowerPoint: 5 connected arrow boxes in a horizontal flow]

**Research Methodology**

Applied Research + Experimental Evaluation

→ **Literature Review**
   Academic scheduling, NLP, CSP

→ **Requirements**
   Survey + interviews (students, lecturers)

→ **System Design**
   Architecture, ER, AI flows

→ **Development**
   Next.js, Laravel, MySQL, Sanctum

→ **Evaluation**
   Manual vs AI-assisted scheduling

---

## ══════════════════════════════════════════════════════
## COLUMN 3 (Right column)
## ══════════════════════════════════════════════════════

---

### SECTION 3.1 — EVALUATION PLAN
[Box: thin green border. Heading: Arial Bold 40pt navy. Body: Arial 28pt]

**Evaluation Plan**

| Metric | Method | Target |
|--------|--------|--------|
| Scheduling accuracy | 20+ test scenarios | High |
| Clash detection | Before/after test set | Zero false negatives |
| API response time | Performance tests | < 3 seconds |
| User satisfaction | UAT (5–8 users) | SUS ≥ 68 |
| Time saving | Manual vs AI tasks | ≥ 25% reduction |

**Study design:**
Participants complete identical scheduling tasks using (A) manual methods and (B) UniSchedule AI. Time, errors, and satisfaction are measured.

Primary data collection (survey + 3–5 interviews) planned for Week 4 following ethics approval.

---

### SECTION 3.2 — EXPECTED OUTCOMES
[Box: thin green border. Heading: Arial Bold 40pt navy]
[In PowerPoint: use 3 simple progress-bar shapes (rectangle filled to 60–70%) with label "Target — to be measured"]

**Expected Outcomes** *(Targets — results pending evaluation)*

UniSchedule AI is expected to demonstrate:

▶  **Reduced scheduling clashes** compared to manual coordination

▶  **Faster task completion** for booking ad-hoc academic meetings

▶  **Higher user satisfaction** when intelligent alternative slots are offered

▶  **Accurate constraint enforcement** for academic rules (exams, capacity, availability)

[In PowerPoint: place 4 green arrow icons pointing right, one per bullet]

---

### SECTION 3.3 — CONCLUSIONS & FUTURE WORK
[Box: thin green border. Heading: Arial Bold 40pt navy. Body: Arial 28pt]

**Conclusions**

UniSchedule AI addresses a clear gap in university scheduling by combining constraint-based AI, natural language processing, and real-time clash detection in a practical, deployable web platform.

The project contributes:
- Academic-aware intelligent scheduling
- Hybrid AI (rules + NLP) for meeting requests
- Empirical comparison of manual vs AI-assisted scheduling

**Future Work**
- Voice-based scheduling assistant
- Machine learning preference prediction
- University LMS integration

---

### SECTION 3.4 — REFERENCES
[Box: no border. Font: Arial 22pt, left-justified. Small size is acceptable for references]

**References**

Burke, E.K. and Petrovic, S. (2002) 'Recent research directions in automated timetabling', *European Journal of Operational Research*, 140(2), pp. 266–280.

Müller, T., Rudová, H. and Müllerová, Z. (2025) 'Real-world university course timetabling', *Journal of Scheduling*, 28(2), pp. 247–267.

Patra, B. et al. (2021) 'To schedule or not to schedule', *arXiv:2012.02594*.

Schaerf, A. (1999) 'A survey of automated timetabling', *Artificial Intelligence Review*, 13(2), pp. 87–127.

Song, J., Ashktorab, Z. and Malone, T.W. (2025) 'Togedule', *ACM PACMHCI*, 9(7).

Wijerathne, O. et al. (2025) 'ScheduleMe', *arXiv:2509.25693*.

---

## ══════════════════════════════════════════════════════
## FOOTER BAR — Full width, light grey (#F0F0F0)
## ══════════════════════════════════════════════════════

[Left: University of Canterbury logo (download from university website, PNG)]

[Centre, Arial 26pt navy:]
Contact: [your.email@canterbury.ac.nz]  |  GitHub: github.com/bhagya-tharindu/UniSchedule-AI.

[Right: QR code image — generate free at qr-code-generator.com using your GitHub URL]

---

## ══════════════════════════════════════════════════════
## POWERPOINT SETUP CHECKLIST
## ══════════════════════════════════════════════════════

### Step 1 — Slide size
- Design → Slide Size → Custom Size
- Width: 84.1 cm | Height: 59.4 cm | Landscape

### Step 2 — Colour palette (set in Theme Colours)
- Primary:    #1A2550  (dark navy   — title bar, headings)
- Accent:     #5CB85C  (green       — box borders, icons, arrows)
- Background: #FFFFFF  (white       — main background)
- Secondary:  #F0F0F0  (light grey  — footer bar)
- Text:       #222222  (dark grey   — body text)

### Step 3 — Font (set as default)
- All text: Arial (or Times New Roman)
- Title: 72pt Bold White
- Section headings: 40pt Bold Navy
- Body text: 28pt Regular Black
- References: 22pt Regular Black
- DO NOT use Comic Sans, Tahoma, Cambria, or mixed fonts

### Step 4 — Layout guide (draw guides first)
- View → Guides → turn on
- Left margin: 2 cm | Right margin: 2 cm | Top: 12 cm (below title) | Bottom: 8 cm (above footer)
- Column gutters: ~1 cm between columns
- Each column width: approx. 26 cm

### Step 5 — Word count check
- Review → Word Count → aim for 300–500 words (body text only, not headings)

### Step 6 — Final checks before printing
- [ ] Zoom to 50% — can you read every word?
- [ ] Fonts ≥ 26pt everywhere
- [ ] No underlined or ALL-CAPS body text
- [ ] Text left-justified in all boxes
- [ ] Architecture diagram clear at poster scale
- [ ] ~40% white space preserved
- [ ] Colours: maximum 5 (you are using 4 — good)
- [ ] QR code tested on phone
- [ ] Your name and ID visible
- [ ] Harvard references present
- [ ] Supervisor feedback received before printing
- [ ] Printed 2–3 days before presentation date

---

## ══════════════════════════════════════════════════════
## IMAGES / GRAPHICS TO SOURCE
## ══════════════════════════════════════════════════════

| Item | Source | Notes |
|------|--------|-------|
| Architecture diagram | Draw in PowerPoint (SmartArt or manual) | Navy + green colour scheme |
| Key feature icons | Insert → Icons (PowerPoint built-in) | Consistent style, single colour |
| Methodology flow | SmartArt → Process → Accent Process | 5 boxes, green arrows |
| University logo | Download from Canterbury website | PNG, white background |
| QR code | qr-code-generator.com | Link to GitHub repo |
| Expected outcomes | Draw simple rectangle bars in PowerPoint | Label as "Target — pending evaluation" |

---

*End of poster content — [Your Full Name] — UniSchedule AI — [Date]*
