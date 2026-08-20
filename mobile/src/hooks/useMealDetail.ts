/**
 * useMealDetail Hook
 * TanStack Query hook for fetching single meal details
 */

import { useQuery } from '@tanstack/react-query';
import { get } from '../services/apiClient';

export interface MealIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string | null;
  notes: string | null;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
}

export interface MealDetail {
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
  isFavorite: boolean;
  isDisliked: boolean;
  isLogged: boolean;
  loggedAt?: string;
  ingredients: MealIngredient[];
  recipeSteps: RecipeStep[];
}

/**
 * Fetch meal details by ID
 * @param mealId - Meal UUID
 */
export const fetchMealDetail = async (mealId: string): Promise<MealDetail> => {
  return get<MealDetail>(`/meals/${mealId}`);
};

/**
 * useMealDetail Hook
 * @param mealId - Meal UUID
 */
export const useMealDetail = (mealId: string) => {
  return useQuery({
    queryKey: ['mealDetail', mealId],
    queryFn: () => fetchMealDetail(mealId),
    staleTime: 1000 * 60 * 10, // 10 minutes (recipes don't change often)
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};
