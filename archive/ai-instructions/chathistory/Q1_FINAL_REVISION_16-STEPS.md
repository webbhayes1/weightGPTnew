# Q1 Final Revision: 16-Step Onboarding Flow

**Date:** November 4, 2025 (Revision 2)
**Previous Version:** 20 steps, 6 loading screens
**This Version:** 16 steps, 3 loading screens
**Status:** ✅ Final

---

## Complete 16-Step Onboarding Sequence

**Navigation Elements (All Screens):**
- **Progress Bar:** Top of screen showing "Step X of 16"
- **Back Button:** Top-left corner (< icon) to return to previous step
- **Note:** Welcome screen has no back button

---

### **1. Welcome**
- Prompt: "Let's build your perfect plan."
- CTA: "Start"

---

### **2. Goal Type**
- Prompt: "What's your main goal right now?"
- Options: Gain Weight / Lose Weight / Maintain Weight
- Store: `goalType`

---

### **3. Current Weight**
- Prompt: "What's your current weight?"
- Input: **Number picker / scroll wheel** (lbs: 80-400, kg: 35-180)
  - Tap-friendly scroll interface (no keyboard)
  - Toggle at top: [lbs] [kg]
- Store: `weight_current`

---

### **4. Goal Weight**
- Prompt: "What's your goal weight?"
- Input: **Number picker / scroll wheel** (lbs: 80-400, kg: 35-180)
  - Same interface as current weight
  - Shows difference: "+15 lbs" or "-20 lbs" in real-time
- Store: `weight_goal`

---

