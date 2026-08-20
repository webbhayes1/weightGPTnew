# Development Setup Reference

**Last Updated:** 2025-11-04 (Planning Phase)

**Status:** Setup information collected, ready for development phase after Q3-Q7 planning complete

---

## Overview

This document contains all setup information and credentials needed when development begins. This was gathered during planning phase but development will not start until all feature specifications (Q1-Q7) are complete.

---

## GitHub Repository

**Repository URL:** https://github.com/tidycocleaners-oss/WeightGPTnew.git

**Structure:**
- Monorepo approach (planning docs + backend + mobile in single repo)
- Current state: Planning documentation only
- Future structure:
  - `backend/` - Node.js + Express API
  - `mobile/` - React Native + Expo app
  - `project/` - Planning specs and documentation
  - `handoffs/` - Session handoffs
  - `logs/` - Development logs

**Status:** ✅ Repository created and active

---

## OpenAI API

**Purpose:** AI-powered meal plan and workout plan generation (GPT-4)

**API Key:**
```
sk-proj-your-key-here
```

**Account Requirements:**
- Tier 2+ access needed for production (higher rate limits)
- Current tier: TBD (verify before development)

**Usage:**
- Meal plan generation (7 days, 3 meals/day)
- Workout plan generation (customized to user equipment/schedule)
- Learning from user feedback over time

**Environment Variable Name:**
```
OPENAI_API_KEY
```

**Status:** ✅ API key obtained, ready to use

---

## Render.com Hosting

**Purpose:** Backend API server and PostgreSQL database hosting

**Web Service:**
- **Name:** weightgpt-api
- **Type:** Web Service
- **Region:** TBD (Oregon recommended for US users)
- **Instance Type:** Starter (free tier initially, scale up for production)
- **Build Command:** `npm install` (will be set during development)
- **Start Command:** `npm start` (will be set during development)

**Database:**
- **Name:** weightgpt-db
- **Type:** PostgreSQL
- **Region:** Same as web service (for low latency)
- **Plan:** Starter ($7/month)
- **Connection String:** Auto-provided by Render (environment variable)

**Environment Variables Set:**
- `OPENAI_API_KEY` - OpenAI API key (configured)
- `DATABASE_URL` - PostgreSQL connection string (auto-configured by Render)

**Current Deployment Status:**
- ⚠️ Failing (expected - no backend code exists yet)
- Will succeed once `backend/` folder with `package.json` and server code is created

**Status:** ✅ Render account created, services configured

---

## Firebase Authentication

**Purpose:** User authentication and account management

**Choice:** Firebase Authentication (selected over Clerk for simplicity)

**What's Needed When Development Starts:**
1. Create Firebase account at https://firebase.google.com
2. Create new project named "WeightGPT"
3. Enable Authentication → Email/Password provider
4. Get Firebase config object (apiKey, authDomain, projectId, etc.)
5. Add Firebase SDK to React Native app
6. Configure backend to verify Firebase tokens

**Features to Enable:**
- Email/Password authentication
- Password reset
- Email verification (optional for MVP)

**Environment Variables Needed:**
- Frontend: Firebase config object (in app code)
- Backend: Firebase Admin SDK credentials (for token verification)

**Status:** ⚠️ NOT CREATED YET - Will set up when development phase begins

---

## Payment Processing

**Planned Provider:** Stripe or RevenueCat

**Decision:** Not made yet (will decide during Phase 2 - Architecture & Implementation Planning)

**Options:**
- **Stripe:** Direct payment processing, more control, more setup
- **RevenueCat:** Subscription management wrapper, easier mobile integration

**Status:** 📋 Pending decision

---

## Tech Stack Summary

**Frontend:**
- React Native with Expo
- React Native Paper or NativeBase (UI components - TBD)
- React Navigation (routing)
- Context API or Zustand (state management - TBD)
- AsyncStorage (local data)

**Backend:**
- Node.js + Express
- PostgreSQL (via Render.com)
- OpenAI API (GPT-4)
- Firebase Admin SDK (authentication)

**Services:**
- Authentication: Firebase
- Hosting: Render.com
- Database: PostgreSQL (Render.com)
- AI: OpenAI API
- Payments: TBD (Stripe or RevenueCat)

**Status:** Stack planned, pending final decisions on UI library and state management

---

## Development Environment Setup

**Not yet required** - When development phase begins:

