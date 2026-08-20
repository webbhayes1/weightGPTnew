# WeightGPT

AI-powered weight management mobile app that helps users achieve their goals through personalized meal plans, custom workout programs, and intelligent progress tracking.

---

## 🚀 Quick Start

### For Webb (User)

**Starting a new conversation with Claude:**
1. Read [`.claude-instructions/USER-COMMANDS.md`](.claude-instructions/USER-COMMANDS.md) - How to command Claude
2. Use one of these templates:
   - **Planning:** `Planning context - Q[N]`
   - **Development:** `Dev context - implement Q[N]`
   - **Review:** `Review context - test Q[N]`

**Checking project status:**
- [`project/STATUS.md`](project/STATUS.md) - Current state, what's done, what's next
- [`logs/DEVELOPMENT_LOG.md`](logs/DEVELOPMENT_LOG.md) - Session history

**Finding a specific spec:**
- [`project/planning/`](project/planning/) - All finalized feature specs (Q1-Q7)

---

### For Claude (AI Assistant)

**Initializing a new conversation:**
1. **ALWAYS READ FIRST:** [`.claude-instructions/HOW-TO-USE-THIS-PROJECT.md`](.claude-instructions/HOW-TO-USE-THIS-PROJECT.md)
2. Read [`project/OVERVIEW.md`](project/OVERVIEW.md) - What we're building
3. Read [`project/STATUS.md`](project/STATUS.md) - Current state
4. Read latest handoff for your context:
   - Planning: [`handoffs/planning/LATEST-*.md`](handoffs/planning/)
   - Development: [`handoffs/development/LATEST-*.md`](handoffs/development/)
   - Review: [`handoffs/review/LATEST-*.md`](handoffs/review/)

**During the session:**
- Follow [`.claude-instructions/UPDATE-PROTOCOLS.md`](.claude-instructions/UPDATE-PROTOCOLS.md)
- Use templates from [`.claude-instructions/TEMPLATES.md`](.claude-instructions/TEMPLATES.md)
- Follow standards in [`.claude-instructions/STANDARDS.md`](.claude-instructions/STANDARDS.md)

**Ending the session:**
- Update [`project/STATUS.md`](project/STATUS.md)
- Log decisions in [`project/DECISIONS.md`](project/DECISIONS.md)
- Create handoff in `handoffs/[context]/LATEST-YYYY-MM-DD.md`
- Update [`logs/DEVELOPMENT_LOG.md`](logs/DEVELOPMENT_LOG.md)

---

## 📁 Project Structure

```
/weightGPTnew/
│
├── README.md                          ← You are here
│
├── .claude-instructions/              ← Instructions for Claude
│   ├── HOW-TO-USE-THIS-PROJECT.md    ← Initialization protocol
│   ├── UPDATE-PROTOCOLS.md           ← When/how to update files
│   ├── TEMPLATES.md                  ← Copy-paste templates
│   ├── STANDARDS.md                  ← Naming & formatting rules
│   └── USER-COMMANDS.md              ← How to command Claude
│
├── project/                           ← Project knowledge
│   ├── OVERVIEW.md                   ← What we're building & why
│   ├── STATUS.md                     ← Current state (update every session)
│   ├── DECISIONS.md                  ← Decision log (grows over time)
│   │
│   ├── planning/                     ← Feature specifications
│   │   ├── Q1_Onboarding_FINAL.md   ← 16-step onboarding spec
│   │   ├── Q2_MealPlanning_FINAL.md ← (Future)
│   │   └── ...
│   │
│   └── implementation/               ← Build details
│       ├── ARCHITECTURE.md          ← Tech stack, DB schema, APIs
│       ├── PLAN.md                  ← Step-by-step build order
│       └── REQUIREMENTS.md          ← User stories, acceptance criteria
│
├── handoffs/                          ← Continuity between conversations
│   ├── planning/                     ← Planning context handoffs
│   │   ├── LATEST-YYYY-MM-DD.md    ← Most recent
│   │   └── archive/                 ← Historical handoffs
│   ├── development/                  ← Development context handoffs
│   └── review/                       ← Review context handoffs
│
├── logs/                              ← Project history
│   └── DEVELOPMENT_LOG.md           ← All sessions chronologically
│
├── archive/                           ← Historical files
│   └── ai-instructions/             ← Old structure (preserved)
│
└── src/                               ← Actual code (to be created)
```

---

## 📖 Documentation Index

