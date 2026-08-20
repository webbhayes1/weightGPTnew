/**
 * useToggleFavorite Hook
 * TanStack Query mutation hook for toggling workout favorite status
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patch } from '../services/apiClient';

// Types
export interface ToggleFavoriteResponse {
  id: string;
  name: string;
  isFavorited: boolean;
  isLogged: boolean;
}

export interface ToggleFavoriteVariables {
  workoutId: string;
  isFavorite?: boolean; // If not provided, toggles current state
}

/**
 * Toggle workout favorite status
 */
const toggleFavorite = async ({ workoutId, isFavorite }: ToggleFavoriteVariables): Promise<ToggleFavoriteResponse> => {
  return patch<ToggleFavoriteResponse>(`/workout-plans/workouts/${workoutId}/favorite`, { isFavorite });
};

/**
 * useToggleFavorite Hook
 * Toggles the favorite status of a workout with optimistic updates
 */
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavorite,

    // Optimistic update - update cache before server responds
    onMutate: async ({ workoutId, isFavorite }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['dailyWorkout'] });

      // Snapshot current cache for rollback
      const previousWorkouts = queryClient.getQueriesData({ queryKey: ['dailyWorkout'] });

      // Optimistically update workouts cache
      queryClient.setQueriesData({ queryKey: ['dailyWorkout'] }, (old: any) => {
        if (!old?.workouts) return old;

        return {
          ...old,
          workouts: old.workouts.map((workout: any) => {
            if (workout.id === workoutId) {
              const newFavoriteState = isFavorite !== undefined ? isFavorite : !workout.isFavorited;
              return {
                ...workout,
                isFavorited: newFavoriteState,
              };
            }
            return workout;
          }),
        };
      });

      // Return context for rollback
      return { previousWorkouts };
    },

    // Rollback on error
    onError: (_err, _variables, context) => {
      if (context?.previousWorkouts) {
        context.previousWorkouts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    // Always refetch after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyWorkout'] });
    },
  });
};

export default useToggleFavorite;
