# WeightGPT Architecture Specification

**Version:** 1.0
**Date:** 2025-11-07
**Purpose:** Complete technical architecture for WeightGPT mobile application
**Status:** Active - Development Ready

---

## Document Overview

This document defines the complete technical architecture for WeightGPT, including:
- Technology stack with rationale
- Backend architecture (Node.js + Express + PostgreSQL)
- Mobile architecture (React Native + Expo)
- Deployment strategy (Render.com + EAS)
- Security implementation
- Performance optimization strategies

**Dependencies:**
- [Database Schema](DATABASE_SCHEMA.md) - 25 tables, indexes, relationships
- [API Specification](API_SPECIFICATION.md) - 72 endpoints, request/response formats
- [Planning Specifications](../planning/) - Q0-Q3.7 feature requirements
- [Design System](../DESIGN_SYSTEM.md) - Visual design language
- [Tech Stack Decisions](../DECISIONS.md) - Sessions 16 rationale

---

## Table of Contents

1. [Tech Stack Summary](#tech-stack-summary)
2. [Backend Architecture](#backend-architecture)
3. [Mobile App Architecture](#mobile-app-architecture)
4. [Deployment Architecture](#deployment-architecture)
5. [Security Architecture](#security-architecture)
6. [Performance Architecture](#performance-architecture)
7. [Data Flow Architecture](#data-flow-architecture)
8. [Offline-First Architecture](#offline-first-architecture)
9. [AI Integration Architecture](#ai-integration-architecture)
10. [Testing Architecture](#testing-architecture)

---

## Tech Stack Summary

### Frontend Stack (React Native + Expo)

| Category | Technology | Version | Rationale |
|----------|-----------|---------|-----------|
| **Framework** | React Native | 0.73+ | Industry standard for cross-platform mobile |
| **Build Tool** | Expo | 50+ | Managed workflow, EAS builds, OTA updates |
| **Navigation** | React Navigation | v6 | Better than Expo Router for complex tab+modal structure |
| **UI Components** | Custom + Design Tokens | - | Perfect glassmorphism match, 50 KB vs 200+ KB for libraries |
| **State (Server)** | TanStack Query | 5.0+ | Automatic caching, refetching, optimistic updates |
| **State (UI)** | Zustand | 4.0+ | Simple, performant, minimal boilerplate |
| **Local Database** | expo-sqlite + Drizzle | - | Offline-first, type-safe, lightweight for mobile |
| **Storage (Secure)** | expo-secure-store | - | JWT tokens, sensitive data |
| **Storage (Fast)** | react-native-mmkv | 2.0+ | User preferences, cache (10x faster than AsyncStorage) |
| **Forms** | React Hook Form + Zod | - | Uncontrolled inputs, better performance |
| **Validation** | Zod | 3.0+ | Runtime type safety, schema validation |
| **API Client** | Axios | 1.6+ | Interceptors for auth, retry, error handling |
| **Authentication** | Firebase Auth | - | Social auth, 50K MAU free, official SDK |
| **Payments** | RevenueCat | - | Mobile subscriptions, free until $10K MRR |
| **Push Notifications** | expo-notifications | - | Cross-platform, deep links |
| **Analytics** | PostHog | - | Privacy-friendly, feature flags, 1M events/month free |
| **Error Tracking** | Sentry | - | Best RN support, performance monitoring, 5K events/month free |
| **OTA Updates** | EAS Updates | - | Deploy JS changes in 0-5 min without app review |
| **Animations** | React Native Reanimated | v3.6+ | UI thread animations, liquid glass aesthetic |
| **Images** | Expo Image | - | Faster loading, disk caching, blurhash |
| **Blur Effects** | expo-blur | - | Native GPU blur for glassmorphism |
| **Testing (Unit)** | Jest + RNTL | - | Unit and component tests (95% of test suite) |
| **Testing (E2E)** | Detox | - | Complex flows requiring device control (offline sync) |
| **Testing (Smoke)** | Maestro | - | Fast YAML-based smoke tests (onboarding, navigation) |

### Backend Stack (Node.js + Express)

| Category | Technology | Version | Rationale |
|----------|-----------|---------|-----------|
| **Runtime** | Node.js | 18+ | Industry standard, excellent async I/O |
| **Framework** | Express | 4.18+ | Mature, flexible, extensive middleware ecosystem |
| **Database** | PostgreSQL | 15+ | Relational data, JSONB support, excellent indexing |
| **ORM** | Prisma | 5.0+ | Type-safe queries, automatic migrations, Prisma Studio |
| **Validation** | Zod | 3.0+ | Runtime validation for API inputs and AI outputs |
| **Logging** | pino + pino-http | - | Structured JSON logs, high performance |
| **Job Queue** | Render Cron → BullMQ | - | Phased: Start simple (Render Cron), scale later (BullMQ) |
| **Message Queue** | Upstash Redis | - | BullMQ backend, free tier sufficient for MVP |
| **Webhooks** | Postgres Inbox Pattern | - | Durable event processing (RevenueCat events) |
| **Authentication** | Firebase Admin SDK | - | Validate Firebase JWTs, issue custom JWTs |
| **AI Provider** | OpenAI API | GPT-4o-mini | Cost-effective, fast, structured outputs |
| **AI Guardrails** | opossum (circuit breaker) | - | Graceful degradation during OpenAI outages |
| **Error Tracking** | Sentry | - | Server-side error monitoring |
| **Testing** | Jest + Supertest | - | Unit tests for API endpoints |

### Development Tools

| Category | Technology | Rationale |
|----------|-----------|-----------|
| **Language** | TypeScript | 5.0+ | Type safety across stack |
| **Package Manager** | npm | Simplicity, standard |
| **Linting** | ESLint + Prettier | Code quality, consistency |
| **Version Control** | Git + GitHub | Industry standard |
| **Commit Convention** | Conventional Commits | Semantic versioning, changelogs |
| **CI/CD** | GitHub Actions | Free tier, native GitHub integration |

---

## Backend Architecture

### Folder Structure

```
backend/
├── src/
│   ├── config/                  # Configuration files
│   │   ├── database.ts          # Prisma client setup
│   │   ├── firebase.ts          # Firebase Admin SDK
│   │   ├── openai.ts            # OpenAI client + circuit breaker
│   │   ├── sentry.ts            # Error tracking
│   │   └── redis.ts             # Redis connection (post-MVP)
│   │
│   ├── middleware/              # Express middleware
│   │   ├── auth.ts              # JWT validation
│   │   ├── errorHandler.ts     # Global error handler
│   │   ├── rateLimiter.ts      # Rate limiting
│   │   ├── requestLogger.ts    # pino-http logger
│   │   └── validation.ts       # Zod validation wrapper
│   │
│   ├── routes/                  # API routes
│   │   ├── auth.routes.ts      # /api/auth/*
│   │   ├── settings.routes.ts  # /api/settings/*
│   │   ├── meals.routes.ts     # /api/meals/*
│   │   ├── workouts.routes.ts  # /api/workouts/*
│   │   ├── logging.routes.ts   # /api/logging/*
│   │   ├── swapping.routes.ts  # /api/swapping/*
│   │   ├── weekly.routes.ts    # /api/weekly/*
│   │   ├── progress.routes.ts  # /api/progress/*
│   │   ├── history.routes.ts   # /api/history/*
│   │   └── sync.routes.ts      # /api/sync/*
│   │
│   ├── controllers/             # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── settings.controller.ts
│   │   ├── meals.controller.ts
│   │   ├── workouts.controller.ts
│   │   ├── logging.controller.ts
│   │   ├── swapping.controller.ts
│   │   ├── weekly.controller.ts
│   │   ├── progress.controller.ts
│   │   ├── history.controller.ts
│   │   └── sync.controller.ts
│   │
│   ├── services/                # Business logic
│   │   ├── ai/
│   │   │   ├── mealGeneration.service.ts
│   │   │   ├── workoutGeneration.service.ts
│   │   │   ├── mealParsing.service.ts
│   │   │   ├── workoutParsing.service.ts
│   │   │   └── insights.service.ts
│   │   ├── auth.service.ts
│   │   ├── settings.service.ts
│   │   ├── meals.service.ts
│   │   ├── workouts.service.ts
│   │   ├── logging.service.ts
│   │   ├── swapping.service.ts
│   │   ├── weekly.service.ts
│   │   ├── progress.service.ts
│   │   ├── history.service.ts
│   │   ├── sync.service.ts
│   │   └── webhooks.service.ts
│   │
│   ├── models/                  # Data models (Prisma-generated + extensions)
│   │   ├── user.model.ts
│   │   ├── mealPlan.model.ts
│   │   └── ...
│   │
│   ├── utils/                   # Utility functions
│   │   ├── calculations/
│   │   │   ├── bmr.ts          # BMR calculation
│   │   │   ├── tdee.ts         # TDEE calculation
│   │   │   ├── macros.ts       # Macro distribution
│   │   │   └── met.ts          # MET-based calorie estimation
│   │   ├── validation/
│   │   │   ├── schemas.ts      # Zod schemas
│   │   │   └── validators.ts   # Custom validators
│   │   ├── errors/
│   │   │   ├── AppError.ts     # Custom error class
│   │   │   └── errorCodes.ts   # Error code constants
│   │   ├── logger.ts           # Pino logger wrapper
│   │   └── retry.ts            # Retry logic with exponential backoff
│   │
│   ├── jobs/                    # Background jobs (Render Cron)
│   │   ├── weeklyMealRegen.job.ts
│   │   ├── streakEvaluation.job.ts
│   │   ├── achievementCheck.job.ts
│   │   └── insightGeneration.job.ts
│   │
│   ├── types/                   # TypeScript types/interfaces
│   │   ├── api.types.ts        # API request/response types
│   │   ├── ai.types.ts         # OpenAI types
│   │   └── common.types.ts     # Shared types
│   │
│   ├── constants/               # Constants
│   │   ├── achievements.ts     # 25 achievement definitions
│   │   ├── workoutLibrary.ts   # 200-500 pre-built workouts
│   │   └── errors.ts           # Error messages
│   │
│   └── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── migrations/              # Migration history
│   └── seed.ts                  # Seed data (achievements, workouts)
│
├── tests/                       # Tests
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── .env.example                 # Environment variables template
├── .eslintrc.js                 # ESLint config
├── .prettierrc                  # Prettier config
├── tsconfig.json                # TypeScript config
├── jest.config.js               # Jest config
└── package.json
```

### API Design Patterns

**RESTful Conventions:**
- Resources as nouns: `/api/meals`, `/api/workouts`, `/api/logging`
- HTTP methods: GET (read), POST (create), PUT (update), DELETE (delete)
- Plural resource names: `/api/meals` not `/api/meal`
- Nested resources: `/api/meals/:mealId/swap`
- Query params for filtering: `/api/history/week?startDate=2025-11-07`

**Request/Response Format:**
```typescript
// Request
{
  "data": { /* payload */ },
  "meta": { /* optional metadata */ }
}

// Success Response (200, 201)
{
  "success": true,
  "data": { /* response data */ },
  "meta": {
    "timestamp": "2025-11-07T14:30:00Z",
    "requestId": "req_abc123"
  }
}

// Error Response (4xx, 5xx)
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid meal data",
    "details": [
      { "field": "calories", "message": "Must be positive" }
    ]
  },
  "meta": {
    "timestamp": "2025-11-07T14:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### Authentication Flow

**1. User Sign-In (Mobile):**
```
User → Firebase Auth (Google/Apple Sign-In)
     → Firebase returns Firebase JWT
     → Mobile sends Firebase JWT to backend /api/auth/login
```

**2. Backend Validates & Issues JWT:**
```typescript
// Middleware: auth.ts
1. Extract Firebase JWT from Authorization header
2. Validate with Firebase Admin SDK
3. Extract user info (uid, email)
4. Check if user exists in PostgreSQL (if not, create)
5. Generate custom JWT (7-day expiry)
6. Return custom JWT + user profile

// Custom JWT payload:
{
  userId: "uuid",
  email: "user@example.com",
  iat: 1699372800,
  exp: 1699977600  // 7 days later
}
```

**3. Mobile Stores JWT:**
```typescript
// SecureStore (encrypted)
import * as SecureStore from 'expo-secure-store';
await SecureStore.setItemAsync('jwt', token);
```

**4. API Requests:**
```typescript
// Axios interceptor adds JWT to all requests
axios.interceptors.request.use((config) => {
  const token = await SecureStore.getItemAsync('jwt');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**5. JWT Refresh (7 days before expiry):**
```
Mobile detects JWT expires in <24h
  → Call /api/auth/refresh with current JWT
  → Backend validates + issues new 7-day JWT
  → Mobile stores new JWT
```

**6. JWT Validation Middleware:**
```typescript
// Every protected route uses auth middleware
router.get('/api/meals/current-week', authenticate, getMealPlan);

// authenticate middleware:
1. Extract JWT from Authorization header
2. Verify JWT signature with secret
3. Check expiry
4. Attach user to req.user
5. If invalid: return 401 Unauthorized
```

### Database Connection Pooling

**Render.com Managed Pooling:**
- Render.com PostgreSQL includes connection pooling on paid plans ($7/month)
- Max connections: 22 (Starter tier)
- Sufficient for MVP (<10K users)

**Prisma Configuration:**
```typescript
// src/config/database.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Connection pool settings (via DATABASE_URL)
// postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=30
```

**Post-MVP Scaling (pgBouncer):**
- If connections exceed 22, add pgBouncer layer
- Cost: ~$5-10/month (separate Render service)
- Provides 100+ connections

### Logging Strategy

**Structured Logging with pino:**
```typescript
// src/utils/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

// Usage in services:
logger.info({ userId, mealId }, 'Meal generated');
logger.error({ error, userId }, 'AI generation failed');
```

**HTTP Request Logging:**
```typescript
// src/middleware/requestLogger.ts
import pinoHttp from 'pino-http';

export const httpLogger = pinoHttp({
  logger,
  customLogLevel: (res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      userId: req.user?.userId,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

// Apply to Express:
app.use(httpLogger);
```

**Log Levels:**
- `error`: Exceptions, failures (send to Sentry)
- `warn`: Degraded performance, retries
- `info`: Important events (login, plan generation)
- `debug`: Detailed debugging (development only)

### Error Handling Middleware

**Global Error Handler:**
```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors/AppError';
import * as Sentry from '@sentry/node';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error({
    error: err.message,
    stack: err.stack,
    userId: req.user?.userId,
    url: req.url,
  });

  // Send to Sentry (production only)
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(err);
  }

  // Custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.id,
      },
    });
  }

  // Unexpected errors (500)
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.id,
    },
  });
};

// Apply to Express (LAST middleware):
app.use(errorHandler);
```

**Custom Error Class:**
```typescript
// src/utils/errors/AppError.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    public message: string,
    public details?: any[]
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Usage in services:
throw new AppError(400, 'VALIDATION_ERROR', 'Invalid meal data', [
  { field: 'calories', message: 'Must be positive' }
]);
```

### Rate Limiting

**Token Bucket Algorithm:**
```typescript
// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis';

// Per-user limits (different buckets per endpoint type)
export const aiRateLimiter = rateLimit({
  store: new RedisStore({ client: redis }),
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 AI requests per minute
  keyGenerator: (req) => req.user.userId,
  message: 'Too many AI requests, please try again later',
});

export const writeRateLimiter = rateLimit({
  store: new RedisStore({ client: redis }),
  windowMs: 60 * 1000,
  max: 30, // 30 write requests per minute
  keyGenerator: (req) => req.user.userId,
});

export const readRateLimiter = rateLimit({
  store: new RedisStore({ client: redis }),
  windowMs: 60 * 1000,
  max: 60, // 60 read requests per minute
  keyGenerator: (req) => req.user.userId,
});

// Apply to routes:
router.post('/api/meals/generate', authenticate, aiRateLimiter, generateMeal);
router.post('/api/logging/meal', authenticate, writeRateLimiter, logMeal);
router.get('/api/meals/current-week', authenticate, readRateLimiter, getMeals);
```

---

## Mobile App Architecture

### Folder Structure

```
mobile/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── buttons/
│   │   │   ├── PrimaryButton.tsx
│   │   │   ├── SecondaryButton.tsx
│   │   │   └── index.ts
│   │   ├── cards/
│   │   │   ├── MealCard.tsx
│   │   │   ├── WorkoutCard.tsx
│   │   │   ├── GlassCard.tsx   # Glassmorphism base
│   │   │   └── index.ts
│   │   ├── inputs/
│   │   │   ├── TextInput.tsx
│   │   │   ├── ScrollPicker.tsx
│   │   │   └── index.ts
│   │   ├── modals/
│   │   │   ├── BaseModal.tsx
│   │   │   ├── ConfirmModal.tsx
│   │   │   └── index.ts
│   │   ├── progress/
│   │   │   ├── RussianDollCircles.tsx
│   │   │   ├── SegmentedTimeCircle.tsx
│   │   │   └── index.ts
│   │   └── shared/
│   │       ├── LoadingSpinner.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── index.ts
│   │
│   ├── screens/                 # Screen components
│   │   ├── onboarding/
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── GoalTypeScreen.tsx
│   │   │   ├── PersonalDetailsScreen.tsx
│   │   │   └── ... (17 onboarding screens)
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── MealDetailScreen.tsx
│   │   │   ├── WorkoutDetailScreen.tsx
│   │   │   └── index.ts
│   │   ├── log/
│   │   │   ├── LogScreen.tsx
│   │   │   ├── MealConfirmationScreen.tsx
│   │   │   ├── WorkoutConfirmationScreen.tsx
│   │   │   └── index.ts
│   │   ├── progress/
│   │   │   ├── ProgressScreen.tsx
│   │   │   ├── WeightGraphScreen.tsx
│   │   │   ├── AchievementsScreen.tsx
│   │   │   └── index.ts
│   │   ├── history/
│   │   │   └── HistoryScreen.tsx
│   │   ├── saved/
│   │   │   └── SavedScreen.tsx
│   │   ├── settings/
│   │   │   ├── SettingsScreen.tsx
│   │   │   ├── ProfileEditScreen.tsx
│   │   │   ├── AccountScreen.tsx
│   │   │   └── index.ts
│   │   └── weekly/
│   │       ├── WeeklyPlanningScreen.tsx
│   │       ├── GroceryListScreen.tsx
│   │       └── index.ts
│   │
│   ├── navigation/              # Navigation setup
│   │   ├── RootNavigator.tsx   # Root stack (Auth vs Main)
│   │   ├── AuthNavigator.tsx   # Onboarding flow
│   │   ├── MainNavigator.tsx   # 3-tab bottom nav
│   │   ├── types.ts            # Navigation types
│   │   └── linking.ts          # Deep linking config
│   │
│   ├── services/                # API and business logic
│   │   ├── api/
│   │   │   ├── client.ts       # Axios instance with interceptors
│   │   │   ├── auth.api.ts
│   │   │   ├── meals.api.ts
│   │   │   ├── workouts.api.ts
│   │   │   ├── logging.api.ts
│   │   │   ├── swapping.api.ts
│   │   │   ├── weekly.api.ts
│   │   │   ├── progress.api.ts
│   │   │   ├── history.api.ts
│   │   │   ├── sync.api.ts
│   │   │   └── index.ts
│   │   ├── auth/
│   │   │   ├── firebase.ts     # Firebase Auth setup
│   │   │   └── storage.ts      # JWT storage (SecureStore)
│   │   ├── offline/
│   │   │   ├── database.ts     # SQLite + Drizzle setup
│   │   │   ├── syncQueue.ts    # Sync queue management
│   │   │   ├── cache.ts        # Cache management
│   │   │   └── network.ts      # Network detection
│   │   └── notifications/
│   │       └── pushNotifications.ts
│   │
│   ├── store/                   # State management
│   │   ├── query/
│   │   │   ├── queryClient.ts  # TanStack Query setup
│   │   │   ├── hooks/          # React Query hooks
│   │   │   │   ├── useMeals.ts
│   │   │   │   ├── useWorkouts.ts
│   │   │   │   ├── useLogging.ts
│   │   │   │   └── ...
│   │   │   └── keys.ts         # Query key constants
│   │   └── zustand/
│   │       ├── authStore.ts    # Auth state
│   │       ├── uiStore.ts      # UI state (modals, theme)
│   │       └── preferencesStore.ts
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useNetwork.ts
│   │   ├── useSync.ts
│   │   └── useTheme.ts
│   │
│   ├── utils/                   # Utility functions
│   │   ├── calculations/
│   │   │   ├── bmr.ts
│   │   │   ├── tdee.ts
│   │   │   ├── macros.ts
│   │   │   └── met.ts
│   │   ├── validation/
│   │   │   ├── schemas.ts      # Zod schemas
│   │   │   └── validators.ts
│   │   ├── formatting/
│   │   │   ├── date.ts
│   │   │   ├── number.ts
│   │   │   └── units.ts
│   │   ├── animations/
│   │   │   ├── transitions.ts  # Reanimated configs
│   │   │   └── springs.ts
│   │   └── helpers/
│   │       ├── colors.ts
│   │       ├── storage.ts
│   │       └── logger.ts
│   │
│   ├── types/                   # TypeScript types
│   │   ├── api.types.ts
│   │   ├── models.types.ts
│   │   └── navigation.types.ts
│   │
│   ├── constants/               # Constants
│   │   ├── tokens.ts           # Design tokens
│   │   ├── config.ts           # App config
│   │   └── routes.ts           # Route names
│   │
│   ├── assets/                  # Static assets
│   │   ├── fonts/
│   │   ├── images/
│   │   └── icons/
│   │
│   └── App.tsx                  # App entry point
│
├── app.json                     # Expo config
├── babel.config.js
├── tsconfig.json
├── metro.config.js
├── jest.config.js
└── package.json
```

### Component Hierarchy

**Component Structure Pattern:**
```typescript
// src/components/cards/MealCard.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { tokens } from '../../constants/tokens';

interface MealCardProps {
  meal: Meal;
  onPress: () => void;
  testID?: string;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onPress, testID }) => {
  // 1. State & hooks
  const [pressed, setPressed] = React.useState(false);

  // 2. Animations
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(pressed ? 0.98 : 1) }],
  }));

  // 3. Render
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={onPress}
        testID={testID}
      >
        {/* Content */}
      </Pressable>
    </Animated.View>
  );
};

// 4. Styles
const styles = {
  container: {
    // Use design tokens
    backgroundColor: tokens.colors.glass.white,
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.md,
  },
};
```

### Navigation Structure

**3-Tab Bottom Navigation:**
```typescript
// src/navigation/MainNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tokens.colors.glass.white,
          borderTopWidth: 0,
          elevation: 0,
          height: 80,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Log"
        component={LogNavigator}
        options={{
          tabBarIcon: ({ focused }) => <LogIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressNavigator}
        options={{
          tabBarIcon: ({ focused }) => <ProgressIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};
```

**Modal Navigation:**
```typescript
// Root stack with modals
const RootStack = createStackNavigator();

export const RootNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Main" component={MainNavigator} />

      {/* Modals */}
      <RootStack.Group screenOptions={{ presentation: 'modal' }}>
        <RootStack.Screen name="MealSwap" component={MealSwapModal} />
        <RootStack.Screen name="WorkoutSwap" component={WorkoutSwapModal} />
        <RootStack.Screen name="AILogging" component={AILoggingModal} />
        <RootStack.Screen name="WeeklyPlanning" component={WeeklyPlanningModal} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};
```

### State Management Patterns

**TanStack Query (Server State):**
```typescript
// src/store/query/hooks/useMeals.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mealsApi } from '../../../services/api/meals.api';
import { queryKeys } from '../keys';

export const useMealPlan = (weekStart: string) => {
  return useQuery({
    queryKey: queryKeys.meals.week(weekStart),
    queryFn: () => mealsApi.getCurrentWeek(weekStart),
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useLogMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mealsApi.logMeal,
    onMutate: async (newMeal) => {
      // Optimistic update
      await queryClient.cancelQueries(queryKeys.meals.today);
      const previous = queryClient.getQueryData(queryKeys.meals.today);
      queryClient.setQueryData(queryKeys.meals.today, (old) => [...old, newMeal]);
      return { previous };
    },
    onError: (err, newMeal, context) => {
      // Rollback on error
      queryClient.setQueryData(queryKeys.meals.today, context.previous);
    },
    onSuccess: () => {
      // Invalidate cache
      queryClient.invalidateQueries(queryKeys.meals.today);
    },
  });
};
```

**TanStack Query Persistence:**
```typescript
// src/store/query/queryClient.ts
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'query-cache' });

const mmkvPersister = createAsyncStoragePersister({
  storage: {
    getItem: (key) => storage.getString(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes default
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Persist query cache to MMKV
persistQueryClient({
  queryClient,
  persister: mmkvPersister,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
});
```

**Zustand (UI State):**
```typescript
// src/store/zustand/uiStore.ts
import { create } from 'zustand';

interface UIState {
  // Modal state
  isSwapModalOpen: boolean;
  swapModalData: SwapModalData | null;
  openSwapModal: (data: SwapModalData) => void;
  closeSwapModal: () => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Offline banner
  isOffline: boolean;
  setOffline: (offline: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSwapModalOpen: false,
  swapModalData: null,
  openSwapModal: (data) => set({ isSwapModalOpen: true, swapModalData: data }),
  closeSwapModal: () => set({ isSwapModalOpen: false, swapModalData: null }),

  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  isOffline: false,
  setOffline: (offline) => set({ isOffline: offline }),
}));
```

### API Service Layer

**Axios Client Setup:**
```typescript
// src/services/api/client.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useUIStore } from '../../store/zustand/uiStore';

const API_URL = process.env.API_URL || 'http://localhost:3000';
const API_TIMEOUT = 30000; // 30 seconds

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add JWT)
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handle errors, refresh JWT)
apiClient.interceptors.response.use(
  (response) => response.data, // Return data directly
  async (error) => {
    const originalRequest = error.config;

    // 401: JWT expired, refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshJWT();
        await SecureStore.setItemAsync('jwt', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        await logout();
        return Promise.reject(refreshError);
      }
    }

    // Network error: mark offline
    if (error.code === 'ERR_NETWORK') {
      useUIStore.getState().setOffline(true);
    }

    return Promise.reject(error);
  }
);
```

**API Service Example:**
```typescript
// src/services/api/meals.api.ts
import { apiClient } from './client';
import { MealPlan, Meal, SwapRequest } from '../../types/api.types';

export const mealsApi = {
  getCurrentWeek: async (weekStart: string): Promise<MealPlan> => {
    return apiClient.get(`/api/meals/current-week?weekStart=${weekStart}`);
  },

  swapMeal: async (data: SwapRequest): Promise<Meal> => {
    return apiClient.post('/api/meals/swap', data);
  },

  generateAlternatives: async (mealId: string): Promise<Meal[]> => {
    return apiClient.post('/api/meals/generate-alternatives', { mealId });
  },

  undoSwap: async (mealId: string): Promise<void> => {
    return apiClient.post(`/api/meals/${mealId}/undo`);
  },
};
```

### Offline Sync Architecture

**SQLite + Drizzle Setup:**
```typescript
// src/services/offline/database.ts
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

const expo = SQLite.openDatabase('weightgpt.db');
export const db = drizzle(expo, { schema });

// Schema example
// src/services/offline/schema.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const syncQueue = sqliteTable('sync_queue', {
  id: text('id').primaryKey(),
  action: text('action').notNull(), // 'create', 'update', 'delete'
  resource: text('resource').notNull(), // 'meal', 'workout', 'weight'
  payload: text('payload').notNull(), // JSON
  priority: integer('priority').notNull(), // 0-3 (critical to low)
  dependsOn: text('depends_on'), // ID of parent action
  attempts: integer('attempts').default(0),
  createdAt: integer('created_at').notNull(),
});

export const cachedMeals = sqliteTable('cached_meals', {
  id: text('id').primaryKey(),
  data: text('data').notNull(), // JSON
  cachedAt: integer('cached_at').notNull(),
  expiresAt: integer('expires_at').notNull(),
});
```

**Sync Queue Management:**
```typescript
// src/services/offline/syncQueue.ts
import { db } from './database';
import { syncQueue } from './schema';
import { apiClient } from '../api/client';
import { eq, and, isNull } from 'drizzle-orm';

export const syncManager = {
  // Add action to queue
  enqueue: async (action: SyncAction) => {
    await db.insert(syncQueue).values({
      id: generateId(),
      action: action.type,
      resource: action.resource,
      payload: JSON.stringify(action.payload),
      priority: action.priority,
      dependsOn: action.dependsOn,
      attempts: 0,
      createdAt: Date.now(),
    });
  },

  // Process queue (FIFO within priority)
  processQueue: async () => {
    // Get actions with no blocking dependencies
    const actions = await db
      .select()
      .from(syncQueue)
      .where(isNull(syncQueue.dependsOn))
      .orderBy(syncQueue.priority, syncQueue.createdAt)
      .limit(10);

    for (const action of actions) {
      try {
        // Send to API
        await apiClient.post('/api/sync/batch', {
          action: action.action,
          resource: action.resource,
          payload: JSON.parse(action.payload),
        });

        // Success: remove from queue
        await db.delete(syncQueue).where(eq(syncQueue.id, action.id));

        // Unblock dependent actions
        await db
          .update(syncQueue)
          .set({ dependsOn: null })
          .where(eq(syncQueue.dependsOn, action.id));
      } catch (error) {
        // Failure: increment attempts
        await db
          .update(syncQueue)
          .set({ attempts: action.attempts + 1 })
          .where(eq(syncQueue.id, action.id));

        // After 3 failures, deprioritize
        if (action.attempts >= 3) {
          await db
            .update(syncQueue)
            .set({ priority: 3 }) // Low priority
            .where(eq(syncQueue.id, action.id));
        }
      }
    }
  },
};
```

### Push Notification Handling

**Setup:**
```typescript
// src/services/notifications/pushNotifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  // Request permissions
  requestPermissions: async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return false;
    }

    // Get push token
    const token = await Notifications.getExpoPushTokenAsync();

    // Send to backend
    await apiClient.post('/api/notifications/register', {
      token: token.data,
      platform: Platform.OS,
    });

    return true;
  },

  // Handle notification tap
  setupNotificationListeners: () => {
    // Foreground notification
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    // Notification tap
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;

      // Navigate based on notification type
      if (data.type === 'weekly_reset') {
        navigation.navigate('WeeklyPlanning');
      } else if (data.type === 'achievement') {
        navigation.navigate('Progress', { tab: 'achievements' });
      }
    });
  },

  // Schedule local notification
  scheduleLocal: async (title: string, body: string, trigger: Date) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { date: trigger },
    });
  },
};
```

---

## Deployment Architecture

### Backend Deployment (Render.com)

**Render.com Services:**
```yaml
# render.yaml
services:
  # Node.js API
  - type: web
    name: weightgpt-api
    env: node
    region: oregon
    plan: starter # $7/month
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: weightgpt-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: OPENAI_API_KEY
        sync: false # Set manually
    healthCheckPath: /health

  # PostgreSQL Database
  - type: pserv
    name: weightgpt-db
    plan: starter # $7/month
    databaseName: weightgpt
    region: oregon
```

**Environment Management:**
```bash
# Development (.env.development)
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/weightgpt_dev
API_URL=http://localhost:3000
LOG_LEVEL=debug

# Staging (.env.staging)
NODE_ENV=staging
DATABASE_URL=postgresql://... # Render staging DB
API_URL=https://staging-api.weightgpt.com
LOG_LEVEL=info

# Production (.env.production)
NODE_ENV=production
DATABASE_URL=postgresql://... # Render production DB
API_URL=https://api.weightgpt.com
LOG_LEVEL=warn
```

**Health Check Endpoint:**
```typescript
// src/routes/health.ts
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});
```

### Mobile Deployment (Expo EAS)

**EAS Build Configuration:**
```json
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production",
      "ios": {
        "bundleIdentifier": "com.weightgpt.app"
      },
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "webb@example.com",
        "ascAppId": "123456789",
        "appleTeamId": "ABCD123"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

**Build Commands:**
```bash
# Development build (local simulator)
eas build --profile development --platform ios --local

# Preview build (TestFlight/Internal Testing)
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

**OTA Updates (EAS Update):**
```bash
# Publish update to preview channel
eas update --branch preview --message "Fix meal swap bug"

# Publish update to production channel
eas update --branch production --message "Add new achievement badges"

# Users get updates on next app launch (0-5 minutes deployment)
```

**Update Strategy:**
- **JS-only changes:** OTA updates (instant deployment)
- **Native module changes:** App Store submission required (7-10 days)
- **Critical bug fixes:** OTA update → App Store update with expedited review

### CI/CD Pipeline (GitHub Actions)

**Workflow Example:**
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  backend-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - run: cd backend && npm run test
      - run: cd backend && npm run build
      # Render auto-deploys on push to main

  mobile-ota-update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd mobile && npm ci
      - run: cd mobile && npm run test
      - run: cd mobile && npx eas-cli update --branch production --message "Auto-deploy from GitHub"
```

### Monitoring & Alerts

**Sentry Configuration:**
```typescript
// Backend
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
  ],
});

// Mobile
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.ENV,
  tracesSampleRate: 0.1,
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 10000,
});
```

**PostHog Analytics:**
```typescript
// Mobile
import PostHog from 'posthog-react-native';

const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: 'https://app.posthog.com',
});

// Track events
posthog.capture('meal_logged', {
  mealType: 'lunch',
  calories: 650,
  method: 'ai_parsing',
});

// Feature flags
const showNewFeature = await posthog.isFeatureEnabled('new-workout-ui');
```

---

## Security Architecture

### Authentication Flow (Detailed)

**Complete Flow Diagram:**
```
User Opens App
├─ Has valid JWT in SecureStore?
│  ├─ YES → Validate expiry
│  │  ├─ Still valid → Navigate to Home
│  │  └─ Expired → Refresh JWT → Home
│  └─ NO → Show Onboarding/Login
│
User Taps "Sign in with Google"
├─ Firebase Auth initiates OAuth flow
├─ User authenticates with Google
├─ Firebase returns Firebase JWT (idToken)
├─ Mobile sends idToken to backend /api/auth/login
│
Backend /api/auth/login
├─ Validate Firebase JWT with Admin SDK
├─ Extract user info (uid, email, displayName)
├─ Check if user exists in PostgreSQL
│  ├─ NO → Create user record
│  └─ YES → Fetch user profile
├─ Generate custom JWT (7-day expiry)
│  └─ Payload: { userId, email, iat, exp }
├─ Return { jwt, user }
│
Mobile receives JWT
├─ Store in SecureStore (encrypted)
├─ Set up Axios interceptor (add to all requests)
├─ Navigate to Home
│
Every API Request
├─ Axios interceptor adds: Authorization: Bearer <jwt>
├─ Backend auth middleware validates JWT
│  ├─ Valid → Attach user to req.user → Continue
│  └─ Invalid → Return 401 → Mobile refreshes JWT
│
JWT Refresh (when <24h until expiry)
├─ Mobile calls /api/auth/refresh with current JWT
├─ Backend validates current JWT
├─ Issues new 7-day JWT
├─ Mobile stores new JWT in SecureStore
```

**Firebase JWT Validation:**
```typescript
// Backend: src/middleware/auth.ts
import { auth as firebaseAuth } from '../config/firebase';

export const authenticate = async (req, res, next) => {
  try {
    // Extract JWT from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'AUTH_REQUIRED', 'No authorization token');
    }

    const token = authHeader.split(' ')[1];

    // Validate JWT signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new AppError(401, 'USER_NOT_FOUND', 'User does not exist');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'JWT has expired',
        },
      });
    }
    next(error);
  }
};
```

### API Key Management

**Environment Variables:**
```bash
# Backend .env
OPENAI_API_KEY=sk-proj-...      # OpenAI API key
JWT_SECRET=<generated-secret>    # JWT signing secret
FIREBASE_PROJECT_ID=weightgpt    # Firebase project
REVENUECAT_WEBHOOK_SECRET=...    # RevenueCat webhook verification
SENTRY_DSN=...                   # Sentry error tracking
POSTHOG_API_KEY=...              # PostHog analytics

