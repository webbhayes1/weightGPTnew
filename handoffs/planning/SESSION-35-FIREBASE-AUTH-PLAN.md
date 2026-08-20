
1# Session 35: Firebase Authentication Implementation Plan

**Date:** November 11, 2025
**Session:** 35
**Status:** 🔄 **IN PROGRESS**

---

## Overview

**Goal:** Implement Firebase Anonymous Auth → Authenticated User upgrade flow for post-paywall account creation

**Why Firebase Anonymous Auth?**
- Users can complete onboarding without creating account
- Data persists during onboarding (stored under anonymous UID)
- After paywall conversion, upgrade to authenticated account
- Seamless data migration from anonymous → authenticated
- Better UX: Don't ask for account until user commits (subscribes)

---

## Architecture Overview

### Current Flow (Session 34)
```
App Launch
  ↓
Onboarding (16 steps) - No auth, data stored locally
  ↓
Value Demo (3 screens)
  ↓
Paywall → Subscribe
  ↓
??? (no account creation)
  ↓
Home Screen (or Welcome)
```

### New Flow (Session 35)
```
App Launch
  ↓
Firebase Anonymous Sign-In (automatic, invisible to user)
  ↓
Onboarding (16 steps) - Data stored under anonymous UID
  ↓
Value Demo (3 screens)
  ↓
Paywall → Subscribe
  ↓
AccountSetupScreen (NEW) - Choose auth method
  ↓
Authenticate (Email/Google/Apple)
  ↓
Link Anonymous Account → Authenticated Account
  ↓
Migrate Data (anonymous UID → authenticated UID)
  ↓
Home Screen (authenticated user)
```

---

## Phase 1: Firebase Anonymous Auth Setup

### 1.1 Firebase Configuration (Already Complete)

**Status:** ✅ **COMPLETE** (from Phase 1 Foundation)

Firebase was configured in Phase 1:
- `mobile/firebase.config.ts` exists
- Firebase SDK installed
- API keys in environment variables

**Verify:**
```bash
# Check if Firebase is configured
cat mobile/firebase.config.ts
cat mobile/.env | grep FIREBASE
```

### 1.2 Create Firebase Auth Service

**File:** `mobile/src/services/auth/firebaseAuth.ts`

**Purpose:**
- Initialize Firebase Auth
- Handle anonymous sign-in
- Handle authenticated sign-in (email, Google, Apple)
- Link anonymous account to authenticated account
- Handle account upgrades

**Functions to implement:**
```typescript
// Auto sign-in anonymously on app launch
export async function signInAnonymously(): Promise<FirebaseAuthTypes.User>

// Sign in with email/password
export async function signInWithEmail(email: string, password: string): Promise<FirebaseAuthTypes.User>

// Sign up with email/password
export async function signUpWithEmail(email: string, password: string): Promise<FirebaseAuthTypes.User>

// Sign in with Google
export async function signInWithGoogle(): Promise<FirebaseAuthTypes.User>

// Sign in with Apple
export async function signInWithApple(): Promise<FirebaseAuthTypes.User>

// Link anonymous account to email credential
export async function linkAnonymousToEmail(email: string, password: string): Promise<FirebaseAuthTypes.User>

// Link anonymous account to Google
export async function linkAnonymousToGoogle(): Promise<FirebaseAuthTypes.User>

// Link anonymous account to Apple
export async function linkAnonymousToApple(): Promise<FirebaseAuthTypes.User>

// Get current user
export function getCurrentUser(): FirebaseAuthTypes.User | null

// Sign out
export async function signOut(): Promise<void>
```

### 1.3 Update App.tsx - Auto Anonymous Sign-In

**File:** `mobile/App.tsx`

**Changes:**
1. Import `signInAnonymously` from firebase auth service
2. Call `signInAnonymously()` on app mount (useEffect)
3. Store auth state in Zustand auth store
4. Navigate based on auth state:
   - Anonymous + no onboarding data → Onboarding
   - Anonymous + has onboarding data → Resume onboarding
   - Authenticated + subscribed → Home
   - Authenticated + not subscribed → Paywall

