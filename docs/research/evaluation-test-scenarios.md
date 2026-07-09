# Evaluation Test Scenarios — Clash Detection (Week 7)

**Purpose:** Document ≥20 controlled test scenarios for RQ2 (clash prevalence) and RQ3 (academic constraint compliance). Each scenario maps to an automated PHPUnit test.

**Run tests:** `cd backend && php artisan test --filter=EvaluationScenarios`

---

## Scenario matrix

| ID | Scenario | Inputs | Expected result | Clash type(s) | Test file |
|----|----------|--------|-----------------|---------------|-----------|
| EV-01 | Partial participant overlap | User has meeting 10:00–11:00; new slot 10:30–11:30 | Blocked | `participant` | `EvaluationScenariosTest::test_ev01_*` |
| EV-02 | Back-to-back meetings | Existing ends 10:00; new starts 10:00 | Allowed | — | `EvaluationScenariosTest::test_ev02_*` |
| EV-03 | Cancelled meeting ignored | Cancelled meeting at 14:00–15:00; new same slot | Allowed | — | `EvaluationScenariosTest::test_ev03_*` |
| EV-04 | Update excludes self (participant) | Reschedule same slot, exclude meeting ID | Allowed | — | `EvaluationScenariosTest::test_ev04_*` |
| EV-05 | Room double-booking | Room booked 13:00–14:00; new 13:30–14:30 same room | Blocked | `room` | `EvaluationScenariosTest::test_ev05_*` |
| EV-06 | Online — no room selected | Room booked; new online meeting, room_id null | Allowed (no room clash) | — | `EvaluationScenariosTest::test_ev06_*` |
| EV-07 | End before start | start 15:00, end 14:00 | Blocked | `time` | `EvaluationScenariosTest::test_ev07_*` |
| EV-08 | Participant as attendee | User invited to existing meeting; new overlaps | Blocked | `participant` | `EvaluationScenariosTest::test_ev08_*` |
| EV-09 | No availability records | User with no availability; late evening slot | Allowed | — | `EvaluationScenariosTest::test_ev09_*` |
| EV-10 | Outside availability hours | Availability 09:00–17:00; meeting at 18:00 | Blocked | `availability` | `EvaluationScenariosTest::test_ev10_*` |
| EV-11 | Within availability window | Availability 09:00–17:00; meeting at 10:00 | Allowed | — | `EvaluationScenariosTest::test_ev11_*` |
| EV-12 | Multiple participants, one busy | Two participants; one has clash | Blocked (one message) | `participant` | `EvaluationScenariosTest::test_ev12_*` |
| EV-13 | Campus exam blackout | Active exam_blackout rule on meeting date | Blocked | `policy` | `EvaluationScenariosTest::test_ev13_*` |
| EV-14 | Timetable lecture slot | Lecturer Mon 10:00–12:00; meeting during lecture | Blocked | `timetable` | `EvaluationScenariosTest::test_ev14_*` |
| EV-15 | Course exam (enrolled) | Student enrolled in COSC261; exam week Sep 1–7 | Blocked | `exam` | `EvaluationScenariosTest::test_ev15_*` |
| EV-16 | Course exam (not enrolled) | Lecturer not in INFO213; INFO213 exam week | Allowed | — | `EvaluationScenariosTest::test_ev16_*` |
| EV-17 | Combined participant + room | Same user and room both conflict | Blocked | `participant`, `room` | `EvaluationScenariosTest::test_ev17_*` |
| EV-18 | API exclude_meeting_id | check-clash with exclude_meeting_id | Allowed | — | `EvaluationScenariosTest::test_ev18_*` |
| EV-19 | Room capacity exceeded | Room cap 2; 4 participants | Validation error | — | `EvaluationScenariosTest::test_ev19_*` |
| EV-20 | Same day, non-overlapping | Morning + afternoon same user | Allowed | — | `EvaluationScenariosTest::test_ev20_*` |
| EV-21 | New slot contains existing | Short meeting inside longer proposed slot | Blocked | `participant` | `EvaluationScenariosTest::test_ev21_*` |
| EV-22 | Wrong weekday availability | Availability Mon only; meeting Tuesday | Blocked | `availability` | `EvaluationScenariosTest::test_ev22_*` |
| EV-23 | Policy + participant combined | Exam blackout + participant overlap | Blocked | `policy`, `participant` | `EvaluationScenariosTest::test_ev23_*` |
| EV-24 | Room update excludes self | Reschedule keeping same room, exclude ID | Allowed | — | `EvaluationScenariosTest::test_ev24_*` |
| EV-25 | Seeded free slot (integration) | Student + lecturer, Fri 15:00 Aug 7 | Created | — | `EvaluationScenariosTest::test_ev25_*` |

---

## Additional tests (meeting lifecycle)

| ID | Scenario | Test file |
|----|----------|-----------|
| LC-01 | Organizer can cancel via API | `MeetingLifecycleTest::test_organizer_can_cancel_meeting` |
| LC-02 | Non-organizer cannot cancel | `MeetingLifecycleTest::test_non_organizer_cannot_cancel_meeting` |
| LC-03 | Organizer can update/reschedule | `MeetingLifecycleTest::test_organizer_can_update_meeting` |
| LC-04 | Cancelled meeting cannot update | `MeetingLifecycleTest::test_cancelled_meeting_cannot_be_updated` |
| LC-05 | Cancelled slot allows rebooking | `MeetingLifecycleTest::test_cancelled_slot_allows_new_booking_at_same_time` |

---

## Legacy tests (still valid evidence)

| Test file | Scenarios covered |
|-----------|-------------------|
| `ClashDetectionTest` | Participant overlap, no overlap, availability in/out |
| `AcademicConstraintsTest` | Exam blackout API, timetable API, free slot API |
| `CourseExamTest` | Course exam enrolment rules |
| `NlpParseMeetingTest` | NLP online mode ignores room; participant clash in parse |

**Total automated clash/evaluation tests:** 25 evaluation scenarios + 5 lifecycle + legacy suite.

---

## Metrics for dissertation (Ch. 6)

| Metric | Source |
|--------|--------|
| Clash detection accuracy | Pass rate on EV-01 … EV-25 (expected vs actual) |
| Constraint coverage | Count by clash `type` in scenario matrix |
| Scheduling accuracy | EV-25 + manual vs AI study (Week 10) |

---

*Last updated: Week 7 — dev finish*