# Mobile .env
API_URL=https://api.weightgpt.com
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
REVENUECAT_PUBLIC_KEY=...
SENTRY_DSN=...
POSTHOG_API_KEY=...
```

**Secure Storage:**
- Backend: Environment variables (never commit .env to git)
- Mobile: `expo-constants` for build-time config, `expo-secure-store` for runtime secrets

### HTTPS Enforcement

**Backend:**
```typescript
// Redirect HTTP to HTTPS (production only)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

**Mobile:**
- Expo automatically uses HTTPS for all network requests
- No additional configuration needed

### Data Encryption

**At Rest:**
- PostgreSQL: Encrypted at rest (Render.com default)
- Mobile SQLite: Device-level encryption (iOS Keychain, Android Keystore)
- SecureStore: Hardware-backed encryption

**In Transit:**
- All API calls over HTTPS (TLS 1.3)
- Certificate pinning: Deferred to post-MVP (maintenance burden)

### GDPR Compliance

**Data Export:**
```typescript
// Backend: /api/settings/export-data
export const exportUserData = async (userId: string) => {
  // Fetch all user data
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const meals = await prisma.loggedMeal.findMany({ where: { userId } });
  const workouts = await prisma.loggedWorkout.findMany({ where: { userId } });
  const weight = await prisma.weightEntry.findMany({ where: { userId } });

  // Generate JSON export
  const exportData = {
    user,
    meals,
    workouts,
    weightHistory: weight,
    exportedAt: new Date().toISOString(),
  };

  // Create downloadable file
  return exportData;
};
```

