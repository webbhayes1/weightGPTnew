# How to Command Claude for Best Results

**For:** Webb Hayes (User)
**Purpose:** Quick reference for how to interact with Claude on this project

---

## 🚀 Starting a New Conversation

### Template Commands

**For Planning Work:**
```
Act as Planning context for WeightGPT.
Read project/OVERVIEW.md, project/STATUS.md, and handoffs/planning/LATEST-*.md
We're working on: [Q2 Meal Planning / Q3 Meal Tracking / etc.]
```

**For Development Work:**
```
Act as Development context for WeightGPT.
Read project/OVERVIEW.md, project/STATUS.md, and handoffs/development/LATEST-*.md
Implement: [Q1 Onboarding screens / Backend calculations / etc.]
```

**For Review/Testing:**
```
Act as Review context for WeightGPT.
Read project/OVERVIEW.md, project/STATUS.md, and handoffs/review/LATEST-*.md
Review: [Q1 implementation / Meal planning feature / etc.]
```

**Shorthand (after first few conversations):**
```
Planning - Q2
```
```
Dev - continue Q1 implementation
```
```
Review - test onboarding flow
```

---

## 💬 During the Conversation

### Asking Questions

**Good prompts:**
```
How should we handle users who skip the goal date question?
```
```
What's the best way to structure the meal feedback data?
```
```
Show me the current status of Q1 implementation
```

**Avoid:**
- Long, overly detailed explanations
- Telling Claude which files to read (it knows from context)
- Micromanaging the approach

### Giving Instructions

**For Planning:**
```
Let's design the meal plan viewing screen
```
```
Ask me questions about how users should swap meals
```
```
Document the shopping list generation logic
```

**For Development:**
```
Implement step 1 from the plan
```
```
Build the weight input scroll picker
```
```
Write tests for the BMR calculation
```

**For Review:**
```
Test the onboarding flow end-to-end
```
```
Find edge cases in the timeline validation
```
```
Check accessibility compliance
```

### Making Decisions

**When you decide something important, say:**
```
Decision: We'll use React Native Paper for UI components
```
```
Let's go with Option 2 - hybrid meal planning approach
```
```
Change this to use AsyncStorage instead of SQLite
```

**Claude will:**
- Note the decision
- Add it to DECISIONS.md at end of session
- Update relevant specs if needed

---

## 🎯 Managing Multiple Conversations

### Running Parallel Chats

You can have multiple Claude chats open simultaneously:

**Example Workflow:**

**Chat 1 (Planning):**
```
Planning - work on Q3 meal tracking spec
```
_Leave this open, switch to Chat 2_

**Chat 2 (Development):**
```
Dev - implement Q1 screens 11-16
```
_Leave this open, switch to Chat 3_

**Chat 3 (Review):**
```
Review - test the screens we just built
```

**All three read the same central files (STATUS.md, DECISIONS.md) so they stay in sync.**

---

## ⏱️ When to End a Session

### Signs It's Time to Create a Handoff:

1. **Context limit warning** - Claude says approaching 180K tokens
2. **Natural stopping point** - Just completed a feature or spec
3. **End of work session** - You're done for the day
4. **Before switching contexts** - Moving from planning to development

### End Session Command:

**Simply say:**
```
Create handoff
```

**Or:**
```
End session and update docs
```

**Or:**
```
We're done for now, document this session
```

**Claude will automatically:**
1. Update STATUS.md
2. Log decisions in DECISIONS.md
3. Create handoff document
4. Update DEVELOPMENT_LOG.md
5. Confirm what was updated

---

## 🔄 Continuing from Previous Session

### If It's Been a While:

```
Planning context - remind me where we left off on Q2
```

```
Dev context - what were we working on last time?
```

**Claude will:**
- Read latest handoff
- Summarize what happened
- Tell you what's next
- Ask how you want to proceed

### If You Remember:

```
Planning - continue Q2 meal planning from last time
```

```
Dev - keep implementing Q1 onboarding
```

---

## 🎨 Controlling Claude's Behavior

### If Claude is Too Verbose:

```
Be more concise
```
```
Just give me the summary
```
```
Short answers please
```

### If You Need More Detail:

```
Explain that in more detail
```
```
Walk me through the reasoning
```
```
What are all the options here?
```

### If Claude is Off-Track:

```
That's not what we decided - check DECISIONS.md
```
```
Stick to the spec in Q1_Onboarding_FINAL.md
```
```
Don't add features that aren't in the plan
```

### If You Want to Change Direction:

```
Actually, let's go with approach B instead
```
```
Cancel that - let's think about this differently
```
```
New decision: [your decision]
```

---

## 📊 Checking Project Status