**Pseudocode:**
```typescript
useEffect(() => {
  async function initAuth() {
    const user = await signInAnonymously();
    authStore.setUser(user);

    // Check onboarding status
    const hasCompletedOnboarding = await AsyncStorage.getItem('onboarding_complete');

    if (!hasCompletedOnboarding) {
      // Navigate to onboarding
    } else if (user.isAnonymous) {
      // Navigate to account setup or paywall
    } else {
      // Navigate to home
    }
  }

  initAuth();
}, []);
```

### 1.4 Update Onboarding Store - Link to Firebase UID

**File:** `mobile/src/store/onboardingStore.ts`

**Changes:**
1. Store Firebase anonymous UID with onboarding data
2. Save onboarding data to AsyncStorage with UID as key
3. After upgrade, migrate data using UID

**Data structure:**
```typescript
// AsyncStorage key pattern
const ONBOARDING_KEY = `onboarding_data_${firebaseUID}`;

// Store onboarding data
await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(onboardingData));
```

---

## Phase 2: Account Setup Screen (Post-Paywall)

### 2.1 Create AccountSetupScreen.tsx

**File:** `mobile/src/screens/onboarding/AccountSetupScreen.tsx`

**UI Components:**
1. **Header**
   - Title: "Create Your Account"
   - Subtitle: "Secure your data and access from any device"

2. **Auth Method Options** (3 large buttons)
   - Continue with Google (Google icon)
   - Continue with Apple (Apple icon)
   - Continue with Email (Email icon)

3. **Skip Option** (bottom)
   - "Skip for now" link
   - Warning: "Without an account, your data is only stored on this device"
   - On skip: Navigate to Home (device-only mode)

4. **Terms & Privacy**
   - Small text: "By continuing, you agree to our Terms of Service and Privacy Policy"

**Design:**
- Glassmorphism card for auth options
- Icons from react-native-vector-icons
- Consistent with Design System (DESIGN_SYSTEM.md)

### 2.2 Implement Auth Method Handlers

**Email/Password Flow:**
```typescript
const handleEmailAuth = async () => {
  // Navigate to EmailAuthScreen (new screen)
  navigation.navigate('EmailAuth');
};
```

**Google Sign-In Flow:**
```typescript
const handleGoogleAuth = async () => {
  try {
    setLoading(true);

    // 1. Sign in with Google (gets credential)
    const user = await linkAnonymousToGoogle();

    // 2. Migrate data
    await migrateUserData(anonymousUID, user.uid);

    // 3. Update backend
    await createUserProfile(user);

    // 4. Navigate to Home
    navigation.navigate('Home');
  } catch (error) {
    // Handle error
    showError('Google sign-in failed');
  } finally {
    setLoading(false);
  }
};
```

**Apple Sign-In Flow:**
```typescript
const handleAppleAuth = async () => {
  // Similar to Google, but using Apple credentials
};
```

**Skip Flow:**
```typescript
const handleSkip = async () => {
  // Show warning modal
  const confirmed = await showConfirmDialog({
    title: 'Continue without account?',
    message: 'Your data will only be stored on this device. You won\'t be able to access it from other devices.',
    confirmText: 'Continue',
    cancelText: 'Create Account',
  });

  if (confirmed) {
    // Mark as device-only mode
    await AsyncStorage.setItem('device_only_mode', 'true');

    // Navigate to Home
    navigation.navigate('Home');
  }
};
```

### 2.3 Create EmailAuthScreen.tsx

**File:** `mobile/src/screens/onboarding/EmailAuthScreen.tsx`

**UI Components:**
1. **Tab Toggle** - Sign In | Sign Up
2. **Email Input**
3. **Password Input**
4. **Confirm Password Input** (Sign Up only)
5. **Submit Button**
6. **Back Button** → AccountSetupScreen

