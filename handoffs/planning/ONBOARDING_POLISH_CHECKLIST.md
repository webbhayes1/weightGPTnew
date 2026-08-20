# Onboarding Polish & Testing Checklist
**Date:** November 11, 2025 (Session 35)
**Status:** 🔄 **IN PROGRESS**

---

## Overview

**Goal:** Polish and perfect the 16-step onboarding flow before Phase 3

**Completion Criteria:**
- All 16 steps function flawlessly
- Zero bugs or UX issues
- Design system compliance 100%
- Edge cases handled gracefully
- Performance optimized
- Ready for production

---

## 1. Firebase & Authentication

### Firebase Configuration
- [x] Firebase config uses `expo-constants` (not `process.env`)
- [x] All environment variables load correctly
- [x] TypeScript errors resolved
- [ ] Test: Firebase initializes on app launch
- [ ] Test: Anonymous sign-in succeeds automatically
- [ ] Test: Firebase UID stored in auth store
- [ ] Verify console shows: `[Firebase] Initialized successfully`

### Anonymous Authentication Flow
- [ ] Test: Anonymous sign-in happens silently on app launch
- [ ] Test: Onboarding data saved with anonymous UID key
- [ ] Test: Multiple app launches don't create duplicate users
- [ ] Test: Auth state persists across app restarts

### Account Linking (Post-Paywall)
- [ ] Test: AccountSetupScreen appears after paywall
- [ ] Test: Email/password sign-up flow works
- [ ] Test: Anonymous account successfully links to email
- [ ] Test: Data migrates from anonymous → authenticated UID
- [ ] Test: Old anonymous data deleted after migration
- [ ] Test: Backend sync endpoint called (will fail until backend updated)
- [ ] Test: Error handling for failed linking
- [ ] Test: "Skip" button shows warning, allows device-only mode

---

## 2. Step-by-Step Flow Testing

### **Step 1: Welcome Screen**
- [ ] UI: "Let's build your perfect plan" displays correctly
- [ ] UI: "Start" button styled with gradient (primary CTA)
- [ ] UI: No back button on this screen
- [ ] UI: No progress bar (0/16)
- [ ] Functionality: Tapping "Start" navigates to Step 2
- [ ] Animation: Smooth transition to next screen
- [ ] Edge case: Double-tap doesn't cause issues

### **Step 2: Goal Type**
- [ ] UI: Progress bar shows "Step 1 of 16"
- [ ] UI: Back button visible and works
- [ ] UI: "What's your main goal right now?" displays
- [ ] UI: Three large tap targets: Gain / Lose / Maintain
- [ ] UI: Buttons use glassmorphism styling
- [ ] Functionality: Selecting "Lose Weight" → proceeds to Step 3
- [ ] Functionality: Selecting "Maintain Weight" → proceeds to Step 3, then SKIPS to Step 6
- [ ] State: `goalType` saved to onboarding store
- [ ] Animation: Button press animation (scale 0.98)
- [ ] Edge case: No selection → "Continue" disabled or not shown

### **Step 3: Current Weight**
- [ ] UI: Progress bar shows "Step 2 of 16"
- [ ] UI: "What's your current weight?" displays
- [ ] UI: Unit toggle [lbs] [kg] at top
- [ ] UI: Number picker/scroll wheel (80-400 lbs or 35-180 kg)
- [ ] UI: NO keyboard - pure scroll interface
- [ ] Functionality: Scroll wheel smooth and responsive
- [ ] Functionality: Unit toggle converts values correctly
- [ ] Functionality: Selected weight displays prominently
- [ ] State: `weight_current` saved with correct unit
- [ ] Edge case: Min/max boundaries enforced
- [ ] **CONDITIONAL:** If goalType = "Maintain" → Next goes to Step 6 (skips 4-5)
- [ ] **CONDITIONAL:** If goalType = "Lose/Gain" → Next goes to Step 4

