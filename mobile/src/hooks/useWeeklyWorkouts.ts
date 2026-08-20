/**
 * useWeeklyWorkouts Hook
 * Fetches the current week's workout plan
 */

import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

interface Exercise {
  id: string;
  name: string;
  sets: number | null;
  reps: string | null;
  durationMin: number | null;
  equipment: string[];
  notes: string | null;
}

interface WeeklyWorkout {
  id: string;
  name: string;
  type: 'strength' | 'cardio';
  workoutCategory: string;
  dayOfWeek: number;
  durationMinutes: number;
  estimatedCalories: number;
  isLogged: boolean;
  isFavorite: boolean;
  exercises: Exercise[];
}

interface WeeklyWorkoutsResponse {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  status: string;
  workouts: WeeklyWorkout[];
  workoutCount: number;
}

async function fetchWeeklyWorkouts(): Promise<WeeklyWorkoutsResponse> {
  const response = await apiClient.get<WeeklyWorkoutsResponse>('/workout-plans/weekly');
  return response.data;
}

export function useWeeklyWorkouts() {
  return useQuery({
    queryKey: ['weeklyWorkouts'],
    queryFn: fetchWeeklyWorkouts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export default useWeeklyWorkouts;