**Account Deletion:**
```typescript
// 30-day grace period
export const deleteAccount = async (userId: string) => {
  // Soft delete (mark for deletion)
  await prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
      scheduledDeletionDate: addDays(new Date(), 30),
    },
  });

  // Background job (runs daily):
  // - Find users with scheduledDeletionDate < today
  // - Hard delete all user data (cascade)
};
```

---

## Performance Architecture

### Caching Strategy

**Backend Caching (Redis - Post-MVP):**
```typescript
// Cache GET requests with TTL
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

const cacheMiddleware = (ttl: number) => async (req, res, next) => {
  if (req.method !== 'GET') return next();

  const key = `cache:${req.url}:${req.user.userId}`;
  const cached = await redis.get(key);

  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // Override res.json to cache response
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    redis.setex(key, ttl, JSON.stringify(data));
    return originalJson(data);
  };

  next();
};

// Apply to routes:
router.get('/api/meals/current-week', authenticate, cacheMiddleware(3600), getMealPlan);
```

**Mobile Caching (TanStack Query):**
```typescript
// Automatic caching per query
export const useMealPlan = () => {
  return useQuery({
    queryKey: ['meals', 'current-week'],
    queryFn: fetchMealPlan,
    staleTime: 1000 * 60 * 60, // 1 hour (don't refetch if <1h old)
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours (keep in cache)
  });
};

// Cache invalidation on mutations
const logMealMutation = useMutation({
  mutationFn: logMeal,
  onSuccess: () => {
    queryClient.invalidateQueries(['meals', 'current-week']);
    queryClient.invalidateQueries(['progress', 'today']);
  },
});
```

