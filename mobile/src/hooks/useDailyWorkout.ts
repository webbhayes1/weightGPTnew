/**
 * useDailyWorkout Hook
 * TanStack Query hook for fetching daily workout data
 */

import { useQuery } from '@tanstack/react-query';
import { get } from '../services/apiClient';

// Types matching backend response
export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number | null;
  reps: number | null;
  durationMin: number | null;
  equipment: string[];
  notes: string | null;
}

export interface DailyWorkout {
  id: string;
  name: string;
  type: 'strength' | 'cardio';
  workoutCategory: string | null;
  durationMinutes: number;
  estimatedCalories: number;
  actualCalories: number | null;
  exerciseCount: number;
  isFavorited: boolean;
  isDisliked: boolean;
  isLogged: boolean;
  loggedAt?: string;
  exercises: WorkoutExercise[];
}

export interface DailyWorkoutResponse {
  date: string;
  dayOfWeek: number;
  workouts: DailyWorkout[];
  totalStats: {
    totalDuration: number;
    totalCalories: number;
  };
  workoutPlanId: string;
  weekStartDate: string;
  weekEndDate: string;
  message?: string;
}

/**
 * Fetch daily workouts for a specific date
 * @param date - Date in YYYY-MM-DD format (defaults to today on backend)
 */
export const fetchDailyWorkout = async (date?: string): Promise<DailyWorkoutResponse> => {
  const url = date ? `/workout-plans/daily?date=${date}` : '/workout-plans/daily';
  return get<DailyWorkoutResponse>(url);
};

/**
 * useDailyWorkout Hook
 * @param date - Date in YYYY-MM-DD format (optional, defaults to today)
 */
export const useDailyWorkout = (date?: string) => {
  return useQuery({
    queryKey: ['dailyWorkout', date],
    queryFn: () => fetchDailyWorkout(date),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};
