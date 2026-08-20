# Q1 Final Revision: 16-Step Onboarding Flow

**Date:** November 11, 2025 (Revision 3.5)
**Previous Version:** v3.4
**This Version:** v3.5 - Removed Step 17 (Data Storage) - account setup moved to post-paywall
**Status:** ✅ Final

---

## Complete 16-Step Onboarding Sequence

**Navigation Elements (All Screens):**
- **Progress Bar:** Top of screen showing "Step X of 16"
- **Back Button:** Top-left corner (< icon) to return to previous step
- **Note:** Welcome screen has no back button

**NOTE:** Step 17 (Data Storage Preference) has been removed. Account setup will be handled AFTER paywall conversion for better UX.

---

### **1. Welcome**
- Prompt: "Let's build your perfect plan."
- CTA: "Start"

---

### **2. Goal Type**
- Prompt: "What's your main goal right now?"
- Options: Gain Weight / Lose Weight / Maintain Weight
- Store: `goalType`
- **If "Maintain Weight" selected:** Skip to Step 6 after Step 3 (automatically set goal_weight = current_weight, no goal_date needed)

---

### **3. Current Weight**
- Prompt: "What's your current weight?"
- Input: **Number picker / scroll wheel** (lbs: 80-400, kg: 35-180)
  - Tap-friendly scroll interface (no keyboard)
  - Toggle at top: [lbs] [kg]
- Store: `weight_current`
- **Flow:** If goalType = "Maintain Weight" → Skip to Step 6 (Personal Details)

---

### **4. Goal Weight** *(Skipped if Maintain Weight)*
- Prompt: "What's your goal weight?"
- Input: **Number picker / scroll wheel** (lbs: 80-400, kg: 35-180)
  - Same interface as current weight
  - Shows difference: "+15 lbs" or "-20 lbs" in real-time
- Store: `weight_goal`
- **Only shown for:** Gain Weight / Lose Weight goals

---

### **5. Goal Date** *(Skipped if Maintain Weight)*
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
    - **Age 13-17:** Show checkbox below picker: "☐ I have parent/guardian permission to use this app" (required to proceed)
    - **Age 65+:** Show disclaimer after selection: "⚠️ Please consult your doctor before starting any new diet or exercise program"
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

### **9. Meal Prep Time**
- Prompt: "How much time do you typically have for meal prep?"
- Options:
  - Minimal (< 15 minutes per meal)
  - Moderate (30 minutes per meal)
  - Extended (60+ minutes per meal)
- Helper text: "We'll tailor recipes to fit your available time"
- Store: `meal_prep_time`

**Note:** Removed "Cooking Context" field (eat at home vs. eat out) - users of a meal planning app are inherently cooking at home. See revision notes below.

---

### **10. Meal Variety Preference**
- Prompt: "How do you prefer your weekly meal plan?"
- Options:
  - Meal prep style (fewer recipes, repeat meals throughout week)
  - Maximum variety (different meals every day)
  - Balanced (some variety, some repeats)
- Store: `meal_variety_preference`

---

### **11. Eating Pattern**
- Prompt: "How many meals do you typically eat per day?"
- Options:
  - 2 meals
  - 3 meals (recommended)
  - 4-5 meals (including snacks)
- Store: `meals_per_day`

**Follow-up on same screen:**
- Prompt: "Which meals do you eat?"
- Options: **Multi-select tap-to-select buttons**
  - [✓] Breakfast
  - [✓] Lunch
  - [✓] Dinner
  - [ ] Snacks between meals
- Helper text: "We'll create a plan that fits your eating style"
- Store: `meal_pattern` (array: ["breakfast", "lunch", "dinner"]), `includes_snacks` (boolean)

**Default Selection:**
- If user selects "2 meals": Pre-select Lunch + Dinner (they can adjust)
- If user selects "3 meals": Pre-select all three main meals
- If user selects "4-5 meals": Pre-select all three + snacks

---

### **12. Budget Preference** (OPTIONAL - HAS SKIP)
- Prompt: "Do you prefer budget-friendly ingredients?"
- Options:
  - [Yes] [No] **[Skip]**
