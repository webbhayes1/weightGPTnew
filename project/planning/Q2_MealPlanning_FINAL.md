# Q2: Meal Planning - Final Specification

**Feature:** Meal Planning
**Status:** ✅ Finalized
**Version:** 2.3
**Owner:** Planning context
**Created:** 2025-11-04
**Last Updated:** 2025-11-10 (Session 24: Post-Subscription UX)

---

## Table of Contents
1. [Overview](#overview)
2. [User Stories](#user-stories)
3. [User Flow](#user-flow)
4. [Screen Specifications](#screen-specifications)
5. [Technical Requirements](#technical-requirements)
6. [Data Structures](#data-structures)
7. [Success Criteria](#success-criteria)
8. [Implementation Notes](#implementation-notes)
9. [Revisions](#revisions)

---

## Overview

**What:** AI-generated personalized weekly meal plans that users can view, customize, and use for meal preparation. Includes recipe details, meal swapping, feedback system, shopping list generation, and weekly regeneration.

**Why:** This is the core value proposition of WeightGPT - personalized meal plans that respect user preferences, dietary needs, and time constraints. Without this feature, users cannot see the actual meals that will help them reach their goals.

**When:** After user completes onboarding and subscribes. This is the primary feature users interact with daily/weekly.

**Dependencies:**
- Q1 Onboarding complete (provides all user data needed for generation)
- User subscribed (paywall passed)
- OpenAI API integration (GPT-4 for meal generation)

---

## User Stories

### Primary User Story
**As a** WeightGPT subscriber
**I want** to view my personalized weekly meal plan with recipes and shopping lists
**So that** I can prepare meals that align with my weight goals and preferences
**Acceptance Criteria:**
- [ ] Meal plan generates in background on first app open after subscription
- [ ] All 7 days of meals are visible (breakfast, lunch, dinner)
- [ ] Each meal shows name, calories, and macros
- [ ] Tapping a meal reveals full recipe with ingredients and instructions
- [ ] All meals respect my dietary preferences and avoided foods from onboarding

### Meal Swapping Story
**As a** user who doesn't like a particular meal
**I want** to swap it for an alternative
**So that** I can stick to my plan without eating foods I dislike
**Acceptance Criteria:**
- [ ] Each meal has a "Swap" button
- [ ] Swapping shows 3 alternatives with similar macros (±50 cal, ±5g protein)
- [ ] Alternatives respect all dietary preferences and avoided foods
- [ ] Selecting an alternative replaces only that meal
- [ ] Daily totals stay within macro targets

### Feedback Story
**As a** user who tried a meal
**I want** to rate it with thumbs up/down
**So that** future meal plans improve based on my preferences
**Acceptance Criteria:**
- [ ] Each meal has thumbs up/down buttons
- [ ] Feedback is saved immediately
- [ ] Optional ingredient-level feedback available
- [ ] Future meal plans learn from my ratings

### Shopping List Story
**As a** user preparing to grocery shop
**I want** an organized shopping list for the week
**So that** I can efficiently buy everything I need
**Acceptance Criteria:**
- [ ] Shopping list auto-generates after meal confirmation
- [ ] Ingredients are consolidated with quantities (e.g., "4 chicken breasts")
- [ ] Can check off items while shopping
- [ ] Can add custom items manually
- [ ] Can remove items I already have
- [ ] Can share/export list

### Weekly Regeneration Story
**As a** user at the end of my week
**I want** to generate next week's meal plan
**So that** I always have fresh meals planned
**Acceptance Criteria:**
- [ ] Prompted on my shopping day to generate new plan
- [ ] Can include favorite meals from previous weeks
- [ ] Can regenerate manually anytime
- [ ] New plan learns from previous feedback

---

## User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER JOURNEY                              │
└─────────────────────────────────────────────────────────────┘

[User Completes Onboarding] → [Subscribes at Paywall]
           ↓
[First App Open After Subscription]
           ↓
[Background: Meal Plan Generates - 15-20 seconds]
           ↓
[Welcome Screen: "Your plan is ready!"]
           ↓
[Home Dashboard]
           ↓
       Tap "Meal Plan" Tab
           ↓
┌─────────────────────────────────────────────────────────────┐
│                MEAL PLAN VIEW (Daily Detail)                 │
│                                                              │
│  [< Prev Day]    Monday, Nov 4    [Next Day >]              │
│                                                              │
│  🍳 BREAKFAST                                                │
│  Greek Yogurt Parfait                                        │
│  320 cal | 25g P | 40g C | 8g F                             │
│  [👍 👎]  [Swap]  [View Recipe]                              │
│                                                              │
│  🥗 LUNCH                                                     │
│  Grilled Chicken Salad                                       │
│  450 cal | 45g P | 30g C | 15g F                            │
│  [👍 👎]  [Swap]  [View Recipe]                              │
│                                                              │
│  🍝 DINNER                                                    │
│  Salmon with Quinoa                                          │
│  520 cal | 50g P | 45g C | 18g F                            │
│  [👍 👎]  [Swap]  [View Recipe]                              │
│                                                              │
│  Daily Total: 1,290 cal | 120g P | 115g C | 41g F          │
│  Target: 2,100-2,300 cal | 150-180g P                       │
│                                                              │
│  [Generate Shopping List]  [Regenerate Week]                │
└─────────────────────────────────────────────────────────────┘
           ↓
       User Interactions:
           ↓
    ┌──────┴──────┐
    ↓             ↓             ↓
[View Recipe] [Swap Meal]  [Rate Meal]
    ↓             ↓             ↓

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ RECIPE       │  │ SWAP         │  │ FEEDBACK     │
│ DETAIL       │  │ ALTERNATIVES │  │ SCREEN       │
└──────────────┘  └──────────────┘  └──────────────┘

           ↓
    [Generate Shopping List]
           ↓
┌─────────────────────────────────────────────────────────────┐
│                    SHOPPING LIST                             │
│                                                              │
│  Week of Nov 4-10                                            │
│                                                              │
│  PRODUCE                                                     │
│  [ ] 2 lbs spinach                                           │
│  [ ] 4 tomatoes                                              │
│  [ ] 1 bunch bananas                                         │
│                                                              │
│  PROTEIN                                                     │
│  [ ] 4 chicken breasts                                       │
│  [ ] 2 lbs salmon                                            │
│  [ ] 1 dozen eggs                                            │
│                                                              │
│  [Share List]  [Add Item]  [Clear All]                      │
└─────────────────────────────────────────────────────────────┘

           ↓
    [End of Week - Shopping Day Arrives]
           ↓
┌─────────────────────────────────────────────────────────────┐
│              REGENERATION PROMPT                             │
│                                                              │
│  It's Sunday - time for your new meal plan!                 │
│                                                              │
│  Include any favorites from last week?                       │
│                                                              │
│  [✓] Greek Yogurt Parfait (liked 3 times)                   │
│  [✓] Grilled Chicken Salad (liked 5 times)                  │
│  [ ] Salmon with Quinoa (disliked)                          │
│                                                              │
│  [Generate New Plan]  [Keep Current Plan]                   │
└─────────────────────────────────────────────────────────────┘

           ↓
    [Background Generation - 15-20s]
           ↓
    [New Week Ready!]
           ↓
    [Cycle Repeats]
```

---

## Screen Specifications

### Screen 1: Home Dashboard (Entry Point)

**Purpose:** Main navigation hub with quick access to all features

**Layout:**
```
┌─────────────────────────────────┐
│  WeightGPT                   ⚙️  │
│                                 │
│  [Profile Photo]                │
│  Hey Sarah! You're on track     │
│                                 │
│  ┌─────────────────────────┐   │
│  │   Progress This Week    │   │
│  │   ▓▓▓▓▓▓░░░░ 60%        │   │
│  │   3 of 5 workouts ✓     │   │
│  │   5 of 7 meals logged   │   │
│  └─────────────────────────┘   │
│                                 │
│  Quick Actions:                 │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ 🍽️   │ │ 📊   │ │ 💪   │   │
│  │Meals │ │Track │ │Workout│  │
│  └──────┘ └──────┘ └──────┘   │
│                                 │
│  ─── Bottom Navigation ───     │
│  [Home] [Log] [Progress]        │
└─────────────────────────────────┘
```

**Navigation:**
- Top-right: Settings gear icon
- Bottom nav bar always visible (3-tab navigation)
- **Access meal plan:** Home tab → [View My Week] button → Goes to Screen 2 (Meal Plan View)
- **Note:** Previous 4-tab design with dedicated "Meals" tab has been replaced with 3-tab design (See Q3.0 for full navigation specification)

**States:**
- First time after subscription: "Your meal plan is generating..." overlay
- Plan ready: Standard view
- Week expired: Banner "Generate your next week's plan!"

---

### Screen 2: Meal Plan View (Daily Detail)

**Purpose:** Primary view for browsing weekly meal plan day-by-day

**Layout:**
```
┌─────────────────────────────────┐
│  ← Meal Plan                    │
│                                 │
│  Week of Nov 4-10               │
│  [<] Monday, Nov 4 [>]          │
│                                 │
│  ────────────────────────────   │
│                                 │
│  🍳 BREAKFAST                    │
│  Greek Yogurt Parfait           │
│  320 cal | 25g P | 40g C | 8g F │
│  ⏱️ 5 min prep                   │
│                                 │
│  [👍] [👎]  [Swap]  [View Recipe]│
│                                 │
│  ────────────────────────────   │
│                                 │
│  🥗 LUNCH                         │
│  Grilled Chicken Salad          │
│  450 cal | 45g P | 30g C | 15g F│
│  ⏱️ 20 min prep                  │
│                                 │
│  [👍] [👎]  [Swap]  [View Recipe]│
│                                 │
│  ────────────────────────────   │
│                                 │
│  🍝 DINNER                       │
│  Salmon with Quinoa             │
│  520 cal | 50g P | 45g C | 18g F│
│  ⏱️ 35 min prep                  │
│                                 │
│  [👍] [👎]  [Swap]  [View Recipe]│
│                                 │
│  ────────────────────────────   │
│                                 │
│  📊 DAILY TOTALS                │
│  1,290 / 2,150 cal              │
│  120 / 160g protein             │
│  115 / 230g carbs               │
│  41 / 65g fat                   │
│                                 │
│  ⚠️ Below targets - need snacks  │
│                                 │
│  [Generate Shopping List]       │
│  [Regenerate This Week]         │
│                                 │
│  ─── Bottom Nav ───             │
└─────────────────────────────────┘
```

**Interactions:**
- **Swipe left/right** → Navigate between days
- **Tap [<] [>] arrows** → Navigate between days
- **Tap meal name/image** → Opens Screen 3 (Recipe Detail)
- **Tap [View Recipe]** → Opens Screen 3 (Recipe Detail)
- **Tap [Swap]** → Opens Screen 4 (Meal Swap)
- **Tap [👍]** → Records positive feedback, button highlights green
- **Tap [👎]** → Opens Screen 5 (Feedback Detail) to specify why
- **Tap [Generate Shopping List]** → Opens Screen 6 (Shopping List)
- **Tap [Regenerate This Week]** → Opens Screen 8 (Regeneration Prompt)

**Data Displayed:**
- Week date range (e.g., "Nov 4-10")
- Current day name and date
- Each meal: emoji, name, macros, prep time
- Feedback buttons (thumbs up/down) with state (grayed if not rated, highlighted if rated)
- Daily totals vs. targets from onboarding
- Warning if significantly below/above targets

**Validation:**
- If daily total < 80% of target: Show "⚠️ Below targets" message
- If daily total > 120% of target: Show "⚠️ Above targets" message
- If all meals rated: Show "✓ All rated - your next plan will be even better!"

**Mobile UX:**
- Large tap targets for all buttons (min 44x44 pt)
- Swipe gesture for day navigation
- Smooth transition animations between days
- Pull-to-refresh gesture regenerates current week

**Notes:**
- This is a **daily detail view**, not a calendar grid
- Users swipe through days sequentially
- Focus on one day at a time to avoid overwhelm
- Shows 3 meals per day (breakfast, lunch, dinner - no snacks in initial plan)

---

### Screen 3: Recipe Detail

**Purpose:** Full recipe view with ingredients, instructions, and nutrition

**Layout:**
```
┌─────────────────────────────────┐
│  ← Back                         │
│                                 │
│  [Recipe Photo Placeholder]    │
│                                 │
│  Greek Yogurt Parfait           │
│  🍳 Breakfast | ⏱️ 5 min        │
│                                 │
│  ────────────────────────────   │
│                                 │
│  📊 NUTRITION                   │
│  Calories: 320                  │
│  Protein: 25g                   │
│  Carbs: 40g                     │
│  Fat: 8g                        │
│                                 │
│  ────────────────────────────   │
│                                 │
│  🛒 INGREDIENTS (1 serving)     │
│  • 1 cup Greek yogurt (2%)      │
│  • 1/2 cup granola              │
│  • 1/2 cup mixed berries        │
│  • 1 tbsp honey                 │
│  • 1/4 cup sliced almonds       │
│                                 │
│  ────────────────────────────   │
│                                 │
│  📝 INSTRUCTIONS                │
│  1. Add Greek yogurt to bowl    │
│  2. Layer granola on top        │
│  3. Add mixed berries           │
│  4. Drizzle with honey          │
│  5. Top with sliced almonds     │
│  6. Serve immediately           │
│                                 │
│  ────────────────────────────   │
│                                 │
│  💡 TIPS                        │
│  • Use frozen berries to save   │
│    money                        │
│  • Prep ingredients night before│
│                                 │
│  ────────────────────────────   │
│                                 │
│  [⭐ Save as Favorite]          │
│  [🔄 Swap This Meal]            │
│  [👍] [👎]                      │
│                                 │
└─────────────────────────────────┘
```

**Interactions:**
- **Tap [← Back]** → Returns to Screen 2 (Meal Plan View)
- **Tap [Save as Favorite]** → Saves recipe, button changes to "⭐ Saved"
- **Tap [Swap This Meal]** → Opens Screen 4 (Meal Swap)
- **Tap [👍]** → Records positive feedback, returns to Screen 2
- **Tap [👎]** → Opens Screen 5 (Feedback Detail)
- **Scroll** → View full recipe content

**Data Displayed:**
- Recipe photo placeholder (MVP: no photos, just placeholder)
- Recipe name and meal type
- Prep/cook time
- Complete nutrition (calories, protein, carbs, fat)
- Ingredient list with quantities
- Step-by-step instructions
- Optional cooking tips (if generated by AI)

**Mobile UX:**
- Recipe photo takes up top 1/3 of screen
- Content scrolls underneath fixed back button
- Ingredients use checkbox UI (for visual scanning, not interactive in MVP)
- Large text for instructions (easy to read while cooking)

**Notes:**
- Recipe detail is view-only in MVP
- No serving size adjustment (always 1 serving)
- No print function (can add later)
- No nutritional details beyond macros (no fiber, sodium, etc. in MVP)

---

### Screen 4: Meal Swap (Alternatives)

**Purpose:** Replace a meal with an alternative that matches macros and preferences

**Layout:**
```
┌─────────────────────────────────┐
│  ← Back                         │
│                                 │
│  Swap: Salmon with Quinoa       │
│  (Monday Dinner)                │
│                                 │
│  Original: 520 cal | 50g P      │
│                                 │
│  ────────────────────────────   │
│                                 │
│  Choose an alternative:         │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Grilled Chicken &       │   │
│  │ Sweet Potato            │   │
│  │                         │   │
│  │ 515 cal | 48g P         │   │
│  │ 45g C | 16g F           │   │
│  │ ⏱️ 35 min               │   │
│  │                         │   │
│  │ [Select This Meal]      │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Turkey Meatballs &      │   │
│  │ Zucchini Noodles        │   │
│  │                         │   │
│  │ 510 cal | 52g P         │   │
│  │ 38g C | 18g F           │   │
│  │ ⏱️ 40 min               │   │
│  │                         │   │
│  │ [Select This Meal]      │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Tofu Stir-Fry with      │   │
│  │ Brown Rice              │   │
│  │                         │   │
│  │ 525 cal | 47g P         │   │
│  │ 52g C | 15g F           │   │
│  │ ⏱️ 30 min               │   │
│  │                         │   │
│  │ [Select This Meal]      │   │
│  └─────────────────────────┘   │
│                                 │
│  [Cancel]                       │
│                                 │
└─────────────────────────────────┘
```

**Interactions:**
- **Tap [← Back]** → Returns to previous screen (cancels swap)
- **Tap [Select This Meal]** → Confirms swap, replaces meal, returns to Screen 2
- **Tap [Cancel]** → Cancels swap, returns to previous screen
- **Scroll** → View all 3 alternatives

**Generation Logic:**
- When user taps "Swap" on a meal, API call to OpenAI GPT-4
- Prompt includes:
  - Original meal macros (target: ±50 cal, ±5g protein)
  - User's dietary preferences from onboarding
  - User's avoided foods from onboarding
  - User's preferred cuisines from onboarding
  - User's meal prep time preference from onboarding
  - User's budget consciousness from onboarding
  - Request exactly 3 alternatives
- GPT-4 returns 3 alternatives with full recipe details
- Display alternatives with macro comparison to original

**Loading State:**
```
┌─────────────────────────────────┐
│  Finding alternatives...        │
│                                 │
│  [Circular progress - 3-5s]    │
│                                 │
│  💡 Tip: All meals match your   │
│  dietary preferences            │
└─────────────────────────────────┘
```

**Data Displayed:**
- Original meal name and meal type (e.g., "Monday Dinner")
- Original meal macros (for comparison)
- 3 alternative meals with:
  - Name
  - Calories and macros
  - Prep time
  - "Select" button

**Validation:**
- All alternatives must be within ±50 calories of original
- All alternatives must be within ±5g protein of original
- All alternatives must respect dietary preferences
- All alternatives must avoid specified foods

**Mobile UX:**
- Each alternative is a card with clear tap target
- Cards stack vertically for easy scrolling
- Visual comparison to original meal at top
- Loading state while API generates alternatives

**Notes:**
- Swapping replaces ONLY that specific meal
- Other meals in the day remain unchanged
- Daily totals recalculate automatically
- Swap is immediate (no confirmation dialog)
- Can swap again if still not satisfied

---

### Screen 5: Feedback Detail (Thumbs Down)

**Purpose:** Collect detailed feedback when user dislikes a meal

**Layout:**
```
┌─────────────────────────────────┐
│  ← Back                         │
│                                 │
│  What didn't you like about     │
│  Salmon with Quinoa?            │
│                                 │
│  ────────────────────────────   │
│                                 │
│  Overall Meal:                  │
│  [✓] Didn't match my taste      │
│  [ ] Too time-consuming         │
│  [ ] Missing ingredients        │
│  [ ] Too expensive              │
│                                 │
│  ────────────────────────────   │
│                                 │
│  Specific Ingredients:          │
│  (optional)                     │
│                                 │
│  [✓] Salmon                     │
│  [ ] Quinoa                     │
│  [ ] Lemon                      │
│  [ ] Olive oil                  │
│  [ ] Garlic                     │
│                                 │
│  ────────────────────────────   │
│                                 │
│  💡 This helps us improve your  │
│  future meal plans              │
│                                 │
│  [Submit Feedback]              │
│  [Skip - Just Dislike]          │
│                                 │
└─────────────────────────────────┘
```

**Interactions:**
- **Tap [← Back]** → Cancels feedback, returns to previous screen
- **Tap checkbox** → Toggles selection (multi-select allowed)
- **Tap [Submit Feedback]** → Saves detailed feedback, returns to Screen 2
- **Tap [Skip - Just Dislike]** → Saves only thumbs down, returns to Screen 2

**Data Collected:**
- Meal ID
- Overall feedback reason(s) (can select multiple):
  - Didn't match my taste
  - Too time-consuming
  - Missing ingredients
  - Too expensive
- Specific ingredient dislikes (optional, can select multiple)
- Timestamp

**States:**
- Default: No checkboxes selected
- Must select at least one overall reason OR skip to submit
- Ingredient feedback is always optional

**Mobile UX:**
- Large checkboxes for easy tapping
- Clear distinction between "overall" and "ingredient" sections
- Skip button allows quick dismissal
- Informational text explains benefit of feedback

**Notes:**
- Feedback is used to influence future meal plan generation
- Disliked ingredients may be avoided in future plans
- Common reasons (time, cost) adjust generation parameters
- Feedback doesn't affect current week's plan, only future weeks

---

### Screen 6: Shopping List

**Purpose:** Consolidated ingredient list for the entire week

**Layout:**
```
┌─────────────────────────────────┐
│  ← Back                         │
│                                 │
│  Shopping List                  │
│  Week of Nov 4-10               │
│                                 │
│  ────────────────────────────   │
│                                 │
│  🥬 PRODUCE                     │
│  [ ] Spinach - 2 lbs            │
│  [ ] Tomatoes - 4 medium        │
│  [ ] Bananas - 1 bunch          │
│  [ ] Bell peppers - 3           │
│  [ ] Onions - 2 large           │
│  [+ Add Item]                   │
│                                 │
│  ────────────────────────────   │
│                                 │
│  🥩 PROTEIN                     │
│  [ ] Chicken breast - 4 pieces  │
│  [ ] Salmon - 2 lbs             │
│  [ ] Eggs - 1 dozen             │
│  [ ] Greek yogurt - 32 oz       │
│  [+ Add Item]                   │
│                                 │
│  ────────────────────────────   │
│                                 │
│  🌾 GRAINS & PASTA              │
│  [ ] Quinoa - 2 cups            │
│  [ ] Brown rice - 1 lb          │
│  [ ] Whole wheat bread - 1 loaf │
│  [+ Add Item]                   │
│                                 │
│  ────────────────────────────   │
│                                 │
│  🥛 DAIRY                       │
│  [ ] Milk - 1/2 gallon          │
│  [ ] Cheddar cheese - 8 oz      │
│  [+ Add Item]                   │
│                                 │
│  ────────────────────────────   │
│                                 │
│  🥫 PANTRY                      │
│  [ ] Olive oil - 16 oz          │
│  [ ] Honey - 12 oz              │
│  [+ Add Item]                   │
│                                 │
│  ────────────────────────────   │
│                                 │
│  [✓ 8/23 items checked]         │
│                                 │
│  [📤 Share]  [🗑️ Clear Checked] │
│                                 │
└─────────────────────────────────┘
```

**Interactions:**
- **Tap [← Back]** → Returns to Screen 2 (Meal Plan View)
- **Tap checkbox** → Toggles item as checked/unchecked
- **Tap item text** → Opens inline edit to modify quantity or delete
- **Tap [+ Add Item]** → Opens quick add dialog (text input for custom item)
- **Tap [Share]** → Opens native share sheet (text, email, SMS, etc.)
- **Tap [Clear Checked]** → Removes all checked items from list
- **Scroll** → View all categories and items

**Generation Logic:**
- Auto-generates after user confirms meals for the week
- Triggered by "Generate Shopping List" button on Screen 2
- Algorithm:
  1. Extract all ingredients from all 21 meals (7 days × 3 meals)
  2. Consolidate duplicate ingredients (sum quantities)
  3. Group by category (Produce, Protein, Grains, Dairy, Pantry)
  4. Convert to shopping-friendly units (e.g., "4 chicken breasts" not "1.5 lbs raw chicken")
  5. Sort alphabetically within each category

**Data Structure:**
```javascript
{
  categories: [
    {
      name: "Produce",
      emoji: "🥬",
      items: [
        { id: "1", name: "Spinach", quantity: "2 lbs", checked: false, custom: false },
        { id: "2", name: "Tomatoes", quantity: "4 medium", checked: false, custom: false }
      ]
    },
    {
      name: "Protein",
      emoji: "🥩",
      items: [...]
    }
  ]
}
```

**States:**
- Loading: "Generating shopping list..." (1-2 seconds)
- Empty: "No meals selected for this week"
- Generated: Standard view with all items
- All checked: "✓ All done! Clear checked items?"

**Mobile UX:**
- Large checkboxes for easy tapping while shopping
- Items grouped by grocery store section for efficient shopping
- Check-off interaction provides immediate visual feedback
- Progress counter shows how many items checked
- Smooth animations for checking/unchecking

**Export Format (Share):**
```
WeightGPT Shopping List
Week of Nov 4-10

PRODUCE
- Spinach - 2 lbs
- Tomatoes - 4 medium
- Bananas - 1 bunch

PROTEIN
- Chicken breast - 4 pieces
- Salmon - 2 lbs
- Eggs - 1 dozen

[continues...]
```

**Notes:**
- Shopping list persists across app sessions
- Regenerating meal plan clears old shopping list
- Can manually edit quantities (tap item to edit)
- Can delete items by swiping left (iOS) or long-press (Android)
- Custom items user adds are saved with `custom: true` flag

---

### Screen 7: Meal Confirmation (Pre-Shopping List)

**Purpose:** Review weekly meals before generating shopping list

**Layout:**
```
┌─────────────────────────────────┐
│  ← Back                         │
│                                 │
│  Confirm Your Week              │
│                                 │
│  Review your meals before we    │
│  generate your shopping list    │
│                                 │
│  ────────────────────────────   │
│                                 │
│  📅 MONDAY                      │
│  • Greek Yogurt Parfait         │
│  • Grilled Chicken Salad        │
│  • Salmon with Quinoa           │
│                                 │
│  📅 TUESDAY                     │
│  • Protein Smoothie Bowl        │
│  • Turkey & Avocado Wrap        │
│  • Beef Stir-Fry               │
│                                 │
│  📅 WEDNESDAY                   │
│  • Overnight Oats               │
│  • Tuna Poke Bowl               │
│  • Chicken Fajitas              │
│                                 │
│  [... continues for 7 days ...]  │
│                                 │
│  ────────────────────────────   │
│                                 │
│  📊 Weekly Totals               │
│  Avg: 2,140 cal/day             │
│  Protein: 155g/day              │
│                                 │
│  ✓ Meets your daily targets     │
│                                 │
│  [Generate Shopping List]       │
│  [Make Changes]                 │
│                                 │
└─────────────────────────────────┘
```

**Interactions:**
- **Tap [← Back]** → Returns to Screen 2 (Meal Plan View)
- **Tap day name** → Expands to show full meal details
- **Tap [Generate Shopping List]** → Creates shopping list, goes to Screen 6
- **Tap [Make Changes]** → Returns to Screen 2 (Meal Plan View)
- **Scroll** → View all 7 days

**Purpose:**
- Final check before shopping list generation
- Ensures user is happy with all meals
- Shows weekly averages to confirm targets met
- Prevents generating shopping list for meals user plans to swap

**When Shown:**
- User taps "Generate Shopping List" from Screen 2
- Before shopping list creation
- Skipped if user previously confirmed this week

**Mobile UX:**
- Collapsible day sections (tap to expand/collapse)
- Visual confirmation that all is ready
- Clear CTA to proceed or go back

**Notes:**
- Optional screen - can be disabled in settings for faster flow
- Confirmation state persists (don't show again for same week)
- Resets when week regenerates

---

### Screen 8: Weekly Regeneration Prompt

**Purpose:** Prompt user to generate next week's meal plan on their shopping day

**Layout:**
```
┌─────────────────────────────────┐
│  ✨ Time for a Fresh Week!      │
│                                 │
│  It's Sunday - ready for your   │
│  new meal plan?                 │
│                                 │
│  ────────────────────────────   │
│                                 │
│  Include favorites from         │
│  last week?                     │
│                                 │
│  Meals you loved:               │
│                                 │
│  [✓] Greek Yogurt Parfait       │
│      👍 Liked 3 times           │
│                                 │
│  [✓] Grilled Chicken Salad      │
│      👍 Liked 5 times           │
│                                 │
│  [✓] Chicken Fajitas            │
│      👍 Liked 2 times           │
│                                 │
│  [ ] Salmon with Quinoa         │
│      👎 Disliked                │
│                                 │
│  ────────────────────────────   │
│                                 │
│  💡 We'll create fresh meals    │
│  and mix in your favorites      │
│                                 │
│  [Generate New Week] 🎉         │
│  [Keep Current Plan]            │
│                                 │
└─────────────────────────────────┘
```

**When Shown:**
- On user's shopping day (from onboarding, e.g., Sunday)
- Shown as notification or in-app prompt
- Can be triggered manually from Screen 2 by tapping "Regenerate Week"

**Interactions:**
- **Tap checkbox** → Toggle favorite meal inclusion
- **Tap [Generate New Week]** → Starts generation, shows loading screen
- **Tap [Keep Current Plan]** → Dismisses prompt, keeps current week
- **Scroll** → View all liked meals from previous week

**Generation Logic:**
- Query feedback database for all thumbs-up meals from previous week(s)
- Display up to 5 most-liked meals
- Show thumbs-down meals as unchecked (user can include if they want)
- Generate new week with selected favorites + new meals
- Favorites can appear in same meal slot or different (e.g., breakfast favorite might become lunch)

**Loading State:**
```
┌─────────────────────────────────┐
│  Generating your new week...    │
│                                 │
│  [Circular progress - 15-20s]  │
│                                 │
│  💡 Tip: Your favorites will be │
│  included 2-3 times this week   │
│                                 │
│  💡 Tip: All meals learn from   │
│  your feedback                  │
└─────────────────────────────────┘
```

**After Generation:**
```
┌─────────────────────────────────┐
│  ✨ Your New Week is Ready!     │
│                                 │
│  We've created 21 meals based   │
│  on your preferences and        │
│  included your favorites        │
│                                 │
│  [View Meal Plan]               │
│  [Generate Shopping List]       │
│                                 │
└─────────────────────────────────┘
```

**Mobile UX:**
- Shown as modal overlay or full-screen prompt
- Notification on shopping day morning
- Can dismiss and return later (prompt persists until acted upon)

**Notes:**
- Regeneration overwrites previous week's plan
- Previous week is archived (can be viewed in history, not MVP)
- Favorites are suggestions - user can uncheck if desired
- Can regenerate anytime, not just on shopping day

---

## Technical Requirements

### Background Meal Plan Generation

**Trigger:** User chooses to generate their first plan (multiple entry points)

**Entry Points:**
1. Welcome modal on first app open (user taps [Generate My Plan])
2. Empty state CTA buttons (Home tab, [Generate My Plan])
3. Persistent banner (user taps [Generate Now →])
4. Floating action button (FAB) on any tab

**Optional Generation:**
- User can delay generation by tapping "Set Up Later" on welcome modal
- App remains functional without plan (manual logging, settings, etc.)
- Empty states encourage generation with multiple CTAs
- 24-hour push notification if plan not generated

**Process:**
1. Check if user has active meal plan in database
2. If not, and user triggers generation:
   - Show loading overlay on home screen
   - API call to OpenAI GPT-4 with user data
   - Generate 7 days × (meals_per_day) meal objects (14-28 meals depending on eating pattern)
   - Save to local database and cloud (if sync enabled)
   - Dismiss loading overlay
   - Show "Your plan is ready!" message
   - Update user.first_plan_generated = true
   - Cancel scheduled 24-hour nudge notification
3. If yes, display existing plan

**Timing:** 15-20 seconds for full week generation

**See Also:**
- Q1 Post-Subscription section for welcome modal flow
- Q3.0 Empty State sections for Home tab without plan
- Q3.4 First-Time Weekly Plan Generation for full flow

**API Payload:**
```javascript
{
  user_id: "user123",
  generation_type: "full_week",
  user_data: {
    daily_calorie_target: 2150,
    macro_split: {
      protein_percent: 30,
      carbs_percent: 45,
      fat_percent: 25
    },
    dietary_preference: "none", // or vegetarian, vegan, etc.
    avoided_foods: ["shellfish", "dairy"],
    preferred_cuisines: ["mediterranean", "asian", "mexican"],
    meal_prep_time: "moderate", // minimal, moderate, extended
    meal_variety_preference: "balanced", // prep-style, maximum_variety, balanced
    budget_conscious: false,
    week_start_day: "monday",
    // Eating Pattern (v2.0)
    meals_per_day: 3,
    meal_pattern: ["breakfast", "lunch", "dinner"],
    includes_snacks: false
  },
  previous_feedback: [] // empty for first generation
}
```

**GPT-4 Prompt Structure:**
```
You are a nutrition expert creating a personalized 7-day meal plan.

User Profile:
- Daily calorie target: 2,150 (weight loss goal)
- Macros: 160g protein, 240g carbs, 60g fat
- Dietary preference: None
- Avoid: Shellfish, dairy
- Cuisines: Mediterranean, Asian, Mexican
- Prep time: Moderate (30 min average)
- Variety: Balanced (some repeats okay)
- Budget: Not a constraint

Requirements:
- Create meals for 7 days based on user's eating pattern (see meal_pattern array)
- Respect user's meals_per_day setting (2, 3, or 4+ meals)
- Include snacks only if includes_snacks = true
- Distribute calories based on meal count (see calorie distribution table below)
- Balance macros across the day (not necessarily per meal)
- Respect dietary restrictions absolutely
- Vary cuisines throughout week
- Prep time should average 30 minutes
- Include some meal prep opportunities (e.g., cook chicken for 2 days)

**Calorie Distribution by Eating Pattern (v2.0):**

| Meals Per Day | Pattern Example | Calorie Distribution |
|---------------|-----------------|---------------------|
| 2 meals | Lunch + Dinner (IF style) | Lunch: 45-50%, Dinner: 50-55% |
| 3 meals | Breakfast + Lunch + Dinner | Breakfast: 25-30%, Lunch: 35-40%, Dinner: 35-40% |
| 4+ meals | All 3 + Snacks | Breakfast: 25-30%, Lunch: 30-35%, Dinner: 30-35%, Snacks: 10-15% |

**Meal Type Filtering:**
- Only generate meals for types in `meal_pattern` array
- If user eats 2 meals/day, only generate those 2 meal types
- Snacks generated separately if `includes_snacks = true`

Output format: JSON array of meal objects...
```

**Response Format:**
```javascript
{
  week: [
    {
      day: "monday",
      date: "2025-11-04",
      meals: [
        {
          meal_type: "breakfast",
          name: "Greek Yogurt Parfait",
          calories: 320,
          protein: 25,
          carbs: 40,
          fat: 8,
          prep_time: 5,
          ingredients: [
            { name: "Greek yogurt", quantity: "1 cup", unit: "cup" },
            { name: "Granola", quantity: "1/2 cup", unit: "cup" },
            // ...
          ],
          instructions: [
            "Add Greek yogurt to bowl",
            "Layer granola on top",
            // ...
          ],
          tags: ["quick", "no-cook", "high-protein"],
          cuisine: "american"
        },
        // lunch, dinner...
      ]
    },
    // tuesday through sunday...
  ]
}
```

### Meal Swapping Generation

**Trigger:** User taps "Swap" button on any meal

**Process:**
1. Show loading state (3-5 seconds)
2. API call to OpenAI GPT-4 with:
   - Original meal's macros
   - User preferences
   - Request for 3 alternatives
3. Display alternatives in Screen 4
4. User selects one
5. Update database, recalculate daily totals
6. Return to Screen 2 with updated meal

**API Payload:**
```javascript
{
  user_id: "user123",
  generation_type: "meal_swap",
  original_meal: {
    name: "Salmon with Quinoa",
    meal_type: "dinner",
    calories: 520,
    protein: 50,
    carbs: 45,
    fat: 18,
    prep_time: 35
  },
  user_data: {
    // same as full week generation
  },
  constraints: {
    calorie_range: [470, 570], // ±50 from original
    protein_range: [45, 55], // ±5g from original
    max_alternatives: 3
  }
}
```

**GPT-4 Prompt:**
```
Generate 3 alternative dinner meals to replace "Salmon with Quinoa"

Requirements:
- Calories: 470-570 (target: 520)
- Protein: 45-55g (target: 50g)
- Prep time: ~35 minutes (flexible)
- Must avoid: Shellfish, dairy
- Preferred cuisines: Mediterranean, Asian, Mexican
- Different protein source than original (no salmon)

**Q3.0 Integration (v2.0):**
- When called from Q3.0 context, prioritize ingredients already in user's current grocery list
- Pass current grocery list items as "preferred ingredients" to reduce shopping complexity
- Example: If user already has chicken in list, suggest chicken-based alternatives first
- Fall back to non-grocery-list ingredients if necessary for variety/macro matching

Output: JSON array of 3 meal objects...
```

### Feedback System

**Data Collection:**
```javascript
// Thumbs up
{
  user_id: "user123",
  meal_id: "meal_monday_breakfast_1",
  feedback_type: "thumbs_up",
  timestamp: "2025-11-04T08:30:00Z"
}

// Thumbs down with details
{
  user_id: "user123",
  meal_id: "meal_monday_dinner_1",
  feedback_type: "thumbs_down",
  reasons: ["didnt_match_taste", "too_expensive"],
  disliked_ingredients: ["salmon", "quinoa"],
  timestamp: "2025-11-04T19:45:00Z"
}
```

**Learning Application:**
- Aggregate feedback over time
- Identify patterns (e.g., user dislikes all salmon dishes)
- Include in future generation prompts:
  ```
  Based on previous feedback:
  - User loves: Chicken dishes (liked 8/10 times)
  - User dislikes: Salmon (disliked 3/4 times)
  - Avoid ingredients: Quinoa (marked disliked 2 times)
  ```
- Weight recent feedback higher than old feedback
- Minimum 2 weeks of data before strong pattern influence

### Shopping List Generation

**Trigger:** Auto-generated when meal plan is created OR when user taps "Generate Shopping List" button

**Q3.0 Integration Note (v2.0):**
- In Q3.0 navigation, shopping list auto-generates as part of weekly plan generation
- Displayed as expandable section on Weekly View screen
- Manual "Generate" button still available for regenerating if user swaps meals
- List updates automatically when meals are swapped

**Process:**
1. Extract all ingredients from current week's meals (14-28 meals depending on eating pattern)
2. Consolidate duplicates:
   ```javascript
   // Example consolidation
   Input:
   - Monday breakfast: "1 cup Greek yogurt"
   - Tuesday breakfast: "1 cup Greek yogurt"
   - Wednesday breakfast: "1 cup Greek yogurt"

   Output:
   - Greek yogurt: "3 cups" or "24 oz"
   ```
3. Categorize by grocery section:
   - Produce
   - Protein
   - Grains & Pasta
   - Dairy
   - Pantry
   - Other
4. Sort alphabetically within categories
5. Save to database
6. Display in Screen 6

**Algorithm:**
```javascript
function generateShoppingList(meals) {
  const ingredientMap = {};

  // Consolidate ingredients
  meals.forEach(meal => {
    meal.ingredients.forEach(ingredient => {
      const key = ingredient.name.toLowerCase();
      if (ingredientMap[key]) {
        ingredientMap[key].quantity += ingredient.quantity;
      } else {
        ingredientMap[key] = {
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          category: categorizeIngredient(ingredient.name)
        };
      }
    });
  });

  // Group by category
  const categorized = groupByCategory(ingredientMap);

  // Sort within categories
  categorized.forEach(category => {
    category.items.sort((a, b) => a.name.localeCompare(b.name));
  });

  return categorized;
}

function categorizeIngredient(name) {
  // Simple keyword matching
  const categories = {
    produce: ['lettuce', 'tomato', 'spinach', 'onion', 'pepper', 'fruit'],
    protein: ['chicken', 'beef', 'fish', 'tofu', 'eggs', 'turkey'],
    grains: ['rice', 'pasta', 'bread', 'quinoa', 'oats'],
    dairy: ['milk', 'cheese', 'yogurt', 'butter'],
    pantry: ['oil', 'spice', 'sauce', 'vinegar', 'flour']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => name.toLowerCase().includes(keyword))) {
      return category;
    }
  }

  return 'other';
}
```

### Weekly Regeneration

**Trigger:**
- Notification on user's shopping day (e.g., Sunday morning)
- Manual tap of "Regenerate Week" button

**Process:**
1. Query feedback for previous weeks
2. Identify favorite meals (thumbs up)
3. Show Screen 8 (Regeneration Prompt) with favorites
4. User selects which favorites to include
5. Generate new week with:
   - Selected favorites (2-3 instances each)
   - New meals filling remaining slots
   - All using updated preferences from feedback
6. Save new week, archive old week
7. Show success message

**API Payload:**
```javascript
{
  user_id: "user123",
  generation_type: "weekly_regeneration",
  user_data: {
    // same as initial generation
  },
  previous_feedback: [
    {
      meal_id: "meal_greek_yogurt_parfait",
      feedback_type: "thumbs_up",
      count: 3
    },
    {
      meal_id: "meal_grilled_chicken_salad",
      feedback_type: "thumbs_up",
      count: 5
    },
    // ...
  ],
  include_favorites: [
    "meal_greek_yogurt_parfait",
    "meal_grilled_chicken_salad",
    "meal_chicken_fajitas"
  ],
  exclude_ingredients: ["salmon"], // from dislike feedback
  prefer_ingredients: ["chicken"] // from like feedback
}
```

**GPT-4 Prompt:**
```
Generate a new 7-day meal plan based on user feedback.

User Profile: [same as before]

Learning from previous weeks:
- Favorite meals (include 2-3 times each):
  • Greek Yogurt Parfait (breakfast)
  • Grilled Chicken Salad (lunch)
  • Chicken Fajitas (dinner)

- Avoid these meals:
  • Salmon with Quinoa (disliked)

- Ingredient preferences:
  • Loves: Chicken (liked 8/10 times)
  • Dislikes: Salmon (avoid)

Requirements:
- Include the 3 favorite meals 2-3 times each in the week
- Generate 12-15 new meals to fill remaining slots
- Apply ingredient preferences strongly
- Maintain calorie and macro targets...
```

### Regeneration Limit System *(Added Session 23 - Gap Resolution)*

**Anti-Churn Safeguard:**
Maximum regenerations per week to prevent excessive API usage and decision paralysis.

**Limit Structure:**
- **Standard Regenerations:** 5 per week
- **Emergency Regeneration:** 1 per week (bonus)
- **Total Available:** 6 regenerations per week
- **Reset:** Every Monday 12:00 AM (user's timezone)
- **Exception:** Settings-triggered regenerations don't count toward limit (unlimited)

**Tracking:**
```typescript
interface User {
  regenerations_this_week: number; // 0-5 for standard
  emergency_regen_used_this_week: boolean; // true/false
  week_start_date: Date; // For weekly reset calculation
}

interface MealPlan {
  source: 'initial' | 'regeneration' | 'settings_change' | 'emergency_regen';
  regeneration_count_at_creation: number; // Snapshot for analytics
}
```

**UI Indicators:**
- Before reaching limit: "3 regenerations left this week"
- At 5/5 standard limit: "Weekly regeneration limit reached. Resets Monday."
- Emergency available: "[Emergency Regeneration] (1x per week)"

**When Limit Reached (5/5 Used):**

Show modal:
```
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
│  OR                                     │
│                                         │
│  [Use Emergency Regeneration] (1 left)  │
│                                         │
│  [Got It]                               │
└─────────────────────────────────────────┘
```

**Alternative Actions (Always Available):**
1. **Swap Individual Meals** - Unlimited, doesn't count as regeneration
2. **Add Custom Meals** - Manual entry form, unlimited
3. **Add from Favorites** - Instant swap, no AI call, unlimited
4. **Edit Meal Details** - Adjust calories/macros manually, unlimited

**Emergency Regeneration Flow:**
```typescript
function handleEmergencyRegeneration(user: User): Result {
  // Check if emergency regen available
  if (user.emergency_regen_used_this_week) {
    return {
      success: false,
      error: "Emergency regeneration already used this week"
    };
  }

  // Perform full week regeneration
  const newPlan = await generateMealPlan(user, {
    source: 'emergency_regen',
    count_toward_limit: false
  });

  // Mark emergency as used
  user.emergency_regen_used_this_week = true;
  user.save();

  return {
    success: true,
    plan: newPlan,
    message: "Emergency regeneration used (1/1 this week)"
  };
}
```

**Reset Logic:**
```typescript
function resetWeeklyLimits(user: User): void {
  const now = new Date();
  const weekStart = getWeekStart(user.timezone); // Monday 12:00 AM

  if (now >= weekStart) {
    user.regenerations_this_week = 0;
    user.emergency_regen_used_this_week = false;
    user.week_start_date = weekStart;
    user.save();
  }
}
```

**Analytics Tracking:**
- Track how many users hit 5/5 limit
- Track emergency regen usage rate
- Track alternative actions used after limit hit
- Use data to adjust limit if needed (e.g., increase to 7/week if most users hit 5)

### Maintenance Weight Monitoring *(Added Session 23 - Gap Resolution)*

**Feature:** For users with "Maintain Weight" goal, monitor weight variance and trigger intervention.

**Threshold:** 5% deviation from initial maintenance weight

**Setup (During Onboarding):**
```typescript
interface UserProfile {
  goal: 'lose_weight' | 'gain_weight' | 'maintain';

  // For maintain goal only:
  initial_maintenance_weight?: number; // e.g., 150 lbs
  maintenance_threshold?: number; // 0.05 = 5%
  acceptable_range?: {
    lower: number; // 142.5 lbs (150 × 0.95)
    upper: number; // 157.5 lbs (150 × 1.05)
  };
}
```

**Calculation:**
```typescript
function setupMaintenanceMonitoring(user: User): void {
  if (user.goal !== 'maintain') return;

  const weight = user.current_weight;
  const threshold = 0.05; // 5%

  user.initial_maintenance_weight = weight;
  user.maintenance_threshold = threshold;
  user.acceptable_range = {
    lower: weight * (1 - threshold), // e.g., 142.5
    upper: weight * (1 + threshold)  // e.g., 157.5
  };
}
```

**Trigger Condition:** 2 consecutive weigh-ins outside acceptable range

**Tracking:**
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

**Notification Modal (2 Consecutive Out-of-Range):**
```
┌─────────────────────────────────────┐
│  Weight Change Detected             │
├─────────────────────────────────────┤
│                                     │
│  You're now 159 lbs, above your     │
│  5% maintenance range.              │
│                                     │
│  Acceptable: 142.5 - 157.5 lbs      │
│  Your weight: 159 lbs (+6.5 lbs)    │
│                                     │
│  What would you like to do?         │
│                                     │
│  [Adjust Goal to Lose Weight]       │
│  → Recalculate plan with deficit    │
│                                     │
│  [Update Maintenance Target]        │
│  → Set new baseline at 159 lbs      │
│                                     │
│  [Keep Current Plan]                │
│  → Continue monitoring              │
│                                     │
└─────────────────────────────────────┘
```

**Action Flows:**

**A. Adjust Goal to Lose Weight:**
```typescript
function adjustGoalToLose(user: User): void {
  user.goal = 'lose_weight';
  user.goal_weight = user.initial_maintenance_weight; // Back to 150
  user.daily_calories = user.tdee - 500; // 1 lb/week deficit

  // Regenerate meal plan (doesn't count toward limit)
  regenerateMealPlan(user, { source: 'settings_change' });

  showToast("Your plan has been updated to help you get back to 150 lbs");
}
```

**B. Update Maintenance Target:**
```typescript
function updateMaintenanceBaseline(user: User, newWeight: number): void {
  user.initial_maintenance_weight = newWeight; // Update to 159
  user.acceptable_range = {
    lower: newWeight * 0.95,  // 151.05
    upper: newWeight * 1.05   // 166.95
  };

  // Calories stay at TDEE (no change to meal plan)
  showToast("Your maintenance target is now 159 lbs");
}
```

**C. Keep Current Plan:**
- No changes to user profile
- Modal dismissed
- Show persistent banner in Home tab after 2+ weeks:
  ```
  ┌─────────────────────────────────────┐
  │  ⚠️ Weight outside maintenance range │
  │  Tap to adjust plan  [Dismiss]      │
  └─────────────────────────────────────┘
  ```

**Weight Graph Visualization:**
- Green band showing acceptable range (142.5 - 157.5 lbs)
- Data points colored by status:
  - Green: Within range
  - Orange: Outside range (warning)
  - Red: 2+ consecutive outside (alert triggered)
- Baseline dashed line at initial maintenance weight

**API Endpoint:**
```typescript
POST /api/maintenance/check-variance
Request: { user_id, weight_entry_id }
Response: {
  within_range: false,
  deviation: 0.06,
  direction: 'above',
  consecutive_count: 2,
  trigger_notification: true,
  acceptable_range: { lower: 142.5, upper: 157.5 }
}
```

### Data Storage

**Local Storage (AsyncStorage / SQLite):**
- Current week's meal plan
- Shopping list with checked states
- Feedback history (last 30 days)
- User preferences from onboarding

**Cloud Storage (if sync enabled):**
- Complete meal plan history
- All feedback data
- Favorite meals
- User profile

**Data Retention:**
- Current week: Always in local storage
- Previous weeks: Cloud only (can view in history)
- Feedback: Indefinite (used for learning)
- Shopping lists: Deleted when week regenerates

---

## Data Structures

### Meal Plan (Weekly)

```typescript
interface MealPlan {
  id: string; // "plan_2025_week_45"
  user_id: string;
  week_start_date: string; // "2025-11-04"
  week_end_date: string; // "2025-11-10"
  generated_at: string; // ISO timestamp
  days: Day[];
}

interface Day {
  day_name: string; // "monday"
  date: string; // "2025-11-04"
  meals: Meal[];
  daily_totals: MacroTotals;
}

interface Meal {
  id: string; // "meal_monday_breakfast_1"
  meal_type: "breakfast" | "lunch" | "dinner" | "snack"; // Added "snack" in v2.0
  name: string;
  description?: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  prep_time: number; // minutes
  cook_time: number; // minutes
  total_time: number; // minutes
  servings: number; // always 1 in MVP
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[]; // ["quick", "high-protein", "no-cook"]
  cuisine: string; // "mediterranean"
  difficulty: "easy" | "medium" | "hard";
  image_url?: string; // placeholder in MVP
  is_favorite: boolean;
  feedback?: MealFeedback;
}

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: 'count' | 'oz' | 'lb' | 'cup' | 'tbsp' | 'tsp' | 'package'; // US measurements only (no grams/metric) - v2.1
  category: 'proteins' | 'produce' | 'dairy-eggs' | 'pantry' | 'spices' | 'frozen' | 'bakery' | 'other'; // Categorized by store section - v2.1
  notes?: string; // "(optional)" or "(or substitute X)"
}

interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals_count: number; // Variable: 2-4 meals depending on user's eating pattern (v2.0)
}
```

### Meal Feedback

```typescript
interface MealFeedback {
  id: string;
  user_id: string;
  meal_id: string;
  meal_name: string;
  feedback_type: "thumbs_up" | "thumbs_down";
  timestamp: string;
  details?: FeedbackDetails; // only for thumbs_down
}

interface FeedbackDetails {
  reasons: string[]; // ["didnt_match_taste", "too_expensive", "too_time_consuming", "missing_ingredients"]
  disliked_ingredients: string[]; // ["salmon", "quinoa"]
  additional_notes?: string; // free text, not MVP
}
```

### Shopping List

```typescript
interface ShoppingList {
  id: string; // "shopping_2025_week_45"
  user_id: string;
  meal_plan_id: string;
  week_start_date: string;
  generated_at: string;
  categories: ShoppingCategory[];
}

interface ShoppingCategory {
  name: string; // "Produce"
  emoji: string; // "🥬"
  items: ShoppingItem[];
}

interface ShoppingItem {
  id: string;
  name: string; // "Spinach"
  quantity: string; // "2 lbs"
  unit: string; // "lbs"
  checked: boolean;
  custom: boolean; // true if user added manually
  from_meals: string[]; // meal IDs that use this ingredient
}
```

### User Preferences (from Q1)

```typescript
interface UserMealPreferences {
  user_id: string;
  daily_calorie_target: number;
  macro_split: {
    protein_percent: number;
    carbs_percent: number;
    fat_percent: number;
  };
  dietary_preference: "none" | "vegetarian" | "vegan" | "pescatarian" | "keto" | "custom";
  avoided_foods: string[];
  preferred_cuisines: string[];
  meal_prep_time: "minimal" | "moderate" | "extended";
  meal_variety_preference: "prep_style" | "maximum_variety" | "balanced";
  budget_conscious: boolean;
  shopping_day: "sunday" | "saturday" | "midweek" | "flexible";
  week_start_day: "sunday" | "monday" | "thursday";

  // Eating Pattern (from Q1 Step 11) - Added v2.0
  meals_per_day: 2 | 3 | 4; // 4 represents "4-5 meals" option
  meal_pattern: ("breakfast" | "lunch" | "dinner")[]; // Which meals user actually eats
  includes_snacks: boolean; // Whether to generate snacks
}
```

---

## Success Criteria

### Functional Requirements

**Must Have (MVP):**
- [ ] Meal plan generates in background on first app open after subscription
- [ ] All 7 days display with meals matching user's eating pattern (2-4 meals/day + snacks if applicable)
- [ ] User can swipe between days smoothly
- [ ] Each meal shows name, calories, macros, prep time
- [ ] Tapping meal opens full recipe with ingredients and instructions
- [ ] Swap button generates 3 alternatives within macro constraints
- [ ] Alternatives respect dietary preferences and avoided foods
- [ ] Selecting alternative replaces meal and updates daily totals
- [ ] Thumbs up button records positive feedback
- [ ] Thumbs down opens detailed feedback screen
- [ ] Detailed feedback collects reasons and ingredient dislikes
- [ ] Shopping list generates with consolidated ingredients
- [ ] Shopping list organized by grocery section
- [ ] Items can be checked off while shopping
- [ ] User can add custom items to shopping list
- [ ] User can remove items from shopping list
- [ ] Shopping list can be shared via native share sheet
- [ ] Weekly regeneration prompt appears on shopping day
- [ ] Regeneration includes option to add favorite meals
- [ ] Favorite meals from previous weeks are identified by feedback
- [ ] New week generates with favorites + new meals
- [ ] All feedback is stored and influences future generations

**Nice to Have (Post-MVP):**
- [ ] Meal plan calendar grid view (in addition to daily detail)
- [ ] Recipe photos (AI-generated or stock images)
- [ ] Serving size adjustment (scale ingredients)
- [ ] Print recipe function
- [ ] Save individual recipe to favorites
- [ ] Meal history view (previous weeks)
- [ ] Nutritional details beyond macros (fiber, sodium, etc.)
- [ ] Ingredient substitution suggestions
- [ ] Meal prep instructions (batch cooking)

### Non-Functional Requirements

**Performance:**
- [ ] Initial meal plan generation: < 20 seconds
- [ ] Meal swap generation: < 5 seconds
- [ ] Shopping list generation: < 2 seconds
- [ ] Screen transitions: < 300ms
- [ ] Smooth 60fps scrolling and swiping

**Reliability:**
- [ ] Meal plan data persists locally (survives app restart)
- [ ] Feedback saved immediately (no loss if app closes)
- [ ] Graceful handling of API failures (retry logic)
- [ ] Offline viewing of generated meal plans
- [ ] Data sync to cloud (if user enabled in Q1)

**Usability:**
- [ ] Zero typing required for all primary interactions
- [ ] Large tap targets (min 44x44 pt)
- [ ] Clear visual feedback for all actions
- [ ] Intuitive swipe gestures
- [ ] Helpful loading messages during generation
- [ ] Error messages are clear and actionable

**Accessibility:**
- [ ] VoiceOver support for all screens (iOS)
- [ ] TalkBack support for all screens (Android)
- [ ] Dynamic type support (text scales with system settings)
- [ ] Sufficient color contrast (WCAG 2.1 AA)
- [ ] No color-only information (use icons + text)

**Learning System:**
- [ ] Feedback influences generation after 2+ weeks of data
- [ ] Favorite meals identified by 2+ thumbs up
- [ ] Disliked ingredients avoided after 2+ dislikes
- [ ] Recent feedback weighted higher than old feedback

---

## Implementation Notes

### Removed: Cooking Context Field

**Decision Made:** 2025-11-04

During Q2 planning, we identified that the "Cooking Context" field from Q1 Step 9 ("How do you approach meals?") was poorly defined and not actionable for meal plan generation.

**Rationale:**
- Users of a meal planning app are inherently cooking at home
- If users "eat out often" they wouldn't download this app
- Field adds friction without personalization value
- Other fields (meal prep time, dietary preferences, cuisines) provide sufficient personalization

**Impact:**
- Q1 onboarding will be updated to remove this field from Step 9
- Q2 meal generation will NOT use cooking context
- Data inputs reduced from 10 to 9 fields
- No impact on meal quality or personalization

**See:** [DECISIONS.md](../DECISIONS.md) for full decision log

### Zero-Typing Principle Maintained

Q2 continues Q1's zero-typing requirement:
- Swipe gestures for day navigation
- Tap buttons for all actions (swap, rate, view recipe)
- Checkboxes for shopping list
- No keyboard input required for primary flows

**Exception:** Adding custom items to shopping list requires text input, but this is optional/advanced usage.

### Mobile-First Design Patterns

**Swipe Gestures:**
- Swipe left/right to change days
- Swipe left on shopping item to delete (iOS pattern)
- Pull-to-refresh to regenerate current week

**Bottom Navigation:**
- Always visible for quick context switching
- Active tab highlighted
- Icons + labels for clarity

**Loading States:**
- Circular progress indicators with tips/messages
- Never block entire app (background generation)
- Show progress percentage when possible

**Feedback:**
- Haptic feedback on button taps (iOS)
- Visual state changes (button highlights)
- Toast messages for confirmations

### API Error Handling

**Meal Generation Failures:**
- Retry up to 3 times with exponential backoff
- If still fails: Show error message with retry button
- Allow user to continue using app (don't block)
- Cache last successful plan as backup

**Meal Swap Failures:**
- Retry once immediately
- If fails: Show "Unable to generate alternatives. Try again?"
- Don't leave user stuck - allow cancellation

**Network Offline:**
- All generated meal plans viewable offline
- Swapping/regeneration requires network
- Show clear "Offline" message
- Queue feedback for sync when back online

### Data Privacy

**Local-Only Mode (if user chose in Q1):**
- All meal plans stored in device storage only
- No cloud backup
- Feedback stored locally
- Limited learning (only from this device's history)

**Cloud Sync Mode:**
- Meal plans backed up to user's account
- Feedback synced across devices
- Better learning (more data)
- Can recover if app deleted

**No User Data Sharing:**
- Meal plans never shared with other users
- Feedback used only for that user's future plans
- No aggregated data used (MVP)

---

## Revisions

### v2.3 - 2025-11-10 (Session 24: Post-Subscription UX)
**Updated Background Meal Plan Generation:**
- Changed trigger from "first app open after subscription" to user-initiated generation
- **Added multiple entry points** for plan generation:
  1. Welcome modal on first app open ([Generate My Plan])
  2. Empty state CTA buttons (Home tab)
  3. Persistent banner ([Generate Now →])
  4. Floating action button (FAB)
- **Added optional generation flow:**
  - Users can delay generation by choosing "Set Up Later" on welcome modal
  - App remains functional without plan (manual logging, settings accessible)
  - Empty states encourage generation with multiple CTAs
  - 24-hour push notification if plan not generated
- **Added state tracking:**
  - `user.first_plan_generated` flag
  - Cancel scheduled 24-hour nudge notification on generation
- **Added cross-references:** Q1 Post-Subscription, Q3.0 Empty State, Q3.4 First-Time Flow
- **Rationale:** Supports new optional generation flow from Q1 v3.4, respects user autonomy while guiding toward value
- **Impact:** Reduced subscription friction, improved first-time user experience

### v2.1 - 2025-11-06
**Issue Resolution Update**
- Updated Ingredient interface to use standard US measurements only (no grams/metric)
- Changed unit field to enum: 'count' | 'oz' | 'lb' | 'cup' | 'tbsp' | 'tsp' | 'package'
- Updated category field to store-section grouping: 'proteins' | 'produce' | 'dairy-eggs' | 'pantry' | 'spices' | 'frozen' | 'bakery' | 'other'
- Clarified that meal/workout swapping is accessible from multiple locations in Q3.0:
  - Home tab meal/workout cards → Meal/Workout Detail Screen (full screen) → Swap button
  - Weekly View → Tap item → Detail Screen → Swap option
  - History → View past item → Detail Screen → Swap for future

**Key Changes:**
- Shopping list will display items grouped by store section categories (Proteins, Produce, etc.)
- All AI-generated ingredients use US cooking measurements (user-friendly, no metric)
- Consolidation logic simplified: same ingredient + same unit = sum quantities

### v2.0 - 2025-11-06
**Q3.0 Consistency Update**
- Updated navigation from 4-tab to 3-tab design (references to "Meals tab" changed to "Home → View My Week")
- Added eating pattern data structures (meals_per_day, meal_pattern, includes_snacks) to UserMealPreferences
- Added "snack" as meal_type option in Meal interface
- Updated meal generation to respect variable meal patterns (2-4 meals/day)
- Added calorie distribution table for different eating patterns
- Added meal type filtering logic based on user's meal_pattern
- Clarified shopping list auto-generation as part of Q3.0 integration
- Added grocery list ingredient prioritization to meal swap algorithm
- Updated all hardcoded "21 meals" references to variable meal counts (14-28 meals)

**Key Changes:**
- Navigation access pattern: Meals now accessed via Home tab, not dedicated tab
- Meal generation adapts to 2, 3, or 4+ meals per day based on user preference
- Snacks supported as separate meal type when user opts in
- Shopping list auto-generates with weekly plan (not just manual button)
- Meal swaps prioritize ingredients already in grocery list to minimize shopping changes

### v2.2 - 2025-11-10 (Session 23: Gap Resolution)
**Additions:**
- **Regeneration Limit System:** Maximum 5 standard + 1 emergency regeneration per week
  - Added tracking, UI indicators, reset logic
  - Alternative actions when limit reached (swaps, custom meals, favorites)
  - Analytics tracking for usage patterns
- **Maintenance Weight Monitoring:** 5% variance tracking for "Maintain Weight" goal users
  - 2 consecutive weigh-in trigger system
  - Notification modal with 3 action options
  - Weight graph visualization with acceptable range band
  - API endpoint for variance checking

**Rationale:** Gap analysis identified no spec for regeneration limit exhaustion mid-week and no UX flow for maintenance weight variance. These additions prevent API abuse and provide intervention when maintenance users deviate from target.

**Impact:** Added 2 new technical requirement sections (Regeneration Limit System, Maintenance Weight Monitoring)

**Decision Log:** See [DECISIONS.md](../DECISIONS.md) - "Session 23: 15 Gap Resolution Decisions - Gaps 2 & 6"

### v2.1 - 2025-11-06
**Issue Resolution Update**
- Fixed file path references broken by project restructuring
- All links to other specs updated with correct relative paths
- Cross-references verified (Q0, Q1, Q3.0, Q3.4)
- No functional changes - documentation maintenance only

### v2.0 - 2025-11-06
**Q3.0 Consistency Update**
- Added integration point for grocery-aware meal swapping
- When swapping from Q3.0 Weekly Planning context, prioritize ingredients already in grocery list
- Updated Meal Swapping Generation section with Q3.0 integration notes
- Ensures meal swaps don't unnecessarily complicate shopping

**Rationale:** During Q3.0 development, identified opportunity to reduce grocery list churn by preferencing existing ingredients when generating swap alternatives

### v1.0 - 2025-11-04
**Initial Q2 Specification**
- Complete meal planning feature designed
- 8 screens specified in detail
- Daily detail view approach chosen (vs. calendar grid)
- 1-for-1 meal swapping confirmed
- Both meal + ingredient feedback included
- Auto-generated shopping list with consolidation
- Prompted weekly regeneration with favorites
- Cooking context field removed from Q1 inputs
- Zero-typing principle maintained from Q1

**Key Decisions:**
- Split Q2 (planning) from Q3 (tracking)
- Meal generation happens in background after subscription
- 1 week duration (7 days)
- Daily detail view for browsing
- 1-for-1 swapping with ±50 cal, ±5g protein matching
- Shopping list auto-generated after confirmation
- Prompted regeneration (not automatic)

**Ready for:** Development implementation after Q3-Q7 planning complete

---

**Document Version:** 2.2
**Created:** 2025-11-04
**Last Updated:** 2025-11-10 (Session 23: Gap Resolution)
**Status:** ✅ Finalized
**Next:** Q3: Meal Tracking specification
