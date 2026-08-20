# Architecture & Implementation Planning - Session Plan

**Version:** 1.0
**Date:** 2025-11-07
**Purpose:** Session-by-session roadmap for completing pre-development documentation
**Status:** Active
**Approach:** Option A - Complete all pre-development documentation before coding

---

## Overview

This document outlines the session-by-session plan for transitioning from Planning Phase (95% complete) to Development Phase. We will complete **all pre-development documentation** (architecture, API consolidation, tech stack, implementation plan, code standards, etc.) before writing any code.

**Total Estimated Sessions:** 10-12 sessions (Sessions 14-25)
**Current Phase:** Development Planning (Sessions 14-23)
**Next Phase:** Development Begins (Session 24+)

---

## Phase Breakdown

### **Phase 1: Development Planning** (Sessions 14-23)
- Create all pre-development documentation
- Finalize tech stack decisions
- Design architecture and implementation strategy
- No code written yet

### **Phase 2: Development Execution** (Session 24+)
- Begin actual code implementation
- Follow implementation plan created in Phase 1

---

## Session End Audit Protocol

**Mandatory for ALL Development Planning Sessions (14-23)**

To prevent errors from compounding across sessions, every planning session MUST end with a quality audit. This protocol ensures consistency, catches errors early, and prevents weeks of rework.

---

### Quick Audit (15-20 min) - **End of EVERY Session**

**Performed:** At the end of Sessions 14-23 (before creating handoff)

**Purpose:** Catch errors immediately while context is fresh

**Checklist:**

#### 1. Math Verification ✓
- [ ] All calculations correct (costs, percentages, timelines, estimates)
- [ ] Numbers consistent across all documents updated this session
- [ ] No off-by-one errors or unit conversion mistakes
- [ ] Cost estimates include all components (not just one service)

#### 2. Cross-Reference Previous Session ✓
- [ ] No contradictions with Session N-1
- [ ] Builds logically on previous session's work
- [ ] References to previous decisions are accurate
- [ ] Dependencies from previous session satisfied

#### 3. Internal Consistency ✓
- [ ] Session handoff matches STATUS.md entry
- [ ] STATUS.md matches DECISIONS.md entries (if decisions made)
- [ ] Development log entry matches accomplishments
- [ ] All file references use correct paths
- [ ] Version numbers consistent

#### 4. Completeness Check ✓
- [ ] All session goals (from this plan) achieved
- [ ] All decisions documented in DECISIONS.md
- [ ] No "TODO", "TBD", or "FIXME" items left unresolved
- [ ] All required sections in deliverable documents present
- [ ] Code examples (if any) are syntactically correct

#### 5. Files Updated ✓
- [ ] STATUS.md updated (Last Updated, Current Phase, Completed, In Progress, Next Up, Metrics, Recent Activity)
- [ ] DECISIONS.md updated (if decisions made this session)
- [ ] Handoff created (`LATEST-YYYY-MM-DD-sessionN.md`)
- [ ] Previous handoff archived (`handoffs/planning/archive/`)
- [ ] DEVELOPMENT_LOG.md updated with session entry
- [ ] Any spec files updated (if clarifications made)

**Output Format:**

Add to end of session handoff document:

```markdown
---

## Session End Audit

**Audit Performed:** [Date] at [Time]
**Audit Type:** Quick (15 min)
**Audit Result:** [PASS / PASS with fixes / BLOCKED]

**Issues Found:**
- [NONE] or
- [CRITICAL] Issue description → Fixed
- [MEDIUM] Issue description → Fixed / Documented for next session
- [LOW] Issue description → Documented for Phase-level audit

**Verification:**
- ✅ Math verified
- ✅ Cross-referenced with Session [N-1]
- ✅ Internal consistency confirmed
- ✅ Completeness verified
- ✅ All files updated

**Sign-off:** Session [N] audit complete - [X errors fixed / ZERO errors found]
```

---

### Comprehensive Audit (60-90 min) - **After Session 23 Only**

**Performed:** End of Session 23 (before development starts)

**Purpose:** Final verification that all 10 planning sessions are consistent, complete, and ready for development

**Checklist:**

#### 1. Cross-Document Consistency (All 10 Sessions) ✓
- [ ] Database Schema ↔ API Specification (all endpoints have backing tables)
- [ ] API Specification ↔ Tech Stack (chosen stack can implement all endpoints)
- [ ] Tech Stack ↔ Architecture (architecture uses chosen stack correctly)
- [ ] Architecture ↔ Implementation Plan (plan matches architectural decisions)
- [ ] Implementation Plan ↔ Requirements (all requirements covered in plan)
- [ ] All specs (Q0-Q3.7) ↔ Implementation docs (nothing missed from planning)
- [ ] Cost estimates consistent across all docs (same numbers everywhere)
- [ ] Terminology consistent (e.g., "meal plan" vs "nutrition plan")