### Quick Status Check:

```
What's our current status?
```
```
Show me what's completed and what's next
```
```
Are there any blockers?
```

**Claude will read STATUS.md and summarize**

### Detailed Progress:

```
Show me the full development log
```
```
What decisions have we made about [topic]?
```
```
What happened in the last 3 sessions?
```

---

## 🐛 When Things Go Wrong

### If Claude Seems Confused:

```
Read the latest handoff and STATUS.md again
```
```
What files did you read when initializing?
```
```
Check DECISIONS.md for what we decided about [topic]
```

### If Information is Conflicting:

```
STATUS.md is the source of truth - what does it say?
```
```
Check the decision log for [topic]
```

### If You Need to Correct Claude:

```
That's incorrect - we decided [correct information]
```
```
Update DECISIONS.md to reflect [correction]
```
```
The spec says [correct spec], not [what Claude said]
```

---

## 🎯 Best Practices

### ✅ Do This:

1. **Start each conversation with context**
   ```
   Planning context - Q2
   ```

2. **Let Claude explore and suggest**
   ```
   How should we handle meal swapping?
   ```

3. **End sessions with handoff creation**
   ```
   Create handoff
   ```

4. **Make decisions explicit**
   ```
   Decision: Use approach A
   ```

5. **Check status regularly**
   ```
   What's our status?
   ```

### ❌ Avoid This:

1. **Starting without specifying context**
   ```
   Help me build WeightGPT
   ```
   _Too vague - Planning, Dev, or Review?_

2. **Not creating handoffs**
   _Next conversation will lose context_

3. **Making decisions without saying so**
   _Claude won't log it in DECISIONS.md_

4. **Letting conversations run to 200K tokens**
   _Create handoff at 150-180K_

5. **Not reading STATUS.md yourself**
   _You should stay in sync too!_

---

## 📝 Templates for Common Tasks

### Starting Fresh on a New Feature:

```
Planning context.
Let's start Q[N]: [Feature Name].
Ask me questions to fully understand the requirements.
```

### Implementing a Planned Feature:

```
Development context.
Implement Q[N] according to project/planning/Q[N]_[Feature]_FINAL.md
Start with step 1 from implementation/PLAN.md
```

### Reviewing Completed Work:

```
Review context.
Test the Q[N] implementation.
Check against spec and find any bugs or issues.
```

### Making a Decision Mid-Conversation:

```
Decision: [Your decision]
Rationale: [Why]
Update the spec and DECISIONS.md
```

### Checking if You're On Track:

```
Are we following the implementation plan?
Are we staying true to the Q[N] spec?
Any deviations I should know about?
```

---

## 🎬 Example Full Session

**You:**
```
Planning context - start Q2 Meal Planning
```

**Claude:**
_Reads docs, confirms understanding, ready to work_

**You:**
```
How should users view their weekly meal plan?
```

**Claude:**
_Asks clarifying questions, discusses options_

**You:**
```
Decision: Calendar view with daily detail screen
```

**Claude:**
_Notes decision, continues discussion_

_... more conversation ..._

**You:**
```
That covers Q2. Create handoff.
```

**Claude:**
_Updates all docs, creates handoff, confirms_

**Next session:**

**You:**
```
Planning context - continue Q2
```

**Claude:**
_Reads last handoff, summarizes, ready to continue_

---

## 🔧 Advanced Tips

### Running Long Tasks:

```
Dev context - implement all of Q1.
Work through steps 1-5, then report progress.
```

**Claude will:**
- Complete steps
- Report back
- You can say "continue" to keep going

### Iterating on Decisions:

```
Actually, let's reconsider that last decision.
What are the pros/cons of each approach?
```

### Getting Unstuck:

```
I'm not sure how to proceed with [topic].
Review the docs and give me 3 options with tradeoffs.
```

### Quality Control:

```
Before we finish this spec, review it for:
- Completeness
- Consistency with previous decisions
- Edge cases
- Mobile UX considerations
```

---

## 📚 Quick Reference Card

| What You Want | What to Say |
|---------------|-------------|
| Start planning | `Planning - Q[N]` |
| Start coding | `Dev - implement Q[N]` |
| Start testing | `Review - test Q[N]` |
| Make decision | `Decision: [decision]` |
| Check status | `What's our status?` |
| End session | `Create handoff` |
| Continue | `Planning/Dev/Review - continue` |
| Get unstuck | `What are my options for [topic]?` |
| Correct Claude | `That's wrong - check [file]` |

---

**Last Updated:** 2025-11-04
**Version:** 1.0

**Remember:** Claude is a tool to help you build great software. Be clear, be decisive, and create handoffs regularly. The system will handle the rest!
