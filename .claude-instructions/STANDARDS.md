# Project Standards (For Claude)

**Purpose:** Consistent formatting, naming, and conventions across all project files.

---

## 📅 Timestamp Formats

**Use these formats consistently:**

### File Names
```
YYYY-MM-DD
```
**Examples:**
- `LATEST-2025-11-04.md` ✅
- `LATEST-11-04-2025.md` ❌
- `LATEST-Nov-4-2025.md` ❌

### Log Entries & Document Headers
```
YYYY-MM-DD HH:MM
```
**Examples:**
- `2025-11-04 14:30` ✅
- `11/04/2025 2:30PM` ❌
- `Nov 4, 2025 14:30` ❌

### Git Commits (if needed)
```
ISO 8601: YYYY-MM-DDTHH:MM:SSZ
```
**Examples:**
- `2025-11-04T14:30:00Z` ✅
- `2025-11-04 14:30:00` ❌

**Timezone:**
- Always use user's local time (not UTC) unless specified
- For WeightGPT: US Eastern Time

---

## 📁 File Naming Conventions

### Planning Specifications
```
Q[N]_[FeatureName]_FINAL.md
```
**Examples:**
- `Q1_Onboarding_FINAL.md` ✅
- `Q2_MealPlanning_FINAL.md` ✅
- `Q3_MealTracking_FINAL.md` ✅
- `onboarding-final.md` ❌
- `Q1 Onboarding Final.md` ❌ (has spaces)

**Rules:**
- No spaces (use underscores or hyphens)
- Q number always first
- Feature name in PascalCase
- Always end with `_FINAL.md`

### Handoff Documents
```
LATEST-YYYY-MM-DD.md
```
**Examples:**
- `LATEST-2025-11-04.md` ✅
- `2025-11-04-handoff.md` ❌
- `LATEST.md` ❌ (no date)

**Rules:**
- Must start with "LATEST-"
- Date in YYYY-MM-DD format
- Only one LATEST per context folder at a time
- Archive old LATEST before creating new one

### Archived Handoffs
```
YYYYMMDD-handoff.md
```
**Examples:**
- `20251104-handoff.md` ✅
- `20251104-planning.md` ✅
- `LATEST-2025-11-04.md` ❌ (should be removed from archive)

**Rules:**
- No "LATEST-" prefix
- Condensed date format (no hyphens)
- Can add context suffix: `-planning`, `-development`, `-review`

### Implementation Files
```
UPPERCASE.md
```
**Examples:**
- `ARCHITECTURE.md` ✅
- `PLAN.md` ✅
- `REQUIREMENTS.md` ✅
- `architecture.md` ❌

### Core Project Files
```
UPPERCASE.md
```
**Examples:**
- `OVERVIEW.md` ✅
- `STATUS.md` ✅
- `DECISIONS.md` ✅
- `README.md` ✅

---

## 🔢 Version Numbering

**Format:** `v[major].[minor]`

### When to Increment

**Major Version (X.0):**
- Complete rewrite of document
- Fundamental change in approach
- Breaking changes to existing spec

**Examples:**
- v1.0 → v2.0: Onboarding changed from 24 steps to 16 steps
- v1.5 → v2.0: Completely new architecture approach

**Minor Version (0.X):**
- Additions to existing document
- Clarifications
- Small revisions
- Non-breaking changes

**Examples:**
- v1.0 → v1.1: Added meal swapping feature to Q2 spec
- v1.1 → v1.2: Clarified navigation flow

### Version History

**Always include version in document footer:**
```markdown
---
**Document Version:** 1.2
**Last Updated:** 2025-11-04 14:30
**Status:** Finalized
```

**If revisions made, add Revisions section:**
```markdown
## Revisions

### v1.2 - 2025-11-04
**What changed:** Added meal swapping feature
**Why:** User requested this functionality
**Impact:** Affects Q2 implementation plan

### v1.1 - 2025-11-03
**What changed:** Clarified navigation between screens
**Why:** Development team had questions
**Impact:** None - clarification only

### v1.0 - 2025-11-01
**Initial version**
```

---

## 🔗 Cross-Reference Format

### Relative Links (Always Use These)

**Format:**
```markdown
[Link Text](../path/to/file.md)
[Link Text with Anchor](../path/to/file.md#section-name)
[Link Text with Line](../path/to/file.md#L42)
```

**Examples:**
```markdown
See [Q1 Onboarding Spec](../planning/Q1_Onboarding_FINAL.md)
See [Decision Log](../../project/DECISIONS.md)
See [Architecture: Database](../implementation/ARCHITECTURE.md#database-schema)
```

### From handoffs/ to project/
```markdown
[OVERVIEW](../../project/OVERVIEW.md)
[STATUS](../../project/STATUS.md)
[Q1 Spec](../../project/planning/Q1_Onboarding_FINAL.md)
```

### From project/ to handoffs/
```markdown
[Latest Planning Handoff](../handoffs/planning/LATEST-2025-11-04.md)
```

### Never Use Absolute Paths
❌ **Don't do this:**
```markdown
[File](/Users/webbhayes/weightGPTnew/project/OVERVIEW.md)
[File](C:\Users\webbhayes\weightGPTnew\project\OVERVIEW.md)
```

