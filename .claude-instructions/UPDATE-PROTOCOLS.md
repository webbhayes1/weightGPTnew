# Update Protocols (For Claude)

**Purpose:** Specific instructions for when and how to update each file type in the project.

---

## 📄 File-Specific Update Instructions

### STATUS.md

**Location:** `project/STATUS.md`

**Update Frequency:** End of EVERY session

**When to Update:**
- Task moves from "In Progress" to "Completed"
- New task identified for "Next Up"
- Blocker discovered or resolved
- Phase transition (e.g., Q1 Planning → Q1 Development)

**How to Update:**

1. **Update "Last Updated" line at bottom:**
   ```markdown
   Last Updated: 2025-11-04 14:30 by Planning context
   ```

2. **Move completed items:**
   - From "In Progress 🔄" → "Completed ✅"
   - Add completion date if significant milestone

3. **Add new items to "Next Up 📋":**
   - Discovered during this session
   - Keep prioritized (most important first)

4. **Update "In Progress 🔄":**
   - Add new items being worked on
   - Update percentage if trackable
   - Add sub-bullets for progress details

5. **Manage "Blockers 🚫":**
   - Add new blockers with description
   - Remove resolved blockers (move to "Completed" with note)

**Example Update:**
```markdown
## In Progress 🔄
- Q2 Meal Planning spec: 75% complete
  - ✅ Meal viewing screens designed
  - ✅ Recipe detail flow finalized
  - 🔄 Shopping list generation in progress
  - ⏳ Meal swapping pending

---
Last Updated: 2025-11-04 14:30 by Planning context
```

---

### DECISIONS.md

**Location:** `project/DECISIONS.md`

**Update Frequency:** When decisions are made

**When to Update:**
- User makes explicit decision
- You (Claude) recommend option and user approves
- Technical choice is made that affects future work
- Change to previous decision (mark original as superseded)

**How to Update:**

1. **Use the template:**
   ```markdown
   ### [Decision Title]
   **Date:** YYYY-MM-DD HH:MM
   **Context:** [Planning/Development/Review]
   **Made By:** [User/Claude-Planning/Claude-Development]
   **Status:** [Active/Superseded/Archived]

   **Decision:**
   [Clear statement of what was decided]

   **Rationale:**
   [Why this decision was made - user's reasoning or technical reasoning]

   **Impact:**
   - Affects: [components/features/files affected]
   - Supersedes: [previous decision if applicable]
   - Breaking change: [Yes/No - if yes, explain]

   **References:**
   - Spec: [link to related spec]
   - Discussion: [link to handoff where discussed]

   ---
   ```

2. **Add to TOP of decisions section** (most recent first)

3. **If superseding previous decision:**
   - Update old decision's status to "Superseded"
   - Link from old → new
   - Link from new → old

**Example:**
```markdown
### Use React Native Paper for UI Components
**Date:** 2025-11-04 14:30
**Context:** Development
**Made By:** User
**Status:** Active

**Decision:**
Use React Native Paper component library instead of building custom components.

**Rationale:**
- Faster development
- Built-in accessibility
- Material Design compliance
- Well-maintained library

**Impact:**
- Affects: All UI components in src/components/
- Supersedes: "Build custom component library" (2025-11-03)
- Breaking change: No (early in development)

**References:**
- Spec: [ARCHITECTURE.md](../implementation/ARCHITECTURE.md#ui-framework)
- Discussion: [Planning Handoff 2025-11-04](../../handoffs/planning/LATEST-2025-11-04.md)

---
```

---

### Handoff Documents

**Location:** `handoffs/[context]/LATEST-YYYY-MM-DD.md`

**Update Frequency:** End of every session

**When to Create:**
- User says "create handoff"
- User says "end session"
- User says "update docs"
- Context approaching 180K tokens
- Natural stopping point reached

**How to Create:**

1. **Archive previous LATEST file:**
   - If `handoffs/planning/LATEST-2025-11-03.md` exists
   - Move to `handoffs/planning/archive/20251103-handoff.md`
   - Remove "LATEST-" prefix, condense date format

2. **Create new file:**
   - Filename: `handoffs/[context]/LATEST-YYYY-MM-DD.md`
   - Date = today's date

3. **Use template from TEMPLATES.md**

4. **Required sections:**
   - Session Info (date, context, duration, tokens)
   - Current State (where project stands now)
   - What Happened This Session (3-5 accomplishments)
   - Key Decisions (table format - ALSO add to DECISIONS.md)
   - Next Session Should (prioritized list)
   - Files Modified (created/updated/deleted)
   - Read These Next Time (initialization guide for next Claude)
   - Context for Next Instance (2-3 paragraphs)

5. **Be specific in "Context for Next Instance":**
   - What decisions were made and why
   - What approaches were tried and rejected
   - What questions remain open
   - What the next Claude instance MUST know

**Example excerpt:**
```markdown
## Context for Next Instance

This session finalized Q2 Meal Planning spec. We decided on a calendar-based view
with daily detail screens, after rejecting a list-based approach (see DECISIONS.md).

Key insight: Users need to see the week at-a-glance for meal prep planning, so
calendar view is essential. Daily detail screen shows all 4 meals + macros + option
to swap individual meals.

Open question: Should meal swapping be 1-for-1 replacement or rebuild entire day?
Leaning toward 1-for-1 for simplicity, but discuss with user next session.

Next session should create shopping list generation spec and meal swapping flow.
```

---

### DEVELOPMENT_LOG.md

**Location:** `logs/DEVELOPMENT_LOG.md`

**Update Frequency:** End of every session