**Validation:**
- Email format validation
- Password strength (min 8 chars, 1 uppercase, 1 number)
- Password match (Sign Up)

---

## Phase 3: Account Linking & Data Migration

### 3.1 Create Data Migration Service

**File:** `mobile/src/services/auth/dataMigration.ts`

**Purpose:** Migrate onboarding data from anonymous UID to authenticated UID

**Functions:**
```typescript
// Migrate all user data from anonymous to authenticated
export async function migrateUserData(
  anonymousUID: string,
  authenticatedUID: string
): Promise<void> {
  // 1. Get onboarding data from AsyncStorage (anonymous key)
  const anonymousKey = `onboarding_data_${anonymousUID}`;
  const onboardingData = await AsyncStorage.getItem(anonymousKey);

  if (!onboardingData) {
    throw new Error('No onboarding data found for anonymous user');
  }

  // 2. Save to new key (authenticated UID)
  const authenticatedKey = `onboarding_data_${authenticatedUID}`;
  await AsyncStorage.setItem(authenticatedKey, onboardingData);

  // 3. Clean up anonymous data
  await AsyncStorage.removeItem(anonymousKey);

  // 4. Update any other local storage keys
  // (sync queue, cached data, etc.)

  // 5. Send data to backend
  await sendOnboardingDataToBackend(authenticatedUID, JSON.parse(onboardingData));
}

// Send onboarding data to backend for storage
async function sendOnboardingDataToBackend(
  uid: string,
  data: OnboardingData
): Promise<void> {
  // POST /api/users/profile
  // Include Firebase custom token from auth service
}
```

### 3.2 Update Backend - Accept Firebase UID

**File:** `backend/src/controllers/auth.controller.ts`

**Changes:**
1. Accept Firebase ID token in auth requests
2. Verify token with Firebase Admin SDK
3. Extract UID and user info
4. Create/update user in PostgreSQL with Firebase UID

**Endpoint:**
```typescript
// POST /api/auth/firebase-login
// Body: { idToken: string, onboardingData?: object }
// Returns: { user: User, jwt: string }

export async function firebaseLogin(req: Request, res: Response) {
  const { idToken, onboardingData } = req.body;

  // 1. Verify Firebase token
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const { uid, email } = decodedToken;

  // 2. Check if user exists in PostgreSQL
  let user = await prisma.user.findUnique({ where: { firebase_uid: uid } });

  if (!user) {
    // 3. Create new user
    user = await prisma.user.create({
      data: {
        firebase_uid: uid,
        email,
        ...onboardingData, // BMR, TDEE, macros, preferences, etc.
      },
    });
  }

  // 4. Generate custom JWT (7-day expiry)
  const jwt = generateJWT(user.id);

  // 5. Return user + JWT
  res.json({ user, jwt });
}
```

---

## Phase 4: Navigation Flow Updates

### 4.1 Update Navigation Structure

**File:** `mobile/src/navigation/RootNavigator.tsx`

**Changes:**
1. Add AccountSetup screen to onboarding stack
2. Add EmailAuth screen to onboarding stack
3. Update Paywall navigation to go to AccountSetup (not Home)

**Navigation stack:**
```typescript
<Stack.Navigator>
  {/* Onboarding Flow */}
  <Stack.Screen name="Welcome" component={WelcomeScreen} />
  {/* ... Steps 2-16 ... */}
  <Stack.Screen name="LoadingBreak3" component={LoadingBreak3Screen} />
  <Stack.Screen name="ValueDemoSuccessPath" component={ValueDemoSuccessPathScreen} />
  <Stack.Screen name="ValueDemoDailyNutrition" component={ValueDemoDailyNutritionScreen} />
  <Stack.Screen name="ValueDemoWorkouts" component={ValueDemoWorkoutsScreen} />
  <Stack.Screen name="Paywall" component={PaywallScreen} />

  {/* NEW: Post-Paywall Account Creation */}
  <Stack.Screen name="AccountSetup" component={AccountSetupScreen} />
  <Stack.Screen name="EmailAuth" component={EmailAuthScreen} />

  {/* Main App */}
  <Stack.Screen name="Home" component={HomeScreen} />
</Stack.Navigator>
```

