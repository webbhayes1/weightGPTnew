# Pre-Session 23 Handoff: Comprehensive User Flow & Edge Case Review

**Date:** 2025-11-10
**Session Type:** Planning - Pre-Session 23 Analysis
**Status:** 📋 REVIEW COMPLETE - Awaiting Decisions on 15 Gaps
**Next Session:** Session 23 (Final Pre-Development Review) - After gap resolution

---

## 🎯 SESSION PURPOSE

Before completing Session 23 (Final Pre-Development Review), we conducted a comprehensive review of all user flows, edge cases, and potential complications across the entire app. This session identified gaps in existing planning specifications that must be resolved before development begins.

**Mission Alignment Check:** Every feature and flow was evaluated against:
- ✅ **Goal Achievement:** Does this help user reach their weight goal?
- ✅ **Personalization:** Does the plan refine to their unique preferences over time?
- ✅ **Adherence:** Does this help them stay on track?
- ✅ **Trust & Momentum:** What could break user trust or disrupt their progress?

---

## 📊 EXECUTIVE SUMMARY

### What We Reviewed:
1. **Part 1:** 4 core user journeys (end-to-end flows)
2. **Part 2:** 12 feature-by-feature deep dives (Q0-Q3.7)
3. **Part 3:** Failure scenarios & error states
4. **Part 4:** Cross-feature dependencies

### What We Found:
**18 Critical Questions Analyzed Against Existing Planning Specs:**
- ✅ **3 Already Solved** (17%) - Fully documented, production-ready
- ⚠️ **4 Partially Solved** (22%) - Logic exists but edge cases missing
- ❌ **11 Completely Missing** (61%) - Need specification before dev

### Priority Breakdown:
- 🔴 **P0 Critical:** 6 gaps (4 missing, 2 partial) - MUST resolve before dev
- 🟡 **P1 Important:** 7 gaps (5 missing, 2 partial) - SHOULD resolve before dev
- 🟢 **P2 Edge Cases:** 2 gaps (2 missing) - NICE to resolve before dev

**Total Gaps Blocking Development:** 15/18 questions need resolution

---

## 📋 PART 1: COMPREHENSIVE USER FLOW & EDGE CASE REVIEW CHECKLIST

This checklist covers every major user flow in the app. In the next session, we'll walk through these systematically after resolving the critical gaps.

---

### 🔴 CORE USER JOURNEYS (END-TO-END)

#### Journey 1: New User → First Week (Weight Loss) 🔴 CRITICAL

**User:** Sarah, 30F, wants to lose 15 lbs in 15 weeks, sedentary, no dietary restrictions, works out 3x/week at home with dumbbells

**11-Step Flow:**

1. **Onboarding Steps 1-3** (Name, Goal: Lose Weight, Stats)
   - [ ] Input: 160 lbs current, 145 lbs goal, 5'6", 30 years old, female
   - [ ] **CHECK:** BMR calculation (Mifflin-St Jeor formula)
   - [ ] **CHECK:** Timeline validation (15 weeks = 1 lb/week, SAFE)
   - [ ] **CONCERN:** What if she enters 4 weeks? (3.75 lbs/week, UNSAFE)

2. **Onboarding Steps 4-8** (Activity, Dietary Prefs, Workout Prefs)
   - [ ] **CHECK:** TDEE calculation with sedentary multiplier
   - [ ] **CHECK:** Calorie deficit calculation (500 cal/day for 1 lb/week)
   - [ ] **CHECK:** Macro calculation (protein 0.8-1g/lb, 30% fat, rest carbs)
   - [ ] **CONCERN:** What if calculated calories < 1200 (female min)?

3. **Onboarding Steps 9-11** (Eating Pattern, Workout Days, Shopping Day)
   - [ ] Selects: 3 meals/day (B/L/D), works out Mon/Wed/Fri, shops Sunday
   - [ ] **CHECK:** Meal pattern affects meal generation (14 meals vs 28 meals)
   - [ ] **CONCERN:** What if workout days conflict with muscle group 48hr rule?

4. **Onboarding Steps 12-17** (Loading 1-3, Value Demo, Paywall)
   - [ ] Loading 1: Calculating nutrition plan
   - [ ] Loading 2: Generating meal plan
   - [ ] Loading 3: Creating workout program
   - [ ] **CHECK:** All 3 AI calls succeed (OpenAI GPT-4o-mini)
   - [ ] **❌ CRITICAL GAP:** What if OpenAI API fails/times out during onboarding? (See Q1)
   - [ ] **CHECK:** Value demo shows weight graph projection
   - [ ] **CHECK:** Paywall appears AFTER value demo

5. **Week 1, Day 1 (Monday)** - First Experience
   - [ ] Opens app → Home tab (Nutrition mode by default)
   - [ ] **CHECK:** Progress circles show 0/target (empty state)
   - [ ] **CHECK:** Day selector on Monday
   - [ ] **CHECK:** Meal cards show 3 meals (B/L/D) for Monday, all unchecked
   - [ ] **CHECK:** Tapping meal opens Meal Detail screen
   - [ ] **CONCERN:** Does user understand they need to LOG meals (not just view)?

6. **First Meal Log** - Breakfast
   - [ ] Taps checkbox on "Veggie Omelette" card
   - [ ] **CHECK:** Checkbox animates, card tints green, "Logged" badge appears
   - [ ] **CHECK:** Calorie ring starts filling (liquid animation)
   - [ ] **CHECK:** Calorie number counts up (350/1650)
   - [ ] **CHECK:** Macro rings update (protein/carbs/fat)
   - [ ] **CHECK:** LoggedEntry created in database with type='meal', source='planned'
   - [ ] **CONCERN:** What if user accidentally taps twice (logs, unlogs, logs)?
   - [ ] **CONCERN:** What if they log breakfast at 2pm? (Does timestamp matter?)