- Helper text: "We'll prioritize affordable options if you select Yes"
- Default if skipped: `No` (don't constrain meal options)
- Store: `budget_conscious`

---

### **13. Grocery Shopping Day** (OPTIONAL - HAS SKIP)
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

### **14. Equipment Access**
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

### **15. Workout Schedule** (MERGED STEP)
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

### **16. Preferences & Consent** (MERGED STEP)
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
- **This is the final onboarding step (16/16)** - navigates to Loading Break 3

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

**Error Handling & Fallback System** *(Added Session 23 - Gap Resolution)*

**Multi-Tier Fallback for AI Failures:**

**Tier 1: Primary (OpenAI Generation)**
- Timeout: 30 seconds per API call
- 3 parallel calls: Meal plan, Workout plan, Nutrition insights
- Expected duration: 12-17 seconds
- If successful: Proceed to Value Demo screens

**Tier 2: Retry with Simplified Prompt**
- Triggered if: Tier 1 times out or returns error
- Update loading message: "Taking longer than expected... hang tight!"
- Retry failed API call(s) with simplified prompt (fewer constraints)
- Timeout: 20 seconds
- If successful: Proceed to Value Demo screens

**Tier 3: Template-Based Plan (Fallback)**
- Triggered if: Tier 2 fails or times out
- Use pre-built meal/workout templates stored in database
- Templates: 3 per goal type (lose_weight, gain_weight, maintain)
  - Template structure: Generic 7-day meal plan + 7-day workout program
  - Dynamically scaled to user's calculated calories/macros
- Loading message: "Creating your starter plan..."
- Duration: 2-3 seconds (database retrieval + scaling)
- Success message: "We created a starter plan for you! You can customize it anytime in Settings."
- Visual indicator: Small badge "Starter Plan" (not "AI-Generated")
- User can regenerate with AI later: Settings → Regenerate Plan

**Template Scaling Logic:**
```typescript
interface PlanTemplate {
  id: string;
  goal: 'lose_weight' | 'gain_weight' | 'maintain';
  base_calories: number; // Template default (e.g., 1800)
  meals: MealTemplate[]; // 21 generic meals (B/L/D × 7 days)
  workouts: WorkoutTemplate[]; // 5-7 generic workouts
}

function applyTemplate(template: PlanTemplate, user: User): MealPlan {
  const scale = user.daily_calories / template.base_calories;

  return {
    meals: template.meals.map(m => ({
      ...m,
      calories: Math.round(m.calories * scale),
      protein_g: Math.round(m.macros.protein_g * scale),
      carbs_g: Math.round(m.macros.carbs_g * scale),
      fat_g: Math.round(m.macros.fat_g * scale),
    })),
    workouts: template.workouts, // Workouts don't need scaling
    source: 'template_fallback',
  };
}
```

**Tier 4: Block Onboarding with Error (Catastrophic Failure)**
- Triggered if: Templates fail to load (database error)
- Show error modal:
  ```
  ┌─────────────────────────────────────┐
  │  Technical Difficulties             │
  ├─────────────────────────────────────┤
  │                                     │
  │  We're experiencing technical       │
  │  difficulties creating your plan.   │
  │                                     │
  │  Please try again in a few minutes. │
  │                                     │
  │  [Retry Onboarding]                 │
  │  [Contact Support]                  │
  │                                     │
  └─────────────────────────────────────┘
  ```
- Log to Sentry with priority: CRITICAL
- Send admin notification (email/Slack)
- User can retry immediately or contact support

**Error Tracking:**
```typescript
interface OnboardingGenerationLog {
  id: string;
  user_id: string;
  attempt_timestamp: Date;
  tier_reached: 1 | 2 | 3 | 4;
  success: boolean;
  error_type?: 'timeout' | 'api_error' | 'validation_error' | 'database_error';
  error_message?: string;
  fallback_used: boolean;
  generation_duration_ms: number;
}
```

**User Communication:**
- Tier 1-2 failures: Silent retry with updated loading message
- Tier 3 (template): Show success message with badge "Starter Plan"
  - Note in Settings: "Regenerate with AI for personalized meals" (unlimited attempts)
- Tier 4 (block): Show error modal with clear action buttons

**Recovery Path:**
- Users on template plans can regenerate with AI anytime:
  - Settings → My Plan → [Regenerate with AI]
  - Does NOT count toward 5/week regeneration limit (first-time AI generation)
  - Success rate tracked for monitoring

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

## Post-Subscription: First App Open Experience

**When:** User completes subscription (trial or paid) and opens app for first time

**Purpose:** Welcome user and offer to generate their first meal/workout plan

### Welcome Modal (Shown Once)

```
┌─────────────────────────────────────────────────────────┐
│         Welcome to WeightGPT! 🎉                        │
│                                                         │
│  Let's get you started with your first                 │
│  personalized meal plan.                               │
│                                                         │
│  This will create:                                     │
│  • 7 days of meals (14-28 meals based on pattern)     │
│  • Custom workout schedule                            │
│  • Organized grocery list                             │
│                                                         │
│  Takes about 15-20 seconds                             │
│                                                         │
│  [Generate My Plan]  [Set Up Later]                    │
└─────────────────────────────────────────────────────────┘
```

**User Interactions:**

**Option 1: [Generate My Plan]**
→ Loading screen (15-20s) with progress messages
→ "Your Plan is Ready!" success modal
→ Navigate to Home tab (plan visible)

**Option 2: [Set Up Later]**
→ Modal dismisses
→ Home tab shows empty state (see Q3.0 spec)
→ User can explore app, use manual logging
→ Banner at top: "⚠️ Generate your meal plan to get started"
→ Floating action button: "Generate Plan" always visible

**States:**

```typescript
interface UserOnboardingState {
  has_subscribed: boolean;
  welcome_modal_shown: boolean; // Only show once, never again
  first_plan_generated: boolean;
  first_plan_generation_delayed: boolean; // User chose "Set Up Later"
  delayed_at: Date | null; // Timestamp when user delayed
}
```

**Nudge System (If User Delays):**

- **Immediate:** Empty state with prominent CTAs (see Q3.0 spec)
- **24 hours later:** Push notification
  ```
  "Your personalized plan is waiting! 🎯"
  "Tap to generate your meal plan and get started"
  ```
- **In-app banner persists:** Visible on all tabs until plan generated
- **No re-showing of modal:** Welcome modal is one-time only

**Technical Flow:**

```typescript
// On first app open after subscription
async function handleFirstAppOpen(user: User) {
  // Check if user has subscribed but not seen welcome modal
  if (user.has_subscribed && !user.welcome_modal_shown) {
    showWelcomeModal({
      onGenerateNow: async () => {
        user.welcome_modal_shown = true;
        await generateFirstPlan(user);
        navigateToHome();
      },
      onSetUpLater: () => {
        user.welcome_modal_shown = true;
        user.first_plan_generation_delayed = true;
        user.delayed_at = new Date();
        navigateToHome(); // Shows empty state
        scheduleDelayedNudge(user, 24); // hours
      }
    });
  } else if (user.first_plan_generation_delayed && !user.first_plan_generated) {
    // User already dismissed welcome modal, show empty state
    navigateToHome(); // With persistent banner
  } else {
    // Normal app experience
    navigateToHome();
  }
}

// Schedule push notification
function scheduleDelayedNudge(user: User, hoursDelay: number) {
  const nudgeTime = new Date(user.delayed_at.getTime() + (hoursDelay * 60 * 60 * 1000));

  schedulePushNotification({
    user_id: user.id,
    scheduled_for: nudgeTime,
    title: "Your personalized plan is waiting! 🎯",
    body: "Tap to generate your meal plan and get started",
    deep_link: "weightgpt://generate-plan"
  });
}
```

**User Can Use App Without Plan:**
- Manual meal logging works (Q3.2)
- Manual workout logging works
- Progress tracking works (Q3.5)
- Settings accessible
- **AI features disabled** until plan generated:
  - No meal swapping
  - No AI logging assistance
  - No weekly regeneration

**See Also:**
- Q3.0 (Home tab empty state)
- Q3.4 (First-time plan generation flow)
- Q2 (Meal planning screens)

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
let dailyCalories = calculateTarget(tdee, goalType);

// Calorie Floor & Ceiling Validation (Gaps 16 & 18 - Session 23)
const sex = store.getSex();
const minCalories = sex === 'female' ? 1200 : 1500;
const maxCalories = 5000;
const warningThreshold = 4000;

// Check minimum floor
if (dailyCalories < minCalories) {
  const originalTimeline = store.getTimelineWeeks();
  const adjustedTimeline = calculateSafeTimeline(minCalories, goalType);

  showModal({
    title: "Calorie Minimum Adjustment",
    message: `⚠️ Your goal requires ${dailyCalories} cal/day, but we
     recommend a minimum of ${minCalories} for your health.

     We've adjusted your plan:
     • Daily calories: ${minCalories} (safe minimum)
     • New timeline: ${adjustedTimeline} weeks (instead of ${originalTimeline})
     • Rate: ${calculateWeeklyRate(adjustedTimeline)} lbs/week (safe & sustainable)`,
    buttons: [
      { label: "Accept Adjusted Plan", action: () => {
        dailyCalories = minCalories;
        store.setTimelineWeeks(adjustedTimeline);
      }},
      { label: "Change Goal", action: () => navigateBack(toStep: 2) }
    ]
  });
}

// Check maximum ceiling
if (dailyCalories > maxCalories) {
  const adjustedTimeline = calculateSafeTimeline(maxCalories, goalType);
  dailyCalories = maxCalories; // Hard cap
  store.setTimelineWeeks(adjustedTimeline);

  showToast(`Daily calories capped at ${maxCalories} (maximum). Timeline extended to ${adjustedTimeline} weeks.`);
}

// Warning for very high calories
if (dailyCalories >= warningThreshold && dailyCalories <= maxCalories) {
  showModal({
    title: "High Calorie Confirmation",
    message: `⚠️ Your goal requires ${dailyCalories} cal/day, which is
     very high.

     This is appropriate for:
     • Elite athletes
     • Very active large individuals
     • Rapid muscle gain goals

     Is this correct for you?`,
    buttons: [
      { label: "Yes, This is Correct", action: () => proceed() },
      { label: "Adjust My Goal", action: () => navigateBack(toStep: 2) }
    ]
  });
}

const macros = calculateMacros(dailyCalories, goalType);

store.setMetrics({ tdee, dailyCalories, macros });

// For "Maintain Weight" users:
if (goalType === 'maintain') {
  store.setGoalWeight(store.getCurrentWeight()); // goal = current
  store.setMaintenanceThreshold(0.05); // 5% variance triggers notification
}
// Loading screen shows these immediately
```

**Maintenance Weight Monitoring (v3.1):**
- For "Maintain Weight" users, goal_weight = current_weight
- System monitors weight daily for ±5% variance from initial weight
- If weight exceeds 5% threshold in either direction:
  - Send notification: "Your weight has changed by X%. Would you like to adjust your plan?"
  - Options: [Adjust Plan to Gain] [Adjust Plan to Lose] [Update Goal Weight] [Dismiss]
- Adjusted plan recalculates calories/macros to bring user back to maintenance weight

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
| Cooking Context (was 10) | **Removed entirely** (2025-11-04) | Not actionable for meal generation; users of meal planning app inherently cook at home |
| Meal Prep Time (was 11) | Now standalone as Step 9 | Important for recipe complexity/time |
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
- **Questions:** 17 screens @ 3-5 sec each = 51-85 seconds
- **Loading:** 3 screens totaling 16-21 seconds
- **Total:** 67-106 seconds (**~1-1.75 minutes**)

**Comparison to Original:**
- Original: 24 steps, ~2-3 minutes
- Revision 1: 20 steps, ~1.5-2 minutes
- Revision 2: 16 steps, ~1-1.5 minutes
- **Revision 3: 17 steps, ~1-1.75 minutes** ✅

### **Conversion Optimization:**
- **29% fewer steps** than original (24 → 17)
- **50% faster loading** (30-45s → 16-21s)
- **Enhanced personalization** with eating pattern data
- **Better UX** with inline validation and skip options

---

## Data Collected - Nothing Lost

### **All Critical Data Still Captured:**
✅ Goal type, weights, timeline
✅ Height, age, sex (for BMR)
✅ Activity level (for TDEE)
✅ Dietary restrictions and allergies
✅ Food preferences (cuisines optional with skip)
✅ Meal prep time
✅ Meal variety preference
✅ Eating pattern (meals per day, which meals, snacks)
✅ Budget consciousness (optional with skip)
✅ Shopping day (optional with skip)
✅ Equipment access
✅ Workout days and duration
✅ Notification preferences
✅ Health disclaimer acceptance
✅ Data storage preference

### **What Changed:**
- **Cooking context:** Removed entirely (users of meal planning app inherently cook at home)
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

## Revisions

### v3.4 - 2025-11-10 (Post-Subscription Welcome Modal)
**Change:** Added comprehensive post-subscription first app open experience
**Addition:** Welcome modal with optional plan generation ("Generate My Plan" vs "Set Up Later")
**Rationale:** User feedback identified forcing immediate plan generation creates pressure. New flow respects user autonomy while encouraging generation.
**Impact:**
- Users can delay plan generation and explore app first
- Empty states with persistent CTAs guide users to generate plan
- 24-hour nudge notification if plan not generated
- Manual logging and non-AI features remain accessible without plan
- Improves conversion by reducing subscription friction
**Technical Addition:** New state tracking (welcome_modal_shown, first_plan_generation_delayed, delayed_at)
**Decision Log:** User preference for "Option 3: Gentle Nudge (No Blocking)" approach
**Related Changes:**
- Q3.0: Added empty state sections for Home tab (nutrition and workout views)
- Q3.4: Updated first-time generation flow with multiple entry points
- Q2: Updated background generation trigger to be user-initiated

### v3.1 - 2025-11-06 (Issue Resolution Update)
**Changes:**
- Added age disclaimers: 13-17 requires parental permission checkbox, 65+ shows medical consultation disclaimer
- Added "Maintain Weight" flow: Skips Goal Weight and Goal Date steps (sets goal_weight = current_weight automatically)
- Added 5% variance monitoring for maintenance users: System notifies if weight deviates ±5% from starting weight and offers plan adjustments
**Impact:**
- Age validation now includes COPPA compliance and medical safety
- Maintenance users have streamlined onboarding (2 fewer steps)
- Maintenance tracking actively monitors for weight changes and prompts corrections
**Key Changes:**
- Step 4 & 5 are conditional (only shown for Gain/Lose Weight goals)
- Maintenance users proceed: Step 2 → Step 3 → Step 6 (skip 4 & 5)
- Backend stores maintenance threshold (5%) and monitors daily weight entries

### v3.0 - 2025-11-04 (Eating Pattern Addition)
**Change:** Added "Eating Pattern" question as new Step 11
**Rationale:** During Q3 planning, identified need to know user's eating habits (2, 3, or 4-5 meals/day, which meals, snacks) to generate truly personalized meal plans. Users who skip breakfast shouldn't get breakfast in their plan and grocery list.
**Impact:**
- Q1 goes from 16 steps to 17 steps
- Collects: `meals_per_day`, `meal_pattern` array, `includes_snacks` boolean
- All subsequent steps renumbered (11→12, 12→13, etc.)
- Q2 meal generation will adapt based on eating pattern
**Decision Log:** See [DECISIONS.md](../DECISIONS.md) - "Add Eating Pattern to Q1"

### v3.3 - 2025-11-10 (Calorie Floor & Ceiling - Session 23)
**Change:** Added calorie validation with minimum floor and maximum ceiling
**Addition:** Step 7 calculation now includes safety bounds (1200/1500 min, 5000 max, 4000 warning)
**Rationale:** Edge case verification identified no safety limits on calculated calories. Prevents unhealthy deficits/surpluses.
**Impact:**
- Minimum floor: 1200 cal (female), 1500 cal (male) with timeline extension
- Maximum ceiling: 5000 cal hard cap with timeline extension
- Warning threshold: 4000+ cal requires confirmation
- Automatic timeline recalculation when limits exceeded
**Decision Log:** See [DECISIONS.md](../DECISIONS.md) - "Session 23: Gaps 16 & 18"

### v3.2 - 2025-11-10 (AI Failure Handling - Session 23)
**Change:** Added comprehensive error handling and fallback system for Loading Break 3
**Addition:** Multi-tier fallback system (OpenAI → Retry → Template Plans → Block with Error)
**Rationale:** Gap analysis identified no error handling if OpenAI API fails/times out during onboarding. Template fallback ensures users can always complete onboarding.
**Impact:**
- Added Template Plan system with 3 pre-built plans per goal type
- Added error tracking and monitoring
- Added recovery path for template users to regenerate with AI later
**Decision Log:** See [DECISIONS.md](../DECISIONS.md) - "Session 23: 15 Gap Resolution Decisions - Gap 1"

### v2.1 - 2025-11-04 (Cooking Context Removal)
**Change:** Removed "Cooking Context" field from Step 9
**Rationale:** During Q2 planning, identified that this field was not actionable for meal generation. Users of a meal planning app are inherently cooking at home; if they eat out frequently, they wouldn't use this app.
**Impact:** Step 9 now only collects "Meal Prep Time"
**Decision Log:** See [DECISIONS.md](../DECISIONS.md) - "Remove Cooking Context Field"

### v2.0 - 2025-11-04 (Final Revision)
**Changes:** Reduced from 20 steps to 16, from 6 loading screens to 3
**Improvements:** Zero typing requirement, inline validation, skip options
**Status:** Finalized and ready for development

---

**Document Version:** 3.4
**Last Updated:** November 10, 2025 (Session 24: Post-Subscription Welcome Modal)
**Status:** Ready for Development
