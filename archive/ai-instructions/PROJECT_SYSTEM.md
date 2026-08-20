# WeightGPT Project Management System

**Created:** November 4, 2025
**Project:** WeightGPT - AI-Powered Weight Management Mobile App
**Status:** Planning Phase (Q1 Complete, Moving to Q2)

---

## Project Objective

Build a comprehensive, user-friendly mobile application that helps users achieve their weight goals (gain, loss, or maintenance) through:
- Personalized AI-generated meal plans
- Custom workout programs
- Progress tracking and analytics
- Continuous learning from user feedback

**Success Criteria:**
- Users can complete onboarding in <2 minutes
- Meal plans adapt to user preferences over time
- Workout programs respect user schedules and equipment
- High retention rate through sustainable, enjoyable experience

---

## Project Structure

### **Folder Organization**

```
/weightGPTnew/
├── chathistory/                    # Conversation summaries & history
│   ├── SESSION_YYYY-MM-DD_*.md     # Detailed session notes (10+ pages)
│   ├── Q*_SUMMARY.md               # Quick reference per question
│   ├── DEVELOPMENT_LOG.md          # All sessions chronologically
│   └── CHANGELOG.md                # Technical changes log
│
├── CLAUDE.md                       # Main guidance for Claude Code
├── PROJECT_SYSTEM.md              # This file - project management
├── PROJECT_PLAN.md                # Overall project roadmap
├── UX_FEATURES.md                 # Living UX documentation
├── REQUIREMENTS.md                # User stories & tech requirements
├── ARCHITECTURE.md                # Tech stack, DB schema, API design
├── IMPLEMENTATION_PLAN.md         # Step-by-step build approach
│
└── [Source code directories - TBD]
```

---

## Document Types & Purpose

### **1. Project Knowledge (Must Know)**
**Location:** Project root
**Files:**
- `PROJECT_SYSTEM.md` (this file) - How we work
- `PROJECT_PLAN.md` - What we're building
- `REQUIREMENTS.md` - User stories & features
- `ARCHITECTURE.md` - Technical decisions
- `IMPLEMENTATION_PLAN.md` - Build order

**Usage:** Read these at start of every conversation

---

### **2. Session History (Might Need)**
**Location:** `/chathistory/`
**Files:**
- `SESSION_*.md` - Full conversation details
- `Q*_SUMMARY.md` - Quick reference per feature area
- `DEVELOPMENT_LOG.md` - Timeline of all work

**Usage:** Reference when context needed

---

### **3. Working Documents (Active Development)**
**Location:** Project root
**Files:**
- `UX_FEATURES.md` - Current UI/UX specs
- `CHANGELOG.md` - What changed and why

**Usage:** Update continuously during development

---

## Conversation Management System

### **Session Naming Convention**

```
SESSION_YYYY-MM-DD_[Question]_[Topic].md

Examples:
- SESSION_2025-11-04_Q1-Onboarding-Flow.md
- SESSION_2025-11-05_Q2-Meal-Planning.md
- SESSION_2025-11-06_Development_Phase1-Onboarding.md
```

### **Session Document Structure**

Every session document includes:

```markdown
# Session Summary: [Topic]

**Date:** YYYY-MM-DD
**Time:** HH:MM
**Focus:** [One-line description]
**Status:** [In Progress / Complete / Revised]

---

## Table of Contents
1. Initial Requirements
2. Discussion Process
3. Key Decisions Made
4. Final Specifications
5. Technical Implementation
6. Revisions (if any)

---

[Full content]

---

**Document Version:** X.X
**Last Updated:** YYYY-MM-DD
**Next Review:** [When]
```

### **Park Documents (End of Conversation)**

At the end of each conversation, create a Park Document:

**Location:** `/chathistory/PARK_YYYY-MM-DD_HHMM_[Topic].md`

**Template:**
```markdown
# Park Document: [Topic]

**Date:** YYYY-MM-DD HH:MM
**Session Duration:** X minutes
**Participants:** [User] & Claude
**Focus:** [Topic]

---

## What Was Accomplished

- [Bulleted list of completions]
- [Decisions made]
- [Files created/updated]

---

## Current State

**Completed:**
- [Features/specs finalized]

**In Progress:**
- [What's partially done]

**Blocked:**
- [Any blockers or dependencies]

---

## Key Decisions

| Decision | Rationale | Impact |
|----------|-----------|--------|
| [What] | [Why] | [Effect] |

---

## Next Steps

**Immediate (Next Conversation):**
1. [Priority 1]
2. [Priority 2]

**Soon:**
- [Upcoming tasks]

**Later:**
- [Future considerations]

---

## Files Modified

- Created: [list files]
- Updated: [list files]
- Deleted: [list files]

---

## Issues/Questions Raised

- [Open questions]
- [Things to validate]
- [Concerns to address]

---

## Context for Next Conversation

**What the next Claude instance MUST know:**
[2-3 paragraphs summarizing essential context]

**What they SHOULD read:**
- [File 1]
- [File 2]

**What they CAN reference if needed:**
- [Reference doc 1]
- [Reference doc 2]

---

**Park Document Version:** 1.0
**Next Session ID:** [Topic]
```