### 4.2 Update PaywallScreen Navigation

**File:** `mobile/src/screens/onboarding/PaywallScreen.tsx`

**Changes:**
```typescript
// After successful purchase
const handlePurchaseSuccess = async () => {
  // 1. Store subscription status
  await AsyncStorage.setItem('subscription_active', 'true');

  // 2. Navigate to AccountSetup (NEW)
  navigation.navigate('AccountSetup');

  // OLD: navigation.navigate('Home');
};

// Dev bypass also goes to AccountSetup
if (BYPASS_PAYWALL_IN_DEV) {
  navigation.navigate('AccountSetup');
}
```

---

## Phase 5: Testing Strategy

### 5.1 Unit Tests

**Test files to create:**
1. `firebaseAuth.test.ts` - Test all auth functions
2. `dataMigration.test.ts` - Test data migration logic
3. `AccountSetupScreen.test.tsx` - Component tests
4. `EmailAuthScreen.test.tsx` - Component tests

**Test cases:**
- Anonymous sign-in succeeds
- Email sign-up validates input
- Google sign-in links anonymous account
- Data migration transfers all data
- Migration cleans up anonymous data

### 5.2 Integration Tests

**Backend:**
```typescript
describe('POST /api/auth/firebase-login', () => {
  it('creates new user on first login', async () => {
    const response = await request(app)
      .post('/api/auth/firebase-login')
      .send({
        idToken: mockFirebaseToken,
        onboardingData: { /* ... */ },
      });

    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body).toHaveProperty('jwt');
  });

  it('returns existing user on subsequent login', async () => {
    // Test idempotency
  });
});
```

### 5.3 E2E Tests

**Detox test:**
```typescript
describe('Complete Onboarding → Account Creation Flow', () => {
  it('should complete onboarding and create account', async () => {
    // 1. Launch app (anonymous sign-in happens automatically)
    await device.launchApp({ newInstance: true });

    // 2. Complete onboarding (all 16 steps)
    // ... tap through screens ...

    // 3. Complete value demo
    // ... swipe through 3 screens ...

    // 4. Bypass paywall (dev mode)
    await element(by.id('paywall-continue')).tap();

    // 5. Verify AccountSetup screen appears
    await expect(element(by.text('Create Your Account'))).toBeVisible();

    // 6. Choose Google auth
    await element(by.id('auth-google')).tap();

    // 7. Verify Home screen appears
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });
});
```

---

## Phase 6: Environment Setup

### 6.1 Firebase Project Configuration

**Required:**
1. Enable Firebase Authentication in Firebase Console
2. Enable providers:
   - ✅ Anonymous (always enabled)
   - ✅ Email/Password
   - ✅ Google Sign-In
   - ✅ Apple Sign-In (iOS only)

3. Add OAuth credentials:
   - Google: OAuth 2.0 Client ID
   - Apple: Service ID, Team ID, Key ID

4. Update `.env` with credentials:
```bash
# mobile/.env
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...

# Google Sign-In
GOOGLE_WEB_CLIENT_ID=...

# Apple Sign-In (iOS)
APPLE_SERVICE_ID=...
```

### 6.2 iOS Configuration (Apple Sign-In)

**Required files:**
1. Enable "Sign In with Apple" capability in Xcode
2. Add entitlements file
3. Update `Info.plist`

### 6.3 Android Configuration (Google Sign-In)

**Required files:**
1. Download `google-services.json` from Firebase Console
2. Place in `mobile/android/app/google-services.json`
3. Update `build.gradle`

---

## Implementation Order