1. **Install Node.js**
   - Version 18+ LTS recommended
   - npm or yarn package manager

2. **Install React Native Development Tools**
   - Expo CLI: `npm install -g expo-cli`
   - Expo Go app on iOS/Android for testing

3. **Clone Repository**
   ```bash
   git clone https://github.com/tidycocleaners-oss/WeightGPTnew.git
   cd WeightGPTnew
   ```

4. **Backend Setup** (when code exists)
   ```bash
   cd backend
   npm install
   # Create .env file with:
   # OPENAI_API_KEY=<your-key>
   # DATABASE_URL=<render-provides-this>
   # FIREBASE_CONFIG=<firebase-admin-credentials>
   npm run dev
   ```

5. **Mobile Setup** (when code exists)
   ```bash
   cd mobile
   npm install
   expo start
   ```

**Status:** 📋 Not started - waiting for development phase

---

## Security Notes

**API Keys and Secrets:**
- Never commit API keys to git
- Use `.env` files for local development (add to `.gitignore`)
- Use Render.com environment variables for production
- Rotate keys if accidentally exposed

**Database:**
- Connection string contains credentials - keep secure
- Use environment variables, never hardcode

**Firebase:**
- Keep Firebase config private on backend
- Frontend Firebase config can be public (but still use env vars)
- Never expose Firebase Admin SDK credentials

---

## Cost Estimates

**Monthly Costs (MVP/Development):**
- Render PostgreSQL: $7/month
- Render Web Service: $0 (free tier) or $7/month (starter)
- OpenAI API: ~$20-50/month (depends on usage)
- Firebase: $0 (free tier for <10k users)
- **Total:** ~$27-64/month during development

**Monthly Costs (Production):**
- Render PostgreSQL: $7-15/month (depends on scale)
- Render Web Service: $25+/month (professional tier)
- OpenAI API: $100-500+/month (depends on user count)
- Firebase: $0-25/month (blaze plan, pay per use)
- Payment Processing: 2.9% + $0.30 per transaction
- **Total:** Highly variable based on user count

---

## Next Steps (When Development Begins)

**Before writing any code:**
1. Complete Q3-Q7 planning specifications ← **Current Priority**
2. Finalize architecture design
3. Design database schema
4. Design API endpoints
5. Finalize tech stack decisions (UI library, state management)

**When ready to code:**
1. Create Firebase account and project
2. Set up local development environment
3. Initialize backend/ folder with Express server
4. Initialize mobile/ folder with Expo
5. Connect to Render PostgreSQL
6. Test OpenAI API integration
7. Implement Q1 Onboarding (first feature)

---

## Status Checklist

**Completed:**
- ✅ GitHub repository created
- ✅ OpenAI API key obtained
- ✅ Render.com account created
- ✅ PostgreSQL database provisioned
- ✅ Web service configured (environment variables set)
- ✅ Authentication provider chosen (Firebase)

**Pending:**
- ⏳ Q3-Q7 planning specifications (in progress)
- ⏳ Firebase account creation (will do before development)
- ⏳ Payment provider decision (Stripe vs RevenueCat)
- ⏳ UI component library decision
- ⏳ State management library decision
- ⏳ Architecture design document

**Blocked/Waiting:**
- Nothing blocked currently

---

## Instructions for Claude

### When to Update This File

**Update when:**
- New credentials/API keys obtained
- Service configurations change
- New services added to stack
- Decisions made on pending items (UI library, payments, etc.)
- Firebase account created

**Don't update for:**
- Code implementation details (those go in code comments/README)
- Feature specifications (those go in planning/Q[N] specs)
- Session notes (those go in handoffs)

### How to Update

1. Update relevant section with new information
2. Update "Last Updated" timestamp at top
3. Update Status Checklist (move from Pending to Completed)
4. Log significant changes in DECISIONS.md if applicable
5. Reference update in handoff document

---

## References

- **Project Overview:** [project/OVERVIEW.md](OVERVIEW.md)
- **Project Status:** [project/STATUS.md](STATUS.md)
- **Decision Log:** [project/DECISIONS.md](DECISIONS.md)
- **Latest Handoff:** [handoffs/planning/LATEST-2025-11-04.md](../handoffs/planning/LATEST-2025-11-04.md)

---

**Document Version:** 1.0
**Created:** 2025-11-04
**Last Updated:** 2025-11-04 17:00
**Status:** Active (will update as setup progresses)
**Next Review:** Before development phase begins
