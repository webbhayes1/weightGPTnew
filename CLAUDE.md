# Development Phase Organization Structure

**Purpose:** This document defines the file organization, documentation structure, and maintenance protocols for the Development Phase (Sessions 14+).

**Status:** Active
**Created:** 2025-11-07
**Last Updated:** 2025-11-07

---

## 📁 File Organization Structure

### **Core Principle: Two-Phase Documentation**

```
Planning Specs (in /project/planning/) = WHAT to build (immutable during dev)
Implementation Docs (in /project/implementation/) = HOW to build (living documents)
```

---

## 🗂️ Directory Structure

### **1. Implementation Documentation** `/project/implementation/`

**Purpose:** Technical execution documents (living, updated during development)

```
/project/implementation/
├── DATABASE_SCHEMA.md          # 25 PostgreSQL tables, ERD, design decisions
├── API_SPECIFICATION.md        # ~70 endpoints, request/response formats
├── ARCHITECTURE.md             # Tech stack, folder structure, auth flows
├── PLAN.md                     # Build phases, dependencies, timeline
├── CODE_STANDARDS.md           # Naming conventions, testing, Git workflow
├── DEVELOPMENT_SETUP_GUIDE.md  # Local env setup, how to run backend/mobile
├── REQUIREMENTS.md             # User stories, acceptance criteria
└── SESSION_PLAN.md             # Session-by-session roadmap (Sessions 14-23)
```

**Update Frequency:**
- Created once during Pre-Development Setup (Sessions 14-23)
- Updated as needed during Development (Session 24+)
- ARCHITECTURE.md, PLAN.md updated most frequently

---

### **2. Planning Specifications** `/project/planning/`

**Purpose:** Feature specifications (immutable during development)

```
/project/planning/
├── Q0_DATA_STRUCTURES.md           # Single source of truth for data structures
├── Q1_Onboarding_FINAL.md          # 17-step onboarding flow
├── Q2_MealPlanning_FINAL.md        # Meal planning system
├── Q3.0_Navigation_AppShell_FINAL.md  # 3-tab navigation, Home/Log/Progress
├── Q3.1_Settings_Profile_FINAL.md  # Settings and profile management
├── Q3.2_AI_Logging_FINAL.md        # AI-powered logging (meals, workouts, weight)
├── Q3.3_Swapping_FINAL.md          # Meal and workout swapping
├── Q3.4_Weekly_Planning_Grocery_FINAL.md  # Weekly planning, grocery lists
├── Q3.5_Progress_Analytics_FINAL.md  # Weight graph, summaries, achievements
├── Q3.6_History_Saved_FINAL.md     # History screen, saved items
└── Q3.7_Offline_Sync_FINAL.md      # Offline mode, sync strategy
```

**Update Frequency:**
- **DO NOT UPDATE** during development
- These are requirements, not implementation notes
- If changes needed, discuss with user first and create new version

---

### **3. Claude Instructions** `/.claude-instructions/`

**Purpose:** Instructions for Claude across all contexts

```
/.claude-instructions/
├── HOW-TO-USE-THIS-PROJECT.md     # Main initialization guide (all contexts)
├── DEVELOPMENT-ORGANIZATION.md     # This file (dev phase structure)
├── DEVELOPMENT-CONTEXT.md          # Dev session workflow (Session 22)
├── TEMPLATES.md                    # Document templates
├── UPDATE-PROTOCOLS.md             # File update cascade rules
├── STANDARDS.md                    # Naming and formatting standards
└── USER-COMMANDS.md                # User command reference
```

**Update Frequency:**
- Rarely (only for workflow improvements)
- Get user approval before changes

---

### **4. Handoffs** `/handoffs/`

**Purpose:** Session continuity and context transfer between Claude instances

```
/handoffs/
├── planning/
│   ├── LATEST-YYYY-MM-DD.md       # Most recent planning session
│   └── archive/                    # Old planning handoffs
├── development/
│   ├── LATEST-YYYY-MM-DD.md       # Most recent dev session
│   └── archive/                    # Old dev handoffs
└── review/
    ├── LATEST-YYYY-MM-DD.md       # Most recent review session
    └── archive/                    # Old review handoffs
```

**Update Frequency:**
- **Every session** (create new LATEST, archive old one)
- Use template from TEMPLATES.md

---

### **5. Project Root** `/project/`

**Purpose:** High-level project documentation