#### 2. Technical Compatibility ✓
- [ ] Full tech stack works together (no library conflicts)
- [ ] No architectural conflicts (e.g., client-side vs server-side rendering confusion)
- [ ] All critical requirements implementable with chosen stack
- [ ] Database can handle estimated load (storage, queries)
- [ ] API can handle estimated traffic (requests/sec)
- [ ] Chosen libraries are actively maintained (not deprecated)

#### 3. Completeness ✓
- [ ] All 10 tech stack decisions made
- [ ] All architectural decisions documented
- [ ] All missing information identified and addressed
- [ ] All dependencies mapped
- [ ] All risks identified with mitigation strategies

#### 4. Gap Analysis ✓
- [ ] No missing decisions (e.g., date library, icon library, font loading)
- [ ] No missing documentation sections
- [ ] No unresolved "TBD" or "TODO" items
- [ ] All edge cases from planning specs addressed
- [ ] All assumptions validated

#### 5. Development Readiness ✓
- [ ] Clear starting point for Session 24 (Phase 1: Foundation)
- [ ] All dependencies for Phase 1 satisfied
- [ ] Environment setup documented
- [ ] First few development tasks clearly defined
- [ ] No blockers to starting development

**Output Format:**

Create comprehensive audit report document:

`/project/implementation/PRE_DEVELOPMENT_AUDIT.md`

Include:
- Executive summary
- All issues found (categorized: Critical, High, Medium, Low)
- All fixes applied
- Remaining risks (with mitigation plans)
- Sign-off statement

---

### Phase Completion Audit (30-45 min) - **After Each Development Phase**

**Performed:** After completing Phases 1-11 during development (Sessions 24+)

**Purpose:** Ensure phase completion criteria met before moving to next phase

**Checklist:**

#### 1. Code Quality ✓
- [ ] All tests passing (unit, integration, E2E for this phase)
- [ ] Code coverage ≥80% for new code
- [ ] Code follows CODE_STANDARDS.md
- [ ] No console.logs or debug code left in production code
- [ ] No TypeScript errors or warnings
- [ ] All ESLint rules passing
- [ ] Prettier formatting applied

#### 2. Spec Alignment ✓
- [ ] Implementation matches planning specs (Q1-Q3.7)
- [ ] All acceptance criteria met (from REQUIREMENTS.md)
- [ ] No scope creep (only planned features implemented)
- [ ] UI matches DESIGN_SYSTEM.md specifications
- [ ] API responses match API_SPECIFICATION.md

#### 3. Technical Debt ✓
- [ ] All shortcuts documented (with justification and plan to fix)
- [ ] Items deferred to later phases documented
- [ ] Performance issues identified and tracked
- [ ] Security concerns addressed or documented

#### 4. Documentation ✓
- [ ] API endpoints documented (if new endpoints added)
- [ ] Code comments added where needed
- [ ] README updated if setup changed
- [ ] Migration guide created if breaking changes

#### 5. User Acceptance ✓
- [ ] Phase demo completed with user
- [ ] User feedback documented
- [ ] Critical issues addressed before next phase
- [ ] User approves moving to next phase

**Output Format:**

Add to phase handoff document:

```markdown
---

## Phase [N] Completion Audit

**Phase:** [Name]
**Audit Date:** [Date]
**Features Completed:** [List]
**Tests Added:** [Count] unit, [Count] integration, [Count] E2E

**Quality Metrics:**
- Code Coverage: [X]%
- TypeScript Errors: 0
- ESLint Issues: 0
- Test Pass Rate: 100%

**Spec Alignment:**
- ✅ All acceptance criteria met
- ✅ Matches planning spec [Q#.#]
- ✅ No scope creep

**Technical Debt:**
- [None] or [List items with tickets created]

**User Approval:** ✅ YES / ⚠️ With conditions / ❌ NO

**Next Phase:** [Phase N+1 Name]
```

---

### When Audit Finds Critical Issues

**If Quick Audit (Session-Level) Finds CRITICAL Errors:**

1. **STOP** - Do not create handoff yet
2. **FIX** - Fix critical errors immediately
3. **RE-AUDIT** - Run quick audit again
4. **DOCUMENT** - Note in handoff what was fixed
5. **PROCEED** - Create handoff only after PASS

**If Comprehensive Audit (Session 23) Finds CRITICAL Errors:**

1. **ASSESS** - Determine which sessions introduced the error
2. **FIX** - Fix errors in all affected documents
3. **CROSS-CHECK** - Verify fix doesn't introduce new errors
4. **RE-AUDIT** - Run full comprehensive audit again
5. **SIGN-OFF** - Development starts only after comprehensive audit PASSES

**If Phase Audit (Development) Finds CRITICAL Errors:**

