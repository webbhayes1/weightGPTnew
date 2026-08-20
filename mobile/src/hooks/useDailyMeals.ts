/**
 * useDailyMeals Hook
 * TanStack Query hook for fetching daily meal data
 */

import { useQuery } from '@tanstack/react-query';
import { get } from '../services/apiClient';

// Types matching backend response
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

export interface DailyMeal {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTimeMin: number | null;
  cookTimeMin: number | null;
  isFavorite: boolean;
  isLogged: boolean;
  loggedAt?: string;
  ingredients: MealIngredient[];
  recipeSteps: RecipeStep[];
}

export interface DailyMealsResponse {
  date: string;
  dayOfWeek: number;
  meals: DailyMeal[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  mealPlanId: string;
  weekStartDate: string;
  weekEndDate: string;
  message?: string;
}

/**
 * Fetch daily meals for a specific date
 * @param date - Date in YYYY-MM-DD format (defaults to today on backend)
 */
export const fetchDailyMeals = async (date?: string): Promise<DailyMealsResponse> => {
  const url = date ? `/meal-plans/daily?date=${date}` : '/meal-plans/daily';
  return get<DailyMealsResponse>(url);
};

/**
 * useDailyMeals Hook
 * @param date - Date in YYYY-MM-DD format (optional, defaults to today)
 */
export const useDailyMeals = (date?: string) => {
  return useQuery({
    queryKey: ['dailyMeals', date],
    queryFn: () => fetchDailyMeals(date),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};