### Database Query Optimization

**Indexes (from DATABASE_SCHEMA.md):**
- All foreign keys indexed
- Composite indexes on frequent queries:
  - `(user_id, date)` on logged_meals, logged_workouts
  - `(user_id, week_start)` on meal_plans, workout_plans
  - `(user_id, priority, created_at)` on sync_queue

**Query Examples:**
```sql
-- Optimized: Uses composite index (user_id, date)
SELECT * FROM logged_meals
WHERE user_id = 'user-123'
  AND date >= '2025-11-07'
  AND date < '2025-11-14'
ORDER BY date ASC;

-- Avoid N+1: Use JOIN instead of separate queries
SELECT u.*, mp.*, wl.*
FROM users u
LEFT JOIN meal_plans mp ON u.id = mp.user_id AND mp.week_start = '2025-11-07'
LEFT JOIN workout_plans wl ON u.id = wl.user_id AND wl.week_start = '2025-11-07'
WHERE u.id = 'user-123';
```

**Prisma Query Optimization:**
```typescript
// Include related data in single query (avoid N+1)
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    mealPlan: {
      where: { weekStart: '2025-11-07' },
      include: { meals: true },
    },
    workoutPlan: {
      where: { weekStart: '2025-11-07' },
      include: { workouts: true },
    },
  },
});
```