1. **STOP** - Do not proceed to next phase
2. **TRIAGE** - Determine severity and scope
3. **FIX** - Address critical issues before continuing
4. **RE-TEST** - Run all tests again
5. **USER APPROVAL** - Get explicit approval to proceed

---

### Audit Responsibilities

**Claude's Responsibility:**
- Perform audit at appropriate time (session end, phase end)
- Document all issues found
- Fix critical issues before proceeding
- Create audit output in correct format

**User's Responsibility:**
- Review audit results
- Approve fixes
- Decide on priority of non-critical issues
- Give final sign-off to proceed

---

### Audit History

**Session Audits Completed:**
- Session 14: [PENDING - Retroactive audit needed]
- Session 15: [PENDING - Retroactive audit needed]
- Session 16: ✅ COMPLETE (2 critical errors found, fixes in progress)
- Session 17: [PENDING]
- Session 18: [PENDING]
- Session 19: [PENDING]
- Session 20: [PENDING]
- Session 21: [PENDING]
- Session 22: [PENDING]
- Session 23 (Comprehensive): [PENDING]

**Phase Audits Completed:**
- Phase 1 (Foundation): [PENDING]
- Phase 2 (Q1 Onboarding): [PENDING]
- Phase 3 (Home Tab): [PENDING]
- [... etc]

---

## Session-by-Session Plan

---

### ✅ Session 14: Database Schema Design & Approval (COMPLETED)

**Date:** 2025-11-07
**Status:** ✅ COMPLETE
**Duration:** ~2 hours

**Goals:**
- Extract all data structures from Q0-Q3.7 planning specs
- Design complete PostgreSQL schema (25 tables)
- Document design decisions and trade-offs
- Get user approval for schema

**Deliverables:**
- ✅ `/project/implementation/DATABASE_SCHEMA.md` (1,415 lines)
- ✅ 25 table definitions with indexes and constraints
- ✅ Entity Relationship Diagram (ERD)
- ✅ 8 documented design decisions
- ✅ Storage estimates and performance targets
- ✅ User approval obtained

**Outcomes:**
- Complete database schema approved
- Ready to proceed with API consolidation

**Next Session:** API Endpoint Consolidation

---

### 📋 Session 15: API Endpoint Consolidation

**Estimated Date:** TBD
**Status:** PENDING
**Estimated Duration:** 2-3 hours

**Goals:**
- Extract all API endpoints from Q1-Q3.7 specs
- Consolidate into master API specification
- Define request/response formats
- Establish authentication strategy
- Document error response standards

**Tasks:**
1. Read through all 12 planning specs and extract API endpoints
2. Organize endpoints by resource (users, meals, workouts, logging, etc.)
3. Define standard request/response format (JSON structure)
4. Document authentication requirements per endpoint (public vs protected)
5. Establish error response format (4xx, 5xx codes)
6. Define rate limiting strategy
7. Document pagination standards (for history, lists)
8. Create OpenAPI/Swagger spec (optional but recommended)

**Deliverables:**
- `/project/implementation/API_SPECIFICATION.md`
- Complete list of ~50-60 API endpoints
- Request/response schemas
- Authentication strategy
- Error handling standards
- Rate limiting rules

**Estimated Endpoints by Feature:**
- Auth & Users: ~8 endpoints
- Meal Plans & Meals: ~12 endpoints
- Workout Plans & Workouts: ~10 endpoints
- Logging: ~8 endpoints
- Progress & Analytics: ~10 endpoints
- History & Saved: ~9 endpoints (from Q3.6)
- Offline Sync: ~3 endpoints (from Q3.7)
- Settings & Profile: ~6 endpoints
- Support & Billing: ~4 endpoints

**Dependencies:**
- Database schema (Session 14) ✅

**Success Criteria:**
- All endpoints from specs extracted
- Consistent naming convention (RESTful)
- Complete request/response documentation
- User approval obtained

**Next Session:** Tech Stack Finalization

---

### 📋 Session 16: Tech Stack Finalization

**Estimated Date:** TBD
**Status:** PENDING
**Estimated Duration:** 1-2 hours

**Goals:**
- Finalize all pending tech stack decisions
- Document rationale for each choice
- Log decisions in DECISIONS.md

**Pending Decisions:**

**1. UI Component Library**
- Options: React Native Paper, NativeBase, custom components
- Recommendation: React Native Paper
- Rationale: Material Design 3, well-maintained, TypeScript support, matches glassmorphism aesthetic

**2. State Management**
- Options: Context API, Zustand, Redux Toolkit
- Recommendation: Zustand
- Rationale: Simple, performant, TypeScript support, less boilerplate than Redux, more scalable than Context API

**3. Payment Processor**
- Options: Stripe, RevenueCat
- Recommendation: RevenueCat
- Rationale: Specialized for subscriptions, handles App Store/Play Store complexity, built-in analytics

**4. Navigation Library**
- Already decided: React Navigation
- Confirm version and structure