### **Step 4: Goal Weight** *(Skipped if Maintain)*
- [ ] UI: Progress bar shows "Step 3 of 16"
- [ ] UI: "What's your goal weight?" displays
- [ ] UI: Same number picker as Step 3
- [ ] UI: Shows difference in real-time: "+15 lbs" or "-20 lbs"
- [ ] Functionality: Difference calculation correct
- [ ] Functionality: Color coding: Green for healthy, Amber for caution
- [ ] State: `weight_goal` saved
- [ ] Edge case: Goal weight = current weight (show warning?)
- [ ] Edge case: Extreme difference (>50 lbs) - show warning?
- [ ] **SKIP TEST:** Screen not shown if goalType = "Maintain"

### **Step 5: Goal Date** *(Skipped if Maintain)*
- [ ] UI: Progress bar shows "Step 4 of 16"
- [ ] UI: "When do you want to reach [goal weight]?" (dynamic text)
- [ ] UI: Date picker (min 4 weeks, max 52 weeks from today)
- [ ] UI: "I'm not sure - suggest for me" button
- [ ] **Inline Validation:**
  - [ ] SAFE pace (≤2 lbs/week loss, ≤1 lb/week gain): Show ✓ with green text
  - [ ] UNSAFE pace (>2 lbs/week loss): Show ⚠️ with warning + recommended date
  - [ ] Buttons: [Use Recommended Date] [Continue Anyway]
- [ ] **"I'm not sure" Flow:**
  - [ ] Tap button → 0.5s calculation
  - [ ] Shows recommended date with explanation
  - [ ] Buttons: [Use This Date] [Choose My Own]
- [ ] State: `goal_date`, `weekly_rate` saved
- [ ] Edge case: Date in the past → show error
- [ ] Edge case: Unsafe rate + Continue Anyway → allow but log
- [ ] **SKIP TEST:** Screen not shown if goalType = "Maintain"

### **Step 6: Personal Details**
- [ ] UI: Progress bar shows "Step 5 of 16" (or Step 3/16 if Maintain)
- [ ] UI: "Tell us about yourself" displays
- [ ] **Height Input:**
  - [ ] Toggle: [Feet/Inches] [CM]
  - [ ] Feet/Inches: Dual number pickers (Feet: 4-7, Inches: 0-11)
  - [ ] CM: Single number picker (120-220 cm)
  - [ ] No keyboard - scroll wheel only
  - [ ] Unit toggle converts correctly
- [ ] **Age Input:**
  - [ ] Number picker (13-100)
  - [ ] No keyboard - scroll wheel only
  - [ ] Age 13-17: Checkbox "☐ I have parent/guardian permission" appears
  - [ ] Age 13-17: Checkbox REQUIRED to proceed
  - [ ] Age 65+: Disclaimer modal appears: "⚠️ Please consult your doctor..."
- [ ] **Sex at Birth:**
  - [ ] Two buttons: [Male] [Female]
  - [ ] Large tap targets
  - [ ] Note: "Sex at birth is required for accurate calorie calculations" displays
- [ ] State: `height`, `age`, `sex` saved
- [ ] **Background Processing:** BMR calculation starts immediately (console log)
- [ ] Edge case: Age < 13 → show error or block
- [ ] Edge case: Age > 100 → allow but flag

### **Step 7: Daily Activity Level**
- [ ] UI: Progress bar correct
- [ ] UI: "How active is your typical day?" displays
- [ ] UI: Three options with descriptions:
  - [ ] Sedentary (desk job, minimal movement)
  - [ ] Moderate (on your feet regularly)
  - [ ] Active (physical job, constantly moving)
- [ ] Functionality: Selection highlights correctly
- [ ] State: `daily_activity_level` saved
- [ ] **Background Processing:** TDEE, calories, macros calculated (console log)
- [ ] Edge case: No selection → "Continue" disabled