### Session 35 - Part 1: Firebase Anonymous Auth (2-3 hours)
1. ✅ Create this plan document
2. 🔄 Verify Firebase configuration
3. ⏳ Create `firebaseAuth.ts` service
4. ⏳ Implement `signInAnonymously()` function
5. ⏳ Update `App.tsx` to auto sign-in
6. ⏳ Test anonymous sign-in works
7. ⏳ Update onboarding store to save data with UID

### Session 35 - Part 2: Account Setup Screen (2-3 hours)
8. ⏳ Create `AccountSetupScreen.tsx`
9. ⏳ Create `EmailAuthScreen.tsx`
10. ⏳ Implement Google Sign-In integration
11. ⏳ Implement Apple Sign-In integration
12. ⏳ Add screens to navigation
13. ⏳ Update Paywall navigation

### Session 35 - Part 3: Data Migration (1-2 hours)
14. ⏳ Create `dataMigration.ts` service
15. ⏳ Implement `migrateUserData()` function
16. ⏳ Implement account linking functions
17. ⏳ Test migration flow

### Session 35 - Part 4: Backend Integration (1-2 hours)
18. ⏳ Update backend auth controller
19. ⏳ Add Firebase token verification
20. ⏳ Create user profile endpoint
21. ⏳ Test backend integration

### Session 35 - Part 5: Testing & Validation (1-2 hours)
22. ⏳ Write unit tests
23. ⏳ Write integration tests
24. ⏳ Manual testing (complete flow)
25. ⏳ Fix any bugs found

### Session 35 - Part 6: Documentation (30 mins)
26. ⏳ Update this plan with final status
27. ⏳ Create Session 35 handoff document
28. ⏳ Document decisions made

---

## Success Criteria

**Phase complete when:**
- [ ] Anonymous sign-in happens automatically on app launch
- [ ] Users can complete onboarding without creating account
- [ ] After paywall, AccountSetupScreen appears
- [ ] Users can sign in with Email, Google, or Apple
- [ ] Anonymous account successfully links to authenticated account
- [ ] All onboarding data migrates correctly
- [ ] Backend receives onboarding data and creates user profile
- [ ] Users can skip account creation (device-only mode)
- [ ] All tests passing
- [ ] Zero TypeScript errors
- [ ] Documentation complete

---

## Known Risks & Mitigations

### Risk 1: Anonymous Account Linking Fails
**Mitigation:** Implement retry logic + fallback to create new account and re-enter data

### Risk 2: Data Migration Incomplete
**Mitigation:** Validate all data exists before cleanup, log migration steps

### Risk 3: Google/Apple Sign-In Configuration Complex
**Mitigation:** Start with Email/Password (simpler), add social auth incrementally

### Risk 4: User Skips Account Creation
**Mitigation:** Device-only mode works, but warn user about data loss risk

---

## Files to Create

### Mobile (New Files)
1. `mobile/src/services/auth/firebaseAuth.ts` - Firebase auth functions
2. `mobile/src/services/auth/dataMigration.ts` - Data migration logic
3. `mobile/src/screens/onboarding/AccountSetupScreen.tsx` - Account creation screen
4. `mobile/src/screens/onboarding/EmailAuthScreen.tsx` - Email/password form
5. `mobile/src/types/auth.types.ts` - Auth-related types

### Mobile (Modified Files)
1. `mobile/App.tsx` - Add anonymous sign-in on mount
2. `mobile/src/navigation/OnboardingNavigator.tsx` - Add new screens
3. `mobile/src/screens/onboarding/PaywallScreen.tsx` - Navigate to AccountSetup
4. `mobile/src/store/onboardingStore.ts` - Save data with Firebase UID
5. `mobile/src/store/authStore.ts` - Update with Firebase user state

### Backend (Modified Files)
1. `backend/src/controllers/auth.controller.ts` - Add Firebase login endpoint
2. `backend/src/routes/auth.routes.ts` - Add route
3. `backend/src/services/auth.service.ts` - Firebase token verification
4. `backend/prisma/schema.prisma` - Add firebase_uid field to users table