**5. Form Library**
- Options: React Hook Form, Formik
- Recommendation: React Hook Form
- Rationale: Better performance, smaller bundle, TypeScript support

**6. Testing Framework**
- Options: Jest + React Native Testing Library, Detox
- Recommendation: Jest + RNTL (unit/integration), Detox (E2E)

**7. API Client**
- Options: Axios, Fetch, tRPC
- Recommendation: Axios
- Rationale: Interceptors for auth, better error handling, timeout support

**8. Offline Storage**
- Already decided: AsyncStorage + MMKV (for performance-critical data)

**9. Error Tracking**
- Options: Sentry, Bugsnag
- Recommendation: Sentry
- Rationale: Best React Native support, performance monitoring, free tier

**10. Analytics**
- Options: PostHog, Mixpanel, Amplitude
- Recommendation: PostHog
- Rationale: Self-hosted option, privacy-friendly, session replay

**Tasks:**
1. Review each pending decision
2. Research pros/cons if needed
3. Make final choice for each
4. Document rationale in DECISIONS.md
5. Update ARCHITECTURE.md with finalized stack

**Deliverables:**
- Updated `/project/DECISIONS.md` (10 new tech stack decisions)
- Tech stack section in ARCHITECTURE.md (to be created Session 17)
- Finalized dependencies list

**Dependencies:**
- None (can be done independently)

**Success Criteria:**
- All 10 pending decisions finalized
- Rationale documented for each
- User approval obtained

**Next Session:** Architecture Document Creation

---

### 📋 Session 17: Architecture Document

**Estimated Date:** TBD
**Status:** PENDING
**Estimated Duration:** 3-4 hours

**Goals:**
- Create comprehensive architecture document
- Document folder structure for backend and mobile
- Define deployment architecture
- Establish patterns and conventions

**Tasks:**

**1. Tech Stack Summary**
- Consolidate all tech decisions from Session 16
- Create dependency tree
- Document version requirements

**2. Backend Architecture**
- Folder structure (controllers, services, routes, models, middleware)
- API design patterns (RESTful conventions)
- Authentication flow (JWT, refresh tokens)
- Authorization strategy (role-based? user-based?)
- Database connection pooling
- Logging strategy
- Error handling middleware

**3. Mobile App Architecture**
- Folder structure (screens, components, navigation, services, store, utils, types)
- Component hierarchy
- Navigation structure (3-tab bottom nav)
- State management patterns (Zustand store structure)
- API service layer design
- Offline sync architecture (queue, cache, conflict resolution)
- Push notification handling

**4. Deployment Architecture**
- Backend: Render.com (Node.js + PostgreSQL)
- Mobile: Expo build service → App Store + Play Store
- Environment management (dev, staging, production)
- CI/CD pipeline (GitHub Actions?)
- Monitoring and alerts

**5. Security Architecture**
- Authentication flow (Firebase Auth + custom JWT)
- API key management (OpenAI API key)
- Environment variables (.env)
- HTTPS enforcement
- Data encryption (at rest, in transit)
- GDPR compliance strategy

**6. Performance Architecture**
- Caching strategy (Redis? In-memory?)
- Database query optimization (indexes from Session 14)
- API response compression
- Image optimization (CDN?)
- Lazy loading strategies

**Deliverables:**
- `/project/implementation/ARCHITECTURE.md` (~2,000-3,000 lines)
- Backend folder structure diagram
- Mobile app folder structure diagram
- Deployment diagram
- Authentication flow diagram
- Offline sync flow diagram

**Dependencies:**
- Database schema (Session 14) ✅
- Tech stack finalization (Session 16)

**Success Criteria:**
- Complete architecture documented
- All architectural decisions explained
- Diagrams clear and accurate
- User approval obtained

**Next Session:** Implementation Plan (Build Order)

---

### 📋 Session 18: Implementation Plan (Build Order)

**Estimated Date:** TBD
**Status:** PENDING
**Estimated Duration:** 2-3 hours

**Goals:**
- Define build order (which features to implement first)
- Break specs into buildable phases
- Create dependency graph
- Estimate timeline for each phase

**Tasks:**

**1. Analyze Dependencies**
- Which features depend on others?
- What must be built before what?
- What can be built in parallel?

**2. Define Build Phases**

**Recommended Sequence:**

**Phase 1: Foundation (2-3 weeks)**
- Backend project setup (Express, PostgreSQL, Prisma)
- Database migrations (25 tables)
- Authentication system (Firebase Auth + JWT)
- Mobile project setup (React Native + Expo)
- Navigation shell (3-tab bottom nav)
- Basic UI components (buttons, cards, inputs)
- API client setup (Axios + interceptors)