### **🔄 Loading Break 1**
- [ ] UI: "Calculating your personalized targets..." displays
- [ ] UI: Circular progress indicator animates (2 seconds)
- [ ] UI: Transitions to results screen
- [ ] **Results Screen:**
  - [ ] "✓ Targets Calculated" displays
  - [ ] Shows calculated daily calorie target (e.g., "~2,150 calories")
  - [ ] Shows context: "based on your metabolism and [weight loss] goal"
  - [ ] [Continue Button] displayed
- [ ] Functionality: Calculation already done (feels instant)
- [ ] State: BMR, TDEE, daily_calories saved
- [ ] Edge case: Calculation error → show error message

### **Step 8: Food Preferences**
- [ ] UI: Progress bar correct
- [ ] UI: "Tell us about your food preferences" displays
- [ ] **Dietary Preference:**
  - [ ] Tap-to-select buttons: None, Vegetarian, Vegan, Pescatarian, Keto, Custom
  - [ ] Single selection only
  - [ ] Active state styling correct
- [ ] **Foods to Avoid:**
  - [ ] Pre-populated chips: Dairy, Gluten, Nuts, Shellfish, Eggs, Soy, Fish
  - [ ] Multi-select (tap to toggle)
  - [ ] [+ Add More] button shows extended list
  - [ ] NO free text input
- [ ] **Favorite Cuisines:**
  - [ ] Multi-select chips: Mediterranean, Asian, Mexican, American, Italian, Indian, Greek
  - [ ] [Skip Cuisines →] button works
- [ ] State: `dietary_preference`, `avoid_foods`, `preferred_cuisines` saved
- [ ] Edge case: No dietary preference selected → defaults to "None"

### **Step 9: Meal Prep Time**
- [ ] UI: Progress bar correct
- [ ] UI: "How much time do you typically have for meal prep?" displays
- [ ] UI: Three options:
  - [ ] Minimal (< 15 minutes per meal)
  - [ ] Moderate (30 minutes per meal)
  - [ ] Extended (60+ minutes per meal)
- [ ] UI: Helper text: "We'll tailor recipes to fit your available time"
- [ ] Functionality: Selection works correctly
- [ ] State: `meal_prep_time` saved
- [ ] Edge case: No selection → "Continue" disabled

### **Step 10: Meal Variety Preference**
- [ ] UI: Progress bar correct
- [ ] UI: "How do you prefer your weekly meal plan?" displays
- [ ] UI: Three options:
  - [ ] Meal prep style (fewer recipes, repeat meals)
  - [ ] Maximum variety (different meals every day)
  - [ ] Balanced (some variety, some repeats)
- [ ] Functionality: Selection works correctly
- [ ] State: `meal_variety_preference` saved
- [ ] Edge case: No selection → "Continue" disabled

### **Step 11: Eating Pattern**
- [ ] UI: Progress bar correct
- [ ] UI: "How many meals do you typically eat per day?" displays
- [ ] UI: Three options: 2 meals, 3 meals (recommended), 4-5 meals (including snacks)
- [ ] **Follow-up on same screen:**
  - [ ] "Which meals do you eat?" displays after selection
  - [ ] Multi-select checkboxes: Breakfast, Lunch, Dinner, Snacks
  - [ ] Default selections based on meals_per_day:
    - [ ] 2 meals: Lunch + Dinner pre-selected
    - [ ] 3 meals: All three pre-selected
    - [ ] 4-5 meals: All three + snacks pre-selected
  - [ ] Helper text: "We'll create a plan that fits your eating style"
- [ ] State: `meals_per_day`, `meal_pattern` (array), `includes_snacks` (boolean) saved
- [ ] Edge case: User deselects all meals → show warning

### **Step 12: Budget Preference**
- [ ] UI: Progress bar correct
- [ ] UI: "Do you prefer budget-friendly ingredients?" displays
- [ ] UI: Three buttons: [Yes] [No] [Skip]
- [ ] UI: Helper text: "We'll prioritize affordable options if you select Yes"
- [ ] Functionality: All three options work
- [ ] State: `budget_conscious` saved (defaults to `false` if skipped)
- [ ] Edge case: Skip button always allows progression