### Documentation
1. `handoffs/planning/SESSION-35-FIREBASE-AUTH-PLAN.md` (this file)
2. `handoffs/planning/LATEST-2025-11-11-session35.md` (handoff document)

---

## Dependencies

**NPM Packages (Mobile):**
- `@react-native-firebase/auth` - Already installed ✅
- `@react-native-google-signin/google-signin` - Need to install
- `@invertase/react-native-apple-authentication` - Need to install

**NPM Packages (Backend):**
- `firebase-admin` - Already installed ✅

---

## Next Steps After Session 35

**Phase 2.7: Onboarding Perfection** (Sessions 36-37)
1. Complete flow walkthrough and testing
2. Design polish (expo-blur, animations)
3. Accessibility improvements
4. Performance optimization
5. Documentation updates
6. Final user acceptance testing

**Then:** Phase 3 - Main App Shell & Home Tab

---

**Status:** ✅ **COMPLETE**
**Created:** November 11, 2025
**Last Updated:** November 11, 2025 (Session 35)
**Completion:** November 11, 2025

---

## ✅ COMPLETION SUMMARY

### What Was Built (Session 35)

**1. Firebase Anonymous Authentication ✅**
- Created `firebase.config.ts` with environment variable configuration
- Created `firebaseAuth.ts` service with complete auth functions:
  - `signInAnonymously()` - Auto sign-in on app launch
  - `signInWithEmail()` / `signUpWithEmail()` - Email/password auth
  - `linkAnonymousToEmail()` - Upgrade anonymous → authenticated
  - `getCurrentUser()`, `isAnonymous()`, `isAuthenticated()` - State helpers
  - `getAuthErrorMessage()` - User-friendly error messages
- Updated `App.tsx` to automatically sign in anonymously on launch
- Updated `authStore.ts` to store Firebase user information

**2. Data Persistence with Firebase UID ✅**
- Updated `onboardingStore.ts` with Firebase UID-based storage:
  - `saveToStorage()` - Save data with key: `onboarding_data_${firebaseUID}`
  - `loadFromStorage()` - Load data from Firebase UID key
  - Helper: `getStorageKey()` - Generate storage key from current user

**3. Data Migration Service ✅**
- Created `dataMigration.ts` service:
  - `migrateUserData()` - Migrate all data anonymous → authenticated
  - `syncOnboardingDataToBackend()` - Send data to backend after auth
  - `hasOnboardingData()`, `getOnboardingData()` - Utility functions
  - `deleteUserData()` - Cleanup function
- Handles migration of:
  - Onboarding data
  - Onboarding completion flag
  - (Ready for future: meal plans, workout plans, sync queue)

**4. Account Setup Screens ✅**
- Created `AccountSetupScreen.tsx` (post-paywall):
  - 3 auth methods: Email, Google (coming soon), Apple (coming soon)
  - Skip option → Device-only mode
  - Clean UI with glassmorphism design
  - Warning for device-only mode
  - Terms & Privacy links
- Created `EmailAuthScreen.tsx`:
  - Toggle: Sign In ⟷ Sign Up modes
  - Email & password validation
  - Confirm password for sign-up
  - Links anonymous account to email credential
  - Migrates data automatically
  - Syncs to backend
  - User-friendly error messages

**5. Navigation Flow Updates ✅**
- Updated `onboarding.types.ts` - Added `AccountSetup` and `EmailAuth` routes
- Updated `OnboardingNavigator.tsx` - Registered new screens
- Updated `PaywallScreen.tsx` - All paths now go to `AccountSetup`:
  - Dev bypass → AccountSetup
  - Purchase success → AccountSetup
  - Restore purchases → AccountSetup

**6. TypeScript & Code Quality ✅**
- ✅ **Zero TypeScript errors**
- ✅ All files properly typed
- ✅ No `any` types (except for legacy code)
- ✅ Proper error handling throughout
- ✅ Console logging for debugging