### API Response Compression

**gzip Compression:**
```typescript
import compression from 'compression';

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Compression level (0-9)
}));

// Reduces response size by 70-90% for JSON
```

### Image Optimization

**Expo Image:**
```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: 'https://example.com/meal.jpg' }}
  placeholder={blurhash}         // Show placeholder while loading
  contentFit="cover"
  transition={300}                // Smooth fade-in
  cachePolicy="memory-disk"       // Cache to disk
/>
```

**CDN (Future):**
- Images served from CDN (Cloudflare, Vercel)
- WebP/AVIF formats for smaller file sizes
- Responsive images (multiple sizes)

### Lazy Loading

**React Navigation:**
```typescript
// Lazy load screens (not included in initial bundle)
const HomeScreen = lazy(() => import('./screens/home/HomeScreen'));
const ProgressScreen = lazy(() => import('./screens/progress/ProgressScreen'));

<Suspense fallback={<LoadingSpinner />}>
  <Stack.Screen name="Home" component={HomeScreen} />
</Suspense>
```

**TanStack Query Prefetching:**
```typescript
// Prefetch next screen's data while user views current screen
const prefetchNextWeek = () => {
  queryClient.prefetchQuery({
    queryKey: ['meals', 'week', nextWeekStart],
    queryFn: () => fetchMealPlan(nextWeekStart),
  });
};

// Trigger on swipe gesture or button hover
```

