/**
 * useMealPlanGeneration Hook
 * Handles generating a new weekly meal plan via OpenAI
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

interface GeneratedMeal {
  id: string;
  name: string;
  description: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  dayOfWeek: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTimeMin: number;
  cookTimeMin: number;
  ingredients: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
  }[];
  recipeSteps: {
    stepNumber: number;
    instruction: string;
  }[];
}

interface MacroAnalysis {
  weeklyTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  dailyAverages: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  targets: {
    dailyCalories: number;
    proteinGrams: number;
    carbGrams: number;
    fatGrams: number;
  };
}

interface GenerateMealPlanResponse {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  status: string;
  macroAnalysis: MacroAnalysis;
  mealCount: number;
  meals: GeneratedMeal[];
}

interface GenerateMealPlanParams {
  weekStartDate?: string;
}

async function generateMealPlan(params?: GenerateMealPlanParams): Promise<GenerateMealPlanResponse> {
  const response = await apiClient.post<GenerateMealPlanResponse>('/meal-plans/generate', params || {});
  return response.data;
}

export function useMealPlanGeneration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateMealPlan,
    onSuccess: () => {
      // Invalidate weekly meals query to refetch the new plan
      queryClient.invalidateQueries({ queryKey: ['weeklyMeals'] });
      // Also invalidate daily meals since they come from the same plan
      queryClient.invalidateQueries({ queryKey: ['dailyMeals'] });
    },
  });
}

export default useMealPlanGeneration;
