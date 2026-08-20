/**
 * useGenerateMealAlternatives Hook
 * TanStack Query hook for generating AI meal alternatives
 */

import { useMutation } from '@tanstack/react-query';
import { post } from '../services/apiClient';

export interface MealAlternative {
  name: string;
  description: string | null;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTimeMin: number | null;
  cookTimeMin: number | null;
}

export interface GenerateMealAlternativesResponse {
  originalMeal: {
    id: string;
    name: string;
    mealType: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  alternatives: MealAlternative[];
  count: number;
}

/**
 * Generate meal alternatives using AI
 */
export const generateMealAlternatives = async (mealId: string): Promise<GenerateMealAlternativesResponse> => {
  return post<GenerateMealAlternativesResponse>(`/meals/${mealId}/generate-alternatives`, {});
};

/**
 * useGenerateMealAlternatives Hook
 * Generates AI alternatives for a meal
 */
export const useGenerateMealAlternatives = () => {
  return useMutation({
    mutationFn: (mealId: string) => generateMealAlternatives(mealId),
  });
};

/**
 * Replace meal with an AI-generated alternative
 * Creates a new meal from the alternative data and replaces the original
 */
export const replaceWithAIAlternative = async (mealId: string, alternative: MealAlternative): Promise<void> => {
  await post(`/meals/${mealId}/replace-with-alternative`, {
    name: alternative.name,
    description: alternative.description,
    mealType: alternative.mealType,
    calories: alternative.calories,
    protein: alternative.protein,
    carbs: alternative.carbs,
    fat: alternative.fat,
    prepTimeMin: alternative.prepTimeMin,
    cookTimeMin: alternative.cookTimeMin,
  });
};

/**
 * useReplaceWithAIAlternative Hook
 * Replaces a meal with an AI-generated alternative
 */
export const useReplaceWithAIAlternative = () => {
  return useMutation({
    mutationFn: ({ mealId, alternative }: { mealId: string; alternative: MealAlternative }) =>
      replaceWithAIAlternative(mealId, alternative),
  });
};