---

## Data Flow Architecture

### Request-Response Flow

**1. User Logs Meal (AI Parsing):**
```
User types "Chicken breast with rice" in Log tab
  ↓
Mobile: useMutation (logMeal)
  ├─ Optimistic update: Add meal to UI immediately
  ├─ Send POST /api/logging/meal { text: "Chicken breast with rice" }
  ↓
Backend: /api/logging/meal
  ├─ Validate request (Zod schema)
  ├─ Call OpenAI API (GPT-4o-mini)
  │  ├─ Circuit breaker: Check if OpenAI healthy
  │  ├─ Send prompt + user input
  │  ├─ Receive structured JSON response
  │  ├─ Validate response (Zod schema)
  │  └─ Return parsed meal
  ├─ Store in logged_meals table
  ├─ Update daily totals (calories, macros)
  ├─ Return { meal, needsFollowUp }
  ↓
Mobile: onSuccess
  ├─ If needsFollowUp: Show follow-up modal
  ├─ Else: Show confirmation screen
  ├─ Invalidate queries: ['meals', 'today'], ['progress']
  ├─ TanStack Query refetches updated data
  └─ UI updates with real data (replace optimistic)
```

**2. User Swaps Meal:**
```
User taps "Swap" on lunch meal
  ↓
Mobile: Open MealSwapModal
  ├─ Show loading spinner
  ├─ Call POST /api/meals/generate-alternatives { mealId }
  ↓
Backend: /api/meals/generate-alternatives
  ├─ Fetch current meal from database
  ├─ Get user's dietary preferences
  ├─ Call OpenAI API with constraints (macros, restrictions)
  │  ├─ Generate 3 alternative meals
  │  ├─ Each within ±50 cal, ±5g protein
  │  └─ Validate all responses
  ├─ Return { alternatives: [meal1, meal2, meal3] }
  ↓
Mobile: Display alternatives
  ├─ User selects alternative
  ├─ Call POST /api/meals/swap { mealId, newMealId }
  ↓
Backend: /api/meals/swap
  ├─ Start transaction
  ├─ Update meal_plan (replace meal)
  ├─ Update version field (optimistic locking)
  ├─ Recalculate daily totals
  ├─ Create swap_history entry
  ├─ Commit transaction
  ├─ Return { updatedMeal, updatedPlan }
  ↓
Mobile: onSuccess
  ├─ Show 3-second undo toast
  ├─ Invalidate query: ['meals', 'current-week']
  ├─ TanStack Query refetches meal plan
  └─ UI updates with swapped meal
```

