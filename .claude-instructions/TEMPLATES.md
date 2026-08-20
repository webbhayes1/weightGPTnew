# Templates (Copy-Paste for Claude)

**Purpose:** Ready-to-use templates for all document types. Copy, fill in, and use.

---

## 📋 Handoff Document Template

**Filename:** `handoffs/[context]/LATEST-YYYY-MM-DD.md`

```markdown
# Handoff: [Context] - [Date]

<!-- CLAUDE: Archive previous LATEST before creating this file -->

---

# ⛔ CRITICAL: FOR NEXT CLAUDE SESSION ⛔

**BEFORE doing ANYTHING in the next session, you MUST:**

1. **READ `.claude-instructions/HOW-TO-USE-THIS-PROJECT.md`** - This contains your complete workflow
2. **READ `project/OVERVIEW.md`** - Project vision and goals
3. **READ `project/STATUS.md`** - Current state and progress
4. **READ this handoff document** - What happened in the last session

**THEN provide the user with:**
- Current context (Planning/Development/Review)
- Project state summary
- What was accomplished last session
- What you're working on this session

**DO NOT start working until you've completed this initialization process.**

---

## Session Info
**Date:** YYYY-MM-DD HH:MM
**Context:** [Planning/Development/Review]
**Duration:** ~[X] hours
**Token Usage:** [X]K / 200K (if known)

---

## Current State

**Project Phase:** [Q1 Planning / Q1 Development / etc.]

**What's Completed:**
- [Feature/task 1]
- [Feature/task 2]

**What's In Progress:**
- [Current work 1]
- [Current work 2]

**What's Next:**
- [Next priority 1]
- [Next priority 2]

---

## What Happened This Session

**Major Accomplishments:**
1. [Accomplishment 1 - be specific]
2. [Accomplishment 2]
3. [Accomplishment 3]

**Discussions:**
- [Topic discussed and outcome]
- [Topic discussed and outcome]

**Issues Encountered:**
- [Issue 1 - how it was resolved or current status]

---

## Key Decisions

| Decision | Rationale | Impact |
|----------|-----------|--------|
| [Decision 1] | [Why] | [What it affects] |
| [Decision 2] | [Why] | [What it affects] |

**Note:** All decisions above have been added to [DECISIONS.md](../../project/DECISIONS.md)

---

## Next Session Should

**Immediate Priorities:**
1. [Priority 1 - most urgent]
2. [Priority 2]
3. [Priority 3]

**Later:**
- [Future task 1]
- [Future task 2]

**Blocked/Waiting:**
- [Anything blocked - why and what's needed to unblock]

---

## Files Modified

**Created:**
- [file 1 with path]
- [file 2 with path]

**Updated:**
- [file 1 with path] - [what changed]
- [file 2 with path] - [what changed]

**Deleted:**
- [file 1 with path] - [why deleted]

---

## Read These Next Time

**Required (always):**
- [project/OVERVIEW.md](../../project/OVERVIEW.md)
- [project/STATUS.md](../../project/STATUS.md)
- This handoff document

**Context-specific:**
- [Add context-specific files here]

---

## Context for Next Instance

[Write 2-4 paragraphs explaining everything the next Claude instance MUST know]

**What was decided:**
[Explain key decisions and why - don't just list them]

**What approaches were tried:**
[What worked, what didn't, what was rejected and why]

**Open questions:**
[What still needs to be decided or clarified]

**Important context:**
[Anything else next Claude must understand to be effective]

---

**Handoff Version:** 1.0
**Next Claude Instance:** Read [.claude-instructions/HOW-TO-USE-THIS-PROJECT.md](../../.claude-instructions/HOW-TO-USE-THIS-PROJECT.md) first
```

---

## 📝 Decision Log Entry Template

**Location:** Add to `project/DECISIONS.md` (at TOP of decisions section)

