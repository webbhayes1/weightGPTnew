# Edge Case Verification Matrix - Session 23

**Date:** 2025-11-10
**Purpose:** Systematic verification that all 95 CHECK/CONCERN/CRITICAL GAP items from Pre-Session 23 handoff are addressed

**Status Legend:**
- ✅ ADDRESSED: Covered in specs or gap resolutions
- ⚠️ PARTIAL: Covered but needs expansion/clarification
- ❌ MISSING: Not addressed, needs resolution
- 📝 DESIGN: Design choice, not a spec issue
- 🔗 DELEGATED: Covered by formal gap resolution (Q1-Q15)

---

## Summary

Total Items: 95
- ✅ Addressed: TBD
- ⚠️ Partial: TBD
- ❌ Missing: TBD
- 📝 Design Choices: TBD
- 🔗 Delegated to Gap Resolutions: TBD

---

## Journey 1: New User → First Week (Weight Loss) - 34 items

### Onboarding (Steps 1-3)

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 1 | 61 | CHECK | BMR calculation (Mifflin-St Jeor formula) | | | |
| 2 | 62 | CHECK | Timeline validation (15 weeks = 1 lb/week, SAFE) | | | |
| 3 | 63 | CONCERN | What if enters 4 weeks? (3.75 lbs/week, UNSAFE) | | | |

### Onboarding (Steps 4-8)

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 4 | 66 | CHECK | TDEE calculation with sedentary multiplier | | | |
| 5 | 67 | CHECK | Calorie deficit calculation (500 cal/day for 1 lb/week) | | | |
| 6 | 68 | CHECK | Macro calculation (protein 0.8-1g/lb, 30% fat, rest carbs) | | | |
| 7 | 69 | CONCERN | What if calculated calories < 1200 (female min)? | | | |

### Onboarding (Steps 9-11)

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 8 | 73 | CHECK | Meal pattern affects meal generation (14 vs 28 meals) | | | |
| 9 | 74 | CONCERN | What if workout days conflict with 48hr muscle rule? | | | |

### Onboarding (Steps 12-17)

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 10 | 80 | CHECK | All 3 AI calls succeed (OpenAI GPT-4o-mini) | | | |
| 11 | 81 | CRITICAL | OpenAI API fails/times out during onboarding | 🔗 | Gap 1 | Delegated to Q1 resolution |
| 12 | 82 | CHECK | Value demo shows weight graph projection | | | |
| 13 | 83 | CHECK | Paywall appears AFTER value demo | | | |

### Week 1, Day 1 (Monday) - First Experience

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 14 | 87 | CHECK | Progress circles show 0/target (empty state) | | | |
| 15 | 88 | CHECK | Day selector on Monday | | | |
| 16 | 89 | CHECK | Meal cards show 3 meals for Monday, unchecked | | | |
| 17 | 90 | CHECK | Tapping meal opens Meal Detail screen | | | |
| 18 | 91 | CONCERN | Does user understand they need to LOG meals? | | | |

### First Meal Log - Breakfast

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 19 | 95 | CHECK | Checkbox animates, card tints green, "Logged" badge | | | |
| 20 | 96 | CHECK | Calorie ring starts filling (liquid animation) | | | |
| 21 | 97 | CHECK | Calorie number counts up (350/1650) | | | |
| 22 | 98 | CHECK | Macro rings update (protein/carbs/fat) | | | |
| 23 | 99 | CHECK | LoggedEntry created with type='meal', source='planned' | | | |
| 24 | 100 | CONCERN | User accidentally taps twice (logs, unlogs, logs) | | | |
| 25 | 101 | CONCERN | Log breakfast at 2pm? (Does timestamp matter?) | | | |

### First Meal Swap - Lunch

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 26 | 106 | CHECK | Swap modal opens with 2 tabs: "This Week" + "AI Generate" | | | |
| 27 | 108 | CHECK | Shows alternatives matching lunch + calories ±50 + protein ±5g | | | |
| 28 | 111 | CHECK | Meal swaps instantly, new macro totals calculated | | | |
| 29 | 112 | CHECK | Daily totals still within ±10% target | | | |
| 30 | 113 | CHECK | Old meal not lost (can swap back via Undo toast) | | | |
| 31 | 114 | CRITICAL | User swaps, logs, then swaps again? Data integrity? | | | **USER'S SPECIFIC QUESTION** |