```
/project/
├── OVERVIEW.md              # Project vision, goals, success criteria
├── STATUS.md                # Current state (updated every session)
├── DECISIONS.md             # Decision log (updated when decisions made)
├── DESIGN_SYSTEM.md         # Visual design system
├── Q0_DATA_STRUCTURES.md    # Single source of truth for data
├── DEVELOPMENT_SETUP.md     # Setup info (credentials, hosting)
├── planning/                # Feature specifications (Q1-Q3.7)
└── implementation/          # Technical execution docs
```

**Update Frequency:**
- STATUS.md: Every session
- DECISIONS.md: When decisions made
- OVERVIEW.md: Rarely (major scope changes only)

---

### **6. Development Log** `/logs/`

**Purpose:** Chronological development history

```
/logs/
└── DEVELOPMENT_LOG.md       # Session-by-session changelog
```

**Update Frequency:**
- Every session (add entry at top)

---

## 📋 Development Phase Workflow

### **Phase 1: Pre-Development Setup (Sessions 14-23)**

**Goal:** Create all implementation documentation BEFORE writing code

| Session | Deliverable | Status |
|---------|-------------|--------|
| 14 | DATABASE_SCHEMA.md | ✅ COMPLETE |
| 15 | API_SPECIFICATION.md | 📋 PENDING |
| 16 | Tech Stack Decisions (in DECISIONS.md) | 📋 PENDING |
| 17 | ARCHITECTURE.md | 📋 PENDING |
| 18 | PLAN.md | 📋 PENDING |
| 19 | CODE_STANDARDS.md | 📋 PENDING |
| 20 | DEVELOPMENT_SETUP_GUIDE.md | 📋 PENDING |
| 21 | REQUIREMENTS.md | 📋 PENDING |
| 22 | DEVELOPMENT-CONTEXT.md | 📋 PENDING |
| 23 | Final Pre-Development Review | 📋 PENDING |

**Approach:** Complete ALL pre-development documentation before Session 24

---

### **Phase 2: Development Execution (Session 24+)**

**Goal:** Implement features following the plan

**Build Order (from PLAN.md - to be created Session 18):**
1. Phase 1: Foundation (backend + mobile setup, database migrations)
2. Phase 2: Q1 Onboarding
3. Phase 3: Q3.0 Navigation shell
4. Phase 4: Q2 Meal Planning + Q3.4 Weekly Planning
5. Phase 5: Q3.2 AI Logging + Q3.3 Swapping
6. Phase 6: Q3.5 Progress Analytics
7. Phase 7: Q3.6 History & Saved + Q3.7 Offline/Sync
8. Phase 8: Q3.1 Settings & Profile
9. Phase 9: Testing, QA, polish
10. Phase 10: App Store submission

---

## 🔄 Session Workflow

### **Session Start (Development Context)**

**Required Reading (in order):**
1. `.claude-instructions/HOW-TO-USE-THIS-PROJECT.md`
2. `.claude-instructions/DEVELOPMENT-ORGANIZATION.md` (this file)
3. `.claude-instructions/DEVELOPMENT-CONTEXT.md` (Session 22+)
4. `project/STATUS.md`
5. `handoffs/development/LATEST-YYYY-MM-DD.md`
6. `project/implementation/PLAN.md` (current phase)
7. Relevant planning spec (e.g., Q1 if building onboarding)

**Then:**
- Confirm with user what to work on
- Create TodoWrite list for session tasks (if complex, multi-step work)

---

### **During Development**

**Write Code:**
- Follow `CODE_STANDARDS.md`
- Write tests for all new code
- Commit frequently with clear messages

**Update Docs:**
- Update implementation docs if architecture changes
- Log technical decisions in `DECISIONS.md`
- Update `PLAN.md` if timeline changes

**Testing:**
- Run tests before committing
- Minimum 80% code coverage
- All tests must pass before session end

---

### **Session End (Development Context)**

**Required Steps (in order):**
1. ✅ Run all tests (must pass)
2. ✅ Update `STATUS.md` (move completed items)
3. ✅ Update `PLAN.md` (mark completed steps)
4. ✅ Log decisions in `DECISIONS.md` (if any made)
5. ✅ Create handoff document (`/handoffs/development/LATEST-YYYY-MM-DD.md`)
6. ✅ Archive old LATEST handoff to `/handoffs/development/archive/`
7. ✅ Update `DEVELOPMENT_LOG.md` (add session entry at top)
8. ✅ Confirm with user session is complete

