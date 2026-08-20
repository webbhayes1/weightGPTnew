/**
 * useWeeklyMeals Hook
 * Fetches the current week's meal plan
 */

import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

interface WeeklyMeal {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  dayOfWeek: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTimeMin: number;
  cookTimeMin: number;
  isLogged: boolean;
  isFavorite: boolean;
}

interface WeeklyMealsResponse {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  status: string;
  meals: WeeklyMeal[];
  mealCount: number;
}

async function fetchWeeklyMeals(): Promise<WeeklyMealsResponse> {
  const response = await apiClient.get<WeeklyMealsResponse>('/meal-plans/weekly');
  return response.data;
}

export function useWeeklyMeals() {
  return useQuery({
    queryKey: ['weeklyMeals'],
    queryFn: fetchWeeklyMeals,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export default useWeeklyMeals;