### First Workout Log - Monday Evening

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 32 | 118 | CHECK | Segmented time circle shows 0/45 min (empty state) | | | |
| 33 | 119 | CHECK | "Upper Body Strength" workout card for Monday | | | |
| 34 | 121 | CHECK | Time segment fills (blue gradient) | | | |
| 35 | 122 | CHECK | Calorie burn arc shows ~250 cal | | | |
| 36 | 123 | CONCERN | Don't actually do workout but check it? (Honor system) | | | |

### End of Day 1

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 37 | 127 | CHECK | DailySummary created with accurate totals | | | |
| 38 | 128 | CHECK | Streak starts (streak_current = 1) | | | |
| 39 | 129 | CHECK | Weight graph shows "Log weight to see progress" | | | |

### Week 1 Mid-Week Experience

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 40 | 132 | CHECK | Can navigate days with swipe gesture | | | |
| 41 | 133 | CHECK | Can swap any meal/workout | | | |
| 42 | 134 | CHECK | Can log weight anytime (Log tab → Weight) | | | |
| 43 | 135 | CHECK | Sunday: Push notification "Time to plan next week!" | | | |

### Week 1 End - Weekly Regeneration

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 44 | 140 | CHECK | Can select up to 3 favorite meals | | | |
| 45 | 141 | CHECK | AI generates 14 new meals (keeping 3 favorites) | | | |
| 46 | 142 | CHECK | Learns from feedback (thumbs down on fish = fewer fish) | | | |
| 47 | 143 | CONCERN | User DOESN'T regenerate? Keep Week 1 plan forever? | | | |
| 48 | 144 | CRITICAL | Regenerate 6 times in one day? (Limit = 5/week) | 🔗 | Gap 6 | Delegated to Q6 resolution |

---

## Journey 2: Mid-Journey Momentum (Week 5) - 11 items

### Week 5 - Continued Progress

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 49 | 164 | CHECK | Weight graph shows 4 data points (160→159→158→157→156) | | | |
| 50 | 165 | CHECK | Trend line shows linear regression (downward slope) | | | |
| 51 | 166 | CHECK | "On Track" badge (green) | | | |
| 52 | 167 | CHECK | Weekly summary: "Lost 1 lb this week" with comparison | | | |

### AI Learning - Feedback Refinement

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 53 | 172 | CHECK | Next week's plan has fewer chicken meals | | | |
| 54 | 173 | CHECK | AI prompt uses feedback: "User dislikes chicken breast" | | | |
| 55 | 174 | CONCERN | Thumbs-down 80% of meals? (AI has no good options) | 🔗 | Gap 9 | Feedback saturation |

### Favorites Feature

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 56 | 179 | CHECK | Modal shows: "Add or Replace?" | | | |
| 57 | 181 | CHECK | Saved meal replaces planned lunch | | | |
| 58 | 182 | CHECK | Macros recalculated | | | |
| 59 | 183 | CHECK | No AI call needed (60% cost reduction works) | | | |
| 60 | 184 | CONCERN | Replacing breaks daily totals? (±10% rule violated?) | | | |

### Achievement Unlock

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 61 | 187 | CHECK | Streak counter shows 28 days (4 weeks) | | | |
| 62 | 188 | CHECK | Achievement unlocked: "4-Week Warrior" badge | | | |
| 63 | 189 | CHECK | Achievement modal with celebration animation | | | |

---

## Journey 3: Gain Weight User - 8 items

### Onboarding - Weight Gain Goal

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 64 | 208 | CHECK | Timeline validation (1 lb/week gain, SAFE) | | | |
| 65 | 209 | CHECK | Calorie SURPLUS calculation (+500 cal/day) | | | |
| 66 | 210 | CHECK | High protein target (1.2-1.5g/lb for muscle gain) | | | |
| 67 | 211 | CONCERN | Calculated calories > 4000? (Very high, feasible?) | | | |

### Meal Planning - 4 Meals/Day

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 68 | 215 | CHECK | Meal plan generates 28 meals (7 days × 4 meals) | | | |
| 69 | 216 | CHECK | Calorie distribution: 30% / 35% / 30% / 5% | | | |
| 70 | 217 | CONCERN | Snack calorie validation correct? (50-400 cal for bulking?) | | | |

