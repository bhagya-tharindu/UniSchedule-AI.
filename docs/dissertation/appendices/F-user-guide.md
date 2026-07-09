# Appendix F — User Guide

**Audience:** Students and lecturers using the UniSchedule AI prototype.  
**Prerequisites:** Modern web browser; account credentials (or registration).

Local development URLs (default): frontend `http://localhost:3000`; API `http://localhost:8000/api/v1`. See project `SETUP.md` for installation.

---

## F.1 Register and log in

1. Open the application in a browser.
2. Choose **Register** to create an account (name, email, password, role: student or lecturer), or **Login** with existing credentials.
3. On success, the dashboard lists meetings for the signed-in user.

Demo accounts (seeded environments only; password `password`):

| Email | Role |
|-------|------|
| student@unischedule.test | student |
| lecturer@unischedule.test | lecturer |

**[INSERT SCREENSHOT: login page]**

---

## F.2 View meetings (dashboard)

1. After login, the **Dashboard** shows upcoming and past meetings.
2. Use **Join** where a meeting has an online room (UniSchedule/Jitsi opens in-app; external links open in a new tab).
3. Use **Meet now** (if available) to start an instant short meeting.

**[INSERT SCREENSHOT: dashboard]**

---

## F.3 Book a meeting (form)

1. Open **New meeting** (or equivalent navigation).
2. Enter **title**, **start** and **end** times.
3. Select **participants** and optional **room** from the lists.
4. Choose meeting delivery mode if prompted (in-person, UniSchedule/Jitsi, or external link).
5. Optionally run a clash check, then **Submit**.
6. If a clash is reported, review the message and click a **suggested alternative slot**, or change times manually and resubmit.

**[INSERT SCREENSHOT: form booking]**

---

## F.4 Book a meeting (natural language)

1. On the new meeting page, open the **Natural language** tab.
2. Type a request, for example:  
   `Book a supervision with Dr Jane Lecturer next Tuesday at 2pm in ENG-101`
3. Choose **Parse** (or equivalent). The system fills the form fields and may show a clash preview.
4. **Review and edit** all fields. Do not assume the parse is perfect.
5. Confirm and submit using the same booking path as the form.

**HCI note:** The system never books silently from NLP alone; confirmation is required.

**[INSERT SCREENSHOT: NLP tab with confirm]**

---

## F.5 Handling clashes

When a booking conflicts with an existing meeting, room, availability window, or policy rule:

1. Read the error or warning message.
2. Apply a suggested alternative slot, or choose new times.
3. Resubmit.

---

## F.6 Cancel or update a meeting

1. From the dashboard, open the meeting (organiser only for update/cancel).
2. Use **Cancel** or edit fields and save.
3. Non-organisers cannot modify others’ meetings.

---

## F.7 Troubleshooting

| Problem | Suggested action |
|---------|------------------|
| Cannot log in | Check email/password; ensure API is running |
| Empty participant/room lists | Confirm catalog APIs and seed data |
| NLP parse fails | Rephrase with name, day, and time; or use the form |
| Clash on every attempt | Check existing meetings and room availability |
| Join link missing | Ensure meeting mode and URL were set at booking |

---

## F.8 Privacy reminder

Meetings and personal data are visible only to authorised users. Do not share login credentials. Research participation (survey/interview/UAT) is separate and voluntary (Appendix C).

---

*End of Appendix F*