### **Step 13: Grocery Shopping Day**
- [ ] UI: Progress bar correct
- [ ] UI: "When do you typically grocery shop?" displays
- [ ] UI: Four options:
  - [ ] Sunday (week starts Monday)
  - [ ] Saturday (week starts Sunday)
  - [ ] Mid-week (week starts Thursday)
  - [ ] [Skip]
- [ ] UI: Helper text: "We'll generate your meal plan based on when you shop"
- [ ] Functionality: All options work
- [ ] State: `week_start_day` saved (defaults to `Flexible` if skipped)
- [ ] Edge case: Skip button always allows progression

### **Step 14: Equipment Access**
- [ ] UI: Progress bar correct
- [ ] UI: "What kind of workout setup do you have?" displays
- [ ] UI: Three options:
  - [ ] Home (bodyweight only)
  - [ ] Home (dumbbells/resistance bands) - Note: NOT "Home gym"
  - [ ] Full gym access
- [ ] Functionality: Selection works correctly
- [ ] State: `equipment_type` saved
- [ ] Edge case: No selection → "Continue" disabled
- [ ] **CRITICAL FIX:** Verify label is NOT "Home gym" (confusing terminology)

### **🔄 Loading Break 2**
- [ ] UI: "Designing your optimal workout plan..." displays
- [ ] UI: Circular progress indicator (2 seconds)
- [ ] UI: Transitions to results screen
- [ ] **Results Screen:**
  - [ ] "✓ Workout Plan Optimized" displays
  - [ ] Shows recommendation: "💪 5 workout days per week"
  - [ ] Shows breakdown: "• 3 strength sessions • 2 cardio sessions"
  - [ ] Note: "You'll select which specific days work best for you next"
  - [ ] [Continue Button] displayed
- [ ] Functionality: Recommendation calculated based on goal
- [ ] State: Workout plan recommendation saved
- [ ] Edge case: Calculation error → show error

### **Step 15: Workout Schedule**
- [ ] UI: Progress bar correct
- [ ] UI: "Let's plan your workout schedule" displays
- [ ] **Workout Days:**
  - [ ] Weekly calendar (Mon-Sun) displayed
  - [ ] Tap to select days (multi-select)
  - [ ] Selected days highlighted with active styling
  - [ ] Helper text: "We recommend [5] workout days. Select days that fit your schedule."
  - [ ] Warning if < recommended: "Selecting fewer days may slow progress"
- [ ] **Session Duration:**
  - [ ] Four options: 20 / 30 / 45 / 60 minutes
  - [ ] Single selection
- [ ] **Inline Validation:**
  - [ ] Poor spacing detected: "Try to space workouts evenly for better recovery"
  - [ ] Good spacing: No warning
- [ ] State: `workout_days_preferred`, `session_length` saved
- [ ] Edge case: 0 days selected → show error
- [ ] Edge case: All 7 days selected → show warning about overtraining

### **Step 16: Preferences & Consent**
- [ ] UI: Progress bar shows "Step 16 of 16"
- [ ] UI: "Just a few more preferences" displays
- [ ] **Notifications (multi-select toggles):**
  - [ ] Daily weigh-in reminders
  - [ ] Meal logging reminders
  - [ ] Workout reminders
  - [ ] Motivational check-ins
  - [ ] All toggles functional
- [ ] **Health Disclaimer:**
  - [ ] Required checkbox: "I understand this app provides general wellness information..."
  - [ ] Additional text displays
  - [ ] Checkbox REQUIRED to proceed
- [ ] State: `notification_preferences`, `disclaimer_accepted: true` saved
- [ ] Edge case: Disclaimer not checked → "Continue" disabled or shows error
- [ ] Functionality: Navigates to Loading Break 3

