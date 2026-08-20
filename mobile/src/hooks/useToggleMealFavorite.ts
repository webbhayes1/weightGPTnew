/**
 * useToggleMealFavorite Hook
 * TanStack Query mutation hook for toggling meal favorite status
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patch } from '../services/apiClient';

// Types
export interface ToggleMealFavoriteResponse {
  id: string;
  name: string;
  isFavorited: boolean;
  isLogged: boolean;
}

export interface ToggleMealFavoriteVariables {
  mealId: string;
  isFavorite?: boolean; // If not provided, toggles current state
}

/**
 * Toggle meal favorite status
 */
const toggleMealFavorite = async ({ mealId, isFavorite }: ToggleMealFavoriteVariables): Promise<ToggleMealFavoriteResponse> => {
  return patch<ToggleMealFavoriteResponse>(`/meals/${mealId}/favorite`, { isFavorite });
};

/**
 * useToggleMealFavorite Hook
 * Toggles the favorite status of a meal with optimistic updates
 */
export const useToggleMealFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleMealFavorite,

    // Optimistic update - update cache before server responds
    onMutate: async ({ mealId, isFavorite }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['dailyMeals'] });

      // Snapshot current cache for rollback
      const previousMeals = queryClient.getQueriesData({ queryKey: ['dailyMeals'] });

      // Optimistically update meals cache
      queryClient.setQueriesData({ queryKey: ['dailyMeals'] }, (old: any) => {
        if (!old?.meals) return old;

        return {
          ...old,
          meals: old.meals.map((meal: any) => {
            if (meal.id === mealId) {
              const newFavoriteState = isFavorite !== undefined ? isFavorite : !meal.isFavorited;
              return {
                ...meal,
                isFavorited: newFavoriteState,
              };
            }
            return meal;
          }),
        };
      });

      // Return context for rollback
      return { previousMeals };
    },

    // Rollback on error
    onError: (_err, _variables, context) => {
      if (context?.previousMeals) {
        context.previousMeals.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    // Always refetch after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyMeals'] });
    },
  });
};

export default useToggleMealFavorite;
