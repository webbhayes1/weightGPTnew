# Session 8 Handoff: Q3.1-Q3.2 Detailed Feature Specifications

**Date:** November 6, 2025
**Session Type:** Planning
**Duration:** ~4 hours
**Status:** ✅ Complete

---

## Session Summary

Completed Q3.1 (Settings & User Profile Management) and Q3.2 (AI-Powered Logging Deep Dive) specifications, bringing planning progress to 70%. Both specs are comprehensive, development-ready, and apply the Design System throughout. Made decision to include Sharing features (Q3.8) in MVP while deferring Social features to V1/V2.

---

## What Was Accomplished

### 1. Q3.1: Settings & User Profile Management ✅

**File:** [project/planning/Q3.1_Settings_Profile_FINAL.md](../../project/planning/Q3.1_Settings_Profile_FINAL.md)
**Size:** ~1,200 lines
**Status:** Complete and development-ready

**Contents:**
1. **Settings Main Screen:** 6 sections (Profile, Account, Preferences, Support, Privacy, Logout)
2. **Profile Editing:** All onboarding fields editable
   - Personal info (name, email)
   - Goals (goal type, current weight, goal weight, goal date)
   - Dietary preferences (restrictions, eating pattern, avoided foods)
   - Fitness details (activity level, fitness level, equipment)
3. **Account & Subscription:**
   - Subscription status display (Active, Trial, Expired, Cancelled)
   - Billing history with receipts
   - Payment method (managed through App Store/Play Store)
   - Restore purchases (iOS), contact billing support, request refund
4. **Preferences:**
   - Notifications (4 types: Weekly reset, streak reminder, achievements, daily reminder)
   - Units (lbs/kg for weight, feet-inches/cm for height)
   - Theme (light/dark/system)
   - Weekly schedule (week starts on Monday/Sunday, shopping day)
5. **Support & Help:**
   - FAQ with search functionality
   - Contact support form (email with attachments)
   - Bug report form (what/expected/frequency)
   - Feature request form
   - User guide
   - Website link
6. **Privacy & Data:**
   - Privacy policy and Terms of Service
   - Data export (GDPR-compliant, JSON format, sent via email)
   - Data usage information
   - Delete account (30-day grace period, requires typing "DELETE")
7. **Logout:** Confirmation dialog → Session invalidation

**Key Features:**
- **Regeneration Triggers:** Changes to dietary preferences trigger meal plan regeneration, fitness changes trigger workout plan regeneration, activity level changes recalculate TDEE
- **Validation:** All inputs validated with inline errors
- **API Endpoints:** 15 endpoints defined (GET/PATCH for settings, profile, account, support, privacy)
- **Data Structures:** UserSettings, UserProfile (extended), SubscriptionStatus, BillingTransaction, SupportTicket, FAQ
- **Design System Applied:** Frosted glass inputs, gradient CTAs, Glass Slide animations, bottom sheet modals

**Priority Breakdown:**
- P0 (Must have): Settings main, Profile editing, Preferences, Logout
- P1 (Should have): Account status, FAQ, Contact support, Privacy policy, Data export
- P2 (Nice to have): Bug report, Feature request, Billing history, Delete account

---

### 2. Q3.2: AI-Powered Logging Deep Dive ✅

**File:** [project/planning/Q3.2_AI_Logging_FINAL.md](../../project/planning/Q3.2_AI_Logging_FINAL.md)
**Size:** ~1,800 lines
**Status:** Complete and development-ready