### **🔄 Loading Break 3 (Final)**
- [ ] **Phase 1: Workout Generation**
  - [ ] UI: "Building your workout program..." displays
  - [ ] UI: Circular progress indicator at 50%
  - [ ] UI: Tip: "Progressive overload is key to getting stronger"
  - [ ] Duration: 10-15 seconds
  - [ ] Functionality: OpenAI API call happens (or mock in dev)
- [ ] **Phase 2: Finalizing**
  - [ ] UI: "Finalizing your personalized plan..." displays
  - [ ] UI: Circular progress indicator at 100%
  - [ ] UI: Tip: "Consistency beats intensity every time"
  - [ ] Duration: 2 seconds
- [ ] **Total Duration:** 12-17 seconds
- [ ] **Error Handling:**
  - [ ] Tier 1 (OpenAI): Times out → Tier 2
  - [ ] Tier 2 (Simplified prompt): Times out → Tier 3
  - [ ] Tier 3 (Template fallback): Success → Shows "Starter Plan" badge
  - [ ] Tier 4 (Catastrophic): Shows error modal with [Retry] [Contact Support]
- [ ] State: Workout plan generated and saved
- [ ] Functionality: Navigates to Value Demo Screen 1

---

## 3. Value Demo Screens

### **Screen 1: Your Success Path**
- [ ] UI: "Here's Your Path to Success" displays
- [ ] **Weight Graph:**
  - [ ] Starting weight displayed (e.g., "180 lbs")
  - [ ] Projected weekly progress line (gradient)
  - [ ] Goal weight displayed (e.g., "160 lbs")
  - [ ] Goal date displayed (e.g., "Mar 15, 2026")
  - [ ] Shaded "healthy range" zone
  - [ ] Glassmorphism card styling
- [ ] **Stats:**
  - [ ] Total Progress: -20 lbs (dynamic)
  - [ ] Timeline: 16 weeks (dynamic)
  - [ ] Average: -1.25 lbs/week (dynamic)
  - [ ] ✓ Safe & Sustainable badge
- [ ] UI: [See Your Full Plan →] button
- [ ] Functionality: Swipe left/right to navigate between value demo screens
- [ ] Functionality: Button navigates to Screen 2
- [ ] Edge case: "Maintain Weight" users see different messaging

### **Screen 2: Daily Nutrition Blueprint**
- [ ] UI: "Your Personalized Daily Targets" displays
- [ ] **Circular Progress Rings (2x2 grid):**
  - [ ] 🔥 Calories: 2,100-2,300 (dynamic, with range)
  - [ ] 💪 Protein: 150-180g (dynamic)
  - [ ] 🍞 Carbs: 200-250g (dynamic)
  - [ ] 🥑 Fat: 60-75g (dynamic)
  - [ ] Rings styled with gradient colors
- [ ] UI: Context text: "Calculated specifically for your [weight loss] goal and [moderate] activity lifestyle"
- [ ] UI: [See Your Meal Plan →] button
- [ ] Functionality: Swipe navigation works
- [ ] Functionality: Button navigates to Screen 3

### **Screen 3: Your Workout Schedule**
- [ ] UI: "Your Custom Workout Plan" displays
- [ ] **Visual Calendar:**
  - [ ] Selected workout days highlighted
  - [ ] Shows 5 example workouts with emojis
  - [ ] Format: "Tue 🏋️ Upper Body (45 min)"
  - [ ] Shows rest days: "Rest: Mon, Sun"
- [ ] UI: Context text: "Designed for your [home gym] (dumbbells) with progressive overload..."
- [ ] UI: [Unlock Your Plan] 🔒 button
- [ ] Functionality: Swipe navigation works
- [ ] Functionality: Button navigates to Paywall

---

## 4. Paywall Screen

