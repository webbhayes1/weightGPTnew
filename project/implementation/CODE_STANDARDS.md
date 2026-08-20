# Code Standards & Best Practices

**Project:** WeightGPT MVP
**Document Version:** 1.0
**Status:** Active
**Created:** 2025-11-07
**Last Updated:** 2025-11-07

---

## Table of Contents

1. [Overview](#overview)
2. [Naming Conventions](#naming-conventions)
3. [Code Organization](#code-organization)
4. [TypeScript Standards](#typescript-standards)
5. [Testing Standards](#testing-standards)
6. [Git Workflow](#git-workflow)
7. [Code Review Checklist](#code-review-checklist)
8. [Documentation Requirements](#documentation-requirements)
9. [Error Handling Standards](#error-handling-standards)
10. [Performance Guidelines](#performance-guidelines)
11. [Security Best Practices](#security-best-practices)
12. [Accessibility Standards](#accessibility-standards)

---

## Overview

**Purpose:** This document establishes coding standards, conventions, and best practices for the WeightGPT codebase to ensure consistency, maintainability, and quality across all development.

**Enforcement:**
- ESLint for JavaScript/TypeScript linting
- Prettier for code formatting
- TypeScript strict mode enabled
- Pre-commit hooks for automated checks
- Code review for manual verification

**Philosophy:**
- **Consistency over preference** - Follow established patterns even if you prefer alternatives
- **Clarity over cleverness** - Write code that's easy to understand, not just concise
- **Test everything** - 80%+ code coverage is mandatory, not optional
- **Document why, not what** - Code shows what it does; comments explain why

---

## Naming Conventions

### General Principles

1. **Be descriptive** - Names should clearly communicate purpose
2. **Avoid abbreviations** - Except for well-known acronyms (API, HTTP, URL)
3. **Use consistent terminology** - Match domain language from planning specs
4. **Avoid single-letter variables** - Except for loop indices (i, j, k) and function parameters in small closures

---

### Files

#### Backend Files

```typescript
// Format: kebab-case.type.ts
// Examples:
users.controller.ts          // ✅ Correct
meal-plans.service.ts        // ✅ Correct
auth.middleware.ts           // ✅ Correct
calculate-bmr.util.ts        // ✅ Correct

UsersController.ts           // ❌ Wrong (PascalCase)
users_controller.ts          // ❌ Wrong (snake_case)
users.ts                     // ❌ Wrong (missing type suffix)
```

**Backend File Types:**
- `.controller.ts` - HTTP request handlers
- `.service.ts` - Business logic
- `.middleware.ts` - Express middleware
- `.route.ts` - Route definitions
- `.util.ts` - Utility functions
- `.type.ts` - TypeScript type definitions
- `.test.ts` - Test files
- `.job.ts` - Background job definitions

#### Mobile Files

```typescript
// Components: PascalCase.tsx
MealCard.tsx                 // ✅ Correct
HomeScreen.tsx               // ✅ Correct
ProgressCircle.tsx           // ✅ Correct
SwapModal.tsx                // ✅ Correct

mealCard.tsx                 // ❌ Wrong (camelCase)
meal-card.tsx                // ❌ Wrong (kebab-case)
MealCard.js                  // ❌ Wrong (use .tsx for components)

// Hooks: camelCase.ts with 'use' prefix
useAuth.ts                   // ✅ Correct
useMealPlan.ts               // ✅ Correct
useOfflineSync.ts            // ✅ Correct

// Services: camelCase.ts
apiClient.ts                 // ✅ Correct
authService.ts               // ✅ Correct
offlineQueue.ts              // ✅ Correct

// Utilities: camelCase.ts
dateHelpers.ts               // ✅ Correct
macroCalculations.ts         // ✅ Correct

// Types: PascalCase.ts or camelCase.types.ts
User.ts                      // ✅ Correct (single type)
api.types.ts                 // ✅ Correct (multiple types)
```

---

### Variables & Constants

```typescript
// Variables: camelCase
const currentWeight = 150;
const mealPlanId = 'abc123';
const isLoading = false;
let dailyCalories = 2000;

// Constants (immutable values): SCREAMING_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.weightgpt.com';
const DEFAULT_TIMEOUT_MS = 30000;
const OPENAI_MODEL = 'gpt-4o-mini';

// Configuration objects: camelCase (even if immutable)
const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
};

// Enums: PascalCase for enum, SCREAMING_SNAKE_CASE for values
enum UserGoal {
  LOSE_WEIGHT = 'lose_weight',
  GAIN_WEIGHT = 'gain_weight',
  MAINTAIN = 'maintain',
}

// Boolean variables: Prefix with is/has/can/should
const isAuthenticated = true;
const hasCompletedOnboarding = false;
const canSwapMeal = true;
const shouldRefreshToken = false;
```

---

### Functions & Methods

```typescript
// Functions: camelCase, verb-first
function calculateBMR(weight: number, height: number, age: number): number {
  // Implementation
}

function validateMealSwap(currentMeal: Meal, newMeal: Meal): boolean {
  // Implementation
}

async function fetchMealPlan(userId: string): Promise<MealPlan> {
  // Implementation
}

// Event handlers: Prefix with 'handle' or 'on'
const handleMealSwap = () => { /* ... */ };
const onLoginSuccess = (user: User) => { /* ... */ };

// React component functions: PascalCase
function MealCard({ meal }: MealCardProps) {
  return <View>...</View>;
}
```

---

### Classes & Interfaces

```typescript
// Classes: PascalCase, noun-based
class AppError extends Error {
  constructor(message: string, statusCode: number) {
    super(message);
  }
}

class MealPlanService {
  async generateWeeklyPlan(userId: string): Promise<MealPlan> {
    // Implementation
  }
}

// Interfaces: PascalCase, descriptive
interface User {
  id: string;
  email: string;
}

interface MealPlanGenerationRequest {
  userId: string;
  startDate: Date;
  preferences: UserPreferences;
}

// Props interfaces: ComponentName + 'Props'
interface MealCardProps {
  meal: Meal;
  onSwap: (mealId: string) => void;
  isLoading?: boolean;
}

// Type aliases: PascalCase
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
```

---

### Database & API

```typescript
// Database tables: snake_case (PostgreSQL convention)
// See DATABASE_SCHEMA.md for full definitions
users
meal_plans
workout_plans
logged_entries
saved_items

// Database columns: snake_case
user_id
created_at
daily_calories
goal_weight

// API endpoints: kebab-case (RESTful convention)
// See API_SPECIFICATION.md for full list
GET  /api/meal-plans/:id
POST /api/meals/swap
GET  /api/users/:id/profile
PUT  /api/settings/preferences

// JSON keys in API responses: snake_case (matches database)
{
  "user_id": "abc123",
  "meal_plan_id": "def456",
  "daily_calories": 2000,
  "created_at": "2025-11-07T10:00:00Z"
}

// JSON keys in mobile app state: camelCase (JavaScript convention)
const user = {
  userId: 'abc123',
  mealPlanId: 'def456',
  dailyCalories: 2000,
  createdAt: new Date('2025-11-07T10:00:00Z'),
};
```

---

## Code Organization

### Backend Folder Structure

```
/backend
├── src/
│   ├── controllers/          # HTTP request handlers
│   │   ├── auth.controller.ts
│   │   ├── meals.controller.ts
│   │   ├── users.controller.ts
│   │   └── workouts.controller.ts
│   ├── services/             # Business logic
│   │   ├── ai.service.ts           # OpenAI integration
│   │   ├── meal-plan.service.ts
│   │   ├── workout-plan.service.ts
│   │   └── user.service.ts
│   ├── routes/               # Express route definitions
│   │   ├── auth.route.ts
│   │   ├── meals.route.ts
│   │   └��─ index.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error-handler.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   └── validate.middleware.ts
│   ├── jobs/                 # Background jobs
│   │   ├── streak-evaluation.job.ts
│   │   ├── weekly-insights.job.ts
│   │   └── achievement-check.job.ts
│   ├── utils/                # Utility functions
│   │   ├── calculations.util.ts    # BMR, TDEE, macros
│   │   ├── date.util.ts
│   │   └── logger.util.ts
│   ├── types/                # TypeScript types
│   │   ├── api.types.ts
│   │   ├── user.types.ts
│   │   └── meal.types.ts
│   ├── constants/            # Constants
│   │   ├── api.constants.ts
│   │   └── validation.constants.ts
│   ├── prisma/               # Prisma ORM
│   │   └── schema.prisma
│   ├── app.ts                # Express app configuration
│   └── server.ts             # Server entry point
├── tests/                    # Tests (mirrors src/)
│   ├── controllers/
│   ├── services/
│   └── utils/
├── .env.example
├── package.json
└── tsconfig.json
```

### Mobile Folder Structure

```
/mobile
├── src/
│   ├── screens/              # Screen components
│   │   ├── onboarding/
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── GoalTypeScreen.tsx
│   │   │   └── ...
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── DayDetailScreen.tsx
│   │   ├── log/
│   │   │   └── LogScreen.tsx
│   │   └── progress/
│   │       └── ProgressScreen.tsx
│   ├── components/           # Reusable components
│   │   ├── common/           # Generic components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   ├── meals/            # Meal-specific components
│   │   │   ├── MealCard.tsx
│   │   │   └── MacroBar.tsx
│   │   └── progress/         # Progress-specific components
│   │       ├── ProgressCircle.tsx
│   │       └── WeightGraph.tsx
│   ├── navigation/           # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── TabNavigator.tsx
│   │   └── types.ts
│   ├── services/             # External services
│   │   ├── api/
│   │   │   ├── apiClient.ts
│   │   │   ├── authApi.ts
│   │   │   └── mealsApi.ts
│   │   ├── auth/
│   │   │   └── authService.ts
│   │   ├── offline/
│   │   │   ├── syncQueue.ts
│   │   │   └── cacheManager.ts
│   │   └── notifications/
│   │       └── notificationService.ts
│   ├── store/                # State management
│   │   ├── queries/          # TanStack Query hooks
│   │   │   ├── useMealPlan.ts
│   │   │   └── useUserProfile.ts
│   │   └── zustand/          # Zustand stores
│   │       ├── uiStore.ts
│   │       └── offlineStore.ts
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useOfflineSync.ts
│   │   └── useMealSwap.ts
│   ├── utils/                # Utility functions
│   │   ├── dateHelpers.ts
│   │   ├── macroCalculations.ts
│   │   └── formatters.ts
│   ├── types/                # TypeScript types
│   │   ├── api.types.ts
│   │   ├── navigation.types.ts
│   │   └── user.types.ts
│   ├── constants/            # Constants
│   │   ├── theme.ts          # Design tokens from DESIGN_SYSTEM.md
│   │   └── api.ts
│   ├── assets/               # Images, fonts, etc.
│   │   ├── images/
│   │   └── fonts/
│   └── App.tsx               # Root component
├── __tests__/                # Tests (mirrors src/)
│   ├── components/
│   ├── screens/
│   └── utils/
├── .env.example
├── app.json
├── package.json
└── tsconfig.json
```

---

### File Organization Rules

**When to create a new file:**
- File exceeds 300 lines → Split into smaller modules
- Multiple unrelated functions → Separate by concern
- Component has complex logic → Extract hooks or utilities

**When to create a new folder:**
- 5+ related files → Group into feature folder
- Shared components → Move to `/components/common/`
- Feature-specific components → Keep in feature folder

**Barrel Exports (index.ts):**
Use barrel exports to simplify imports:

```typescript
// components/common/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';

// Usage in other files
import { Button, Card, Input } from '@/components/common';
```

---

## TypeScript Standards

### Strict Mode Configuration

**tsconfig.json** (required settings):

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

### Type Safety Rules

**1. Never use `any`** (use `unknown` if type is truly unknown)

```typescript
// ❌ Bad
function processData(data: any) {
  return data.value;
}

// ✅ Good (if type is known)
function processData(data: MealPlan) {
  return data.meals;
}

// ✅ Good (if type is truly unknown)
function processData(data: unknown) {
  if (isValidMealPlan(data)) {
    return data.meals;
  }
  throw new Error('Invalid data');
}
```

**2. Prefer `interface` over `type` for object shapes**

```typescript
// ✅ Preferred for objects
interface User {
  id: string;
  email: string;
}

// ✅ Use type for unions, intersections, primitives
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
type UserWithMeals = User & { meals: Meal[] };
```

**3. Use explicit return types for functions**

```typescript
// ✅ Good - explicit return type
function calculateBMR(weight: number, height: number, age: number): number {
  return 10 * weight + 6.25 * height - 5 * age + 5;
}

// ❌ Bad - inferred return type (harder to catch errors)
function calculateBMR(weight: number, height: number, age: number) {
  return 10 * weight + 6.25 * height - 5 * age + 5;
}
```

**4. Use readonly for immutable data**

```typescript
interface MealPlan {
  readonly id: string;
  readonly userId: string;
  readonly createdAt: Date;
  meals: Meal[]; // Mutable
}
```

**5. Use enums for fixed sets of values** (but prefer union types for simple cases)

```typescript
// ✅ Good - union type for simple cases
type UserGoal = 'lose_weight' | 'gain_weight' | 'maintain';

// ✅ Good - enum for complex cases with methods
enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}
```

---

### Generic Type Naming

```typescript
// Convention: T, K, V for single generics
function identity<T>(value: T): T {
  return value;
}

// Descriptive names for multiple generics
function mapObject<TInput, TOutput>(
  obj: TInput,
  mapper: (value: TInput) => TOutput
): TOutput {
  // Implementation
}

// Component generics
interface ListProps<TItem> {
  items: TItem[];
  renderItem: (item: TItem) => React.ReactNode;
}
```

---

## Testing Standards

### Test Pyramid

Follow the 75-20-5 testing pyramid:
- **75% Unit Tests** - Fast, isolated, test individual functions/components
- **20% Integration Tests** - Test API endpoints, database interactions
- **5% E2E Tests** - Test critical user flows end-to-end

**Minimum Coverage:** 80% overall, 100% for calculations (BMR, TDEE, macros)

---

### Unit Tests

**Naming Convention:**

```typescript
// File: calculateBMR.util.ts
// Test: calculateBMR.util.test.ts

describe('calculateBMR', () => {
  it('should calculate BMR for male user correctly', () => {
    // Test implementation
  });

  it('should calculate BMR for female user correctly', () => {
    // Test implementation
  });

  it('should throw error for negative weight', () => {
    // Test implementation
  });
});
```

**Test Structure (AAA Pattern):**

```typescript
it('should calculate BMR for male user correctly', () => {
  // Arrange - Set up test data
  const weight = 70; // kg
  const height = 175; // cm
  const age = 30;
  const gender = 'male';

  // Act - Execute function
  const result = calculateBMR(weight, height, age, gender);

  // Assert - Verify result
  expect(result).toBe(1680); // Mifflin-St Jeor formula
});
```

**What to Unit Test:**

✅ **Must test:**
- All utility functions (calculations, formatters, helpers)
- All business logic in services
- All custom hooks
- All complex component logic

❌ **Don't unit test:**
- Third-party library code
- Simple getters/setters
- Trivial wrapper functions

**Example Unit Tests:**

```typescript
// tests/utils/macroCalculations.util.test.ts
import { calculateMacros } from '@/utils/macroCalculations';

describe('calculateMacros', () => {
  it('should calculate macros for weight loss goal', () => {
    const tdee = 2000;
    const goal = 'lose_weight';

    const result = calculateMacros(tdee, goal);

    expect(result.calories).toBe(1500); // 25% deficit
    expect(result.protein_g).toBe(150); // 40% of calories
    expect(result.carbs_g).toBe(150); // 40% of calories
    expect(result.fat_g).toBe(33); // 20% of calories
  });

  it('should calculate macros for muscle gain goal', () => {
    const tdee = 2000;
    const goal = 'gain_weight';

    const result = calculateMacros(tdee, goal);

    expect(result.calories).toBe(2400); // 20% surplus
    expect(result.protein_g).toBe(210); // 35% of calories
    expect(result.carbs_g).toBe(300); // 50% of calories
    expect(result.fat_g).toBe(40); // 15% of calories
  });
});
```

---

### Component Tests (React Native Testing Library)

**What to test:**
- Component renders correctly
- User interactions trigger expected behavior
- Props are passed and used correctly
- Conditional rendering works
- Accessibility labels exist

**Example Component Test:**

```typescript
// __tests__/components/MealCard.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { MealCard } from '@/components/meals/MealCard';

describe('MealCard', () => {
  const mockMeal = {
    id: '1',
    name: 'Grilled Chicken Breast',
    calories: 250,
    macros: { protein_g: 40, carbs_g: 5, fat_g: 7 },
  };

  it('should render meal name and calories', () => {
    const { getByText } = render(<MealCard meal={mockMeal} />);

    expect(getByText('Grilled Chicken Breast')).toBeTruthy();
    expect(getByText('250 cal')).toBeTruthy();
  });

  it('should call onSwap when swap button is pressed', () => {
    const onSwap = jest.fn();
    const { getByText } = render(
      <MealCard meal={mockMeal} onSwap={onSwap} />
    );

    fireEvent.press(getByText('Swap'));

    expect(onSwap).toHaveBeenCalledWith('1');
  });

  it('should show loading state when isLoading is true', () => {
    const { getByTestId } = render(
      <MealCard meal={mockMeal} isLoading={true} />
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should have accessibility label', () => {
    const { getByLabelText } = render(<MealCard meal={mockMeal} />);

    expect(
      getByLabelText('Meal: Grilled Chicken Breast, 250 calories')
    ).toBeTruthy();
  });
});
```

---

### Integration Tests (Backend API)

**What to test:**
- API endpoints return correct status codes
- Request validation works
- Authentication/authorization works
- Database operations succeed
- Error responses are correct

**Example Integration Test:**

```typescript
// tests/controllers/meals.controller.test.ts
import request from 'supertest';
import { app } from '@/app';
import { prisma } from '@/prisma';

describe('POST /api/meals/swap', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Set up test user and get auth token
    const user = await prisma.user.create({
      data: { email: 'test@example.com', password: 'hashed' },
    });
    userId = user.id;
    authToken = generateTestToken(userId);
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it('should swap meal and return new meal', async () => {
    const response = await request(app)
      .post('/api/meals/swap')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        meal_id: 'meal-123',
        replacement_meal_id: 'meal-456',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('meal');
    expect(response.body.meal.id).toBe('meal-456');
  });

  it('should return 401 if not authenticated', async () => {
    const response = await request(app)
      .post('/api/meals/swap')
      .send({
        meal_id: 'meal-123',
        replacement_meal_id: 'meal-456',
      });

    expect(response.status).toBe(401);
  });

  it('should return 400 if meal_id is missing', async () => {
    const response = await request(app)
      .post('/api/meals/swap')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        replacement_meal_id: 'meal-456',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('meal_id is required');
  });
});
```

---

### E2E Tests (Detox + Maestro)

**Detox for Complex Flows:**

```javascript
// e2e/offline-sync.e2e.js
describe('Offline Sync', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should queue actions when offline and sync when online', async () => {
    // Log in
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    // Wait for home screen
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(5000);

    // Enable airplane mode
    await device.setAirplaneMode(true);

    // Log a meal offline
    await element(by.id('log-tab')).tap();
    await element(by.id('meal-input')).typeText('Chicken and rice');
    await element(by.id('log-button')).tap();

    // Verify offline banner appears
    await expect(element(by.id('offline-banner'))).toBeVisible();

    // Verify meal is in sync queue
    await element(by.id('settings-tab')).tap();
    await element(by.id('sync-queue-button')).tap();
    await expect(element(by.text('Chicken and rice'))).toBeVisible();

    // Disable airplane mode
    await device.setAirplaneMode(false);

    // Wait for sync to complete
    await waitFor(element(by.id('offline-banner')))
      .not.toBeVisible()
      .withTimeout(10000);

    // Verify sync queue is empty
    await expect(element(by.text('Sync queue is empty'))).toBeVisible();
  });
});
```

**Maestro for Smoke Tests:**

```yaml
# .maestro/onboarding-happy-path.yaml
appId: com.weightgpt.app
---
- launchApp
- tapOn: "Get Started"
- tapOn: "Lose Weight"
- tapOn: "Next"
- scroll:
    element: "weight-picker"
    to: "150"
- tapOn: "Next"
- scroll:
    element: "height-picker"
    to: "5'8\""
- tapOn: "Next"
- assertVisible: "Your Plan Is Ready"
- tapOn: "Continue to Paywall"
- assertVisible: "Start Your Free Trial"
```

---

### Mocking Strategies

**Mock External Services:**

```typescript
// __mocks__/openai.ts
export const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                meal_name: 'Grilled Chicken',
                calories: 250,
              }),
            },
          },
        ],
      }),
    },
  },
};

// In test file
jest.mock('openai', () => ({
  OpenAI: jest.fn(() => mockOpenAI),
}));
```

**Mock Firebase Auth:**

```typescript
// __mocks__/firebase-admin.ts
export const mockFirebaseAuth = {
  verifyIdToken: jest.fn().mockResolvedValue({
    uid: 'test-user-id',
    email: 'test@example.com',
  }),
};

jest.mock('firebase-admin', () => ({
  auth: () => mockFirebaseAuth,
}));
```

**Mock RevenueCat:**

```typescript
// __mocks__/@revenuecat/purchases-typescript.ts
export const mockPurchases = {
  getOfferings: jest.fn().mockResolvedValue({
    current: {
      monthly: { identifier: 'monthly_plan' },
    },
  }),
  purchasePackage: jest.fn().mockResolvedValue({
    customerInfo: { entitlements: { premium: { isActive: true } } },
  }),
};
```

---

### Test Coverage Requirements

**Mandatory Coverage Thresholds:**

```json
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // 100% coverage for critical calculations
    './src/utils/calculations.util.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
```

**Run tests with coverage:**

```bash
# All tests with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Specific file
npm test -- calculateBMR.util.test.ts
```

---

## Git Workflow

### Branch Naming

**Format:** `<type>/<short-description>`

**Types:**
- `feature/` - New feature
- `fix/` - Bug fix
- `refactor/` - Code refactoring
- `test/` - Adding/updating tests
- `docs/` - Documentation changes
- `chore/` - Build, dependencies, tooling

**Examples:**

```bash
feature/q1-onboarding-screens       # ✅ Good
fix/meal-swap-race-condition        # ✅ Good
refactor/api-error-handling         # ✅ Good
test/workout-logging-e2e            # ✅ Good

onboarding                          # ❌ Bad (no type prefix)
feature/ImplementOnboarding         # ❌ Bad (use kebab-case)
fix-bug                             # ❌ Bad (not descriptive)
```

---

### Commit Message Format

**Use Conventional Commits:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `test` - Adding/updating tests
- `docs` - Documentation
- `style` - Formatting, whitespace
- `chore` - Build, dependencies

**Examples:**

```bash
# Good commits
feat(onboarding): implement weight scroll picker
fix(meals): resolve race condition in meal swap
refactor(api): extract error handling to middleware
test(utils): add tests for BMR calculation
docs(readme): update setup instructions

# With body
feat(ai-logging): add natural language meal parsing

Integrate OpenAI GPT-4o-mini for meal parsing. Includes:
- Natural language processing
- Follow-up question system
- Fallback to manual entry

Implements: Q3.2 AI Logging spec

# With breaking change
feat(api)!: change meal swap endpoint response format

BREAKING CHANGE: Meal swap endpoint now returns full meal object
instead of just meal ID. Update mobile app to handle new format.
```

**Commit Message Rules:**
1. Use imperative mood ("add" not "added")
2. Don't capitalize first letter of subject
3. No period at end of subject
4. Keep subject under 72 characters
5. Leave blank line before body
6. Wrap body at 72 characters

---

### Pull Request Process

**1. Create PR with descriptive title:**

```
feat(Q1): Implement onboarding screens 1-10
fix(meals): Resolve meal swap race condition
refactor(api): Extract error handling middleware
```

**2. Fill out PR template:**

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Test coverage
- [ ] Documentation

## Checklist
- [ ] Code follows CODE_STANDARDS.md
- [ ] Tests written and passing (80%+ coverage)
- [ ] No TypeScript errors
- [ ] ESLint rules passing
- [ ] Prettier formatting applied
- [ ] Documentation updated (if needed)
- [ ] Tested on iOS and Android (mobile only)
- [ ] No console.logs left in code
- [ ] Accessibility tested (if UI changes)

## Screenshots (if UI changes)
[Add screenshots here]

## Testing
How to test these changes

## Related Issues
Implements: Q1 Onboarding spec
Fixes: #123
```

**3. Request review from team member**

**4. Address review feedback**

**5. Merge after approval:**
- Use **Squash and Merge** for feature branches
- Use **Rebase and Merge** for hotfixes
- Delete branch after merge

---

### When to Commit

**Commit frequently at logical checkpoints:**
- ✅ After completing a feature
- ✅ After fixing a bug
- ✅ After adding tests
- ✅ Before switching tasks
- ✅ At end of work session

**Don't commit:**
- ❌ Broken code that doesn't compile
- ❌ Code with failing tests
- ❌ Code with console.logs
- ❌ Large, unrelated changes in one commit

---

## Code Review Checklist

### For Reviewers

**1. Correctness**
- [ ] Code does what it's supposed to do
- [ ] Edge cases are handled
- [ ] No logic errors or off-by-one errors
- [ ] Calculations are accurate (especially BMR, TDEE, macros)

**2. Code Quality**
- [ ] Follows naming conventions
- [ ] No duplicate code (DRY principle)
- [ ] Functions are small and focused (< 50 lines)
- [ ] No deeply nested logic (max 3 levels)
- [ ] No magic numbers (use named constants)

**3. Testing**
- [ ] Tests are written for new code
- [ ] Tests cover edge cases
- [ ] Coverage meets 80%+ threshold
- [ ] All tests pass

**4. TypeScript**
- [ ] No `any` types
- [ ] Proper type annotations
- [ ] No TypeScript errors
- [ ] Interfaces/types are well-defined

**5. Performance**
- [ ] No unnecessary re-renders (React)
- [ ] Efficient database queries (no N+1)
- [ ] No blocking operations on main thread
- [ ] Large lists are virtualized

**6. Security**
- [ ] No hardcoded secrets or API keys
- [ ] User input is validated
- [ ] SQL injection prevented (use Prisma ORM)
- [ ] XSS prevented (React escapes by default)
- [ ] Authentication/authorization checked

**7. Accessibility**
- [ ] Accessibility labels on interactive elements
- [ ] Touch targets are 44×44px minimum
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Screen reader tested (if UI changes)

**8. Documentation**
- [ ] Complex logic has comments explaining "why"
- [ ] JSDoc on exported functions
- [ ] README updated if setup changed

---

### Red Flags (Request Changes)

**Critical Issues:**
- 🚨 Hardcoded secrets or API keys
- 🚨 No error handling for external calls
- 🚨 No tests for new code
- 🚨 TypeScript errors or `any` types
- 🚨 SQL injection vulnerabilities
- 🚨 Missing authentication checks

**Major Issues:**
- ⚠️ Duplicate code (should be extracted)
- ⚠️ Functions > 100 lines
- ⚠️ Deeply nested logic (> 3 levels)
- ⚠️ Poor variable names
- ⚠️ Missing accessibility labels

---

## Documentation Requirements

### When to Add Inline Comments

**DO comment:**
- ✅ Complex algorithms or business logic
- ✅ Non-obvious workarounds
- ✅ "Why" something is done a certain way
- ✅ TODOs for future improvements

**DON'T comment:**
- ❌ Obvious code (what the code does is clear)
- ❌ Commented-out code (delete it)
- ❌ Redundant comments

**Examples:**

```typescript
// ✅ Good - explains "why"
// Use Mifflin-St Jeor formula instead of Harris-Benedict
// because it's more accurate for modern populations
function calculateBMR(weight: number, height: number, age: number): number {
  return 10 * weight + 6.25 * height - 5 * age + 5;
}

// ❌ Bad - states the obvious
// Calculate BMR
function calculateBMR(weight: number, height: number, age: number): number {
  return 10 * weight + 6.25 * height - 5 * age + 5;
}

// ✅ Good - explains workaround
// Firebase JWT validation fails with service account in dev mode,
// so we skip validation and use test token (remove for production)
if (process.env.NODE_ENV === 'development') {
  return { uid: 'test-user' };
}

// ✅ Good - TODO for future
// TODO: Add caching for meal plan generation (currently generates on every request)
async function generateMealPlan(userId: string): Promise<MealPlan> {
  // Implementation
}
```

---

### JSDoc Requirements

**All exported functions must have JSDoc:**

```typescript
/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
 *
 * @param weight - User weight in pounds
 * @param height - User height in inches
 * @param age - User age in years
 * @param gender - User gender (male/female/other)
 * @returns BMR in calories per day
 *
 * @example
 * const bmr = calculateBMR(150, 68, 30, 'male');
 * console.log(bmr); // 1680
 */
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female' | 'other'
): number {
  // Convert lbs to kg, inches to cm
  const weightKg = weight * 0.453592;
  const heightCm = height * 2.54;

  // Mifflin-St Jeor formula
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;

  // Adjust for gender
  if (gender === 'male') {
    bmr += 5;
  } else if (gender === 'female') {
    bmr -= 161;
  } else {
    // Use average for 'other'
    bmr -= 78;
  }

  return Math.round(bmr);
}
```

---

### README Updates

**Update README.md when:**
- Setup steps change
- New environment variables added
- New scripts added to package.json
- New dependencies with special setup
- Deployment process changes

---

## Error Handling Standards

### Backend Error Handling

**Use AppError class:**

```typescript
// utils/AppError.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Usage in services
if (!user) {
  throw new AppError('User not found', 404);
}

if (mealPlan.userId !== currentUserId) {
  throw new AppError('Unauthorized to access this meal plan', 403);
}

// Global error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
    });
  }

  // Unknown error - log and return generic message
  logger.error('Unexpected error', err);
  return res.status(500).json({
    error: 'Internal server error',
    statusCode: 500,
  });
});
```

---

### Mobile Error Handling

**Axios Interceptor:**

```typescript
// services/api/apiClient.ts
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401: Token expired, refresh and retry
    if (error.response?.status === 401) {
      const newToken = await refreshAuthToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance.request(error.config);
    }

    // 429: Rate limit, show user-friendly message
    if (error.response?.status === 429) {
      showToast('Too many requests. Please wait a moment.');
      return Promise.reject(error);
    }

    // 5xx: Server error, log to Sentry
    if (error.response?.status >= 500) {
      Sentry.captureException(error);
      showToast('Server error. Please try again later.');
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
```

**React Error Boundaries:**

```typescript
// components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallbackScreen />;
    }

    return this.props.children;
  }
}
```

---

## Performance Guidelines

**1. Avoid unnecessary re-renders (React):**

```typescript
// ✅ Good - memoize expensive calculations
const macroPercentages = useMemo(() => {
  return calculateMacroPercentages(meal.macros);
}, [meal.macros]);

// ✅ Good - memoize callbacks
const handleSwap = useCallback((mealId: string) => {
  swapMeal(mealId);
}, [swapMeal]);

// ❌ Bad - recalculates on every render
const macroPercentages = calculateMacroPercentages(meal.macros);
```

**2. Virtualize long lists:**

```typescript
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={meals}
  renderItem={({ item }) => <MealCard meal={item} />}
  estimatedItemSize={100}
/>
```

**3. Optimize database queries:**

```typescript
// ✅ Good - use select to fetch only needed fields
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, email: true, name: true },
});

// ❌ Bad - fetches all fields
const user = await prisma.user.findUnique({
  where: { id: userId },
});

// ✅ Good - use include for related data (one query)
const mealPlan = await prisma.mealPlan.findUnique({
  where: { id: planId },
  include: { meals: true },
});

// ❌ Bad - N+1 query problem (two queries)
const mealPlan = await prisma.mealPlan.findUnique({ where: { id: planId } });
const meals = await prisma.meal.findMany({ where: { mealPlanId: planId } });
```

**4. Debounce user input:**

```typescript
import { debounce } from 'lodash';

const debouncedSearch = useMemo(
  () =>
    debounce((query: string) => {
      searchMeals(query);
    }, 300),
  [searchMeals]
);
```

---

## Security Best Practices

**1. Never commit secrets:**

```bash
# .env file (gitignored)
OPENAI_API_KEY=sk-...
JWT_SECRET=...

# .env.example file (committed)
OPENAI_API_KEY=your-api-key-here
JWT_SECRET=generate-with-openssl-rand-base64-32
```

**2. Validate all user input:**

```typescript
import { z } from 'zod';

const mealSwapSchema = z.object({
  meal_id: z.string().uuid(),
  replacement_meal_id: z.string().uuid(),
});

// In controller
const { meal_id, replacement_meal_id } = mealSwapSchema.parse(req.body);
```

**3. Use parameterized queries (Prisma handles this):**

```typescript
// ✅ Safe - Prisma parameterizes automatically
const user = await prisma.user.findUnique({
  where: { email: userEmail },
});

// ❌ Unsafe - don't use raw SQL with string concatenation
const result = await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userEmail}`;
```

