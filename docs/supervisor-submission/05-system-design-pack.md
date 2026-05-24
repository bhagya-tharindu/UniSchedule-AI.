# UniSchedule AI — System Design Pack

**Student:** [Your Full Name] | **ID:** [Student ID] | **Date:** [Date]

This document contains all system design diagrams for supervisor review. Recreate polished versions in **draw.io** or **Lucidchart** for the final dissertation using the models below.

**Technology stack** (confirmed):

| Layer | Technology |
|-------|------------|
| Frontend | **Next.js** (React) + TypeScript |
| Backend | **Laravel** (PHP) — REST API |
| Database | **MySQL** |
| ORM / data access | Laravel Eloquent |
| Authentication | **Laravel Sanctum** (API tokens / SPA authentication) |
| NLP | LLM API or NLP service called from Laravel (HTTP); optional PHP NLP libraries |
| Diagrams | draw.io, Mermaid |

---

## 1. System context diagram

Shows UniSchedule AI in relation to users and external systems.

```mermaid
flowchart TB
    subgraph users [Users]
        Student[Student]
        Lecturer[Lecturer]
        Coordinator[Coordinator]
    end

    subgraph system [UniScheduleAI]
        NextApp[NextJs_Frontend]
        LaravelAPI[Laravel_REST_API]
    end

    subgraph external [ExternalSystems]
        CalAPI[CalendarAPI_Google_Outlook]
        Email[EmailService_Optional]
        LLM[NLP_LLM_API_Optional]
    end

    DB[(MySQL)]

    Student --> NextApp
    Lecturer --> NextApp
    Coordinator --> NextApp
    NextApp --> LaravelAPI
    LaravelAPI --> DB
    LaravelAPI --> CalAPI
    LaravelAPI --> Email
    LaravelAPI --> LLM
```

**Description:** Students and lecturers use the **Next.js** web application, which communicates with the **Laravel** REST API. Data is stored in **MySQL**. Laravel handles scheduling logic, Sanctum-protected routes, and optional calendar/NLP integrations.

---

## 2. High-level architecture diagram

```mermaid
flowchart TB
    subgraph presentation [PresentationLayer]
        UI[NextJs_App]
    end

    subgraph api [Laravel_Backend]
        REST[Laravel_REST_API]
        Sanctum[Laravel_Sanctum]
        AuthSvc[Auth_RBAC]
        NLPSvc[NLPService]
        SchedSvc[SchedulingEngine]
        ClashSvc[ClashDetectionService]
        ResSvc[ResourceAllocationService]
        AnalyticsSvc[AnalyticsService]
    end

    subgraph data [DataLayer]
        DB[(MySQL)]
        CalAdpt[CalendarAdapter]
    end

    UI -->|HTTPS_Bearer_or_SPA_cookie| REST
    REST --> Sanctum
    Sanctum --> AuthSvc
    REST --> NLPSvc
    REST --> SchedSvc
    REST --> AnalyticsSvc
    NLPSvc --> SchedSvc
    SchedSvc --> ClashSvc
    SchedSvc --> ResSvc
    AuthSvc --> DB
    SchedSvc --> DB
    ResSvc --> DB
    AnalyticsSvc --> DB
    SchedSvc --> CalAdpt
```

**Description:** **Next.js** (presentation) calls **Laravel** REST endpoints protected by **Sanctum**. Laravel services implement scheduling, clash detection, resource allocation, and NLP integration. **Eloquent** maps entities to **MySQL**.

---

## 3. Use case diagram

```mermaid
flowchart LR
    subgraph actors [Actors]
        S[Student]
        L[Lecturer]
    end

    subgraph usecases [UseCases]
        UC1[Login]
        UC2[SetAvailability]
        UC3[CreateMeeting]
        UC4[RescheduleMeeting]
        UC5[CancelMeeting]
        UC6[ViewMeetings]
        UC7[NLPBookingRequest]
        UC8[DetectClash]
        UC9[SuggestAlternatives]
        UC10[AllocateRoom]
        UC11[ViewAnalytics]
    end

    S --> UC1
    S --> UC3
    S --> UC4
    S --> UC5
    S --> UC6
    S --> UC7
    L --> UC1
    L --> UC2
    L --> UC3
    L --> UC4
    L --> UC5
    L --> UC6
    L --> UC7
    L --> UC11
    UC3 --> UC8
    UC3 --> UC10
    UC8 --> UC9
```

**Description:** Core use cases cover authentication, meeting lifecycle, NLP requests, clash handling, and optional analytics for lecturers/coordinators.

---

## 4. Entity–Relationship diagram

```mermaid
erDiagram
    USER ||--o{ AVAILABILITY : has
    USER ||--o{ MEETING : organizes
    USER }o--o{ MEETING : participates
    MEETING }o--|| ROOM : booked_in
    MEETING ||--o{ CLASH_RECORD : may_trigger
    CONSTRAINT_RULE ||--o{ MEETING : applies_to

    USER {
        int user_id PK
        string email UK
        string password_hash
        string full_name
        enum role
        datetime created_at
    }

    AVAILABILITY {
        int availability_id PK
        int user_id FK
        int day_of_week
        time start_time
        time end_time
    }

    ROOM {
        int room_id PK
        string name
        string building
        int capacity
        boolean active
    }

    MEETING {
        int meeting_id PK
        int organizer_id FK
        int room_id FK
        string title
        datetime start_time
        datetime end_time
        enum status
    }

    MEETING_PARTICIPANT {
        int meeting_id FK
        int user_id FK
    }

    CONSTRAINT_RULE {
        int rule_id PK
        string rule_type
        date valid_from
        date valid_to
        string description
    }

    CLASH_RECORD {
        int clash_id PK
        int meeting_id FK
        string clash_type
        boolean resolved
        datetime detected_at
    }
```

