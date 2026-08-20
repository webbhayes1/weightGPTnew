/**
 * useWorkoutPlanGeneration Hook
 * Handles generating a new weekly workout plan via OpenAI
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

interface GeneratedExercise {
  id: string;
  name: string;
  sets: number | null;
  reps: string | null;
  durationMin: number | null;
  equipment: string[];
  notes: string | null;
}

interface GeneratedWorkout {
  id: string;
  name: string;
  type: 'strength' | 'cardio';
  workoutCategory: string;
  dayOfWeek: number;
  durationMinutes: number;
  estimatedCalories: number;
  exercises: GeneratedExercise[];
}

interface GenerateWorkoutPlanResponse {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  status: string;
  workoutCount: number;
  workouts: GeneratedWorkout[];
}

interface GenerateWorkoutPlanParams {
  weekStartDate?: string;
}

async function generateWorkoutPlan(params?: GenerateWorkoutPlanParams): Promise<GenerateWorkoutPlanResponse> {
  const response = await apiClient.post<GenerateWorkoutPlanResponse>('/workout-plans/generate', params || {});
  return response.data;
}

export function useWorkoutPlanGeneration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateWorkoutPlan,
    onSuccess: () => {
      // Invalidate weekly workouts query to refetch the new plan
      queryClient.invalidateQueries({ queryKey: ['weeklyWorkouts'] });
      // Also invalidate daily workout since it comes from the same plan (singular to match useDailyWorkout)
      queryClient.invalidateQueries({ queryKey: ['dailyWorkout'] });
    },
  });
}

export default useWorkoutPlanGeneration;