**Phase 2: Q1 Onboarding (1-2 weeks)**
- Backend: User registration, BMR/TDEE calculations
- Mobile: 17-step onboarding flow
- Implement all scroll pickers, validations
- Value demonstration screens
- Paywall integration (RevenueCat)

**Phase 3: Q3.0 Home Tab Foundation (1 week)**
- Backend: Meal plan & workout plan generation (OpenAI integration)
- Mobile: Home tab dual-mode toggle
- Russian doll progress circles (nutrition)
- Segmented time circle (workout)
- Day selector
- Today's meal/workout display

**Phase 4: Q2 Meal Planning + Q3.4 Weekly Planning (2-3 weeks)**
- Backend: AI meal generation, grocery consolidation
- Mobile: Daily meal detail screen, recipe view
- Grocery list generation and display
- Weekly regeneration flow
- Meal feedback system

**Phase 5: Q3.2 AI Logging + Log Tab (2 weeks)**
- Backend: AI meal parsing (GPT-4o-mini), workout parsing
- Mobile: Log tab AI-powered text input
- Follow-up question flow
- Confirmation screens
- Manual entry fallback
- Weight logging

**Phase 6: Q3.3 Swapping Systems (1-2 weeks)**
- Backend: Meal swap algorithm, workout library
- Mobile: Swap modals, alternatives selection
- Macro matching, compatibility scoring
- Optimistic locking (version field)
- 3-second undo toast

**Phase 7: Q3.5 Progress Analytics (2-3 weeks)**
- Backend: Daily/weekly aggregation, trend calculation
- Mobile: Weight graph with trend line
- Weekly/monthly summaries
- Streak system
- Achievement system (25 badges)
- AI insights generation
- Body measurements

**Phase 8: Q3.6 History & Saved Items (1-2 weeks)**
- Backend: Week pagination, search ranking
- Mobile: History screen, Saved screen
- Export functionality (CSV/PDF)
- Quick-add to today
- Denormalized SavedItem table

**Phase 9: Q3.7 Offline Mode & Sync (2-3 weeks)**
- Backend: Batch sync API, conflict resolution
- Mobile: Offline queue, cache management
- Network detection, offline banner
- Sync queue viewer
- Background sync

**Phase 10: Q3.1 Settings & Profile (1 week)**
- Backend: Profile update, preferences
- Mobile: Settings screens, profile editing
- Subscription management
- Support ticket system
- Privacy & data export

**Phase 11: Polish & QA (2-3 weeks)**
- Bug fixes from testing
- Performance optimization
- Accessibility improvements
- App Store assets
- Beta testing
- Final QA

**3. Create Dependency Graph**
- Visual diagram showing which phases depend on which
- Identify critical path

**4. Estimate Timeline**
- Realistic estimates per phase
- Buffer for unknowns
- Total MVP timeline estimate

**Deliverables:**
- `/project/implementation/PLAN.md` (~1,500-2,000 lines)
- Build order (11 phases defined)
- Dependency graph diagram
- Timeline estimates
- Milestone definitions

**Dependencies:**
- All planning specs (Q0-Q3.7) ✅
- Architecture document (Session 17)

**Success Criteria:**
- Clear build sequence defined
- Dependencies mapped
- Realistic timeline estimates
- User approval obtained

**Next Session:** Code Standards Document

---

### 📋 Session 19: Code Standards Document

**Estimated Date:** TBD
**Status:** PENDING
**Estimated Duration:** 1-2 hours

**Goals:**
- Define coding standards and conventions
- Establish testing requirements
- Document Git workflow
- Create PR review checklist

**Tasks:**

**1. Naming Conventions**
- Files: kebab-case, PascalCase, camelCase (when to use what)
- Components: PascalCase (e.g., `MealCard.tsx`)
- Functions: camelCase (e.g., `calculateBMR()`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `MAX_RETRIES`)
- Database tables: snake_case (already defined in Session 14)
- API endpoints: kebab-case (e.g., `/api/meal-plans`)

**2. Code Organization**
- Component structure (props, state, hooks, render, styles)
- File ordering (imports → interfaces → component → exports → styles)
- Folder structure rules (when to create new folder)
- Barrel exports (index.ts files)

**3. TypeScript Standards**
- Strict mode enabled
- No `any` types (use `unknown` if truly unknown)
- Interface vs Type (when to use each)
- Enum vs Union types
- Generic type naming (T, K, V conventions)

**4. React/React Native Standards**
- Functional components only (no class components)
- Custom hooks naming (`use` prefix)
- Props interface naming (`<Component>Props`)
- Memo usage guidelines
- useCallback/useMemo guidelines

**5. Testing Requirements**
- Unit tests: All utility functions, all calculations
- Integration tests: API endpoints, complex workflows
- Component tests: All screens, all components with logic
- E2E tests: Critical user flows (onboarding, logging, checkout)
- Code coverage target: 80% minimum

