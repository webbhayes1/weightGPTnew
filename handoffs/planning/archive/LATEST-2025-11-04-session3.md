# Handoff: Planning - 2025-11-04 (Session 3 - Q3 Start)

## Session Info
**Date:** 2025-11-04 17:30
**Context:** Planning
**Duration:** ~1 hour
**Token Usage:** ~88K / 200K

---

## Current State

**Project Phase:** Planning (Q1 v3.0 Complete → Q2 Complete → Q3 Started)

**What's Completed:**
- ✅ Q1: Onboarding Flow (17 steps, zero typing) - **Updated to v3.0**
- ✅ Q2: Meal Planning (8 screens, daily detail view, swapping, feedback, shopping list)
- ✅ Project organization system fully established
- ✅ Documentation structure complete
- ✅ Development setup information gathered

**What's In Progress:**
- 🔄 Q3: Meal Tracking specification - **Just Started (~10% complete)**
  - Home dashboard designed
  - Bottom navigation redesigned
  - Foundational decisions made
  - Questions identified for next session

**What's Next:**
- Complete Q3: Meal Tracking specification (answer 7 question groups, design all screens)
- Update Q2 for variable meal patterns (2-4+ meals/day)
- Q4: Weight Logging specification
- Q5-Q7: Remaining feature specifications

---

## What Happened This Session

### Major Accomplishments:

1. **Updated Q1 to v3.0 - Added Eating Pattern Question**
   - New Step 11: "Eating Pattern"
   - Collects: meals per day (2, 3, or 4-5), which meals user eats, includes snacks
   - Q1 now 17 steps (up from 16)
   - Critical for personalized meal generation
   - Users who skip breakfast won't get breakfast in their plan/grocery list

2. **Redesigned Bottom Navigation**
   - **Old:** [Home] [Meals] [Log] [Progress]
   - **New:** [Home] [Workouts] [Progress] [Profile]
   - Rationale: Home is central hub (80% of user time), meals accessible from there
   - Full week's meal plan accessed via "View Full Week" button on Home
   - Workouts get dedicated tab, Profile added for settings/account

3. **Designed Enhanced Home Dashboard**
   - Today's meal plan with checkboxes for quick logging
   - Workout for the day (if scheduled)
   - Streak counter (🔥 7-day streak!)
   - Motivational tip of the day
   - Today's progress (calories/macros consumed vs targets)
   - Quick action buttons: [View Full Week] [+ Log Custom Meal]
   - Snacks included if user selected in onboarding

4. **Designed Two-Option Meal Swapping**
   - **Option 1:** Quick swap from other meals in this week's plan (instant, no API)
   - **Option 2:** Generate new alternatives (uses OpenAI like Q2)
   - Modal shows week's meals first, then "Generate Alternatives" button
   - Better UX than Q2's single swap approach

5. **Logged Two Major Decisions**
   - "Add Eating Pattern to Q1 Onboarding" - DECISIONS.md
   - "Redesign Bottom Navigation - Remove Meals Tab" - DECISIONS.md

---

## Key Decisions Made This Session

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Add eating pattern question to Q1 | Users have different eating habits; need to know for accurate meal generation | Q1: 17 steps, Q2: variable meal counts, Q3: personalized home dashboard |
| Redesign bottom nav | Home is central hub; meals don't need separate tab; workouts and profile do | All screen specs, navigation component, Q2/Q3/Q5 affected |
| Pre-plan snacks (not ad-hoc) | If user wants snacks, AI should generate specific snack options with macros | Q2 generation logic, grocery lists include snacks |
| Two-option meal swapping | Quick swaps from week's plan + generate new alternatives | Better UX, faster swaps, still has AI option |

**All decisions documented in:** [DECISIONS.md](../../project/DECISIONS.md)

---

## Q3 Planning Progress - Where We Left Off

### What We Discussed:

