# Phase 7 TODO: AI-Powered Workout Swapping

**Status:** DEFERRED - Library-based approach adopted
**Priority:** Low (Analytics-driven decision needed)
**Estimated Time:** 2-3 days (if needed)

---

## Decision: Library-Based Approach (2025-11-24)

**Recommendation:** Use expanded 100-workout library instead of AI generation for Phase 7.

**Rationale:**
- Workouts have **~30-50 common exercise combinations** vs meals (infinite variety)
- **Library lookups are instant** vs 5-10 second AI generation
- **Token cost**: $0 for library vs ~$0.01-0.02 per AI generation
- **Current swap functionality works great** with 100-workout library

**Current Implementation:**
- ✅ 100-workout library seed with variety across:
  - Fitness levels: Beginner, Intermediate, Advanced
  - Equipment: Bodyweight, dumbbells, barbells, machines, specialized
  - Goals: Lose weight, maintain, gain weight
  - Types: Strength (60), Cardio (30), Balanced/Hybrid (10)
- ✅ Quick Swap uses library filtering by equipment, duration, type, goal
- ✅ Compatibility scoring for swap suggestions

**Phase 7 AI Features (DEFERRED until user data shows need):**
- Generate 3 new workout alternatives on-demand
- AI-powered exercise variation
- Smart progression recommendations

---

## Implementation Tasks

### 1. Backend: AI Workout Generation for Swapping
**File:** `backend/src/services/openai/workoutGeneration.service.ts`

Add function:
```typescript
export async function generateWorkoutAlternatives(
  userId: string,
  originalWorkout: {
    name: string;
    type: 'strength' | 'cardio';
    durationMin: number;
    estimatedCalories: number;
    workoutCategory: string;
  }
): Promise<{ alternatives: GeneratedWorkout[] }>
```

**OpenAI Prompt:**
- Generate 3 workout alternatives
- Match: Duration (±10 min), Calories (±50), Type, Equipment available
- Compatibility scoring: Equipment 40%, Duration 30%, Goal 20%, Fitness 10%

### 2. Backend: API Endpoint
**File:** `backend/src/routes/workoutPlan.routes.ts`

Add endpoint:
```typescript
POST /api/workout-plans/workouts/:id/generate-alternatives
// Returns: { alternatives: [workout1, workout2, workout3] }
```

### 3. Mobile: Hook for AI Generation
**File:** `mobile/src/hooks/useWorkoutSwap.ts`

Add:
```typescript
export function useGenerateWorkoutAlternatives(workoutId: string) {
  return useMutation({
    mutationFn: () => apiClient.post(`/workout-plans/workouts/${workoutId}/generate-alternatives`),
    // ...
  });
}
```

### 4. Mobile: Update Swap Modal UI
**File:** `mobile/src/components/workouts/SwapWorkoutModal.tsx`

Add:
- [Generate AI Alternatives] button (below Quick Swap section)
- Loading state: "Generating 3 alternatives..."
- Display 3 AI-generated alternatives with compatibility scores
- [Generate More] button (max 2 generations = 9 total options)

### 5. Testing
- Unit test: AI generation prompt and response parsing
- Integration test: POST /generate-alternatives endpoint
- E2E test: User generates AI alternatives, selects one, swap succeeds

---

## Success Criteria

- [ ] User can tap "Generate AI Alternatives" in swap modal
- [ ] Backend calls OpenAI and returns 3 alternatives within 5-10 seconds
- [ ] All 3 alternatives match equipment, duration (±10 min), and goal
- [ ] Compatibility scores displayed (>70% match)
- [ ] User can generate up to 9 total alternatives (3 per generation, max 3 generations)
- [ ] All tests passing

---

## Reference Documents

- **Spec:** `project/planning/Q3.3_Swapping_FINAL.md`
- **Implementation Plan:** `project/implementation/IMPLEMENTATION_PLAN.md` (Phase 7, lines 2507-2765)
- **Existing Meal Swap:** `backend/src/services/openai/mealGeneration.service.ts` (generateMealAlternatives function - use as template)

---

## Notes

- This mirrors the existing **meal swap AI generation** pattern
- Meal alternatives already use OpenAI - workout swap will follow same approach
- Token cost: ~$0.01-0.02 per generation (3 workouts with 6-10 exercises each)
- Consider rate limiting: Max 3 generations per workout per day to prevent API abuse

---

**Next Steps After Phase 6:**
1. Review meal swap AI generation implementation (reference)
2. Implement backend workout alternative generation
3. Add API endpoint
4. Update SwapWorkoutModal UI
5. Test and verify compatibility scoring