```markdown
### [Short Decision Title]
**Date:** YYYY-MM-DD HH:MM
**Context:** [Planning/Development/Review]
**Made By:** [User / Claude-Planning / Claude-Development / Claude-Review]
**Status:** [Active / Superseded / Archived]

**Decision:**
[Clear, concise statement of what was decided - one or two sentences]

**Rationale:**
[Why this decision was made - can be multiple paragraphs]
- Reason 1
- Reason 2
- Reason 3

**Impact:**
- **Affects:** [Which components/features/files this impacts]
- **Supersedes:** [Previous decision ID or "None"]
- **Breaking Change:** [Yes/No - if yes, explain what breaks]

**Alternatives Considered:**
- [Option A - why rejected]
- [Option B - why rejected]

**References:**
- **Spec:** [Link to related spec document]
- **Discussion:** [Link to handoff where this was discussed]
- **Implementation:** [Link to code/PR if applicable]

**Related Decisions:**
- [Link to related decision #1]
- [Link to related decision #2]

---
```

---

## 📊 Status Update Template

**Location:** Update in `project/STATUS.md`

```markdown
# Project Status

**Last Updated:** YYYY-MM-DD HH:MM by [Planning/Development/Review] context

---

## Current Phase

**Phase:** [Q1 Planning / Q1-Q3 Planning / Q1 Development / etc.]

**Focus:** [One sentence about current focus]

---

## Completed ✅

**Q1: Onboarding Flow**
- [Sub-task 1] (completed YYYY-MM-DD)
- [Sub-task 2] (completed YYYY-MM-DD)

**Q2: [Feature Name]**
- [Sub-task 1]

---

## In Progress 🔄

**Q1: Onboarding Implementation** (60% complete)
- ✅ Screens 1-10 built
- 🔄 Screens 11-16 in progress
- ⏳ Loading screens pending
- ⏳ Value demo screens pending

**Q3: [Feature Name]** (25% complete)
- ✅ [Completed sub-task]
- 🔄 [In progress sub-task]

---

## Next Up 📋

**Immediate (This Week):**
1. [Next priority 1]
2. [Next priority 2]

**Soon (Next 2 Weeks):**
- [Task 1]
- [Task 2]

**Later (Next Month+):**
- [Task 1]
- [Task 2]

---

## Blockers 🚫

**Active Blockers:**
- **[Blocker Title]**
  - Issue: [Description]
  - Impact: [What it's blocking]
  - Workaround: [If any]
  - Resolution: [What's needed to resolve]

**No blockers currently** ← Use this if none

---

## Metrics

**Planning Progress:** Q1-Q3 complete (60% of total)
**Development Progress:** Q1 in progress (10% of total)
**Testing Progress:** Not started

**Estimated Completion:** [Date or "TBD"]

---

**Last Updated:** YYYY-MM-DD HH:MM by [context]
```

---

## 📅 Development Log Entry Template

**Location:** Add to TOP of `logs/DEVELOPMENT_LOG.md`

```markdown
### Session [N]: [Date] - [Context]
**Focus:** [One-line description of session focus]

**Accomplished:**
- [Major accomplishment 1]
- [Major accomplishment 2]
- [Major accomplishment 3]

**Decisions:**
- [Link to decision in DECISIONS.md]
- [Link to another decision]

**Handoff:** [LATEST-YYYY-MM-DD.md](../handoffs/[context]/LATEST-YYYY-MM-DD.md)

**Next:** [Brief description of what's next]

---
```

---

## 📖 Planning Spec Template

**Filename:** `project/planning/Q[N]_[FeatureName]_FINAL.md`

```markdown
# Q[N]: [Feature Name] - Final Specification

**Feature:** [Feature Name]
**Status:** [Draft / In Review / Finalized]
**Owner:** [Planning context / User]
**Created:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD

---

## Table of Contents
1. [Overview](#overview)
2. [User Stories](#user-stories)
3. [User Flow](#user-flow)
4. [Screen Specifications](#screen-specifications)
5. [Technical Requirements](#technical-requirements)
6. [Data Structures](#data-structures)
7. [Success Criteria](#success-criteria)
8. [Open Questions](#open-questions)
9. [Revisions](#revisions)

---

## Overview

**What:** [One paragraph describing the feature]

**Why:** [Why this feature is important - user value]

**When:** [When this is used in the user journey]

**Dependencies:** [What must exist before this can be built]

---

## User Stories

**As a** [type of user]
**I want** [goal/desire]
**So that** [benefit/value]

**Acceptance Criteria:**
- [ ] [Criteria 1]
- [ ] [Criteria 2]
- [ ] [Criteria 3]

---

## User Flow

```
[Screen A]
    ↓