### UI Elements
- [ ] Title: "Unlock Your Complete Plan" displays
- [ ] Subtitle: "Your personalized program is ready:"
- [ ] **Features List (with checkmarks):**
  - [ ] ✓ 7-day meal plan with detailed recipes
  - [ ] ✓ Grocery lists organized for easy shopping
  - [ ] ✓ Full workout programs with exercise guides
  - [ ] ✓ Daily tracking & progress analytics
  - [ ] ✓ Meal feedback learning (gets better each week)
- [ ] **Buttons:**
  - [ ] [Start 7-Day Free Trial] - Primary CTA
  - [ ] [Subscribe - $9.99/month] - Secondary CTA
  - [ ] Small text: "Cancel anytime"
- [ ] Glassmorphism card styling

### Functionality
- [ ] Test: [Start 7-Day Free Trial] button (RevenueCat integration)
- [ ] Test: [Subscribe] button (RevenueCat integration)
- [ ] Test: Purchase flow initiates correctly
- [ ] Test: Restore purchases button works
- [ ] Test: Success → Navigates to AccountSetupScreen
- [ ] Test: Cancel → Returns to paywall
- [ ] Test: Error → Shows error message
- [ ] **Dev Mode:**
  - [ ] Bypass button visible in dev only
  - [ ] Tapping bypass → Navigates to AccountSetupScreen
  - [ ] Bypass logs to console

### State Management
- [ ] Subscription status stored: `subscription_active: true`
- [ ] RevenueCat user ID linked to Firebase UID
- [ ] Purchase details logged

---

## 5. Account Setup (Post-Paywall)

### AccountSetupScreen
- [ ] UI: "Create Your Account" title displays
- [ ] UI: Subtitle: "Secure your data and access from any device"
- [ ] **Auth Method Buttons:**
  - [ ] Continue with Email (Email icon)
  - [ ] Continue with Google (Google icon) - Shows "Coming Soon" alert
  - [ ] Continue with Apple (Apple icon) - Shows "Coming Soon" alert
- [ ] **Skip Option:**
  - [ ] "Skip for now" link at bottom
  - [ ] Warning text: "Without an account, your data is only stored on this device"
- [ ] **Terms & Privacy:**
  - [ ] Small text: "By continuing, you agree to our Terms of Service and Privacy Policy"
- [ ] Glassmorphism styling consistent

### EmailAuthScreen
- [ ] UI: Tab toggle: [Sign In] [Sign Up]
- [ ] **Sign Up Mode:**
  - [ ] Email input field (glassmorphism)
  - [ ] Password input field (secure text entry)
  - [ ] Confirm password input field
  - [ ] [Create Account] button
- [ ] **Sign In Mode:**
  - [ ] Email input field
  - [ ] Password input field
  - [ ] [Sign In] button
- [ ] **Validation:**
  - [ ] Email format validation (shows error)
  - [ ] Password strength: Min 8 chars, 1 uppercase, 1 number (shows error)
  - [ ] Password match validation (Sign Up)
  - [ ] All errors displayed inline with red text
- [ ] **Functionality:**
  - [ ] Sign Up: Creates Firebase auth account
  - [ ] Links anonymous account to email credential
  - [ ] Migrates data from anonymous UID → authenticated UID
  - [ ] Syncs to backend (will fail until backend updated)
  - [ ] Success: Shows loading, then navigates to Welcome (placeholder for Home)
  - [ ] Error: Shows user-friendly error message
- [ ] Back button navigates to AccountSetupScreen

### Skip Flow
- [ ] Tapping "Skip for now" shows confirmation modal
- [ ] Modal: "Continue without account?"
- [ ] Modal: Warning about device-only data
- [ ] Modal buttons: [Continue] [Create Account]
- [ ] [Continue]: Sets `device_only_mode: true`, navigates to Welcome
- [ ] [Create Account]: Dismisses modal, returns to AccountSetupScreen

---

## 6. Design System Compliance

### Colors
- [ ] All screens use design system color palettes
- [ ] Nutrition screens: Warm colors (orange-pink gradients)
- [ ] Workout screens: Cool colors (blue-purple gradients)
- [ ] Glassmorphism: `rgba(255, 255, 255, 0.7)` with blur

