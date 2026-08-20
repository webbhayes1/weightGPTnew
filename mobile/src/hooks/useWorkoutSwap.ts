/**
 * useWorkoutSwap Hook
 * TanStack Query hooks for workout swap functionality
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, patch } from '../services/apiClient';

// Types for swap alternatives
export interface WorkoutSwapAlternative {
  id: string;
  name: string;
  type: string;
  workoutCategory: string;
  dayOfWeek: number;
  durationMinutes: number;
  estimatedCalories: number;
  isFavorite: boolean;
}

export interface WorkoutSwapAlternativesResponse {
  originalWorkout: {
    id: string;
    name: string;
    type: string;
    workoutCategory: string;
    durationMinutes: number;
    estimatedCalories: number;
  };
  alternatives: WorkoutSwapAlternative[];
}

export interface WorkoutSwapResponse {
  success: boolean;
  message: string;
  swappedWorkouts: {
    original: {
      id: string;
      name: string;
      newDayOfWeek: number;
    };
    replacement: {
      id: string;
      name: string;
      newDayOfWeek: number;
    };
  };
}

/**
 * Fetch swap alternatives for a workout
 */
export const fetchWorkoutSwapAlternatives = async (workoutId: string): Promise<WorkoutSwapAlternativesResponse> => {
  return get<WorkoutSwapAlternativesResponse>(`/workout-plans/workouts/${workoutId}/alternatives`);
};

/**
 * Execute a workout swap
 */
export const swapWorkout = async (workoutId: string, replacementWorkoutId: string): Promise<WorkoutSwapResponse> => {
  return patch<WorkoutSwapResponse>(`/workout-plans/workouts/${workoutId}/swap`, { replacementWorkoutId });
};

/**
 * useWorkoutSwapAlternatives Hook
 * Fetches alternative workouts for swapping
 */
export const useWorkoutSwapAlternatives = (workoutId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['workoutSwapAlternatives', workoutId],
    queryFn: () => fetchWorkoutSwapAlternatives(workoutId),
    enabled: enabled && !!workoutId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * useSwapWorkout Hook
 * Mutation for executing a workout swap
 */
export const useSwapWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workoutId, replacementWorkoutId }: { workoutId: string; replacementWorkoutId: string }) =>
      swapWorkout(workoutId, replacementWorkoutId),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['workoutDetail'] });
      queryClient.invalidateQueries({ queryKey: ['workoutPlan'] });
      queryClient.invalidateQueries({ queryKey: ['dailyWorkout'] });
      queryClient.invalidateQueries({ queryKey: ['workoutSwapAlternatives'] });
    },
  });
};

/**
 * Get day name from day number
 */
export const getDayName = (dayOfWeek: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek] || 'Unknown';
};

export default useWorkoutSwapAlternatives;