### Progress Tracking - Protein Focus

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 71 | 221 | CHECK | Protein ring shows progress (green) | | | |
| 72 | 222 | CHECK | If under target by evening, suggest high-protein snack? | | | |
| 73 | 223 | CRITICAL | Do we have "falling short" nudges? Or just passive display? | ❌ | | **NEEDS VERIFICATION** |

### Workout Split - Strength Focus

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 74 | 227 | CHECK | Workout split: Upper/Lower/Upper/Lower | | | |
| 75 | 228 | CHECK | 48hr minimum between muscle groups | | | |

---

## Journey 4: Maintenance Goal User - 6 items

### Onboarding - Maintain Weight

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 76 | 247 | CHECK | Goal weight = Current weight (135 lbs) | | | |
| 77 | 248 | CHECK | Timeline & Goal Weight screens SKIPPED (per Q1 v3.1) | | | |
| 78 | 249 | CHECK | Calories = TDEE (no surplus/deficit) | | | |
| 79 | 250 | CRITICAL | 5% variance threshold set (135 ± 6.75 lbs)? | 🔗 | Gap 2 | Delegated to Q2 resolution |

### Week 3 - Weight Variance

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 80 | 254 | CHECK | Graph shows data point | | | |
| 81 | 255 | CHECK | No warning yet (within threshold) | | | |

### Week 5 - Exceeds 5% Threshold

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 82 | 259 | CRITICAL | App shows notification: "Exceeded 5% maintenance range"? | 🔗 | Gap 2 | Delegated to Q2 resolution |
| 83 | 260 | CRITICAL | Offers to adjust plan? (Suggest calorie deficit?) | 🔗 | Gap 2 | Delegated to Q2 resolution |

---

## Part 2: Feature-by-Feature Deep Dives - 10 items

### Q1: Onboarding

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 84 | 280 | CRITICAL | Steps 14-17: AI failure handling | 🔗 | Gap 1 | Delegated to Q1 resolution |

### Q3.1: Settings & User Profile

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 85 | 313 | CRITICAL | Profile editing regeneration triggers | 🔗 | Gap 4 | Delegated to Q4 resolution |

### Q3.3: Swapping

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 86 | 338 | CRITICAL | Swap with no matches fallback | 🔗 | Gap 5 | Delegated to Q5 resolution |
| 87 | 339 | CRITICAL | Undo after logging data integrity | 🔗 | Gap 3 | Delegated to Q3 resolution |

### Q3.4: Weekly Planning & Grocery

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 88 | 351 | CRITICAL | Regeneration limit (5/week) mid-week options | 🔗 | Gap 6 | Delegated to Q6 resolution |

---

## Part 3: Failure Scenarios - 1 item

### OpenAI API Failures

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 89 | 397 | CRITICAL | OpenAI timeout during onboarding | 🔗 | Gap 1 | Delegated to Q1 resolution |

---

## Part 4: Cross-Feature Dependencies - 6 items

### First-Time User Experience

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 90 | 411 | CONCERN | First-time user confusion (do they know to log meals?) | | | |

### Logging → Progress → Streaks → Achievements

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 91 | 430 | CONCERN | Event order? (Sequential or async?) Race conditions? | | | |

### Settings → Regen → UX

| # | Line | Type | Item | Status | Location | Notes |
|---|------|------|------|--------|----------|-------|
| 92 | 450 | CRITICAL | Settings change triggers regen with confirmation modal? | 🔗 | Gap 4 | Delegated to Q4 resolution |
| 93 | 451 | CRITICAL | Regeneration preserves favorites? | 🔗 | Gap 4 | Delegated to Q4 resolution |
| 94 | 452 | CRITICAL | Regeneration doesn't count toward 5/week limit? | 🔗 | Gap 4 | Delegated to Q4 resolution |
| 95 | 453 | CRITICAL | Logged meals preserved or regenerated? | 🔗 | Gap 4 | Delegated to Q4 resolution |

---

## Next Steps

1. ✅ Matrix created with all 95 items cataloged
2. ⏳ Phase 2: Cross-reference each item against specs
3. ⏳ Phase 3: Resolve any missing items
4. ⏳ Phase 4: Update affected specs

**Status:** Phase 1 Complete - Ready for Phase 2 Cross-Reference

---

**Document Version:** 1.0
**Created:** 2025-11-10
**Last Updated:** 2025-11-10