**4. Implement rate limiting:**

```typescript
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'Too many requests, please try again later.',
});

app.use('/api/', apiLimiter);
```

---

## Accessibility Standards

**1. Add accessibility labels:**

```typescript
<Pressable
  accessibilityLabel="Swap meal: Grilled Chicken, 250 calories"
  accessibilityRole="button"
  onPress={handleSwap}
>
  <Text>Swap</Text>
</Pressable>
```

**2. Ensure touch targets are 44×44px minimum:**

```typescript
<Pressable
  style={{ minWidth: 44, minHeight: 44 }}
  onPress={handlePress}
>
  <Icon name="swap" size={24} />
</Pressable>
```

**3. Test with VoiceOver (iOS) and TalkBack (Android)**

**4. Ensure color contrast meets WCAG 2.1 AA:**
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- Use WebAIM Contrast Checker

---

## Configuration Files

### ESLint Configuration

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

---

## Summary

**Remember:**
- ✅ Consistency is key - follow these standards always
- ✅ 80%+ test coverage is mandatory
- ✅ TypeScript strict mode, no `any` types
- ✅ Write code that's easy to understand
- ✅ Document "why", not "what"
- ✅ Never commit secrets
- ✅ Test accessibility with screen readers
- ✅ Get code reviews before merging

**When in doubt:**
- Check this document
- Reference ARCHITECTURE.md for tech stack
- Review planning specs (Q1-Q3.7) for requirements
- Ask for clarification in PR comments

---

**Document Version:** 1.0
**Created:** 2025-11-07
**Last Updated:** 2025-11-07
**Status:** Active - All developers must follow these standards
**Next Review:** After Session 23 (before development begins)
