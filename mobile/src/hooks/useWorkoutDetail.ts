/**
 * useWorkoutDetail Hook
 * TanStack Query hook for fetching single workout details
 */

import { useQuery } from '@tanstack/react-query';
import { get } from '../services/apiClient';

// Types matching backend response
export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number | null;
  reps: string | null;
  durationMin: number | null;
  equipment: string[];
  notes: string | null;
}

export interface WorkoutDetail {
  id: string;
  name: string;
  type: string;
  workoutCategory: string;
  durationMinutes: number;
  estimatedCalories: number;
  actualCalories: number | null;
  isFavorited: boolean;
  isDisliked: boolean;
  isLogged: boolean;
  loggedAt?: string;
  exercises: WorkoutExercise[];
}

/**
 * Fetch workout details by ID
 */
export const fetchWorkoutDetail = async (workoutId: string): Promise<WorkoutDetail> => {
  return get<WorkoutDetail>(`/workout-plans/workouts/${workoutId}`);
};

/**
 * useWorkoutDetail Hook
 * @param workoutId - The workout ID to fetch
 */
export const useWorkoutDetail = (workoutId: string) => {
  return useQuery({
    queryKey: ['workoutDetail', workoutId],
    queryFn: () => fetchWorkoutDetail(workoutId),
    enabled: !!workoutId, // Only fetch if workoutId is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export default useWorkoutDetail;
