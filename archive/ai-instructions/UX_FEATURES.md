# UX Features Documentation

This document outlines all user experience features for the WeightGPT mobile app. It serves as a comprehensive guide for UI/UX implementation and user flow design.

---

## Table of Contents
1. [Q1: Onboarding Flow](#q1-onboarding-flow) ✅
2. [Q2: Meal Planning](#q2-meal-planning) 🔄
3. [Q3: Meal Tracking](#q3-meal-tracking) 📋
4. [Q4: Weight Logging](#q4-weight-logging) 📋
5. [Q5: Workout Plans](#q5-workout-plans) 📋
6. [Q6: AI Integration](#q6-ai-integration) 📋
7. [Q7: Additional Features](#q7-additional-features) 📋

**Legend:**
- ✅ Complete
- 🔄 In Progress
- 📋 Not Started

---

## Q1: Onboarding Flow ✅

**Status:** Finalized on November 4, 2025 (Revised same day)
**Full Documentation:** See `chathistory/SESSION_2025-11-04_Q1-Onboarding-Flow.md`

### Overview
Complete 20-step onboarding sequence (revised from 24) that collects user information, calculates personalized metrics, generates AI-powered plans, and demonstrates value before paywall.

### Navigation
- **Progress Bar:** Shows "Step X of 20" at top of every screen
- **Back Button:** Top-left (< icon) on all screens except Welcome
- Allows users to navigate backward/forward through onboarding

### User Journey
1. Welcome → Goal Type → Personal Metrics → Timeline
2. Dietary Preferences → Meal Planning Preferences
3. Workout Preferences → App Preferences
4. AI Plan Generation (with loading screens)
5. Value Demonstration (4 screens)
6. Paywall

### Key Features

#### Personal Information Collection
- Goal type (gain/lose/maintain weight)
- Current and goal weight
- Goal date with safety validation
- Height, age, biological sex (combined in one screen)
- Sex at birth: Male / Female only (required for accurate calculations)
- Daily activity level (sedentary/moderate/active)

#### Dietary Preferences
- Dietary restrictions and food allergies (combined in one screen)
- Preferred cuisines (multi-select)
- Cooking context (home/eat out/mix)
- Meal prep time availability
- Meal variety preference (meal prep/variety/balanced)
- Budget consciousness (yes/no)
- Grocery shopping day (determines week start)

#### Workout Preferences
- Equipment access (bodyweight/dumbbells/gym)
- Preferred workout days and session duration (combined in one screen)

#### App Preferences
- Meal logging methods (search/manual)
- Notification preferences and health disclaimer (combined in one screen with toggles + required checkbox)
- Data storage (local vs cloud)

#### Loading Screens
**6 Strategic Loading Breaks (Revised):**
1. After Goal Date: Timeline analysis (2s)
2. After Activity Level: Calorie calculation (2s)
3. After Grocery Day: Section transition to workouts (1.5s)
4. After Equipment: Workout frequency recommendation (2s)
5. After Workout Schedule: Schedule optimization (2-3s)
6. After Data Preference: Major AI generation (15-45s)

**Major Loading Sequence Design:**
- Circular progress indicators (0-100%)
- Clean, modern animations with subtle pulse
- Rotating educational tips (every 5 seconds)
- 4 phases: Metabolic (15%), Meals (45%), Workouts (75%), Trajectory (95%)

#### Value Demonstration Screens
**Pre-Paywall Value Display:**

1. **Weight Projection Graph**
   - Visual timeline from current to goal weight
   - Weekly progress projections
   - Total weight change and average weekly rate
   - Safe & sustainable indicator

2. **Daily Nutrition Targets**
   - 4 circular progress rings (calories, protein, carbs, fat)
   - Personalized ranges based on calculations
   - Context explanation (goal + activity level)

3. **Workout Overview**
   - Weekly calendar visualization
   - Strength and cardio session breakdown
   - Rest day indicators
   - Equipment and progressive overload notes

4. **Sample Day Preview**
   - Specific meals for one day (all 4 meals)
   - Today's workout with exercise preview
   - Calorie and macro totals
   - "Unlock Full Plan" CTA

### Technical Specifications

#### Calculations
- **BMR:** Mifflin-St Jeor equation (sex-specific)
- **TDEE:** BMR × activity multiplier (1.2-1.7)
- **Daily Calories:** TDEE ± 250-750 based on goal
- **Macros:** Protein 0.8-1.2g/lb, Fat 20-30%, Carbs remainder

#### Safety Validations
- Weight loss: Max 2 lbs/week
- Weight gain: Max 1 lb/week
- Warning system for aggressive timelines
- Adjustment suggestions or override option

#### Workout Recommendations
- Weight Loss: 5 days (3 strength + 2 cardio)
- Maintenance: 4 days (3 strength + 1 cardio)
- Weight Gain: 4-5 days (4 strength + 1 cardio)

#### Data Storage
```json
{
  "user_profile": {
    "personal_metrics": { ... },
    "dietary_preferences": { ... },
    "workout_preferences": { ... },
    "app_preferences": { ... }
  },
  "calculated_metrics": {
    "bmr": 1750,
    "tdee": 2450,
    "daily_calories": 1950,
    "macros": { ... },
    "workout_frequency_recommended": 5
  }
}
```

### Design Guidelines

#### Visual Style
- Clean, modern aesthetic
- Circular progress indicators with gradients
- Smooth transitions and animations
- Icon morphing (🍎 → 💪) for section changes

#### Accessibility
- Minimum text: 14px
- Contrast ratio: 4.5:1 (body), 3:1 (large text)
- Touch targets: Minimum 44×44px
- Screen reader support for all elements

#### Animation Timing
- Quick calculations: Auto-dismiss after 2s
- Transitions: 300-400ms slide/fade
- Loading pulse: 1500ms infinite ease-in-out
- Button press: 100ms scale down, 150ms bounce back

---

## Q2: Meal Planning 📋

**Status:** Not Started
**Expected Topics:**
- Meal plan viewing (weekly vs daily)
- Recipe detail screens
- Meal logging workflows
- Shopping list generation
- Meal swapping and customization
- Favorites and saved meals
- Meal feedback system (thumbs up/down implementation)

*To be filled after Q2 discussion*

---

## Q3: Meal Tracking 📋

**Status:** Not Started
**Expected Topics:**
- How users log meals (search, manual entry)
- Meal database structure
- Custom meal creation
- Editing logged meals
- Daily calorie/macro tracking display
- Progress visualization
- Meal history and patterns

*To be filled after Q3 discussion*

---

## Q4: Weight Logging 📋

**Status:** Not Started
**Expected Topics:**
- Weight entry interface
- Frequency and reminders
- Progress graphs and charts
- Milestone celebrations
- Body measurements (optional)
- Progress photos (optional)
- Trend analysis and predictions

*To be filled after Q4 discussion*

---

## Q5: Workout Plans 📋

**Status:** Not Started
**Expected Topics:**
- Workout plan viewing (weekly schedule)
- Daily workout detail screens
- Exercise instructions and form cues
- Workout logging and tracking
- Progressive overload tracking
- Rest timer functionality
- Workout completion flow

*To be filled after Q5 discussion*

---

## Q6: AI Integration 📋

**Status:** Not Started
**Expected Topics:**
- OpenAI API touchpoints
- Meal plan generation prompts
- Workout plan generation prompts
- AI coach chat feature (Phase 2)
- Personalization and learning
- Error handling and fallbacks

*To be filled after Q6 discussion*

---

## Q7: Additional Features 📋

**Status:** Not Started
**Expected Topics:**
- Social features (if any)
- Notifications and reminders
- Settings and preferences
- Profile editing
- Progress sharing
- Export data functionality
- Offline mode capabilities

*To be filled after Q7 discussion*

---

## Design System

### Color Palette (TBD)
*To be defined during UI design phase*

Suggested:
- Primary: Health/wellness blue-green
- Secondary: Energy/motivation orange
- Success: Green
- Warning: Yellow/orange
- Error: Red
- Neutral: Grays

### Typography (TBD)
*To be defined during UI design phase*

Suggested:
- Headings: Inter, SF Pro (bold, modern sans-serif)
- Body: Same as headings (clean, readable)
- Numbers: Tabular figures for alignment

### Component Library
*To be built during development*

Components needed:
- Circular progress indicators
- Loading screens with tips
- Calendar/day selectors
- Meal cards
- Workout cards
- Graphs and charts
- Progress rings
- Form inputs
- Buttons (primary, secondary, text)
- Modal/bottom sheets

---

## User Flows

### Critical User Flows

#### 1. First-Time User Flow
```
Open App
  ↓
Welcome Screen
  ↓
Complete Onboarding (24 steps + loading)
  ↓
View Value Demonstration (4 screens)
  ↓
Hit Paywall
  ↓
Subscribe
  ↓
Access Full App (Home Dashboard)
```

#### 2. Daily User Flow (TBD in Q2-Q7)
```
Open App
  ↓
Home Dashboard
  ↓
[To be defined based on Q2-Q7 discussions]
```

---

## Success Metrics

### Onboarding Metrics
- Completion rate (% who finish all 24 steps)
- Drop-off points (which steps lose users)
- Average time to complete
- Paywall conversion rate
- Value demo engagement (time spent on each screen)

### Feature Usage (TBD)
*To be defined after Q2-Q7*

---

## Phase 2 Enhancements

### Future Features (Post-MVP)
- Camera-based food logging (OpenAI Vision API)
- Barcode scanning for packaged foods
- Social sharing and challenges
- Advanced analytics and insights
- Fitness tracker integrations
- AI coach chat
- Recipe videos
- Form check (camera-based)

*Full Phase 2 specification in SESSION_2025-11-04_Q1-Onboarding-Flow.md*

---

**Document Version:** 1.0
**Last Updated:** November 4, 2025
**Next Update:** After Q2 finalization
