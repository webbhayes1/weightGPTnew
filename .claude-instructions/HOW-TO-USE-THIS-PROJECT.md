# How to Use This Project (Claude Instructions)

**Purpose:** This document tells you (Claude) exactly how to initialize and work on the WeightGPT project across multiple conversations.

---

# ⛔ STOP - READ THIS FIRST ⛔

**DO NOT respond to the user until you complete ALL of these initialization steps:**

## Required Reading (In Order):

1. ✅ Read `/.claude-instructions/HOW-TO-USE-THIS-PROJECT.md` (this file)
2. ✅ Read `/project/OVERVIEW.md` - What we're building and why
3. ✅ Read `/project/STATUS.md` - Current state, what's done, what's next
4. ✅ Read the appropriate handoff document:
   - Planning: `/handoffs/planning/LATEST-[date].md`
   - Development: `/handoffs/development/LATEST-[date].md`
   - Review: `/handoffs/review/LATEST-[date].md`

## THEN and ONLY THEN:

Provide the user with an initialization summary including:
- Current context (Planning/Development/Review)
- Project state summary
- What was accomplished last session
- What you're working on this session

**DO NOT start working until you've completed this initialization process.**

---

## 🚀 Quick Start: Initializing a New Conversation

### Step 1: Identify Your Context

The user will tell you which context to use:
- **"Planning context"** - Working on feature specifications (Q1-Q7)
- **"Development context"** - Writing code, implementing features
- **"Review context"** - Testing, QA, bug finding

### Step 2: Read These Files (In Order)

**Always read (regardless of context):**
1. `/project/OVERVIEW.md` - What we're building and why
2. `/project/STATUS.md` - Current state, what's done, what's next
3. `/.claude-instructions/UPDATE-PROTOCOLS.md` - How to maintain files

**Context-specific reads:**

**For Planning Context:**
4. `/handoffs/planning/LATEST-[date].md` - Last planning session
5. `/project/planning/Q[N]_[Feature]_FINAL.md` - Current feature spec (if exists)

**For Development Context:**
4. `/handoffs/development/LATEST-[date].md` - Last dev session
5. `/project/implementation/PLAN.md` - Build order
6. `/project/implementation/ARCHITECTURE.md` - Tech decisions
7. Specific feature spec from `/project/planning/` as needed

**For Review Context:**
4. `/handoffs/review/LATEST-[date].md` - Last review session
5. `/handoffs/development/LATEST-[date].md` - What was just built
6. Feature specs being reviewed

### Step 3: Confirm Understanding

After reading, tell the user:
1. What context you're in
2. Current project state (from STATUS.md)
3. What was accomplished last session (from handoff)
4. What you're working on this session

**Example response:**
```
I've initialized as Development context for WeightGPT.

Current State:
- Q1 Onboarding spec complete (16 steps, zero typing)
- Q2 Meal Planning in progress
- Currently implementing Q1 screens 1-10

Last Session:
- Built welcome screen and goal type selector
- Implemented scroll pickers for weight input
- Next: Personal details screen

Ready to continue. What would you like to work on?
```

---

## ⚠️ MANDATORY: Always Ask Before Changing Functionality

**CRITICAL RULE:** You MUST stop and ask the user before making ANY change that impacts:
- App functionality
- App output
- User experience
- Features
- User flows
- Data structures
- API contracts
- Logic or algorithms
- Design decisions

**Examples of changes that REQUIRE asking:**
- Changing how data is processed or stored
- Modifying user interface behavior
- Altering API responses
- Changing validation rules
- Adjusting calculations or formulas
- Deciding between implementation approaches
- Making trade-offs between options

**Example (WRONG - Don't do this):**
User mentions grocery list has inconsistent units (oz + lbs for chicken).
❌ You decide: "I'll keep units separate for user choice"
✅ Correct: "I see the inconsistency. Should I: (A) Keep units separate, or (B) Consolidate and convert to single unit (e.g., always use lbs)?"

**Example (CORRECT - Do this):**
User mentions grocery list has inconsistent units.
You ask: "How should I handle unit consolidation? Should chicken listed as '2 breasts' and '14 oz' be:
  A) Kept as separate line items
  B) Converted to pounds and combined (e.g., '2 breasts + 0.9 lbs')
  C) Something else?"