### Offline-First Flow

**Logging Meal While Offline:**
```
User offline, types "Chicken salad"
  ↓
Mobile: Detect network offline (NetInfo)
  ├─ Show "You're offline" banner
  ├─ Disable AI parsing button (OpenAI unavailable)
  ├─ Show manual entry form
  ↓
User fills manual form (meal type, calories, protein, carbs, fat)
  ↓
Mobile: useMutation (logMeal)
  ├─ Store in local SQLite (logged_meals table)
  ├─ Add to sync_queue (priority: high)
  ├─ Update UI immediately (optimistic)
  └─ No network request
  ↓
User reconnects to internet
  ↓
Mobile: NetInfo detects connection
  ├─ Hide "You're offline" banner
  ├─ Show "Syncing..." toast
  ├─ Process sync queue
  │  ├─ Send POST /api/sync/batch
  │  │  └─ Payload: [{ action: 'create', resource: 'meal', data: {...} }]
  │  ↓
  │  Backend: /api/sync/batch
  │  ├─ Validate all actions
  │  ├─ Process in order (dependencies first)
  │  ├─ For each action:
  │  │  ├─ Create meal in PostgreSQL
  │  │  ├─ Return server ID + updated data
  │  ├─ Return { synced: [...], conflicts: [] }
  │  ↓
  │  Mobile: onSuccess
  │  ├─ Update SQLite (replace temp IDs with server IDs)
  │  ├─ Remove actions from sync_queue
  │  ├─ Invalidate queries
  │  └─ Show "Synced successfully" toast
```

**Conflict Resolution:**
```
User edits meal offline (mobile version = 5)
Another device edits same meal (server version = 6)
  ↓
User reconnects, sync queue processes edit
  ↓
Backend: /api/sync/batch detects version mismatch
  ├─ Server version (6) > Mobile version (5)
  ├─ Return conflict:
  │  {
  │    conflictType: 'version_mismatch',
  │    serverData: { ...meal, version: 6 },
  │    clientData: { ...meal, version: 5 },
  │  }
  ↓
Mobile: Handle conflict
  ├─ Last-write-wins: Keep server version
  ├─ Update SQLite with server data
  ├─ Remove action from sync_queue
  └─ Show toast: "Meal updated with latest data"
```

---

## AI Integration Architecture

### OpenAI API Integration

**Circuit Breaker Pattern:**
```typescript
// src/config/openai.ts
import CircuitBreaker from 'opossum';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 seconds
});

// Circuit breaker configuration
const breakerOptions = {
  timeout: 30000,        // If function takes >30s, fail
  errorThresholdPercentage: 50, // Open circuit if 50% requests fail
  resetTimeout: 60000,   // Try again after 60s
  rollingCountTimeout: 120000,  // Track errors over 2 min window
};

// Wrap OpenAI calls in circuit breaker
export const aiBreaker = new CircuitBreaker(async (prompt: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 500,
  });
  return response.choices[0].message.content;
}, breakerOptions);

// Fallback when circuit open (OpenAI down)
aiBreaker.fallback(() => {
  throw new AppError(503, 'AI_UNAVAILABLE', 'AI service temporarily unavailable');
});

// Events
aiBreaker.on('open', () => logger.warn('Circuit breaker opened'));
aiBreaker.on('halfOpen', () => logger.info('Circuit breaker half-open'));
aiBreaker.on('close', () => logger.info('Circuit breaker closed'));
```

**Graceful Degradation:**
```typescript
// Service layer handles fallback
export const mealParsingService = {
  parseWithAI: async (text: string) => {
    try {
      // Try AI parsing first
      const result = await aiBreaker.fire(generateMealPrompt(text));
      const parsed = JSON.parse(result);

      // Validate with Zod
      const validated = mealSchema.parse(parsed);
      return { meal: validated, source: 'ai' };
    } catch (error) {
      // Circuit open or AI error
      if (error.code === 'AI_UNAVAILABLE') {
        // Return signal to use manual entry
        return { meal: null, source: 'manual_required', error: error.message };
      }
      throw error;
    }
  },
};
```

### Prompt Engineering

**Meal Parsing Prompt:**
```typescript
// src/services/ai/mealParsing.service.ts
export const generateMealPrompt = (userInput: string, userPrefs: UserProfile) => {
  return `You are a nutrition assistant. Parse the following meal description into structured JSON.

User Input: "${userInput}"

User Context:
- Dietary Restrictions: ${userPrefs.dietaryRestrictions.join(', ')}
- Eating Pattern: ${userPrefs.eatingPattern} meals/day

Instructions:
1. Identify meal type (breakfast, lunch, dinner, snack)
2. List ingredients with quantities
3. Estimate calories and macros (protein, carbs, fat in grams)
4. If information is missing (portion size, preparation), set "needsFollowUp": true

Output Format (JSON only, no explanation):
{
  "mealType": "lunch",
  "name": "Chicken Caesar Salad",
  "ingredients": [
    { "name": "Chicken breast", "quantity": "6", "unit": "oz" },
    { "name": "Romaine lettuce", "quantity": "2", "unit": "cups" }
  ],
  "calories": 450,
  "protein": 45,
  "carbs": 20,
  "fat": 18,
  "needsFollowUp": false
}`;
};
```

