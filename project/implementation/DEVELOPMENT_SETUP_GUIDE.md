# Development Setup Guide

**Project:** WeightGPT MVP
**Document Version:** 1.0
**Status:** Active - Development Ready
**Created:** 2025-11-07
**Last Updated:** 2025-11-07

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start (TL;DR)](#quick-start-tldr)
4. [Backend Setup](#backend-setup)
5. [Mobile App Setup](#mobile-app-setup)
6. [Database Setup](#database-setup)
7. [Environment Variables](#environment-variables)
8. [Running Tests](#running-tests)
9. [Debugging](#debugging)
10. [Common Issues & Troubleshooting](#common-issues--troubleshooting)
11. [First-Time Setup Checklist](#first-time-setup-checklist)
12. [Development Workflow](#development-workflow)

---

## Overview

This guide provides complete instructions for setting up a local development environment for WeightGPT. Follow these steps to get the backend API and mobile app running on your machine.

**What You'll Set Up:**
- Backend Node.js + Express API server
- PostgreSQL database with 25 tables
- React Native + Expo mobile app
- Testing infrastructure (Jest, RNTL, Detox, Maestro)
- Debugging tools (Flipper, React Native Debugger)
- CI/CD pipeline (GitHub Actions)

**Time Required:**
- First-time setup: 2-3 hours
- Subsequent setups: 30-45 minutes

**Operating Systems Supported:**
- macOS (recommended for iOS development)
- Windows (Android only)
- Linux (Android only)

---

## Prerequisites

### Required Software

#### 1. Node.js & npm

**Version Required:** Node.js 18+ LTS

**Installation:**

**macOS (via Homebrew):**
```bash
brew install node@18
```

**Windows/Linux:**
Download from [nodejs.org](https://nodejs.org/) and install the LTS version.

**Verify Installation:**
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

---

#### 2. Git

**Installation:**

**macOS:**
```bash
brew install git
```

**Windows:**
Download from [git-scm.com](https://git-scm.com/)

**Linux:**
```bash
sudo apt-get install git  # Debian/Ubuntu
sudo yum install git      # RedHat/CentOS
```

**Verify Installation:**
```bash
git --version  # Should show 2.x.x or higher
```

---

#### 3. PostgreSQL

**Version Required:** PostgreSQL 15+

**Installation:**

**macOS (via Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Windows:**
Download installer from [postgresql.org](https://www.postgresql.org/download/windows/)

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install postgresql-15 postgresql-contrib-15
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Docker Alternative (All Platforms):**
```bash
docker run --name weightgpt-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=weightgpt_dev \
  -p 5432:5432 \
  -d postgres:15
```

**Verify Installation:**
```bash
psql --version  # Should show 15.x or higher
```

---

#### 4. Expo CLI

**Installation:**
```bash
npm install -g expo-cli@latest
```

**Verify Installation:**
```bash
expo --version  # Should show 6.x.x or higher
```

---

#### 5. iOS Development (macOS Only)

**Xcode:**
1. Install from Mac App Store (12+ GB download)
2. Open Xcode and accept license agreement
3. Install Command Line Tools:
   ```bash
   xcode-select --install
   ```

**CocoaPods:**
```bash
sudo gem install cocoapods
```

**iOS Simulator:**
Already included with Xcode. To open:
```bash
open -a Simulator
```

**Verify Installation:**
```bash
xcodebuild -version  # Should show Xcode 14.x or higher
pod --version        # Should show 1.12.x or higher
```

---

#### 6. Android Development (All Platforms)

**Android Studio:**
1. Download from [developer.android.com/studio](https://developer.android.com/studio)
2. Install with default settings
3. Open Android Studio → More Actions → SDK Manager
4. Install:
   - Android SDK Platform 33 (Android 13)
   - Android SDK Build-Tools 33.0.0
   - Android Emulator
   - Android SDK Platform-Tools

**Environment Variables:**

**macOS/Linux (~/.zshrc or ~/.bashrc):**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# export ANDROID_HOME=$HOME/Android/Sdk        # Linux
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Windows (System Environment Variables):**
```
ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
```

Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
```

**Verify Installation:**
```bash
adb --version      # Should show Android Debug Bridge version
emulator -list-avds  # Should list available emulators
```

**Create Android Emulator:**
```bash
# Open Android Studio → Device Manager → Create Device
# Or use AVD Manager GUI
```

---

### Optional Tools

#### 1. Flipper (Debugging)

**Installation:**
Download from [fbflipper.com](https://fbflipper.com/)

Flipper provides:
- Network inspection
- Redux state viewer
- React DevTools
- Database browser
- Layout inspector

---

#### 2. React Native Debugger

**Installation:**

**macOS:**
```bash
brew install --cask react-native-debugger
```

**Windows/Linux:**
Download from [GitHub Releases](https://github.com/jhen0409/react-native-debugger/releases)

---

#### 3. Postman or Insomnia (API Testing)

**Postman:**
Download from [postman.com](https://www.postman.com/)

**Insomnia:**
Download from [insomnia.rest](https://insomnia.rest/)

---

#### 4. Visual Studio Code (Recommended Editor)

**Installation:**
Download from [code.visualstudio.com](https://code.visualstudio.com/)

**Recommended Extensions:**
```
- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Prisma
- React Native Tools
- GitLens
```

---

## Quick Start (TL;DR)

**For experienced developers who want to get running quickly:**

```bash
# 1. Clone repository
git clone https://github.com/tidycocleaners-oss/WeightGPTnew.git
cd WeightGPTnew

# 2. Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your values (DATABASE_URL, OPENAI_API_KEY, etc.)
createdb weightgpt_dev
npx prisma migrate dev
npm run seed
npm run dev  # Runs on http://localhost:3000

# 3. Mobile setup (new terminal)
cd ../mobile
npm install
cp .env.example .env
# Edit .env with API_URL=http://localhost:3000
npx expo start
# Press 'i' for iOS or 'a' for Android

# 4. Verify
# Open browser: http://localhost:3000/health (should return {"status":"ok"})
# Mobile app should launch on simulator/emulator
```

**Continue reading for detailed step-by-step instructions.**

---

## Backend Setup

### Step 1: Clone Repository

```bash
# Clone repository
git clone https://github.com/tidycocleaners-oss/WeightGPTnew.git
cd WeightGPTnew

# Verify repository structure
ls -la
# Should see: backend/, mobile/, project/, handoffs/, logs/, etc.
```

---

### Step 2: Install Backend Dependencies

```bash
cd backend

# Install all npm packages
npm install

# This installs:
# - express (web server)
# - prisma (database ORM)
# - pino (logging)
# - zod (validation)
# - axios (HTTP client)
# - opossum (circuit breaker)
# - and all other dependencies from package.json
```

**Expected Output:**
```
added 347 packages, and audited 348 packages in 45s
```

**If you see errors:**
- Ensure Node.js 18+ is installed (`node --version`)
- Delete `node_modules/` and `package-lock.json`, then retry `npm install`
- Check internet connection (npm needs to download packages)

---

### Step 3: Configure Environment Variables

```bash
# Copy template to create local .env file
cp .env.example .env

# Open .env in your editor
nano .env  # or: code .env (VS Code), vim .env, etc.
```

**Edit the following required variables:**

See [Environment Variables](#environment-variables) section below for complete `.env.example` file.

**Minimum required for local development:**
```bash
# Database (update after creating database in Step 4)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/weightgpt_dev

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-secret-key-here-replace-this
JWT_EXPIRES_IN=7d

# OpenAI API (from DEVELOPMENT_SETUP.md)
OPENAI_API_KEY=sk-proj-your-key-here

# Server
PORT=3000
NODE_ENV=development
```

**Save the file** and proceed to database setup.

---

### Step 4: Set Up Database

See [Database Setup](#database-setup) section below for detailed instructions.

**Quick version:**
```bash
# Create development database
createdb weightgpt_dev

# Run migrations (creates all 25 tables)
npx prisma migrate dev --name initial

# Seed database with achievements and workouts
npm run seed
```

---

### Step 5: Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production build (for testing)
npm run build
npm start
```

**Expected Output:**
```
[14:30:00.000] INFO (server): Server listening on port 3000
[14:30:00.001] INFO (server): Database connected
[14:30:00.002] INFO (server): Environment: development
```

**Verify Backend is Running:**

Open browser or use curl:
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": 1699372800000,
  "database": "connected",
  "version": "1.0.0"
}
```

**If server doesn't start:**
- Check DATABASE_URL in .env is correct
- Ensure PostgreSQL is running (`brew services list` on macOS)
- Check port 3000 is not in use (`lsof -i :3000` on macOS/Linux)
- Review server logs for specific error messages

---

## Mobile App Setup

### Step 1: Navigate to Mobile Directory

```bash
# From repository root
cd mobile

# Or if you're in backend/:
cd ../mobile
```

---

### Step 2: Install Mobile Dependencies

```bash
# Install all npm packages
npm install

# This installs:
# - expo (build tool)
# - react-native (framework)
# - react-navigation (routing)
# - @tanstack/react-query (data fetching)
# - zustand (state management)
# - axios (API client)
# - and all other dependencies
```

**Expected Output:**
```
added 1247 packages, and audited 1248 packages in 2m
```

**iOS Native Modules (macOS only):**
```bash
# Install CocoaPods dependencies
cd ios
pod install
cd ..
```

**If you see errors:**
- Ensure Node.js 18+ is installed
- Ensure Expo CLI is installed globally (`npm install -g expo-cli`)
- Delete `node_modules/` and retry `npm install`

---

### Step 3: Configure Environment Variables

```bash
# Copy template to create local .env file
cp .env.example .env

# Open .env in your editor
nano .env  # or: code .env, vim .env, etc.
```

**Edit the following:**

See [Environment Variables](#environment-variables) section for complete `.env.example` file.

**Minimum required for local development:**
```bash
# Backend API URL
API_URL=http://localhost:3000
API_TIMEOUT=30000

# Environment
ENV=development
```

**Save the file.**

---

### Step 4: Start Expo Development Server

```bash
# Start Expo
npx expo start

# Or use npm script:
npm start
```

**Expected Output:**
```
› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

---

### Step 5: Run on Simulator/Emulator

**iOS (macOS only):**
```bash
# Press 'i' in the Expo terminal

# Or use:
npx expo run:ios
```

**Expected:**
- iOS Simulator opens
- App builds and launches
- You should see the WeightGPT splash screen

**Android:**
```bash
# Ensure Android emulator is running:
emulator -avd Pixel_5_API_33  # Replace with your AVD name

# Press 'a' in the Expo terminal

# Or use:
npx expo run:android
```

**Expected:**
- App builds and launches on emulator
- You should see the WeightGPT splash screen

---

### Step 6: Verify Mobile App

**Check for:**
1. ✅ App launches without crashes
2. ✅ No red error screens
3. ✅ Network requests to `http://localhost:3000` succeed
4. ✅ Can see onboarding screens (if implemented)

**Common first screen states:**
- Splash screen → Login/Welcome screen (if auth not implemented)
- Splash screen → Onboarding screen (if user not onboarded)
- Splash screen → Home screen (if user logged in and onboarded)

---

## Database Setup

### Local PostgreSQL Setup

#### macOS

**1. Install PostgreSQL:**
```bash
brew install postgresql@15
```

**2. Start PostgreSQL service:**
```bash
brew services start postgresql@15
```

**3. Verify service is running:**
```bash
brew services list | grep postgresql
# Should show: postgresql@15  started
```

**4. Access PostgreSQL CLI:**
```bash
psql postgres
```

**5. Create development database:**
```sql
CREATE DATABASE weightgpt_dev;
\q  -- Exit psql
```

**6. Verify database exists:**
```bash
psql -l | grep weightgpt
# Should show: weightgpt_dev
```

---

#### Windows

**1. Install PostgreSQL:**
- Download installer from [postgresql.org](https://www.postgresql.org/download/windows/)
- Run installer (remember the password you set for `postgres` user)

**2. Start PostgreSQL:**
- PostgreSQL should auto-start as a Windows service
- Verify in Services app (services.msc) → "postgresql-x64-15"

**3. Create database:**
```cmd
# Open Command Prompt or PowerShell
psql -U postgres

# In psql:
CREATE DATABASE weightgpt_dev;
\q
```

---

#### Linux (Ubuntu/Debian)

**1. Install PostgreSQL:**
```bash
sudo apt-get update
sudo apt-get install postgresql-15 postgresql-contrib-15
```

**2. Start PostgreSQL:**
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql  # Auto-start on boot
```

**3. Create database:**
```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE weightgpt_dev;
\q
```

---

#### Docker Setup (Alternative)

**Best for:** Developers who want isolated, reproducible environments.

**1. Create docker-compose.yml in project root:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: weightgpt-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: weightgpt_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**2. Start PostgreSQL container:**
```bash
docker-compose up -d postgres
```

**3. Verify container is running:**
```bash
docker ps | grep weightgpt-postgres
```

**4. Access PostgreSQL in container:**
```bash
docker exec -it weightgpt-postgres psql -U postgres -d weightgpt_dev
```

**5. Stop container (when done):**
```bash
docker-compose down
```

---

### Running Migrations

**Migrations create all 25 database tables from DATABASE_SCHEMA.md.**

**1. Ensure DATABASE_URL in .env is correct:**
```bash
# backend/.env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/weightgpt_dev
```

**2. Run Prisma migrations:**
```bash
cd backend
npx prisma migrate dev --name initial
```

**Expected Output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "weightgpt_dev", schema "public"

Applying migration `20251107000000_initial`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20251107000000_initial/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (5.x.x) to ./node_modules/@prisma/client in 234ms
```

**3. Verify tables were created:**
```bash
psql -U postgres -d weightgpt_dev -c "\dt"
```

**Expected Output:**
```
List of relations
 Schema |        Name         | Type  |  Owner
--------+---------------------+-------+----------
 public | users               | table | postgres
 public | user_settings       | table | postgres
 public | subscription_status | table | postgres
 public | meal_plans          | table | postgres
 public | meals               | table | postgres
 public | ingredients         | table | postgres
 ... (25 tables total)
```

**If migrations fail:**
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check database exists (`psql -l | grep weightgpt_dev`)
- Review error message for specific issue (e.g., permission denied, connection refused)

---

### Seeding Database

**Seeding populates:**
- 25 achievement definitions
- 200-500 pre-built workouts
- Test user account (optional)

**1. Run seed script:**
```bash
cd backend
npm run seed
```

**Expected Output:**
```
Seeding database...
✓ Created 25 achievements
✓ Created 287 workouts
✓ Created test user (email: test@weightgpt.com, password: testpassword123)
Database seeded successfully!
```

**2. Verify seed data:**
```bash
psql -U postgres -d weightgpt_dev -c "SELECT COUNT(*) FROM achievements;"
# Should return: 25

psql -U postgres -d weightgpt_dev -c "SELECT COUNT(*) FROM workouts;"
# Should return: 200-500 (depending on seed data)
```

---

### Connecting to Render.com Staging Database (Optional)

**For testing against staging environment.**

**1. Get DATABASE_URL from Render.com:**
- Log in to [dashboard.render.com](https://dashboard.render.com)
- Click on `weightgpt-db` database
- Copy "External Database URL"

**2. Update .env:**
```bash
# backend/.env
DATABASE_URL=postgres://weightgpt_db_user:password@dpg-xxxx.render.com/weightgpt_db
```

**3. Run migrations (if needed):**
```bash
npx prisma migrate deploy
```

**⚠️ Warning:** Be careful when connecting to staging database. You may overwrite staging data.

---

## Environment Variables

### Backend `.env.example`

**Location:** `backend/.env.example`

**Create this file:**

```bash
# ==============================================
# WeightGPT Backend Environment Variables
# ==============================================
# Copy this file to .env and fill in your values
# NEVER commit .env to git (it's in .gitignore)
# ==============================================

# ==============================================
# Database
# ==============================================
# Local development:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/weightgpt_dev

# Render.com staging (get from dashboard.render.com):
# DATABASE_URL=postgres://weightgpt_db_user:password@dpg-xxxx.render.com/weightgpt_db

# ==============================================
# Authentication
# ==============================================
# Generate with: openssl rand -base64 32
JWT_SECRET=your-secret-key-here-replace-this
JWT_EXPIRES_IN=7d

# Firebase Admin SDK (for JWT validation)
# Get from Firebase Console → Project Settings → Service Accounts
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourKeyHere\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# ==============================================
# OpenAI API
# ==============================================
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_TIMEOUT=30000
OPENAI_MAX_RETRIES=3

# ==============================================
# RevenueCat (Subscriptions)
# ==============================================
# Get from: https://app.revenuecat.com → Projects → API Keys
REVENUECAT_API_KEY=your-revenuecat-api-key
REVENUECAT_WEBHOOK_SECRET=your-webhook-secret

# ==============================================
# Server Configuration
# ==============================================
PORT=3000
NODE_ENV=development
# NODE_ENV=production  # For production builds

# CORS allowed origins (comma-separated)
CORS_ORIGINS=http://localhost:19006,http://localhost:8081,exp://localhost:8081

# ==============================================
# Redis (Optional - Post-MVP)
# ==============================================
# Upstash Redis for BullMQ job queue
# REDIS_URL=redis://:password@redis-xxxxx.upstash.io:6379

# ==============================================
# Sentry (Error Tracking)
# ==============================================
# Get from: https://sentry.io → Project Settings → Client Keys (DSN)
# SENTRY_DSN=https://xxxxx@o123456.ingest.sentry.io/123456
# SENTRY_ENVIRONMENT=development
# SENTRY_TRACES_SAMPLE_RATE=0.1

# ==============================================
# Logging
# ==============================================
LOG_LEVEL=info
# Options: trace, debug, info, warn, error, fatal

# ==============================================
# Rate Limiting
# ==============================================
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60

# ==============================================
# Circuit Breaker (OpenAI)
# ==============================================
CIRCUIT_BREAKER_TIMEOUT=60000
CIRCUIT_BREAKER_ERROR_THRESHOLD=50
CIRCUIT_BREAKER_RESET_TIMEOUT=60000

# ==============================================
# Email (Optional - Future)
# ==============================================
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password

# ==============================================
# Feature Flags (Optional)
# ==============================================
# FEATURE_AI_INSIGHTS_ENABLED=true
# FEATURE_BODY_MEASUREMENTS_ENABLED=true
# FEATURE_OFFLINE_SYNC_ENABLED=true
```

---

### Mobile `.env.example`

**Location:** `mobile/.env.example`

**Create this file:**

```bash
# ==============================================
# WeightGPT Mobile Environment Variables
# ==============================================
# Copy this file to .env and fill in your values
# NEVER commit .env to git (it's in .gitignore)
# ==============================================

# ==============================================
# Backend API
# ==============================================
# Local development (iOS Simulator):
API_URL=http://localhost:3000

# Local development (Android Emulator - special IP for localhost):
# API_URL=http://10.0.2.2:3000

# Local development (Physical Device - use your machine's local IP):
# Find your IP with: ipconfig (Windows) or ifconfig (Mac/Linux)
# API_URL=http://192.168.1.100:3000

# Staging (Render.com):
# API_URL=https://weightgpt-api.onrender.com

# Production:
# API_URL=https://api.weightgpt.com

# Request timeout (milliseconds)
API_TIMEOUT=30000

# ==============================================
# Firebase Authentication
# ==============================================
# Get from Firebase Console → Project Settings → General
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:ios:abcdef1234567890

# ==============================================
# RevenueCat (Subscriptions)
# ==============================================
# Get from: https://app.revenuecat.com → Projects → API Keys
REVENUECAT_PUBLIC_KEY_IOS=your-ios-public-key
REVENUECAT_PUBLIC_KEY_ANDROID=your-android-public-key

# ==============================================
# PostHog (Analytics)
# ==============================================
# Get from: https://app.posthog.com → Project Settings → Project API Key
POSTHOG_API_KEY=phc_xxxxxxxxxxxxxxxxxxxxx
POSTHOG_HOST=https://app.posthog.com

# ==============================================
# Sentry (Error Tracking)
# ==============================================
# Get from: https://sentry.io → Project Settings → Client Keys (DSN)
SENTRY_DSN=https://xxxxx@o123456.ingest.sentry.io/123456
SENTRY_ENVIRONMENT=development

# ==============================================
# Environment
# ==============================================
ENV=development
# ENV=staging
# ENV=production

# ==============================================
# Feature Flags (Optional)
# ==============================================
FEATURE_AI_INSIGHTS_ENABLED=true
FEATURE_BODY_MEASUREMENTS_ENABLED=true
FEATURE_OFFLINE_SYNC_ENABLED=true
FEATURE_DEBUG_MENU_ENABLED=true

# ==============================================
# App Configuration
# ==============================================
APP_NAME=WeightGPT
APP_VERSION=1.0.0
APP_BUILD_NUMBER=1

# ==============================================
# Debug Settings (Development Only)
# ==============================================
# Enable React DevTools
REACT_DEVTOOLS=true

# Enable Flipper
USE_FLIPPER=true

# Enable verbose logging
DEBUG=true
```

---

## Running Tests

### Backend Tests

#### Unit Tests

**Run all unit tests:**
```bash
cd backend
npm test
```

**Run specific test file:**
```bash
npm test -- users.test.ts
```

**Run tests in watch mode (auto-rerun on file changes):**
```bash
npm run test:watch
```

**Run tests with coverage report:**
```bash
npm run test:coverage
```

**Expected Output:**
```
PASS  src/utils/calculations/bmr.test.ts
PASS  src/utils/calculations/tdee.test.ts
PASS  src/services/meals.service.test.ts
...

Test Suites: 42 passed, 42 total
Tests:       187 passed, 187 total
Snapshots:   0 total
Time:        12.345 s

Coverage summary:
Statements   : 87.5% ( 1234/1410 )
Branches     : 82.3% ( 234/284 )
Functions    : 85.1% ( 156/183 )
Lines        : 88.2% ( 1187/1346 )
```

**Coverage thresholds (from CODE_STANDARDS.md):**
- Overall: 80% minimum
- Calculations: 100% required
- Services: 85% minimum
- Controllers: 75% minimum

---

#### Integration Tests

**Run integration tests (API endpoints):**
```bash
npm run test:integration
```

**Example test:**
```typescript
// tests/integration/meals.test.ts
describe('POST /api/meals/swap', () => {
  it('should swap meal successfully', async () => {
    const response = await request(app)
      .post('/api/meals/swap')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        mealId: 'meal-123',
        newMealId: 'meal-456'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

---

### Mobile Tests

#### Unit & Component Tests

**Run all mobile tests:**
```bash
cd mobile
npm test
```

**Run specific test file:**
```bash
npm test -- MealCard.test.tsx
```

**Run with coverage:**
```bash
npm run test:coverage
```

**Example component test:**
```typescript
// __tests__/components/MealCard.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import MealCard from '../../components/MealCard';

describe('MealCard', () => {
  it('renders meal name and calories', () => {
    const meal = {
      name: 'Grilled Chicken',
      calories: 350,
      protein: 45,
    };

    const { getByText } = render(<MealCard meal={meal} />);

    expect(getByText('Grilled Chicken')).toBeTruthy();
    expect(getByText('350 cal')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <MealCard meal={meal} onPress={onPressMock} />
    );

    fireEvent.press(getByTestId('meal-card'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
```

---

#### E2E Tests (Detox)

**Build iOS app for testing:**
```bash
npm run e2e:build:ios
```

**Run E2E tests on iOS:**
```bash
npm run e2e:test:ios
```

**Build Android app for testing:**
```bash
npm run e2e:build:android
```

**Run E2E tests on Android:**
```bash
npm run e2e:test:android
```

**Example E2E test:**
```typescript
// e2e/onboarding.test.ts
describe('Onboarding Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should complete onboarding', async () => {
    // Welcome screen
    await expect(element(by.id('welcome-screen'))).toBeVisible();
    await element(by.id('get-started-button')).tap();

    // Goal selection
    await expect(element(by.id('goal-screen'))).toBeVisible();
    await element(by.id('goal-lose-weight')).tap();
    await element(by.id('continue-button')).tap();

    // ... continue through all screens

    // Verify arrived at home screen
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
```

---

#### Smoke Tests (Maestro)

**Install Maestro:**
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

**Run smoke tests:**
```bash
cd mobile
maestro test flows/onboarding.yaml
```

**Example smoke test (flows/onboarding.yaml):**
```yaml
appId: com.weightgpt.app
---
- launchApp
- assertVisible: "Get Started"
- tapOn: "Get Started"
- assertVisible: "What's your goal?"
- tapOn: "Lose Weight"
- tapOn: "Continue"
- assertVisible: "Home"
```

---

## Debugging

### Backend Debugging

#### Chrome DevTools

**1. Start backend in debug mode:**
```bash
cd backend
npm run dev:debug
```

**2. Open Chrome DevTools:**
- Open Chrome browser
- Navigate to `chrome://inspect`
- Click "Open dedicated DevTools for Node"

**3. Set breakpoints:**
- In DevTools Sources tab, open your backend file
- Click line number to set breakpoint
- Trigger API call to hit breakpoint

**4. Use debugger statement:**
```typescript
// In your code
async function handleLogin(req, res) {
  debugger;  // Execution will pause here
  const { email, password } = req.body;
  // ...
}
```

---

#### VS Code Debugger

**1. Create `.vscode/launch.json`:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev:debug"],
      "cwd": "${workspaceFolder}/backend",
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

**2. Set breakpoints in VS Code editor**

**3. Press F5 or click "Run and Debug"**

---

#### Logging with pino

**Backend uses pino for structured logging:**

```typescript
import logger from './utils/logger';

// Log levels: trace, debug, info, warn, error, fatal
logger.info('User logged in', { userId: user.id });
logger.error('Database connection failed', { error: err.message });
logger.debug('API request', { method: req.method, url: req.url });
```

**View logs:**
```bash
# Pretty print logs in development
npm run dev  # Logs are automatically pretty-printed

# Raw JSON logs (for production)
NODE_ENV=production npm start
```

---

### Mobile Debugging

#### React Native Debugger

**1. Install React Native Debugger:**
```bash
brew install --cask react-native-debugger  # macOS
```

**2. Start debugger:**
```bash
open "rndebugger://set-debugger-loc?host=localhost&port=19000"
```

**3. Enable Debug Mode in app:**
- Shake device/simulator
- Tap "Debug" in dev menu
- Or press `Cmd+D` (iOS) / `Cmd+M` (Android)

**4. Debugging features:**
- React DevTools (inspect component tree)
- Redux DevTools (if using Redux)
- Network inspector
- Console logs

---

#### Flipper

**1. Install Flipper:**
Download from [fbflipper.com](https://fbflipper.com/)

**2. Start Flipper app**

**3. Run app in development mode:**
```bash
npx expo start
```

**4. App should auto-connect to Flipper**

**5. Available plugins:**
- **Layout Inspector:** View component hierarchy
- **Network:** Inspect API calls
- **Databases:** Browse SQLite database
- **React DevTools:** Component tree
- **Logs:** Console.log output
- **Preferences:** View AsyncStorage/MMKV

---

#### Console Logging

**Add logs to your code:**

```typescript
// Simple logging
console.log('User data:', userData);

// Log with color (mobile only)
console.log('%c User logged in', 'color: green; font-weight: bold');

// Warn and error
console.warn('Token expiring soon');
console.error('API request failed', error);

// Table for objects (desktop debugging)
console.table(users);
```

**View logs:**

**iOS:**
```bash
# Terminal 1: Run app
npx expo start

# Terminal 2: View native logs
npx react-native log-ios
```

**Android:**
```bash
# Terminal 1: Run app
npx expo start

# Terminal 2: View native logs
npx react-native log-android
```

---

#### Network Debugging

**Use Flipper or React Native Debugger Network tab to inspect:**
- API requests/responses
- Request headers (Authorization, Content-Type)
- Response status codes
- Request/response timing

**Add request logging:**
```typescript
// In apiClient.ts
axios.interceptors.request.use(request => {
  console.log('Starting Request', {
    method: request.method,
    url: request.url,
    data: request.data,
  });
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  error => {
    console.error('Response Error:', {
      status: error.response?.status,
      message: error.message,
    });
    return Promise.reject(error);
  }
);
```

---

#### Debugging OpenAI API Calls

**Log OpenAI requests/responses:**

```typescript
// In backend/src/services/ai/mealGeneration.service.ts
async function generateMeal(prompt: string) {
  logger.info('OpenAI Request', { prompt, model: 'gpt-4o-mini' });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    logger.info('OpenAI Response', {
      tokens: response.usage?.total_tokens,
      responseLength: response.choices[0]?.message?.content?.length,
    });

    return response;
  } catch (error) {
    logger.error('OpenAI Error', {
      error: error.message,
      status: error.status,
    });
    throw error;
  }
}
```

**Monitor circuit breaker:**
```typescript
// Circuit breaker status logs
circuitBreaker.on('open', () => {
  logger.warn('Circuit breaker OPEN - OpenAI calls failing');
});

circuitBreaker.on('halfOpen', () => {
  logger.info('Circuit breaker HALF_OPEN - Testing OpenAI');
});

circuitBreaker.on('close', () => {
  logger.info('Circuit breaker CLOSED - OpenAI healthy');
});
```

---

#### Debugging Database Queries

**Use Prisma Studio:**
```bash
cd backend
npx prisma studio
```

**Opens browser at `http://localhost:5555` with GUI for:**
- Viewing all database tables
- Editing records
- Running queries
- Inspecting relationships

**Log Prisma queries:**
```typescript
// In prisma/client.ts
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Or enable in .env:
DEBUG=prisma:query
```

**View query performance:**
```typescript
import { performance } from 'perf_hooks';

const start = performance.now();
const users = await prisma.user.findMany();
const duration = performance.now() - start;

logger.info('Query duration', { duration, count: users.length });
```

---

## Common Issues & Troubleshooting

### Backend Issues

#### Issue: Database connection failed

**Error:**
```
Error: Can't reach database server at `localhost:5432`
```

**Solutions:**

1. **Check PostgreSQL is running:**
   ```bash
   # macOS
   brew services list | grep postgresql
   # Should show "started"

   # Linux
   sudo systemctl status postgresql
   ```

2. **Verify DATABASE_URL:**
   ```bash
   # In backend/.env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/weightgpt_dev
   #                        ^^^user ^^^pass    ^^^host   ^^^port ^^^database
   ```

3. **Test connection manually:**
   ```bash
   psql -U postgres -d weightgpt_dev
   ```

4. **Check if database exists:**
   ```bash
   psql -U postgres -c "\l" | grep weightgpt
   ```

5. **Recreate database if needed:**
   ```bash
   dropdb weightgpt_dev
   createdb weightgpt_dev
   npx prisma migrate dev
   ```

---

#### Issue: Port 3000 already in use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. **Find process using port 3000:**
   ```bash
   # macOS/Linux
   lsof -i :3000

   # Windows
   netstat -ano | findstr :3000
   ```

2. **Kill the process:**
   ```bash
   # macOS/Linux (use PID from lsof output)
   kill -9 <PID>

   # Windows (use PID from netstat output)
   taskkill /PID <PID> /F
   ```

3. **Or use a different port:**
   ```bash
   # In backend/.env
   PORT=3001
   ```

---

#### Issue: OpenAI API key invalid

**Error:**
```
OpenAI API error: Incorrect API key provided
```

**Solutions:**

1. **Verify API key in .env:**
   ```bash
   cat backend/.env | grep OPENAI_API_KEY
   ```

2. **Check API key format:**
   - Should start with `sk-proj-`
   - No extra spaces or quotes
   - No newlines

3. **Test API key directly:**
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

4. **Regenerate API key:**
   - Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create new key
   - Update .env

---

#### Issue: Prisma migrations fail

**Error:**
```
Migration failed: relation "users" already exists
```

**Solutions:**

1. **Reset database (DESTRUCTIVE):**
   ```bash
   npx prisma migrate reset
   # This deletes all data and reruns migrations
   ```

2. **Or manually drop conflicting tables:**
   ```bash
   psql -U postgres -d weightgpt_dev

   DROP TABLE users CASCADE;
   DROP TABLE meal_plans CASCADE;
   # ... drop all conflicting tables

   \q

   npx prisma migrate dev
   ```

3. **If schema and database are in sync but Prisma doesn't know:**
   ```bash
   npx prisma db push
   # Force schema to database without migrations
   ```

---

### Mobile Issues

#### Issue: Metro bundler port in use

**Error:**
```
Error: listen EADDRINUSE :::8081
```

**Solutions:**

1. **Kill Metro bundler:**
   ```bash
   # Find process
   lsof -i :8081

   # Kill process
   kill -9 <PID>
   ```

2. **Or start Expo on different port:**
   ```bash
   npx expo start --port 8082
   ```

---

#### Issue: iOS build fails

**Error:**
```
error Failed to build iOS project. We ran "xcodebuild" command but it exited with error code 65.
```

**Solutions:**

1. **Install CocoaPods dependencies:**
   ```bash
   cd mobile/ios
   pod install
   cd ../..
   ```

2. **Clean build folder:**
   ```bash
   cd mobile/ios
   rm -rf build/
   cd ../..
   ```

3. **Clean Xcode derived data:**
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData
   ```

4. **Open project in Xcode and build manually:**
   ```bash
   open mobile/ios/WeightGPT.xcworkspace
   # Product → Clean Build Folder
   # Product → Build
   ```

5. **Check Xcode version:**
   ```bash
   xcodebuild -version
   # Should be 14.x or higher
   ```

---

#### Issue: Android emulator not starting

**Error:**
```
PANIC: Cannot find AVD system path. Please define ANDROID_SDK_ROOT
```

**Solutions:**

1. **Set ANDROID_HOME environment variable:**
   ```bash
   # macOS/Linux (~/.zshrc or ~/.bashrc)
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools

   # Reload shell
   source ~/.zshrc
   ```

2. **Verify emulator exists:**
   ```bash
   emulator -list-avds
   # Should list available emulators
   ```

3. **Create new emulator if needed:**
   - Open Android Studio
   - Tools → Device Manager
   - Create Device
   - Select Pixel 5, API 33

4. **Start emulator manually:**
   ```bash
   emulator -avd Pixel_5_API_33
   ```

---

#### Issue: Cannot connect to backend API

**Error (in mobile app):**
```
Network request failed
Error: Network Error
```

**Solutions:**

1. **Verify backend is running:**
   ```bash
   curl http://localhost:3000/health
   # Should return {"status":"ok"}
   ```

2. **Check API_URL in mobile/.env:**

   **iOS Simulator:**
   ```bash
   API_URL=http://localhost:3000
   ```

   **Android Emulator:**
   ```bash
   # Android emulator uses special IP for host machine
   API_URL=http://10.0.2.2:3000
   ```

   **Physical Device:**
   ```bash
   # Use your machine's local IP
   # Find with: ipconfig (Windows) or ifconfig (Mac/Linux)
   API_URL=http://192.168.1.100:3000
   ```

3. **Ensure device and backend on same network (physical device only)**

4. **Disable firewall temporarily to test (macOS):**
   ```bash
   # System Preferences → Security & Privacy → Firewall
   # Turn off firewall temporarily
   ```

5. **Test API call in app:**
   ```typescript
   // Add to your App.tsx for debugging
   useEffect(() => {
     fetch(`${process.env.API_URL}/health`)
       .then(res => res.json())
       .then(data => console.log('API Test:', data))
       .catch(err => console.error('API Test Error:', err));
   }, []);
   ```

---

#### Issue: Expo modules not found

**Error:**
```
Error: Unable to resolve module expo-secure-store
```

**Solutions:**

1. **Install missing package:**
   ```bash
   npx expo install expo-secure-store
   ```

2. **Clear cache and reinstall:**
   ```bash
   rm -rf node_modules
   npm install
   npx expo start --clear
   ```

3. **Rebuild iOS (if needed):**
   ```bash
   cd mobile/ios
   pod install
   cd ../..
   npx expo run:ios
   ```

---

### General Issues

#### Issue: npm install fails

**Error:**
```
npm ERR! code EINTEGRITY
npm ERR! sha512-... integrity checksum failed
```

**Solutions:**

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete package-lock.json and node_modules:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Update npm:**
   ```bash
   npm install -g npm@latest
   ```

4. **Check internet connection**

---

#### Issue: Environment variables not loading

**Error:**
```
process.env.OPENAI_API_KEY is undefined
```

**Solutions:**

1. **Verify .env file exists:**
   ```bash
   ls -la backend/.env
   ls -la mobile/.env
   ```

2. **Check .env is not .env.example:**
   ```bash
   # Should be .env, not .env.example
   cp .env.example .env
   ```

3. **Restart development server after changing .env:**
   ```bash
   # Backend
   # Stop server (Ctrl+C), then:
   npm run dev

   # Mobile
   # Stop Expo (Ctrl+C), then:
   npx expo start --clear
   ```

4. **Check for typos in variable names**

5. **Backend: Ensure dotenv is loaded early:**
   ```typescript
   // At top of server.ts or app.ts
   import 'dotenv/config';
   ```

6. **Mobile: Ensure babel-plugin-transform-inline-environment-variables is configured:**
   ```json
   // babel.config.js
   module.exports = {
     plugins: [
       ['transform-inline-environment-variables']
     ]
   };
   ```

---

## First-Time Setup Checklist

Use this checklist to verify complete setup:

### Prerequisites
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] PostgreSQL 15+ installed (`psql --version`)
- [ ] Expo CLI installed (`expo --version`)
- [ ] iOS: Xcode installed (macOS only) (`xcodebuild -version`)
- [ ] iOS: CocoaPods installed (macOS only) (`pod --version`)
- [ ] Android: Android Studio installed
- [ ] Android: ANDROID_HOME environment variable set

### Backend Setup
- [ ] Repository cloned
- [ ] Backend dependencies installed (`npm install` in `backend/`)
- [ ] `.env` file created from `.env.example`
- [ ] DATABASE_URL configured in `.env`
- [ ] JWT_SECRET configured (generated with `openssl rand -base64 32`)
- [ ] OPENAI_API_KEY configured in `.env`
- [ ] PostgreSQL database created (`createdb weightgpt_dev`)
- [ ] Migrations run successfully (`npx prisma migrate dev`)
- [ ] Database seeded (`npm run seed`)
- [ ] Backend server starts (`npm run dev`)
- [ ] Health check returns 200 (`curl http://localhost:3000/health`)

### Mobile Setup
- [ ] Mobile dependencies installed (`npm install` in `mobile/`)
- [ ] `.env` file created from `.env.example`
- [ ] API_URL configured in `.env` (http://localhost:3000 for iOS, http://10.0.2.2:3000 for Android)
- [ ] iOS: CocoaPods installed (`cd ios && pod install`)
- [ ] Expo starts successfully (`npx expo start`)
- [ ] iOS: App launches on simulator (press 'i')
- [ ] Android: Emulator running and app launches (press 'a')
- [ ] Mobile app connects to backend API (no network errors)

### Testing
- [ ] Backend unit tests pass (`npm test` in `backend/`)
- [ ] Backend integration tests pass (`npm run test:integration` in `backend/`)
- [ ] Mobile unit tests pass (`npm test` in `mobile/`)
- [ ] Code coverage > 80% (`npm run test:coverage`)

### Tools & Debugging
- [ ] Flipper installed and connects to app
- [ ] React Native Debugger installed (optional)
- [ ] Postman or Insomnia installed for API testing (optional)
- [ ] Prisma Studio accessible (`npx prisma studio` in `backend/`)

---

## Development Workflow

### Daily Workflow

**1. Start PostgreSQL (if not running):**
```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql

# Docker
docker-compose up -d postgres
```

**2. Start Backend:**
```bash
cd backend
npm run dev
```

**3. Start Mobile App (new terminal):**
```bash
cd mobile
npx expo start
```

**4. Open simulator/emulator:**
- iOS: Press 'i' in Expo terminal
- Android: Press 'a' in Expo terminal

**5. Code, test, repeat:**
- Make code changes
- Backend auto-reloads on file save
- Mobile: Shake device → Reload (or press 'r' in Expo terminal)
- Write tests as you code
- Run tests before committing

**6. Commit changes:**
```bash
# Follow Conventional Commits format
git add .
git commit -m "feat(auth): implement JWT authentication"
git push
```

---

### Testing Workflow

**Before committing:**
```bash
# Backend
cd backend
npm test                  # Unit tests
npm run test:integration  # API tests
npm run test:coverage     # Check coverage
npm run lint              # ESLint
npm run format:check      # Prettier

# Mobile
cd mobile
npm test                  # Component tests
npm run lint
npm run format:check
```

**Required:**
- All tests must pass
- Code coverage ≥ 80%
- No ESLint errors
- Code formatted with Prettier

---

### Database Workflow

**Making schema changes:**

1. **Edit `prisma/schema.prisma`**

2. **Create migration:**
   ```bash
   npx prisma migrate dev --name add-user-avatar
   ```

3. **Apply to staging:**
   ```bash
   npx prisma migrate deploy
   ```

4. **Seed new data (if needed):**
   ```bash
   npm run seed
   ```

**View database:**
```bash
npx prisma studio
# Opens http://localhost:5555
```

---

### API Testing Workflow

**Use Postman or Insomnia:**

1. **Import API collection:**
   - Create collection from API_SPECIFICATION.md
   - 72 endpoints documented

2. **Set environment variables:**
   - `BASE_URL`: http://localhost:3000
   - `AUTH_TOKEN`: (get from login endpoint)

3. **Test endpoints:**
   ```
   POST /api/auth/login
   GET /api/meals/plan/current
   POST /api/meals/swap
   POST /api/logging/meal
   ```

**Or use curl:**
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@weightgpt.com","password":"testpassword123"}'

# Get meal plan (with token from login)
curl http://localhost:3000/api/meals/plan/current \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Debugging Workflow

**Backend debugging:**
1. Add `debugger` statement in code
2. Run `npm run dev:debug`
3. Open Chrome DevTools (`chrome://inspect`)
4. Trigger code path
5. Inspect variables, step through code

**Mobile debugging:**
1. Add `console.log()` statements
2. Run app with `npx expo start`
3. Open React Native Debugger or Flipper
4. View console output, network calls, component tree

**Database debugging:**
1. Open Prisma Studio: `npx prisma studio`
2. View tables, inspect data
3. Or use psql: `psql -U postgres -d weightgpt_dev`
4. Run manual queries

---

### Cleanup Workflow

**Daily cleanup:**
```bash
# Stop all services
# Press Ctrl+C in all terminals (backend, mobile, postgres)

# macOS: Stop PostgreSQL (if desired)
brew services stop postgresql@15

# Docker: Stop containers
docker-compose down
```

**Weekly cleanup:**
```bash
# Clear npm cache
npm cache clean --force

# Clear Expo cache
npx expo start --clear

# Clear Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Clear Android build cache
cd mobile/android
./gradlew clean
cd ../..
```

---

## Summary

You've completed the development setup! You should now have:

✅ **Backend running** on http://localhost:3000
✅ **Database** with 25 tables and seed data
✅ **Mobile app** running on iOS/Android simulator
✅ **Tests** passing (80%+ coverage)
✅ **Debugging tools** installed and configured

**Next Steps:**
1. Read [CODE_STANDARDS.md](./CODE_STANDARDS.md) for coding conventions
2. Read [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for build order
3. Start implementing Phase 1: Foundation (Session 24)

**Need Help?**
- Check [Common Issues](#common-issues--troubleshooting) section
- Review error messages in server logs
- Use debugging tools (Flipper, React Native Debugger, Chrome DevTools)
- Consult [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details

---

**Document Version:** 1.0
**Created:** 2025-11-07
**Last Updated:** 2025-11-07
**Status:** Active - Production Ready
**Next Review:** After Session 24 (development begins)