7. **First Meal Swap** - Lunch (Doesn't like fish)
   - [ ] Views "Grilled Salmon Salad" for lunch, doesn't like salmon
   - [ ] Taps card → Meal Detail → "Swap Meal" button
   - [ ] **CHECK:** Swap modal opens with 2 tabs: "This Week" + "AI Generate"
   - [ ] Selects "This Week" tab
   - [ ] **CHECK:** Shows alternative meals from current week that match lunch + calories ±50 + protein ±5g
   - [ ] **⚠️ PARTIAL GAP:** What if NO meals match? (See Q5)
   - [ ] Selects "Chicken Caesar Wrap" → Confirm
   - [ ] **CHECK:** Meal swaps instantly, new macro totals calculated
   - [ ] **CHECK:** Daily totals still within ±10% target
   - [ ] **CHECK:** Old meal not lost (can swap back via Undo toast)
   - [ ] **⚠️ CRITICAL GAP:** What if user swaps, logs, then swaps again? Data integrity? (See Q3)

8. **First Workout Log** - Monday Evening
   - [ ] Switches to Workout mode (dual-mode toggle)
   - [ ] **CHECK:** Segmented time circle shows 0/45 min (empty state)
   - [ ] **CHECK:** "Upper Body Strength" workout card for Monday
   - [ ] Taps checkbox → Workout logged
   - [ ] **CHECK:** Time segment fills (blue gradient)
   - [ ] **CHECK:** Calorie burn arc shows ~250 cal
   - [ ] **CONCERN:** What if they don't actually do the workout but still check it? (Honor system, but should we remind?)

9. **End of Day 1**
   - [ ] All 3 meals logged, 1 workout logged
   - [ ] **CHECK:** DailySummary created with accurate totals
   - [ ] **CHECK:** Streak starts (streak_current = 1)
   - [ ] **CHECK:** Weight graph on Progress tab shows "Log your weight to see progress" (initial state)

10. **Days 2-7** - Rest of Week
    - [ ] **CHECK:** Can navigate days with swipe gesture
    - [ ] **CHECK:** Can swap any meal/workout
    - [ ] **CHECK:** Can log weight anytime (Log tab → Weight)
    - [ ] **CHECK:** Sunday: Push notification reminder "Time to plan next week!" (if enabled)

11. **Week 2 Generation** - Sunday
    - [ ] Opens app Sunday → Prompt appears: "Generate next week's plan?"
    - [ ] Taps "Generate with Favorites"
    - [ ] **CHECK:** Can select up to 3 favorite meals
    - [ ] **CHECK:** AI generates 14 new meals (keeping 3 favorites)
    - [ ] **CHECK:** Learns from feedback (thumbs down on fish = fewer fish meals)
    - [ ] **CONCERN:** What if user DOESN'T regenerate? Do they keep Week 1 plan forever?
    - [ ] **❌ CRITICAL GAP:** What if they regenerate 6 times in one day? (Limit = 5/week) (See Q6)

**CRITICAL QUESTIONS FROM JOURNEY 1:**
- ❓ Q1: Onboarding AI failure handling (no retry? fallback?)
- ❓ First-time user education (do they know to log meals?)
- ❓ Q5: Swap with no matches (fallback to AI Generate tab?)
- ❓ What happens if user never regenerates weekly plan?
- ❓ Q6: Regeneration limit UX (how do we communicate 5/week limit?)
- ❓ Q3: Swap undo after logging (data integrity)

---

#### Journey 2: Weight Loss - Week 4 (Mid-Journey Momentum) 🔴 CRITICAL

**User:** Sarah, 4 weeks in, lost 4 lbs (on track!), high adherence, starting to customize

**4-Step Flow:**

1. **Monday Morning** - Check Progress
   - [ ] Opens Progress tab
   - [ ] **CHECK:** Weight graph shows 4 data points (160→159→158→157→156)
   - [ ] **CHECK:** Trend line shows linear regression (downward slope)
   - [ ] **CHECK:** "On Track" badge (green)
   - [ ] **CHECK:** Weekly summary: "Lost 1 lb this week" with comparison to last week
   - [ ] **❌ GAP:** What if she gains weight one week? (Water retention, period) How do we handle psychologically? (See Q12)

2. **Meal Feedback Loop** - Refinement
   - [ ] Views meal history, sees she's thumbs-downed 3 chicken recipes
   - [ ] **CHECK:** Next week's plan has fewer chicken meals
   - [ ] **CHECK:** AI prompt uses feedback: "User dislikes chicken breast recipes"
   - [ ] **CONCERN:** What if she thumbs-down 80% of meals? (AI has no good options)

3. **Saved Items Usage** - Favorites Growing
   - [ ] Has 15 saved meals, 3 saved workouts
   - [ ] Uses "Quick Add to Today" feature
   - [ ] **CHECK:** Modal shows: "Add or Replace?"
   - [ ] Selects "Replace Lunch"
   - [ ] **CHECK:** Saved meal replaces planned lunch
   - [ ] **CHECK:** Macros recalculated
   - [ ] **CHECK:** No AI call needed (60% cost reduction works)
   - [ ] **CONCERN:** What if replacing breaks daily totals? (±10% rule violated?)

4. **Streak Motivation** - 28 Days
   - [ ] **CHECK:** Streak counter shows 28 days (4 weeks)
   - [ ] **CHECK:** Achievement unlocked: "4-Week Warrior" badge
   - [ ] **CHECK:** Achievement modal appears with celebration animation
   - [ ] **⚠️ GAP:** What if she misses one day? (Streak resets to 0, devastating?) (See Q8)

**CRITICAL QUESTIONS FROM JOURNEY 2:**
- ❓ Q12: How do we handle weight fluctuations without discouraging user?
- ❓ Feedback loop saturation (too many dislikes = no good meals)?
- ❓ Q8: Streak reset psychology (harsh or motivating? Grace period?)

---

#### Journey 3: Weight Gain - High Calorie Adherence 🔴 CRITICAL

**User:** Mike, 25M, wants to gain 10 lbs in 10 weeks, moderate activity, gym access, 4 meals/day (B/L/D/Snack)

**4-Step Flow:**

1. **Onboarding Differences** - Weight Gain
   - [ ] Goal: Gain Weight
   - [ ] Current: 150 lbs, Goal: 160 lbs
   - [ ] **CHECK:** Timeline validation (1 lb/week gain, SAFE)
   - [ ] **CHECK:** Calorie SURPLUS calculation (+500 cal/day)
   - [ ] **CHECK:** High protein target (1.2-1.5g/lb for muscle gain)
   - [ ] **CONCERN:** What if calculated calories > 4000? (Very high, feasible?)

2. **4 Meals/Day with Snack** - Higher Meal Count
   - [ ] Eating pattern: 4 meals (B/L/D/Snack)
   - [ ] **CHECK:** Meal plan generates 28 meals (7 days × 4 meals)
   - [ ] **CHECK:** Calorie distribution balanced: 30% / 35% / 30% / 5%
   - [ ] **CONCERN:** Is snack calorie validation correct? (50-400 cal for bulking?)

3. **Protein Tracking** - Critical for Gains
   - [ ] Daily target: 180g protein
   - [ ] **CHECK:** Protein ring shows progress (green)
   - [ ] **CHECK:** If under target by evening, does app suggest high-protein snack?
   - [ ] **❌ CRITICAL GAP:** Do we have any "falling short" nudges? Or just passive display? (See Q9)

4. **Workout Focus** - Strength Training
   - [ ] Works out 4x/week (Mon/Tue/Thu/Fri)
   - [ ] **CHECK:** Workout split: Upper/Lower/Upper/Lower
   - [ ] **CHECK:** 48hr minimum between muscle groups
   - [ ] **⚠️ GAP:** What if he swaps Mon Upper Body → Tue (conflicts with Tue scheduled Upper Body)? (See Q10)

**CRITICAL QUESTIONS FROM JOURNEY 3:**
- ❓ Q9: Do we nudge users falling short on calories/protein? (For weight gain, this is critical)
- ❓ 4 meals/day UX - does grocery list get overwhelming? (28 meals × 5 ingredients = 140 items?)
- ❓ Q10: Workout swap validation - do we prevent muscle group conflicts?

---

#### Journey 4: Maintenance - 5% Variance Monitoring 🟡 P1

**User:** Emma, 40F, wants to maintain 135 lbs, has food allergies (gluten, dairy)

**3-Step Flow:**

1. **Onboarding - Maintain Goal**
   - [ ] Goal: Maintain Weight
   - [ ] Current: 135 lbs
   - [ ] **CHECK:** Goal weight = Current weight (135 lbs)
   - [ ] **CHECK:** Timeline & Goal Weight screens SKIPPED (per Q1 v3.1)
   - [ ] **CHECK:** Calories = TDEE (no surplus/deficit)
   - [ ] **❌ CRITICAL GAP:** 5% variance threshold set (135 ± 6.75 lbs = 128.25-141.75 lbs)? (See Q2)

2. **Week 5 - Weight Creeps Up**
   - [ ] Logs weight: 141 lbs (still within 5%)
   - [ ] **CHECK:** Graph shows data point
   - [ ] **CHECK:** No warning yet (within threshold)

3. **Week 8 - Exceeds 5% Threshold**
   - [ ] Logs weight: 143 lbs (6% above starting weight)
   - [ ] **❌ CRITICAL GAP:** Does app show notification: "You've exceeded your 5% maintenance range"? (See Q2)
   - [ ] **❌ CRITICAL GAP:** Does it offer to adjust plan? (Suggest calorie deficit?) (See Q2)
   - [ ] **MISSING SPEC:** This feature is mentioned in Q1 v3.1 but NOT fully specified in any spec

**CRITICAL QUESTIONS FROM JOURNEY 4:**
- ❓ Q2: **MISSING SPEC:** What is the EXACT UX for 5% variance notification?
- ❓ Does user get option to adjust goal or adjust calories?
- ❓ Is there a grace period? (e.g., wait 2 weeks to see if it's temporary?)
- ❓ What if they drop below 5% threshold? (Same UX?)

---

### 🟡 FEATURE-BY-FEATURE DEEP DIVE (12 Features)

*(Abbreviated - Full checklists available on request)*

#### Q1: Onboarding (17 Steps) 🔴 CRITICAL

**Key Checkpoints:**
- [ ] Step 3: Timeline validation (max 2 lbs/week loss, 1 lb/week gain)
- [ ] Step 5-6: Age disclaimers (13-17 parental, 65+ medical, <13 blocked)
- [ ] Steps 14-17: **❌ CRITICAL GAP:** AI failure handling (See Q1)
- [ ] BMR/TDEE/Macro calculations validated
- [ ] Minimum calorie enforcement (1200F, 1500M)

---

#### Q2: Meal Planning (8 Screens) 🔴 CRITICAL

**Key Checkpoints:**
- [ ] Daily meal view filtered by eating_pattern
- [ ] Meal detail screen with recipe, ingredients, feedback
- [ ] Feedback system: Thumbs up/down at meal + ingredient level
- [ ] Grocery list: Consolidated, categorized, unit conversion (oz→lb)
- [ ] **❌ GAP:** Weekly regeneration limit (5/week) hit mid-week (See Q6)
- [ ] **❌ GAP:** Grocery list editing permissions (See Q11)

---

#### Q3.0: Navigation & App Shell 🔴 CRITICAL

**Key Checkpoints:**
- [ ] 3-tab bottom navigation (Home, Log, Progress)
- [ ] Home tab: Dual-mode toggle (Nutrition ⟷ Workout)
- [ ] Russian doll progress circles (nutrition) vs segmented time circle (workout)
- [ ] **❌ GAP:** Feedback message saturation (See Q9)
- [ ] Log tab: 3 options (Meal, Workout, Weight)

---

#### Q3.1: Settings & User Profile 🟡 P1

**Key Checkpoints:**
- [ ] 7 main screens (Settings, Profile, Account, Preferences, Support, Privacy, Logout)
- [ ] **❌ CRITICAL GAP:** Profile editing regeneration triggers (See Q4)
- [ ] Subscription management (RevenueCat portal)
- [ ] GDPR data export (JSON/CSV)
- [ ] Delete account (30-day grace period)

---

#### Q3.2: AI-Powered Logging Deep Dive 🔴 CRITICAL

**Key Checkpoints:**
- [ ] Natural language input → GPT-4o-mini parsing
- [ ] Follow-up question system (5 types)
- [ ] Confirmation screen with edit capability
- [ ] Manual entry fallback (after 2 AI failures)
- [ ] Restaurant recognition (10+ chains)
- [ ] **❌ GAP:** AI insight quality control (See Q13)
- [ ] **❌ GAP:** Extreme calorie validation (See Q16)

---

#### Q3.3: Swapping Systems 🟡 P1

**Key Checkpoints:**
- [ ] Meal swapping: Quick Swap (current week) + AI Generate (3 alternatives)
- [ ] Macro matching algorithm (±50 cal, ±5g protein)
- [ ] **⚠️ CRITICAL GAP:** Swap with no matches fallback (See Q5)
- [ ] **⚠️ CRITICAL GAP:** Undo after logging data integrity (See Q3)
- [ ] Workout swapping: Library (50-100 workouts) + AI backup
- [ ] **⚠️ GAP:** Workout swap same-type rule enforcement (See Q10)

---

#### Q3.4: Weekly Planning & Grocery Management 🟡 P1

**Key Checkpoints:**
- [ ] AI meal plan generation (14-28 meals, balanced ±5%)
- [ ] AI workout plan generation (goal-based split)
- [ ] Grocery list consolidation + unit conversion
- [ ] **❌ CRITICAL GAP:** Regeneration limit (5/week) mid-week options (See Q6)
- [ ] **❌ GAP:** Grocery list locking after swap (See Q11)
- [ ] Export options (PDF, text, image, share)

---

#### Q3.5: Progress Analytics & Insights 🟡 P1

**Key Checkpoints:**
- [ ] Weight graph: 4 states (0, 1, 2, 3+ entries with trend line)
- [ ] **❌ GAP:** Weight fluctuation reassurance messaging (See Q12)
- [ ] Streak system: **⚠️ GAP:** Grace period? (See Q8)
- [ ] ✅ **CLEAR:** Timezone handling (last active timezone)
- [ ] Achievement system (25 badges)
- [ ] **❌ GAP:** Achievement revocation policy (See Q15)
- [ ] AI insights (GPT-4o-mini, 8 categories)
- [ ] **❌ GAP:** AI insight quality validation (See Q13)

---

#### Q3.6: History & Saved Items 🟢 P2

**Key Checkpoints:**
- [ ] History screen: Week pagination, filters, search with ranking
- [ ] Edit entry: Recalculates daily totals
- [ ] Delete entry: Soft delete with confirmation
- [ ] Saved screen: Categorized favorites (max 200)
- [ ] Quick Add to Today: No AI call (60% cost reduction)

---

#### Q3.7: Offline Mode & Sync Strategy 🟡 P1

**Key Checkpoints:**
- [ ] Offline capabilities: 100% manual logging, 95% read features
- [ ] Sync strategy: 4 triggers, 3-phase sync
- [ ] Priority queue (P0-P3): FIFO within priority
- [ ] ✅ **CLEAR:** Conflict resolution (4 rules: LWW, deletion wins, field merge, dedupe)
- [ ] ✅ **CLEAR:** Cache management (8MB budget, priority-based LRU eviction)
- [ ] **❌ GAP:** Sync queue visibility for users (See Q14)

---

### 🔥 FAILURE SCENARIOS & ERROR STATES

#### AI Failures
- [ ] **❌ CRITICAL GAP:** OpenAI timeout during onboarding (See Q1)
- [ ] OpenAI rate limit (429): Circuit breaker at 50% failure rate
- [ ] Malformed response: Zod validation + retry (max 3)
- [ ] API key invalid: Disable all AI features immediately

#### Network Failures
- [ ] No internet: Offline banner, AI disabled, manual logging works
- [ ] Slow connection (>5 sec): Warning toast
- [ ] Intermittent: Retry with exponential backoff (1s→2s→4s→8s)

#### User Errors
- [ ] **❌ GAP:** Invalid input validation bounds (See Q16)
- [ ] Accidental deletion: Confirmation modal
- [ ] Accidental logout: Confirmation with sync warning
- [ ] **CONCERN:** First-time user confusion (do they know to log meals?)

#### Data Errors
- [ ] Sync conflict: ✅ **CLEAR:** Optimistic locking with version field
- [ ] Corrupted cache: SQLite integrity check → Clear + re-sync
- [ ] Missing data (404): Remove from local cache silently
- [ ] Database migration failure: Rollback deploy

---

### 🔗 CROSS-FEATURE DEPENDENCIES

#### Logging → Progress → Streaks → Achievements
**Flow:** User logs meal → Daily summary updates → Streak increments → Achievement unlocks

**Checks:**
- [ ] Logging updates DailySummary (calories, meal count, macros)
- [ ] DailySummary updates Streak (if all meals logged → streak_maintained = true)
- [ ] Streak updates Achievements (7, 14, 30, 60, 90-day milestones)
- [ ] **CONCERN:** Event order? (Sequential or async?) Race conditions?

---

#### Swapping → Weekly Totals → Grocery List
**Flow:** User swaps meal → Daily totals change → Weekly balance affected → Grocery list updates

**Checks:**
- [ ] Swap updates MealPlan (old meal removed, new meal added, version incremented)
- [ ] Swap updates Daily Totals (subtract old, add new, validate ±10%)
- [ ] Swap updates Weekly Balance (±5% across 7 days)
- [ ] **⚠️ GAP:** Swap updates Grocery List (but what if already exported? User bought old ingredients?) (See Q11)
- [ ] **CRITICAL QUESTION:** Should swapping be LOCKED after grocery list export?

---

#### Settings → Plan Regeneration → User Experience
**Flow:** User changes dietary preference → Plan regenerates → All meals change → User experience disrupted?

**Checks:**
- [ ] **❌ CRITICAL GAP:** Settings change triggers regen with confirmation modal? (See Q4)
- [ ] **❌ CRITICAL GAP:** Regeneration preserves favorites? (See Q4)
- [ ] **❌ CRITICAL GAP:** Regeneration doesn't count toward 5/week limit? (See Q4)
- [ ] **❌ CRITICAL GAP:** Logged meals preserved or regenerated? (See Q4)

**CRITICAL QUESTION:** If user logged Mon-Wed, then changes settings Wed night, does Mon-Wed get regenerated? Or only Thu-Sun?

---

#### Offline Queue → Sync → Conflicts
**Flow:** User logs meals offline → Reconnects → Sync runs → Conflicts detected

**Checks:**
- [ ] Queue ordering: Weight (P0) → Logged meals (P0) → Feedback (P1) → Views (P3)
- [ ] Dependency tracking prevents out-of-order sync
- [ ] Conflict detection: ✅ **CLEAR:** Server compares timestamps + version fields
- [ ] Conflict UI: **❌ GAP:** User sees conflicts or auto-resolved? (See Q7 - SOLVED with LWW)

---

## 📊 PART 3: CRITICAL QUESTIONS ANALYSIS REPORT

**18 Questions Analyzed Against Q0-Q3.7 Planning Specifications**

---

### ✅ ALREADY SOLVED (3/18 - 17%)

---

#### **Q7: Conflict Resolution** ✅ COMPREHENSIVE
**Priority:** 🔴 P0
**Location:** Q3.7 Offline Sync, Conflict Resolution section
**Status:** Fully documented, production-ready ✅

**What's Specified:**

**Rule 1: Last-Write-Wins (Default)**
> "Compare `updated_at` timestamps (server vs local). Most recent timestamp wins. Applies to: Meal updates, workout updates, weight entries, grocery list items."

**Rule 2: Deletion Always Wins**
> "If item deleted in one version (offline or online), deletion takes precedence... User's intent to delete is considered final action."

**Rule 3: Field-Level Merge (Profile Only)**
> "For `UserProfile` updates, merge field-by-field instead of full object replacement... Prevents losing unrelated changes."

**Rule 4: Duplicate Detection (Creates Only)**
> "If same resource created offline and online within 5-minute window with matching key fields → Treat as duplicate. Server version wins (discard local create)."

**Verdict:** All four conflict scenarios covered comprehensively. No additional spec needed.

---

#### **Q17: Timezone Travel Handling** ✅ COMPREHENSIVE
**Priority:** 🟢 P2
**Location:** Q3.5 Progress Analytics, Streak System - Timezone Handling
**Status:** Fully documented with code examples ✅

**What's Specified:**

> **"Timezone Handling Purpose:** Prevent unfair streak breaks due to travel across timezones."
>
> **"Approach:** User's 'day' is defined by their device's local timezone at the time of midnight evaluation."
>
> **"Edge Case: Timezone Travel**
> ```typescript
> // Solution: Streak calculated based on timezone where app was last opened at midnight
> function getEvaluationTimezone(user: User): string {
>   // Use user's last active timezone (stored in user.last_active_timezone)
>   return user.last_active_timezone || user.timezone || 'UTC';
> }
> ```"
>
> **"Implementation:** `user.last_active_timezone` updated every time app opens. Streak evaluation uses this timezone for midnight calculation."
>
> **"Edge Case: International Date Line** - User cannot 'double-log' same calendar date to game streak (server timestamp prevents this)."

**Verdict:** Covers timezone changes, IDL crossing, gaming prevention with implementation code. No additional spec needed.

---

#### **Q18: Cache Budget Overflow** ✅ COMPREHENSIVE
**Priority:** 🟢 P2
**Location:** Q3.7 Offline Sync, Cache Management section
**Status:** Fully documented with priority hierarchy ✅

**What's Specified:**

> **"Cache Priority System:**
> - **P0 (Critical - Never Evict):** Current week meals/workouts, user profile, sync queue
> - **P1 (High Priority):** Last 7 days of logged items, next week's plan (if generated), saved items list
> - **P2 (Medium Priority):** Last 30 days of weight entries, last 4 weeks of weekly summaries, achievement progress
> - **P3 (Low Priority - Evict First):** Historical data beyond 30 days, cached images/photos, old grocery lists"
>
> **"Eviction Algorithm (LRU within priority):**
> 1. Check total cache size vs 8MB budget
> 2. If exceeds: Start evicting P3 items (least recently accessed first)
> 3. If still over: Evict P2 items (least recently accessed)
> 4. Never evict P0 or P1 (warn user if approaching limit)"
>
> **"User Notification (if P1 at risk):**
> 'Storage running low. Some older data may not be available offline. Connect to sync.'"

**Verdict:** Clear priority hierarchy, LRU eviction within tiers, user notification if critical. No additional spec needed.

---

### ⚠️ PARTIALLY SOLVED (4/18 - 22%)

---

#### **Q3: Swap Undo After Logging** ⚠️ LOGIC GAP
**Priority:** 🔴 P0
**Location:** Q3.3 Swapping, Undo Flow
**Status:** Basic undo exists but edge case missing

**What's Specified:**

From Q3.3 Swapping:
> "Swap creates new `PlannedMeal` / `PlannedWorkout` record. Previous item still exists in database (marked as `swapped_out: true`). This preserves history for analytics."
>
> "Undo Swap Flow: Tap [Undo Swap] button → Revert to original meal... Swap record marked as `reverted: true` with timestamp."
>
> "3-second toast window for undo."

**What's MISSING:**

❌ **Edge Case Not Addressed:**
```
Scenario:
1. User swaps Meal A → Meal B
2. User logs Meal B (checkbox, now in logged_entries table)
3. User taps [Undo] (within 3 seconds)

Questions:
- Does the logged entry get deleted?
- Does it become orphaned (pointing to non-active meal)?
- Should undo be disabled once logged?
- What about daily totals recalculation?
```

**DECISION NEEDED:**

```
Option A: Disable Undo After Logging (Safest)
- Once logged, undo button disappears
- Prevents data integrity issues
- User must manually unlog + swap back

Pros: Simple, no edge cases
Cons: Less flexible for user mistakes

Option B: Undo Reverts Swap But Keeps Log (Orphan Entry)
- Swap reverts to Meal A
- Logged entry points to Meal B (now inactive)
- Flag entry as "manual correction needed"
- Show warning: "You logged this meal, but it's no longer in your plan"

Pros: Preserves user action history
Cons: Complex data model, confusing UX

Option C: Undo Deletes Log + Reverts Swap (Nuclear)
- Confirmation modal: "This will also delete your log entry. Continue?"
- Deletes logged_entry record
- Reverts swap
- Recalculates daily totals

Pros: Clean state, no orphans
Cons: Destructive, could frustrate users
```

**RECOMMENDATION:** Option A (Disable undo after logging) for MVP simplicity. Add to Q3.3 spec.

---

#### **Q5: Swap with No Matches** ⚠️ EDGE CASE
**Priority:** 🔴 P0
**Location:** Q3.3 Swapping
**Status:** Partial fallback exists but zero-result case missing

**What's Specified:**

From Q3.3 Swapping:
> "Modal (Hybrid System):
> Option 1: Browse Library (Primary) - Large preloaded meal library filtered by dietary restrictions, cuisine preferences...
>
> Option 2: AI Generation (Backup) - Generates 3 alternatives using OpenAI API if library browsing doesn't satisfy"

**What's MISSING:**

❌ **Zero-Result Fallback Not Addressed:**
```
Scenario:
1. User swaps meal
2. Library search → 0 results (e.g., vegan + gluten-free + nut-free + high-protein = very limited)
3. AI Generate → 0 valid options (or API failure)

Questions:
- What UX does user see?
- Error message?
- Fallback to manual entry?
- Allow temporarily relax restrictions?
```

**DECISION NEEDED:**

```
Fallback Flow Proposal:

1. Library Search → 0 results
   Show: "No library meals match your criteria"
   [Try AI Generate]

2. AI Generate → 0 valid options (or API failure)
   Show modal:

   "No Suitable Swaps Found"
   "We couldn't find a meal that matches your dietary restrictions and calorie target.

   What would you like to do?

   [Create Custom Meal] → Opens manual entry form
   [Relax Restrictions] → Modal: "Which restriction can we temporarily remove?"
                           (Show list: Vegan, Gluten-Free, Nut-Free, etc.)
   [Keep Current Meal] → Cancel swap, close modal
   "

3. If user selects "Create Custom Meal":
   - Open manual entry form pre-filled with target calories/macros
   - User enters meal details
   - Meal added to plan with source='custom'

4. If user selects "Relax Restrictions":
   - Show toggles for each restriction
   - User deselects one
   - Retry library search + AI generate
   - Show: "Temporarily removed: Gluten-Free (just for this meal)"
```

**RECOMMENDATION:** Add comprehensive zero-result fallback flow to Q3.3 spec.

---

#### **Q8: Streak Grace Period** ⚠️ DESIGN DECISION NEEDED
**Priority:** 🟡 P1
**Location:** Q3.5 Progress Analytics, Streak System
**Status:** Strict policy implied but not explicitly decided

**What's Specified:**

From Q3.5 Streak System:
> "Streak Increment: Runs at midnight (00:00) in user's timezone. If previous day met criteria → Increment streak. If previous day did NOT meet criteria → Reset streak to 0."
>
> "Algorithm: Work backwards from yesterday, counting consecutive completed days...
> `while (isDayCompletedForStreak(currentDate, user)) { streak++; }`"

**What's IMPLIED:**
- Streak resets to 0 immediately when day incomplete
- No grace period mentioned

**What's MISSING:**

❌ **Industry Best Practice Consideration:**
- Most fitness apps offer 1 grace day per week
- Reduces user frustration from edge cases (forgot to log before midnight, sick day, etc.)
- Improves retention

**DECISION NEEDED:**

```
Option A: Keep Strict Policy (Resets Immediately)
Pros:
- Simpler logic (no grace state to manage)
- Clear rule: log every day or reset
- Motivates daily consistency

Cons:
- Harsh for edge cases (user sick, traveling, forgot)
- May discourage users after long streaks break unfairly

Option B: 1 Grace Day Per Week
Pros:
- Better user retention (industry standard)
- Handles edge cases gracefully
- Still motivates consistency (only 1 miss allowed)

Cons:
- More complex logic (track grace days used)
- Need UI to show: "Grace day used (1/1 this week)"

Implementation:
```typescript
interface User {
  streak_current: number;
  grace_days_used_this_week: number; // 0 or 1
  week_start_date: Date; // For weekly reset
}

function evaluateStreak(user: User): void {
  if (isDayCompletedForStreak(yesterday, user)) {
    user.streak_current++;
  } else {
    if (user.grace_days_used_this_week < 1) {
      // Use grace day
      user.grace_days_used_this_week++;
      // Streak continues (don't increment, but don't reset)
      showToast("Grace day used. Your streak continues!");
    } else {
      // No grace days left
      user.streak_current = 0;
      showToast("Streak reset. Start fresh tomorrow!");
    }
  }
}
```

Option C: "Freeze Streak" Feature (Premium)
- User can freeze streak 1x per month
- Acts as insurance against unavoidable breaks
- Premium engagement feature

Pros:
- Premium value prop
- User control
- Handles rare edge cases (vacation, illness)

Cons:
- Adds complexity
- May reduce daily motivation if "freeze" is available
```

**RECOMMENDATION:** Option B (1 grace day per week) for better retention. Add to Q3.5 spec with UI mockups.

---

#### **Q10: Workout Swap Same-Type Rule** ⚠️ VALIDATION UNCLEAR
**Priority:** 🟡 P1
**Location:** Q3.3 Swapping, Workout Swapping
**Status:** Type filtering exists but enforcement unclear

**What's Specified:**

From Q3.3 Swapping:
> "Swap Flow: User selects desired workout type first → Then chooses from library OR AI generation for that type"
>
> "Option 1: Browse Library - Filtered by:
> Workout type (Strength: Upper/Lower/Full/Core, Cardio: Running/HIIT/Cycling/Other),
> Duration (15/30/45/60 min),
> Equipment..."

**What's IMPLIED:**
- User picks workout type during swap
- Library filters by that type
- **SUGGESTS** same-type swapping but doesn't enforce it

**What's MISSING:**

❌ **Explicit Enforcement & Validation:**
```
Questions:
- Can user pick "Cardio" to replace a "Strength" workout?
- Would this affect weekly balance (e.g., goal requires 60% cardio / 40% strength)?
- Does system warn about balance deviation?
- What about muscle group conflicts (48hr rule)?
```

**DECISION NEEDED:**

```
Proposal: Enforce Same-Type Swaps with Balance Validation

1. UI Flow:
   - User taps "Swap Workout" on "Upper Body Strength"
   - Modal opens pre-filtered to "Strength" workouts only
   - User CANNOT change type filter (or shows warning if they try)

2. Validation Logic:
   ```typescript
   function validateWorkoutSwap(
     currentWorkout: Workout,
     newWorkout: Workout,
     weekPlan: WorkoutPlan
   ): ValidationResult {

     // Check 1: Same type
     if (currentWorkout.type !== newWorkout.type) {
       return {
         allowed: false,
         error: "Workout type must match (Strength → Strength, Cardio → Cardio)"
       };
     }

     // Check 2: Weekly balance
     const newWeeklyBalance = calculateWeeklyBalance(weekPlan, currentWorkout, newWorkout);
     if (newWeeklyBalance.cardio > userGoal.cardioPercentage + 0.1) {
       return {
         allowed: true,
         warning: "This swap exceeds your weekly cardio target (65% vs 60%). Swap anyway?"
       };
     }

     // Check 3: Muscle group 48hr rule (for strength only)
     if (newWorkout.type === 'strength') {
       const conflict = checkMuscleGroupConflict(newWorkout, weekPlan);
       if (conflict) {
         return {
           allowed: false,
           error: `This workout targets ${conflict.muscleGroup} within 48 hours of another workout`
         };
       }
     }

     return { allowed: true };
   }
   ```

3. UX for Warnings:
   - Hard Block (allowed: false): Show error, disable Confirm button
   - Soft Warning (allowed: true, warning): Show warning modal with [Cancel] [Swap Anyway]

4. Edge Case: User wants different type
   - Show: "To change workout type, delete this workout and add a new one manually"
   - Or: "Premium users can change workout types" (feature gate?)
```

**RECOMMENDATION:** Add same-type enforcement + balance validation to Q3.3 spec. Allow warnings but block muscle group conflicts.

---

### ❌ COMPLETELY MISSING (11/18 - 61%)

---

### 🔴 P0 CRITICAL GAPS (4 Missing)

---

#### **Q1: Onboarding AI Failure** ❌ NO SPEC
**Priority:** 🔴 P0 - BLOCKS DEVELOPMENT
**Location:** Q1 Onboarding, Steps 14-15
**Status:** No error handling documented

**Current Spec:**

From Q1 Onboarding:
> "**Step 14: Loading Screen 2 - Meal Plan Generation**
> Loading screen: 'Generating your personalized meal plan...' (10-15 seconds)
>
> **Step 15: Loading Screen 3 - Workout Plan Generation**
> Loading screen: 'Creating your workout program...' (8-10 seconds)"

**No mention of:**
- Timeout handling
- Retry mechanism
- Fallback options
- Error messaging

**What Happens If:**
- OpenAI API timeout (>30 sec)
- OpenAI rate limit (429 error)
- Invalid/malformed response from AI
- Network failure mid-generation
- User stuck on loading screen forever?

**CRITICAL DECISION NEEDED:**

```
Proposal: Multi-Tier Fallback System

Tier 1: Primary (OpenAI Generation)
- Timeout: 30 seconds per API call
- 3 parallel calls: Meal plan, Workout plan, Insights
- Expected duration: 10-15 seconds

↓ (If any call times out or fails)

Tier 2: Retry Once with Adjusted Prompt
- Retry failed call(s) with simplified prompt
- Timeout: 20 seconds
- Show: "Taking longer than expected... hang tight!"

↓ (If retry fails)

Tier 3: Template-Based Plan (Fallback)
- Use pre-built meal/workout plans (3 per goal type: lose/gain/maintain)
- Dynamically adjust calories/macros to user's calculated targets
- Example: "Lose Weight Template" → Adjust from 1800 cal to user's 1650 cal
- Show: "We created a starter plan for you! You can customize it in Settings."
- Still allows app to function, user can swap/customize

Template Structure:
```typescript
interface PlanTemplate {
  id: string;
  goal: 'lose_weight' | 'gain_weight' | 'maintain';
  base_calories: number; // Template default (e.g., 1800)
  meals: MealTemplate[]; // 14 generic meals (B/L/D × 7 days)
  workouts: WorkoutTemplate[]; // 3 generic workouts
}

function applyTemplate(template: PlanTemplate, user: User): MealPlan {
  // Scale calories proportionally
  const scale = user.daily_calories / template.base_calories;

  return {
    meals: template.meals.map(m => ({
      ...m,
      calories: m.calories * scale,
      macros: {
        protein_g: m.macros.protein_g * scale,
        carbs_g: m.macros.carbs_g * scale,
        fat_g: m.macros.fat_g * scale,
      }
    })),
    source: 'template_fallback',
  };
}
```

↓ (If even templates fail - catastrophic DB failure)

Tier 4: Block Onboarding with Error
- Show error modal:
  "We're experiencing technical difficulties. Please try again in a few minutes.

  [Retry Onboarding] [Contact Support]"
- Log to Sentry with priority: CRITICAL
- Send admin notification

UI Flow:
```
Step 14 → API call starts (10s)
  ↓ Success → Step 15
  ↓ Failure after 30s

Show: "Taking longer than expected... hang tight!" (retry starts, 20s)
  ↓ Success → Step 15
  ↓ Failure after 20s

Show: "We created a starter plan for you! You can customize it in Settings."
  + Small badge: "Template Plan" (not AI-generated)
  ↓

Step 15 (Value Demo) → Show template-based plan
  ↓

Continue onboarding normally
User can regenerate with AI later (Settings → Regenerate Plan)
```

**CRITICAL QUESTIONS FOR YOU:**

1. **Are template plans acceptable for MVP?**
   - Pros: Graceful degradation, user never blocked
   - Cons: Not "AI-powered" as advertised (could impact value prop)

2. **Should we block onboarding if AI fails?**
   - Assumes AI is core value prop
   - Users can't proceed without AI-generated plan
   - Pros: Maintains quality bar
   - Cons: Users stuck if API down

3. **Template plan storage:**
   - Store 3 templates in database? (lose, gain, maintain)
   - Or hardcode in app? (faster, no DB dependency)

4. **Retry UX:**
   - Show retry progress? ("Attempt 2 of 2...")
   - Or silent retry? (just show "hang tight" message)

**RECOMMENDATION:**
- Use Template Fallback (Tier 3) for MVP
- Allow users to regenerate with AI later
- Add clear badge: "Starter Plan (customize it!)"
- Prevents blocking, maintains UX flow
```

**DECISION NEEDED:** Approve template fallback approach? Any concerns?

---

#### **Q2: Maintain Goal 5% Variance UX** ❌ NO SPEC
**Priority:** 🔴 P0 - BLOCKS DEVELOPMENT
**Location:** Q1 Onboarding Step 4, Q2 Meal Planning
**Status:** Feature mentioned in Q1 v3.1 but NO UX flow specified

**Current Spec:**

From Q1 v3.1:
> "**Maintain Weight Flow:**
> - If user selects 'Maintain current weight': Skip timeline and goal weight steps
> - Set: `goal_weight = current_weight`
> - Set: `daily_calories = TDEE` (no surplus/deficit)
> - Add 5% variance monitoring"

From Q0 Data Structures:
```typescript
interface UserProfile {
  // Maintenance Weight Monitoring (Q1 v3.1)
  maintenance_threshold?: number; // 0.05 = 5% variance (only for maintain goal)
  initial_maintenance_weight?: number; // Starting weight for maintenance users
}
```

**What's MISSING:**
- ❌ Exact UX when user exceeds 5% threshold
- ❌ Notification flow
- ❌ Options presented to user
- ❌ Grace period (immediate trigger or sustained?)
- ❌ Graph visualization of acceptable range

**CRITICAL DECISION NEEDED:**

```
Proposal: 5% Variance Monitoring & Notification Flow

1. Setup (Onboarding)
   User selects "Maintain Weight" at 150 lbs
   System calculates:
   - maintenance_threshold: 0.05 (5%)
   - initial_maintenance_weight: 150 lbs
   - acceptable_range: 142.5 - 157.5 lbs (150 ± 7.5 lbs)

2. Monitoring (Weight Graph UI)
   Graph shows:
   - Green band: 142.5 - 157.5 lbs (acceptable range)
   - Data points: User's weight entries
   - Baseline: 150 lbs (dashed line)

   Visual states:
   - Within range: Green data point
   - Outside range: Orange data point (warning)
   - Sustained outside: Red data point (alert)

3. Notification Trigger Options:

   Option A: Immediate Trigger (First Weigh-In Outside Range)
   - Pros: User immediately aware of deviation
   - Cons: Could trigger on water weight fluctuation

   Option B: Sustained Trigger (2 Consecutive Weigh-Ins)
   - Pros: Filters out temporary fluctuations
   - Cons: Delayed response (could be 2 weeks if user logs weekly)

   Option C: Trend-Based (Moving Average Exceeds)
   - Pros: Most accurate (smooth out noise)
   - Cons: Complex calculation, harder to explain to user

   **RECOMMENDATION: Option B (2 consecutive weigh-ins)**

4. Notification UX (When Triggered)

   Modal appears after 2nd consecutive weigh-in outside range:

   ┌───────────────────────────────────┐
   │  Weight Change Detected           │
   ├───────────────────────────────────┤
   │                                   │
   │  You're now 159 lbs, above your   │
   │  5% maintenance range.            │
   │                                   │
   │  Acceptable: 142.5 - 157.5 lbs    │
   │  Your weight: 159 lbs (+6.5 lbs)  │
   │                                   │
   │  What would you like to do?       │
   │                                   │
   │  [Adjust Goal to Lose Weight]     │
   │  → Recalculate plan with deficit  │
   │                                   │
   │  [Update Maintenance Target]      │
   │  → Set new baseline at 159 lbs    │
   │                                   │
   │  [Keep Current Plan]              │
   │  → Continue monitoring            │
   │                                   │
   └───────────────────────────────────┘

5. Action Flows:

   A. User selects "Adjust Goal to Lose Weight":
      - Update user.goal = 'lose_weight'
      - Set user.goal_weight = 150 lbs (original)
      - Recalculate: daily_calories = TDEE - 500 (1 lb/week deficit)
      - Regenerate meal plan (doesn't count toward 5/week limit)
      - Show: "Your plan has been updated to help you get back to 150 lbs"

   B. User selects "Update Maintenance Target":
      - Update user.initial_maintenance_weight = 159 lbs
      - Recalculate acceptable range: 151.05 - 166.95 lbs
      - daily_calories stays at TDEE (no change)
      - Show: "Your maintenance target is now 159 lbs"

   C. User selects "Keep Current Plan":
      - No changes
      - Modal dismissed
      - Show persistent banner in Home tab:
        "⚠️ Weight outside maintenance range. Tap to adjust plan."

6. Persistent Warning (If User Ignores Notification)

   After 2 weeks of sustained deviation:
   - Home tab shows yellow banner (persistent, not dismissible)
   - Settings → Profile shows yellow badge with "!"
   - Weekly summary shows: "Your weight has been outside your maintenance range for 2 weeks"

7. Lower Bound (Drops Below 5%)

   Same flow, but different messaging:
   "You're now 140 lbs, below your 5% maintenance range.

   What would you like to do?

   [Adjust Goal to Gain Weight] → Recalculate plan with surplus
   [Update Maintenance Target] → Set new baseline at 140 lbs
   [Keep Current Plan] → Continue monitoring"

8. Database Schema Addition:

   ```typescript
   interface MaintenanceAlert {
     id: string;
     user_id: string;
     triggered_at: Date;
     weight_at_trigger: number;
     deviation_percentage: number; // e.g., 0.06 = 6%
     direction: 'above' | 'below';
     action_taken: 'adjust_goal' | 'update_baseline' | 'ignored' | null;
     dismissed_at?: Date;
   }
   ```

9. API Endpoints:

   ```
   POST /api/maintenance/check-variance
   Request: { user_id, weight_entry_id }
   Response: {
     within_range: false,
     deviation: 0.06,
     direction: 'above',
     consecutive_count: 2, // Number of consecutive out-of-range entries
     trigger_notification: true
   }

   POST /api/maintenance/adjust-goal
   Request: { user_id, action: 'lose_weight' | 'gain_weight' | 'update_baseline' }
   Response: { updated_profile, new_plan_id }
   ```
```

**CRITICAL QUESTIONS FOR YOU:**

1. **Trigger Strategy:**
   - Immediate (first weigh-in)?
   - Sustained (2 consecutive)?
   - Trend-based (moving average)?
   - **Recommendation: 2 consecutive (filters noise)**

2. **Notification Persistence:**
   - Show once and allow dismiss?
   - Show every weigh-in until resolved?
   - Persistent banner after 2 weeks?
   - **Recommendation: Persistent banner after 2 weeks**

3. **Automatic Adjustment:**
   - Should app automatically suggest switching to lose/gain?
   - Or just inform user and let them decide?
   - **Recommendation: Inform + offer options (user control)**

4. **Variance Threshold:**
   - Keep 5% fixed?
   - Or allow user to customize (3%, 5%, 10%)?
   - **Recommendation: Fixed 5% for MVP, customize in V2**

**DECISION NEEDED:** Approve 2-consecutive trigger + persistent banner approach?

---

#### **Q4: Settings Regen Behavior** ❌ NO SPEC
**Priority:** 🔴 P0 - BLOCKS DEVELOPMENT
**Location:** Q3.1 Settings & User Profile
**Status:** Settings editing exists but regeneration logic missing

**Current Spec:**

From Q3.1 Settings:
> "**Profile Editing Screen:**
> All onboarding fields editable:
> - Goals & Metrics (current weight, goal weight, timeline)
> - Dietary Preferences (restrictions, allergies)
> - Workout Preferences (frequency, equipment, fitness level)
> - Eating Pattern (meals per day, meal types)
>
> Save button: 'Save Changes'
> Confirmation: 'Your changes have been saved! ✓'"

**What's MISSING:**
- ❌ Does saving changes trigger plan regeneration?
- ❌ If yes, which days regenerate? (Full week? Future days only?)
- ❌ What about days already logged?
- ❌ Does it count toward 5/week regeneration limit?
- ❌ What if user changes multiple settings?

**CRITICAL DECISION NEEDED:**

```
Proposal: Smart Regeneration Flow with User Confirmation

1. Impact Detection

   When user taps "Save Changes", system analyzes:

   ```typescript
   interface SettingChange {
     field: string;
     old_value: any;
     new_value: any;
     impacts_meals: boolean;
     impacts_workouts: boolean;
   }

   function detectImpact(changes: SettingChange[]): RegenerationImpact {
     const impacts = {
       meals: changes.some(c => c.impacts_meals),
       workouts: changes.some(c => c.impacts_workouts),
       days_affected: calculateAffectedDays(changes),
     };

     return impacts;
   }

   // Examples:
   dietary_restrictions changed → impacts_meals: true
   workout_frequency changed → impacts_workouts: true
   current_weight changed → impacts_meals: false (only affects macros calculation)
   ```

2. Impact Matrix

   | Setting Changed | Impacts Meals | Impacts Workouts | Requires Regen |
   |---|---|---|---|
   | Dietary restrictions | ✓ | - | Yes (meals only) |
   | Eating pattern | ✓ | - | Yes (meals only) |
   | Current weight | - | - | No (recalc macros only) |
   | Goal weight | ✓ | - | Yes (meals only) |
   | Activity level | ✓ | - | Yes (recalc calories) |
   | Workout frequency | - | ✓ | Yes (workouts only) |
   | Equipment | - | ✓ | Yes (workouts only) |
   | Fitness level | - | ✓ | Yes (workouts only) |
   | Shopping day | - | - | No (affects notification only) |

3. User Confirmation Flow

   Scenario: User is on Wednesday, already logged Mon/Tue meals.
   They change: dietary_restrictions.push('gluten_free')

   Step 1: User taps "Save Changes"

   Step 2: System detects impact
   ```typescript
   {
     meals: true,
     workouts: false,
     days_affected: ['wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
     logged_days: ['monday', 'tuesday'],
   }
   ```

   Step 3: Show Confirmation Modal

   ┌─────────────────────────────────────┐
   │  Update Your Plan?                  │
   ├─────────────────────────────────────┤
   │                                     │
   │  Adding "Gluten-Free" will          │
   │  regenerate your meal plan.         │
   │                                     │
   │  ✓ Mon-Tue (logged)                 │
   │    No changes                       │
   │                                     │
   │  → Wed-Sun (not logged)             │
   │    Will be regenerated              │
   │    (5 days, 15 meals)               │
   │                                     │
   │  Next week's plan will also         │
   │  reflect this change.               │
   │                                     │
   │  [Update Plan] [Cancel]             │
   │                                     │
   │  * Does not count toward weekly     │
   │    regeneration limit (4/5 left)    │
   └─────────────────────────────────────┘

   Step 4: If User Confirms
   - Save settings changes
   - Keep Mon-Tue meals unchanged (source='planned', logged=true)
   - Regenerate Wed-Sun meals with new restrictions
   - Mark old Wed-Sun meals as swapped_out=true
   - Does NOT increment regeneration_count
   - Show toast: "Your plan has been updated for the rest of this week ✓"

4. Edge Case: Multiple Changes in Quick Succession

   User changes 3 settings in 5 minutes:
   - dietary_restrictions (11:00 AM)
   - workout_frequency (11:02 AM)
   - eating_pattern (11:04 AM)

   Option A: Batch Changes (Recommended)
   - Wait 30 seconds after last change
   - Show single confirmation with all changes
   - Regenerate once (not 3 times)

   Option B: Individual Confirmations
   - Show 3 separate modals
   - Regenerate 3 times
   - Annoying UX

   **RECOMMENDATION: Option A (batch with 30-sec debounce)**

5. Edge Case: Change Settings Mid-Week, All Days Logged

   Scenario: It's Sunday, user logged all 7 days.
   They change dietary restrictions.

   Flow:
   - Show: "Your change will apply to next week's plan (starting Monday)"
   - Current week unaffected (already completed)
   - Next week regenerates with new restrictions

6. Edge Case: Reverting Changes

   User changes setting → Plan regenerates → User doesn't like new plan → Reverts setting

   Solution: 24-Hour Backup
   ```typescript
   interface PlanBackup {
     id: string;
     user_id: string;
     plan_type: 'meal' | 'workout';
     plan_data: MealPlan | WorkoutPlan;
     created_at: Date; // TTL: 24 hours
     reason: 'settings_change_backup';
   }
   ```

   Flow:
   - Before regenerating, create backup of current plan
   - If user reverts setting within 24 hours:
     - Show: "Restoring your previous plan..."
     - Restore from backup (instant, no AI call)
   - After 24 hours, backup expires (user must regenerate)

7. Regeneration Limit Exception

   Settings-triggered regenerations DO NOT count toward 5/week limit.

   Reasoning:
   - Settings changes are important (health, allergies, injury)
   - User shouldn't be penalized for updating profile
   - Separate counter: `manual_regenerations` (5/week) vs `settings_regenerations` (unlimited)

   UI:
   - Home tab shows: "4 manual regenerations left this week"
   - Settings shows: "Settings changes don't count toward limit"

8. API Endpoints

   ```
   PUT /api/settings/profile
   Request: {
     user_id,
     changes: [
       { field: 'dietary_restrictions', value: ['vegetarian', 'gluten_free'] },
       { field: 'workout_frequency', value: 4 }
     ]
   }
   Response: {
     requires_regeneration: true,
     impacts: { meals: true, workouts: true },
     days_affected: ['wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
     confirmation_message: "This will regenerate 15 meals and 3 workouts. Continue?"
   }

   POST /api/settings/regenerate
   Request: { user_id, confirm: true }
   Response: { new_meal_plan_id, new_workout_plan_id, backup_created: true }
   ```

9. Notification to User

   If user changes settings via Settings screen:
   - Show confirmation modal (as above)

   If user changes settings via onboarding flow (if we allow re-onboarding):
   - Auto-regenerate without confirmation
   - Show: "Your plan has been updated based on your new preferences"
```

**CRITICAL QUESTIONS FOR YOU:**

1. **Logged Days Preservation:**
   - Keep logged days unchanged? (Recommended)
   - Or regenerate everything? (Simpler but destructive)
   - **Recommendation: Keep logged days**

2. **Regeneration Limit:**
   - Settings changes don't count toward limit? (Recommended)
   - Or count toward limit? (Could frustrate users)
   - **Recommendation: Don't count (unlimited for settings)**

3. **24-Hour Backup:**
   - Keep backup for undo capability?
   - Or no backup (user must manually regenerate)?
   - **Recommendation: Yes, 24-hour backup (better UX)**

4. **Batch Changes:**
   - 30-second debounce for batching?
   - Or immediate confirmation for each change?
   - **Recommendation: 30-second debounce**

**DECISION NEEDED:** Approve logged-days preservation + unlimited settings regens approach?

---

#### **Q6: Regeneration Limit Hit Mid-Week** ❌ NO SPEC
**Priority:** 🔴 P0 - BLOCKS DEVELOPMENT
**Location:** Q2 Meal Planning, Q3.4 Weekly Planning
**Status:** Limit exists (5/week) but mid-week exhaustion not addressed

**Current Spec:**

From Q3.4 Weekly Planning:
> "**Anti-Churn Safeguard:**
> Maximum 5 regenerations per week for same plan.
> After 5th regen, 'Regenerate' button disabled with message:
> 'You've reached the maximum regenerations for this week. Your current plan is optimized for your goals!'"

**What's MISSING:**
- ❌ User hits limit on Wednesday, unhappy with plan, what can they do?
- ❌ Are individual meal swaps still allowed?
- ❌ Can user add custom meals?
- ❌ Is there an "emergency regeneration" option?
- ❌ Does limit reset at week boundary or rolling 7 days?

**CRITICAL DECISION NEEDED:**

```
Proposal: Post-Limit Flexibility Options

1. When Limit Reached (5/5 Used)

   ┌─────────────────────────────────────────┐
   │  Weekly Regeneration Limit Reached      │
   ├─────────────────────────────────────────┤
   │                                         │
   │  You've used all 5 regenerations        │
   │  this week.                             │
   │                                         │
   │  Limit resets: Monday 12:00 AM          │
   │  (3 days from now)                      │
   │                                         │
   │  You can still customize your plan:     │
   │                                         │
   │  ✓ Swap individual meals (unlimited)    │
   │  ✓ Add custom meals (unlimited)         │
   │  ✓ Add from saved items (unlimited)     │
   │  ✓ Edit meal details (unlimited)        │
   │                                         │
   │  [Got It]                               │
   └─────────────────────────────────────────┘

2. Alternative Actions (Unlimited)

   A. Swap Individual Meals
      - Quick Swap (from current week)
      - AI Generate (3 alternatives)
      - Does NOT count as regeneration
      - Can swap unlimited times

      UI: "Swap Meal" button still enabled
      (Only "Regenerate Full Week" disabled)

   B. Add Custom Meals
      - Manual entry form
      - User creates meal from scratch
      - Useful for user's own recipes
      - Replaces planned meal

      UI: [+ Add Custom Meal] button
      Opens form: Name, Calories, Protein, Carbs, Fat, Ingredients

   C. Add from Saved Items
      - Replace planned meal with favorite
      - No AI call needed (60% cost reduction)
      - Instant swap

      UI: [Add from Favorites] button
      Shows saved meals library

   D. Edit Meal Details
      - Adjust calories/macros manually
      - Useful for users who cook differently
      - Portion size adjustments

      UI: Meal Detail → [Edit] → Adjust fields

3. Emergency Regeneration Option

   Option A: Free Emergency Regen (1x per week)
   - After 5/5 limit, show:
     "[Emergency Regeneration] (1 left this week)"
   - Allows one additional regen beyond limit
   - Resets weekly like normal limit

   Pros: Graceful escape hatch, user-friendly
   Cons: Effectively makes it 6/week (inconsistent)

   Option B: Premium Unlimited Regens
   - Free users: 5/week limit
   - Premium users: Unlimited regenerations
   - Value prop for subscription upgrade

   Pros: Monetization opportunity
   Cons: Could frustrate free users

   Option C: No Emergency Option
   - Hard limit at 5/week
   - Force users to use swapping instead
   - Simplest, most consistent

   Pros: Prevents API abuse, encourages swapping
   Cons: Could frustrate users with legitimate needs

   **RECOMMENDATION: Option A (1 emergency/week) for MVP**

4. Limit Reset Logic

   Option A: Week Boundary Reset (Recommended)
   - Resets every Monday 12:00 AM (user's timezone)
   - Aligns with weekly plan generation
   - Simpler to understand ("resets every Monday")

   ```typescript
   function getRegenerationCount(user: User): number {
     const weekStart = getWeekStart(user.timezone); // Monday 12:00 AM
     return MealPlan.count({
       user_id: user.id,
       created_at: { gte: weekStart },
       source: 'regeneration' // Not 'initial' or 'settings_change'
     });
   }
   ```

   Option B: Rolling 7-Day Window
   - Resets 7 days from first regeneration
   - More flexible
   - Harder to explain ("resets 7 days after first regen")

   **RECOMMENDATION: Option A (Week boundary)**

5. UI Indicators

   Before Limit:
   - Home tab: "3 regenerations left this week"
   - Grocery screen: "Regenerate Plan (3 left)"

   At Limit:
   - Home tab: "Weekly regeneration limit reached. Resets Monday."
   - Grocery screen: "Regenerate Plan" button disabled (grayed out)
     + Tooltip: "Limit reached (5/5). Use swapping instead or wait until Monday."

   With Emergency Available:
   - Home tab: "5/5 used. [Emergency Regen] (1 left)"
   - Grocery screen: "[Emergency Regeneration] (1x per week)"

6. Database Schema

   ```typescript
   interface MealPlan {
     // ... existing fields
     source: 'initial' | 'regeneration' | 'settings_change' | 'emergency_regen';
     regeneration_count_at_creation: number; // Snapshot for analytics
   }

   interface User {
     // ... existing fields
     regenerations_this_week: number; // Cached count (resets Monday)
     emergency_regen_used_this_week: boolean; // Resets Monday
   }
   ```

7. Analytics Tracking

   Track:
   - How many users hit 5/5 limit?
   - What do they do after (swapping vs waiting)?
   - How often is emergency regen used?
   - User satisfaction after limit hit (survey?)

   Use data to adjust limit (maybe increase to 7/week if most users hit 5?)

8. API Endpoints

   ```
   GET /api/meal-plans/regeneration-status
   Response: {
     count: 5,
     limit: 5,
     emergency_available: true,
     resets_at: "2025-11-13T00:00:00Z",
     alternative_actions: [
       { action: 'swap_meal', available: true },
       { action: 'add_custom', available: true },
       { action: 'add_favorite', available: true }
     ]
   }

   POST /api/meal-plans/regenerate
   Request: { user_id, use_emergency: false }
   Response: {
     success: false,
     error: "REGENERATION_LIMIT_REACHED",
     message: "You've used all 5 regenerations this week",
     alternative_actions: [...]
   }

   POST /api/meal-plans/emergency-regenerate
   Request: { user_id, confirm: true }
   Response: {
     success: true,
     new_plan_id: "...",
     emergency_used: true,
     message: "Emergency regeneration used (1/1 this week)"
   }
   ```
```

**CRITICAL QUESTIONS FOR YOU:**

1. **Emergency Regeneration:**
   - Free 1x/week emergency regen? (Recommended)
   - Premium unlimited? (Monetization)
   - No emergency option? (Strict)
   - **Recommendation: 1 free emergency/week**

2. **Limit Reset:**
   - Week boundary (Monday 12 AM)? (Recommended)
   - Rolling 7-day window?
   - **Recommendation: Week boundary (simpler)**

3. **Alternative Actions:**
   - Are unlimited swaps acceptable? (After limit hit)
   - Should we cap swaps too? (e.g., 20/week)
   - **Recommendation: Unlimited swaps (no cap)**

4. **User Education:**
   - Show alternatives proactively? (Before limit hit)
   - Or only after limit reached?
   - **Recommendation: Show "4 left" as early warning**

**DECISION NEEDED:** Approve 1 emergency regen/week + unlimited swaps approach?

---

### 🟡 P1 IMPORTANT GAPS (5 Missing)

---

#### **Q9: Feedback Message Saturation** ❌ NO SPEC
**Priority:** 🟡 P1
**Location:** Q3.0 Navigation, Home Tab Feedback
**Status:** Feedback messages exist but no saturation handling

**Current Spec:**

From Q3.0 Home Tab:
> "**Over Calorie Target:**
> ⚠️ You exceeded your goal today. Try to stay within range tomorrow
> Background: #F05D5E at 10% opacity
>
> **Under Calorie Target (Below 70%):**
> ⚠️ You're under your goal. Make sure you're fueling your body!
> Background: #FFB347 at 10% opacity
>
> **Within Target Range:** No message shown (visual clutter reduction)"

**What's MISSING:**
- ❌ User consistently over target for 7 days straight - does warning show every single day?
- ❌ Can user dismiss permanently?
- ❌ Do messages adapt tone after repeated violations?
- ❌ Alert fatigue mitigation?

**RECOMMENDATION:**

```
Adaptive Messaging System

Day 1: ⚠️ "You exceeded your goal today. Try to stay within range tomorrow."
Day 2: ⚠️ "You exceeded your goal today. Try to stay within range tomorrow."
Day 3: ⚠️ "You've exceeded your goal 3 days in a row. Consider reviewing your meal plan."
       [Review Plan] [Dismiss for Week]

Day 4-6: (Message hidden if dismissed)

Day 7: ⚠️ "You've exceeded your goal all week. Would you like to adjust your target?"
       [Adjust Calorie Target] [Keep Current Plan]
       (Not dismissible)

After 7 days: Only show message 1x per week (not daily)

Dismissal Logic:
- [Dismiss for Week] button hides message until next Monday
- [Dismiss for 3 Days] option for mid-week breaks
- Cannot dismiss critical warnings (7+ days consecutive)

Implementation:
```typescript
interface FeedbackMessageState {
  user_id: string;
  message_type: 'over_calories' | 'under_calories';
  consecutive_days: number;
  dismissed_until?: Date;
  last_shown: Date;
}

function shouldShowMessage(user: User, dailySummary: DailySummary): boolean {
  const state = getFeedbackState(user.id);

  // Check dismissal
  if (state.dismissed_until && new Date() < state.dismissed_until) {
    return false;
  }

  // Adaptive frequency
  if (state.consecutive_days <= 2) {
    return true; // Show daily
  } else if (state.consecutive_days >= 3 && state.consecutive_days < 7) {
    return !state.dismissed_until; // Show unless dismissed
  } else {
    return daysSince(state.last_shown) >= 7; // Show weekly only
  }
}
```
```

---

#### **Q11: Grocery List Locking** ❌ NO SPEC
**Priority:** 🟡 P1
**Location:** Q3.4 Weekly Planning, Grocery List
**Status:** Checkboxes exist but interaction details missing

**Current Spec:**

From Q3.4 Grocery List:
> "Grocery List: Expandable section (collapsed by default). Tap to expand → Shows categorized ingredient list... Checkbox next to each (user can mark as purchased)."

**What's MISSING:**
- ❌ Can checked items be unchecked?
- ❌ Can user edit quantity/name of checked items?
- ❌ Are checked items visually distinct (strikethrough)?
- ❌ Do checked items persist or reset weekly?
- ❌ What happens if user swaps meal after checking off ingredients?

**RECOMMENDATION:**

```
Grocery List Editing Rules

Checked Items:
✓ Can be unchecked (toggle)
✓ Visual state: Strikethrough text + 50% opacity + light gray
✓ Persist within current week (reset on new week generation)
✓ Can still edit quantity/name even when checked
  (User bought 2 lbs instead of 1.5 lbs → update quantity)

Editing Flow:
- Tap checked item → Opens edit modal
- Can change: Quantity, Unit, Notes
- Cannot change: Item name (would break consolidation)
- [Save] updates item

Custom Items:
✓ [+ Add Custom Item] button always visible
✓ Custom items have "custom" badge
✓ Persist until manually deleted
✓ Not affected by meal swaps

Swapping Impact:
Scenario: User checks off "Chicken breast (1.5 lbs)"
          Then swaps meal that uses chicken

Flow:
- Swap happens
- Toast appears: "Grocery list updated (chicken removed)"
  [Undo Swap]
- Checked chicken item remains visible but grayed out
- Tooltip: "This item is no longer needed (meal was swapped)"
- User can uncheck to remove from list

Visual States:
- Unchecked: Black text, full opacity
- Checked: Strikethrough, 50% opacity, light gray
- Custom: Badge "Custom" in blue
- Orphaned (from swap): Badge "No longer needed" in orange + italic
```

---

#### **Q12: Weight Fluctuation Messaging** ❌ NO SPEC
**Priority:** 🟡 P1
**Location:** Q3.5 Progress Analytics, Weight Graph
**Status:** Graph shows trend but no fluctuation coaching

**Current Spec:**

From Q3.5 Weight Tracking:
> "Weight Graph: 30-day or 90-day range... Linear trend line overlaid (dashed, #4BAE90)... Above/below trend: Annotations with delta (e.g., '+0.8 lbs vs trend')"

**What's MISSING:**
- ❌ User gains 2 lbs in one week (water weight) - no reassurance
- ❌ Contextual messaging for normal daily variation
- ❌ Educational tooltip about fluctuation causes

**RECOMMENDATION:**

```
Smart Weight Fluctuation Coaching

Scenario: User gains 2 lbs in one week (but trend is still downward)

Weight Log Screen shows:
┌─────────────────────────────────────┐
│  Current Weight                     │
│  158 lbs (+2 lbs from last week)    │
│                                     │
│  Trend: -0.8 lbs/week               │
│  ✓ Still on track!                  │
│                                     │
│  💬 Weight Insight:                 │
│  Weight can fluctuate 2-5 lbs       │
│  daily due to water, food, and      │
│  hormones. Your overall trend is    │
│  still downward. Keep going! 💪     │
│                                     │
│  [Learn More About Fluctuations]    │
└─────────────────────────────────────┘

Tap [Learn More] → Educational Modal:
┌─────────────────────────────────────┐
│  Understanding Weight Fluctuations  │
├─────────────────────────────────────┤
│                                     │
│  Normal daily fluctuations:         │
│  • Water retention: ±2-4 lbs        │
│  • Food in digestive system: ±2 lbs │
│  • Menstrual cycle: ±3-5 lbs        │
│  • Sodium intake: ±2-3 lbs          │
│  • Exercise (inflammation): ±1-2 lbs│
│                                     │
│  What matters: Long-term trend      │
│  (not day-to-day changes)           │
│                                     │
│  [Got It]                           │
└─────────────────────────────────────┘

Triggers for Reassurance Messages:

1. Weight Gain < 3 lbs + Trend Still Downward
   → Reassure ("Weight can fluctuate, trend is good")

2. Weight Gain > 3 lbs + Trend Still Downward
   → Investigate ("Trend is good, but let's check adherence")
   → Show weekly summary: Meals logged, calories average

3. Weight Gain + Trend Reversed
   → Alert ("Trend has reversed, let's review your plan")
   → [Adjust Plan] [Review Logs] [Contact Support]

4. No Weight Change for 3+ Weeks (Plateau)
   → Suggest ("Weight hasn't changed. Time to adjust?")
   → [Reduce Calories by 100] [Keep Current Plan]

Implementation:
```typescript
function getWeightInsight(
  currentWeight: number,
  lastWeight: number,
  trendSlope: number,
  goal: 'lose' | 'gain' | 'maintain'
): WeightInsight {

  const delta = currentWeight - lastWeight;
  const absDelta = Math.abs(delta);

  // Losing weight but gained this week
  if (goal === 'lose' && delta > 0) {
    if (absDelta < 3 && trendSlope < 0) {
      return {
        type: 'reassurance',
        message: "Weight can fluctuate 2-5 lbs daily due to water, food, and hormones. Your overall trend is still downward. Keep going! 💪",
        action: 'learn_more'
      };
    } else if (absDelta >= 3 && trendSlope < 0) {
      return {
        type: 'investigate',
        message: "Your trend is good, but let's check your adherence this week.",
        action: 'review_adherence'
      };
    } else {
      return {
        type: 'alert',
        message: "Your weight trend has reversed. Let's review your plan together.",
        action: 'adjust_plan'
      };
    }
  }

  // ... similar logic for gain/maintain goals
}
```
```

---

#### **Q13: AI Insight Quality Control** ❌ NO SPEC
**Priority:** 🟡 P1
**Location:** Q3.5 Progress Analytics, AI Insights
**Status:** Generation exists but no quality validation

**Current Spec:**

From Q3.5 AI Insights:
> "OpenAI API: Model GPT-4o-mini, Max tokens 100, Temperature 0.7... Prompt Template: 'You are a wellness coach analyzing user's fitness app data...'"
>
> "Error Handling: API Timeout → Fallback: 'Keep up the great work! We're analyzing your data...' Invalid Response → Parse error → Show generic motivational message"

**What's MISSING:**
- ❌ Validation that insight is relevant (not hallucinated)
- ❌ Fact-checking against user's actual data
- ❌ Sentiment analysis (ensure positive/motivating)
- ❌ Inappropriate content filtering

**RECOMMENDATION:**

```
AI Insight Quality Pipeline

1. Generation (GPT-4o-mini)
   Input: User's actual data (weight, logs, adherence)
   Output: Insight text (max 100 tokens)

2. Validation Layer (Pre-Display)

   Step 1: Sentiment Analysis
   - Use: sentiment-analysis library or GPT-4o-mini
   - Check: Sentiment is positive or neutral (block negative)
   - Threshold: Sentiment score > 0.3 (on -1 to +1 scale)

   ```typescript
   const sentiment = analyzeSentiment(insightText);
   if (sentiment < 0.3) {
     logToSentry('Negative AI insight blocked', { insightText, sentiment });
     return FALLBACK_MESSAGE;
   }
   ```

   Step 2: Fact Check Numbers
   - Extract numbers from insight (regex: /\d+(\.\d+)?/)
   - Validate against user's actual data

   ```typescript
   const extractedNumbers = insightText.match(/\d+(\.\d+)?/g);
   const userActualWeight = user.getCurrentWeight();
   const userWeightLoss = user.getTotalWeightLoss();

   // Check if insight mentions weight numbers
   if (insightText.includes('lost') && extractedNumbers) {
     const mentionedLoss = parseFloat(extractedNumbers[0]);
     if (Math.abs(mentionedLoss - userWeightLoss) > 2) {
       // Insight is hallucinating (off by >2 lbs)
       logToSentry('AI insight fact check failed', {
         mentioned: mentionedLoss,
         actual: userWeightLoss
       });
       return FALLBACK_MESSAGE;
     }
   }
   ```

   Step 3: Hallucination Detection
   - Check for mentions of workouts user didn't log
   - Check for mentions of meals not in their plan

   ```typescript
   const mentionsWorkout = insightText.match(/\b(ran|lifted|exercised|workout)\b/i);
   const userLoggedWorkouts = user.getWorkoutsThisWeek();

   if (mentionsWorkout && userLoggedWorkouts.length === 0) {
     // Insight mentions workouts user didn't do
     logToSentry('AI insight hallucination detected', { insightText });
     return FALLBACK_MESSAGE;
   }
   ```

   Step 4: Profanity/Inappropriate Filter
   - Use: bad-words library or OpenAI Moderation API
   - Block if flagged as inappropriate

   ```typescript
   const moderation = await openai.moderations.create({ input: insightText });
   if (moderation.results[0].flagged) {
     logToSentry('Inappropriate AI insight blocked', { insightText });
     return FALLBACK_MESSAGE;
   }
   ```

   Step 5: Length Check
   - Min: 10 tokens (not too short like "Good job!")
   - Max: 100 tokens (already enforced by GPT-4o-mini)

   ```typescript
   const tokenCount = insightText.split(/\s+/).length;
   if (tokenCount < 10) {
     return FALLBACK_MESSAGE; // Too generic
   }
   ```

3. Fallback Messages (If Validation Fails)

   Tier 1: Generic Positive
   "You're making great progress! Keep up the excellent work."

   Tier 2: Data-Driven Template
   Templates with actual data:
   - "You logged {meal_count} meals this week. {adherence_rate}% adherence!"
   - "Your weight is down {weight_loss} lbs. {weeks_to_goal} weeks to goal!"
   - "You completed {workout_count} workouts this week. Strong effort!"

   ```typescript
   const FALLBACK_TEMPLATES = [
     (user) => `You logged ${user.mealsThisWeek} meals this week. ${user.adherenceRate}% adherence!`,
     (user) => `You're down ${user.totalWeightLoss} lbs. ${user.weeksToGoal} weeks to goal!`,
     (user) => `${user.workoutsThisWeek} workouts completed this week. Great job!`,
   ];

   function getFallback(user: User): string {
     const template = FALLBACK_TEMPLATES[Math.floor(Math.random() * FALLBACK_TEMPLATES.length)];
     return template(user);
   }
   ```

4. Human Review (Optional for MVP, Recommended for V1)

   - Log all generated insights to database
   - Weekly review of sample insights (10-20 per week)
   - Build blocklist of bad patterns
   - Improve prompts based on failures

   ```typescript
   interface AIInsightLog {
     id: string;
     user_id: string;
     generated_text: string;
     validation_passed: boolean;
     validation_failures?: string[]; // ['sentiment_negative', 'fact_check_failed']
     shown_to_user: boolean;
     fallback_used?: boolean;
     created_at: Date;
   }
   ```

5. Prompt Engineering Improvements

   Add constraints to prompt:
   ```
   "You are a wellness coach analyzing user's fitness app data.

   RULES:
   - Be positive and encouraging (never negative or discouraging)
   - Only mention facts from the provided data (no assumptions)
   - Keep it concise (2-3 sentences max)
   - Focus on progress, not setbacks
   - If no significant progress, focus on effort and consistency

   USER DATA:
   - Weight: {current_weight} lbs (started at {start_weight} lbs)
   - Total weight loss: {weight_loss} lbs
   - Meals logged this week: {meals_logged}
   - Workouts completed this week: {workouts_completed}
   - Current streak: {streak_days} days

   Generate a personalized insight for this user:"
   ```

6. A/B Testing

   Test:
   - AI insights vs data-driven templates
   - Different prompt styles (coach vs friend vs data-focused)
   - Measure: User engagement, satisfaction, retention
```

---

#### **Q14: Sync Queue Visibility** ❌ NO SPEC
**Priority:** 🟡 P1
**Location:** Q3.7 Offline Sync
**Status:** Backend queue fully designed but no user-facing UI

**Current Spec:**

From Q3.7 Sync Queue:
> "interface SyncQueueItem { id, action_type, resource_type, payload, created_at, retry_count, priority, status: 'pending' | 'syncing' | 'failed' | 'synced', depends_on }"
>
> "Queue Processing: FIFO order within each priority level... Retry logic: Exponential backoff (1s, 2s, 4s, 8s, 16s)..."

**What's MISSING:**
- ❌ User-facing UI to view pending items
- ❌ Visual indicator of "3 items waiting to sync"
- ❌ Ability to cancel queued actions
- ❌ Sync status badge/icon
- ❌ Failed item notification

**RECOMMENDATION:**

```
Sync Queue UI (Settings → Sync Status)

Location: Settings → Advanced → Sync Status

1. Normal State (All Synced)
   ┌─────────────────────────────────┐
   │  Sync Status                    │
   ├─────────────────────────────────┤
   │  ✓ All data synced              │
   │                                 │
   │  Last sync: 2 minutes ago       │
   │                                 │
   │  [Sync Now]                     │
   └─────────────────────────────────┘

2. Pending State (Items Queued, Online)
   ┌─────────────────────────────────┐
   │  Sync Status                    │
   ├─────────────────────────────────┤
   │  ⏳ 3 items waiting to sync     │
   │                                 │
   │  ▫️ 2 logged meals (today)      │
   │  ▫️ 1 weight entry (today)      │
   │                                 │
   │  Last sync: 12 minutes ago      │
   │                                 │
   │  [Sync Now] (processing...)     │
   └─────────────────────────────────┘

3. Offline State (Items Queued, No Network)
   ┌─────────────────────────────────┐
   │  Sync Status                    │
   ├─────────────────────────────────┤
   │  📴 Offline - 5 items queued    │
   │                                 │
   │  ▫️ 3 logged meals              │
   │  ▫️ 1 logged workout            │
   │  ▫️ 1 weight entry              │
   │                                 │
   │  Will sync when reconnected     │
   │                                 │
   │  [Retry] (disabled)             │
   └─────────────────────────────────┘

4. Failed State (Errors)
   ┌─────────────────────────────────┐
   │  Sync Status                    │
   ├─────────────────────────────────┤
   │  ⚠️ 2 items failed to sync      │
   │                                 │
   │  ▫️ Meal log (Monday lunch)     │
   │     Error: Server error (500)   │
   │     [Retry] [Delete]            │
   │                                 │
   │  ▫️ Weight entry (Tuesday)      │
   │     Error: Conflict detected    │
   │     [View Conflict] [Delete]    │
   │                                 │
   │  Last sync: 1 hour ago          │
   └─────────────────────────────────┘

Visual Indicators (Throughout App):

1. Settings Tab Badge
   - Badge number shows pending/failed count
   - Example: "Settings (3)" if 3 items queued

2. Home Tab Icon (Top-Right)
   - Syncing: Animated sync icon (rotating)
   - Pending: Small orange dot
   - Failed: Red exclamation mark
   - Synced: No icon (clean)

3. Toast on Reconnection
   ┌─────────────────────────────────┐
   │  ✓ Back online                  │
   │  Syncing 5 items...             │
   └─────────────────────────────────┘

   After sync completes:
   ┌─────────────────────────────────┐
   │  ✓ All data synced              │
   └─────────────────────────────────┘

4. Persistent Banner (If Failures)
   Home tab top banner:
   ┌─────────────────────────────────┐
   │  ⚠️ 2 items failed to sync      │
   │  [View] [Dismiss]               │
   └─────────────────────────────────┘

Detailed View (Tap Item in Failed List):

┌─────────────────────────────────────┐
│  Sync Error Details                 │
├─────────────────────────────────────┤
│                                     │
│  Item: Meal log (Monday lunch)      │
│  Type: Logged meal                  │
│  Created: Mon 12:45 PM              │
│                                     │
│  Error: Server error (500)          │
│  Retries: 5 of 5                    │
│  Last attempt: 1 hour ago           │
│                                     │
│  Data:                              │
│  • Grilled Chicken Caesar Salad     │
│  • 520 calories                     │
│  • Protein: 41g, Carbs: 28g, Fat: 24g│
│                                     │
│  [Retry Sync]                       │
│  [Delete from Queue]                │
│  [Contact Support]                  │
│                                     │
└─────────────────────────────────────┘

User Actions:

1. Manual Sync
   - Tap [Sync Now] button
   - Shows progress: "Syncing... (2 of 5)"
   - Toast on completion

2. Retry Failed Item
   - Tap [Retry] on specific item
   - Exponential backoff resets
   - Max 5 retries total

3. Delete Failed Item
   - Confirmation modal: "Delete this item from sync queue? This cannot be undone."
   - [Cancel] [Delete]
   - Removes from queue (data lost)

4. View Conflict (for 409 errors)
   - Opens conflict resolution screen
   - Shows: Local version vs Server version
   - [Keep Mine] [Keep Server's] [Merge]

Advanced Features (Optional for MVP):

1. Sync History Log
   - Last 50 sync operations
   - Timestamp, item count, duration, success/fail

2. Manual Queue Management
   - Pause/Resume sync
   - Clear all queued items (with confirmation)
   - Prioritize specific items

3. Debug Mode (for power users)
   - Show raw JSON payloads
   - Export sync logs
   - Copy error details

Implementation:

```typescript
// API Endpoint
GET /api/sync/status
Response: {
  status: 'syncing' | 'pending' | 'failed' | 'synced',
  queue_count: 3,
  items: [
    {
      id: '...',
      type: 'logged_meal',
      description: '2 logged meals (today)',
      status: 'pending',
      created_at: '...',
      retry_count: 0,
      error?: null
    }
  ],
  last_sync_at: '...',
  next_sync_at: '...'
}

// Component
function SyncStatusScreen() {
  const { data, refetch } = useQuery('/api/sync/status');

  return (
    <Screen>
      <StatusIndicator status={data.status} />
      <ItemList items={data.items} />
      <SyncButton onPress={refetch} />
    </Screen>
  );
}
```
```

---

### 🟢 P2 EDGE CASE GAPS (2 Missing)

---

#### **Q15: Achievement Revocation** ❌ NO SPEC
**Priority:** 🟢 P2
**Location:** Q3.5 Progress Analytics, Achievements
**Status:** Unlock logic exists but no revocation policy

**Current Spec:**

From Q3.5 Achievements:
> "Achievement Unlock Logic: checkAchievementUnlock(user, achievement)... case 'weight_lost_lbs': userMetric = Math.abs(currentWeight - startWeight)"
>
> "Unlock Evaluation: Checked after every significant user action... Background job runs nightly to check milestone achievements"

**What's MISSING:**
- ❌ Once unlocked, does achievement stay unlocked forever?
- ❌ Or does it lock again if user regresses (gains weight back)?

**RECOMMENDATION:**

```
Achievement Permanence Policy

Rule: Once unlocked, always unlocked (industry standard)

Reasoning:
✓ Positive psychology (celebrate wins, don't punish setbacks)
✓ Simpler logic (no re-locking code)
✓ User motivation (badges are proud moments)
✓ Encourages continued effort (protect wins, strive for more)

Example:
- User unlocks "Lost 10 lbs" at Week 8 (160→150 lbs)
- Gains 5 lbs back at Week 12 (150→155 lbs)
- Badge stays unlocked (they did achieve it once)
- User can see their best achievement as motivation to get back

Edge Case: "Streak Master" (30-day streak)
- If streak breaks, achievement stays unlocked
- Can unlock AGAIN when hitting 30 days again
- Multiple unlocks allowed (shows dedication)

Edge Case: "Consistency Champion" (logged 90% adherence for 4 weeks)
- If adherence drops below 90% later, achievement stays
- Can unlock multiple times (quarterly, annually)

Implementation:
- No revocation logic needed
- Achievements table has `unlocked_at` timestamp only
- Once written, never deleted
- Simplifies MVP development

Database:
```typescript
interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: Date; // First time unlocked
  unlocked_count: number; // How many times unlocked (default: 1)
}

// Multiple unlocks for repeatable achievements
function unlockAchievement(user: User, achievement: Achievement) {
  const existing = UserAchievement.findOne({ user_id, achievement_id });

  if (existing && achievement.repeatable) {
    // Increment count
    existing.unlocked_count++;
    existing.save();
  } else if (!existing) {
    // First time unlock
    UserAchievement.create({
      user_id: user.id,
      achievement_id: achievement.id,
      unlocked_at: new Date(),
      unlocked_count: 1
    });
  }
  // If exists and not repeatable → do nothing (already unlocked)
}
```
```

---

#### **Q16: Calorie Extreme Validation** ❌ NO SPEC
**Priority:** 🟢 P2
**Location:** Q3.2 AI Logging, Manual Entry
**Status:** No validation bounds specified

**Current Spec:**

From Q3.2 Manual Entry:
> "Edit Details Button: Tap → Opens manual adjustment screen: Name, Calories [520], Protein [41]..."

**What's MISSING:**
- ❌ Min/max calorie bounds (prevent 10,000 cal typo)
- ❌ Warning for extremely high values (2000+ for single item)
- ❌ Validation that macros match calories (4 cal/g protein/carbs, 9 cal/g fat)
- ❌ Typo detection (did you mean 520 instead of 5200?)

**RECOMMENDATION:**

```
Input Validation Rules

1. Calories (per meal)
   - Min: 1 cal
   - Max: 5,000 cal
   - Warning threshold: 1,500 cal

   Validation:
   ```typescript
   function validateCalories(calories: number): ValidationResult {
     if (calories < 1) {
       return {
         valid: false,
         error: "Calories must be at least 1"
       };
     }

     if (calories > 5000) {
       return {
         valid: false,
         error: "Calories cannot exceed 5,000 per meal"
       };
     }

     if (calories > 1500) {
       return {
         valid: true,
         warning: "This seems high for one meal. Is this correct?",
         confirmMessage: "Are you sure this meal is {calories} calories?"
       };
     }

     return { valid: true };
   }
   ```

2. Macros Validation
   - Protein: 0-500g per meal
   - Carbs: 0-500g per meal
   - Fat: 0-300g per meal

   Cross-check with calories:
   ```typescript
   function validateMacros(
     protein_g: number,
     carbs_g: number,
     fat_g: number,
     stated_calories: number
   ): ValidationResult {

     // Calculate calories from macros
     const calculated_calories = (protein_g * 4) + (carbs_g * 4) + (fat_g * 9);

     // Allow ±10% variance
     const variance = Math.abs(calculated_calories - stated_calories) / stated_calories;

     if (variance > 0.1) {
       return {
         valid: false,
         error: `Macros don't match calories. Expected ~${Math.round(calculated_calories)} cal but entered ${stated_calories} cal. Please review.`
       };
     }

     return { valid: true };
   }
   ```

3. Typo Detection
   - If user enters 5200 cal (>3× typical meal):
     → "Did you mean 520 calories?"
     [Yes, 520] [No, 5200 is correct]

   ```typescript
   function detectTypo(calories: number): string | null {
     const typical_range = { min: 100, max: 1200 };

     if (calories > typical_range.max * 3) {
       // Check if dropping last digit makes sense
       const without_last_digit = Math.floor(calories / 10);

       if (without_last_digit >= typical_range.min &&
           without_last_digit <= typical_range.max) {
         return `Did you mean ${without_last_digit} calories?`;
       }
     }

     return null;
   }
   ```

4. UI Flow

   Manual Entry Form:

   Calories: [520]
   Protein: [41]g
   Carbs: [28]g
   Fat: [24]g

   [Calculate Macros] button
   - Auto-fills macros based on calories + meal type
   - Example: 520 cal breakfast → 30% protein, 45% carbs, 25% fat

   Validation on [Save]:
   1. Check calories range (1-5000)
   2. Check macros range (0-500g)
   3. Cross-check macros vs calories (±10%)
   4. Detect typos (3× typical)
   5. Show warnings if needed

   Warning Modal (if calories > 1500):
   ┌─────────────────────────────────┐
   │  High Calorie Entry             │
   ├─────────────────────────────────┤
   │  You entered 2,200 calories     │
   │  for this meal.                 │
   │                                 │
   │  Is this correct?               │
   │                                 │
   │  [Yes, Continue] [Edit]         │
   └─────────────────────────────────┘

5. Implementation

   Client-side + Server-side validation:

   ```typescript
   // Client (immediate feedback)
   const [calories, setCalories] = useState(0);
   const [error, setError] = useState('');

   useEffect(() => {
     const result = validateCalories(calories);
     if (!result.valid) {
       setError(result.error);
     } else {
       setError('');
     }
   }, [calories]);

   // Server (final enforcement)
   app.post('/api/meals/log', (req, res) => {
     const { calories, protein_g, carbs_g, fat_g } = req.body;

     const calorieValidation = validateCalories(calories);
     if (!calorieValidation.valid) {
       return res.status(400).json({ error: calorieValidation.error });
     }

     const macroValidation = validateMacros(protein_g, carbs_g, fat_g, calories);
     if (!macroValidation.valid) {
       return res.status(400).json({ error: macroValidation.error });
     }

     // Proceed with logging
   });
   ```
```

---

## 📊 PART 4: SUMMARY & NEXT STEPS

### Gap Analysis Results

| Category | Total | Solved | Partial | Missing | % Complete |
|---|---|---|---|---|---|
| P0 Critical | 7 | 1 (14%) | 2 (29%) | 4 (57%) | 43% |
| P1 Important | 7 | 0 (0%) | 2 (29%) | 5 (71%) | 29% |
| P2 Edge Cases | 4 | 2 (50%) | 0 (0%) | 2 (50%) | 50% |
| **TOTAL** | **18** | **3 (17%)** | **4 (22%)** | **11 (61%)** | **39%** |

**Critical Path (Must Resolve Before Dev Starts):**

🔴 **P0 Blockers (6 gaps):**
1. ❌ Q1: Onboarding AI Failure → Need fallback strategy (template plans?)
2. ❌ Q2: Maintain Goal 5% Variance UX → Need notification flow (2 consecutive trigger?)
3. ⚠️ Q3: Swap Undo After Logging → Need data integrity rules (disable undo?)
4. ❌ Q4: Settings Regen Behavior → Need smart regeneration logic (preserve logged days?)
5. ⚠️ Q5: Swap with No Matches → Need zero-result fallback (manual entry option?)
6. ❌ Q6: Regen Limit Mid-Week → Need alternative options (1 emergency/week?)

🟡 **P1 Important (7 gaps):**
7. ⚠️ Q8: Streak Grace Period → Design decision (1 grace day/week?)
8. ❌ Q9: Feedback Saturation → Need adaptive messaging (weekly after 7 days?)
9. ⚠️ Q10: Workout Swap Type → Need validation rules (enforce same-type?)
10. ❌ Q11: Grocery List Locking → Need interaction spec (allow editing checked?)
11. ❌ Q12: Weight Fluctuation Messaging → Need reassurance strategy (contextual insights?)
12. ❌ Q13: AI Insight Quality → Need validation pipeline (sentiment + fact-check?)
13. ❌ Q14: Sync Queue Visibility → Need UI design (Settings → Sync Status?)

🟢 **P2 Edge Cases (2 gaps):**
14. ❌ Q15: Achievement Revocation → Simple policy (never revoke?)
15. ❌ Q16: Calorie Validation → Need bounds + warnings (1-5000 cal, warn >1500?)

---

### 🎯 IMMEDIATE DECISIONS NEEDED (Top 6 P0)

For each critical gap, I've provided 2-3 options with recommendations. **We need your decisions on:**

1. **Q1: Onboarding AI Failure**
   - ✅ **Recommended:** Template fallback (3 pre-built plans per goal, scale to user's calories)
   - ❓ **Question:** Is template plan acceptable for MVP? Or should we block onboarding if AI fails?

2. **Q2: Maintain Goal 5% Variance**
   - ✅ **Recommended:** 2 consecutive weigh-ins trigger + persistent banner if ignored 2+ weeks
   - ❓ **Question:** Immediate trigger or sustained (2 consecutive)? Persistent banner approach OK?

3. **Q3: Swap Undo After Logging**
   - ✅ **Recommended:** Disable undo once logged (Option A - safest for MVP)
   - ❓ **Question:** Or allow undo with log deletion (requires confirmation modal)?

4. **Q4: Settings Regen Behavior**
   - ✅ **Recommended:** Preserve logged days, regenerate future days only, unlimited (doesn't count toward limit)
   - ❓ **Question:** Approve logged-days preservation + 24hr backup for undo?

5. **Q5: Swap with No Matches**
   - ✅ **Recommended:** Show modal with 3 options: Create Custom / Relax Restrictions / Keep Current
   - ❓ **Question:** Approve comprehensive fallback flow?

6. **Q6: Regen Limit Mid-Week**
   - ✅ **Recommended:** 1 free emergency regen/week + unlimited swaps
   - ❓ **Question:** Approve emergency regen approach? Or hard limit at 5?

---

### 📋 NEXT SESSION PLAN

**After you provide decisions:**

1. **Update Affected Planning Specs:**
   - Q1 Onboarding (add AI failure handling)
   - Q2 Meal Planning (add 5% variance UX for maintain goal)
   - Q3.1 Settings (add smart regeneration flow)
   - Q3.3 Swapping (add undo rules + zero-result fallback)
   - Q3.4 Weekly Planning (add post-limit options)
   - Q3.5 Progress (add streak grace, weight messaging, AI quality)
   - Q3.7 Offline (add sync queue UI)

2. **Update Implementation Documents:**
   - DATABASE_SCHEMA.md (add tables: MaintenanceAlert, PlanBackup, AIInsightLog, FeedbackMessageState)
   - API_SPECIFICATION.md (add endpoints for new flows)
   - IMPLEMENTATION_PLAN.md (add new features to build phases)

3. **Complete Session 23:**
   - Final pre-development review
   - Comprehensive audit of all 10 implementation documents
   - Cross-document consistency verification
   - Readiness checklist (60-90 min)
   - Go/No-Go decision for development start

4. **Ready for Development (Session 24+):**
   - All gaps resolved ✅
   - All specs production-ready ✅
   - Begin Phase 1: Foundation (Backend + Mobile setup)

---

## 🤝 YOUR ACTION ITEMS

**Please review the 6 P0 critical gaps and provide decisions:**

1. **Onboarding AI Failure:** Template fallback OK? Or block onboarding?
2. **Maintain 5% Variance:** 2 consecutive trigger + persistent banner?
3. **Swap Undo After Logging:** Disable undo once logged?
4. **Settings Regen:** Preserve logged days + unlimited regens?
5. **Swap No Matches:** Approve comprehensive fallback flow?
6. **Regen Limit Mid-Week:** 1 emergency regen/week + unlimited swaps?

**Format for responses:**
- "Approve all recommendations" = I'll proceed with all ✅ recommendations
- Or specify individual changes: "Q1: Use Option B instead, Q2-Q6: Approve"

Once I have your decisions, I'll update all affected specs and complete Session 23 final review.

---

**Session Status:** 📋 Review Complete, Awaiting User Decisions
**Next:** User provides decisions → Update specs → Session 23 Final Audit → Development Ready! 🚀

---

**Document Version:** 1.0
**Created:** 2025-11-10
**Last Updated:** 2025-11-10
**Status:** Active - Awaiting User Decisions
**Estimated Time to Resolution:** 30-60 minutes (after decisions provided)