**When to Update:**
- After creating handoff document
- Every session, regardless of context

**How to Update:**

1. **Add entry at TOP** (most recent first)

2. **Use template from file header**

3. **Keep concise** - detailed info goes in handoff

**Template:**
```markdown
### Session [N]: [Date] - [Context]
**Focus:** [One-line description]
**Accomplished:**
- [Bullet 1]
- [Bullet 2]
**Decisions:** [Link to DECISIONS.md entries if any]
**Handoff:** [handoffs/context/LATEST-YYYY-MM-DD.md](../handoffs/context/LATEST-YYYY-MM-DD.md)
**Next:** [What's next]

---
```

**Example:**
```markdown
### Session 5: 2025-11-04 - Planning
**Focus:** Finalize Q2 Meal Planning specification
**Accomplished:**
- Designed calendar-based weekly view
- Specified daily detail screen with 4 meals
- Defined meal swapping interaction
**Decisions:** Calendar view over list view (see DECISIONS.md #012)
**Handoff:** [LATEST-2025-11-04.md](../handoffs/planning/LATEST-2025-11-04.md)
**Next:** Shopping list generation and meal feedback UX

---
```

---

### Planning Specs (Q1-Q7)

**Location:** `project/planning/Q[N]_[Feature]_FINAL.md`

**Update Frequency:** Rarely (only during revisions)

**When to Update:**
- Major revision to spec after user feedback
- Discovered missing requirements during development
- Decision changes that affect the spec

**How to Update:**

1. **Increment version number in footer:**
   - Minor change (addition): v1.0 → v1.1
   - Major change (rewrite): v1.0 → v2.0

2. **Add "Revisions" section if doesn't exist**

3. **Document the revision:**
   ```markdown
   ## Revisions

   ### v1.1 - 2025-11-04
   **Changed by:** Planning context
   **Reason:** User feedback during Q2 planning

   **Changes:**
   - Added meal swapping feature (section 4.3)
   - Updated navigation flow to include swap button
   - Modified data structure to track meal history

   **Impact:**
   - Affects: Q2 implementation plan
   - Related decision: DECISIONS.md #015

   ---
   ```

4. **Update "Last Updated" in footer**

5. **Create decision log entry in DECISIONS.md**

**When NOT to update:**
- Small typo fixes (just fix, don't version)
- Clarifications that don't change meaning
- Formatting improvements

---

### OVERVIEW.md

**Location:** `project/OVERVIEW.md`

**Update Frequency:** Almost never

**When to Update:**
- Major project scope change
- Complete pivot in approach
- User explicitly requests update

**How to Update:**
1. **Get user approval first** - this is foundational doc
2. Increment version
3. Document in DECISIONS.md
4. Update "Last Updated" timestamp
5. Notify in handoff that OVERVIEW changed

---

### Implementation Docs (ARCHITECTURE, PLAN, REQUIREMENTS)

**Location:** `project/implementation/`

**Update Frequency:** During development planning phase

**When to Update:**

**ARCHITECTURE.md:**
- Tech stack decisions
- Database schema changes
- API design decisions
- Infrastructure changes

**PLAN.md:**
- Build order changes
- New steps discovered
- Steps completed (mark with ✅)

**REQUIREMENTS.md:**
- New user stories identified
- Acceptance criteria refined
- Requirements prioritization changed

**How to Update:**
- Same versioning as planning specs
- Update "Last Updated" timestamp
- Log changes in DECISIONS.md if significant
- Reference in handoff document

---

## 🔄 Update Cascade Rules

**These are MUST-DO cascades:**

| Primary Update | Must Also Update |
|----------------|------------------|
| Complete any task | STATUS.md → move to "Completed" |
| User makes decision | DECISIONS.md → new entry |
| End session | STATUS.md, handoff, DEVELOPMENT_LOG.md |
| Change spec | DECISIONS.md (why changed), bump version |
| Change architecture | ARCHITECTURE.md, DECISIONS.md, PLAN.md (if build order affected) |
| Finish implementation step | PLAN.md (mark ✅), STATUS.md |

---

## ⚠️ Common Update Mistakes

1. **Forgetting to timestamp**
   - ALWAYS update "Last Updated: YYYY-MM-DD HH:MM by [context]"

2. **Not archiving previous LATEST**
   - Before creating new LATEST-2025-11-04.md
   - Move old LATEST-2025-11-03.md to archive/20251103-handoff.md

3. **Adding decisions to handoff but not DECISIONS.md**
   - Decisions must be in BOTH places

4. **Not updating STATUS.md**
   - Update at end of EVERY session, no exceptions

5. **Using wrong timestamp format**
   - Use YYYY-MM-DD HH:MM (not MM/DD/YY or other formats)

6. **Forgetting version increment**
   - When changing spec, ALWAYS bump version

7. **Breaking relative links**
   - Always use relative paths: `../planning/Q1.md`
   - Never absolute: `/Users/webbhayes/...`

---

## ✅ Update Checklist (End of Session)

Use this checklist every time user says "create handoff":

- [ ] Archive previous LATEST handoff (if exists)
- [ ] Create new handoff document
- [ ] Update STATUS.md (move items, add "Next Up", update timestamp)
- [ ] Add entries to DECISIONS.md (if decisions made)
- [ ] Add session entry to DEVELOPMENT_LOG.md
- [ ] Update any specs that were modified (bump version)
- [ ] Update PLAN.md if implementation steps completed
- [ ] Verify all relative links still work
- [ ] Verify all timestamps use correct format
- [ ] Tell user what was updated

---

**Last Updated:** 2025-11-04
**Version:** 1.0