**Description:** Users have availability slots and participate in meetings. Meetings are linked to rooms. Constraint rules encode exam periods and policies. Clash records audit detected conflicts.

---

## 5. Scheduling workflow

```mermaid
flowchart TD
    Start([UserSubmitRequest]) --> Parse{StructuredOrNLP}
    Parse -->|NLP| NLP[NLPService_ExtractIntentEntities]
    Parse -->|Form| Form[StructuredFormData]
    NLP --> Validate
    Form --> Validate[ValidateConstraints]
    Validate -->|Invalid| Reject[ReturnErrorToUser]
    Validate -->|Valid| Clash[ClashDetection]
    Clash -->|ClashFound| Suggest[GenerateAlternatives]
    Clash -->|NoClash| Allocate[AllocateRoom]
    Suggest --> UserChoice{UserSelectsSlot}
    UserChoice -->|Yes| Allocate
    UserChoice -->|No| EndCancel([Cancel])
    Allocate --> Save[(SaveToDatabase)]
    Save --> Sync{CalendarSyncEnabled}
    Sync -->|Yes| Cal[UpdateExternalCalendar]
    Sync -->|No| Confirm
    Cal --> Confirm([ConfirmToUser])
```

**Description:** Every booking passes constraint validation and clash detection before commit. Alternative slots are offered when conflicts occur.

---

## 6. AI / NLP decision flow

```mermaid
flowchart TD
    Input([NaturalLanguageInput]) --> Tokenize[TokenizeAndNormalize]
    Tokenize --> Intent[IntentClassification]
    Intent -->|book| Entities[EntityExtraction]
    Intent -->|reschedule| Entities
    Intent -->|cancel| Entities
    Intent -->|unknown| Clarify[AskClarification]
    Entities --> DT[DateTimeResolution]
    Entities --> People[ParticipantResolution]
    Entities --> RoomPref[RoomPreference]
    DT --> Struct[StructuredSchedulingRequest]
    People --> Struct
    RoomPref --> Struct
    Struct --> Engine[SchedulingEngine]
    Engine --> Valid{ConstraintsOK}
    Valid -->|No| LLM{UseLLMForRepair}
    LLM -->|Optional| Clarify
    Valid -->|Yes| Output([ProposedMeetingSlot])
```

**Description:** Hybrid AI uses NLP/LLM for interpretation; the scheduling engine makes final decisions deterministically. Ambiguous input triggers clarification rather than silent incorrect booking.

---

## 7. Clash detection flow

```mermaid
flowchart TD
    Req([NewOrUpdatedMeeting]) --> Load[LoadExistingMeetingsAndRules]
    Load --> T1[CheckTimeOverlap_Participants]
    Load --> T2[CheckRoomDoubleBooking]
    Load --> T3[CheckAvailabilityWindows]
    Load --> T4[CheckExamBlackoutRules]
    T1 --> Any{AnyConflict}
    T2 --> Any
    T3 --> Any
    T4 --> Any
    Any -->|Yes| Log[CreateClashRecord]
    Log --> Block[BlockOrWarnUser]
    Any -->|No| Allow[ProceedToBooking]
```

**Description:** Clash detection runs temporal, room, availability, and policy checks. Conflicts are logged for analytics and user feedback.

---

## 8. Sequence diagram — Book meeting

```mermaid
sequenceDiagram
    participant U as User
    participant UI as NextJs_UI
    participant API as Laravel_API
    participant NLP as NLPService
    participant SCH as SchedulingEngine
    participant CL as ClashService
    participant DB as MySQL

    U->>UI: Enter booking request
    UI->>API: POST /api/meetings Bearer Sanctum_token
    API->>NLP: parseRequest(text)
    NLP-->>API: structuredRequest
    API->>SCH: proposeSlot(request)
    SCH->>DB: queryMeetingsAndAvailability
    DB-->>SCH: existingData
    SCH->>CL: detectClashes(slot)
    CL-->>SCH: clashResult
    alt clash detected
        SCH-->>API: alternatives
        API-->>UI: show alternatives
    else no clash
        SCH->>DB: insertMeeting
        DB-->>SCH: meetingId
        SCH-->>API: success
        API-->>UI: confirmation
    end
```

**Description:** Illustrates end-to-end interaction for NLP-driven booking with clash checking before database commit.

---

## 9. Data management

| Topic | Approach |
|-------|----------|
| **Data sources** | User profiles, manual/CSV timetable import, room master list |
| **Validation** | Server-side validation on all inputs; reject invalid date ranges |
| **Storage** | MySQL relational model via Laravel migrations (see ER diagram) |
| **Sample data** | Seed script for development (users, rooms, sample meetings) |
| **Privacy** | Role-based queries; no public exposure of lecturer personal calendars |

---

## 10. Deployment view (conceptual)

```mermaid
flowchart LR
    Browser[UserBrowser] --> Next[NextJs]
    Next --> Laravel[Laravel_API]
    Laravel --> DB[(MySQL)]
    Laravel --> NLPExt[NLP_LLM_API_Optional]
```

**Description:** Production deployment uses HTTPS. **Next.js** is served separately or alongside Laravel; API routes run on Laravel with **Sanctum** token validation. **MySQL** on local or hosted instance. NLP/LLM called from Laravel with rate limiting.

---

## 11. Diagram export checklist for dissertation

- [ ] Figure 1: System context  
- [ ] Figure 2: Architecture  
- [ ] Figure 3: Use cases  
- [ ] Figure 4: ER diagram  
- [ ] Figure 5: Scheduling workflow  
- [ ] Figure 6: AI/NLP decision flow  
- [ ] Figure 7: Clash detection flow  
- [ ] Figure 8: Sequence diagram — Book meeting  

---

*End of document*