---

## Knowledge Management

### **Token Optimization Strategy**

**Tier 1: Always Load (< 5K tokens)**
- PROJECT_SYSTEM.md (this file)
- PROJECT_PLAN.md
- Current phase's SUMMARY.md
- Latest PARK document

**Tier 2: Load on Demand (5-20K tokens)**
- Full SESSION documents for current feature
- REQUIREMENTS.md
- ARCHITECTURE.md

**Tier 3: Reference Only (20K+ tokens)**
- Historical SESSION documents
- Detailed discussions archives

### **When to Create New Documents**

**New SESSION Document:**
- Starting work on a new feature area (Q1, Q2, Q3, etc.)
- Major architectural discussion
- Implementation of significant feature

**Update Existing:**
- UX_FEATURES.md - continuously updated
- DEVELOPMENT_LOG.md - append new session entries
- CHANGELOG.md - log technical changes
- PROJECT_PLAN.md - update progress/timeline

**New PARK Document:**
- **EVERY conversation** (for continuity)

---

## Conversation Initialization Protocol

### **Starting a New Conversation**

**Step 1: Identify Role**
```
"I want you to continue work on the WeightGPT project.
Focus: [Q2 Meal Planning / Development / Testing / etc.]"
```

**Step 2: Load Context**
```
"Please read:
1. PROJECT_SYSTEM.md
2. PROJECT_PLAN.md
3. PARK_[most recent].md
4. [Relevant summary file]"
```

**Step 3: Confirm Understanding**
Claude should summarize:
- Current project state
- What was accomplished previously
- What this conversation will focus on

**Step 4: Begin Work**

---

## Conversation Ending Protocol

### **Before Ending Every Conversation**

**Step 1: Update Working Documents**
```
- Update UX_FEATURES.md if UI/UX discussed
- Update DEVELOPMENT_LOG.md with session entry
- Update CHANGELOG.md if code changed
- Update PROJECT_PLAN.md if timeline/scope changed
```

**Step 2: Create Park Document**
```
- Summarize what was accomplished
- Document key decisions
- List next steps
- Provide context for next conversation
```

**Step 3: Create/Update Session Document**
```
- If new feature area: Create full SESSION_*.md
- If continuing: Update existing SESSION_*.md with revision
```

**Step 4: Commit to Git (when code exists)**
```
- git add .
- git commit -m "[meaningful message]"
- Update CHANGELOG.md
```

---

## Inter-Document References

### **How Documents Reference Each Other**

**PROJECT_PLAN.md** ← High-level roadmap
- References: REQUIREMENTS.md, ARCHITECTURE.md
- Referenced by: All planning documents

**REQUIREMENTS.md** ← What to build
- References: UX_FEATURES.md
- Referenced by: IMPLEMENTATION_PLAN.md

**ARCHITECTURE.md** ← How to build it
- References: REQUIREMENTS.md
- Referenced by: IMPLEMENTATION_PLAN.md

**IMPLEMENTATION_PLAN.md** ← Step-by-step build order
- References: REQUIREMENTS.md, ARCHITECTURE.md
- Referenced by: Development sessions

**UX_FEATURES.md** ← Living UI/UX specs
- Referenced by: REQUIREMENTS.md, Implementation
- Updated by: Every UX discussion

**SESSION_*.md** ← Detailed discussions
- Referenced by: Relevant SUMMARY.md files
- Archived for historical reference

---

## Version Control

### **Document Versioning**

All documents include footer:
```markdown
**Document Version:** X.Y
**Last Updated:** YYYY-MM-DD
**Next Review:** [When/Why]
```

**Version Numbering:**
- Major (X): Complete rewrite or fundamental change
- Minor (Y): Additions, clarifications, revisions

**When to Increment:**
- 1.0 → 1.1: Added new section
- 1.1 → 1.2: Revised existing content
- 1.2 → 2.0: Complete restructure

---

## Quality Standards

### **Every Document Must Have:**

1. **Clear Title** - What is this document?
2. **Date/Status** - When created, current state
3. **Table of Contents** - For docs >500 lines
4. **Purpose Statement** - Why does this exist?
5. **Version Footer** - Track changes

### **Session Documents Must Have:**