**Zod Validation for AI Responses:**
```typescript
import { z } from 'zod';

const mealSchema = z.object({
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  name: z.string().min(1).max(100),
  ingredients: z.array(z.object({
    name: z.string(),
    quantity: z.string(),
    unit: z.string(),
  })),
  calories: z.number().int().positive().max(5000),
  protein: z.number().nonnegative().max(500),
  carbs: z.number().nonnegative().max(500),
  fat: z.number().nonnegative().max(500),
  needsFollowUp: z.boolean(),
});

// Validate AI response
try {
  const validated = mealSchema.parse(aiResponse);
  // ✅ Safe to use
} catch (error) {
  // ❌ Invalid AI response, use manual entry
  logger.error({ error, aiResponse }, 'Invalid AI response');
}
```

### Retry Logic with Exponential Backoff

```typescript
// src/utils/retry.ts
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on validation errors or 4xx
      if (error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));

      logger.warn({ attempt, delay, error: error.message }, 'Retrying request');
    }
  }

  throw lastError;
};

// Usage:
const result = await retryWithBackoff(() => openai.chat.completions.create(...));
```

### Streaming (Post-MVP)

**For Long Responses (Weekly Meal Plans):**
```typescript
const stream = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: prompt }],
  stream: true,
});

let fullResponse = '';
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  fullResponse += content;
  // Send partial response to client via WebSocket or SSE
}
```

---

## Testing Architecture

### Testing Strategy

**Test Pyramid:**
```
       /\
      /E2E\     5% - Critical user flows (Detox)
     /------\
    /  Int  \   20% - API endpoints (Supertest)
   /--------\
  /   Unit   \  75% - Utils, services, components (Jest)
 /------------\
```

### Unit Tests (Jest)

**Calculation Tests:**
```typescript
// src/utils/calculations/bmr.test.ts
import { calculateBMR } from './bmr';

describe('BMR Calculation', () => {
  it('calculates BMR correctly for male', () => {
    const result = calculateBMR({
      weight: 180,
      height: 70,
      age: 30,
      gender: 'male',
    });
    expect(result).toBeCloseTo(1887, 0); // Mifflin-St Jeor formula
  });

  it('calculates BMR correctly for female', () => {
    const result = calculateBMR({
      weight: 140,
      height: 65,
      age: 28,
      gender: 'female',
    });
    expect(result).toBeCloseTo(1401, 0);
  });

  it('throws error for invalid inputs', () => {
    expect(() => calculateBMR({ weight: -10, height: 70, age: 30, gender: 'male' }))
      .toThrow('Weight must be positive');
  });
});
```

**Component Tests (React Native Testing Library):**
```typescript
// src/components/cards/MealCard.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { MealCard } from './MealCard';

describe('MealCard', () => {
  const mockMeal = {
    id: '1',
    name: 'Chicken Salad',
    calories: 450,
    protein: 45,
    carbs: 20,
    fat: 18,
  };

  it('renders meal information', () => {
    const { getByText } = render(<MealCard meal={mockMeal} onPress={() => {}} />);

    expect(getByText('Chicken Salad')).toBeTruthy();
    expect(getByText('450 cal')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<MealCard meal={mockMeal} onPress={onPress} testID="meal-card" />);

    fireEvent.press(getByTestId('meal-card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests (Supertest)

**API Endpoint Tests:**
```typescript
// backend/tests/integration/meals.test.ts
import request from 'supertest';
import { app } from '../../src/app';
import { generateJWT } from '../helpers/auth';

describe('POST /api/meals/swap', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await generateJWT({ userId: 'test-user-123' });
  });

  it('swaps meal successfully', async () => {
    const response = await request(app)
      .post('/api/meals/swap')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        mealId: 'meal-123',
        newMealId: 'meal-456',
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.meal.id).toBe('meal-456');
  });

  it('returns 401 without auth token', async () => {
    await request(app)
      .post('/api/meals/swap')
      .send({ mealId: 'meal-123', newMealId: 'meal-456' })
      .expect(401);
  });

  it('validates request body', async () => {
    const response = await request(app)
      .post('/api/meals/swap')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ mealId: 'meal-123' }) // Missing newMealId
      .expect(400);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
```

### E2E Tests (Detox)

**Critical User Flow:**
```typescript
// mobile/e2e/offline-sync.test.ts
import { device, expect, element, by } from 'detox';

describe('Offline Sync', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await device.disableSynchronization(); // Disable for async operations
  });

  it('logs meal offline and syncs when reconnected', async () => {
    // 1. Disconnect network
    await device.setURLBlacklist(['*']);

    // 2. Navigate to Log tab
    await element(by.id('tab-log')).tap();

    // 3. Log meal manually (AI unavailable)
    await element(by.id('manual-entry-button')).tap();
    await element(by.id('meal-name-input')).typeText('Chicken Salad');
    await element(by.id('calories-input')).typeText('450');
    await element(by.id('save-button')).tap();

    // 4. Verify meal appears in UI
    await expect(element(by.text('Chicken Salad'))).toBeVisible();

    // 5. Verify "You're offline" banner
    await expect(element(by.id('offline-banner'))).toBeVisible();

    // 6. Reconnect network
    await device.setURLBlacklist([]);

    // 7. Wait for sync
    await waitFor(element(by.text('Synced successfully')))
      .toBeVisible()
      .withTimeout(10000);

    // 8. Verify meal still visible after sync
    await expect(element(by.text('Chicken Salad'))).toBeVisible();
  });
});
```

### Smoke Tests (Maestro)

**Onboarding Happy Path:**
```yaml
# mobile/e2e/maestro/onboarding.yaml
appId: com.weightgpt.app
---
- launchApp
- tapOn: "Get Started"
- tapOn: "Lose Weight"
- scrollUntilVisible:
    element: "Continue"
- tapOn: "Continue"
- tapOn: "Male"
- tapOn: "Continue"
# ... repeat for all 17 steps
- assertVisible: "Your Plan is Ready!"
```

---

## Summary

This architecture document provides a complete technical blueprint for WeightGPT implementation, covering:

✅ **Complete Tech Stack** - Frontend, backend, development tools with rationale
✅ **Backend Architecture** - Folder structure, API patterns, auth flow, middleware, logging
✅ **Mobile Architecture** - Component hierarchy, navigation, state management, offline sync
✅ **Deployment Strategy** - Render.com backend, EAS mobile builds, OTA updates, CI/CD
✅ **Security Implementation** - JWT auth, encryption, HTTPS, GDPR compliance
✅ **Performance Optimization** - Caching, query optimization, compression, lazy loading
✅ **Data Flow** - Request-response patterns, offline-first flows, conflict resolution
✅ **AI Integration** - Circuit breaker, graceful degradation, prompt engineering, validation
✅ **Testing Strategy** - Unit, integration, E2E, smoke tests with examples

**Ready for Development:** All architectural decisions documented, patterns established, flows defined. Developers can begin Phase 1 (Foundation) implementation immediately.

---

**Document Version:** 1.0
**Created:** 2025-11-07
**Last Updated:** 2025-11-07
**Status:** Complete - Ready for Review
**Next Update:** After user approval → Session 18 (Implementation Plan)