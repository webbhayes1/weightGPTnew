/**
 * useLogMeal Hook
 * TanStack Query mutation hook for logging/unlogging meals
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '../services/apiClient';

// Types
export interface LogMealResponse {
  id: string;
  name: string;
  mealType: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isLogged: boolean;
  loggedAt?: string;
}

export interface LogMealVariables {
  mealId: string;
  logged?: boolean; // If not provided, toggles current state
}

/**
 * Log or unlog a meal
 */
const logMeal = async ({ mealId, logged }: LogMealVariables): Promise<LogMealResponse> => {
  return post<LogMealResponse>(`/meals/${mealId}/log`, { logged });
};

/**
 * useLogMeal Hook
 * Toggles the logged status of a meal with optimistic updates
 */
export const useLogMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logMeal,

    // Optimistic update - update cache before server responds
    onMutate: async ({ mealId, logged }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['dailyMeals'] });
      await queryClient.cancelQueries({ queryKey: ['dailyProgress'] });

      // Snapshot current cache for rollback
      const previousMeals = queryClient.getQueriesData({ queryKey: ['dailyMeals'] });
      const previousProgress = queryClient.getQueriesData({ queryKey: ['dailyProgress'] });

      // Optimistically update meals cache
      queryClient.setQueriesData({ queryKey: ['dailyMeals'] }, (old: any) => {
        if (!old?.meals) return old;

        return {
          ...old,
          meals: old.meals.map((meal: any) => {
            if (meal.id === mealId) {
              const newLoggedState = logged !== undefined ? logged : !meal.isLogged;
              return {
                ...meal,
                isLogged: newLoggedState,
                loggedAt: newLoggedState ? new Date().toISOString() : undefined,
              };
            }
            return meal;
          }),
        };
      });

      // Return context for rollback
      return { previousMeals, previousProgress };
    },

    // Rollback on error
    onError: (_err, _variables, context) => {
      if (context?.previousMeals) {
        context.previousMeals.forEach(([queryKey, data]) => {
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
      queryClient.invalidateQueries({ queryKey: ['dailyMeals'] });
      queryClient.invalidateQueries({ queryKey: ['dailyProgress'] });
    },
  });
};

export default useLogMeal;