[User Action]
    ↓
[Screen B]
    ↓
[Branching decision?]
    ├─ Yes → [Screen C]
    └─ No → [Screen D]
```

---

## Screen Specifications

### Screen [N]: [Screen Name]

**Purpose:** [What this screen does]

**Layout:**
- [Element 1] - [Description]
- [Element 2] - [Description]

**Interactions:**
- [Tap X] → [Result]
- [Swipe Y] → [Result]

**States:**
- Loading: [What shows]
- Success: [What shows]
- Error: [What shows]

**Validation:**
- [Field 1]: [Validation rules]

**Navigation:**
- Next: [Where user goes next]
- Back: [Where user goes if they go back]

---

## Technical Requirements

**APIs Needed:**
- [API endpoint 1] - [Purpose]
- [API endpoint 2] - [Purpose]

**Calculations:**
- [Calculation 1] - [Formula or logic]

**Storage:**
- [What data is stored where]

**Performance:**
- [Performance requirements]

---

## Data Structures

```typescript
interface [DataType] {
  [field]: [type]; // [description]
}
```

---

## Success Criteria

**Functional:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]

**Non-Functional:**
- [ ] [Performance criterion]
- [ ] [UX criterion]
- [ ] [Accessibility criterion]

---

## Open Questions

- [ ] [Question 1]
- [ ] [Question 2]

---

## Revisions

### v1.0 - YYYY-MM-DD
**Initial version** - No revisions yet

---

**Document Version:** 1.0
**Last Updated:** YYYY-MM-DD
**Status:** Finalized
```

---

## 🏗️ Architecture Document Template

**Filename:** `project/implementation/ARCHITECTURE.md`

```markdown
# Architecture Document

**Project:** WeightGPT
**Last Updated:** YYYY-MM-DD HH:MM
**Status:** [Draft / Finalized]

---

## Tech Stack

**Frontend:**
- Framework: [React Native / etc.]
- UI Library: [React Native Paper / etc.]
- State Management: [Context API / Redux / etc.]
- Navigation: [React Navigation / etc.]

**Backend:**
- Runtime: [Node.js / etc.]
- Framework: [Express / etc.]
- Hosting: [Render / etc.]

**Database:**
- Primary: [PostgreSQL / SQLite / etc.]
- Caching: [Redis / etc.]
- ORM: [Prisma / Sequelize / etc.]

**External Services:**
- AI: OpenAI API (GPT-4)
- Auth: [Service]
- Payments: [Service]

---

## Database Schema

```typescript
// User table
interface User {
  id: string;
  // ... fields
}

// ... other tables
```

---

## API Design

**Base URL:** `https://api.weightgpt.com/v1`

**Endpoints:**

```
POST /auth/register
POST /auth/login
GET /users/:id/profile
PUT /users/:id/profile
GET /users/:id/meal-plan
POST /users/:id/meal-feedback
```

---

## Folder Structure

```
/src
  /components
    /common
    /screens
  /navigation
  /services
  /utils
  /types
```

---

**Last Updated:** YYYY-MM-DD
**Version:** 1.0
```

---

## 📋 Implementation Plan Template

**Filename:** `project/implementation/PLAN.md`

```markdown
# Implementation Plan

**Project:** WeightGPT
**Last Updated:** YYYY-MM-DD
**Status:** [Planning / In Progress / Complete]

---

## Build Order

### Phase 1: Core Onboarding
**Goal:** Users can complete onboarding and see value demo

**Steps:**
1. [ ] Set up project structure
2. [ ] Create navigation shell
3. [ ] Implement screens 1-5 (goals & metrics)
4. [ ] Implement screens 6-10 (nutrition preferences)
5. [ ] Implement screens 11-16 (workouts & settings)
6. [ ] Add loading screens
7. [ ] Build value demo screens
8. [ ] Integrate paywall

**Estimated Duration:** 2 weeks

---

### Phase 2: [Next Phase]
...

---

**Last Updated:** YYYY-MM-DD
**Version:** 1.0
```

---

**Last Updated:** 2025-11-06
**Version:** 1.1 (Added STOP section to handoff template)

**How to Use:** Copy the relevant template, fill in the bracketed sections, update timestamps, and save to the appropriate location.