**When in doubt, ASK. Better to over-ask than make wrong assumptions.**

---

## 📝 During the Session: What to Update and When

### When User Makes a Decision

**Immediately:**
1. Note it for DECISIONS.md entry (create at end of session)
2. If it affects STATUS.md, note for update at end

**Example:**
User says: "Let's use React Native Paper for UI components instead of building custom"

You should:
- Remember this decision
- Continue working
- Add to DECISIONS.md at end of session

### When You Complete a Task

**Immediately:**
1. Tell the user it's complete
2. Note it for STATUS.md update (move from "In Progress" to "Completed")
3. Note it for handoff document

### When You Discover an Issue

**Immediately:**
1. Tell the user
2. Discuss solution
3. Note for STATUS.md "Blockers" section (if blocking progress)
4. Note for DECISIONS.md if decision made

---

## 🔚 End of Session: Required Updates

**User will say one of:**
- "Create handoff" or "End session" or "Update docs"

**You MUST do these steps (in order):**

### 0. MANDATORY PRE-HANDOFF AUDIT

**BEFORE creating any handoff document, you MUST perform a comprehensive audit:**

**Read and cross-check ALL modified files:**
- Read every file you edited during this session
- Read all related/dependent files (e.g., if you updated Q3.3, also check Q0, Q3.0, Q3.2)
- Check for consistency across all specifications

**Audit Checklist:**
1. **UX Consistency:** Do all screens, flows, and interactions make logical sense together?
2. **Functional Consistency:** Do all features work together without conflicts?
3. **Data Consistency:** Do all data structures match across specs (check Q0)?
4. **Frontend ↔ Backend Lockstep:** Do API endpoints match screen requirements exactly?
5. **AI Integration Consistency:** Do prompts, token budgets, and response formats align?
6. **Navigation Consistency:** Do all navigation paths work across specs?
7. **Design System Consistency:** Do all visual specs match the Design System?
8. **Edge Cases:** Are all edge cases handled consistently?
9. **Error Handling:** Are errors handled the same way across features?
10. **No Missing Features:** Did any screen reference a feature that isn't specified?

**If you find ANY inconsistencies:**
- Fix them immediately
- Document what you fixed
- Note in your change report (see below)

**Change Report (Required if ANY changes made):**

After audit fixes, create a detailed report including:
- **What changed:** List every modification made
- **Why it changed:** Explain the inconsistency that was found
- **Impact on functionality:** How does this alter behavior?
- **Impact on UX:** How does this affect user experience?
- **Impact on backend:** Does this change API contracts, data structures, or validation?
- **Impact on AI integration:** Does this affect prompts, tokens, or response parsing?
- **Breaking changes:** Will this require updates to other specs?

**Present this report to the user BEFORE creating the handoff.**

---

### 0.5. MANDATORY SELF-AUDIT PROTOCOL

**AFTER completing the 10-point audit above, you MUST perform an additional comprehensive self-audit:**

**Purpose:** Ensure thorough, diligent work that prevents any future errors, consistency breaks, logic issues, or functionality concerns that could impact development.

**Self-Audit Process:**

1. **Read ALL necessary documentation:**
   - Review ALL specifications that could be affected by this session's work
   - Read Q0_DATA_STRUCTURES.md to verify data consistency
   - Read DESIGN_SYSTEM.md to verify design compliance
   - Read DECISIONS.md to ensure alignment with past decisions
   - Read all related quarters (if working on Q3.5, read Q3.0-Q3.4, Q2, Q1)

2. **Check for consistency issues:**
   - Do all data structures align perfectly across all specs?
   - Are all API endpoints consistent in naming, parameters, and responses?
   - Do all UI components follow the design system exactly?
   - Are all user flows logically consistent with existing features?
   - Do all features integrate properly with navigation and app shell?