**6. Git Workflow**
- Branch naming: `feature/`, `fix/`, `refactor/`, `test/`
- Commit message format: `type(scope): message` (Conventional Commits)
- PR title format
- When to rebase vs merge

**7. PR Review Checklist**
- Code follows standards
- Tests written and passing
- No console.logs left in code
- TypeScript errors resolved
- Accessibility tested
- Performance considered
- Documentation updated if needed

**8. Error Handling Standards**
- Try/catch patterns
- Error logging (Sentry)
- User-facing error messages (friendly, actionable)
- Fallback UI for errors

**9. Performance Standards**
- No unnecessary re-renders (use React DevTools Profiler)
- Lazy load images
- Debounce user input
- Pagination for long lists
- Virtualized lists for 50+ items

**10. Accessibility Standards**
- WCAG 2.1 AA compliance
- Screen reader support
- Touch target sizes (44×44px minimum)
- Color contrast ratios
- Keyboard navigation (web)

**Deliverables:**
- `/project/implementation/CODE_STANDARDS.md` (~1,000-1,500 lines)
- ESLint configuration file
- Prettier configuration file
- TypeScript configuration (tsconfig.json)
- Jest configuration
- Example code snippets

**Dependencies:**
- Architecture document (Session 17)

**Success Criteria:**
- Clear standards documented
- Enforceable with linters
- Examples provided
- User approval obtained

**Next Session:** Development Setup Guide

---

### 📋 Session 20: Development Setup Guide

**Estimated Date:** TBD
**Status:** PENDING
**Estimated Duration:** 1-2 hours

**Goals:**
- Document step-by-step local development setup
- Create environment variable templates
- Document how to run backend and mobile locally
- Establish database setup procedures

**Tasks:**

**1. Prerequisites**
- Node.js version (v18+)
- npm or yarn version
- PostgreSQL installation
- Expo CLI
- iOS Simulator (Mac only) or Android Studio
- Git

**2. Backend Setup**
```bash
# Clone repository
git clone https://github.com/user/weightgpt.git
cd weightgpt/backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your values
# DATABASE_URL, JWT_SECRET, OPENAI_API_KEY, etc.

# Run database migrations
npx prisma migrate dev

# Seed database with achievements
npm run seed

# Start development server
npm run dev
```

**3. Mobile App Setup**
```bash
# Navigate to mobile directory
cd ../mobile

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with API_URL, etc.

# Start Expo development server
npm start

# Press 'i' for iOS simulator
# Press 'a' for Android emulator
```

**4. Database Setup**
- PostgreSQL local installation steps
- Creating development database
- Running migrations
- Seeding data
- Connecting to Render.com staging database (optional)

**5. Environment Variables**

**Backend `.env.example`:**
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/weightgpt_dev

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
FIREBASE_PROJECT_ID=your-firebase-project

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Stripe/RevenueCat
REVENUECAT_API_KEY=...

# Server
PORT=3000
NODE_ENV=development

# Sentry (optional for dev)
SENTRY_DSN=...
```

**Mobile `.env.example`:**
```bash
# API
API_URL=http://localhost:3000
API_TIMEOUT=30000

# Firebase
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...

# RevenueCat
REVENUECAT_PUBLIC_KEY=...

# Environment
ENV=development
```

**6. Running Tests**
```bash
# Backend tests
cd backend
npm test

# Mobile tests
cd mobile
npm test

# E2E tests (Detox)
cd mobile
npm run e2e:ios
```

**7. Debugging**
- Using Chrome DevTools for backend
- Using React Native Debugger
- Using Flipper
- Using Xcode/Android Studio debuggers

**8. Common Issues & Troubleshooting**
- Port already in use
- Database connection errors
- Expo build errors
- Module not found errors
- Simulator/emulator issues

**Deliverables:**
- `/project/implementation/DEVELOPMENT_SETUP_GUIDE.md` (~1,000 lines)
- `.env.example` files for backend and mobile
- Database setup scripts
- Troubleshooting guide

**Dependencies:**
- Architecture document (Session 17)
- Database schema (Session 14)

**Success Criteria:**
- Any developer can follow guide and get running
- All environment variables documented
- Common issues addressed
- User approval obtained

**Next Session:** Requirements Document

---

### 📋 Session 21: Requirements Document

**Estimated Date:** TBD
**Status:** PENDING
**Estimated Duration:** 1-2 hours

**Goals:**
- Extract user stories from planning specs
- Define acceptance criteria for each feature
- Document non-functional requirements
- Establish success metrics

**Tasks:**

**1. User Stories (from Q1-Q3.7)**

Extract and format all user stories:

**Example Format:**
```
**US-001: Complete Onboarding**
As a new user
I want to complete a quick onboarding flow
So that I can get a personalized meal and workout plan

