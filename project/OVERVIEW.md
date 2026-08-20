# WeightGPT Project Overview

**Project Name:** WeightGPT
**Type:** Mobile Application (iOS & Android)
**Category:** Health & Fitness - Weight Management
**Target Users:** Individuals seeking to gain, lose, or maintain weight through personalized plans

---

## Vision

Create a comprehensive, user-friendly mobile application that helps users achieve their weight goals through AI-powered personalized meal plans, custom workout programs, and intelligent progress tracking - with continuous learning from user feedback to improve recommendations over time.

---

## Core Value Proposition

**For users who struggle with generic diet and fitness plans that don't fit their life,**
**WeightGPT is a personalized weight management app that creates custom meal and workout plans tailored to your goals, schedule, preferences, and equipment - and learns from your feedback to get better over time.**

**Unlike one-size-fits-all apps,**
**WeightGPT adapts to your real life: your cooking skills, your available time, your food preferences, your workout days, and your equipment access.**

---

## Success Criteria

### User Success
- Users complete onboarding in < 2 minutes
- Users reach their weight goal at a safe, sustainable pace
- High adherence rate (users stick with the plan)
- Plans adapt to user preferences (thumbs up/down feedback)
- Users feel the plan fits their lifestyle

### Business Success
- High onboarding completion rate (target: >70%)
- Strong paywall conversion (target: >40%)
- High retention (target: >60% at 30 days)
- Low churn after first month

### Technical Success
- Fast, responsive mobile UX
- Reliable AI plan generation (< 20s)
- Accurate calorie/macro calculations
- Zero critical bugs in production
- Offline capability for core features

---

## Core Features (MVP)

### 1. Onboarding Flow
- 16-step question sequence (zero typing required)
- Personal metrics collection (weight, height, age, sex, activity level)
- Comprehensive dietary preferences
- Workout preferences and schedule
- Timeline validation with safety checks
- AI-powered plan generation
- Value demonstration before paywall

### 2. Meal Planning
- AI-generated weekly meal plans
- Personalized to dietary preferences and goals
- Respect cooking context and time constraints
- Learning system (thumbs up/down feedback)
- Weekly auto-regeneration based on shopping day
- Shopping list generation
- Meal swapping capability

### 3. Meal Tracking
- Search-based meal logging
- Manual entry option
- Daily calorie and macro tracking
- Progress visualization
- Meal history

### 4. Workout Plans
- AI-generated weekly workout programs
- Personalized to equipment access and goals
- Respects user's preferred workout days
- Proper muscle group spacing (48hr minimum)
- Exercise instructions and form cues
- Progressive overload tracking
- Workout logging

### 5. Progress Tracking
- Daily weight logging
- Weight projection graph
- Progress toward goal visualization
- Milestone celebrations
- Trend analysis

### 6. AI Integration
- OpenAI API for meal and workout generation
- Learns from user feedback over time
- Adapts recommendations based on preferences

---

## Key Design Principles

### UX Principles
1. **Mobile-First** - Optimized for touch interfaces
2. **Zero Friction** - Minimize typing, maximize tapping/scrolling
3. **User Control** - Respect schedules, preferences, and choices
4. **Instant Feedback** - Show results immediately when possible
5. **Progressive Disclosure** - Don't overwhelm, reveal complexity gradually

### Technical Principles
1. **Reliability First** - Never lose user data
2. **Performance** - Fast loading, smooth interactions
3. **Accessibility** - WCAG 2.1 AA compliance minimum
4. **Privacy** - User data storage preferences respected
5. **Scalability** - Architecture supports growth

### Product Principles
1. **Demonstrate Value Early** - Show personalized results before paywall
2. **Continuous Learning** - Plans improve based on user feedback
3. **Sustainable Habits** - Encourage healthy, long-term behavior
4. **Realistic Expectations** - Safe weight change rates, honest projections
5. **User Autonomy** - Provide recommendations but let users decide

---

## Target User Personas

### Primary: "Busy Professional Sarah"
- Age: 28-35
- Goal: Lose 15-20 lbs
- Challenge: Limited time to cook, unpredictable schedule
- Needs: Quick meal prep options, flexible workout days
- Tech-savvy: Yes
- Cooking skills: Basic to intermediate

### Secondary: "Fitness Beginner Mike"
- Age: 23-30
- Goal: Gain 10-15 lbs (muscle)
- Challenge: No gym access, limited equipment
- Needs: Home workout plans, high-protein meal ideas
- Tech-savvy: Yes
- Cooking skills: Basic

### Tertiary: "Health-Conscious Emma"
- Age: 35-45
- Goal: Maintain weight, improve body composition
- Challenge: Food allergies, specific dietary preferences
- Needs: Customized meal plans that respect restrictions
- Tech-savvy: Moderate
- Cooking skills: Intermediate to advanced

---

## Competitive Differentiation

**vs. MyFitnessPal:**
- WeightGPT generates complete meal plans (not just tracking)
- AI-powered personalization improves over time
- Complete workout plans included

**vs. Noom:**
- WeightGPT provides specific meals and recipes (not just coaching)
- Respects user's actual schedule and preferences
- One-time payment vs. expensive monthly subscription