**Home Dashboard Layout:**
- Today's meals with quick-log checkboxes
- Recipe detail access ([→] button)
- Swap options ([↔ Swap] button → modal with two options)
- Workout display when scheduled
- Streak counter and daily tip
- Progress bars (calories/macros)
- Access to full week via button

**Meal Logging from Plan:**
- Checkbox tap opens quick confirmation
- Options: Full serving / Half serving / Custom amount
- Logs meal with macros automatically
- Marks meal as completed with timestamp

**Questions Answered:**
1. Should checking off a meal auto-log it? → Yes, with serving size confirmation
2. Does [→ View Recipe] open Q2 screen? → Yes, same recipe detail screen
3. How does swapping work on home screen? → Two options modal (week's meals + generate new)
4. Should workouts show on home? → Yes, with checkbox to log completion
5. Should eating pattern be in Q1? → Yes, as Step 11 (2, 3, or 4-5 meals + which ones)
6. How to handle snacks? → Pre-planned by AI if user selects in Q1
7. Home additions? → Streak counter + motivational tip of day
8. Bottom nav structure? → [Home] [Workouts] [Progress] [Profile]

---

## Next Session Should Cover

### Immediate Priorities (Q3 Continuation):

**Questions Still to Answer:**

1. **Logging Meals NOT from Plan:**
   - How does food search work? (Database? API? Which one?)
   - What's the search UI? (Search bar, categories, recent foods?)
   - Should there be common quick-add foods? (Apple, Banana, Chicken Breast?)
   - Manual entry screen design? (Just calories or full macros?)
   - Can users save custom foods/meals for reuse?

2. **Daily Tracking View:**
   - Beyond home dashboard progress bars, is there a detailed tracking screen?
   - Meal-by-meal breakdown of the day?
   - Charts/graphs for macro distribution?
   - Daily history view? (What did I eat last Tuesday?)

3. **Quick Logging Features:**
   - Repeat yesterday's meals?
   - Repeat a specific day from the past?
   - Favorite meals (not from plan) that user can quick-add?
   - Recent meals list for fast re-logging?
   - Copy meal from another day?

4. **Editing/Deleting Logged Meals:**
   - Can users edit a logged meal after the fact?
   - Can users delete a logged meal?
   - What if they want to change serving size later?
   - Undo button after logging?

5. **Meal History:**
   - Should there be a calendar view of past meals?
   - Can users browse what they ate last week/month?
   - Export meal history? (CSV, PDF?)
   - Use history to suggest meals? ("You ate this last Monday")

6. **Weekly/Monthly Views:**
   - Weekly tracking summary? (Avg calories, adherence %)
   - Heatmap of logging consistency?
   - Compare week-to-week?

7. **Snack Logging:**
   - Separate screen for snacks or same as meal logging?
   - Pre-planned snacks from Q2 vs. custom snacks
   - Quick-add snack button behavior

8. **Data Structures:**
   - LoggedMeal interface
   - CustomFood interface
   - MealHistory interface
   - Daily/weekly tracking aggregates

### After Q3 Complete:

**Update Tasks:**
1. Update Q2 spec to accommodate variable meal patterns (2-4+ meals/day)
2. Update Q2 navigation references (remove Meals tab, update flow)
3. Add snack generation logic to Q2 technical requirements

**Then Continue:**
4. Q4: Weight Logging specification
5. Q5: Workout Plans specification
6. Q6: AI Integration specification
7. Q7: Additional Features specification

---

## Files Modified This Session

**Updated:**
- `project/planning/Q1_Onboarding_FINAL.md` - Updated to v3.0 with eating pattern question (Step 11)
- `project/DECISIONS.md` - Added 2 new decisions (eating pattern, bottom nav redesign)

**Created:**
- `handoffs/planning/LATEST-2025-11-04-session3.md` - This handoff

**Need to Update (Next Session):**
- `project/planning/Q2_MealPlanning_FINAL.md` - Variable meal patterns, navigation changes
- `project/STATUS.md` - Q3 started, update metrics
- `logs/DEVELOPMENT_LOG.md` - Add Session 3 entry

**Will Create (Next Session):**
- `project/planning/Q3_MealTracking_FINAL.md` - Complete Q3 specification

---

## Design Artifacts Created

### Home Dashboard - Enhanced Design
```
┌─────────────────────────────────┐
│  WeightGPT              ⚙️ 🔔   │
│                                 │
│  Monday, Nov 4                  │
│  🔥 7-day streak!               │
│                                 │
│  💡 Tip: Consistency beats      │
│  perfection. One meal at a time!│
│                                 │
│  ──── TODAY'S PLAN ────         │
│                                 │
│  🍽️ MEALS                       │
│                                 │
│  [ ] 🍳 Greek Yogurt Parfait    │
│      320 cal | 25g P | 40g C    │
│      [→] [↔ Swap]               │
│                                 │
│  [✓] 🥗 Grilled Chicken Salad   │
│      450 cal | 45g P | 30g C    │
│      Logged at 12:30 PM         │
│                                 │
│  [ ] 🍝 Salmon with Quinoa      │
│      520 cal | 50g P | 45g C    │
│      [→] [↔ Swap]               │
│                                 │
│  [ ] 🍎 Afternoon Snack         │
│      150 cal | 5g P | 20g C     │
│      Apple & Almond Butter      │
│      [→] [↔ Swap]               │
│                                 │
│  💪 WORKOUT                     │
│  [ ] Upper Body Strength        │
│      45 min | 🏋️ Dumbbells      │
│      [→ View Exercises]         │
│                                 │
│  📊 TODAY'S PROGRESS            │
│  ▓▓▓▓░░░░░░ 450/2,150 cal      │
│  Protein: 45/160g ⚠️ Low        │
│                                 │
│  [View Full Week's Plan]        │
│  [+ Log Custom Meal]            │
│                                 │
│  ─── Bottom Nav ───             │
│  [●Home] [Workouts] [Progress] [Profile]│
└─────────────────────────────────┘
```

### Swap Options Modal
```
┌─────────────────────────────────┐
│  Swap: Salmon with Quinoa       │
│  (Monday Dinner)                │
│                                 │
│  🔄 FROM THIS WEEK'S PLAN       │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Tuesday Dinner          │   │
│  │ Grilled Chicken         │   │
│  │ 515 cal | 48g P         │   │
│  │ [Select]                │   │
│  └─────────────────────────┘   │
│                                 │
│  [Show More from Plan (5)]      │
│                                 │
│  ✨ GENERATE NEW OPTIONS        │
│  [Generate Alternatives]        │
│                                 │
│  [Cancel]                       │
└─────────────────────────────────┘
```

### Quick Log Confirmation
```
┌─────────────────────────────────┐
│  Log Meal                       │
│                                 │
│  🍳 Greek Yogurt Parfait        │
│                                 │
│  [✓] Full serving (320 cal)     │
│  [ ] Half serving (160 cal)     │
│  [ ] Custom amount...           │
│                                 │
│  [Log Meal] [Cancel]            │
└─────────────────────────────────┘
```

---

## Q1 Changes Summary (v2.1 → v3.0)

**Added:**
- New Step 11: Eating Pattern
  - How many meals per day? (2, 3, or 4-5)
  - Which meals? (Breakfast/Lunch/Dinner checkboxes)
  - Includes snacks? (Checkbox)
  - Helper text: "We'll create a plan that fits your eating style"

**Renumbered:**
- Old Step 11 (Budget) → New Step 12
- Old Step 12 (Shopping Day) → New Step 13
- Old Step 13 (Equipment) → New Step 14
- Old Step 14 (Workout Schedule) → New Step 15
- Old Step 15 (Preferences & Consent) → New Step 16
- Old Step 16 (Data Storage) → New Step 17

**Metrics Update:**
- Steps: 16 → 17
- Duration: ~1-1.5 min → ~1-1.75 min
- Still well under original 24 steps (~3 min)

---

## Context for Next Instance

### What This Session Accomplished

This session **started Q3 Meal Tracking** planning but focused heavily on **foundational decisions** that affect multiple features:

1. **Eating Pattern in Onboarding** - Recognized that Q3 home dashboard needs to know user's meal pattern to display correctly. Can't show 3 meals if user only eats 2. Led to Q1 v3.0 update.

2. **Bottom Navigation Redesign** - Realized current Q2 navigation (separate Meals tab) doesn't match how users will actually use the app. Home is the hub. This affects Q2, Q3, and Q5 specs.

3. **Snacks as Pre-Planned** - Decision that if user wants snacks, they should be generated by AI with specific recipes/macros, not just "add 150 cal snack". Affects Q2 generation and Q3 tracking.

4. **Two-Option Swapping** - Enhanced Q2's swap feature by adding quick-swap from week's plan. Better UX, less waiting for API.

### What Q3 Is About

**Q3: Meal Tracking** is separate from Q2: Meal Planning.

- **Q2 (done):** View your AI-generated weekly meal plan, swap meals, rate meals, generate shopping lists
- **Q3 (in progress):** Log what you actually ate (from plan or custom), track calories/macros, view history

### Why We're Not Further in Q3

We spent significant time on:
- Home dashboard design (central to Q3)
- Navigation structure (affects all features)
- Q1 update (required for Q3 to work correctly)
- Decision documentation (2 major decisions logged)

This is **foundational work** that makes Q3 faster to complete. Better to get the structure right now than rework later.

### Next Steps for Q3

**Answer these 8 question groups:**
1. How do users log meals NOT from their plan? (Search? Database? Manual entry?)
2. What's the daily tracking detail view? (Beyond home dashboard progress bars?)
3. Quick logging features? (Repeat yesterday, favorites, recent meals?)
4. Editing/deleting logged meals?
5. Meal history browsing?
6. Weekly/monthly summary views?
7. Snack logging specifics?
8. Data structures for all of the above?

Once these are answered, write full Q3 spec following Q1/Q2 pattern:
- Screen-by-screen designs with exact layouts
- All interactions specified
- User flows with ASCII diagrams
- TypeScript data structures
- Technical requirements
- Success criteria

**Estimated:** Q3 will be similar size to Q2 (~1600 lines, 8-10 screens)

---

## System Notes

**Context Continuity:**
- This is Session 3 of Planning context (same day as Sessions 1-2)
- Session 1: Project reorganization, Q1 final
- Session 2: Q2 complete
- Session 3: Q1 v3.0 update, Q3 start, navigation redesign

**Documentation Standards:**
- All decisions logged in DECISIONS.md
- All specs follow same format (Q1/Q2 templates)
- Handoffs created at end of every session
- STATUS.md updated after every session

---

## Read These Next Time

**Required (always):**
- [project/OVERVIEW.md](../../project/OVERVIEW.md)
- [project/STATUS.md](../../project/STATUS.md) - **needs update with Q3 progress**
- This handoff document

**For Q3 Continuation:**
- [project/planning/Q1_Onboarding_FINAL.md](../../project/planning/Q1_Onboarding_FINAL.md) v3.0 - eating pattern data
- [project/planning/Q2_MealPlanning_FINAL.md](../../project/planning/Q2_MealPlanning_FINAL.md) - meal plan structure, recipe detail screens
- [project/DECISIONS.md](../../project/DECISIONS.md) - latest decisions
- [.claude-instructions/TEMPLATES.md](../../.claude-instructions/TEMPLATES.md) - spec template to use

**For Reference:**
- Home dashboard design (in this handoff)
- Swap modal design (in this handoff)
- Quick log confirmation design (in this handoff)

---

**Handoff Version:** 1.0
**Next Session:** Continue Q3 specification - answer remaining 8 question groups, design all screens, write complete spec
**Estimated Progress:** Q3 ~10% complete (foundational decisions made, home dashboard designed, questions identified)