---

### Files Created (7 new files)

1. `mobile/src/config/firebase.config.ts` - Firebase SDK configuration
2. `mobile/src/services/auth/firebaseAuth.ts` - Auth service (340 lines)
3. `mobile/src/services/auth/dataMigration.ts` - Migration service (260 lines)
4. `mobile/src/screens/onboarding/AccountSetupScreen.tsx` - Account setup UI (330 lines)
5. `mobile/src/screens/onboarding/EmailAuthScreen.tsx` - Email auth UI (460 lines)

### Files Modified (6 files)

1. `mobile/App.tsx` - Added anonymous sign-in on app launch
2. `mobile/src/store/onboardingStore.ts` - Added Firebase UID persistence
3. `mobile/src/types/onboarding.types.ts` - Added new route types
4. `mobile/src/navigation/OnboardingNavigator.tsx` - Registered new screens
5. `mobile/src/screens/onboarding/PaywallScreen.tsx` - Updated navigation
6. `handoffs/planning/SESSION-35-FIREBASE-AUTH-PLAN.md` - This document

---

### Current Flow (Session 35)

```
App Launch
  ↓
Firebase Anonymous Sign-In (automatic)
  ↓
Onboarding (16 steps) - Data saved with anonymous UID
  ↓
Value Demo (3 screens)
  ↓
Paywall → Subscribe (or bypass in dev)
  ↓
AccountSetupScreen (NEW)
  ├─ Email/Password → EmailAuthScreen → Link Account → Migrate Data → Backend Sync
  ├─ Google (Coming Soon)
  ├─ Apple (Coming Soon)
  └─ Skip → Device-Only Mode
  ↓
TODO: Navigate to Home (Phase 3)
```

---

### What's NOT Done (Future Work)

**Google Sign-In** (Phase 2 of account creation)
- Requires: `@react-native-google-signin/google-signin`
- OAuth setup in Firebase Console
- Implementation: Similar to email linking

**Apple Sign-In** (Phase 2 of account creation)
- Requires: `@invertase/react-native-apple-authentication`
- Apple Developer setup
- iOS entitlements
- Implementation: Similar to email linking

**Backend Integration** (Session 36)
- Backend endpoint: `POST /api/auth/firebase-login`
- Firebase Admin SDK verification
- User profile creation with onboarding data
- JWT generation for API requests

**Home Screen Navigation** (Phase 3)
- Currently navigates to Welcome as placeholder
- Update to navigate to Home once Phase 3 is complete

---

### Testing Status

**Manual Testing Required:**
1. ✅ App launches with anonymous sign-in
2. ⏳ Complete onboarding flow
3. ⏳ Reach AccountSetupScreen after paywall
4. ⏳ Test email sign-up flow
5. ⏳ Verify data migration
6. ⏳ Test device-only mode (skip)
7. ⏳ Test error handling (invalid email, weak password)

**TypeScript:** ✅ Zero errors
**Linting:** ⏳ Not tested
**Unit Tests:** ⏳ Not written (future work)

---

### Known Issues / Considerations

**1. Backend Not Yet Updated**
- `syncOnboardingDataToBackend()` will fail (endpoint doesn't exist yet)
- Needs backend work in next session

**2. Navigation Placeholder**
- After account creation, goes to Welcome (should go to Home)
- Will be fixed in Phase 3

**3. Google/Apple Sign-In Stubs**
- Shows "Coming Soon" alerts
- Will implement in Phase 2 of account creation

**4. Device-Only Mode**
- Works but user stays anonymous
- Can be upgraded to authenticated later in Settings

**5. No Tests Written**
- Auth service needs unit tests
- Migration service needs tests
- UI needs component tests

---

**Status:** ✅ **COMPLETE**
**Created:** November 11, 2025
**Last Updated:** November 11, 2025 (Session 35)
**Completion:** November 11, 2025