### Essential Reading

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [OVERVIEW.md](project/OVERVIEW.md) | Project vision | Every session (Claude & user) |
| [STATUS.md](project/STATUS.md) | Current state | Every session (Claude & user) |
| [DECISIONS.md](project/DECISIONS.md) | Decision log | When making decisions or reviewing past choices |

### For Users

| Document | Purpose |
|----------|---------|
| [USER-COMMANDS.md](.claude-instructions/USER-COMMANDS.md) | How to interact with Claude |
| [DEVELOPMENT_LOG.md](logs/DEVELOPMENT_LOG.md) | Session history |

### For Claude

| Document | Purpose |
|----------|---------|
| [HOW-TO-USE-THIS-PROJECT.md](.claude-instructions/HOW-TO-USE-THIS-PROJECT.md) | Initialization & workflow |
| [UPDATE-PROTOCOLS.md](.claude-instructions/UPDATE-PROTOCOLS.md) | File update instructions |
| [TEMPLATES.md](.claude-instructions/TEMPLATES.md) | Copy-paste templates |
| [STANDARDS.md](.claude-instructions/STANDARDS.md) | Formatting & naming rules |

### Feature Specs

| Spec | Status | Location |
|------|--------|----------|
| Q1: Onboarding | ✅ Complete | [Q1_Onboarding_FINAL.md](project/planning/Q1_Onboarding_FINAL.md) |
| Q2: Meal Planning | 📋 Not Started | TBD |
| Q3: Meal Tracking | 📋 Not Started | TBD |
| Q4: Weight Logging | 📋 Not Started | TBD |
| Q5: Workout Plans | 📋 Not Started | TBD |
| Q6: AI Integration | 📋 Not Started | TBD |
| Q7: Additional Features | 📋 Not Started | TBD |

---

## 🎯 Current Project State

**Phase:** Q1 Complete - Planning Q2

**Completed:**
- ✅ Q1 Onboarding specification (16 steps, zero typing)
- ✅ Project organization system
- ✅ Documentation structure

**In Progress:**
- 🔄 Q2 Meal Planning specification

**Next Up:**
- 📋 Q3-Q7 Planning
- 📋 Architecture design
- 📋 Implementation planning
- 📋 Development

**Last Updated:** 2025-11-04

---

## 💡 Key Principles

### Development Philosophy
1. **Mobile-first** - Optimized for touch interfaces
2. **Zero friction** - Minimize typing, maximize tapping
3. **User control** - Respect schedules and preferences
4. **Data-driven** - Make decisions based on user metrics
5. **Accessible** - WCAG 2.1 AA compliance

### Project Management
1. **Document everything** - Decisions, rationale, context
2. **Small iterations** - Break work into manageable chunks
3. **Continuous handoffs** - Never lose context between sessions
4. **Single source of truth** - STATUS.md for current state
5. **Timestamps everywhere** - Track when things changed

---

## 🔗 External Resources

- **Design:** (TBD - Figma/design files)
- **Repository:** (TBD - when code begins)
- **Deployment:** (TBD - Render.com for backend)
- **Documentation:** (TBD - API docs)

---

## 📝 Quick Commands

### For User (Webb)

**Start planning session:**
```
Planning context - Q2
```

**Start development session:**
```
Dev context - implement Q1
```

**Start review session:**
```
Review context - test Q1
```

**Check status:**
```
What's our current status?
```

**End session:**
```
Create handoff
```

### For Claude

**Read on every initialization:**
1. `.claude-instructions/HOW-TO-USE-THIS-PROJECT.md`
2. `project/OVERVIEW.md`
3. `project/STATUS.md`
4. Latest handoff for context

**Update on every session end:**
1. `project/STATUS.md`
2. `project/DECISIONS.md` (if decisions made)
3. Create handoff: `handoffs/[context]/LATEST-YYYY-MM-DD.md`
4. `logs/DEVELOPMENT_LOG.md`

---

## 📞 Getting Help

**Claude seems confused?**
- Tell it to read STATUS.md again
- Point it to the relevant handoff
- Check DECISIONS.md for past decisions

**Can't find something?**
- Check this README for links
- All feature specs are in `project/planning/`
- All handoffs are in `handoffs/[context]/`
- All decisions are in `project/DECISIONS.md`

**Want to change the system?**
- Discuss with Claude in Planning context
- Update `.claude-instructions/` files
- Document in DECISIONS.md

---

**Project:** WeightGPT
**Created:** 2025-11-04
**Last Updated:** 2025-11-04
**Status:** Active Development (Planning Phase)

---

## 🚀 Let's Build Something Great!
