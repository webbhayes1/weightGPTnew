/**
 * useMealSwap Hook
 * TanStack Query hooks for meal swap functionality
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, patch } from '../services/apiClient';

// Types for swap alternatives
export interface SwapAlternative {
  id: string;
  name: string;
  mealType: string;
  dayOfWeek: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isFavorite: boolean;
}

export interface SwapAlternativesResponse {
  originalMeal: {
    id: string;
    name: string;
    mealType: string;
    calories: number;
  };
  alternatives: SwapAlternative[];
}

export interface SwapResponse {
  success: boolean;
  message: string;
  swappedMeals: {
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
 * Fetch swap alternatives for a meal
 */
export const fetchSwapAlternatives = async (mealId: string): Promise<SwapAlternativesResponse> => {
  return get<SwapAlternativesResponse>(`/meals/${mealId}/alternatives`);
};

/**
 * Execute a meal swap
 */
export const swapMeal = async (mealId: string, replacementMealId: string): Promise<SwapResponse> => {
  return patch<SwapResponse>(`/meals/${mealId}/swap`, { replacementMealId });
};

/**
 * useSwapAlternatives Hook
 * Fetches alternative meals for swapping
 */
export const useSwapAlternatives = (mealId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['swapAlternatives', mealId],
    queryFn: () => fetchSwapAlternatives(mealId),
    enabled: enabled && !!mealId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * useSwapMeal Hook
 * Mutation for executing a meal swap
 */
export const useSwapMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mealId, replacementMealId }: { mealId: string; replacementMealId: string }) =>
      swapMeal(mealId, replacementMealId),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['mealDetail'] });
      queryClient.invalidateQueries({ queryKey: ['mealPlan'] });
      queryClient.invalidateQueries({ queryKey: ['todayMeals'] });
      queryClient.invalidateQueries({ queryKey: ['swapAlternatives'] });
      queryClient.invalidateQueries({ queryKey: ['dailyMeals'] });
      queryClient.invalidateQueries({ queryKey: ['swappedMeals'] });
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

// Types for swapped meals history
export interface SwappedMeal {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  dayOfWeek: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTimeMin: number | null;
  cookTimeMin: number | null;
  swappedOutAt: string;
}

export interface SwappedMealsResponse {
  meals: SwappedMeal[];
}

/**
 * Fetch swapped meals from current week for swap history
 */
export const fetchSwappedMeals = async (): Promise<SwappedMealsResponse> => {
  return get<SwappedMealsResponse>('/meal-plans/swapped');
};

/**
 * useSwappedMeals Hook
 * Fetches recently swapped meals for swap history/undo
 */
export const useSwappedMeals = () => {
  return useQuery({
    queryKey: ['swappedMeals'],
    queryFn: fetchSwappedMeals,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export default useSwapAlternatives;
