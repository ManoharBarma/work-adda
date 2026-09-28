# Database Schema & Data Models

## 1. Overview
The database is managed with **PostgreSQL** and accessed via **Prisma ORM**. The schema is optimized for:
* Fast public directory search by category, profession, locality, and keyword.
* Zero-duplicate worker phone number enforcement.
* Transparent moderation workflow (`PENDING` -> `APPROVED` / `REJECTED` / `INACTIVE`).
* Lightweight intent tracking (aggregate counters + granular interaction logs).

---

## 2. Entity Relationship Diagram (Conceptual)

```
+---------------+           +--------------------+           +------------------+
|   Category    |<--------->|       Worker       |<--------->|      Skill       |
| (Home/Textile)|  1     *  |  (Profile & Slugs) |  *     *  | (Wiring, Loom..) |
+---------------+           +---------+----------+           +------------------+
                                      |
                     +----------------+----------------+
                     |                |                |
                     v                v                v
            +----------------+ +---------------+ +------------------+
            |  Interaction   | | WorkPhoto (5) | |      Report      |
            | (CALL/WHATSAPP)| | (Thumbnails)  | | (Spam/Wrong Num) |
            +----------------+ +---------------+ +------------------+
```

---

## 3. Core Prisma Schema Definition

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum WorkerStatus {
  PENDING      // Awaiting admin review
  APPROVED     // Visible in public search
  REJECTED     // Disapproved with reason
  INACTIVE     // Worker temporarily hidden profile
  SUSPENDED    // Admin flagged/deactivated
}

enum InteractionType {
  VIEW         // Public profile page viewed
  CALL         // Tapped Call button (tel:)
  WHATSAPP     // Tapped WhatsApp button (wa.me)
  SHARE        // Tapped WhatsApp share link
}

enum ReportReason {
  WRONG_PHONE
  FAKE_PROFILE
  WRONG_PROFESSION
  INAPPROPRIATE_CONTENT
  NO_LONGER_PROVIDES_SERVICE
  DUPLICATE_PROFILE
  OTHER
}

model Category {
  id           String      @id @default(cuid())
  slug         String      @unique
  nameEnglish  String
  nameTelugu   String
  icon         String      // Emoji or SVG icon identifier
  displayOrder Int         @default(0)
  isActive     Boolean     @default(true)
  workers      Worker[]
  skills       Skill[]
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}

model Skill {
  id           String      @id @default(cuid())
  categoryId   String
  category     Category    @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  nameEnglish  String
  nameTelugu   String
  workers      WorkerSkill[]
  createdAt    DateTime    @default(now())
}

model Locality {
  id           String      @id @default(cuid())
  nameEnglish  String
  nameTelugu   String
  town         String      @default("Sircilla")
  district     String      @default("Rajanna Sircilla")
  state        String      @default("Telangana")
  workers      Worker[]
  createdAt    DateTime    @default(now())
}

model Worker {
  id                 String              @id @default(cuid())
  slug               String              @unique // e.g. "ramesh-kumar-electrician-sircilla"
  fullName           String
  phone              String              @unique // Duplicate prevention
  whatsappPhone      String?
  profilePhotoUrl    String?
  categoryId         String
  category           Category            @relation(fields: [categoryId], references: [id])
  localityId         String
  locality           Locality            @relation(fields: [localityId], references: [id])
  experienceYears    Int                 @default(0)
  bio                String?
  languages          String[]            @default(["Telugu", "English"])
  
  // Status & Verification
  status             WorkerStatus        @default(PENDING)
  mobileVerified     Boolean             @default(false)
  communityVerified  Boolean             @default(false)
  publicPhoneConsent Boolean             @default(false)
  rejectionReason    String?

  // Engagement aggregate counters (for instant profile card rendering)
  profileViews       Int                 @default(0)
  callClicks         Int                 @default(0)
  whatsappClicks     Int                 @default(0)
  shareClicks        Int                 @default(0)

  // Relationships
  skills             WorkerSkill[]
  workPhotos         WorkPhoto[]
  interactions       WorkerInteraction[]
  reports            Report[]
  
  createdAt          DateTime            @default(now())
  updatedAt          DateTime            @updatedAt

  @@index([status, categoryId, localityId])
  @@index([phone])
}

model WorkerSkill {
  workerId  String
  skillId   String
  worker    Worker @relation(fields: [workerId], references: [id], onDelete: Cascade)
  skill     Skill  @relation(fields: [skillId], references: [id], onDelete: Cascade)

  @@id([workerId, skillId])
}

model WorkPhoto {
  id        String   @id @default(cuid())
  workerId  String
  worker    Worker   @relation(fields: [workerId], references: [id], onDelete: Cascade)
  photoUrl  String
  createdAt DateTime @default(now())
}

model WorkerInteraction {
  id        String          @id @default(cuid())
  workerId  String
  worker    Worker          @relation(fields: [workerId], references: [id], onDelete: Cascade)
  type      InteractionType
  createdAt DateTime        @default(now())

  @@index([workerId, createdAt])
}

model Report {
  id          String       @id @default(cuid())
  workerId    String
  worker      Worker       @relation(fields: [workerId], references: [id], onDelete: Cascade)
  reason      ReportReason
  details     String?
  resolved    Boolean      @default(false)
  createdAt   DateTime     @default(now())
}

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  createdAt    DateTime @default(now())
}

model OtpVerification {
  id        String   @id @default(cuid())
  phone     String
  otp       String
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([phone, otp])
}
```

---

## 4. Privacy & Data Integrity Rules
* **No PII Over-collection:** Never add columns for Aadhaar, PAN, Bank accounts, or exact door/home addresses.
* **Strict Unique Phone Constraint:** A mobile number can only belong to one worker profile, blocking duplicate registration attempts.
* **Slugs Over Raw IDs:** Worker profiles are reached via human-readable SEO slugs (`/worker/ramesh-kumar-electrician-sircilla`) instead of auto-incremented or database IDs.