---

## 📊 Single Source of Truth (SSOT)

**For Each Type of Information, There is ONE Authoritative Source:**

| Information Type | Source Document | Location |
|------------------|-----------------|----------|
| **Current project state** | STATUS.md | `/project/STATUS.md` |
| **Why decisions were made** | DECISIONS.md | `/project/DECISIONS.md` |
| **What to build** | Planning specs | `/project/planning/Q[N]_*.md` |
| **How to build** | Implementation docs | `/project/implementation/*.md` |
| **Data structures** | Q0_DATA_STRUCTURES.md | `/project/Q0_DATA_STRUCTURES.md` |
| **Database schema** | DATABASE_SCHEMA.md | `/project/implementation/DATABASE_SCHEMA.md` |
| **API contracts** | API_SPECIFICATION.md | `/project/implementation/API_SPECIFICATION.md` |
| **Build sequence** | PLAN.md | `/project/implementation/PLAN.md` |
| **Tech stack** | ARCHITECTURE.md | `/project/implementation/ARCHITECTURE.md` |
| **Coding standards** | CODE_STANDARDS.md | `/project/implementation/CODE_STANDARDS.md` |
| **Visual design** | DESIGN_SYSTEM.md | `/project/DESIGN_SYSTEM.md` |
| **Recent session** | Latest handoff | `/handoffs/[context]/LATEST-*.md` |
| **Session history** | DEVELOPMENT_LOG.md | `/logs/DEVELOPMENT_LOG.md` |

**Rule:** If information conflicts, the SSOT document wins. Update other docs to match.

---

## 🔄 File Update Cascade Rules

**When you update one file, check if others need updating:**

| You Update | Also Update |
|------------|-------------|
| Any implementation doc | STATUS.md (if affects "In Progress" items) |
| Complete a feature | STATUS.md, handoff, DEVELOPMENT_LOG.md |
| Make a tech decision | DECISIONS.md, handoff |
| Change architecture | ARCHITECTURE.md, possibly PLAN.md |
| Add/modify API endpoint | API_SPECIFICATION.md, possibly DATABASE_SCHEMA.md |
| Change database schema | DATABASE_SCHEMA.md, API_SPECIFICATION.md |
| Change build order | PLAN.md, STATUS.md |
| Create handoff | STATUS.md, DEVELOPMENT_LOG.md |

---

## 🎯 Key Organizational Principles

### **1. Separation of Concerns**

- **Planning specs** = Requirements (WHAT to build)
  - Located: `/project/planning/`
  - Status: Immutable during development
  - Purpose: Define features, UX, requirements

- **Implementation docs** = Execution (HOW to build)
  - Located: `/project/implementation/`
  - Status: Living documents, updated during dev
  - Purpose: Technical architecture, API design, build plan

- **Handoffs** = Continuity (WHAT happened last session)
  - Located: `/handoffs/[context]/`
  - Status: Created every session, archived when old
  - Purpose: Context transfer between Claude instances

- **Decisions** = Rationale (WHY choices were made)
  - Located: `/project/DECISIONS.md`
  - Status: Append-only (never delete decisions)
  - Purpose: Historical record of all major decisions

### **2. Two-Phase Documentation Strategy**

**Phase 1: Pre-Development (Sessions 14-23)**
- Create ALL implementation docs BEFORE coding
- Finalize tech stack, architecture, build plan
- No code written during this phase

**Phase 2: Development (Session 24+)**
- Write code following implementation docs
- Update implementation docs as architecture evolves
- Planning specs remain immutable

### **3. Version Control Integration**

**Commit Conventions:**
```
type(scope): brief description

Longer description if needed

Implements: Q1 Step 5 (Goal Date Screen)
Tests: Added unit tests for timeline validation
```

**Types:** `feat`, `fix`, `refactor`, `test`, `docs`, `style`, `chore`

**Branch Naming:**
- `feature/q1-onboarding`
- `fix/meal-swap-race-condition`
- `refactor/api-error-handling`
- `test/workout-logging-e2e`

**When to Commit:**
- After completing a logical unit of work
- After all tests pass
- Before switching tasks
- At end of session (if work in progress)

### **4. Regular Updates**

**Every Session:**
- ✅ Update STATUS.md (move items from "In Progress" to "Completed")
- ✅ Create handoff document
- ✅ Update DEVELOPMENT_LOG.md

**When Making Decisions:**
- ✅ Update DECISIONS.md with rationale