### Typography
- [ ] Title: Display Large (40px)
- [ ] Prompts: Heading 1 (28px)
- [ ] Body text: Body Large (18px)
- [ ] Helper text: Body Small (14px)
- [ ] Button text: Label Large (16px, semi-bold)
- [ ] Font families: SF Pro (iOS), Roboto (Android)

### Buttons
- [ ] Primary CTA: Gradient background (warm or cool based on context)
- [ ] Secondary: Outline style with glassmorphism
- [ ] Ghost: Transparent with subtle hover
- [ ] Press animation: Scale 0.98 with spring physics
- [ ] Disabled state: 0.5 opacity

### Cards
- [ ] Glassmorphism: `backgroundColor: 'rgba(255, 255, 255, 0.7)'`
- [ ] Blur: 20px (via `expo-blur`)
- [ ] Shadow: `shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20`
- [ ] Border radius: 16px
- [ ] Inner shadow: Light gloss overlay (linear gradient)

### Spacing
- [ ] Consistent spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
- [ ] Screen padding: 20px horizontal
- [ ] Element spacing: 16px vertical between elements

### Animations
- [ ] Screen transitions: Smooth slide (300ms)
- [ ] Button presses: Scale 0.98 (150ms)
- [ ] Loading indicators: Smooth rotation (circular)
- [ ] Swipe gestures: Smooth with spring physics

---

## 7. Edge Cases & Error Handling

### Network Errors
- [ ] No internet during Firebase sign-in → Show error, allow retry
- [ ] No internet during data sync → Queue for later
- [ ] API timeout during Loading Break 3 → Fallback to template

### Data Validation
- [ ] Invalid inputs caught before proceeding
- [ ] Out-of-range values blocked or warned
- [ ] Required fields enforced (disclaimer checkbox, etc.)

### User Behavior
- [ ] Double-tapping buttons doesn't cause duplicate actions
- [ ] Back button during loading screens handled gracefully
- [ ] App closed during onboarding → Resume on reopen
- [ ] Onboarding data persists across app restarts

### Platform-Specific
- [ ] iOS: Safe area insets respected
- [ ] Android: System back button works correctly
- [ ] Keyboard: Doesn't obscure inputs (though we have no keyboards!)
- [ ] Orientation: Portrait mode only (locked)

---

## 8. Performance Optimization

### Load Times
- [ ] App launch to first screen: < 3 seconds
- [ ] Screen transitions: < 300ms
- [ ] Scroll performance: 60 FPS
- [ ] Loading Break 3: 12-17 seconds (acceptable, real API call)

### Memory Management
- [ ] No memory leaks during long onboarding sessions
- [ ] Images optimized and cached
- [ ] Components unmount cleanly

### Battery & Network
- [ ] Background processing minimal
- [ ] Network requests batched where possible
- [ ] No unnecessary polling or timers

---

## 9. Accessibility

### Screen Readers
- [ ] All buttons have accessibility labels
- [ ] All inputs have accessibility hints
- [ ] Screen titles announced on navigation

### Visual Accessibility
- [ ] Color contrast meets WCAG AA standards
- [ ] Text sizes adjustable (system font scaling)
- [ ] Tap targets minimum 44x44 points

### Gesture Accessibility
- [ ] All swipe gestures have button alternatives
- [ ] No complex multi-touch gestures required

---

## 10. Testing Requirements

### Manual Testing (IMMEDIATE)
- [ ] Complete onboarding flow start to finish (20 minutes)
- [ ] Test "Maintain Weight" path (skips Steps 4-5)
- [ ] Test "Lose Weight" path (full 16 steps)
- [ ] Test "Gain Weight" path (full 16 steps)
- [ ] Test age disclaimers (13-17, 65+)
- [ ] Test timeline validation (safe vs unsafe rates)
- [ ] Test all skip buttons (Budget, Grocery, Skip Account)
- [ ] Test Firebase anonymous → email linking
- [ ] Test data migration
- [ ] Test device-only mode (skip account)

