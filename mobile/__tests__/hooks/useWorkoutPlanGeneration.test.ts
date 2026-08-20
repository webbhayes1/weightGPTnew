/**
 * useWorkoutPlanGeneration Hook Tests
 * Tests for workout plan generation mutation
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useWorkoutPlanGeneration } from '../../src/hooks/useWorkoutPlanGeneration';
import apiClient from '../../src/services/apiClient';

// Mock apiClient
jest.mock('../../src/services/apiClient');

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('useWorkoutPlanGeneration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockGeneratedPlan = {
    id: 'plan-1',
    weekStartDate: '2025-11-24',
    weekEndDate: '2025-11-30',
    status: 'active',
    workoutCount: 4,
    workouts: [
      {
        id: 'workout-1',
        name: 'Upper Body Power',
        type: 'strength' as const,
        workoutCategory: 'Upper Body',
        dayOfWeek: 1,
        durationMinutes: 45,
        estimatedCalories: 300,
        exercises: [
          {
            id: 'exercise-1',
            name: 'Bench Press',
            sets: 4,
            reps: '8-10',
            durationMin: null,
            equipment: ['bench', 'barbell'],
            notes: 'Focus on form',
          },
        ],
      },
      {
        id: 'workout-2',
        name: 'Lower Body Strength',
        type: 'strength' as const,
        workoutCategory: 'Lower Body',
        dayOfWeek: 3,
        durationMinutes: 50,
        estimatedCalories: 350,
        exercises: [
          {
            id: 'exercise-2',
            name: 'Squats',
            sets: 4,
            reps: '10-12',
            durationMin: null,
            equipment: ['barbell', 'squat rack'],
            notes: 'Deep depth',
          },
        ],
      },
      {
        id: 'workout-3',
        name: 'HIIT Cardio',
        type: 'cardio' as const,
        workoutCategory: 'HIIT',
        dayOfWeek: 5,
        durationMinutes: 30,
        estimatedCalories: 280,
        exercises: [
          {
            id: 'exercise-3',
            name: 'Burpees',
            sets: 5,
            reps: '30 sec on / 30 sec off',
            durationMin: null,
            equipment: [],
            notes: 'Max effort',
          },
        ],
      },
      {
        id: 'workout-4',
        name: 'Full Body Circuit',
        type: 'strength' as const,
        workoutCategory: 'Full Body',
        dayOfWeek: 6,
        durationMinutes: 40,
        estimatedCalories: 320,
        exercises: [],
      },
    ],
  };

  it('should successfully generate a workout plan', async () => {
    mockApiClient.post.mockResolvedValue({ data: mockGeneratedPlan });

    const { result } = renderHook(() => useWorkoutPlanGeneration(), { wrapper });

    result.current.mutate({ weekStartDate: '2025-11-24' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockApiClient.post).toHaveBeenCalledWith('/workout-plans/generate', {
      weekStartDate: '2025-11-24',
    });
    expect(result.current.data).toEqual(mockGeneratedPlan);
  });

  it('should generate plan for current week when no date provided', async () => {
    mockApiClient.post.mockResolvedValue({ data: mockGeneratedPlan });

    const { result } = renderHook(() => useWorkoutPlanGeneration(), { wrapper });

    result.current.mutate({});

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockApiClient.post).toHaveBeenCalledWith('/workout-plans/generate', {});
  });

  it('should invalidate queries on success', async () => {
    mockApiClient.post.mockResolvedValue({ data: mockGeneratedPlan });

    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useWorkoutPlanGeneration(), { wrapper });

    result.current.mutate({ weekStartDate: '2025-11-24' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['weeklyWorkouts'] });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['dailyWorkout'] });
  });

  it('should handle generation errors', async () => {
    const errorMessage = 'User profile incomplete';
    mockApiClient.post.mockRejectedValue({
      response: { data: { error: errorMessage } },
    });

    const { result } = renderHook(() => useWorkoutPlanGeneration(), { wrapper });

    result.current.mutate({ weekStartDate: '2025-11-24' });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });

  it('should handle network errors', async () => {
    mockApiClient.post.mockRejectedValue(new Error('Network request failed'));

    const { result } = renderHook(() => useWorkoutPlanGeneration(), { wrapper });

    result.current.mutate({});

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });

  it('should track loading state correctly', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockApiClient.post.mockReturnValue(promise as any);

    const { result } = renderHook(() => useWorkoutPlanGeneration(), { wrapper });

    result.current.mutate({ weekStartDate: '2025-11-24' });

    expect(result.current.isPending).toBe(true);

    resolvePromise!({ data: mockGeneratedPlan });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.isPending).toBe(false);
  });

  it('should return plan with correct structure', async () => {
    mockApiClient.post.mockResolvedValue({ data: mockGeneratedPlan });

    const { result } = renderHook(() => useWorkoutPlanGeneration(), { wrapper });

    result.current.mutate({});

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveProperty('id');
    expect(result.current.data).toHaveProperty('weekStartDate');
    expect(result.current.data).toHaveProperty('weekEndDate');
    expect(result.current.data).toHaveProperty('workoutCount');
    expect(result.current.data).toHaveProperty('workouts');
    expect(result.current.data?.workouts).toHaveLength(4);
  });

  it('should include exercises in workout response', async () => {
    mockApiClient.post.mockResolvedValue({ data: mockGeneratedPlan });

    const { result } = renderHook(() => useWorkoutPlanGeneration(), { wrapper });

    result.current.mutate({});

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const firstWorkout = result.current.data?.workouts[0];
    expect(firstWorkout).toHaveProperty('exercises');
    expect(firstWorkout?.exercises).toHaveLength(1);
    expect(firstWorkout?.exercises[0]).toHaveProperty('name');
    expect(firstWorkout?.exercises[0]).toHaveProperty('sets');
    expect(firstWorkout?.exercises[0]).toHaveProperty('reps');
  });

  it('should handle plans with different workout counts', async () => {
    const planWith3Workouts = {
      ...mockGeneratedPlan,
      workoutCount: 3,
      workouts: mockGeneratedPlan.workouts.slice(0, 3),
    };

    mockApiClient.post.mockResolvedValue({ data: planWith3Workouts });

    const { result } = renderHook(() => useWorkoutPlanGeneration(), { wrapper });

    result.current.mutate({});

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.workoutCount).toBe(3);
    expect(result.current.data?.workouts).toHaveLength(3);
  });

  it('should handle plans with different workout types', async () => {
    const mixedPlan = {
      ...mockGeneratedPlan,
      workouts: [
        { ...mockGeneratedPlan.workouts[0], type: 'strength' as const },
        { ...mockGeneratedPlan.workouts[1], type: 'cardio' as const },
        { ...mockGeneratedPlan.workouts[2], type: 'cardio' as const },
        { ...mockGeneratedPlan.workouts[3], type: 'strength' as const },
      ],
    };

    mockApiClient.post.mockResolvedValue({ data: mixedPlan });

    const { result } = renderHook(() => useWorkoutPlanGeneration(), { wrapper });

    result.current.mutate({});

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const strengthWorkouts = result.current.data?.workouts.filter((w) => w.type === 'strength');
    const cardioWorkouts = result.current.data?.workouts.filter((w) => w.type === 'cardio');

    expect(strengthWorkouts).toHaveLength(2);
    expect(cardioWorkouts).toHaveLength(2);
  });
});