1. **Initial Requirements** - What user wanted
2. **Discussion Process** - How we got to decisions
3. **Key Decisions** - What was decided and why
4. **Final Specifications** - Complete, unambiguous specs
5. **Revisions Log** - All changes tracked

### **Code Commits Must Have:**

1. **Meaningful message** - Explain what and why
2. **CHANGELOG entry** - User-facing changes noted
3. **Tests if applicable** - Don't break things
4. **Documentation update** - Keep docs in sync

---

## Continuity Across Conversations

### **The Continuity Problem**

Each new Claude instance:
- ❌ Doesn't remember previous conversations
- ❌ Doesn't know what's been decided
- ❌ Might make conflicting decisions

### **The Solution: Park Documents**

**Latest Park Document = Starting Point**

Every new conversation starts by reading the most recent park document, which contains:
- What was just accomplished
- Current state of project
- Next immediate steps
- Essential context

**Example Flow:**

```
Conversation 1 (Q1):
→ Work on onboarding
→ Create SESSION_Q1.md
→ Create PARK_2025-11-04_1430_Q1.md

Conversation 2 (Q2):
→ Read PARK_2025-11-04_1430_Q1.md
→ Know exactly where we left off
→ Continue seamlessly
→ Work on meal planning
→ Create PARK_2025-11-05_1020_Q2.md
```

---

## Special Protocols

### **When Starting a New Feature Area (Q1, Q2, etc.)**

1. Read PROJECT_PLAN.md - understand big picture
2. Read latest PARK document - current state
3. Create new SESSION document for this feature
4. Discuss requirements thoroughly
5. Ask clarifying questions until crystal clear
6. Document everything as you go
7. Create final specifications
8. Create PARK document for next conversation

### **When Implementing Code**

1. Read IMPLEMENTATION_PLAN.md - build order
2. Read ARCHITECTURE.md - tech decisions
3. Focus on ONE step/subtask at a time
4. Don't add features not in the plan
5. Commit after each logical unit of work
6. Update CHANGELOG.md with changes
7. Create PARK document with code status

### **When Revising Previous Decisions**

1. Find original SESSION document
2. Add new "Revisions" section
3. Document: What changed, Why, Impact
4. Increment document version
5. Update all affected downstream documents
6. Create PARK noting the revision

---

## File Naming Conventions

### **Session Documents**
```
SESSION_YYYY-MM-DD_[Area]_[Topic].md

Examples:
- SESSION_2025-11-04_Q1_Onboarding-Flow.md
- SESSION_2025-11-04_Q1_FINAL_REVISION_16-STEPS.md
```

### **Park Documents**
```
PARK_YYYY-MM-DD_HHMM_[Topic].md

Examples:
- PARK_2025-11-04_1430_Q1-Complete.md
- PARK_2025-11-05_1020_Q2-MealPlanning-Start.md
```

### **Summary Documents**
```
Q[N]_SUMMARY.md

Examples:
- Q1_SUMMARY.md
- Q2_SUMMARY.md
```

---

## Current Project State

**Phase:** Planning (UX Design)
**Last Session:** November 4, 2025
**Completed:** Q1 - Onboarding Flow (16 steps, 3 loading screens, zero typing)
**Next:** Q2 - Meal Planning Details

**Files Exist:**
- ✅ PROJECT_SYSTEM.md (this file)
- ✅ chathistory/SESSION_2025-11-04_Q1-Onboarding-Flow.md
- ✅ chathistory/Q1_FINAL_REVISION_16-STEPS.md
- ✅ chathistory/Q1_SUMMARY.md
- ✅ chathistory/DEVELOPMENT_LOG.md
- ✅ chathistory/CHANGELOG.md
- ✅ UX_FEATURES.md

**Files Needed:**
- [ ] PROJECT_PLAN.md - Overall roadmap
- [ ] REQUIREMENTS.md - User stories
- [ ] ARCHITECTURE.md - Tech decisions
- [ ] IMPLEMENTATION_PLAN.md - Build steps
- [ ] PARK_2025-11-04_*.md - This session's park doc

---

## Next Conversation Preparation

**For Q2 (Meal Planning):**

**Claude should read:**
1. PROJECT_SYSTEM.md (this file)
2. chathistory/Q1_SUMMARY.md (onboarding context)
3. Latest PARK document
4. UX_FEATURES.md (current UI specs)

**Claude should focus on:**
- Meal plan viewing/navigation
- Recipe details
- Meal logging
- Shopping lists
- Meal swapping
- Feedback system

**Claude should create:**
- SESSION_2025-11-XX_Q2_Meal-Planning.md
- Q2_SUMMARY.md
- PARK document at end

---

**Document Version:** 1.0
**Last Updated:** November 4, 2025
**Next Review:** Before Q2 conversation
