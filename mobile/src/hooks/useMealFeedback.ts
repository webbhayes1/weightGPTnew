/**
 * useMealFeedback Hook
 * TanStack Query hook for submitting meal feedback
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '../services/apiClient';

// Types for feedback
export interface FeedbackRequest {
  rating: 1 | -1; // 1 = thumbs up, -1 = thumbs down
  comment?: string;
  dislikedIngredients?: string[]; // Array of ingredient IDs
}

export interface FeedbackResponse {
  id: string;
  name: string;
  isFavorite: boolean;
  isDisliked: boolean;
  feedbackText: string | null;
  feedbackAt: string | null;
}

/**
 * Submit meal feedback
 */
export const submitMealFeedback = async (
  mealId: string,
  feedback: FeedbackRequest
): Promise<FeedbackResponse> => {
  return post<FeedbackResponse>(`/meals/${mealId}/feedback`, feedback);
};

/**
 * useMealFeedback Hook
 * Mutation for submitting meal feedback
 */
export const useMealFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mealId, feedback }: { mealId: string; feedback: FeedbackRequest }) =>
      submitMealFeedback(mealId, feedback),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['mealDetail'] });
      queryClient.invalidateQueries({ queryKey: ['dailyMeals'] });
    },
  });
};

export default useMealFeedback;
