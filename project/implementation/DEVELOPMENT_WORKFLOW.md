# Development Workflow for Claude

**Project:** WeightGPT MVP
**Document Version:** 1.0
**Status:** Active
**Created:** 2025-11-07
**Last Updated:** 2025-11-07
**Purpose:** Guide Claude instances through development sessions (Sessions 24+)

---

## Table of Contents

1. [Overview](#overview)
2. [Development Context Initialization](#development-context-initialization)
3. [Session Start Checklist](#session-start-checklist)
4. [During Development](#during-development)
5. [Commit Protocol](#commit-protocol)
6. [Testing Protocol](#testing-protocol)
7. [Error Handling & Debugging](#error-handling--debugging)
8. [Session End Checklist](#session-end-checklist)
9. [Quality Gates](#quality-gates)
10. [Phase-Specific Workflows](#phase-specific-workflows)
11. [Common Scenarios](#common-scenarios)

---

## Overview

**Purpose:** This document defines the complete development workflow for Claude instances working on WeightGPT during development sessions (Session 24 onwards).

**Key Principles:**
1. **Always initialize properly** - Read required docs before starting
2. **Test as you go** - Write tests alongside code (not after)
3. **Commit frequently** - Small, logical commits with clear messages
4. **Follow the plan** - Stick to IMPLEMENTATION_PLAN.md phases
5. **Never assume** - Ask user before making functional changes
6. **Quality first** - 80%+ coverage, zero TS errors, all tests passing

---

## Development Context Initialization

**CRITICAL:** Every development session MUST start with proper initialization.

### Required Reading (In Order)

**Every Session:**
1. `.claude-instructions/HOW-TO-USE-THIS-PROJECT.md` (workflow foundation)
2. `.claude-instructions/DEVELOPMENT-ORGANIZATION.md` (file organization)
3. `project/STATUS.md` (current project state)
4. `handoffs/development/LATEST-YYYY-MM-DD.md` (last dev session)
5. `project/implementation/IMPLEMENTATION_PLAN.md` (current phase only)

**Phase-Specific Reading:**
- **Phase 1 (Foundation):** ARCHITECTURE.md sections 1-4 (tech stack, backend/mobile setup)
- **Phase 2 (Q1 Onboarding):** Q1_Onboarding_FINAL.md + REQUIREMENTS.md (US-001 to US-019)
- **Phase 3 (Q3.0 Home Tab):** Q3.0_Navigation_AppShell_FINAL.md + REQUIREMENTS.md (US-026 to US-029)
- **Phase 4 (Q2 + Q3.4 Meal Planning):** Q2_MealPlanning_FINAL.md + Q3.4_Weekly_Planning_Grocery_FINAL.md
- **Phase 5 (Q3.2 AI Logging):** Q3.2_AI_Logging_FINAL.md
- **Phase 6 (Q3.3 Swapping):** Q3.3_Swapping_FINAL.md
- **Phase 7 (Q3.5 Progress):** Q3.5_Progress_Analytics_FINAL.md
- **Phase 8 (Q3.6 History + Q3.7 Offline):** Q3.6_History_Saved_FINAL.md + Q3.7_Offline_Sync_FINAL.md
- **Phase 9 (Q3.1 Settings):** Q3.1_Settings_Profile_FINAL.md
- **Phases 10-11 (Polish/QA):** All planning specs for regression testing

**Reference Documents (As Needed):**
- `CODE_STANDARDS.md` - When writing code (naming, patterns, testing)
- `API_SPECIFICATION.md` - When implementing endpoints
- `DATABASE_SCHEMA.md` - When writing queries or migrations
- `DEVELOPMENT_SETUP_GUIDE.md` - When troubleshooting environment issues

### Initialization Confirmation

After reading, confirm with user:

```
✅ Development context initialized for Session [N]

Current Phase: Phase [X] - [Phase Name]
Current Task: [Brief description from PLAN.md]
Last Session: [What was accomplished]
This Session: [What we'll work on]

Ready to proceed. What would you like to work on?
```

**Example:**
```
✅ Development context initialized for Session 24

Current Phase: Phase 1 - Foundation (Week 1-3)
Current Task: Backend project setup (Express + PostgreSQL + Prisma)
Last Session: Planning phase completed
This Session: Initialize backend, set up database, create first migration

Ready to proceed. What would you like to work on?
```

---

## Session Start Checklist

**Before writing any code:**

### 1. Environment Verification
- [ ] Local environment is set up (backend + mobile running)
- [ ] Database is running (PostgreSQL via Homebrew/Docker)
- [ ] All dependencies installed (`npm install` in backend/ and mobile/)
- [ ] Environment variables configured (.env files from .env.example)

**Commands to verify:**
```bash
# Backend
cd backend && npm run dev
# Should start on http://localhost:3000

# Mobile (in separate terminal)
cd mobile && npx expo start
# Should open Expo Dev Tools

# Database
psql -c "\l"
# Should list weightgpt_dev database
```

### 2. Git Status Check
- [ ] On correct branch (feature branch, not main)
- [ ] No uncommitted changes from previous session
- [ ] Latest code pulled from remote (if applicable)

**Commands:**
```bash
git status
git branch
# Should show feature/phase-X or similar, not main
```

### 3. Test Status Check
- [ ] All tests passing before starting new work
- [ ] No broken tests from previous session

**Commands:**
```bash
# Backend tests
cd backend && npm test
# Should show all passing

# Mobile tests
cd mobile && npm test
# Should show all passing
```

### 4. Understand Current Phase

From IMPLEMENTATION_PLAN.md, identify:
- [ ] **Phase number and name** (e.g., Phase 2: Q1 Onboarding)
- [ ] **Phase objectives** (what must be built)
- [ ] **Current step** (where you are in the phase)
- [ ] **Definition of Done** (how to know phase is complete)
- [ ] **Blockers** (anything preventing progress)

---

## During Development

### Core Development Principles

**1. Follow Planning Specs Exactly**
- ✅ Implement features as specified in Q1-Q3.7 specs
- ✅ Match screen flows, validation rules, edge cases
- ❌ Don't add features not in the spec
- ❌ Don't skip features that are in the spec
- ⚠️ If spec is unclear, ask user for clarification

**2. Write Tests Alongside Code (Not After)**
- ✅ Write test BEFORE or DURING implementation
- ✅ TDD approach for calculations (BMR, TDEE, macros, timeline validation)
- ✅ Use test pyramid: 75% unit, 20% integration, 5% E2E
- ❌ Don't write code without tests
- ❌ Don't write all tests at the end

**Example TDD Flow:**
```typescript
// 1. Write failing test first
describe('calculateBMR', () => {
  it('should calculate BMR for 30-year-old male, 180 lbs, 70 inches', () => {
    const result = calculateBMR(30, 'male', 180, 70);
    expect(result).toBe(1820); // From Q1 spec
  });
});

// 2. Run test (should fail)
// npm test -- calculate-bmr.test.ts

// 3. Implement function
export function calculateBMR(...) {
  // Implementation
}

// 4. Run test (should pass)
// 5. Refactor if needed
// 6. Commit
```

**3. Follow Code Standards**
- ✅ Use naming conventions from CODE_STANDARDS.md
- ✅ Follow file organization patterns
- ✅ Use TypeScript strict mode (no `any` types)
- ✅ Follow React/React Native best practices (functional components, hooks)
- ❌ Don't use class components
- ❌ Don't leave console.log statements
- ❌ Don't skip ESLint/Prettier checks

**4. Implement Incrementally**
- ✅ Break large features into small, testable units
- ✅ Implement one screen/component/endpoint at a time
- ✅ Test each unit before moving to next
- ❌ Don't implement entire feature in one go
- ❌ Don't move on with broken tests

**Example Incremental Approach:**
```
Phase 2 (Q1 Onboarding) breakdown:
1. ✅ Backend: User registration endpoint
   - Write test for POST /api/auth/register
   - Implement controller, service, route
   - Run test, verify passing
   - Commit

2. ✅ Backend: BMR/TDEE calculation utility
   - Write tests for calculateBMR (5 test cases)
   - Write tests for calculateTDEE (5 test cases)
   - Implement functions
   - Run tests, verify passing
   - Commit

3. ✅ Mobile: Welcome screen (Step 1)
   - Create WelcomeScreen.tsx component
   - Write component test (renders correctly, button works)
   - Implement UI following DESIGN_SYSTEM.md
   - Run test, verify passing
   - Commit

... continue for all 17 steps
```

**5. Ask Before Changing Functionality**

**ALWAYS ask user before:**
- Changing how data is processed
- Modifying user interface behavior
- Altering API responses
- Changing validation rules
- Adjusting calculations or formulas
- Making trade-offs between implementation options

**Example:**
```
User reports: "The grocery list shows both '2 chicken breasts' and '14 oz chicken'"

❌ Wrong (Claude decides):
"I'll consolidate these and convert to pounds"

✅ Correct (Claude asks):
"I see the grocery list has inconsistent units. Should I:
  A) Keep them as separate line items (easier implementation)
  B) Convert to pounds and consolidate (better UX, more complex)
  C) Add a 'Consolidate' button users can tap (hybrid approach)

What's your preference?"
```

---

## Commit Protocol

### When to Commit

**Commit after each logical unit of work:**
- ✅ After completing a single endpoint (controller + service + tests)
- ✅ After completing a single screen (component + tests + styles)
- ✅ After completing a utility function (function + tests)
- ✅ After fixing a bug (reproduction + fix + test)
- ✅ At end of session (if work in progress)

**Don't commit:**
- ❌ Code that doesn't compile (TypeScript errors)
- ❌ Code with failing tests
- ❌ Code with console.log statements
- ❌ Code without tests (except for boilerplate setup)

### Commit Message Format

**Use Conventional Commits format:**

```
type(scope): brief description (50 chars max)

Longer description if needed (wrap at 72 chars)

Implements: [Planning spec reference]
Tests: [What tests were added]
Breaking: [If breaking change, explain]

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring (no behavior change)
- `test` - Adding or updating tests
- `docs` - Documentation changes
- `style` - Code formatting (no logic change)
- `chore` - Maintenance tasks (dependencies, config)
- `perf` - Performance improvements

**Scopes:**
- Backend: `auth`, `users`, `meals`, `workouts`, `logging`, `sync`, `ai`
- Mobile: `onboarding`, `home`, `log`, `progress`, `settings`, `navigation`
- Shared: `types`, `utils`, `config`

**Examples:**

```bash
# Good commit messages

feat(auth): implement user registration endpoint

Adds POST /api/auth/register endpoint with Firebase JWT validation.
Validates email, creates user in database, returns user profile.

Implements: Q1 Step 1 (User Registration)
Tests: Added 5 unit tests for registration validation
API: POST /api/auth/register

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>

---

feat(onboarding): add welcome screen with glassmorphism

Implements first screen of 17-step onboarding flow.
Uses Design System glassmorphism with blur and gradient.

Implements: Q1 Step 1 (Welcome Screen)
Tests: Added component test for render and navigation
Spec: Q1_Onboarding_FINAL.md Step 1

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>

---

test(utils): add TDD tests for BMR calculation

Tests all BMR formulas (Mifflin-St Jeor) before implementation.
Covers male/female, lbs/kg, edge cases (min/max weights).

Implements: Q1 BMR Calculation (test-first approach)
Tests: 10 unit tests for calculateBMR function

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

```bash
# Bad commit messages (don't do this)

"fixed stuff"
"WIP"
"asdf"
"Updated files"
"More changes"
```

### Commit Workflow

**Standard workflow:**

```bash
# 1. Verify all tests pass
npm test

# 2. Run linting
npm run lint

# 3. Check formatting
npm run format:check

# 4. Stage files
git add backend/src/controllers/users.controller.ts
git add backend/src/services/users.service.ts
git add backend/tests/users.test.ts

# 5. Commit with message
git commit -m "$(cat <<'EOF'
feat(users): implement user profile update endpoint

Adds PUT /api/users/:id/profile endpoint for editing profile.
Validates all fields, handles dietary preferences, updates database.

Implements: Q3.1 Profile Editing
Tests: Added 8 integration tests for profile updates
API: PUT /api/users/:id/profile

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# 6. Verify commit
git log -1 --stat
```

### Pre-Commit Checklist

**Before every commit:**
- [ ] All tests passing (`npm test`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Code formatted (`npm run format:check`)
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Commit message follows format

---

## Testing Protocol

### Test Coverage Requirements

**Minimum Coverage:** 80% overall
**By Category:**
- Calculations (BMR, TDEE, macros): **100%** (critical accuracy)
- Services (business logic): **85%**
- Controllers (API endpoints): **75%**
- Components (UI): **70%**
- Utilities: **90%**

**Test Pyramid Distribution:**
- **75% Unit Tests** - Fast, isolated, test one thing
- **20% Integration Tests** - Test component interactions
- **5% E2E Tests** - Test critical user flows

### What to Test

**Backend - Always Test:**
- ✅ API endpoints (request/response/errors)
- ✅ Business logic (calculations, validations, algorithms)
- ✅ Database queries (CRUD operations)
- ✅ OpenAI integration (mocking API calls)
- ✅ Authentication/authorization
- ✅ Error handling

**Backend - Don't Test:**
- ❌ Third-party library internals
- ❌ Prisma ORM queries (trust Prisma)
- ❌ Express framework itself

**Mobile - Always Test:**
- ✅ Component rendering (snapshots)
- ✅ User interactions (taps, swipes, scrolls)
- ✅ Navigation flows
- ✅ State management (Zustand stores)
- ✅ API service calls (mocking Axios)
- ✅ Form validation
- ✅ Offline behavior

**Mobile - Don't Test:**
- ❌ React Native internals
- ❌ Third-party library components
- ❌ Styling (visual testing out of scope)

### Testing Frameworks

**Backend:**
- Unit/Integration: Jest + Supertest
- Run: `npm test`
- Coverage: `npm run test:coverage`

**Mobile:**
- Unit/Component: Jest + React Native Testing Library (RNTL)
- E2E: Detox (iOS/Android simulators)
- Smoke: Maestro (YAML-based)
- Run: `npm test`, `npm run e2e:ios`, `maestro test flows/`

### Test Writing Examples

**Backend - Unit Test (Calculation):**
```typescript
// backend/tests/utils/calculate-bmr.test.ts
import { calculateBMR } from '../../src/utils/calculations';

describe('calculateBMR', () => {
  describe('Mifflin-St Jeor formula', () => {
    it('calculates BMR for male, 30 years, 180 lbs, 70 inches', () => {
      const result = calculateBMR(30, 'male', 180, 70);
      expect(result).toBeCloseTo(1820, 0); // ±1 cal tolerance
    });

    it('calculates BMR for female, 25 years, 140 lbs, 65 inches', () => {
      const result = calculateBMR(25, 'female', 140, 65);
      expect(result).toBeCloseTo(1370, 0);
    });

    it('throws error for invalid age (<13)', () => {
      expect(() => calculateBMR(12, 'male', 150, 65)).toThrow('Age must be 13+');
    });
  });
});
```

**Backend - Integration Test (API Endpoint):**
```typescript
// backend/tests/integration/meal-swap.test.ts
import request from 'supertest';
import app from '../../src/app';
import { generateTestToken } from '../helpers/auth';

describe('POST /api/meals/swap', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await generateTestToken('test-user-id');
  });

  it('swaps meal and returns alternatives within macro range', async () => {
    const response = await request(app)
      .post('/api/meals/swap')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        meal_id: 'meal-123',
        meal_type: 'breakfast',
      });

    expect(response.status).toBe(200);
    expect(response.body.alternatives).toHaveLength(3);
    expect(response.body.alternatives[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      calories: expect.any(Number),
      macros: expect.objectContaining({
        protein: expect.any(Number),
        carbs: expect.any(Number),
        fat: expect.any(Number),
      }),
      match_score: expect.any(Number),
    });

    // Verify macro matching (±50 cal, ±5g protein)
    const original = await getMeal('meal-123');
    const alternative = response.body.alternatives[0];
    expect(Math.abs(alternative.calories - original.calories)).toBeLessThanOrEqual(50);
    expect(Math.abs(alternative.macros.protein - original.macros.protein)).toBeLessThanOrEqual(5);
  });

  it('returns 404 if meal not found', async () => {
    const response = await request(app)
      .post('/api/meals/swap')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ meal_id: 'nonexistent', meal_type: 'breakfast' });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Meal not found');
  });
});
```

**Mobile - Component Test:**
```typescript
// mobile/src/screens/__tests__/WelcomeScreen.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import WelcomeScreen from '../WelcomeScreen';
import { NavigationContainer } from '@react-navigation/native';

describe('WelcomeScreen', () => {
  const mockNavigate = jest.fn();
  const navigation = { navigate: mockNavigate };

  it('renders welcome message and start button', () => {
    const { getByText } = render(
      <NavigationContainer>
        <WelcomeScreen navigation={navigation} />
      </NavigationContainer>
    );

    expect(getByText('Welcome to WeightGPT')).toBeTruthy();
    expect(getByText("Let's Get Started")).toBeTruthy();
  });

  it('navigates to goal selection when button pressed', () => {
    const { getByText } = render(
      <NavigationContainer>
        <WelcomeScreen navigation={navigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByText("Let's Get Started"));
    expect(mockNavigate).toHaveBeenCalledWith('GoalSelection');
  });
});
```

**Mobile - E2E Test (Detox):**
```typescript
// mobile/e2e/onboarding.e2e.ts
describe('Onboarding Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('should complete onboarding in under 2 minutes', async () => {
    const startTime = Date.now();

    // Step 1: Welcome
    await expect(element(by.text('Welcome to WeightGPT'))).toBeVisible();
    await element(by.text("Let's Get Started")).tap();

    // Step 2: Goal Selection
    await expect(element(by.text('What is your goal?'))).toBeVisible();
    await element(by.id('goal-lose-weight')).tap();
    await element(by.id('next-button')).tap();

    // ... continue for all 17 steps

    // Step 17: Paywall
    await expect(element(by.text('Start Your Journey'))).toBeVisible();

    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(120000); // 2 minutes
  });
});
```

### Test-Driven Development (TDD) Workflow

**For all calculations, use TDD:**

```
1. RED - Write failing test
   └─ npm test (should fail)

2. GREEN - Write minimal code to pass
   └─ npm test (should pass)

3. REFACTOR - Improve code quality
   └─ npm test (should still pass)

4. COMMIT - Save working state
```

**Example: Timeline Validation (Q1 Step 5)**

```typescript
// 1. RED - Write test first
describe('validateTimeline', () => {
  it('rejects timeline that requires >2 lbs/week loss', () => {
    const result = validateTimeline({
      goal: 'lose_weight',
      current_weight: 200,
      goal_weight: 170, // -30 lbs
      goal_date: new Date('2024-12-01'), // 4 weeks from now
    });

    expect(result.valid).toBe(false);
    expect(result.error).toContain('Maximum safe rate is 2 lbs/week');
    expect(result.required_rate).toBeCloseTo(7.5, 1); // 30 lbs / 4 weeks
    expect(result.safe_rate).toBe(2);
  });
});

// Run: npm test -- validate-timeline.test.ts
// Result: FAIL (function doesn't exist yet)

// 2. GREEN - Implement function
export function validateTimeline(input: TimelineInput): TimelineResult {
  const weeks = calculateWeeks(input.goal_date);
  const weight_diff = Math.abs(input.goal_weight - input.current_weight);
  const required_rate = weight_diff / weeks;

  if (input.goal === 'lose_weight' && required_rate > 2) {
    return {
      valid: false,
      error: 'Maximum safe rate is 2 lbs/week for weight loss',
      required_rate,
      safe_rate: 2,
    };
  }

  return { valid: true };
}

// Run: npm test -- validate-timeline.test.ts
// Result: PASS

// 3. REFACTOR - Extract constants, improve readability
const MAX_WEIGHT_LOSS_RATE = 2; // lbs/week
const MAX_WEIGHT_GAIN_RATE = 1; // lbs/week

// 4. COMMIT
git commit -m "test(utils): add timeline validation with TDD"
```

---

## Error Handling & Debugging

### When Tests Fail

**1. Read the error message carefully**
```bash
npm test

# Example error:
FAIL  src/utils/calculate-bmr.test.ts
  ● calculateBMR › throws error for invalid age

    expect(received).toThrow()

    Received function did not throw

      23 |     it('throws error for invalid age (<13)', () => {
      24 |       expect(() => calculateBMR(12, 'male', 150, 65)).toThrow('Age must be 13+');
    > 25 |     });
```

**2. Understand what's wrong**
- Function should throw error for age < 13
- But it's not throwing

**3. Fix the issue**
```typescript
// Before (missing validation)
export function calculateBMR(age: number, sex: string, weight: number, height: number): number {
  // No validation
  return formula(age, sex, weight, height);
}

// After (with validation)
export function calculateBMR(age: number, sex: string, weight: number, height: number): number {
  if (age < 13) {
    throw new Error('Age must be 13+ (parental permission required for ages 13-17)');
  }
  return formula(age, sex, weight, height);
}
```

**4. Re-run tests**
```bash
npm test -- calculate-bmr.test.ts
# PASS
```

**5. Commit fix**
```bash
git commit -m "fix(utils): add age validation to BMR calculation"
```

### When Build Fails

**TypeScript Errors:**
```bash
npm run typecheck

# Error: Property 'protein' does not exist on type 'Macros'
```

**Fix:**
1. Check type definition in Q0_DATA_STRUCTURES.md
2. Ensure interface matches spec
3. Update code to use correct property names

**ESLint Errors:**
```bash
npm run lint

# Error: 'console' is not defined (no-console)
```

**Fix:**
1. Remove console.log statements
2. Use proper logger (pino for backend, no logs for mobile production)

### Debugging Tools

**Backend:**
- Chrome DevTools: `npm run dev:debug` → chrome://inspect
- VS Code Debugger: F5 with launch.json configured
- Logging: Use `logger.info()`, `logger.error()` from pino

**Mobile:**
- React Native Debugger: Cmd+D → Enable debugging
- Flipper: Network, Layout, Logs plugins
- Console: `npx react-native log-ios` or `npx react-native log-android`

**When to Ask User:**
- ❌ Don't ask for every small bug fix
- ✅ Ask when spec is unclear or contradictory
- ✅ Ask when multiple implementation approaches are valid
- ✅ Ask when hitting a blocker (missing API key, environment issue)

---

## Session End Checklist

**Before creating handoff:**

### 1. Test Status
- [ ] All tests passing (`npm test` in backend + mobile)
- [ ] No skipped tests (`.skip` or `.todo`)
- [ ] Code coverage ≥ 80% (`npm run test:coverage`)

### 2. Code Quality
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Code formatted (`npm run format:check` or `npm run format`)
- [ ] No console.log statements in code
- [ ] No commented-out code

### 3. Commit Status
- [ ] All work committed (no uncommitted changes)
- [ ] Commit messages follow Conventional Commits format
- [ ] Commits are logical units (not "WIP" or "fix stuff")

### 4. Documentation Updates
- [ ] Update STATUS.md (move completed items)
- [ ] Update IMPLEMENTATION_PLAN.md (mark completed steps with ✅)
- [ ] Log decisions in DECISIONS.md (if architectural choices made)

### 5. Handoff Creation
- [ ] Create `handoffs/development/LATEST-YYYY-MM-DD.md`
- [ ] Archive previous LATEST to `handoffs/development/archive/`
- [ ] Include: what was built, tests written, what's next, blockers
- [ ] Reference commits made this session

### 6. Development Log
- [ ] Add session entry to DEVELOPMENT_LOG.md (at top)
- [ ] Include: focus, accomplishments, decisions, handoff link

---

## Quality Gates

### Pre-Commit Quality Gate

**All of these MUST pass before every commit:**

```bash
# Run this script before committing:

#!/bin/bash
echo "🔍 Pre-commit quality checks..."

# 1. Tests
echo "Running tests..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

# 2. TypeScript
echo "Checking TypeScript..."
npm run typecheck
if [ $? -ne 0 ]; then
  echo "❌ TypeScript errors found"
  exit 1
fi

# 3. ESLint
echo "Running ESLint..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ ESLint errors found"
  exit 1
fi

# 4. Prettier
echo "Checking formatting..."
npm run format:check
if [ $? -ne 0 ]; then
  echo "❌ Code not formatted"
  exit 1
fi

echo "✅ All pre-commit checks passed!"
```

### Phase Completion Quality Gate

**Before moving to next phase (from IMPLEMENTATION_PLAN.md):**

#### Code Quality Checklist
- [ ] **All Tests Passing:** Unit, integration, E2E for this phase
- [ ] **Code Coverage ≥ 80%:** For new code in this phase
- [ ] **Zero TypeScript Errors:** `npm run typecheck` passes
- [ ] **Zero ESLint Errors:** `npm run lint` passes
- [ ] **Code Formatted:** Prettier applied to all files
- [ ] **No Debug Code:** Zero `console.log`, `debugger` statements

#### Spec Alignment Checklist
- [ ] **Matches Planning Spec:** Implementation matches Q[N]_FINAL.md
- [ ] **All Acceptance Criteria Met:** From REQUIREMENTS.md
- [ ] **No Scope Creep:** Only planned features implemented
- [ ] **UI Matches Design System:** DESIGN_SYSTEM.md specifications followed
- [ ] **API Matches Spec:** API_SPECIFICATION.md contracts followed

#### Technical Debt Checklist
- [ ] **No Shortcuts:** Or documented with justification
- [ ] **Deferred Items Documented:** Items moved to later phases tracked
- [ ] **Performance Issues Tracked:** Any concerns documented
- [ ] **Security Concerns Addressed:** Or documented for resolution

#### User Approval
- [ ] **Phase Demo Completed:** User has seen working feature
- [ ] **User Feedback Documented:** Any concerns or changes noted
- [ ] **Critical Issues Resolved:** Before moving to next phase
- [ ] **User Approves Next Phase:** Explicit approval to continue

---

## Phase-Specific Workflows

### Phase 1: Foundation (Sessions 24-30)

**Focus:** Backend + Mobile + Database setup

**Workflow:**
1. Backend setup (Express + PostgreSQL + Prisma)
2. Database migrations (25 tables from DATABASE_SCHEMA.md)
3. Authentication system (Firebase + JWT)
4. Mobile project setup (React Native + Expo)
5. Navigation shell (3-tab bottom nav)
6. Basic UI components (Button, Card, Input per DESIGN_SYSTEM.md)
7. API client setup (Axios + interceptors)

**Key Files:**
- ARCHITECTURE.md sections 1-4
- DATABASE_SCHEMA.md (all 25 tables)
- DEVELOPMENT_SETUP_GUIDE.md

**Testing:**
- Backend: Database connection, migrations run successfully
- Mobile: App launches, navigation works, can navigate between tabs

**Definition of Done:**
- Backend server running on http://localhost:3000
- Database has all 25 tables with indexes
- Mobile app launches on iOS/Android simulator
- Authentication flow works (Firebase → JWT)
- Health check endpoint returns 200

---

### Phase 2: Q1 Onboarding (Sessions 31-35)

**Focus:** 17-step onboarding flow

**Workflow:**
1. Backend: User registration endpoint + BMR/TDEE calculations
2. Mobile: Build screens 1-17 in order
3. Implement all scroll pickers (zero typing)
4. Implement all validations (timeline, age, weight)
5. Loading screens (Loading Break 1, Loading Break 2)
6. Value demo screens (weight graph, meal preview, workout preview)
7. Paywall integration (RevenueCat)

**Key Files:**
- Q1_Onboarding_FINAL.md v3.1
- REQUIREMENTS.md (US-001 to US-019)
- DESIGN_SYSTEM.md (glassmorphism, colors, typography)

**Testing:**
- Backend: 100% coverage for BMR/TDEE calculations
- Mobile: Component tests for all 17 screens
- E2E: Complete onboarding flow in < 2 minutes

**Definition of Done:**
- All 17 steps functional with zero typing
- Timeline validation working (max 2 lbs/week loss, 1 lb/week gain)
- Age disclaimers shown (13-17 parental, 65+ medical)
- "Maintain Weight" flow skips steps 4-5
- Value demo shows personalized graph
- Paywall integrated and functional

---

### Phase 3-11: [Continues similarly for each phase]

See IMPLEMENTATION_PLAN.md for complete phase breakdowns.

---

## Common Scenarios

### Scenario 1: User Requests Git Commit

**User says:** "Commit this"

**Your actions:**
1. Run pre-commit checks (tests, typecheck, lint, format)
2. If all pass, stage files and commit with proper message
3. If any fail, show errors and ask if user wants to fix or commit anyway (don't commit without approval if checks fail)

**Example:**
```bash
# 1. Run checks
npm test && npm run typecheck && npm run lint && npm run format:check

# 2. If passing, commit:
git add .
git commit -m "$(cat <<'EOF'
feat(onboarding): implement goal selection screen

Adds Step 2 of onboarding: Gain/Lose/Maintain weight selector.
Three large tap targets with active state styling per Design System.

Implements: Q1 Step 2 (Goal Selection)
Tests: Added component test for all three options
Spec: Q1_Onboarding_FINAL.md Step 2

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# 3. Confirm with user
git log -1 --stat
```

---

### Scenario 2: Test Failure

**Situation:** You make a change and tests fail

**Your actions:**
1. **Read error message carefully** - Understand what failed and why
2. **Fix the issue** - Update code or test as needed
3. **Re-run tests** - Verify fix works
4. **Commit fix** - Use `fix` type in commit message
5. **Don't move on** - Never proceed with broken tests

**Example:**
```
FAIL  tests/calculate-tdee.test.ts
  ● calculateTDEE › multiplies BMR by activity level

    expect(received).toBe(expected)

    Expected: 2730
    Received: 2184

Fix: Check formula - should be BMR × 1.55 for moderate activity, not BMR × 1.2
Update: const tdee = bmr * activityMultiplier[activity_level];
Re-run: npm test -- calculate-tdee.test.ts (PASS)
Commit: git commit -m "fix(utils): correct TDEE activity multiplier"
```

---

### Scenario 3: Spec Unclear

**Situation:** Planning spec is ambiguous or contradictory

**Your actions:**
1. **Stop coding** - Don't make assumptions
2. **Ask user for clarification** - Present the ambiguity and options
3. **Wait for answer** - Don't proceed until user decides
4. **Document decision** - Add to DECISIONS.md
5. **Continue implementation** - Follow user's guidance

**Example:**
```
Ambiguity: Q3.2 says "AI should handle portion inference" but doesn't specify
           whether to ask follow-up question or make best guess

Your question:
"The AI logging spec mentions portion inference but doesn't specify behavior.
When user logs 'chicken breast', should I:
  A) Always ask follow-up question 'How many ounces?'
  B) Make best guess (4 oz) and show in confirmation with edit option
  C) Ask only if confidence is low (< 70%)

What's your preference?"

[Wait for user response before continuing]
```

---

### Scenario 4: Approaching Session Token Limit

**Situation:** Context approaching 180K tokens

**Your actions:**
1. **Check current token usage** - Available in system messages
2. **If > 150K tokens, warn user** - "Approaching context limit, should we create handoff?"
3. **If > 180K tokens, stop work** - "Must create handoff now"
4. **Create handoff** - Follow Session End Checklist
5. **Next session** - New Claude instance reads handoff and continues

---

## Summary

**Development workflow in one sentence:**
Initialize properly → Write tests → Implement incrementally → Test continuously → Commit frequently → End with handoff

**Golden Rules:**
1. ✅ Always read required docs at session start
2. ✅ Write tests alongside code (not after)
3. ✅ Follow planning specs exactly
4. ✅ Ask before changing functionality
5. ✅ Commit frequently with clear messages
6. ✅ Never proceed with broken tests
7. ✅ End sessions with proper handoff

**When in doubt:**
- Check CODE_STANDARDS.md for coding questions
- Check IMPLEMENTATION_PLAN.md for what to build next
- Check planning specs (Q1-Q3.7) for feature details
- Check API_SPECIFICATION.md for endpoint contracts
- Check DATABASE_SCHEMA.md for data structure
- Ask user if spec is unclear or you need to make a decision

---

**Document Version:** 1.0
**Created:** 2025-11-07
**Last Updated:** 2025-11-07
**Status:** Active
**Next Review:** After Session 23 (before development begins)