3. **Check for logic breaks:**
   - Can users complete all workflows without dead ends?
   - Are there any circular dependencies or infinite loops?
   - Do all state transitions make sense?
   - Are all conditional flows properly defined?
   - Do all error states have proper recovery paths?

4. **Check for functionality concerns:**
   - Will this feature work properly with offline mode (if applicable)?
   - Are there race conditions or timing issues?
   - Are all edge cases properly handled?
   - Do all features work together without conflicts?
   - Are permissions and validations properly enforced?

5. **Check for backend concerns:**
   - Do all API contracts match between frontend and backend?
   - Are all database schema requirements properly defined?
   - Are all validation rules consistent across the stack?
   - Are all authentication/authorization requirements clear?
   - Are there any potential performance bottlenecks?

6. **Check for frontend concerns:**
   - Are all screen states (loading, error, empty, success) defined?
   - Do all animations and transitions follow design system?
   - Are all touch targets appropriately sized?
   - Is navigation consistent and intuitive?
   - Are all accessibility requirements met?

**Self-Audit Report (MANDATORY):**

After completing the self-audit, create a dedicated "Self-Audit" section that includes:

- **Files Reviewed:** List every document you read during self-audit
- **Consistency Checks Performed:** What specific checks did you run?
- **Issues Found:** Any problems discovered during self-audit (even minor ones)
- **Fixes Applied:** What corrections were made
- **Validation Results:** Confirmation that everything works together properly
- **Confidence Level:** Rate 1-10 how confident you are this spec is error-free

**Integration with Handoff:**

- The self-audit section MUST appear in the handoff document
- All audit notes and fixes MUST be documented in the handoff
- The STATUS.md update must reference the self-audit completion
- Any issues found must be listed with their resolutions

**Quality Standard:**

You must be ALWAYS thorough and diligent to prevent ANY future errors. The sections you write MUST NOT break any consistency, functionality, backend, frontend, or features within the app. This self-audit is your final quality gate before handoff.

### 1. Update STATUS.md
- Move completed items from "In Progress" to "Completed"
- Add new items to "Next Up" if discovered
- Update "Last Updated" timestamp
- Add any blockers

### 2. Log Decisions in DECISIONS.md
- Use the template from TEMPLATES.md
- Include: date, context, decision, rationale, impact
- One entry per major decision

### 3. Create Handoff Document
- Use template from TEMPLATES.md
- Filename: `handoffs/[context]/LATEST-YYYY-MM-DD.md`
- If previous LATEST exists, archive it to `handoffs/[context]/archive/YYYYMMDD-handoff.md`
- Include: what happened, decisions, next steps, files modified

### 4. Update DEVELOPMENT_LOG.md
- Add session entry at top (most recent first)
- Use template from logs/DEVELOPMENT_LOG.md header
- Link to handoff document

### 5. Confirm with User
Tell user:
- "Session documented. Created handoff: [filename]"
- "Updated: STATUS.md, DECISIONS.md, DEVELOPMENT_LOG.md"
- "Next session: [brief description of what's next]"

---

## 📋 File Update Cascade Rules

**When you update one file, check if others need updating:**

| You Update | Also Update |
|------------|-------------|
| Any planning spec | STATUS.md, DECISIONS.md (if new decisions) |
| STATUS.md | DEVELOPMENT_LOG.md |
| Complete a feature | STATUS.md, handoff, DEVELOPMENT_LOG.md |
| Make a decision | DECISIONS.md, handoff |
| Create handoff | STATUS.md, DEVELOPMENT_LOG.md |

---

## 🎯 Context-Specific Behaviors

### Planning Context

**Your role:**
- Ask clarifying questions about features
- Design user flows and UX
- Write comprehensive specifications
- Make UX/design decisions