### **5. Goal Date**
- Prompt: "When do you want to reach [goal weight]?"
- Options:
  - Date picker (min 4 weeks, max 52 weeks)
  - **[I'm not sure - suggest for me]** button

**Inline Validation (No Loading Screen):**
- When date selected, immediately calculate and show below:
  - If SAFE: `✓ Healthy pace: 1.25 lbs/week | 16 weeks to reach your goal`
  - If UNSAFE: `⚠️ This requires 3 lbs/week - we recommend [safer date]`
    - [Use Recommended Date] [Continue Anyway]

**If "I'm not sure" tapped:**
- Quick 0.5s calculation (no full loading screen)
- Shows: "Based on your goal, we recommend: March 15, 2026 (16 weeks at 1.25 lbs/week)"
- [Use This Date] [Choose My Own]

- Store: `goal_date`, `weekly_rate`

---

### **6. Personal Details**
- Prompt: "Tell us about yourself"
- Inputs:
  - **Height:**
    - Toggle: [Feet/Inches] [CM]
    - If Feet/Inches: Dual number pickers (Feet: 4-7, Inches: 0-11)
    - If CM: Single number picker (120-220 cm)
    - No typing - scroll wheel interface
  - **Age:** Number picker / scroll wheel (13-100)
    - No typing - scroll interface
  - **Sex at Birth:** Tap to select buttons
    - [Male] [Female]
    - Large tap targets
- Note: "Sex at birth is required for accurate calorie calculations"
- Store: `height`, `age`, `sex`

**Background Processing Starts:**
- Immediately calculate BMR after this step (don't wait)
- Ready for next loading screen

---

### **7. Daily Activity Level**
- Prompt: "How active is your typical day?"
- Options:
  - Sedentary (desk job, minimal movement)
  - Moderate (on your feet regularly)
  - Active (physical job, constantly moving)
- Store: `daily_activity_level`

**Background Processing:**
- Calculate TDEE, daily calories, macros
- Loading screen can show results immediately

---

### **🔄 LOADING BREAK 1** (First Loading Screen)
```
"Calculating your personalized targets..."
[Circular progress indicator - 2 seconds]

↓

"✓ Targets Calculated
Your estimated daily target:
🔥 ~2,150 calories

This is based on your metabolism and [weight loss] goal"

[Continue Button]
```

**Why this works:**
- User has answered 6 questions (earned the wait)
- Calculation already done in background (feels instant)
- Big reveal moment ("Here's YOUR number")

---

### **8. Food Preferences** (MERGED STEP)
- Prompt: "Tell us about your food preferences"
- Inputs:
  - **Dietary Preference:** Tap-to-select buttons
    - [None] [Vegetarian] [Vegan] [Pescatarian] [Keto] [Custom]
  - **Foods to Avoid:** **Pre-populated chips** (tap to select)
    - Common: [Dairy] [Gluten] [Nuts] [Shellfish] [Eggs] [Soy] [Fish]
    - [+ Add More] → Shows extended list of 30+ common allergens/dislikes
    - **NO FREE TEXT** - all tap-to-select
  - **Favorite Cuisines:** Multi-select chips
    - [Mediterranean] [Asian] [Mexican] [American] [Italian] [Indian] [Greek]
    - [Skip Cuisines →] button for users who don't care
- Store: `dietary_preference`, `avoid_foods`, `preferred_cuisines`

---

### **9. Meal Approach** (MERGED STEP)
- Prompt: "How do you approach meals?"
- Inputs:
  - **Cooking Context:** Cook at home / Eat out often / Mix of both
  - **Prep Time Available:** Minimal (< 15 min) / Moderate (30 min) / Extended (60+ min)
- Store: `cooking_context`, `meal_prep_time`

---

### **10. Meal Variety Preference**
- Prompt: "How do you prefer your weekly meal plan?"
- Options:
  - Meal prep style (fewer recipes, repeat meals throughout week)
  - Maximum variety (different meals every day)
  - Balanced (some variety, some repeats)
- Store: `meal_variety_preference`

---

### **11. Budget Preference** (OPTIONAL - HAS SKIP)
- Prompt: "Do you prefer budget-friendly ingredients?"
- Options:
  - [Yes] [No] **[Skip]**
- Helper text: "We'll prioritize affordable options if you select Yes"
- Default if skipped: `No` (don't constrain meal options)
- Store: `budget_conscious`

---

### **12. Grocery Shopping Day** (OPTIONAL - HAS SKIP)
- Prompt: "When do you typically grocery shop?"
- Options:
  - [Sunday - week starts Monday]
  - [Saturday - week starts Sunday]
  - [Mid-week - week starts Thursday]
  - **[Skip]**
- Helper text: "We'll generate your meal plan based on when you shop"
- Default if skipped: `Flexible` (week starts Sunday as standard)
- Store: `week_start_day`

---

### **13. Equipment Access**
- Prompt: "What kind of workout setup do you have?"
- Options:
  - Home (bodyweight only)
  - Home (dumbbells/resistance bands)
  - Full gym access
- Store: `equipment_type`

---

### **🔄 LOADING BREAK 2** (Second Loading Screen)
```
"Designing your optimal workout plan..."
[Circular progress indicator - 2 seconds]

↓

"✓ Workout Plan Optimized

Based on your [weight loss] goal, we recommend:
💪 5 workout days per week
• 3 strength sessions
• 2 cardio sessions

You'll select which specific days work best for you next"

[Continue Button]
```

**Why this works:**
- User has answered 12 questions (substantial input)
- Natural break before workout scheduling
- Guides them with recommendation
- Smooth transition from nutrition → fitness

---

### **14. Workout Schedule** (MERGED STEP)
- Prompt: "Let's plan your workout schedule"
- Inputs:
  - **Workout Days:** Weekly calendar (Mon-Sun), tap to select
    - Helper text: "We recommend [5] workout days. Select the days that fit your schedule."
    - Shows recommendation count
    - Warning if significantly fewer selected: "Selecting fewer days may slow progress"
  - **Session Duration:** 20 / 30 / 45 / 60 minutes
- Store: `workout_days_preferred`, `session_length`

**Inline Validation (No Loading Screen):**
- After days selected, immediately validate spacing
- If poor spacing: Show inline hint "Try to space workouts evenly for better recovery"
- No separate loading screen needed

---

### **15. Preferences & Consent** (MERGED STEP)
- Prompt: "Just a few more preferences"
- Inputs:
  - **Notifications (multi-select toggles):**
    - [ ] Daily weigh-in reminders
    - [ ] Meal logging reminders
    - [ ] Workout reminders
    - [ ] Motivational check-ins
  - **Health Disclaimer (required checkbox):**
    - [✓] "I understand this app provides general wellness information and is not medical advice"
    - Additional text: "If you have any medical conditions, please consult your doctor before starting"
- Store: `notification_preferences`, `disclaimer_accepted: true`

---

### **16. Data Storage Preference**
- Prompt: "Do you want your data saved only on this device or backed up to the cloud?"
- Options:
  - Device only (private + offline)
  - Cloud backup (sync across devices)
- Store: `sync_preference`

---

### **🔄 LOADING BREAK 3** (Final - Major Loading)

**Phase 1: Workout Generation**
```
[Circular progress - 50%]
"Building your workout program..."

💡 Tip: Progressive overload is key to getting stronger

[10-15 seconds - OpenAI API call for workouts]
```

**Phase 2: Finalizing**
```
[Circular progress - 100%]
"Finalizing your personalized plan..."

💡 Tip: Consistency beats intensity every time

[2 seconds - package data]
```

**Total Duration:** 12-17 seconds

**Why this is the only long load:**
- Actual OpenAI API call happening (can't avoid)
- Educational tips keep user engaged
- Final moment before big reveal

---

## Value Demonstration Screens (3 Screens - No Meal Preview)

### **Screen 1: Your Success Path**
```
┌─────────────────────────────────┐
│  Here's Your Path to Success    │
│                                 │
│  [Modern line graph showing:]   │
│  • Starting: 180 lbs (today)    │
│  • Projected weekly progress    │
│    (gradient line downward)     │
│  • Goal: 160 lbs (Mar 15, 2026) │
│  • Shaded "healthy range" zone  │
│                                 │
│  Total Progress: -20 lbs        │
│  Timeline: 16 weeks             │
│  Average: -1.25 lbs/week        │
│                                 │
│  ✓ Safe & Sustainable           │
│                                 │
│    [See Your Full Plan →]       │
└─────────────────────────────────┘
```

---

### **Screen 2: Daily Nutrition Blueprint**
```
┌─────────────────────────────────┐
│  Your Personalized Daily        │
│       Targets                   │
│                                 │
│  [4 circular progress rings     │
│   in 2x2 grid with gradients]   │
│                                 │
│  🔥 Calories: 2,100-2,300       │
│  💪 Protein: 150-180g           │
│  🍞 Carbs: 200-250g             │
│  🥑 Fat: 60-75g                 │
│                                 │
│  Calculated specifically for    │
│  your weight loss goal and      │
│  moderate activity lifestyle    │
│                                 │
│    [See Your Meal Plan →]       │
└─────────────────────────────────┘
```

---

### **Screen 3: Your Workout Schedule**
```
┌─────────────────────────────────┐
│  Your Custom Workout Plan       │
│                                 │
│  [Visual calendar showing]      │
│  [selected days highlighted]    │
│                                 │
│  Weekly Schedule:               │
│                                 │
│  Tue 🏋️ Upper Body (45 min)     │
│  Wed 🏃 Cardio HIIT (30 min)    │
│  Thu 🏋️ Lower Body (45 min)     │
│  Fri 🏋️ Full Body (45 min)      │
│  Sat 🏃 Cardio Steady (30 min)  │
│                                 │
│  Rest: Mon, Sun                 │
│                                 │
│  Designed for your home gym     │
│  (dumbbells) with progressive   │
│  overload for maximum results   │
│                                 │
│   [Unlock Your Plan] 🔒         │
└─────────────────────────────────┘
```

---

## Paywall

```
┌─────────────────────────────────┐
│  Unlock Your Complete Plan      │
│                                 │
│  Your personalized program      │
│  is ready:                      │
│                                 │
│  ✓ 7-day meal plan with         │
│    detailed recipes             │
│  ✓ Grocery lists organized      │
│    for easy shopping            │
│  ✓ Full workout programs        │
│    with exercise guides         │
│  ✓ Daily tracking & progress    │
│    analytics                    │
│  ✓ Meal feedback learning       │
│    (gets better each week)      │
│                                 │
│  [Start 7-Day Free Trial]       │
│                                 │
│  [Subscribe - $9.99/month]      │
│                                 │
│  Cancel anytime                 │
└─────────────────────────────────┘
```

**Why No Meal Preview:**
- ✅ Faster onboarding (no meal generation = saves 10-20 seconds)
- ✅ Doesn't give away free content (users can't screenshot and reuse)
- ✅ Creates urgency to subscribe
- ✅ We show them THEIR personalized metrics (weight path, calories, workout schedule)
- ✅ Meals generate AFTER subscription on first app open

---

## Technical Implementation Notes

### **Background Calculations**

**After Step 6 (Personal Details):**
```javascript
const bmr = calculateBMR(height, age, sex); // Mifflin-St Jeor
store.setBMR(bmr);
// Ready for Step 7
```

**After Step 7 (Activity Level):**
```javascript
const bmr = store.getBMR();
const tdee = bmr * activityMultiplier; // 1.2, 1.5, or 1.7
const goalType = store.getGoalType();
const dailyCalories = calculateTarget(tdee, goalType);
const macros = calculateMacros(dailyCalories, goalType);

store.setMetrics({ tdee, dailyCalories, macros });
// Loading screen shows these immediately
```

**Loading Break 1 feels instant because calculation is already done!**

---

### **Timeline Validation (Inline)**

```javascript
// Step 5: When date selected
function onGoalDateChange(selectedDate) {
  const currentWeight = store.getCurrentWeight();
  const goalWeight = store.getGoalWeight();
  const goalType = store.getGoalType();

  const weeks = calculateWeeks(today, selectedDate);
  const weeklyRate = (goalWeight - currentWeight) / weeks;

  const isSafe = (goalType === 'lose' && weeklyRate >= -2 && weeklyRate <= -0.5) ||
                 (goalType === 'gain' && weeklyRate >= 0.5 && weeklyRate <= 1);

  if (isSafe) {
    showFeedback(`✓ Healthy pace: ${Math.abs(weeklyRate).toFixed(2)} lbs/week`);
  } else {
    const safeDate = calculateSafeDate(currentWeight, goalWeight, goalType);
    showWarning(`⚠️ This requires ${Math.abs(weeklyRate).toFixed(1)} lbs/week`, safeDate);
  }
}

// No loading screen - instant feedback!
```

---

### **Skip Button Defaults**

```javascript
// Step 11: Budget
if (skipped) {
  store.setBudgetConscious(false); // Don't constrain meals
}

// Step 12: Shopping Day
if (skipped) {
  store.setWeekStartDay('sunday'); // Standard default
  store.setShoppingDay('flexible');
}

// Step 8: Cuisines (within Food Preferences)
if (skipped) {
  store.setPreferredCuisines([]); // AI will use variety
}
```

---

### **Removed Steps - What Happened**

| Old Step | Action | Reason |
|----------|--------|--------|
| Cuisine Preference (was 9) | Merged into Food Preferences (Step 8) | Related to dietary choices |
| Cooking Context (was 10) | Merged into Meal Approach (Step 9) | Both about meal preparation |
| Meal Prep Time (was 11) | Merged into Meal Approach (Step 9) | Same category |
| Logging Preference (was 17) | **Removed entirely** | MVP enables both methods by default |

**Result:** 20 steps → 16 steps (20% reduction)

---

### **Removed Loading Screens - What Happened**

| Old Loading Screen | Action | Reason |
|-------------------|--------|--------|
| After Goal Date | Changed to inline validation | Calculation takes <10ms, no wait needed |
| After Grocery Day (transition) | Changed to 0.5s animation | Not a real calculation, just transition |
| After Workout Schedule | Changed to inline validation | Client-side check, instant |

**Result:** 6 loading screens → 3 loading screens (50% reduction)

---

## User Experience Metrics

### **Onboarding Duration:**
- **Questions:** 16 screens @ 3-5 sec each = 48-80 seconds
- **Loading:** 3 screens totaling 16-21 seconds
- **Total:** 64-101 seconds (**~1-1.5 minutes**)

**Comparison to Original:**
- Original: 24 steps, ~2-3 minutes
- Revision 1: 20 steps, ~1.5-2 minutes
- **Revision 2: 16 steps, ~1-1.5 minutes** ✅

### **Conversion Optimization:**
- **33% fewer steps** than original (24 → 16)
- **50% faster loading** (30-45s → 16-21s)
- **Still 100% of necessary data** collected
- **Better UX** with inline validation and skip options

---

## Data Collected - Nothing Lost

### **All Critical Data Still Captured:**
✅ Goal type, weights, timeline
✅ Height, age, sex (for BMR)
✅ Activity level (for TDEE)
✅ Dietary restrictions and allergies
✅ Food preferences (cuisines optional with skip)
✅ Cooking context and prep time
✅ Meal variety preference
✅ Budget consciousness (optional with skip)
✅ Shopping day (optional with skip)
✅ Equipment access
✅ Workout days and duration
✅ Notification preferences
✅ Health disclaimer acceptance
✅ Data storage preference

### **What Changed:**
- **Logging methods:** Removed question, both enabled by default
- **Cuisines:** Made optional with skip button
- **Budget:** Made optional with skip button
- **Shopping day:** Made optional with skip button

**No compromise on personalization - just removed friction!**

---

## Critical UX Principle: ZERO TYPING

### **No Keyboard Required Throughout Entire Onboarding**

**Why This Matters:**
- ✅ **Faster:** Tapping is faster than typing on mobile
- ✅ **Fewer Errors:** No typos, autocorrect issues, or validation problems
- ✅ **Better Accessibility:** Works for all literacy levels
- ✅ **Less Friction:** Keyboard appearing/disappearing disrupts flow
- ✅ **Universal:** Works in any language without keyboard switching

### **All Inputs Are Tap-Based:**

| Input Type | Implementation |
|------------|----------------|
| **Weights** | Number picker / scroll wheel (80-400 lbs or 35-180 kg) |
| **Height** | Dual pickers for ft/in (4-7 ft, 0-11 in) or single picker for cm (120-220) |
| **Age** | Number picker / scroll wheel (13-100) |
| **Dates** | Native date picker (calendar interface) |
| **Options** | Large tap-to-select buttons |
| **Preferences** | Chip/tag selection (multi-select) |
| **Allergies** | Pre-populated list of 30+ common items (tap to select) |
| **Toggles** | Switch controls for notifications |
| **Sex** | [Male] [Female] buttons |

**Only exception would be custom/rare food allergies, but we've removed this by providing comprehensive pre-populated lists.**

---

## Summary of Improvements

| Metric | Original | Revision 1 | Revision 2 (Final) | Improvement |
|--------|----------|------------|-------------------|-------------|
| **Steps** | 24 | 20 | **16** | **-33%** |
| **Loading Screens** | 7 | 6 | **3** | **-57%** |
| **Total Loading Time** | 30-45s | ~25-30s | **16-21s** | **-53%** |
| **Total Onboarding** | ~3 min | ~2 min | **~1.5 min** | **-50%** |
| **Typing Required** | Yes (6 fields) | Yes (6 fields) | **ZERO** | **-100%** |
| **Inline Validations** | 1 | 1 | **2** | Better UX |
| **Skip Options** | 0 | 0 | **3** | Flexibility |
| **Value Screens** | 4 | 4 | **3** | No giveaway |

---

**Document Version:** 2.0 (Final Revision)
**Last Updated:** November 4, 2025
**Status:** Ready for Development