### Automated Testing (TODO)
- [ ] Unit tests: Calculation functions (BMR, TDEE, macros, timeline validation)
- [ ] Unit tests: Data migration service
- [ ] Component tests: All 16 screens render correctly
- [ ] Integration tests: Complete flow navigation
- [ ] E2E tests: Full onboarding flow (Detox)

### TypeScript & Code Quality
- [x] Zero TypeScript errors (`npm run type-check`)
- [ ] Zero ESLint errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] No console.logs in production code (only in services with guards)

---

## 11. Backend Requirements (TODO - Next Session)

### Backend Endpoints Needed
- [ ] `POST /api/auth/firebase-login` - Verify Firebase token, create/get user, return JWT
- [ ] `POST /api/users/profile` - Accept onboarding data, save to PostgreSQL
- [ ] `GET /api/users/me` - Get current user profile

### Database Updates
- [ ] Add `firebase_uid` column to users table
- [ ] Add index on `firebase_uid` for fast lookups
- [ ] Migration to add column

### Firebase Admin SDK
- [ ] Backend can verify Firebase ID tokens
- [ ] Backend extracts UID from token
- [ ] Backend links to PostgreSQL user record

---

## 12. Known Issues & TODOs

### High Priority
- [ ] Backend sync endpoint doesn't exist yet (data migration will log error)
- [ ] Google Sign-In not implemented (shows "Coming Soon")
- [ ] Apple Sign-In not implemented (shows "Coming Soon")
- [ ] Home screen placeholder (should navigate to Home in Phase 3)

### Medium Priority
- [ ] No unit tests written yet
- [ ] No E2E tests written yet
- [ ] Loading Break 3 uses mock data (no real OpenAI call in dev)
- [ ] RevenueCat testing mode only (not production keys)

### Low Priority
- [ ] Accessibility labels not comprehensive
- [ ] No haptic feedback on button presses
- [ ] No sound effects

---

## 13. Success Criteria Checklist

### Must-Have (Phase 2 Complete)
- [ ] All 16 steps functional and bug-free
- [ ] Firebase anonymous auth works
- [ ] Account linking works (email)
- [ ] Data migration works
- [ ] All edge cases handled gracefully
- [ ] Design system compliance 100%
- [ ] Zero TypeScript errors
- [ ] Can complete full onboarding in < 5 minutes

### Nice-to-Have (Phase 2.7 Polish)
- [ ] Animations polished and smooth
- [ ] Accessibility fully implemented
- [ ] Unit tests written (80% coverage)
- [ ] E2E tests written (critical paths)
- [ ] Performance optimized (60 FPS everywhere)

### Deferred to Later Phases
- [ ] Google Sign-In (Phase 2.8 or Phase 9)
- [ ] Apple Sign-In (Phase 2.8 or Phase 9)
- [ ] Backend sync fully functional (Phase 3)
- [ ] Real OpenAI API calls (Phase 4+)
- [ ] RevenueCat production mode (Phase 10+)

---

## Next Steps

1. **USER: Restart Expo server with cache clear**
   ```bash
   cd /Users/webbhayes/weightGPTnew/mobile
   npx expo start --clear
   ```

2. **USER: Test complete onboarding flow** (20 min)
   - Note any bugs or UX issues
   - Report back findings

3. **CLAUDE: Fix any bugs found during testing**

4. **CLAUDE: Polish UI/UX based on design system**

5. **CLAUDE: Write unit tests for calculations**

6. **CLAUDE: Update backend with Firebase endpoints**

7. **USER: Final acceptance testing**

8. **READY FOR PHASE 3!** 🎉

---

**Status:** ✅ Checklist created - Ready for testing
**Created:** November 11, 2025 (Session 35)
**Owner:** WeightGPT Development Team