**DON'T:**
- Write actual code (that's Development context)
- Make tech stack decisions without user

**DO:**
- Be thorough with questions
- Document everything
- Think about mobile UX
- Consider edge cases

### Development Context

**Your role:**
- Implement features from specs
- Write clean, tested code
- Follow architecture decisions
- Make implementation-level decisions

**DON'T:**
- Deviate from the spec without asking
- Change architecture without discussion
- Add features not in the plan

**DO:**
- Follow coding standards
- Write tests
- Commit frequently
- Ask if spec is unclear

### Review Context

**Your role:**
- Test implemented features
- Find bugs and edge cases
- Verify spec compliance
- Suggest improvements

**DON'T:**
- Fix bugs yourself (report to Development context)
- Change specs (report to Planning context)

**DO:**
- Be thorough and critical
- Test edge cases
- Check accessibility
- Verify mobile UX

---

## 🕐 Timestamp Standards

**Use these formats consistently:**

| Purpose | Format | Example |
|---------|--------|---------|
| File names | YYYY-MM-DD | LATEST-2025-11-04.md |
| Log entries | YYYY-MM-DD HH:MM | 2025-11-04 14:30 |
| Git commits | ISO 8601 | 2025-11-04T14:30:00Z |
| Version numbers | v[major].[minor] | v1.0, v1.1, v2.0 |

**When to timestamp:**
- Every handoff document creation
- Every STATUS.md update
- Every DECISIONS.md entry
- Every DEVELOPMENT_LOG.md entry
- File footers when modified

---

## 🔗 Cross-Reference Format

**Always use relative links:**

✅ Good:
```markdown
See [Q1 Spec](../planning/Q1_Onboarding_FINAL.md)
See [Architecture](../implementation/ARCHITECTURE.md#database-schema)
```

❌ Bad:
```markdown
See /Users/webbhayes/weightGPTnew/project/planning/Q1_Onboarding_FINAL.md
See C:\Users\...\Q1_Onboarding_FINAL.md
```

---

## ⚠️ Common Mistakes to Avoid

1. **Starting without reading handoff** - Always read latest handoff first
2. **Not updating STATUS.md** - Update at end of every session
3. **Forgetting to log decisions** - Add to DECISIONS.md as they're made
4. **Creating handoff without archiving previous** - Archive old LATEST before creating new one
5. **Inconsistent timestamps** - Use format from STANDARDS.md
6. **Absolute file paths** - Always use relative links
7. **Updating file without updating footer timestamp** - Update "Last Updated" in footer
8. **Not following cascade rules** - Check UPDATE-PROTOCOLS.md

---

## 🆘 When Things Go Wrong

**If you're confused about project state:**
1. Read STATUS.md - it's the source of truth
2. Read latest handoff for your context
3. Ask user for clarification

**If file is missing:**
1. Check if it's been created yet (early in project)
2. Check archive/ folder
3. Ask user

**If conflicting information:**
1. STATUS.md is source of truth for current state
2. DECISIONS.md is source of truth for what was decided
3. Latest handoff is source of truth for recent work
4. Ask user if still unclear

---

## 📚 Quick Reference

**Essential files:**
- `OVERVIEW.md` - Project vision (rarely changes)
- `STATUS.md` - Current state (updates every session)
- `DECISIONS.md` - Decision log (grows over time)
- `handoffs/[context]/LATEST-*.md` - Continuity between sessions

**Instruction files:**
- `HOW-TO-USE-THIS-PROJECT.md` - This file (read first)
- `UPDATE-PROTOCOLS.md` - Detailed update instructions
- `TEMPLATES.md` - Copy-paste templates
- `STANDARDS.md` - Naming and formatting conventions
- `USER-COMMANDS.md` - How user should interact with you

**Read on every session start:**
1. OVERVIEW.md
2. STATUS.md
3. Latest handoff for your context

**Update on every session end:**
1. STATUS.md
2. DECISIONS.md (if decisions made)
3. Create new handoff
4. DEVELOPMENT_LOG.md

---

**Last Updated:** 2025-11-06
**Version:** 1.2 (Added STOP section for initialization)
