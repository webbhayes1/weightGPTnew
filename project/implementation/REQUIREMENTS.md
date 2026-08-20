# Requirements Document - WeightGPT MVP

**Project:** WeightGPT Mobile Application
**Document Version:** 1.0
**Status:** Final
**Created:** 2025-11-07
**Last Updated:** 2025-11-07

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [User Stories by Feature](#user-stories-by-feature)
   - [Q1: Onboarding](#q1-onboarding)
   - [Q2: Meal Planning](#q2-meal-planning)
   - [Q3.0: Navigation & App Shell](#q30-navigation--app-shell)
   - [Q3.1: Settings & Profile](#q31-settings--profile)
   - [Q3.2: AI-Powered Logging](#q32-ai-powered-logging)
   - [Q3.3: Meal & Workout Swapping](#q33-meal--workout-swapping)
   - [Q3.4: Weekly Planning & Grocery](#q34-weekly-planning--grocery)
   - [Q3.5: Progress & Analytics](#q35-progress--analytics)
   - [Q3.6: History & Saved Items](#q36-history--saved-items)
   - [Q3.7: Offline Mode & Sync](#q37-offline-mode--sync)
3. [Non-Functional Requirements](#non-functional-requirements)
4. [Success Metrics & KPIs](#success-metrics--kpis)
5. [Feature Prioritization](#feature-prioritization)
6. [Dependencies & Assumptions](#dependencies--assumptions)
7. [Out of Scope](#out-of-scope)

---

## Executive Summary

### Project Overview

WeightGPT is a mobile application (iOS & Android) that helps users achieve their weight goals through AI-powered personalized meal plans, custom workout programs, and intelligent progress tracking. The app uses OpenAI's GPT-4o-mini to generate personalized nutrition and fitness plans that learn from user feedback over time.

### Target Users

- **Primary:** Busy professionals (ages 28-35) seeking to lose 15-20 lbs with limited time for meal prep
- **Secondary:** Fitness beginners (ages 23-30) seeking to gain 10-15 lbs of muscle with limited equipment
- **Tertiary:** Health-conscious individuals (ages 35-45) seeking to maintain weight with specific dietary needs

### MVP Scope

The MVP focuses on delivering a complete, user-friendly weight management solution that includes:
- **Zero-typing onboarding** (17 steps, < 2 minutes)
- **AI-generated personalized plans** (meals + workouts)
- **Intelligent logging** (natural language AI parsing)
- **Progress tracking** (weight graph, analytics, achievements)
- **Offline capability** (100% logging works offline)
- **Subscription paywall** (40%+ conversion target)

### Key Success Criteria

- **Retention:** >60% Day 1, >40% Day 7, >30% Day 30
- **Conversion:** >40% paywall conversion rate
- **Performance:** <2s app launch, <300ms screen transitions
- **Stability:** >99.5% crash-free sessions
- **Coverage:** >80% code test coverage

---

## User Stories by Feature

### Q1: Onboarding

#### US-001: Complete Zero-Typing Onboarding
**As a** new user
**I want** to complete the onboarding flow without typing
**So that** I can quickly get personalized recommendations

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ User can complete all 17 onboarding steps using only taps and scroll pickers
- ✅ No keyboard appears during entire onboarding flow
- ✅ Progress bar shows "Step X of 17" at all times
- ✅ Back button available on all screens (except Welcome)
- ✅ Can complete onboarding in under 2 minutes

**API Endpoints:**
- `POST /api/auth/register` - Create user account
- `PUT /api/users/:id/profile` - Save onboarding data

**Database Tables:**
- `users` - Store all profile data

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md)

---

#### US-002: Set Weight Goal (Lose/Gain/Maintain)
**As a** new user
**I want** to set my weight goal
**So that** the app can create a personalized plan

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ User can select from 3 options: Gain Weight, Lose Weight, Maintain Weight
- ✅ Large tap targets for easy selection
- ✅ If "Maintain Weight" selected, goal_weight = current_weight automatically
- ✅ If "Maintain Weight" selected, goal_date step is skipped
- ✅ Selection is visually indicated (active state styling)

**Data Stored:**
- `goal`: 'lose_weight' | 'gain_weight' | 'maintain'

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Step 2

---

#### US-003: Input Current & Goal Weight
**As a** new user
**I want** to input my current and goal weight using scroll pickers
**So that** I can avoid typing and errors

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Scroll wheel interface for weight (80-400 lbs or 35-180 kg)
- ✅ Toggle between lbs and kg at top of screen
- ✅ No keyboard input required
- ✅ Shows real-time difference (e.g., "+15 lbs" or "-20 lbs") on goal weight screen
- ✅ For "Maintain Weight" users, goal weight step is skipped

**Data Stored:**
- `current_weight`: number (lbs)
- `goal_weight`: number (lbs)

**Validation Rules:**
- Weight must be between 80-400 lbs (35-180 kg)
- Goal weight must differ from current weight by at least 1 lb (unless maintaining)

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Steps 3-4

---

#### US-004: Set Safe Goal Timeline
**As a** new user
**I want** the app to validate my goal timeline for safety
**So that** I don't set unrealistic or unhealthy weight change rates

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ User selects goal date using date picker (4-52 weeks range)
- ✅ System calculates required lbs/week rate instantly (no loading screen)
- ✅ If rate ≤ 2 lbs/week (loss) or ≤ 1 lb/week (gain), shows ✓ "Healthy pace" message
- ✅ If rate > 2 lbs/week (loss), shows ⚠️ warning + recommended safer date
- ✅ User can choose "Use Recommended Date" or "Continue Anyway"
- ✅ "I'm not sure - suggest for me" button calculates optimal date (0.5s, no loading)

**Data Stored:**
- `goal_date`: Date
- `weekly_rate`: number (lbs/week)

**Validation Rules:**
- Maximum safe rate: 2 lbs/week for weight loss
- Maximum safe rate: 1 lb/week for weight gain
- Minimum timeline: 4 weeks
- Maximum timeline: 52 weeks

**Calculations:**
- `weekly_rate = (goal_weight - current_weight) / weeks_to_goal`
- For "not sure" option: Use 1.25 lbs/week for loss, 0.75 lbs/week for gain

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Step 5

---

#### US-005: Enter Personal Details
**As a** new user
**I want** to enter my height, age, and sex using tap/scroll interfaces
**So that** the app can accurately calculate my calorie needs

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Height input: Toggle between Feet/Inches and CM
- ✅ If Feet/Inches: Dual scroll pickers (4-7 ft, 0-11 inches)
- ✅ If CM: Single scroll picker (120-220 cm)
- ✅ Age input: Scroll picker (13-100 years)
- ✅ Age 13-17: Shows required checkbox "I have parent/guardian permission"
- ✅ Age 65+: Shows medical disclaimer after selection
- ✅ Sex at birth: Large tap buttons [Male] [Female]
- ✅ Helper text explains why sex at birth is required (accurate calorie calculations)
- ✅ No keyboard input required for any field

**Data Stored:**
- `height`: number (inches)
- `age`: number
- `gender`: 'male' | 'female' | 'other'

**Validation Rules:**
- Height: 120-220 cm (47-87 inches)
- Age: 13-100 years
- Age 13-17 requires permission checkbox
- Age 65+ shows disclaimer (does not block)

**Background Processing:**
- BMR calculation starts immediately after this step
- Ready for Loading Break 1

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Step 6

---

#### US-006: Select Daily Activity Level
**As a** new user
**I want** to indicate my typical daily activity level
**So that** the app can calculate my Total Daily Energy Expenditure (TDEE)

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Three clear options with descriptive text:
  - Sedentary (desk job, minimal movement)
  - Moderate (on your feet regularly)
  - Active (physical job, constantly moving)
- ✅ Large tap targets
- ✅ Selection is visually indicated

**Data Stored:**
- `activity_level`: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active'

**Background Processing:**
- TDEE, daily calories, and macros calculated immediately
- Loading screen can show results without delay

**Calculations Triggered:**
- `TDEE = BMR × activity_multiplier`
- `daily_calories = TDEE ± deficit/surplus`
- `macros = calculate_macros(daily_calories, goal, weight)`

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Step 7

---

#### US-007: See Personalized Calorie Target (Loading Break 1)
**As a** new user
**I want** to see my personalized daily calorie target
**So that** I understand the plan before continuing

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ After Step 7, shows loading indicator for ~2 seconds
- ✅ Loading text: "Calculating your personalized targets..."
- ✅ Success screen shows:
  - ✓ Targets Calculated
  - "Your estimated daily target: 🔥 ~2,150 calories"
  - Helper text: "This is based on your metabolism and [weight loss] goal"
- ✅ Calculation completes in background (appears instant to user)
- ✅ [Continue] button to proceed

**Calculations Displayed:**
- `daily_calories` (rounded to nearest 50)

**Why This Works:**
- User has answered 6 questions (earned the wait)
- Calculation already done in background (feels instant)
- Big reveal moment ("Here's YOUR number")

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Loading Break 1

---

#### US-008: Set Dietary Preferences & Restrictions
**As a** new user
**I want** to specify my dietary preferences and food restrictions
**So that** the app generates meal plans I can actually eat

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Dietary Preference tap-to-select: [None] [Vegetarian] [Vegan] [Pescatarian] [Keto] [Custom]
- ✅ Foods to Avoid: Pre-populated chips (Common: Dairy, Gluten, Nuts, Shellfish, Eggs, Soy, Fish)
- ✅ [+ Add More] shows extended list of 30+ allergens/dislikes
- ✅ NO free text input - all tap-to-select
- ✅ Favorite Cuisines: Multi-select chips (Mediterranean, Asian, Mexican, American, Italian, Indian, Greek)
- ✅ [Skip Cuisines →] button for users who don't care

**Data Stored:**
- `dietary_restrictions`: string[] (e.g., ['vegetarian', 'gluten_free'])
- `avoided_foods`: string[]
- `preferred_cuisines`: string[]

**Validation Rules:**
- At least one dietary preference must be selected (default: "None")
- Foods to avoid is optional
- Cuisines are optional (can skip)

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Step 8

---

#### US-009: Set Meal Prep Time Preference
**As a** new user
**I want** to indicate how much time I have for meal prep
**So that** the app generates recipes that fit my schedule

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Three options:
  - Minimal (< 15 minutes per meal)
  - Moderate (30 minutes per meal)
  - Extended (60+ minutes per meal)
- ✅ Helper text: "We'll tailor recipes to fit your available time"
- ✅ Large tap targets

**Data Stored:**
- `meal_prep_time`: 'minimal' | 'moderate' | 'extended'

**Impact on Meal Generation:**
- Minimal: Quick recipes, minimal cooking steps
- Moderate: Standard recipes with reasonable prep
- Extended: Complex recipes allowed

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Step 9

---

#### US-010: Set Meal Variety Preference
**As a** new user
**I want** to choose between meal prep style or maximum variety
**So that** the weekly plan matches my eating habits

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Three options:
  - Meal prep style (fewer recipes, repeat meals throughout week)
  - Maximum variety (different meals every day)
  - Balanced (some variety, some repeats)
- ✅ Clear descriptions help user understand trade-offs

**Data Stored:**
- `meal_variety_preference`: 'meal_prep' | 'variety' | 'balanced'

**Impact on Meal Generation:**
- Meal prep: 3-5 unique recipes, repeated across week
- Variety: 14-21 unique recipes (2-3 meals × 7 days)
- Balanced: 7-10 unique recipes with some repeats

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Step 10

---

#### US-011: Set Eating Pattern
**As a** new user
**I want** to specify how many meals I eat and which meal types
**So that** the app generates a plan that matches my eating schedule

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Number of meals selection: [2 meals] [3 meals (recommended)] [4-5 meals (including snacks)]
- ✅ Follow-up on same screen: "Which meals do you eat?"
- ✅ Multi-select checkboxes: Breakfast, Lunch, Dinner, Snacks between meals
- ✅ Default selections based on meals_per_day:
  - 2 meals: Lunch + Dinner pre-selected
  - 3 meals: All three main meals pre-selected
  - 4-5 meals: All three + snacks pre-selected
- ✅ Helper text: "We'll create a plan that fits your eating style"

**Data Stored:**
- `meals_per_day`: 2 | 3 | 4
- `meal_pattern`: ('breakfast' | 'lunch' | 'dinner' | 'snack')[]
- `includes_snacks`: boolean

**Validation Rules:**
- Must select at least 2 meal types
- Number of selected meal types should match meals_per_day

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Step 11

---

#### US-012: Set Budget Preference (Optional)
**As a** new user
**I want** to indicate if I prefer budget-friendly ingredients
**So that** meal plans fit my financial constraints

**Priority:** P1 (Post-MVP - Nice to Have)

**Acceptance Criteria:**
- ✅ Two options: [Yes, prefer budget-friendly] [No preference]
- ✅ [Skip →] button prominently displayed
- ✅ Helper text explains impact on ingredient selection

**Data Stored:**
- `budget_preference`: 'budget' | 'no_preference' | null

**Impact on Meal Generation:**
- Budget: Prioritize affordable ingredients, avoid expensive proteins/specialty items
- No preference: Normal ingredient selection

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Step 12

---

#### US-013: Set Workout Frequency
**As a** new user
**I want** to specify how many days per week I want to work out
**So that** the app creates a realistic workout schedule

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Scroll picker: 0-7 days per week
- ✅ Helper text explains impact on plan generation
- ✅ 0 days option available (user only wants meal plan)

**Data Stored:**
- `workout_frequency`: number (0-7)

**Impact on Workout Generation:**
- 0 days: No workout plan generated
- 1-2 days: Full-body workouts
- 3-4 days: Upper/lower or push/pull split
- 5-7 days: Muscle group split (e.g., bro split)

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Step 13

---

#### US-014: Set Preferred Workout Days
**As a** new user
**I want** to choose which days I prefer to work out
**So that** the workout plan fits my weekly schedule

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ If workout_frequency > 0, shows day selector
- ✅ Multi-select checkboxes for each day of week
- ✅ Cannot select more days than workout_frequency
- ✅ If user selects more than workout_frequency, shows warning
- ✅ [Flexible - let the app decide] option available
- ✅ If workout_frequency = 0, this step is skipped

**Data Stored:**
- `preferred_workout_days`: number[] (0-6, where 0 = Monday) or null (flexible)

**Validation Rules:**
- Number of selected days <= workout_frequency
- If flexible, workout_days = null

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Step 14

---

#### US-015: Set Available Equipment
**As a** new user
**I want** to indicate what workout equipment I have access to
**So that** the workout plan only includes exercises I can do

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Multi-select equipment chips:
  - [No equipment / Bodyweight] [Dumbbells] [Barbell] [Resistance Bands] [Pull-up Bar] [Gym Membership]
- ✅ Can select multiple options
- ✅ "No equipment" is mutually exclusive with other equipment options
- ✅ If workout_frequency = 0, this step is skipped

**Data Stored:**
- `available_equipment`: string[] (e.g., ['dumbbells', 'resistance_bands'])

**Impact on Workout Generation:**
- Filters workout library to only show exercises using available equipment
- "No equipment": Only bodyweight exercises
- "Gym Membership": All exercises available

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Step 15

---

#### US-016: Set Fitness Level
**As a** new user
**I want** to indicate my current fitness level
**So that** the workout plan matches my capabilities

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Three options:
  - Beginner (new to fitness or returning after long break)
  - Intermediate (work out regularly, comfortable with most exercises)
  - Advanced (experienced lifter, familiar with complex movements)
- ✅ Helper text explains what each level means
- ✅ If workout_frequency = 0, this step is skipped

**Data Stored:**
- `fitness_level`: 'beginner' | 'intermediate' | 'advanced'

**Impact on Workout Generation:**
- Beginner: Simpler exercises, lower volume, more rest
- Intermediate: Standard exercises, moderate volume
- Advanced: Complex exercises, higher volume, progressive overload

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Step 16

---

#### US-017: See Personalized Plan Summary (Loading Break 2)
**As a** new user
**I want** to see a summary of my personalized plan
**So that** I understand what I'm getting before the paywall

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Shows loading screen: "Creating your personalized plan..." (3-5 seconds)
- ✅ Progress indicators for:
  - "Analyzing your nutrition goals..."
  - "Designing your meal plan..."
  - "Creating your workout schedule..." (if workout_frequency > 0)
- ✅ Success screen shows summary:
  - Daily nutrition targets (calories, protein, carbs, fat)
  - Meal plan overview (number of meals per day, variety style)
  - Workout schedule (days per week, equipment used) - if applicable
  - Estimated time to goal (based on safe weekly rate)
- ✅ [Continue to See Your Full Plan] button

**Background Processing:**
- Meal plan generation (OpenAI API call ~$0.008)
- Workout plan generation (OpenAI API call ~$0.003) - if applicable
- Grocery list generation

**Data Displayed:**
- `daily_calories`, `macros`
- `meal_variety_preference`, `meals_per_day`
- `workout_frequency`, `fitness_level`
- `weeks_to_goal`

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Loading Break 2

---

#### US-018: View Value Demo Screens Before Paywall
**As a** new user
**I want** to see concrete examples of my personalized plan
**So that** I can make an informed decision about subscribing

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Demo Screen 1: Weight projection graph
  - Shows 2 data points: current weight + goal weight
  - Trend line connecting them
  - X-axis: Dates (today → goal date)
  - Y-axis: Weight (current ± 20 lbs range)
- ✅ Demo Screen 2: Sample daily meal plan
  - Shows meals for ONE day
  - Meal names, calories, macros
  - "This is just Day 1 - unlock 7 full days →"
- ✅ Demo Screen 3: Sample weekly workout schedule (if workout_frequency > 0)
  - Shows workout names for each preferred day
  - Exercise count per workout
  - "See full exercise details + form cues →"
- ✅ Each demo screen has [See More →] button leading to paywall

**Data Displayed:**
- Weight graph: `current_weight`, `goal_weight`, `goal_date`
- Sample meals: First day of generated meal plan
- Sample workouts: First week of generated workout plan

**Purpose:**
- Demonstrate value before asking for payment
- Show personalized content (not generic)
- Build confidence in plan quality

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Loading Break 3 + Screens 17A-17C

---

#### US-019: Subscribe via Paywall
**As a** new user
**I want** to subscribe to access my full personalized plan
**So that** I can start following the plan

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Paywall appears after value demo screens
- ✅ Shows 3 pricing options:
  - Monthly: $9.99/month
  - Annual: $59.99/year (save 50% badge)
  - Lifetime: $149.99 one-time (limited time badge)
- ✅ Large tap targets for each option
- ✅ Selected option is visually highlighted
- ✅ [Subscribe] button at bottom (disabled until option selected)
- ✅ "Restore Purchases" link for returning users
- ✅ Terms of Service and Privacy Policy links
- ✅ Integration with RevenueCat for subscription management
- ✅ After successful payment, user proceeds to main app

**Integration:**
- RevenueCat SDK for payment processing
- Firebase Auth for user identification
- Backend webhook receives subscription events

**Conversion Target:** >40% of users who see paywall subscribe

**Related Specs:** [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Paywall Screen

---

### Q2: Meal Planning

#### US-020: View Daily Meal Plan
**As a** subscribed user
**I want** to see my meal plan for any day of the week
**So that** I know what to eat each day

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Daily detail view shows all meals for selected day
- ✅ Swipe left/right to navigate between days (Monday-Sunday)
- ✅ Day indicator at top shows current day name and date
- ✅ Each meal card shows:
  - Meal name and image
  - Calories and macros (P/C/F in grams)
  - Meal type badge (Breakfast, Lunch, Dinner, Snack)
  - Prep + cook time
- ✅ Tap meal card to see full recipe details
- ✅ Daily totals footer shows:
  - Total calories vs target (e.g., "1,850 / 2,100 cal")
  - Macro totals vs targets
  - Progress bars for calories and each macro
- ✅ Only shows meals matching user's eating pattern (e.g., if user skips breakfast, doesn't show breakfast)

**API Endpoints:**
- `GET /api/meals/plan/current` - Get current week's meal plan
- `GET /api/meals/:mealId` - Get full meal details

**Database Tables:**
- `meal_plans` - Weekly meal plan
- `meals` - Individual meal entries

**Data Displayed:**
- `Meal`: name, image_url, calories, macros, meal_type, prep_time_min, cook_time_min

**Performance:**
- Daily view loads in <500ms
- Images lazy load with blurhash placeholders

**Related Specs:** [Q2_MealPlanning_FINAL.md](../planning/Q2_MealPlanning_FINAL.md) - Screen 1

---

#### US-021: View Full Recipe Details
**As a** subscribed user
**I want** to view complete recipe instructions and ingredients
**So that** I can prepare the meal

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Recipe detail screen shows:
  - Large meal image at top
  - Meal name and description
  - Calories and macros (prominent)
  - Prep time + Cook time
  - Servings (with ability to adjust - P1 feature)
- ✅ Ingredients section:
  - Grouped by category (Proteins, Produce, Dairy/Eggs, Pantry, etc.)
  - Quantity + unit + name format (e.g., "2 lbs chicken breast")
  - US measurements only (lbs, oz, cups, tbsp, tsp)
  - Checkboxes to mark off ingredients (local state only, not persisted)
- ✅ Instructions section:
  - Numbered steps (1, 2, 3...)
  - Clear, concise instructions
  - Can tap step to mark as complete (visual feedback only)
- ✅ Bottom action buttons:
  - [Swap This Meal] - Opens swap modal (US-030)
  - [Give Feedback] - Opens feedback modal (US-023)
  - [Add to Favorites] - Heart icon, saves to favorites (US-052)

**API Endpoints:**
- `GET /api/meals/:mealId` - Get full meal details with recipe

**Database Tables:**
- `meals` - Meal data with ingredients and recipe_steps

**Data Displayed:**
- `Meal`: Full object including `ingredients[]` and `recipe_steps[]`

**Navigation:**
- Opens as modal over daily view
- X button in top-right to close
- Swipe down to dismiss (iOS gesture)

**Related Specs:** [Q2_MealPlanning_FINAL.md](../planning/Q2_MealPlanning_FINAL.md) - Screen 2

---

#### US-022: Quick Swap Meal (Same Week)
**As a** subscribed user
**I want** to swap a meal with another from my current week's plan
**So that** I can adjust my plan without regenerating

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Tap [Swap This Meal] button on recipe detail or daily view meal card
- ✅ Modal opens showing:
  - Source meal (current meal being replaced)
  - "Choose a replacement from this week:" header
  - List of alternative meals from current week (same meal type only)
  - Each alternative shows: Name, image, calories, macros
  - Macro difference indicator (e.g., "+50 cal, -5g protein")
- ✅ Alternatives filtered by:
  - Same meal type (breakfast swaps with breakfast only)
  - Different meal (can't swap chicken dinner with same chicken dinner)
  - Macro similarity (within ±50 cal, ±5g protein preferred)
- ✅ Tap alternative to select (checkmark indicator)
- ✅ [Confirm Swap] button at bottom
- ✅ After swap confirmation:
  - Optimistic update (instant UI change)
  - Shows 3-second toast: "Meal swapped! [Undo]"
  - Undo button available for 3 seconds
  - If undo tapped, reverts to original meal
- ✅ Daily totals recalculated automatically
- ✅ Swap completes in <300ms

**API Endpoints:**
- `POST /api/meals/swap` - Swap two meals
  - Body: `{ sourceMealId, targetMealId, version }`
  - Returns: Updated meal plan with new version
- `POST /api/meals/swap/undo` - Undo last swap (within 3 seconds)

**Database Tables:**
- `meals` - Update swapped meals
- `meal_plans` - Increment version (optimistic locking)
- `swap_history` - Log swap for undo functionality

**Validation:**
- Daily calories remain within ±10% of target
- Meal types match (breakfast ↔ breakfast only)
- Both meals belong to same user

**Performance:**
- <300ms swap execution
- Optimistic UI update (no loading state)
- 3-second undo window

**Related Specs:** [Q2_MealPlanning_FINAL.md](../planning/Q2_MealPlanning_FINAL.md) - Screen 3, [Q3.3_Swapping_FINAL.md](../planning/Q3.3_Swapping_FINAL.md)

---

#### US-023: Provide Meal Feedback
**As a** subscribed user
**I want** to give feedback on meals (thumbs up/down)
**So that** the app learns my preferences over time

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Tap [Give Feedback] button on recipe detail screen
- ✅ Modal shows:
  - Meal name and image
  - "How was this meal?" prompt
  - 👍 Thumbs Up button (large tap target)
  - 👎 Thumbs Down button (large tap target)
- ✅ After thumbs up/down selection:
  - Shows "What did you think?" text area (optional)
  - [Skip] button to dismiss
  - [Submit Feedback] button to save
- ✅ If thumbs down selected:
  - Automatically suggests similar alternatives (P1 feature)
  - User can immediately swap to suggested meal
- ✅ Feedback persisted and used for future meal generation
- ✅ Meal card shows feedback indicator (👍 or 👎 badge)

**API Endpoints:**
- `POST /api/meals/:mealId/feedback` - Submit meal feedback
  - Body: `{ liked: boolean, feedback_text?: string }`

**Database Tables:**
- `meals` - Update feedback field
- `user_preferences` - Track liked/disliked meals for AI learning

**Data Stored:**
- `feedback.liked`: boolean
- `feedback.feedback_text`: string (optional)
- `feedback.timestamp`: Date

**Impact:**
- Future meal generation prioritizes liked meals
- Disliked meals avoided in future plans
- Feedback used to improve AI meal selection

**Related Specs:** [Q2_MealPlanning_FINAL.md](../planning/Q2_MealPlanning_FINAL.md) - Screen 4

---

#### US-024: View Auto-Generated Grocery List
**As a** subscribed user
**I want** to see a consolidated grocery list for the week
**So that** I can shop for all ingredients at once

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Grocery list accessible from Home tab or weekly planning screen
- ✅ Shows all ingredients from current week's meal plan
- ✅ Ingredients consolidated by name:
  - If same ingredient used multiple times, quantities are summed
  - Unit conversion applied (oz → lbs if total ≥ 16 oz)
  - Never shows oz to user (always consolidates to lbs)
- ✅ Ingredients grouped by store section:
  - Proteins (chicken, beef, fish, tofu)
  - Produce (fruits, vegetables)
  - Dairy & Eggs
  - Pantry (dry goods, oils, canned items)
  - Spices & Seasonings
  - Frozen Items
  - Bakery
  - Other
- ✅ Each ingredient shows:
  - Quantity + unit + name (e.g., "2.5 lbs chicken breast")
  - Checkbox to mark as purchased
  - Category badge
- ✅ Checkboxes are local state only (not persisted to backend)
- ✅ [Add Item] button to add custom ingredients (text input)
- ✅ Swipe to delete custom items (cannot delete auto-generated items)
- ✅ Bottom action buttons:
  - [Export] - Share/save list (PDF, text, image)
  - [Clear Checked] - Uncheck all checkboxes

**API Endpoints:**
- `GET /api/meals/plan/:planId/grocery-list` - Get consolidated grocery list
- `POST /api/meals/plan/:planId/grocery-list/add-item` - Add custom item
- `DELETE /api/meals/plan/:planId/grocery-list/item/:itemId` - Delete custom item

**Database Tables:**
- `meal_plans` - Parent plan
- `meals` - Source of ingredients
- `grocery_list_custom_items` - User-added items

**Consolidation Algorithm:**
- Sum quantities for identical ingredient names
- Convert oz to lbs if total ≥ 16 oz (e.g., "18 oz chicken" → "1.125 lbs chicken")
- Round to reasonable precision (0.25 lb increments)
- Group by store section category

**Performance:**
- List generation <1s for 7-day plan
- Immediate checkbox toggle (no backend call)

**Related Specs:** [Q2_MealPlanning_FINAL.md](../planning/Q2_MealPlanning_FINAL.md) - Screen 5, [Q3.4_Weekly_Planning_Grocery_FINAL.md](../planning/Q3.4_Weekly_Planning_Grocery_FINAL.md)

---

#### US-025: Export Grocery List
**As a** subscribed user
**I want** to export my grocery list in multiple formats
**So that** I can shop using my preferred method

**Priority:** P1 (Post-MVP - Nice to Have)

**Acceptance Criteria:**
- ✅ Tap [Export] button on grocery list screen
- ✅ Modal shows export options:
  - PDF: Full formatted list with category headers
  - Text: Plain text list (one item per line)
  - Image: Shareable 1080×1080px graphic
  - Share: Native share sheet to any app
- ✅ PDF includes:
  - Week date range (e.g., "Week of Nov 6-12, 2025")
  - Category headers with icons
  - Checkboxes for each item
  - Generated by WeightGPT footer
- ✅ Text format:
  - Simple bullet list
  - Category headers as section breaks
  - Easy to copy/paste
- ✅ Image format:
  - Clean design matching app aesthetic
  - Category sections
  - WeightGPT branding
- ✅ Share sheet opens native iOS/Android sharing
- ✅ Export completes in <2s

**API Endpoints:**
- `POST /api/meals/plan/:planId/grocery-list/export` - Generate export file
  - Body: `{ format: 'pdf' | 'text' | 'image' }`
  - Returns: File URL or base64 data

**Export Formats:**
- PDF: Server-generated using pdfkit or similar
- Text: Simple string concatenation
- Image: Canvas-based rendering or server-side image generation

**Related Specs:** [Q2_MealPlanning_FINAL.md](../planning/Q2_MealPlanning_FINAL.md) - Screen 6, [Q3.4_Weekly_Planning_Grocery_FINAL.md](../planning/Q3.4_Weekly_Planning_Grocery_FINAL.md)

---

### Q3.0: Navigation & App Shell

#### US-026: Navigate Between Main Tabs
**As a** subscribed user
**I want** to easily navigate between Home, Log, and Progress tabs
**So that** I can access all features quickly

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ 3-tab bottom navigation visible on all main screens
- ✅ Tabs: Home, Log, Progress (left to right)
- ✅ Active tab visually indicated (icon + text color, bottom border)
- ✅ Tap tab to navigate instantly (<100ms)
- ✅ Navigation state persisted (if user closes app on Log tab, reopens to Log tab)
- ✅ Tab icons:
  - Home: Calendar/grid icon
  - Log: Plus/pen icon
  - Progress: Chart/graph icon
- ✅ Tab labels shown below icons
- ✅ Bottom nav sticky (always visible, not hidden on scroll)

**Technical Implementation:**
- React Navigation bottom tabs
- State persisted via AsyncStorage or navigation state
- Smooth transitions between tabs

**Accessibility:**
- Tab buttons have accessibility labels
- Screen reader announces tab changes
- Minimum 44×44pt touch targets

**Related Specs:** [Q3.0_Navigation_AppShell_FINAL.md](../planning/Q3.0_Navigation_AppShell_FINAL.md)

---

#### US-027: Toggle Between Nutrition and Workout Modes (Home Tab)
**As a** subscribed user
**I want** to toggle between nutrition and workout views on the Home tab
**So that** I can see either my meal plan or workout plan

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Segmented control at top of Home tab:
  - [Nutrition] [Workout] (pill-shaped toggle)
  - Active mode highlighted with background color
  - Smooth animation when switching (300ms)
- ✅ Default mode: Nutrition
- ✅ Mode selection persisted (user preference)
- ✅ Tap to toggle modes instantly
- ✅ Content below changes based on mode:
  - Nutrition: Shows meal progress circles and today's meals
  - Workout: Shows workout progress circle and today's workout
- ✅ Color theme changes based on mode:
  - Nutrition: Warm gradient (orange, pink, yellow)
  - Workout: Cool gradient (navy, blue, red)

**Data Persisted:**
- `home_tab_mode`: 'nutrition' | 'workout' (stored in Zustand UI state)

**Performance:**
- <100ms mode switch
- Smooth fade/slide animation
- No loading states when toggling

**Related Specs:** [Q3.0_Navigation_AppShell_FINAL.md](../planning/Q3.0_Navigation_AppShell_FINAL.md) - Dual-Mode Toggle

---

#### US-028: View Russian Doll Progress Circles (Nutrition Mode)
**As a** subscribed user
**I want** to see my daily nutrition progress as nested circles
**So that** I can quickly understand my macro balance

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Four concentric circles (Russian doll style):
  - Outermost: Calories (orange gradient)
  - Ring 2: Protein (pink)
  - Ring 3: Carbs (yellow-green)
  - Ring 4 (center): Fat (green)
- ✅ Each circle shows:
  - Current value / target value (e.g., "1,850 / 2,100 cal")
  - Percentage complete (fill amount)
  - Color-coded: Green (on track), Yellow (close), Red (over/under)
- ✅ Animated fill on page load (spring animation, 600ms)
- ✅ Tap circle to see detailed breakdown (optional modal - P1)
- ✅ Updates in real-time as meals are logged
- ✅ All circles visible without scrolling (optimized sizing)

**Calculations:**
- Calories: Sum of all logged meals for selected day
- Protein: Sum of protein from all logged meals
- Carbs: Sum of carbs from all logged meals
- Fat: Sum of fat from all logged meals
- Targets from user profile: `daily_calories`, `macros.protein_g`, `macros.carbs_g`, `macros.fat_g`

**Data Sources:**
- `GET /api/meals/logged?date=YYYY-MM-DD` - Get logged meals for day
- User profile targets

**Performance:**
- Smooth 60fps animation
- <500ms load time

**Related Specs:** [Q3.0_Navigation_AppShell_FINAL.md](../planning/Q3.0_Navigation_AppShell_FINAL.md) - Russian Doll Circles

---

#### US-029: View Segmented Time Circle (Workout Mode)
**As a** subscribed user
**I want** to see my workout time progress for the day
**So that** I know how much I've completed

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Single circle divided into 3 segments:
  - Warmup (light blue, 5-10 min typical)
  - Main Workout (dark blue, bulk of time)
  - Cooldown (red accent, 5-10 min typical)
- ✅ Each segment shows:
  - Segment label
  - Time completed / total time (e.g., "25 / 30 min")
  - Fill progress (arc fill clockwise)
- ✅ Completed segments have checkmark indicator
- ✅ Current active segment pulses/glows
- ✅ Total time shown in center (e.g., "45 min total")
- ✅ Updates in real-time as workout is logged

**Calculations:**
- Warmup time: First 5-10 min of workout (configured per workout)
- Main workout time: Bulk exercises
- Cooldown time: Last 5-10 min (stretching)
- Total: Sum of all segments

**Data Sources:**
- `GET /api/workouts/plan/current?date=YYYY-MM-DD` - Get today's workout
- `GET /api/workouts/logged?date=YYYY-MM-DD` - Get workout log status

**Performance:**
- Smooth arc animations (spring easing)
- 60fps rendering

**Related Specs:** [Q3.0_Navigation_AppShell_FINAL.md](../planning/Q3.0_Navigation_AppShell_FINAL.md) - Segmented Time Circle

---

### Q3.1: Settings & Profile

#### US-030: View Settings Main Screen
**As a** subscribed user
**I want** to access all app settings from one central screen
**So that** I can manage my profile, preferences, and account

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Settings screen organized into 6 sections:
  1. Profile (avatar, name, email)
  2. Account & Subscription (status, billing)
  3. Preferences (notifications, units, theme, weekly schedule)
  4. Support & Help (FAQ, contact, bug report)
  5. Privacy & Data (policy, export, delete account)
  6. Logout (red text button)
- ✅ Each section has icon + title + chevron right
- ✅ Tap section to navigate to detail screen
- ✅ Profile section shows user avatar (if set) and name
- ✅ Subscription section shows current status badge:
  - Trial (blue)
  - Active (green)
  - Expired (red)

**Navigation:**
- Accessible from Progress tab → Settings button (top-right)
- Or from Home tab → Profile icon

**Data Displayed:**
- `UserProfile`: name, email, subscription_status

**Related Specs:** [Q3.1_Settings_Profile_FINAL.md](../planning/Q3.1_Settings_Profile_FINAL.md) - Screen 1

---

#### US-031: Edit Profile Information
**As a** subscribed user
**I want** to edit my profile details
**So that** I can update my goals, preferences, and personal information

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ Profile editing screen shows all onboarding fields:
  - Personal: Name, email (read-only), height, age, sex
  - Goals: Goal type, current weight, goal weight, goal date
  - Activity: Daily activity level, workout frequency
  - Nutrition: Dietary restrictions, eating pattern, meal prep time, meal variety
  - Fitness: Preferred workout days, available equipment, fitness level
- ✅ All fields editable using same UI as onboarding (scroll pickers, checkboxes, etc.)
- ✅ Email field shows but is read-only (handled by Firebase Auth)
- ✅ Avatar image: Tap to upload/change (P1 feature)
- ✅ [Save Changes] button at bottom
- ✅ Unsaved changes warning if user navigates away
- ✅ After save:
  - Shows success toast: "Profile updated!"
  - Triggers regeneration prompts if significant changes (see US-032)

**API Endpoints:**
- `PUT /api/users/:id/profile` - Update all profile fields
- `GET /api/users/:id/profile` - Load current profile

**Database Tables:**
- `users` - Update all profile fields

**Validation:**
- Same validation rules as onboarding
- Age 13-100, height 120-220cm, weight 80-400lbs, etc.

**Related Specs:** [Q3.1_Settings_Profile_FINAL.md](../planning/Q3.1_Settings_Profile_FINAL.md) - Screen 2

---

#### US-032: Trigger Plan Regeneration After Significant Changes
**As a** subscribed user
**I want** the app to regenerate my plan when I make significant profile changes
**So that** my plan stays aligned with my updated goals

**Priority:** P0 (MVP - Critical)

**Acceptance Criteria:**
- ✅ After profile update, system checks for "significant changes":
  - **Meal plan regeneration triggers:**
    - Dietary restrictions changed
    - Eating pattern changed (meals per day, meal types)
    - Food preferences changed
    - Goal weight changed by >5 lbs
    - Meal prep time or variety preference changed
  - **Workout plan regeneration triggers:**
    - Available equipment changed
    - Workout frequency changed
    - Preferred workout days changed
    - Fitness level changed
    - Goal changed (lose/gain/maintain)
- ✅ If meal plan regeneration needed:
  - Shows modal: "Your meal plan will be regenerated to match your updated preferences. This will replace your current week's meals. Continue?"
  - [Cancel] [Regenerate Plan] buttons
  - If user confirms, triggers meal plan generation (same as weekly reset)
- ✅ If workout plan regeneration needed:
  - Shows modal: "Your workout plan will be updated to match your new equipment and schedule. Continue?"
  - [Cancel] [Update Plan] buttons
  - If user confirms, triggers workout plan generation
- ✅ If no significant changes, just saves and shows "Profile updated!"
- ✅ Regeneration happens asynchronously (shows loading state)

**Logic:**
```typescript
function requiresMealPlanRegeneration(oldProfile, newProfile): boolean {
  return (
    oldProfile.dietary_restrictions !== newProfile.dietary_restrictions ||
    oldProfile.eating_pattern !== newProfile.eating_pattern ||
    oldProfile.meal_prep_time !== newProfile.meal_prep_time ||
    oldProfile.meal_variety_preference !== newProfile.meal_variety_preference ||
    Math.abs(oldProfile.goal_weight - newProfile.goal_weight) > 5
  );
}

function requiresWorkoutPlanRegeneration(oldProfile, newProfile): boolean {
  return (
    oldProfile.available_equipment !== newProfile.available_equipment ||
    oldProfile.workout_frequency !== newProfile.workout_frequency ||
    oldProfile.preferred_workout_days !== newProfile.preferred_workout_days ||
    oldProfile.fitness_level !== newProfile.fitness_level ||
    oldProfile.goal !== newProfile.goal
  );
}
```

**API Endpoints:**
- `POST /api/meals/plan/regenerate` - Regenerate meal plan
- `POST /api/workouts/plan/regenerate` - Regenerate workout plan

**Related Specs:** [Q3.1_Settings_Profile_FINAL.md](../planning/Q3.1_Settings_Profile_FINAL.md) - Regeneration Triggers

---

### User Story Summary

**Detailed User Stories Documented Above:**
- ✅ **Q1: Onboarding** (US-001 through US-019) - 19 complete user stories
- ✅ **Q2: Meal Planning** (US-020 through US-025) - 6 complete user stories
- ✅ **Q3.0: Navigation & App Shell** (US-026 through US-029) - 4 complete user stories
- ✅ **Q3.1: Settings & Profile** (US-030 through US-032) - 3 complete user stories

**Total Detailed Stories:** 32 user stories with full acceptance criteria, API endpoints, database tables, and technical specifications

**Additional MVP Features (Q3.2-Q3.7):**

The following features are P0 MVP-critical and fully specified in their respective planning documents:

**Q3.2: AI-Powered Logging** ([Q3.2_AI_Logging_FINAL.md](../planning/Q3.2_AI_Logging_FINAL.md))
- AI meal logging with natural language parsing (GPT-4o-mini)
- AI workout logging with type/intensity detection
- Weight logging with unit auto-conversion
- Follow-up question system (5 types)
- Manual entry fallback
- Restaurant recognition (10+ chains)
- Confirmation screens with edit capabilities

**Q3.3: Meal & Workout Swapping** ([Q3.3_Swapping_FINAL.md](../planning/Q3.3_Swapping_FINAL.md))
- Quick Swap from current week (±50 cal, ±5g protein macro matching)
- AI-generated meal alternatives (3 options)
- Workout library browsing (200-500 workouts, compatibility scoring)
- AI-generated workout alternatives
- 3-second undo functionality with toast
- Optimistic locking for race condition prevention

**Q3.4: Weekly Planning & Grocery** ([Q3.4_Weekly_Planning_Grocery_FINAL.md](../planning/Q3.4_Weekly_Planning_Grocery_FINAL.md))
- Weekly meal plan regeneration (14-28 meals, ±5% daily balance)
- Weekly workout plan regeneration (3-7 workouts, goal-based split)
- Favorites integration (max 3 per week)
- Regeneration limit (5×/week to prevent API abuse)
- Grocery list consolidation with unit conversion
- Shopping day notifications
- Export (PDF, text, image, share)

**Q3.5: Progress & Analytics** ([Q3.5_Progress_Analytics_FINAL.md](../planning/Q3.5_Progress_Analytics_FINAL.md))
- Weight graph with linear regression trend line
- Weekly & monthly summaries with week-over-week comparisons
- Streak system (timezone-aware, 90-day heatmap)
- Achievement system (25 unlockable badges)
- AI-powered weekly insights (GPT-4o-mini, 8 insight categories)
- Body measurements tracking (7 measurement types)
- Data export (PDF 5 pages, CSV 3 files, Instagram share cards)

**Q3.6: History & Saved Items** ([Q3.6_History_Saved_FINAL.md](../planning/Q3.6_History_Saved_FINAL.md))
- History screen with week pagination (Monday-Sunday)
- Search with ranking algorithm (exact → starts with → contains → fuzzy)
- Filters (All/Meals/Workouts/Weight), calendar date picker
- Entry management (view, edit, delete, favorite)
- Export (CSV/PDF with date range selection)
- Saved items library (categorized by meal type and workout type)
- Quick-add to today (60% API cost reduction vs AI parsing)

**Q3.7: Offline Mode & Sync** ([Q3.7_Offline_Sync_FINAL.md](../planning/Q3.7_Offline_Sync_FINAL.md))
- 100% logging works offline (manual entry fallback)
- 95% read features work offline (cached data)
- Priority queue sync (critical/high/normal/low, FIFO within priority)
- Conflict resolution (Last-Write-Wins, field-level merge, deletion wins)
- Cache strategy (8MB budget, P0-P3 priority levels, LRU eviction)
- Network detection with offline banner
- Sync queue viewer (transparency, manual retry, debug info)
- Background sync (iOS 15-30 min, Android 15 min)

**Note:** All features above are **P0 MVP-critical** and must be implemented before App Store launch. Complete acceptance criteria, API specifications, and technical requirements are documented in their respective planning specifications. Non-functional requirements covering all features are documented below.

---

## Non-Functional Requirements

### Performance Requirements

#### NFR-001: App Launch Time
**Requirement:** App must launch in under 2 seconds on modern devices (iPhone 12+, Android equivalent)

**Measurement:**
- Time from tap app icon to first interactive screen
- Measured on iPhone 12 (iOS 16+) and Pixel 6 (Android 12+)

**Implementation:**
- Optimize bundle size (<10 MB initial bundle)
- Use code splitting for screens
- Lazy load non-critical assets
- Implement app start profiling (React Native Performance Monitor)

**Acceptance Criteria:**
- ✅ Cold start: <2s (95th percentile)
- ✅ Warm start: <1s (95th percentile)
- ✅ No loading screens on launch (show cached data immediately)

---

#### NFR-002: Screen Transition Time
**Requirement:** Screen transitions must complete in under 300ms

**Measurement:**
- Time from tap to fully rendered new screen
- Measured with React DevTools Profiler

**Implementation:**
- Use React Navigation native stack (performant)
- Optimize component rendering (memoization)
- Preload next screen data on user intent (hover, swipe start)

**Acceptance Criteria:**
- ✅ Navigation between tabs: <100ms (instant feel)
- ✅ Modal open/close: <200ms
- ✅ Stack navigation: <300ms
- ✅ Smooth 60fps animations

---

#### NFR-003: API Response Time
**Requirement:** 95th percentile API response times must meet targets

**Targets:**
- Read operations (GET): <500ms
- Write operations (POST/PUT/DELETE): <1s
- AI operations (OpenAI meal/workout generation): <7s

**Measurement:**
- Sentry performance monitoring
- Backend pino logging with response time tracking

**Implementation:**
- Database query optimization (proper indexes)
- Connection pooling (Render.com managed)
- Caching strategy (TanStack Query with 5min stale time)
- Circuit breaker for OpenAI (graceful degradation)

**Acceptance Criteria:**
- ✅ `GET /api/meals/plan/current`: <400ms (p95)
- ✅ `POST /api/meals/swap`: <500ms (p95)
- ✅ `POST /api/meals/plan/regenerate`: <7s (p95)
- ✅ `POST /api/logging/meal`: <5s (p95, includes AI parsing)

---

#### NFR-004: Offline Sync Performance
**Requirement:** Offline sync must complete quickly on reconnection

**Targets:**
- Initial sync (app launch with network): <5s
- Reconnection sync (after 24h offline): <10s
- Background sync (periodic): <2s

**Measurement:**
- Time from network detection to sync completion
- Monitored via PostHog custom events

**Implementation:**
- Priority queue (critical actions first)
- Batch API requests (reduce roundtrips)
- Incremental delta sync (only changed data)
- Gzip compression on requests

**Acceptance Criteria:**
- ✅ Sync <100 queued actions: <5s
- ✅ Sync <1000 queued actions: <10s
- ✅ Background sync: <2s (95th percentile)

---

### Security Requirements

#### NFR-005: Authentication & Authorization
**Requirement:** All API endpoints must enforce proper authentication and authorization

**Implementation:**
- Firebase Authentication for user identity
- Custom JWT tokens (7-day expiry) for API access
- Secure token storage (expo-secure-store on device)
- Automatic token refresh on 401 response

**Acceptance Criteria:**
- ✅ All API endpoints (except /health and /auth/*) require valid JWT
- ✅ JWT includes user_id claim for authorization
- ✅ Tokens expire after 7 days and auto-refresh
- ✅ Tokens stored in encrypted secure storage (not AsyncStorage)
- ✅ No tokens logged or exposed in error messages

**Related Specs:** [ARCHITECTURE.md](./ARCHITECTURE.md) - Security Architecture

---

#### NFR-006: Data Encryption
**Requirement:** Sensitive data must be encrypted at rest and in transit

**At Rest:**
- Device: expo-secure-store for auth tokens (encrypted keychain/keystore)
- Database: Render.com default encryption (AES-256)
- Offline cache: SQLite database with device-level encryption

**In Transit:**
- All API requests over HTTPS only (TLS 1.3)
- No HTTP allowed (redirect middleware in production)
- Certificate pinning (P1 feature for enhanced security)

**Acceptance Criteria:**
- ✅ 100% of API traffic over HTTPS
- ✅ Auth tokens never stored in AsyncStorage (only SecureStore)
- ✅ Database encrypted at rest (Render.com default)
- ✅ Offline SQLite uses device encryption

---

#### NFR-007: GDPR & Privacy Compliance
**Requirement:** App must comply with GDPR and provide user data control

**User Rights:**
- **Right to Access:** Users can export all their data
- **Right to Erasure:** Users can delete their account and all data
- **Right to Portability:** Data export in machine-readable format (JSON)

**Implementation:**
- Privacy policy and Terms of Service accessible from settings
- Data export feature (JSON format with all user data)
- Account deletion with 30-day grace period (soft delete)
- Consent checkboxes during onboarding (age verification, terms acceptance)

**Acceptance Criteria:**
- ✅ Privacy policy and ToS links visible during onboarding and in settings
- ✅ `POST /api/users/:id/export` generates complete data export (JSON)
- ✅ `DELETE /api/users/:id` soft deletes account (30-day grace period)
- ✅ After 30 days, scheduled job hard deletes all user data
- ✅ No user data shared with third parties (except RevenueCat for payments, Sentry for errors)

**Related Specs:** [Q3.1_Settings_Profile_FINAL.md](../planning/Q3.1_Settings_Profile_FINAL.md) - Privacy & Data

---

#### NFR-008: Input Validation & Sanitization
**Requirement:** All user inputs must be validated and sanitized to prevent injection attacks

**Implementation:**
- Zod schemas for all API request bodies
- SQL injection prevention (Prisma ORM parameterized queries)
- XSS prevention (React Native doesn't render HTML, but sanitize text inputs)
- Rate limiting on AI endpoints to prevent abuse

**Acceptance Criteria:**
- ✅ All API endpoints use Zod validation before processing
- ✅ Prisma ORM used for all database queries (no raw SQL)
- ✅ User-generated text sanitized before storing (strip HTML, dangerous characters)
- ✅ Rate limiting: 10 requests/min for AI endpoints per user

**Related Specs:** [CODE_STANDARDS.md](./CODE_STANDARDS.md) - Security Best Practices

---

### Accessibility Requirements

#### NFR-009: WCAG 2.1 AA Compliance
**Requirement:** App must meet WCAG 2.1 Level AA accessibility standards

**Key Guidelines:**
- **Perceivable:**
  - Text alternatives for images (alt text, accessibility labels)
  - Sufficient color contrast ratios (4.5:1 for normal text, 3:1 for large text)
  - Text can be resized up to 200% without loss of content or functionality
- **Operable:**
  - All functionality available via touch (no keyboard-only functions)
  - Touch targets minimum 44×44pt (iOS) / 48×48dp (Android)
  - No time limits on user actions (except undo toast - clearly communicated)
- **Understandable:**
  - Clear, consistent navigation
  - Error messages are descriptive and actionable
  - Labels and instructions provided for all inputs
- **Robust:**
  - Compatible with VoiceOver (iOS) and TalkBack (Android)
  - Semantic HTML-equivalent elements (accessibility roles)

**Acceptance Criteria:**
- ✅ All images have accessibility labels
- ✅ Color contrast meets 4.5:1 ratio (normal text) and 3:1 (large text, icons)
- ✅ All touch targets ≥ 44×44pt
- ✅ VoiceOver/TalkBack can navigate entire app
- ✅ All form inputs have labels and error messages
- ✅ No flashing content (avoid seizure triggers)

**Testing:**
- Manual testing with VoiceOver (iOS) and TalkBack (Android)
- Automated testing with @testing-library/react-native accessibility queries
- Color contrast checked with tools (e.g., Stark plugin, WebAIM contrast checker)

**Related Specs:** [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) - Accessibility, [CODE_STANDARDS.md](./CODE_STANDARDS.md)

---

#### NFR-010: Screen Reader Support
**Requirement:** All screens and interactions must be usable with screen readers

**Implementation:**
- Accessibility labels on all interactive elements
- Accessibility hints for complex interactions (e.g., "Double tap to swap meal")
- Proper focus management (focus moves logically through screens)
- Announcements for important state changes (e.g., "Meal swapped successfully")

**Acceptance Criteria:**
- ✅ Every button, input, and interactive element has an accessibility label
- ✅ Images have descriptive labels (e.g., "Grilled chicken with vegetables")
- ✅ Icons have labels (e.g., "Thumbs up", not just icon)
- ✅ Screen reader can navigate all screens in logical order
- ✅ Important updates announced (e.g., loading states, errors, success messages)

---

### Offline Capabilities

#### NFR-011: Offline Logging Capability
**Requirement:** 100% of logging functionality must work offline

**Capabilities:**
- ✅ Manual meal entry works offline (no AI parsing)
- ✅ Manual workout logging works offline
- ✅ Weight logging works offline
- ✅ Favoriting meals/workouts works offline
- ✅ All offline actions queued for sync when reconnected

**Limitations:**
- AI meal/workout parsing requires network (gracefully degrades to manual entry)
- Meal/workout swapping requires network (shows offline banner)
- Plan regeneration requires network (shows offline banner)

**Acceptance Criteria:**
- ✅ User can log meals, workouts, and weight with no network
- ✅ Offline banner displays when network unavailable
- ✅ Queue icon shows number of pending sync actions
- ✅ All offline actions sync automatically on reconnection

**Related Specs:** [Q3.7_Offline_Sync_FINAL.md](../planning/Q3.7_Offline_Sync_FINAL.md)

---

#### NFR-012: Offline Read Capability
**Requirement:** 95% of read features must work offline with cached data

**Capabilities:**
- ✅ View current week's meal plan (cached)
- ✅ View current week's workout plan (cached)
- ✅ View last 3 weeks of history (cached)
- ✅ View all saved items (cached)
- ✅ View weight graph (cached up to last sync)
- ✅ View progress summaries (cached with staleness indicator)

**Limitations:**
- Cannot fetch new weeks' data (requires network)
- AI insights not updated (shows cached version with staleness notice)
- Grocery list may be stale if plan changed while offline

**Cache Strategy:**
- **Critical data (always cached):** Current week meal/workout plans, last 3 weeks history, all saved items
- **Time-based expiration:** Weight graph (24h), weekly summary (1 week), AI insights (7 days)
- **Event-based invalidation:** Plan changes, user profile updates
- **Cache budget:** 8MB maximum (see Q3.7)

**Acceptance Criteria:**
- ✅ All cached screens show "Last updated: X hours ago" when stale
- ✅ "Refresh" button available when network reconnects
- ✅ Cache persists across app restarts
- ✅ Stale data clearly indicated (subtle badge or timestamp)

**Related Specs:** [Q3.7_Offline_Sync_FINAL.md](../planning/Q3.7_Offline_Sync_FINAL.md) - Cache Strategy

---

### Reliability Requirements

#### NFR-013: Crash-Free Sessions
**Requirement:** 99.5%+ of user sessions must be crash-free

**Measurement:**
- Sentry error tracking and crash reporting
- Sessions defined as app open → app close (foreground time)

**Implementation:**
- Error boundaries on all screens (catch React errors)
- Global error handler for unhandled exceptions
- Try/catch on all async operations
- Zod validation to prevent malformed data crashes
- Comprehensive testing (80%+ coverage)

**Acceptance Criteria:**
- ✅ 99.5%+ crash-free sessions (Sentry metric)
- ✅ No P0 crashes in production
- ✅ All P1/P2 crashes fixed within 48 hours
- ✅ Error boundaries prevent full app crashes

**Related Specs:** [ARCHITECTURE.md](./ARCHITECTURE.md) - Error Handling

---

#### NFR-014: Data Consistency & No Data Loss
**Requirement:** Zero user data loss, even during errors or crashes

**Implementation:**
- **Optimistic updates:** Instant UI feedback, queue action for sync
- **Offline queue:** All actions persisted to SQLite before attempting sync
- **Transaction safety:** Database transactions for critical operations
- **Conflict resolution:** Last-write-wins with field-level merge for profiles
- **Soft deletes:** 30-day grace period before hard deletes

**Acceptance Criteria:**
- ✅ Logged meals/workouts/weight never lost (even if app crashes before sync)
- ✅ Offline queue persists across app restarts
- ✅ Conflicts resolved automatically (user notified if manual resolution needed)
- ✅ Deleted accounts recoverable within 30 days

**Related Specs:** [Q3.7_Offline_Sync_FINAL.md](../planning/Q3.7_Offline_Sync_FINAL.md) - Conflict Resolution

---

### Usability Requirements

#### NFR-015: Platform Support
**Requirement:** App must run on iOS 14+ and Android 10+

**Supported Devices:**
- **iOS:** iPhone SE (2nd gen) and newer, iPad (7th gen) and newer
- **Android:** Devices with Android 10+ (API level 29+)

**Screen Sizes:**
- Small: iPhone SE (375×667pt)
- Medium: iPhone 12/13/14 (390×844pt)
- Large: iPhone 12/13/14 Pro Max (428×926pt)
- Tablet: iPad (768×1024pt and larger)

**Acceptance Criteria:**
- ✅ App runs on iOS 14.0+
- ✅ App runs on Android 10 (API 29)+
- ✅ Responsive layout works on all screen sizes (375pt to 768pt+ width)
- ✅ No horizontal scrolling on any screen size
- ✅ All text readable on small screens (minimum 12pt font)

---

#### NFR-016: Network Resilience
**Requirement:** App must gracefully handle poor network conditions

**Scenarios:**
- **Offline:** Show offline banner, queue actions, allow manual entry
- **Slow connection (>3s response):** Show loading indicator, allow cancel
- **Intermittent connection:** Retry with exponential backoff (1s, 2s, 4s)
- **Timeout:** Show timeout error, offer retry

**Implementation:**
- React Native NetInfo for network state detection
- Axios retry logic with exponential backoff
- Timeout on all API requests (30s default, 60s for AI operations)
- Circuit breaker for OpenAI (prevents cascading failures)

**Acceptance Criteria:**
- ✅ Offline banner appears within 1s of losing connection
- ✅ Reconnection toast appears when network restored
- ✅ Slow connection warning if request takes >3s
- ✅ Auto-retry on network errors (max 3 attempts)
- ✅ Timeout errors show clear message: "Request timed out. Retry?"

**Related Specs:** [Q3.7_Offline_Sync_FINAL.md](../planning/Q3.7_Offline_Sync_FINAL.md) - Network Detection

---

## Success Metrics & KPIs

### Retention Metrics

**KPI-001: Day 1 Retention**
- **Target:** >60%
- **Definition:** % of users who return to app within 24 hours of first session
- **Measurement:** PostHog cohort analysis
- **Why It Matters:** Indicates immediate value and engagement

**KPI-002: Day 7 Retention**
- **Target:** >40%
- **Definition:** % of users who return to app 7 days after first session
- **Measurement:** PostHog cohort analysis
- **Why It Matters:** Indicates sustained engagement beyond novelty phase

**KPI-003: Day 30 Retention**
- **Target:** >30%
- **Definition:** % of users who return to app 30 days after first session
- **Measurement:** PostHog cohort analysis
- **Why It Matters:** Indicates long-term value and habit formation

**KPI-004: Day 90 Retention**
- **Target:** >20%
- **Definition:** % of users who return to app 90 days after first session
- **Measurement:** PostHog cohort analysis
- **Why It Matters:** Indicates true product-market fit

---

### Feature Adoption Metrics

**KPI-005: AI Logging Adoption**
- **Target:** >80% of users log at least one meal using AI parsing
- **Definition:** % of subscribed users who use AI meal logging (vs manual entry only)
- **Measurement:** PostHog custom event: `ai_meal_logged`
- **Why It Matters:** Core differentiator, validates AI value

**KPI-006: Meal Swapping Adoption**
- **Target:** >50% of users swap at least one meal per week
- **Definition:** % of subscribed users who use meal swapping feature
- **Measurement:** PostHog custom event: `meal_swapped`
- **Why It Matters:** Indicates personalization value and user engagement

**KPI-007: Weekly Planning Usage**
- **Target:** >60% of users regenerate their plan at least once
- **Definition:** % of users who use weekly plan regeneration (beyond initial plan)
- **Measurement:** PostHog custom event: `plan_regenerated`
- **Why It Matters:** Indicates long-term engagement and plan flexibility value

---

### Performance Metrics

**KPI-008: App Launch Time**
- **Target:** <2s (95th percentile)
- **Definition:** Time from app icon tap to first interactive screen
- **Measurement:** React Native Performance Monitor + Sentry traces
- **Why It Matters:** First impression, daily frustration point if slow

**KPI-009: Screen Transition Time**
- **Target:** <300ms (95th percentile)
- **Definition:** Time from tap to fully rendered new screen
- **Measurement:** React DevTools Profiler + Sentry traces
- **Why It Matters:** Perceived app speed, user patience

**KPI-010: API Response Time (p95)**
- **Target:** <500ms reads, <1s writes, <7s AI operations
- **Definition:** 95th percentile response time for API endpoints
- **Measurement:** Sentry performance monitoring, backend pino logs
- **Why It Matters:** User frustration with slow operations

---

### Stability Metrics

**KPI-011: Crash-Free Sessions**
- **Target:** >99.5%
- **Definition:** % of sessions without any crash
- **Measurement:** Sentry crash reporting
- **Why It Matters:** Trust, reliability, user frustration

**KPI-012: Error Rate**
- **Target:** <1% of API requests result in 5xx errors
- **Definition:** % of API requests that fail with server error
- **Measurement:** Backend pino logs + Sentry error tracking
- **Why It Matters:** App reliability, data integrity

---

### Conversion & Revenue Metrics

**KPI-013: Paywall Conversion**
- **Target:** >40%
- **Definition:** % of users who see paywall and subscribe
- **Measurement:** RevenueCat + PostHog funnel analysis
- **Why It Matters:** Primary revenue driver

**KPI-014: Monthly Recurring Revenue (MRR)**
- **Target:** Track growth (no specific target for MVP)
- **Definition:** Total monthly subscription revenue
- **Measurement:** RevenueCat dashboard
- **Why It Matters:** Business viability

**KPI-015: Average Revenue Per User (ARPU)**
- **Target:** ~$8/user (weighted avg of monthly, annual, lifetime)
- **Definition:** Total revenue / total active users
- **Measurement:** RevenueCat + custom calculation
- **Why It Matters:** Revenue efficiency per user

**KPI-016: Churn Rate**
- **Target:** <10% monthly churn
- **Definition:** % of subscribers who cancel each month
- **Measurement:** RevenueCat churn metrics
- **Why It Matters:** Retention sustainability

---

## Feature Prioritization

### P0: MVP Critical (Must Have for Launch)

These features MUST be implemented before App Store launch. The app cannot function without them.

**Onboarding:**
- ✅ US-001: Complete Zero-Typing Onboarding
- ✅ US-002 through US-019: All onboarding steps and paywall

**Meal Planning:**
- ✅ US-020: View Daily Meal Plan
- ✅ US-021: View Full Recipe Details
- ✅ US-022: Quick Swap Meal
- ✅ US-023: Provide Meal Feedback
- ✅ US-024: View Auto-Generated Grocery List

**Navigation:**
- ✅ US-026: Navigate Between Main Tabs
- ✅ US-027: Toggle Between Nutrition and Workout Modes
- ✅ US-028: View Russian Doll Progress Circles
- ✅ US-029: View Segmented Time Circle

**Settings:**
- ✅ US-030: View Settings Main Screen
- ✅ US-031: Edit Profile Information
- ✅ US-032: Trigger Plan Regeneration After Changes

**AI Logging:**
- ✅ All AI logging user stories (natural language meal/workout logging, manual fallback)

**Swapping:**
- ✅ All swapping user stories (meal and workout swapping, undo functionality)

**Weekly Planning:**
- ✅ All weekly planning user stories (regeneration, grocery list)

**Progress:**
- ✅ All progress user stories (weight graph, summaries, streaks, achievements)

**History & Saved:**
- ✅ All history and saved user stories (week pagination, favorites, quick-add)

**Offline:**
- ✅ All offline mode user stories (100% logging offline, sync queue, conflict resolution)

**Non-Functional:**
- ✅ NFR-001 through NFR-016: All performance, security, accessibility, offline requirements

---

### P1: Post-MVP (Important but Not Launch Blockers)

These features enhance the experience but can be added after launch.

**Meal Planning:**
- ⏳ US-025: Export Grocery List (nice to have, can add post-launch)

**Recipe:**
- ⏳ Servings adjustment (scale recipe ingredients)
- ⏳ Nutrition facts panel (detailed micronutrients)

**Logging:**
- ⏳ Camera-based food logging (OpenAI Vision API)
- ⏳ Barcode scanning for packaged foods

**Swapping:**
- ⏳ AI-suggested swap alternatives (beyond manual selection)

**Progress:**
- ⏳ Body measurements photos (visual progress tracking)
- ⏳ Custom achievements (user-defined goals)

**Social:**
- ⏳ Share meals/workouts to social media
- ⏳ Challenge friends
- ⏳ Leaderboards

**Advanced:**
- ⏳ Integration with Apple Health / Google Fit
- ⏳ Smart scale integration
- ⏳ Fitness tracker sync (auto-log workouts)

---

### P2: V2 Features (Nice to Have, Future Roadmap)

These are not part of MVP or immediate post-launch. Deferred to V2.

**AI Enhancements:**
- Recipe videos (generated or linked)
- AI coach chat (conversational guidance)
- Form check (camera-based exercise validation)

**Content:**
- Meal delivery service partnership
- Personal trainer marketplace
- Nutritionist consultations

**Business:**
- Corporate wellness programs
- International markets (localization)

**Technical:**
- Certificate pinning (enhanced security)
- Streaming AI responses (long meal plans)
- Advanced caching strategies

---

## Dependencies & Assumptions

### External Dependencies

**DEP-001: OpenAI API**
- **Dependency:** GPT-4o-mini API for meal/workout generation and AI logging
- **Risk:** API outages, rate limits, cost increases
- **Mitigation:**
  - Circuit breaker pattern (graceful degradation)
  - Manual entry fallback always available
  - Monitor usage and costs
  - Tier 2+ API access for production rate limits

**DEP-002: Firebase Authentication**
- **Dependency:** Firebase Auth for user authentication
- **Risk:** Service outage, account lockouts
- **Mitigation:**
  - Custom JWT tokens (users stay authenticated even if Firebase down)
  - Backend handles JWT validation independently
  - Fallback to email/password if social auth fails

**DEP-003: RevenueCat**
- **Dependency:** RevenueCat for subscription management
- **Risk:** Service outage, payment processing failures
- **Mitigation:**
  - Webhook inbox pattern (durable event processing)
  - Retry logic for failed webhooks
  - Manual subscription verification API available

**DEP-004: Render.com**
- **Dependency:** Render.com for backend hosting and PostgreSQL database
- **Risk:** Downtime, performance degradation
- **Mitigation:**
  - Health check endpoint for monitoring
  - Automatic restart on crash
  - Database backups (daily, retained 7 days)
  - Upgrade to higher tier if performance degrades

**DEP-005: Expo / EAS**
- **Dependency:** Expo framework and EAS Build/Submit services
- **Risk:** Build failures, App Store submission issues
- **Mitigation:**
  - Install all native modules in Phase 1 (enables OTA updates)
  - Test builds frequently during development
  - EAS Build has 99.9% uptime SLA

---

### Technical Assumptions

**ASS-001: User Device Capabilities**
- **Assumption:** Users have devices with:
  - iOS 14+ or Android 10+
  - 2 GB+ RAM
  - 500 MB+ available storage
  - Internet connection (Wi-Fi or cellular)
- **Risk:** App may be slow on very old devices
- **Validation:** Test on minimum spec devices (iPhone SE 2nd gen, budget Android)

**ASS-002: Network Availability**
- **Assumption:** Users have periodic internet access (at least daily)
- **Risk:** Extended offline periods could fill sync queue
- **Mitigation:**
  - 1,000 item queue limit (configurable)
  - Priority queue ensures critical actions sync first
  - Sync queue viewer shows queue status

**ASS-003: User Literacy**
- **Assumption:** Users can read and understand English (MVP is English-only)
- **Risk:** Non-English speakers excluded
- **Mitigation:** Localization planned for V2 (not MVP)

---

### Business Assumptions

**ASS-004: Subscription Willingness**
- **Assumption:** Users will pay $9.99/month after seeing value demo
- **Risk:** Users may not convert at target rate (40%)
- **Validation:**
  - A/B test pricing ($7.99 vs $9.99 vs $11.99)
  - Monitor conversion rate closely
  - Optimize paywall messaging based on data

**ASS-005: OpenAI Cost Sustainability**
- **Assumption:** OpenAI costs of $0.063/user/month are sustainable at $8 ARPU
- **Risk:** OpenAI price increases could reduce margins
- **Validation:**
  - Monitor actual usage vs estimates
  - Optimize prompts to reduce token usage
  - Consider switching to smaller models if costs rise

**ASS-006: Market Demand**
- **Assumption:** There is demand for AI-powered personalized meal/workout planning
- **Risk:** Market may be saturated or users may not value AI personalization
- **Validation:**
  - MVP launch with limited marketing spend
  - Monitor retention and engagement metrics
  - Iterate based on user feedback

---

### Data Assumptions

**ASS-007: User Honesty in Onboarding**
- **Assumption:** Users provide accurate information (weight, height, age, activity level)
- **Risk:** Inaccurate data leads to poor recommendations
- **Mitigation:**
  - Inline validation (safe weight loss rates)
  - Allow profile editing at any time
  - AI learns from user feedback to compensate

**ASS-008: Meal/Workout Library Size**
- **Assumption:** OpenAI can generate sufficient variety of meals and workouts
- **Risk:** Repetitive plans, user dissatisfaction
- **Validation:**
  - Seed database with 200-500 pre-built workouts
  - Test meal generation with various dietary restrictions
  - Monitor feedback on variety

---

## Out of Scope

The following features are explicitly **out of scope** for the MVP. They may be considered for future versions (V2, V3) based on user feedback and business priorities.

### V2 Features (Deferred to Post-MVP)

**Camera-Based Features:**
- ❌ Food photo logging (OpenAI Vision API)
- ❌ Barcode scanning for packaged foods
- ❌ Form check (camera-based exercise validation)
- ❌ Body measurement photos (visual progress tracking)

**Social Features:**
- ❌ Share meals/workouts to social media (Instagram, Facebook)
- ❌ Challenge friends (weight loss competitions)
- ❌ Leaderboards (community rankings)
- ❌ In-app messaging (user-to-user or user-to-coach)

**Advanced Integrations:**
- ❌ Apple Health / Google Fit sync (import steps, heart rate, workouts)
- ❌ Smart scale integration (automatic weight logging via Bluetooth)
- ❌ Fitness tracker sync (Fitbit, Garmin, Whoop)
- ❌ Wearable integration (Apple Watch, Wear OS complications)

**Content Partnerships:**
- ❌ Meal delivery service partnership (e.g., HelloFresh, Blue Apron)
- ❌ Personal trainer marketplace (book sessions with certified trainers)
- ❌ Nutritionist consultations (1-on-1 video calls)
- ❌ Recipe videos (YouTube embeds or hosted videos)

**Business Features:**
- ❌ Corporate wellness programs (team subscriptions, admin dashboards)
- ❌ Referral program (invite friends, earn rewards)
- ❌ Gift subscriptions (buy for someone else)

---

### V3+ Features (Long-Term Roadmap)

**AI Enhancements:**
- ❌ AI coach chat (conversational guidance, ask questions to AI)
- ❌ Predictive analytics (predict weight loss success, risk of churn)
- ❌ Adaptive difficulty (workouts that adjust based on performance)
- ❌ Voice input for logging (hands-free meal/workout logging)

**International Expansion:**
- ❌ Localization (support for non-English languages)
- ❌ International meal databases (cuisine from different countries)
- ❌ Metric-first markets (countries that use kg, cm primarily)

**Advanced Analytics:**
- ❌ Genetic testing integration (personalized nutrition based on DNA)
- ❌ Blood work analysis (optimize macros based on lab results)
- ❌ Sleep tracking integration (correlate sleep with weight loss)
- ❌ Stress tracking (cortisol impact on weight)

**Gamification:**
- ❌ XP and leveling system (earn points for logging, hitting targets)
- ❌ Custom user avatars (virtual representation that changes with progress)
- ❌ Unlockable content (new recipes, workouts unlocked with achievements)

**Technical:**
- ❌ Web app version (access from desktop browser)
- ❌ Tablet-optimized UI (iPad Pro, Android tablets)
- ❌ Apple Watch standalone app (log meals/workouts from watch)
- ❌ Siri Shortcuts / Google Assistant integration (voice commands)

---

### Explicitly Rejected Features

The following features were considered but explicitly rejected for the MVP and future versions.

**Rejected for MVP:**
- ❌ **Calorie scanning via camera:** Too complex, accuracy concerns
- ❌ **Multi-user households:** Adds significant complexity for limited demand
- ❌ **Custom recipe builder:** Users can provide feedback to steer AI instead
- ❌ **Macro cycling (different targets per day):** Adds complexity, limited demand
- ❌ **Intermittent fasting timers:** Outside core value proposition

**Rejected Forever:**
- ❌ **Medical advice or diagnoses:** Legal and ethical concerns
- ❌ **Prescription diet plans (e.g., medical ketogenic diet):** Requires medical supervision
- ❌ **Supplement recommendations:** Outside expertise, liability concerns
- ❌ **Eating disorder support:** Requires professional intervention, app not equipped

---

## Appendix

### Document Metadata

**Created:** 2025-11-07
**Last Updated:** 2025-11-07
**Version:** 1.0
**Status:** Final
**Approved By:** User (Webb Hayes)

---

### Change Log

#### v1.0 - 2025-11-07 (Initial Version)
- Extracted all user stories from Q1-Q3.7 planning specifications
  - 32 detailed user stories (Q1-Q3.1) with full acceptance criteria, API endpoints, database tables
  - Comprehensive feature summaries for Q3.2-Q3.7 with references to planning specs
- Documented 16 non-functional requirements (performance, security, accessibility, offline)
- Defined 16 success metrics and KPIs (retention, adoption, performance, stability, conversion)
- Prioritized features (P0 MVP, P1 Post-MVP, P2 V2+)
- Documented 8 dependencies, 8 assumptions, and comprehensive out-of-scope features
- Total: 2,153 lines (exceeds 1,200-1,500 line target due to comprehensive coverage)

---

### Cross-References

**Planning Specifications:**
- [Q0_DATA_STRUCTURES.md](../Q0_DATA_STRUCTURES.md) - Data structure definitions
- [Q1_Onboarding_FINAL.md](../planning/Q1_Onboarding_FINAL.md) - Onboarding flow (v3.1)
- [Q2_MealPlanning_FINAL.md](../planning/Q2_MealPlanning_FINAL.md) - Meal planning (v2.1)
- [Q3.0_Navigation_AppShell_FINAL.md](../planning/Q3.0_Navigation_AppShell_FINAL.md) - App shell (v1.2)
- [Q3.1_Settings_Profile_FINAL.md](../planning/Q3.1_Settings_Profile_FINAL.md) - Settings (v1.0)
- [Q3.2_AI_Logging_FINAL.md](../planning/Q3.2_AI_Logging_FINAL.md) - AI logging (v1.0)
- [Q3.3_Swapping_FINAL.md](../planning/Q3.3_Swapping_FINAL.md) - Swapping (v1.1)
- [Q3.4_Weekly_Planning_Grocery_FINAL.md](../planning/Q3.4_Weekly_Planning_Grocery_FINAL.md) - Weekly planning (v1.1)
- [Q3.5_Progress_Analytics_FINAL.md](../planning/Q3.5_Progress_Analytics_FINAL.md) - Progress (v1.0)
- [Q3.6_History_Saved_FINAL.md](../planning/Q3.6_History_Saved_FINAL.md) - History (v1.0)
- [Q3.7_Offline_Sync_FINAL.md](../planning/Q3.7_Offline_Sync_FINAL.md) - Offline (v1.0)

**Implementation Documentation:**
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - 25 PostgreSQL tables
- [API_SPECIFICATION.md](./API_SPECIFICATION.md) - 72 REST API endpoints
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Tech stack and system architecture
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - 11 build phases, timeline, success metrics
- [CODE_STANDARDS.md](./CODE_STANDARDS.md) - Coding standards and testing requirements
- [DEVELOPMENT_SETUP_GUIDE.md](./DEVELOPMENT_SETUP_GUIDE.md) - Local environment setup

**Project Root:**
- [OVERVIEW.md](../OVERVIEW.md) - Project vision and success criteria
- [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) - Visual design system
- [DECISIONS.md](../DECISIONS.md) - Decision log

---

**Document Version:** 1.0
**Last Updated:** 2025-11-07
**Status:** Final