Acceptance Criteria:
- [ ] Can complete all 17 steps without typing
- [ ] Receives accurate BMR/TDEE calculations
- [ ] Sees personalized weight projection graph
- [ ] Completes in under 2 minutes
```

Estimate: ~50-70 user stories across all features

**2. Functional Requirements**
- All features from planning specs
- Organized by quarter (Q1, Q2, Q3.x)
- Mapped to user stories

**3. Non-Functional Requirements**

**Performance:**
- App launch: <2s on modern devices
- API response time: <500ms (p95)
- AI generation: <20s for meal plans
- Weight graph render: <500ms
- Offline sync: <10s for 24h of queued actions

**Scalability:**
- Support 100,000 concurrent users
- Handle 1M API requests/day
- Database: 2.5 TB for 100K users

**Reliability:**
- 99.9% uptime
- Zero data loss
- Graceful degradation when AI unavailable

**Security:**
- HTTPS only
- JWT authentication
- Encrypted passwords (bcrypt)
- GDPR compliant
- HIPAA considerations (health data)

**Usability:**
- WCAG 2.1 AA compliance
- Support iOS 14+ and Android 10+
- Works on all screen sizes (iPhone SE to iPad Pro)

**4. Success Metrics**

**Acquisition:**
- App store impressions: Track
- Downloads: Track
- Onboarding start rate: >70%

**Activation:**
- Onboarding completion: >70%
- Paywall conversion: >40%

**Engagement:**
- DAU: Track
- Logging frequency: >5 meals/week
- Plan adherence: >60%

**Retention:**
- Day 1: >60%
- Day 7: >40%
- Day 30: >30%

**Revenue:**
- MRR: Track
- ARPU: Target $8/user
- LTV:CAC ratio: >3:1

**Deliverables:**
- `/project/implementation/REQUIREMENTS.md` (~1,500 lines)
- All user stories extracted and formatted
- Non-functional requirements documented
- Success metrics defined

**Dependencies:**
- All planning specs (Q0-Q3.7) ✅

**Success Criteria:**
- All features have user stories
- Acceptance criteria clear
- Metrics measurable
- User approval obtained

**Next Session:** Development Workflow for Claude

---

### 📋 Session 22: Development Workflow for Claude

**Estimated Date:** TBD
**Status:** PENDING
**Estimated Duration:** 1 hour

**Goals:**
- Create Claude-specific instructions for development context
- Define initialization protocol for development sessions
- Establish commit and testing protocols
- Document handoff requirements

**Tasks:**

**1. Create `.claude-instructions/DEVELOPMENT-CONTEXT.md`**

Define:
- Required reading for development context initialization
- How to start a development session
- Which docs to read in what order
- How to choose what to work on

**2. Development Session Protocol**

**Session Start:**
1. Read `.claude-instructions/HOW-TO-USE-THIS-PROJECT.md`
2. Read `.claude-instructions/DEVELOPMENT-CONTEXT.md`
3. Read `project/STATUS.md`
4. Read `handoffs/development/LATEST-YYYY-MM-DD.md`
5. Read `project/implementation/PLAN.md` (current phase)
6. Read relevant planning spec (e.g., Q1 if building onboarding)
7. Confirm with user what to work on

**During Development:**
1. Follow CODE_STANDARDS.md
2. Write tests for all new code
3. Run tests before committing
4. Commit frequently with clear messages
5. Update implementation docs if architecture changes

**Session End:**
1. Run all tests (must pass)
2. Update STATUS.md
3. Update PLAN.md (mark completed steps)
4. Create handoff document
5. Update DEVELOPMENT_LOG.md

**3. Commit Protocol**

**Commit Message Format:**
```
type(scope): brief description

Longer description if needed

Implements: Q1 Step 5 (Goal Date Screen)
Tests: Added unit tests for timeline validation
```

**Types:** feat, fix, refactor, test, docs, style, chore

**When to Commit:**
- After completing a logical unit of work
- After all tests pass
- Before switching tasks
- At end of session (if work in progress)

**4. Testing Protocol**

**Before Committing:**
```bash
# Run all tests
npm test

# Check TypeScript errors
npm run typecheck

# Check linting
npm run lint