**Contents:**
1. **AI Meal Logging:**
   - Natural language text input screen with examples
   - OpenAI GPT-4o-mini for parsing (fast, cost-effective)
   - Decision tree for parsing: Extract foods → Check portion → Check preparation → Check restaurant
   - Follow-up question system (5 types)
   - Restaurant detection (Chipotle, Subway, Starbucks, McDonald's)
   - Confirmation screen with full breakdown (all ingredients with calories/macros)
   - Manual entry fallback (when AI fails after 2 attempts)
2. **AI Workout Logging:**
   - Type detection (Cardio vs Strength, subtypes)
   - Duration and intensity extraction
   - Calorie estimation using MET values
   - Confirmation screen with editable details
3. **Weight Logging:**
   - Simple numeric input (no AI needed)
   - Unit detection (lbs/kg) with auto-conversion
   - Trend display (up/down from last weigh-in)
   - Progress display (distance from goal)
4. **Follow-Up Question System:**
   - **Type 1:** Portion Size (number picker with common serving sizes)
   - **Type 2:** Preparation Method (Grilled, Fried, Baked, Roasted, Other)
   - **Type 3:** Yes/No Confirmation ("Is this correct?")
   - **Type 4:** Restaurant Menu Selection (scrollable list with search)
   - **Type 5:** Intensity Level (Light, Moderate, Vigorous)
5. **Confirmation Screens:**
   - Meal: Full breakdown with edit capabilities, meal type selector, save to favorites toggle
   - Workout: Type, duration, intensity, distance (optional), estimated calories, notes
   - Weight: Large display with trend arrows, progress indicators, notes
6. **Manual Entry Fallback:**
   - Full forms when AI fails
   - Meal: Name, type, calories, macros (P/C/F), date/time
   - Workout: Name, type, duration, intensity, calories, distance, notes, date/time

**Key Features:**
- **OpenAI Integration:** Complete prompt templates for meal and workout parsing
- **Token Budget:** ~$0.016 per user/month (3 meals + 1 workout/day)
- **Restaurant Recognition:** Keyword detection for major chains
- **Portion Inference:** Default serving sizes when user doesn't specify
- **Calorie Calculation:** MET-based formula for workout calories
- **Validation:** Calorie ranges (1-5000 for meals, 1-3000 for workouts), macro validation (±20% of calories)
- **Error Handling:** Timeout (30 sec), API failures, parse failures (retry once, then manual fallback)
- **Data Structures:** LoggedMeal, LoggedWorkout, WeightEntry, AIParseSession, FoodItem, Exercise

**AI Prompts:**
- Meal logging: Extracts food items, portions, preparation, calories, macros
- Workout logging: Extracts type, duration, intensity, estimates calories
- Follow-up generation: Creates clarifying questions when confidence <0.6 or info missing

**Priority Breakdown:**
- P0 (Must have): AI meal logging (text), AI workout logging (text), Weight logging, Follow-up questions (basic), Confirmation screens, Manual fallback
- P1 (Should have): Restaurant detection, Recent meals quick-add, Save to favorites
- P2 (Nice to have): Restaurant menu selection, Customization options, Portion visual guides
- P3 (Post-MVP): Voice input, Photo recognition, Barcode scanner, Batch logging

---

### 3. Documentation Updated ✅

**STATUS.md:**
- Updated to Session 8 progress
- Added Q3.1 and Q3.2 to Completed section
- Updated planning progress: 60% → 70%
- Updated In Progress section (Q3.3-Q3.7 remaining)
- Updated Next Up section (Session 9: Q3.3 & Q3.4)
- Added Session 8 to Recent Activity with full summary

**DECISIONS.md:**
- Added "Sharing Features for MVP, Social Features Deferred to V1/V2" decision
- Rationale: Sharing is valuable for MVP (export/share meal plans, progress, achievements), Social is complex and can wait
- What's in MVP: Export meal plans, progress graphs, achievements, grocery lists, workout plans (PDF, image, share link)
- Deferred to V1/V2: Friend system, challenges, leaderboards, social feed, comments, group challenges, community forum
- Impact: Q3.8 will focus on sharing only (smaller scope than originally considered)

**DEVELOPMENT_LOG.md:**
- Added Session 8 entry with full accomplishments
- Listed all major deliverables for Q3.1 and Q3.2
- Referenced decision in DECISIONS.md
- Set next session focus: Q3.3 & Q3.4

---

## Key Decisions Made

### 1. Sharing Features for MVP, Social Features for V1/V2
- **Chosen:** Include Q3.8 (Sharing Features) in MVP, defer social features to post-launch
- **Rationale:**
  - Sharing is table stakes (export data, share progress)
  - Social is complex (friend systems, moderation, privacy)
  - MVP scope management (focus on solo experience first)
  - Market validation (test if users want social before building)
- **MVP Includes:** Export/share meal plans, progress graphs, achievements, grocery lists, workout plans
- **Deferred:** Friend system, challenges, leaderboards, social feed, comments, groups, community
- **Status:** Active

---

## What's Next (Session 9)

### Immediate Priorities:
1. **Q3.3: Meal & Workout Swapping Systems**
   - Complete meal swapping flow (Quick Swap from week + AI Generation alternatives)
   - Complete workout swapping flow (Library + AI Generation backup)
   - Workout library structure (hundreds of workouts, categorized)
   - Compatibility scoring algorithm (how well swap matches macro targets)
   - Swap constraints and validation
   - Multi-swap functionality
   - Undo swap
   - Swap history tracking

2. **Q3.4: Weekly Planning & Grocery Management**
   - Weekly meal plan generation algorithm
   - Weekly workout plan generation algorithm
   - Grocery list generation logic and categorization
   - Grocery list export (PDF, image, share link)
   - Week navigation and viewing
   - Plan editing and customization
   - Shopping day logic and notifications
   - Plan regeneration rules (when user requests new week)
   - Next week preview
   - Historical week viewing

### Future Sessions:
- **Session 10:** Q3.5 (Progress Analytics & Insights) + Q3.6 (History & Saved Items)
- **Session 11:** Q3.7 (Offline Mode, Sync, Error Handling) + Q3.8 (Sharing Features)
- **Session 12+:** Q4 (Weight Logging expanded), Q5 (Workout Plans expanded), Database Schema, API Specification

### Questions to Resolve:
- None currently - all major architectural decisions made

---

## Files Modified This Session

### Created:
- [project/planning/Q3.1_Settings_Profile_FINAL.md](../../project/planning/Q3.1_Settings_Profile_FINAL.md) - Settings & profile management (~1,200 lines)
- [project/planning/Q3.2_AI_Logging_FINAL.md](../../project/planning/Q3.2_AI_Logging_FINAL.md) - AI-powered logging system (~1,800 lines)

### Updated:
- [project/STATUS.md](../../project/STATUS.md) - Session 8 progress, 60%→70%, Q3.1-Q3.2 added to completed
- [project/DECISIONS.md](../../project/DECISIONS.md) - Sharing vs social decision
- [logs/DEVELOPMENT_LOG.md](../../logs/DEVELOPMENT_LOG.md) - Session 8 entry

---

## Architecture Review

**Current State:**
- ✅ Q1 Onboarding (v3.1)
- ✅ Q2 Meal Planning (v2.1)
- ✅ Q3.0 Navigation & App Shell (v1.2)
- ✅ Q0 Data Structures
- ✅ Design System (v1.0)
- ✅ Q3.1 Settings & Profile (v1.0) **NEW**
- ✅ Q3.2 AI Logging (v1.0) **NEW**
- 📋 Q3.3 Swapping Systems - Next
- 📋 Q3.4 Weekly Planning - Next
- 📋 Q3.5 Progress Analytics
- 📋 Q3.6 History & Saved
- 📋 Q3.7 Offline & Errors
- 📋 Q3.8 Sharing Features
- 📋 Q4 Weight Logging (if needed beyond Q3.0)
- 📋 Q5 Workout Plans (if needed beyond Q3.0)

**Planning Progress:** 70% complete

**No Blocking Issues** - All specs aligned, development-ready

---

## Notes for Next Session

### Q3.3 Planning Notes:
1. **Meal Swapping:**
   - Quick Swap: Choose from any meal in current week (same meal type)
   - AI Generation: Generate 3 alternatives with similar macros (±50 cal, ±5g protein)
   - Macro matching algorithm: Prioritize protein, then total calories, then fat/carbs
   - Favorites prioritization: Show favorited meals first in swap options
   - Dietary restrictions: All swaps respect user's dietary preferences and avoided foods

2. **Workout Swapping:**
   - Primary: Large preloaded library (hundreds of workouts)
   - Categorized by: Type, Duration, Equipment, Goal
   - Compatibility score: % match to user's goals and equipment
   - AI Backup: If library options don't fit, generate 3 custom alternatives
   - Max 2 AI generations per swap (prevent excessive token usage)
   - Library structure: Hierarchical (Strength → Upper/Lower/Core/Full, Cardio → Running/Cycling/HIIT/Other)

3. **Swap Constraints:**
   - Can only swap to same meal type (breakfast→breakfast, lunch→lunch)
   - Daily totals must stay within macro targets (±10%)
   - Workouts can swap to same duration (±10 min)
   - User can't swap to a meal they've disliked (thumbs down feedback)

### Q3.4 Planning Notes:
1. **Grocery List Generation:**
   - Consolidate ingredients across entire week
   - Group by store section (Proteins, Produce, Dairy/Eggs, Pantry, Spices, Frozen, Bakery, Other)
   - Show quantities (e.g., "Chicken breast: 3 lbs" not "6 chicken breasts")
   - User can manually check off items they already have
   - User can add custom items

2. **Weekly Planning Algorithm:**
   - Meals: Distribute calories evenly across days (±5%)
   - Workouts: Respect user's workout frequency from onboarding (e.g., 3 days/week)
   - Rest days: Auto-assign based on workout frequency
   - Variety: No meal repeated more than once per week
   - Grocery optimization: Reuse ingredients across multiple meals when possible

3. **Export Formats:**
   - Grocery list: PDF, plain text (SMS), image (screenshot)
   - Meal plan: PDF with recipes, share link (view-only web page)
   - Workout plan: PDF with exercise details, share link

### Cross-Reference Points:
- **Settings:** Dietary preferences (Q3.1) used in swapping (Q3.3)
- **AI Logging:** Recent meals (Q3.2) can be swapped into plan (Q3.3)
- **Shopping Day:** Preference from Q3.1 determines weekly reset notification timing
- **Eating Pattern:** From Q1/Q3.1, determines which meals generated in weekly plan (Q3.4)

---

## Session Metrics

**Documents Created:** 2 (Q3.1, Q3.2)
**Documents Updated:** 3 (STATUS, DECISIONS, DEVELOPMENT_LOG)
**Lines Written:** ~3,000 (1,200 + 1,800)
**Planning Progress:** +10% (60% → 70%)
**Session Duration:** ~4 hours
**Quality:** High (comprehensive, development-ready, Design System applied)

---

## Handoff Checklist

- [x] Q3.1 Settings & Profile specification complete
- [x] Q3.2 AI Logging specification complete
- [x] Both specs follow Q1/Q2 format (Overview, User Stories, User Flow, Screen Specs, Technical Requirements, Data Structures, Success Criteria, Implementation Notes)
- [x] All data structures defined in TypeScript
- [x] Design System applied throughout (frosted glass, colors, typography, animations)
- [x] API endpoints specified
- [x] Validation rules documented
- [x] Error handling specified
- [x] Priority breakdown (P0/P1/P2/P3)
- [x] Development estimates provided
- [x] Cross-references to other specs included
- [x] STATUS.md updated
- [x] DECISIONS.md updated (sharing vs social)
- [x] DEVELOPMENT_LOG.md updated
- [x] Handoff document created (this file)

---

**Session Status:** ✅ Complete
**Ready for:** Session 9 - Q3.3 (Swapping Systems) & Q3.4 (Weekly Planning)
**Next Session Focus:** Meal/workout swapping logic and weekly planning algorithms

---

**End of Handoff**