**When Architecture Changes:**
- ✅ Update ARCHITECTURE.md
- ✅ Check if PLAN.md timeline affected

**Weekly (for longer projects):**
- ✅ Update PLAN.md with actual vs estimated progress
- ✅ Review STATUS.md for accuracy

### **5. Handoff System**

**Rules:**
- Only ONE `LATEST-YYYY-MM-DD.md` file per context
- When creating new handoff, archive old LATEST to `/archive/`
- Use template from TEMPLATES.md
- Include: what happened, decisions, next steps, files modified

**Handoff Locations:**
- Planning: `/handoffs/planning/LATEST-YYYY-MM-DD.md`
- Development: `/handoffs/development/LATEST-YYYY-MM-DD.md`
- Review: `/handoffs/review/LATEST-YYYY-MM-DD.md`

---

## 🚫 Common Mistakes to Avoid

### **Don't:**
1. ❌ Modify planning specs during development (they're requirements, not notes)
2. ❌ Let multiple LATEST handoffs accumulate (archive old ones)
3. ❌ Forget to update STATUS.md after each session
4. ❌ Skip logging decisions in DECISIONS.md
5. ❌ Write code before completing Pre-Development Setup (Sessions 14-23)
6. ❌ Commit code without tests passing
7. ❌ Update implementation docs without updating handoff
8. ❌ Create new documents without consulting this structure first

### **Do:**
1. ✅ Follow the session workflow (start → during → end)
2. ✅ Archive old LATEST handoffs properly
3. ✅ Update STATUS.md at end of every session
4. ✅ Log all technical decisions in DECISIONS.md
5. ✅ Complete all Pre-Development docs before coding (Session 24)
6. ✅ Write tests for all new code (80% coverage minimum)
7. ✅ Keep implementation docs in sync with actual code
8. ✅ Reference this document when unsure about organization

---

## 📝 Document Templates

**All templates available in:** `.claude-instructions/TEMPLATES.md`

**Key Templates:**
- Handoff document (all contexts)
- Decision log entry
- Status update
- Development log entry
- Implementation document header

**Use templates consistently** - don't create custom formats

---

## 🆘 When Things Go Wrong

### **If Confused About Project State:**
1. Read `STATUS.md` - it's the source of truth
2. Read latest handoff for your context
3. Ask user for clarification

### **If File is Missing:**
1. Check if it's been created yet (we're in Phase 1: Pre-Development)
2. Check archive folders
3. Consult SESSION_PLAN.md for expected delivery session
4. Ask user

### **If Conflicting Information:**
1. Check the SSOT table above - which document is authoritative?
2. Update non-authoritative documents to match SSOT
3. Ask user if still unclear

### **If File Structure Unclear:**
1. Re-read this document (DEVELOPMENT-ORGANIZATION.md)
2. Check SESSION_PLAN.md for phase guidance
3. Ask user before creating new files/folders

---

## 🎓 Quick Reference

### **Current Phase:**
- ✅ Phase 1: Pre-Development Setup (Sessions 14-23)
- 📋 Phase 2: Development Execution (Session 24+)

### **Current Session:**
- Session 15: API Endpoint Consolidation

### **Essential Files to Read Every Session:**
1. `STATUS.md` - current state
2. Latest handoff for your context
3. This file (DEVELOPMENT-ORGANIZATION.md)
4. `SESSION_PLAN.md` (to know what's next)

### **Files to Update Every Session:**
1. `STATUS.md` - move completed items
2. Create new handoff (archive old LATEST)
3. `DEVELOPMENT_LOG.md` - add session entry
4. `DECISIONS.md` - if decisions made - ALWAYS refer to all decisions as they apply to specific features and flows during development

### **Critical Rules:**
- **Planning specs = immutable** (don't modify during dev)
- **Implementation docs = living** (update as needed)
- **One LATEST handoff per context** (archive old ones)
- **Every decision logged** (in DECISIONS.md)
- **Every session documented** (handoff + dev log)

---

## 📅 Revision History

### v1.0 - 2025-11-07
- Initial version created
- Documented complete development phase organization
- Defined two-phase documentation strategy
- Established file structure and update protocols
- Created SSOT reference table

---

**Document Version:** 1.0
**Created:** 2025-11-07
**Last Updated:** 2025-11-07
**Status:** Active - Reference this document at start of every development session
**Next Review:** After Session 23 (before development begins)