# Check formatting
npm run format:check
```

**Test Coverage:**
- Minimum 80% coverage
- 100% coverage for calculations (BMR, TDEE, macros)
- All API endpoints have integration tests
- All screens have component tests

**5. Code Review (if pair programming)**
- Self-review checklist
- When to ask for review
- How to respond to feedback

**6. Handoff Requirements for Development**

**Must Include:**
- What was built
- What tests were written
- What's left to do
- Any blockers encountered
- Decisions made
- Files modified

**Deliverables:**
- `.claude-instructions/DEVELOPMENT-CONTEXT.md` (~500 lines)
- Development session checklist
- Commit guidelines
- Testing requirements

**Dependencies:**
- CODE_STANDARDS.md (Session 19)
- PLAN.md (Session 18)

**Success Criteria:**
- Clear development workflow defined
- Claude knows exactly what to do
- User approval obtained

**Next Session:** Final Pre-Development Review

---

### 📋 Session 23: Final Pre-Development Review & Checklist

**Estimated Date:** TBD
**Status:** PENDING
**Estimated Duration:** 1-2 hours

**Goals:**
- Review all pre-development documentation
- Create final checklist before coding begins
- Ensure nothing is missing
- Get final approval to begin development

**Tasks:**

**1. Document Review**

Review all created documents:
- ✅ DATABASE_SCHEMA.md (Session 14)
- ⏳ API_SPECIFICATION.md (Session 15)
- ⏳ Tech Stack Decisions in DECISIONS.md (Session 16)
- ⏳ ARCHITECTURE.md (Session 17)
- ⏳ PLAN.md (Session 18)
- ⏳ CODE_STANDARDS.md (Session 19)
- ⏳ DEVELOPMENT_SETUP_GUIDE.md (Session 20)
- ⏳ REQUIREMENTS.md (Session 21)
- ⏳ DEVELOPMENT-CONTEXT.md (Session 22)

**2. Completeness Check**

Ensure each document has:
- Clear purpose and scope
- Complete information (no TBDs)
- Examples where helpful
- User approval obtained
- Proper footer with version and dates

**3. Consistency Check**

Verify consistency across documents:
- API endpoints match database schema
- Tech stack consistent in all docs
- Build order matches dependencies
- Code standards align with architecture
- Requirements align with planning specs

**4. Create Pre-Development Checklist**

```markdown
## Pre-Development Checklist

**Documentation:**
- [x] Database schema designed and approved
- [ ] API specification complete
- [ ] Tech stack finalized
- [ ] Architecture documented
- [ ] Implementation plan created
- [ ] Code standards defined
- [ ] Development setup guide written
- [ ] Requirements documented
- [ ] Development workflow established

**Decisions:**
- [ ] All tech stack decisions made
- [ ] All architecture decisions made
- [ ] All logged in DECISIONS.md

**Setup:**
- [ ] Backend project structure defined
- [ ] Mobile project structure defined
- [ ] Environment variables templated
- [ ] Database migrations planned
- [ ] CI/CD pipeline outlined

**Readiness:**
- [ ] User approves all documentation
- [ ] Development can begin immediately after Session 23
- [ ] Clear next steps defined (Phase 1: Foundation)
```

**5. Gap Analysis**
- Identify any missing documentation
- Create tasks to fill gaps
- Estimate additional time needed

**6. Final User Approval**
- Present all documentation
- Walk through implementation plan
- Confirm ready to begin development
- Get explicit approval to proceed

**Deliverables:**
- Pre-development checklist (completed)
- Gap analysis report
- Final approval from user
- Transition plan to Session 24 (Development Phase begins)

**Dependencies:**
- All Sessions 14-22 complete

**Success Criteria:**
- All documentation complete
- No critical gaps
- User confident in plan
- Ready to begin coding

**Next Session:** Session 24 - Development Begins (Phase 1: Foundation)

---

## Summary

### Sessions 14-23: Development Planning (10 sessions)

| Session | Focus | Deliverable | Status |
|---------|-------|-------------|--------|
| 14 | Database Schema | DATABASE_SCHEMA.md | ✅ COMPLETE |
| 15 | API Consolidation | API_SPECIFICATION.md | PENDING |
| 16 | Tech Stack | 10 tech decisions | PENDING |
| 17 | Architecture | ARCHITECTURE.md | PENDING |
| 18 | Implementation Plan | PLAN.md | PENDING |
| 19 | Code Standards | CODE_STANDARDS.md | PENDING |
| 20 | Dev Setup Guide | DEVELOPMENT_SETUP_GUIDE.md | PENDING |
| 21 | Requirements | REQUIREMENTS.md | PENDING |
| 22 | Dev Workflow | DEVELOPMENT-CONTEXT.md | PENDING |
| 23 | Final Review | Pre-dev checklist | PENDING |

### Session 24+: Development Execution

**Phase 1: Foundation** (Sessions 24-30)
- Backend setup
- Mobile setup
- Database migrations
- Authentication system

**Phase 2: Q1 Onboarding** (Sessions 31-35)
- 17-step onboarding flow
- BMR/TDEE calculations
- Paywall integration

**Phase 3-11:** Continue through implementation plan...

---

## Flexibility Note

This plan is a **guideline**, not a strict requirement. Sessions may:
- Take more or less time than estimated
- Be combined if topics are smaller than expected
- Be split if topics are larger than expected
- Change order if dependencies allow

The key is to **complete all pre-development documentation** before Session 24.

---

**Document Version:** 1.0
**Created:** 2025-11-07
**Last Updated:** 2025-11-07
**Status:** Active
**Next Update:** After each completed session