**vs. Lose It!:**
- WeightGPT creates full plans (not just goal setting)
- AI learns from feedback to improve recommendations
- Integrated workouts (not just nutrition)

**Unique Selling Points:**
1. True AI personalization (not templates)
2. Zero-typing onboarding (fastest in category)
3. Learns from user feedback (gets better over time)
4. Respects real life (your schedule, your equipment, your preferences)
5. Complete solution (nutrition + fitness + tracking)

---

## Technology Stack (Planned)

**Frontend:**
- React Native (cross-platform iOS & Android)
- React Native Paper or NativeBase (UI components)
- React Navigation (routing)
- Context API or Zustand (state management)
- AsyncStorage (local data)

**Backend:**
- Node.js + Express (API server)
- PostgreSQL or MongoDB (database)
- Render.com (hosting)
- OpenAI API (GPT-4 for plan generation)

**Services:**
- Authentication: TBD (Firebase Auth or Clerk)
- Payments: Stripe or RevenueCat
- Analytics: PostHog or Mixpanel
- Error Tracking: Sentry

---

## Revenue Model

**Freemium with Trial:**
- Free: Complete onboarding, see personalized projections
- Paywall: After value demonstration (weight graph, nutrition targets, workout schedule)
- Subscription: Monthly or annual access to full plans
- Optional: One-time lifetime purchase

**Pricing (Initial):**
- Monthly: $9.99
- Annual: $59.99 (save 50%)
- Lifetime: $149.99 (limited time)

---

## Development Phases

### Phase 1: Planning (Current)
- Q1: Onboarding Flow ✅
- Q2: Meal Planning 🔄
- Q3: Meal Tracking 📋
- Q4: Weight Logging 📋
- Q5: Workout Plans 📋
- Q6: AI Integration 📋
- Q7: Additional Features 📋

### Phase 2: Architecture & Implementation Planning
- Database schema design
- API endpoint design
- Tech stack finalization
- Implementation roadmap

### Phase 3: MVP Development
- Core onboarding
- Meal plan generation
- Workout plan generation
- Basic tracking
- Paywall integration

### Phase 4: Testing & Refinement
- User testing
- Bug fixes
- Performance optimization
- UX improvements

### Phase 5: Launch Preparation
- App store assets
- Marketing materials
- Beta testing
- Soft launch

### Phase 6: Post-Launch
- User feedback integration
- Feature enhancements (camera logging, barcode scanning)
- Social features
- Advanced analytics

---

## Constraints & Considerations

### Technical Constraints
- OpenAI API rate limits (need tier 2+ for production)
- Mobile app store review requirements
- Device storage limits (offline meal plans)
- Network connectivity (handle offline gracefully)

### Legal/Compliance
- Health disclaimer required (not medical advice)
- Data privacy (GDPR, CCPA compliance)
- Payment processing (PCI compliance via Stripe)
- Terms of service and privacy policy

### User Safety
- Safe weight change rate validation (max 2 lbs/week loss, 1 lb/week gain)
- Warning systems for aggressive timelines
- Encourage users to consult doctors
- No extreme calorie restrictions (min 1200 for women, 1500 for men)

---

## Future Enhancements (Phase 2+)

### Advanced Features
- Camera-based food logging (OpenAI Vision API)
- Barcode scanning for packaged foods
- Fitness tracker integrations (Apple Health, Google Fit)
- Social features (challenges, sharing)
- AI coach chat (conversational guidance)
- Recipe videos
- Form check (camera-based exercise validation)
- Smart scale integration
- Advanced analytics and insights

### Expansion Opportunities
- Meal delivery service partnership
- Personal trainer marketplace
- Nutritionist consultations
- Corporate wellness programs
- International markets (localization)

---

## Key Metrics to Track

### Acquisition
- App store impressions
- Downloads
- Onboarding start rate

### Activation
- Onboarding completion rate
- Value demo engagement
- Paywall conversion rate

### Engagement
- Daily active users (DAU)
- Weekly active users (WAU)
- Meal logging frequency
- Workout logging frequency
- Weight logging frequency

### Retention
- Day 1, 7, 30 retention
- Churn rate
- Plan adherence rate

### Revenue
- Monthly recurring revenue (MRR)
- Average revenue per user (ARPU)
- Lifetime value (LTV)
- Customer acquisition cost (CAC)

### Quality
- User satisfaction (NPS score)
- Support tickets per user
- Bug reports
- App store rating

---

## Instructions for Claude

### When to Update This Document
- **Rarely** - only for major scope changes
- Get user approval before updating
- This is the foundation - it should be stable

### If Update Needed
1. Get explicit user permission
2. Increment version number (major change)
3. Add to Revisions section below
4. Log in DECISIONS.md
5. Notify in handoff document

### Don't Update For
- Small clarifications (discuss with user first)
- Implementation details (those go in ARCHITECTURE.md)
- Feature specifics (those go in planning/Q[N] specs)

---

## Revisions

### v1.0 - 2025-11-04
**Initial version** - Project overview created during reorganization

---

**Document Version:** 1.0
**Created:** 2025-11-04
**Last Updated:** 2025-11-04 14:30
**Status:** Finalized
**Next Review:** Before Phase 2 (Architecture & Implementation Planning)
