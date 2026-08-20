/**
 * useDailyProgress Hook
 * TanStack Query hook for fetching daily progress data (nutrition + workout stats)
 */

import { useQuery } from '@tanstack/react-query';
import { get } from '../services/apiClient';

// Types matching backend response
export interface DailyProgressResponse {
  date: string;
  dayOfWeek: number;
  nutrition: {
    consumed: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    targets: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  };
  workout: {
    warmUpMinutes: number;
    mainWorkoutMinutes: number;
    totalMinutes: number;
    completedMinutes: number;
    targetMinutes: number;
    caloriesBurned: number;
    caloriesTarget: number;
    workoutsLogged: number;
    workoutsTotal: number;
  };
}

/**
 * Fetch daily progress for a specific date
 * @param date - Date in YYYY-MM-DD format (defaults to today on backend)
 */
export const fetchDailyProgress = async (date?: string): Promise<DailyProgressResponse> => {
  const url = date ? `/progress/daily?date=${date}` : '/progress/daily';
  return get<DailyProgressResponse>(url);
};

/**
 * useDailyProgress Hook
 * @param date - Date in YYYY-MM-DD format (optional, defaults to today)
 */
export const useDailyProgress = (date?: string) => {
  return useQuery({
    queryKey: ['dailyProgress', date],
    queryFn: () => fetchDailyProgress(date),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    refetchOnMount: 'always', // Force refetch on component mount
    refetchOnWindowFocus: true, // Refetch when app comes to foreground
  });
};
