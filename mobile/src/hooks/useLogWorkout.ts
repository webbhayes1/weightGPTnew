/**
 * useLogWorkout Hook
 * TanStack Query mutation hook for logging/unlogging workouts
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '../services/apiClient';

// Types
export interface LogWorkoutResponse {
  id: string;
  name: string;
  type: string;
  durationMinutes: number;
  estimatedCalories: number;
  actualCalories?: number;
  isLogged: boolean;
  loggedAt?: string;
  isFavorited: boolean;
}

export interface LogWorkoutVariables {
  workoutId: string;
  logged?: boolean; // If not provided, toggles current state
  actualCalories?: number; // Optional actual calories burned
}

/**
 * Log or unlog a workout
 */
const logWorkout = async ({ workoutId, logged, actualCalories }: LogWorkoutVariables): Promise<LogWorkoutResponse> => {
  return post<LogWorkoutResponse>(`/workout-plans/workouts/${workoutId}/log`, { logged, actualCalories });
};

/**
 * useLogWorkout Hook
 * Toggles the logged status of a workout with optimistic updates
 */
export const useLogWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logWorkout,

    // Optimistic update - update cache before server responds
    onMutate: async ({ workoutId, logged }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['dailyWorkout'] });
      await queryClient.cancelQueries({ queryKey: ['dailyProgress'] });

      // Snapshot current cache for rollback
      const previousWorkouts = queryClient.getQueriesData({ queryKey: ['dailyWorkout'] });
      const previousProgress = queryClient.getQueriesData({ queryKey: ['dailyProgress'] });

      // Optimistically update workouts cache
      queryClient.setQueriesData({ queryKey: ['dailyWorkout'] }, (old: any) => {
        if (!old?.workouts) return old;

        return {
          ...old,
          workouts: old.workouts.map((workout: any) => {
            if (workout.id === workoutId) {
              const newLoggedState = logged !== undefined ? logged : !workout.isLogged;
              return {
                ...workout,
                isLogged: newLoggedState,
                loggedAt: newLoggedState ? new Date().toISOString() : undefined,
                actualCalories: newLoggedState ? workout.estimatedCalories : undefined,
              };
            }
            return workout;
          }),
        };
      });

      // Return context for rollback
      return { previousWorkouts, previousProgress };
    },

    // Rollback on error
    onError: (_err, _variables, context) => {
      if (context?.previousWorkouts) {
        context.previousWorkouts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousProgress) {
        context.previousProgress.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    // Always refetch after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyWorkout'] });
      queryClient.invalidateQueries({ queryKey: ['dailyProgress'] });
    },
  });
};

export default useLogWorkout;