✅ **Do this instead:**
```markdown
[File](../project/OVERVIEW.md)
```

---

## 📊 Status Emojis

**Use these consistently in STATUS.md:**

| Emoji | Meaning | Usage |
|-------|---------|-------|
| ✅ | Completed | Completed tasks |
| 🔄 | In Progress | Currently working on |
| ⏳ | Pending | Planned but not started |
| 🚫 | Blocked | Cannot proceed |
| ⚠️ | Warning/Issue | Problem or concern |
| 📋 | Next Up | Queued for later |

**Example:**
```markdown
## Completed ✅
- Q1 Planning finalized

## In Progress 🔄
- Q2 Planning (60% complete)
  - ✅ Meal viewing designed
  - 🔄 Shopping list in progress
  - ⏳ Meal swapping pending

## Blockers 🚫
- Waiting for API key from OpenAI
```

---

## 📝 Decision Status Tags

**In DECISIONS.md, use these status values:**

| Status | Meaning |
|--------|---------|
| **Active** | Current decision in effect |
| **Superseded** | Replaced by newer decision |
| **Archived** | No longer relevant |
| **Pending** | Discussed but not finalized |
| **Rejected** | Considered but not chosen |

**Example:**
```markdown
### Use React Native Paper
**Status:** Active

### Build Custom Component Library
**Status:** Superseded
**Superseded By:** Use React Native Paper (2025-11-04)
```

---

## 🎨 Markdown Formatting Standards

### Headers

**Use ATX-style headers (# not underlines):**
```markdown
# H1 Title
## H2 Subtitle
### H3 Section
```

**Don't use:**
```markdown
Title
=====

Subtitle
--------
```

### Lists

**Unordered lists:** Use `-` (not `*` or `+`)
```markdown
- Item 1
- Item 2
  - Sub-item 2.1
  - Sub-item 2.2
```

**Ordered lists:** Use `1.` for all items (Markdown auto-numbers)
```markdown
1. First step
1. Second step
1. Third step
```

### Code Blocks

**Always specify language:**
````markdown
```typescript
interface User {
  id: string;
  name: string;
}
```

```bash
npm install
```

```markdown
# Example markdown
```
````

**Never use:**
````markdown
```
// Code without language
```
````

### Tables

**Always align with pipes:**
```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
```

### Emphasis

**Bold:** Use `**text**` (not `__text__`)
**Italic:** Use `*text*` (not `_text_`)

---

## 📋 Document Footers

**Every significant document should end with:**

```markdown
---
**Document Version:** 1.0
**Last Updated:** 2025-11-04 14:30
**Status:** [Draft / In Review / Finalized / Active]
**Next Review:** [Date or "As needed"]
```

**For handoffs:**
```markdown
---
**Handoff Version:** 1.0
**Created:** 2025-11-04 14:30
**Context:** Planning
**Next Claude Instance:** Read [HOW-TO-USE-THIS-PROJECT.md](...)
```

---

## 🗂️ Folder Naming

**All lowercase, hyphens for spaces:**
```
.claude-instructions/  ✅
claude-instructions/   ❌ (missing dot)
Claude_Instructions/   ❌ (wrong case and underscore)
```

**Standard folder names:**
- `.claude-instructions/`
- `project/`
- `handoffs/`
- `logs/`
- `archive/`
- `src/` (when code exists)

---

## ✅ Pre-Commit Checklist

**Before ending any session, verify:**

- [ ] All timestamps use correct format (YYYY-MM-DD HH:MM)
- [ ] All filenames follow naming conventions
- [ ] All links are relative (not absolute)
- [ ] All code blocks specify language
- [ ] Document version incremented (if doc changed)
- [ ] "Last Updated" footer timestamp updated
- [ ] Status emojis used correctly in STATUS.md
- [ ] Decision status tags are one of: Active/Superseded/Archived/Pending/Rejected
- [ ] No broken cross-references
- [ ] Handoff archived before creating new LATEST

---

## 🚨 Common Standard Violations

### Wrong Timestamp Format
❌ `Last Updated: Nov 4, 2025 at 2:30pm`
✅ `Last Updated: 2025-11-04 14:30`

### Wrong File Naming
❌ `Q1 Onboarding Final.md` (spaces)
✅ `Q1_Onboarding_FINAL.md`

### Absolute Paths
❌ `[File](/Users/webbhayes/weightGPTnew/project/OVERVIEW.md)`
✅ `[File](../project/OVERVIEW.md)`

### Wrong List Bullets
❌ `* Item` or `+ Item`
✅ `- Item`

### Code Without Language
❌ ` ```\ncode here\n``` `
✅ ` ```typescript\ncode here\n``` `

### Wrong Version Format
❌ `Version: 1` or `v1` or `1.0.0`
✅ `v1.0`

### Missing Footer Timestamp
❌ (Document ends with no footer)
✅
```markdown
---
**Document Version:** 1.0
**Last Updated:** 2025-11-04 14:30
```

---

**Last Updated:** 2025-11-04
**Version:** 1.0

**Remember:** Consistency makes the project easier to navigate and maintain. When in doubt, check this file!
