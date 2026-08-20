# Session Summary: Q1 - Onboarding Flow Design

**Date:** November 4, 2025
**Time:** Session Start
**Focus:** Designing comprehensive onboarding experience for WeightGPT mobile app
**Status:** ✅ Finalized (Revised)

---

## Table of Contents
1. [Initial Requirements](#initial-requirements)
2. [Discussion Process](#discussion-process)
3. [Key Decisions Made](#key-decisions-made)
4. [Final Onboarding Flow](#final-onboarding-flow)
5. [Technical Implementation Notes](#technical-implementation-notes)
6. [Backend Considerations](#backend-considerations)
7. [UX/UI Specifications](#uxui-specifications)
8. [Data Structures](#data-structures)
9. [Success Metrics](#success-metrics)
10. [Future Enhancements](#future-enhancements)
11. [Revisions](#revisions)

---

## 1. Initial Requirements

### User's Original Vision
The user presented a detailed 17-step onboarding flow covering:
- Goal type selection (gain/lose/maintain weight)
- Personal metrics (current weight, goal weight, height, age, sex)
- Activity level assessment
- Dietary preferences and restrictions
- Cuisine preferences
- Cooking context
- Equipment access for workouts
- Workout frequency and session duration
- Meal logging preferences
- Data sync preferences

### Initial Questions Asked
The user requested recommendations for:
- Additional information necessary for successfully helping users reach their goal weight
- Any missing critical data points
- Optimal UX flow considerations

---

## 2. Discussion Process

### Recommendations Provided

#### Critical Missing Information:
1. **Timeline/Target Date** - Essential for calculating safe weekly weight change rates
2. **Experience Level** - For workout complexity (initially proposed, later rejected)
3. **Meal Prep Willingness/Time** - Critical for realistic meal plan generation
4. **Budget Consciousness** - To affect meal recommendations

#### Suggested Improvements:
5. **Activity Level Split** - Separate daily lifestyle from planned exercise
6. **Logging Preference Simplification** - Start with Search/Manual for MVP
7. **Notification Preferences** - Help users stay on track
8. **Health Disclaimers** - Legal protection and user safety
9. **Weight Change Rate Validation** - Ensure healthy, sustainable goals
10. **BMI/Health Range Information** - Informative context for users

### User Decisions on Recommendations

**Incorporated:**
- ✅ Timeline with goal date (instead of abstract weekly rates)
- ✅ Meal prep time question
- ✅ Budget consciousness (simplified to yes/no)
- ✅ Activity level split (sedentary/moderate/active job)
- ✅ Notification preferences
- ✅ Health disclaimers
- ✅ Weight change rate validation with warnings
- ✅ Value demonstration screens before paywall

**Modified:**
- Timeline approach: Changed from difficulty selector to goal date picker with automatic rate calculation and warnings

**Rejected:**
- ❌ Fitness experience level (decided frequency is sufficient)
- ❌ Camera/barcode logging for MVP (reserved for Phase 2 with OpenAI Vision API)

### Deep Dive Discussions

#### Discussion 1: Meal Prep Style (Hybrid Approach)
**Question:** Should meals repeat weekly (meal prep) or be different every day?

**Options Presented:**
- Option A: Meal Prep Style (same meals repeat Mon-Fri)
- Option B: Daily Variety (different meals each day)
- Option C: Hybrid - User Choice

**Decision:** Hybrid (Option C) - Ask user preference during onboarding
- Gives users control
- Backend flexible enough to handle both styles
- Stores `meal_variety_preference`

#### Discussion 2: Budget Feature Implementation
**Question:** Can AI accurately calculate meal costs, or will user input complexity cause issues?

**Concerns Raised:**
- OpenAI doesn't have real-time grocery pricing
- Regional price variations
- Seasonal fluctuations
- Store-specific pricing

**Options Presented:**
- Option 1: Skip for MVP (less complexity)
- Option 2: Simple yes/no - "Prefer budget-friendly ingredients?"

**Decision:** Option 2 - Keep it simple/qualitative
- AI uses cheaper protein sources and staples when flagged
- No cost calculations, just smart substitutions
- Low complexity, still provides value

#### Discussion 3: Workout Distribution Strategy
**Question:** How should workouts be distributed throughout the week for optimal UX and backend?

**Options Presented:**
- Option A: User selects preferred workout days (recommended)
- Option B: Smart auto-distribution

**Decision:** Option A with smart validation
- Respects user's real schedule
- Higher adherence (plan fits their life)
- Backend validates spacing to prevent poor distribution
- Algorithm ensures minimum 48hrs between same muscle groups

**User Example:** Works out Tuesday-Friday
- System distributes strength/cardio appropriately across those days
- Ensures proper muscle group spacing

#### Discussion 4: Meal Regeneration Strategy
**Question:** How often should meal plans regenerate, and how?

**Decision:** Auto-regenerate weekly with learning system
- Users can thumbs up 👍 / thumbs down 👎 meals
- System stores preferences (liked/disliked)
- AI learns patterns and adjusts future recommendations
- Excludes disliked meals and similar variations
- Increases probability of meals similar to liked ones

**Data Structure:**
```json
{
  "meal_feedback": {
    "liked": [
      {
        "meal_id": "123",
        "name": "Chicken Burrito Bowl",
        "tags": ["mexican", "chicken", "high_protein"]
      }
    ],
    "disliked": [
      {
        "meal_id": "789",
        "name": "Tuna Salad",
        "tags": ["seafood", "salad", "lunch"]
      }
    ]
  }
}
```

#### Discussion 5: Week Start Day
**Question:** Should weeks start Monday, Sunday, or user preference?

**Decision:** User preference based on grocery shopping day
- Onboarding asks: "When do you typically grocery shop?"
- Options: Sunday, Saturday, Mid-week, Flexible
- Plans regenerate night before shopping day
- Shopping list ready when needed
- Natural weekly rhythm aligned with user habits

#### Discussion 6: Loading Screens and Processing Time
**Question:** Where should loading states appear during onboarding?

**User Insight:** "It might take the system a second to generate workout frequency recommendation"

**Options Presented:**
- Minimal Approach: Only loading after final submission (AI generation)
- Enhanced Approach: Strategic loading at natural breaks

**Decision:** Enhanced approach with multiple loading breaks
- After Goal Date: Timeline analysis
- After Activity Level: Calorie target calculation
- After Grocery Shopping: Section transition (nutrition → fitness)
- After Equipment: Workout frequency recommendation
- After Workout Days: Schedule optimization
- After Notifications: Final progress indicator
- After Data Storage: MAJOR AI generation sequence

**Visual Design Requirements:**
- Clean, modern branding
- Circular progress indicators with percentages
- Rotating educational tips during long waits (every 5 seconds)
- Subtle pulse animations

#### Discussion 7: Workout Frequency Recommendation
**Question:** Should system recommend workout frequency before user selects days?

**Decision:** Yes - Show recommendation based on goal type
- Weight Loss: 5 days (3 strength + 2 cardio)
- Maintenance: 4 days (3 strength + 1 cardio)
- Weight Gain: 4-5 days (4 strength + 1 cardio)

**Flow:**
1. Calculate recommendation after equipment selection
2. Show recommendation screen with breakdown
3. User selects specific days (can override recommendation)
4. Warning if significantly fewer days selected

#### Discussion 8: Value Demonstration Screens
**Question:** What should users see before hitting paywall?

**Decision:** Four comprehensive value screens
1. **Weight Projection Graph** - Visual success trajectory
2. **Daily Nutrition Targets** - Personalized calorie and macro ranges
3. **Workout Overview** - Weekly schedule breakdown
4. **Sample Day Preview** - Specific meals and workout for one day

**User Requirements:**
- Loading screens showing "high-tech system calculating"
- Modern graph projection
- Weight today vs goal weight at goal date
- Total weight gain/loss displayed
- Independent screens for calories, macros, workouts
- Demonstrate value before paywall

---

## 3. Key Decisions Made

### Core Decisions Summary

| Decision Point | Choice | Rationale |
|---------------|--------|-----------|
| **Meal Prep Style** | User choice (hybrid) | Flexibility for different lifestyles |
| **Budget Feature** | Simple yes/no | Provides value without complexity |
| **Workout Distribution** | User selects days | Respects real schedules, higher adherence |
| **Meal Regeneration** | Auto-weekly with learning | Improves over time based on feedback |
| **Week Start Day** | User preference (shopping day) | Aligns with natural habits |
| **Loading Screens** | Enhanced with multiple breaks | Better UX, manages expectations |
| **Workout Frequency** | Recommend before selection | Guides users while allowing override |
| **Value Demo** | 4 screens before paywall | Builds excitement, demonstrates worth |
| **Cardio vs Strength** | Goal-dependent with balance | Weight loss = more cardio, gain = more strength |
| **Logging Methods (MVP)** | Search + Manual only | Camera/barcode reserved for Phase 2 |

---

## 4. Final Onboarding Flow

### Complete 20-Step Sequence (Revised)

**Navigation Elements (All Screens):**
- **Progress Bar:** Top of screen showing step X of 20
- **Back Button:** Top-left corner (< icon) to return to previous step
- **Note:** Welcome screen has no back button

#### **1. Welcome**
- Prompt: "Let's build your perfect plan."
- CTA: "Start"

#### **2. Goal Type**
- Prompt: "What's your main goal right now?"
- Options: Gain Weight / Lose Weight / Maintain Weight
- Store: `goalType`

#### **3. Current Weight**
- Prompt: "What's your current weight?"
- Input: Numeric (lbs/kg toggle)
- Store: `weight_current`

#### **4. Goal Weight**
- Prompt: "What's your goal weight?"
- Input: Numeric (lbs/kg toggle)
- Store: `weight_goal`

#### **5. Goal Date**
- Prompt: "When do you want to reach [goal weight]?"
- Input: Date picker (min 4 weeks, max 52 weeks)
- Backend Logic:
  - Calculate weekly rate needed
  - If unsafe (>2 lbs/week loss or >1 lb/week gain):
    - Show warning about unhealthy rate
    - Options: Adjust to safer date OR Continue with risks
- Store: `goal_date`, `weekly_rate`

#### **🔄 LOADING BREAK 1**
```
"Analyzing your timeline..."
[2 seconds]
↓
"✓ Timeline Set
You'll [gain/lose] ~X lbs per week safely
[Auto-continue in 2s]"
```

#### **6. Personal Details**
- Prompt: "Tell us about yourself"
- Inputs:
  - Height: Feet/inches or cm
  - Age: Numeric input
  - Sex at Birth: Male / Female
- Note: Sex at birth is required for accurate calorie calculations
- Store: `height`, `age`, `sex`

#### **7. Daily Activity Level**
- Prompt: "How active is your typical day?"
- Options:
  - Sedentary (desk job, minimal movement)
  - Moderate (on your feet regularly)
  - Active (physical job, constantly moving)
- Store: `daily_activity_level`

#### **🔄 LOADING BREAK 2**
```
"Calculating your calorie targets..."
[2 seconds]
↓
"✓ Targets Calculated
Your estimated daily target:
🔥 ~2,150 calories
[Continue Button]"
```

#### **8. Dietary Preferences & Restrictions**
- Prompt: "Tell us about your food preferences"
- Inputs:
  - Dietary Preference: None / Vegetarian / Vegan / Pescatarian / Keto / Custom
  - Foods to Avoid: Multi-select tags or free text (allergies, dislikes)
- Store: `dietary_preference`, `avoid_foods`

#### **9. Cuisine Preference**
- Prompt: "Which cuisines do you love?"
- Options: Mediterranean / Asian / Mexican / American / Italian / Custom (multi-select)
- Store: `preferred_cuisines`

#### **10. Cooking Context**
- Prompt: "How do you usually eat?"
- Options: Cook at home / Eat out often / Mix of both
- Note: Influences meal plan complexity
- Store: `cooking_context`

#### **11. Meal Prep Time**
- Prompt: "How much time can you spend preparing meals?"
- Options:
  - Minimal (< 15 min)
  - Moderate (30 min)
  - Extended (60+ min)
- Store: `meal_prep_time`

#### **12. Meal Variety Preference**
- Prompt: "How do you prefer your weekly meal plan?"
- Options:
  - Meal prep style (fewer recipes, repeat meals)
  - Maximum variety (different meals every day)
  - Balanced (some variety, some repeats)
- Store: `meal_variety_preference`

#### **13. Budget Preference**
- Prompt: "Do you prefer budget-friendly ingredients?"
- Options: Yes / No
- Note: AI prioritizes affordable ingredients when "Yes"
- Store: `budget_conscious`

#### **14. Grocery Shopping Day**
- Prompt: "When do you typically grocery shop?"
- Options:
  - Sunday (week starts Monday)
  - Saturday (week starts Sunday)
  - Mid-week (week starts Thursday)
  - Flexible
- Helper text: "We'll generate your weekly meal plan based on when you shop"
- Store: `week_start_day`

#### **🔄 TRANSITION BREAK 3**
```
[Icon transition animation: 🍎 → 💪]
"Great! Now let's talk about your workouts"
[Auto-continue in 1.5s]
```

#### **15. Equipment Access**
- Prompt: "What kind of workout setup do you have?"
- Options:
  - Home (bodyweight only)
  - Home (dumbbells/resistance bands)
  - Full gym access
- Store: `equipment_type`

#### **🔄 LOADING BREAK 4**
```
"Determining optimal workout frequency..."
[2 seconds]
↓
"✓ Workout Plan Optimized
Based on your [goal type] goal, we recommend:
💪 5 workout days per week
• 3 strength sessions
• 2 cardio sessions

You'll select which specific days work best for you next
[Continue Button]"
```

#### **16. Workout Schedule**
- Prompt: "Let's plan your workout schedule"
- Inputs:
  - **Workout Days:** Weekly calendar (Mon-Sun), tap to select
    - Helper text: "We recommend [5] workout days. Select the days that fit your schedule."
    - Shows recommendation count, allows override with warning
  - **Session Duration:** 20 / 30 / 45 / 60 minutes
- Store: `workout_days_preferred` (e.g., ["tuesday", "wednesday", "thursday", "friday", "saturday"]), `session_length`

#### **🔄 LOADING BREAK 5**
```
"Optimizing your workout schedule..."
"Ensuring proper muscle recovery between sessions"
[2-3 seconds]
```

#### **17. Logging Preference**
- Prompt: "How do you want to log your meals?"
- Options: Search database / Manual entry
- Note: Camera and barcode reserved for Phase 2
- Store: `logging_methods`

#### **18. Preferences & Consent**
- Prompt: "Just a few more preferences"
- Inputs:
  - **Notifications (multi-select toggles):**
    - Daily weigh-in reminders
    - Meal logging reminders
    - Workout reminders
    - Motivational check-ins
  - **Health Disclaimer (required checkbox):**
    - "I understand this app provides general wellness information and is not medical advice"
    - Additional text: "If you have any medical conditions, please consult your doctor before starting"
- Store: `notification_preferences`, `disclaimer_accepted: true`

#### **19. Data Storage Preference**
- Prompt: "Do you want your data saved only on this device or backed up to the cloud?"
- Options:
  - Device only (private + offline)
  - Cloud backup (sync across devices)
- Store: `sync_preference`

---

### Major Loading Sequence (AI Generation)

#### **Screen 1: Metabolic Baseline (15% progress)**
```
[Circular progress indicator with pulse]
"Calculating your metabolic baseline..."

💡 Tip: Your metabolism is unique to you—
that's why we personalize everything
```
Duration: 3-5 seconds

#### **Screen 2: Meal Plan Generation (45% progress)**
```
[Circular progress indicator with pulse]
"Designing your personalized meal plan..."

💡 Tip: Protein helps you stay fuller longer

[Rotating tips every 5 seconds:]
• Meal prep on weekends saves time
• Eating same breakfast daily simplifies decisions
```
Duration: 10-20 seconds (OpenAI API call)

#### **Screen 3: Workout Plan Generation (75% progress)**
```
[Circular progress indicator with pulse]
"Building your workout program..."

💡 Tip: Muscle is built during rest,
not during workouts—recovery matters!

[Rotating tips every 5 seconds:]
• Progressive overload is key to getting stronger
• Compound exercises give most bang for buck
• Consistency beats intensity every time
```
Duration: 10-20 seconds (OpenAI API call)

#### **Screen 4: Success Trajectory (95% progress)**
```
[Circular progress indicator with pulse]
"Analyzing your success trajectory..."

💡 Tip: Track progress with photos, not just
the scale—muscle weighs more!
```
Duration: 2-3 seconds

---

### Value Demonstration Screens (Pre-Paywall)

#### **Screen A: Weight Projection Graph**
```
"Here's Your Path to Success"

[Modern line graph showing:]
• Starting weight (today)
• Projected weekly progress (gradient line)
• Goal weight at goal date
• Shaded "healthy range" zone

Total Progress: -20 lbs
Timeline: 16 weeks
Average: -1.25 lbs/week

✓ Safe & Sustainable

[See Your Full Plan]
```

#### **Screen B: Daily Nutrition Targets**
```
"Your Personalized Daily Targets"

[4 circular progress rings in 2x2 grid with gradients]

🔥 Calories: 2,100-2,300
💪 Protein: 150-180g
🍞 Carbs: 200-250g
🥑 Fat: 60-75g

Calculated for your weight loss goal
and moderate activity lifestyle

[See Your Meal Plan]
```

#### **Screen C: Workout Overview**
```
"Your Custom Workout Plan"

[Visual weekly calendar with workout days highlighted]

Weekly Schedule:

🏋️ Strength Training
3 sessions/week (45 min)
• Upper Body
• Lower Body
• Full Body

🏃 Cardio
2 sessions/week (30 min)
• HIIT or Steady State

😴 Rest Days: 2/week

Designed for home (dumbbells)
with progressive overload

[See Day 1 Workout]
```

#### **Screen D: Sample Day Preview**
```
"Here's What Tuesday Looks Like"

🍽️ Your Meals

Breakfast
Greek Yogurt Parfait
450 cal • 30g protein

Lunch
Grilled Chicken Bowl
550 cal • 40g protein

Dinner
Salmon & Quinoa
700 cal • 45g protein

Snack
Protein Smoothie
200 cal • 25g protein

Daily Total: 1,900 cal

─────────────────────

💪 Today's Workout
Upper Body Strength (45 min)

• Bench Press - 4×8-10
• Bent-Over Rows - 4×10-12
• Shoulder Press - 3×10
• +4 more exercises

[Unlock Your Full Plan] 🔒
```

---

## 5. Technical Implementation Notes

### Calculations Required During Onboarding

#### **BMR (Basal Metabolic Rate)**
Calculated after Step 8 (Sex at Birth)

**Mifflin-St Jeor Equation:**
- Men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
- Women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161

#### **TDEE (Total Daily Energy Expenditure)**
Calculated after Step 9 (Daily Activity Level)

**Activity Multipliers:**
- Sedentary: BMR × 1.2
- Moderate: BMR × 1.4-1.5
- Active: BMR × 1.6-1.7

#### **Daily Calorie Target**
Based on goal type:
- **Weight Loss:** TDEE - 500 to 750 calories (for 1-1.5 lbs/week loss)
- **Weight Gain:** TDEE + 250 to 500 calories (for 0.5-1 lb/week gain)
- **Maintenance:** TDEE

#### **Macro Split**
Standard recommendations:
- **Protein:** 0.8-1.2g per lb of body weight (higher for muscle gain/preservation)
- **Fat:** 20-30% of total calories
- **Carbs:** Remaining calories

Adjustments based on dietary preference:
- Keto: Higher fat, very low carb
- Vegan/Vegetarian: Adjust protein sources

#### **Weekly Weight Change Rate**
```
rate = (goal_weight - current_weight) / weeks_to_goal
```

**Safety thresholds:**
- Weight loss: ≤ 2 lbs/week (warn if exceeded)
- Weight gain: ≤ 1 lb/week (warn if exceeded)

#### **Workout Frequency Recommendation**
Based on goal type:
- **Weight Loss:** 5 days (3 strength + 2 cardio)
- **Maintenance:** 4 days (3 strength + 1 cardio)
- **Weight Gain:** 4-5 days (4 strength + 1 cardio)

#### **Muscle Group Spacing Algorithm**
```
For Strength Training:
- Upper body → minimum 48hrs before next upper
- Lower body → minimum 48hrs before next lower
- Full body → minimum 48hrs before next full body

Smart split examples:
3x/week: Mon (Upper), Wed (Lower), Fri (Full)
4x/week: Mon (Push), Tue (Pull), Thu (Legs), Sat (Upper)
5x/week: Mon (Push), Tue (Legs), Wed (Pull), Fri (Upper), Sat (Lower)
```

### API Calls Required

#### **OpenAI API Call #1: Meal Plan Generation**
**Timing:** After Step 24 (Data Storage Preference)

**Prompt Structure:**
```
Generate a 7-day meal plan with the following parameters:

Goal: [goalType]
Daily Calories: [calculated_calories]
Macros: Protein [X]g, Carbs [Y]g, Fat [Z]g
Dietary Preference: [dietary_preference]
Avoid: [avoid_foods]
Preferred Cuisines: [preferred_cuisines]
Meal Prep Time: [meal_prep_time]
Variety Preference: [meal_variety_preference]
Budget Conscious: [budget_conscious]

Generate [breakfast, lunch, dinner, snack] for each day.
Include: meal name, ingredients, calories, macros, prep instructions.
```

**Expected Response:** Structured JSON with 7 days of meals

**Duration:** 10-20 seconds

#### **OpenAI API Call #2: Workout Plan Generation**
**Timing:** Immediately after meal plan generation

**Prompt Structure:**
```
Generate a weekly workout plan with the following parameters:

Goal: [goalType]
Workout Days: [workout_days_preferred]
Equipment: [equipment_type]
Session Duration: [session_length] minutes
Frequency Recommendation: [calculated_frequency]

Create a balanced split with:
- Strength training focus for [goal-specific outcomes]
- Appropriate cardio integration
- Proper muscle group spacing (48hr minimum between same groups)
- Progressive overload principles

For each workout day, include:
- Workout type (Upper/Lower/Push/Pull/Full Body/Cardio)
- Exercise list with sets, reps, rest periods
- Estimated duration
- Form cues and safety notes
```

**Expected Response:** Structured JSON with 7-day workout schedule

**Duration:** 10-20 seconds

---

## 6. Backend Considerations

### Data Storage Strategy

#### **User Profile Data**
Store all onboarding responses:
```json
{
  "user_id": "unique_id",
  "profile": {
    "goalType": "lose_weight",
    "weight_current": 180,
    "weight_goal": 160,
    "goal_date": "2025-03-04",
    "weekly_rate": -1.25,
    "height": 70,
    "age": 30,
    "sex": "male",
    "daily_activity_level": "moderate",
    "dietary_preference": "none",
    "avoid_foods": ["shellfish", "mushrooms"],
    "preferred_cuisines": ["mexican", "italian", "american"],
    "cooking_context": "cook_at_home",
    "meal_prep_time": "moderate",
    "meal_variety_preference": "balanced",
    "budget_conscious": true,
    "week_start_day": "sunday",
    "equipment_type": "home_dumbbells",
    "workout_days_preferred": ["tuesday", "wednesday", "thursday", "friday", "saturday"],
    "session_length": 45,
    "logging_methods": ["search", "manual"],
    "notification_preferences": ["weigh_in", "meal_logging", "workout"],
    "disclaimer_accepted": true,
    "sync_preference": "cloud"
  },
  "calculated_metrics": {
    "bmr": 1750,
    "tdee": 2450,
    "daily_calories": 1950,
    "macros": {
      "protein_g": 160,
      "carbs_g": 200,
      "fat_g": 65
    },
    "workout_frequency_recommended": 5
  },
  "created_at": "2025-11-04T10:30:00Z"
}
```

#### **Weekly Plan Data**
Generated from OpenAI API:
```json
{
  "user_id": "unique_id",
  "plan_week_start": "2025-11-04",
  "plan_generated_at": "2025-11-04T10:35:00Z",
  "weekly_plan": {
    "monday": {
      "date": "2025-11-04",
      "meals": {
        "breakfast": {
          "meal_id": "gen_001",
          "name": "Greek Yogurt Parfait",
          "calories": 450,
          "protein": 30,
          "carbs": 50,
          "fat": 15,
          "ingredients": [...],
          "instructions": "...",
          "prep_time_minutes": 10,
          "tags": ["quick", "high_protein", "breakfast"]
        },
        "lunch": { ... },
        "dinner": { ... },
        "snack": { ... }
      },
      "workout": {
        "type": "strength",
        "focus": "upper_body",
        "duration_minutes": 45,
        "exercises": [
          {
            "name": "Bench Press",
            "sets": 4,
            "reps": "8-10",
            "rest_seconds": 90,
            "notes": "Focus on controlled descent"
          },
          ...
        ]
      },
      "isRestDay": false
    },
    ...
  },
  "meal_feedback": {
    "liked": [],
    "disliked": []
  }
}
```

#### **Local vs Cloud Storage**
Based on user's `sync_preference`:

**Device Only:**
- Store all data in local device storage (SQLite, AsyncStorage, etc.)
- No server synchronization
- Faster, more private
- Risk: Data loss if device is lost

**Cloud Backup:**
- Store profile and plans on server (PostgreSQL, MongoDB, Firebase)
- Sync on app launch and after changes
- Cross-device access
- Requires authentication system

### Meal Plan Learning System

#### **Feedback Collection**
Each meal card in app has:
- Thumbs up 👍 button → adds to `liked` array
- Thumbs down 👎 button → adds to `disliked` array

#### **Regeneration Logic**
When generating new weekly plan:
```javascript
// Pseudocode
function generateMealPlan(userProfile, mealFeedback) {
  const basePrompt = buildMealPlanPrompt(userProfile);

  // Add learning layer
  if (mealFeedback.liked.length > 0) {
    const likedTags = extractTags(mealFeedback.liked);
    basePrompt += `\nUser loves meals with these characteristics: ${likedTags}`;
    basePrompt += `\nPrioritize similar meals.`;
  }

  if (mealFeedback.disliked.length > 0) {
    const dislikedMeals = mealFeedback.disliked.map(m => m.name);
    const dislikedTags = extractTags(mealFeedback.disliked);
    basePrompt += `\nAvoid these meals: ${dislikedMeals}`;
    basePrompt += `\nAvoid meals with: ${dislikedTags}`;
  }

  return callOpenAIAPI(basePrompt);
}
```

#### **Tag Extraction**
```javascript
function extractTags(meals) {
  const tagFrequency = {};
  meals.forEach(meal => {
    meal.tags.forEach(tag => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });
  });

  // Return tags that appear in >50% of meals
  return Object.keys(tagFrequency)
    .filter(tag => tagFrequency[tag] / meals.length > 0.5);
}
```

### Weekly Regeneration Schedule

#### **Trigger Logic**
Based on `week_start_day`:
```javascript
// Example: User shops on Sunday, week starts Monday
if (week_start_day === 'monday') {
  // Regenerate Saturday night at 11pm
  scheduleRegeneration('saturday', '23:00');
}
```

#### **Background Job**
- Check all users with approaching week start
- Generate new meal/workout plans
- Push notification: "Your new weekly plan is ready!"
- Incorporate latest meal feedback

---

## 7. UX/UI Specifications

### Visual Design Guidelines

#### **Color Palette (Suggested)**
- Primary: Vibrant blue/green for health/wellness
- Secondary: Warm orange for energy/motivation
- Success: Green for completed tasks
- Warning: Yellow/orange for cautions
- Error: Red for alerts
- Neutral: Grays for text and backgrounds

#### **Typography**
- Headings: Bold, modern sans-serif (e.g., Inter, SF Pro)
- Body: Clean, readable sans-serif
- Numbers/Metrics: Tabular figures for alignment

#### **Iconography**
- 🎯 Goals
- 🍽️ Meals
- 💪 Workouts
- 📊 Progress/Analytics
- ⚙️ Settings
- 🔔 Notifications

### Component Specifications

#### **Circular Progress Indicators**
```
Specifications:
- Diameter: 120-150px
- Stroke width: 8-10px
- Background: Light gray (#E0E0E0)
- Progress: Gradient (primary color → secondary)
- Percentage: Center, large bold font
- Animation: Smooth progress fill (1-2s duration)
- Pulse effect: Subtle scale animation (98% → 100% → 98%)
```

#### **Loading Screens**
```
Layout:
┌─────────────────────────────────┐
│         [Top padding 30%]       │
│                                 │
│     [Circular progress]         │
│         [120px dia]             │
│                                 │
│    [Loading message]            │
│     [16px, medium]              │
│                                 │
│    [Tip/Educational text]       │
│  [14px, regular, gray, wrapped] │
│                                 │
│     [Bottom padding 30%]        │
└─────────────────────────────────┘

Background: White or light gray
Center-aligned content
```

#### **Value Demo Graphs**
```
Weight Projection Graph:
- X-axis: Time (weeks)
- Y-axis: Weight (lbs/kg)
- Line: Gradient stroke (2-3px)
- Data points: Small circles on milestones
- Shaded area: Fill under curve with opacity
- Grid: Subtle gray lines
- Labels: Week numbers, weight values
- Legend: Start, Goal, Current (if applicable)

Nutrition Rings:
- 4 rings in 2x2 grid or single row
- Each ring: Different gradient
- Center text: Value + unit
- Below ring: Label (Calories, Protein, etc.)
- Size: 80-100px diameter each
```

#### **Calendar/Day Selector**
```
Weekly Calendar Grid:
┌───┬───┬───┬───┬───┬───┬───┐
│ M │ T │ W │ T │ F │ S │ S │
├───┼───┼───┼───┼───┼───┼───┤
│ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │10 │
└───┴───┴───┴───┴───┴───┴───┘

Unselected: Light gray background, dark text
Selected: Primary color background, white text
Hover/Touch: Scale slightly (102%)
Tap animation: Quick pulse
```

### Animation Specifications

#### **Transition Animations**
```
Icon Morph (🍎 → 💪):
- Duration: 1000ms
- Easing: ease-in-out
- Steps:
  1. Fade out first icon (300ms)
  2. Scale transition (400ms)
  3. Fade in second icon (300ms)

Screen Transitions:
- Type: Slide or fade
- Duration: 300-400ms
- Direction: Forward = slide left, Back = slide right
```

#### **Loading Animations**
```
Circular Progress:
- Fill animation: Smooth ease-out
- Duration: Match actual loading time
- Update: Every 100ms for smooth visuals

Pulse Effect:
- Scale: 1.0 → 1.02 → 1.0
- Duration: 1500ms
- Repeat: Infinite
- Easing: ease-in-out
```

#### **Micro-interactions**
```
Button Press:
- Scale down to 0.96
- Duration: 100ms
- Bounce back: 150ms

Checkmark Success:
- Scale in from 0.5 to 1.0
- Rotate 360° during scale
- Duration: 400ms
- Green color pulse
```

### Accessibility Considerations

#### **Text Size**
- Minimum body text: 14px
- Headings: 20-28px
- Support dynamic type sizing (iOS) / font scaling (Android)

#### **Color Contrast**
- Minimum contrast ratio: 4.5:1 for body text
- 3:1 for large text (18px+)
- Don't rely on color alone for information

#### **Touch Targets**
- Minimum size: 44x44px (iOS HIG) / 48x48dp (Material Design)
- Spacing between targets: At least 8px

#### **Screen Reader Support**
- All interactive elements labeled
- Progress updates announced
- Form inputs with proper labels
- Logical navigation order

---

## 8. Data Structures

### User Profile Schema
```typescript
interface UserProfile {
  user_id: string;
  profile: {
    // Personal Metrics
    goalType: 'gain_weight' | 'lose_weight' | 'maintain_weight';
    weight_current: number; // lbs or kg
    weight_goal: number;
    goal_date: string; // ISO date
    weekly_rate: number; // lbs per week
    height: number; // inches or cm
    age: number;
    sex: 'male' | 'female' | 'prefer_not_to_say';

    // Activity & Lifestyle
    daily_activity_level: 'sedentary' | 'moderate' | 'active';

    // Dietary Preferences
    dietary_preference: 'none' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'custom';
    avoid_foods: string[];
    preferred_cuisines: string[];
    cooking_context: 'cook_at_home' | 'eat_out_often' | 'mix_of_both';

    // Meal Planning
    meal_prep_time: 'minimal' | 'moderate' | 'extended';
    meal_variety_preference: 'meal_prep' | 'maximum_variety' | 'balanced';
    budget_conscious: boolean;
    week_start_day: 'monday' | 'sunday' | 'thursday' | 'flexible';

    // Workout Preferences
    equipment_type: 'home_bodyweight' | 'home_dumbbells' | 'full_gym';
    workout_days_preferred: string[]; // ['monday', 'wednesday', ...]
    session_length: 20 | 30 | 45 | 60;

    // App Preferences
    logging_methods: string[]; // ['search', 'manual']
    notification_preferences: string[]; // ['weigh_in', 'meal_logging', ...]
    disclaimer_accepted: boolean;
    sync_preference: 'device_only' | 'cloud_backup';
  };

  calculated_metrics: {
    bmr: number;
    tdee: number;
    daily_calories: number;
    macros: {
      protein_g: number;
      carbs_g: number;
      fat_g: number;
    };
    workout_frequency_recommended: number;
  };

  created_at: string; // ISO timestamp
  updated_at: string;
}
```

### Weekly Plan Schema
```typescript
interface WeeklyPlan {
  user_id: string;
  plan_week_start: string; // ISO date (e.g., '2025-11-04')
  plan_generated_at: string; // ISO timestamp

  weekly_plan: {
    [day: string]: DailyPlan; // 'monday', 'tuesday', etc.
  };

  meal_feedback: {
    liked: MealFeedback[];
    disliked: MealFeedback[];
  };
}

interface DailyPlan {
  date: string; // ISO date
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snack: Meal;
  };
  workout: Workout | null;
  isRestDay: boolean;
}

interface Meal {
  meal_id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Ingredient[];
  instructions: string;
  prep_time_minutes: number;
  tags: string[];
  image_url?: string; // Optional, for Phase 2
}

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface Workout {
  workout_id: string;
  type: 'strength' | 'cardio';
  focus: 'upper_body' | 'lower_body' | 'full_body' | 'push' | 'pull' | 'legs' | 'cardio';
  duration_minutes: number;
  exercises: Exercise[];
  notes?: string;
}

interface Exercise {
  exercise_id: string;
  name: string;
  sets?: number; // For strength
  reps?: string; // e.g., '8-10' or '12'
  duration_minutes?: number; // For cardio
  rest_seconds?: number;
  intensity?: 'low' | 'moderate' | 'high'; // For cardio
  notes?: string;
  video_url?: string; // Optional, for Phase 2
}

interface MealFeedback {
  meal_id: string;
  name: string;
  tags: string[];
  feedback_date: string; // ISO timestamp
}
```

### Progress Tracking Schema
```typescript
interface ProgressEntry {
  user_id: string;
  entry_date: string; // ISO date
  weight: number;

  // Optional metrics
  body_measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };

  photos?: {
    front?: string; // URL or base64
    side?: string;
    back?: string;
  };

  notes?: string;
  mood?: 'great' | 'good' | 'okay' | 'struggling';

  created_at: string; // ISO timestamp
}

interface MealLog {
  user_id: string;
  log_date: string; // ISO date
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';

  // If from meal plan
  planned_meal_id?: string;

  // If custom/searched
  meal_name?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;

  logged_at: string; // ISO timestamp
}

interface WorkoutLog {
  user_id: string;
  log_date: string; // ISO date

  // If from workout plan
  planned_workout_id?: string;

  // Actual data
  completed: boolean;
  duration_minutes: number;
  exercises_completed: {
    exercise_id: string;
    sets_completed: number;
    reps_completed: number[];
    weight_used?: number;
  }[];

  notes?: string;
  difficulty?: 'easy' | 'moderate' | 'hard';

  logged_at: string; // ISO timestamp
}
```

---

## 9. Success Metrics

### How to Ensure Users Achieve Their Goals

#### **1. Realistic Goal Setting**
- ✅ Validate timeline against safe weight change rates
- ✅ Show warnings for aggressive timelines
- ✅ Suggest adjusted dates when necessary
- ✅ Display projected progress graph to set expectations

#### **2. Personalized Plans**
- ✅ Calculate precise TDEE based on individual metrics
- ✅ Adjust macros for dietary preferences
- ✅ Match meal complexity to cooking context and time
- ✅ Align workout plans with equipment and schedule

#### **3. Adaptive Learning**
- ✅ Collect meal feedback (likes/dislikes)
- ✅ Improve recommendations over time
- ✅ Avoid foods user doesn't enjoy
- ✅ Prioritize meals user loves

#### **4. Sustainable Habits**
- ✅ Align with user's natural schedule (grocery shopping day)
- ✅ Respect time constraints (meal prep time, workout duration)
- ✅ Include rest days (recovery is essential)
- ✅ Variety preferences (prevent boredom)

#### **5. Progress Tracking**
- ✅ Daily weigh-in logging
- ✅ Meal completion tracking
- ✅ Workout completion tracking
- ✅ Visual progress graphs
- ✅ Milestone celebrations

#### **6. Accountability Features**
- ✅ Push notifications for weigh-ins, meals, workouts
- ✅ Streak tracking (consecutive days logged)
- ✅ Weekly check-ins (how's it going?)
- ✅ Motivational messages

#### **7. Safety Guardrails**
- ✅ Health disclaimers (consult doctor)
- ✅ Safe weight change rate limits
- ✅ Proper workout form cues
- ✅ Balanced nutrition (not extreme diets)
- ✅ Adequate rest days

### Key Performance Indicators (KPIs)

#### **User Engagement**
- Onboarding completion rate
- Daily active users
- Meal logging frequency
- Workout logging frequency
- Weigh-in logging frequency

#### **User Success**
- % of users reaching their goal weight
- Average time to goal achievement
- Adherence rate (logged vs planned)
- User retention (30-day, 60-day, 90-day)

#### **Plan Quality**
- Meal satisfaction score (likes vs dislikes ratio)
- Workout completion rate
- Plan regeneration frequency
- User customization frequency

---

## 10. Future Enhancements

### Phase 2 Features (Post-MVP)

#### **Advanced Meal Logging**
- ✅ Camera-based food recognition (OpenAI Vision API)
  - User takes photo of meal
  - AI identifies food and estimates portions
  - User confirms/adjusts before logging

- ✅ Barcode scanning
  - Scan packaged foods
  - Auto-populate nutrition info
  - Build custom meal database

#### **Social Features**
- Share progress with friends
- Group challenges (who can stick to plan longest?)
- Community recipes (user-submitted meals)
- Support groups / forums

#### **Advanced Analytics**
- Trend analysis (weight over time with predictions)
- Macro breakdown charts
- Workout performance tracking (strength gains over time)
- Correlation insights (e.g., "You lose more weight on weeks with 5+ workouts")

#### **Integration Capabilities**
- Fitness tracker sync (Apple Watch, Fitbit, Garmin)
  - Auto-import step count, workouts, heart rate
  - Adjust TDEE based on actual activity

- Smart scale integration
  - Auto-log weight measurements
  - Track body fat %, muscle mass

- Calendar integration
  - Sync workout schedule to calendar
  - Meal prep reminders

#### **Gamification**
- Achievement badges
  - "7-Day Streak"
  - "First 5 lbs Lost"
  - "100 Workouts Completed"
- Level system (beginner → intermediate → advanced)
- Rewards for consistency

#### **AI Coach Chat**
- Conversational AI assistant
- Answer nutrition questions
- Provide motivation
- Troubleshoot plateaus
- Suggest meal swaps

#### **Meal Plan Enhancements**
- Recipe video tutorials
- Shopping list generation with store aisles
- Meal delivery service integration
- Leftover management (use dinner leftovers for lunch)

#### **Workout Enhancements**
- Video demonstrations for each exercise
- Form check (camera-based AI)
- Progressive overload auto-adjustment
- Alternative exercises (if equipment unavailable)
- Stretching & mobility routines

#### **Premium Features**
- 1-on-1 virtual coaching sessions
- Custom meal plans from dietitians
- Advanced body composition tracking
- Priority customer support

---

## Appendices

### A. Workout Split Examples

#### **3-Day Split (Maintenance/Beginners)**
- Monday: Full Body
- Wednesday: Full Body
- Friday: Full Body

#### **4-Day Split (Weight Gain)**
- Monday: Upper Body (Push)
- Tuesday: Lower Body
- Thursday: Upper Body (Pull)
- Saturday: Full Body

#### **5-Day Split (Weight Loss)**
- Monday: Upper Body (Push)
- Tuesday: Cardio (HIIT 30min)
- Wednesday: Lower Body
- Thursday: Upper Body (Pull)
- Friday: Full Body
- Saturday: Cardio (Steady State 30min)

### B. Sample OpenAI Prompts

#### **Meal Plan Generation Prompt**
```
You are a professional nutritionist and meal planner. Generate a personalized 7-day meal plan with the following requirements:

USER PROFILE:
- Goal: Lose weight (target: lose 20 lbs in 16 weeks)
- Daily Calorie Target: 1,950 calories
- Macros: Protein 160g, Carbs 200g, Fat 65g
- Dietary Preference: None (omnivore)
- Avoid: Shellfish, mushrooms
- Preferred Cuisines: Mexican, Italian, American
- Cooking Context: Cooks at home
- Meal Prep Time: Moderate (30 minutes)
- Variety Preference: Balanced (some variety, some repeats)
- Budget Conscious: Yes

MEAL FEEDBACK (from previous weeks):
- User loves: Chicken Burrito Bowl, Greek Yogurt Parfait, Salmon dishes
- User dislikes: Tuna Salad, anything with mushrooms

REQUIREMENTS:
1. Generate breakfast, lunch, dinner, and one snack for each day (Monday-Sunday)
2. Each meal should include:
   - Meal name
   - Complete ingredient list with amounts
   - Step-by-step cooking instructions
   - Nutritional info (calories, protein, carbs, fat)
   - Estimated prep time
   - Tags (e.g., quick, high_protein, mexican, etc.)

3. Daily totals should be within ±100 calories of target
4. Prioritize budget-friendly ingredients (chicken thighs over breast, frozen vegetables, etc.)
5. Include meals similar to user's liked meals
6. Avoid all disliked ingredients
7. Balance variety with meal prep efficiency (some repeated breakfasts/lunches are okay)

Return the response as a valid JSON object following this structure:
{
  "monday": {
    "breakfast": { "name": "...", "calories": 450, ... },
    "lunch": { ... },
    "dinner": { ... },
    "snack": { ... }
  },
  ...
}
```

#### **Workout Plan Generation Prompt**
```
You are a certified personal trainer. Generate a personalized weekly workout plan with the following requirements:

USER PROFILE:
- Goal: Lose weight (improve body composition while losing fat)
- Workout Days: Tuesday, Wednesday, Thursday, Friday, Saturday (5 days)
- Equipment: Home gym with dumbbells and resistance bands
- Session Duration: 45 minutes
- Recommended Frequency: 3 strength + 2 cardio sessions

REQUIREMENTS:
1. Distribute 3 strength training sessions and 2 cardio sessions across the selected days
2. Ensure proper muscle group spacing (minimum 48 hours between same muscle groups)
3. For strength sessions, include:
   - 6-8 exercises per session
   - Sets and rep ranges appropriate for fat loss and muscle preservation
   - Rest periods
   - Form cues and safety notes
   - Exercises that can be done with dumbbells/resistance bands

4. For cardio sessions, include:
   - Type (HIIT or steady-state)
   - Duration (within 45-minute limit)
   - Intensity level
   - Structure (intervals if HIIT)

5. Make Sunday and Monday rest days
6. Use progressive overload principles (mention progression in notes)

Return the response as a valid JSON object following this structure:
{
  "monday": { "isRestDay": true, "workout": null },
  "tuesday": {
    "isRestDay": false,
    "workout": {
      "type": "strength",
      "focus": "upper_body",
      "duration_minutes": 45,
      "exercises": [
        {
          "name": "Dumbbell Bench Press",
          "sets": 4,
          "reps": "8-10",
          "rest_seconds": 90,
          "notes": "Focus on controlled descent, chest stretch at bottom"
        },
        ...
      ]
    }
  },
  ...
}
```

### C. Error Handling Scenarios

#### **Timeline Too Aggressive**
```
User Input:
- Current Weight: 200 lbs
- Goal Weight: 160 lbs
- Goal Date: 8 weeks from now

Calculation:
- Total loss needed: 40 lbs
- Weeks available: 8
- Rate required: 5 lbs/week ❌ UNSAFE

System Response:
"Warning: This timeline requires losing 5 lbs per week, which is not safe or sustainable.

We recommend:
- Safe rate: 1.5-2 lbs/week
- Adjusted timeline: March 15, 2026 (20 weeks)
- This gives you a healthy 2 lbs/week loss

[Adjust to Safe Date] [I Understand Risks, Continue]"
```

#### **Insufficient Workout Days Selected**
```
User Input:
- Goal: Lose weight
- Recommended frequency: 5 days
- Selected days: Monday, Wednesday (2 days)

System Response:
"You've selected 2 workout days, but we recommend 5 days per week for optimal weight loss results.

Selecting fewer days may:
- Slow your progress significantly
- Require more restrictive calorie intake
- Make your goal timeline harder to achieve

Would you like to:
[Add More Days] [Continue with 2 Days]"
```

#### **API Failure During Plan Generation**
```
Scenario: OpenAI API timeout or error during meal plan generation

User Experience:
[Loading screen shows error state]

"Oops! We're having trouble generating your plan right now.

This might be due to high server demand.

[Try Again] [Save Progress & Try Later]"

Backend:
- Save all onboarding data
- Allow user to retry without re-entering info
- Send error log for monitoring
```

---

## Summary & Next Steps

### What We Accomplished
✅ Designed complete 20-step onboarding flow (revised from 24)
✅ Incorporated 6 strategic loading/transition screens
✅ Added progress bar and back button navigation
✅ Defined all data collection points
✅ Established calculation methods (BMR, TDEE, macros)
✅ Created meal feedback learning system
✅ Designed workout distribution algorithm
✅ Specified UX/UI requirements
✅ Outlined technical implementation approach
✅ Identified success metrics and safety guardrails
✅ Planned Phase 2 enhancements

### Ready for Development
This onboarding flow is now fully specified and ready for:
- Frontend implementation (React Native/Expo)
- Backend API development (Node.js on Render)
- OpenAI integration for plan generation
- Local/cloud storage setup
- Testing and iteration

### Moving to Question 2
With onboarding finalized, we can now proceed to:
**Question 2: Meal Planning Details** - Deep dive into how users interact with their meal plans, meal logging, recipe views, shopping lists, and meal management features.

---

---

## 11. Revisions

### Revision 1 - November 4, 2025 (Same Day)

**Changes Made:**

1. **Merged Steps to Reduce Onboarding Length (24 → 20 steps)**
   - **Step 6:** Combined Height + Age → "Personal Details" (also includes Sex at Birth)
   - **Step 8:** Combined Dietary Preference + Allergies → "Dietary Preferences & Restrictions"
   - **Step 16:** Combined Workout Days + Session Duration → "Workout Schedule"
   - **Step 18:** Combined Notifications + Health Disclaimer → "Preferences & Consent"

2. **Removed "Prefer not to say" Option**
   - Sex at Birth now only has two options: Male / Female
   - Rationale: Required for accurate BMR/TDEE calculations
   - Added note explaining why this information is necessary

3. **Added Navigation Elements**
   - **Progress Bar:** Top of screen showing "Step X of 20"
   - **Back Button:** Top-left corner (< icon) on all screens except Welcome
   - Allows users to navigate back and forth through onboarding

4. **Removed One Transition Break**
   - Original TRANSITION BREAK 6 ("Almost there!") removed
   - Now 6 loading/transition screens instead of 7
   - Flow is tighter without impacting UX

**Impact:**
- Reduced friction (4 fewer taps to complete onboarding)
- Maintained all data collection necessary for personalization
- Improved navigation with back button and progress visibility
- More accurate calculations with required sex at birth field

**Sections Updated:**
- Section 4: Final Onboarding Flow (complete rewrite with new numbering)
- Section 11: This revisions section added
- Summary & Next Steps updated to reflect 20 steps

---

**Document Version:** 1.1
**Last Updated:** November 4, 2025 (Revised)
**Next Review:** After Q2 finalization
