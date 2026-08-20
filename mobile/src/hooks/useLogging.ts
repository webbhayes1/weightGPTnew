/**
 * Logging Hooks
 * Phase 6: Q3.2 AI-Powered Logging
 *
 * Hooks for parsing and logging meals, workouts, and weight
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import { ParsedMealData, ParsedWorkoutData } from '../types/navigation.types';

// ============================================================================
// TYPES
// ============================================================================

export interface MealParseRequest {
  input: string;
  followUpContext?: string;
}

export interface WorkoutParseRequest {
  input: string;
  followUpContext?: string;
}

export interface WeightParseRequest {
  input: string;
  preferredUnit?: 'lbs' | 'kg';
}

export interface WeightParseResponse {
  weightLbs: number;
  originalValue: number;
  originalUnit: 'lbs' | 'kg';
  confidence: 'high' | 'medium' | 'low';
}

export interface LoggedMealData {
  items: {
    name: string;
    quantity: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  isManualEntry?: boolean;
  restaurantName?: string;
}

export interface LoggedWorkoutData {
  name: string;
  type: 'cardio' | 'strength' | 'balanced';
  durationMinutes: number;
  intensity: 'easy' | 'moderate' | 'hard';
  caloriesBurned: number;
  exercises?: {
    name: string;
    sets?: number;
    reps?: number;
    weight?: number;
    weightUnit?: 'lbs' | 'kg';
    durationMin?: number;
  }[];
  isManualEntry?: boolean;
}

export interface LoggedWeightData {
  weightLbs: number;
  originalValue: number;
  originalUnit: 'lbs' | 'kg';
}

export interface CreateLoggedEntryRequest {
  type: 'meal' | 'workout' | 'weight';
  date: string; // ISO date string
  meal?: LoggedMealData;
  workout?: LoggedWorkoutData;
  weight?: LoggedWeightData;
  isFavorite?: boolean;
}

export interface LoggedEntry {
  id: string;
  userId: string;
  type: 'meal' | 'workout' | 'weight';
  date: string;
  meal?: LoggedMealData;
  workout?: LoggedWorkoutData;
  weight?: LoggedWeightData;
  isFavorite: boolean;
  isDisliked: boolean;
  loggedAt: string;
  createdAt: string;
}

export interface WeightHistoryEntry {
  id: string;
  userId: string;
  weightLbs: number;
  changeFromLast: number | null;
  changeFromStart: number | null;
  loggedAt: string;
}

export interface WeightHistoryResponse {
  entries: WeightHistoryEntry[];
  trend: {
    direction: 'up' | 'down' | 'stable';
    amount: number;
  } | null;
  previousWeight: number | null;
}

// ============================================================================
// AI PARSING HOOKS
// ============================================================================

/**
 * Parse meal input using AI
 */
export function useParseMeal() {
  return useMutation({
    mutationFn: async (data: MealParseRequest): Promise<ParsedMealData> => {
      const response = await apiClient.post('/logging/parse/meal', data);
      return response.data.data;
    },
  });
}

/**
 * Parse workout input using AI
 */
export function useParseWorkout() {
  return useMutation({
    mutationFn: async (data: WorkoutParseRequest): Promise<ParsedWorkoutData> => {
      const response = await apiClient.post('/logging/parse/workout', data);
      return response.data.data;
    },
  });
}

/**
 * Parse weight input
 */
export function useParseWeight() {
  return useMutation({
    mutationFn: async (data: WeightParseRequest): Promise<WeightParseResponse> => {
      const response = await apiClient.post('/logging/parse/weight', data);
      return response.data.data;
    },
  });
}

// ============================================================================
// LOGGED ENTRIES HOOKS
// ============================================================================

/**
 * Create a new logged entry
 */
export function useCreateLoggedEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLoggedEntryRequest): Promise<LoggedEntry> => {
      const response = await apiClient.post('/logging/entries', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['loggedEntries'] });
      queryClient.invalidateQueries({ queryKey: ['dailyProgress'] });
      queryClient.invalidateQueries({ queryKey: ['recentEntries'] });

      if (data.type === 'weight') {
        queryClient.invalidateQueries({ queryKey: ['weightHistory'] });
      }
    },
  });
}

/**
 * Get logged entries with optional filters
 */
export function useLoggedEntries(params?: {
  type?: 'meal' | 'workout' | 'weight';
  date?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}) {
  const queryParams = new URLSearchParams();
  if (params?.type) queryParams.append('type', params.type);
  if (params?.date) queryParams.append('date', params.date);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.offset) queryParams.append('offset', params.offset.toString());

  const queryString = queryParams.toString();
  const url = `/logging/entries${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: ['loggedEntries', params],
    queryFn: async () => {
      const response = await apiClient.get(url);
      return response.data.data as LoggedEntry[];
    },
  });
}

/**
 * Get a single logged entry
 */
export function useLoggedEntry(id: string) {
  return useQuery({
    queryKey: ['loggedEntry', id],
    queryFn: async () => {
      const response = await apiClient.get(`/logging/entries/${id}`);
      return response.data.data as LoggedEntry;
    },
    enabled: !!id,
  });
}

/**
 * Update a logged entry
 */
export function useUpdateLoggedEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      meal?: LoggedMealData;
      workout?: LoggedWorkoutData;
      weight?: LoggedWeightData;
      isFavorite?: boolean;
      isDisliked?: boolean;
    }): Promise<LoggedEntry> => {
      const response = await apiClient.patch(`/logging/entries/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loggedEntries'] });
      queryClient.invalidateQueries({ queryKey: ['dailyProgress'] });
    },
  });
}

/**
 * Delete a logged entry
 */
export function useDeleteLoggedEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/logging/entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loggedEntries'] });
      queryClient.invalidateQueries({ queryKey: ['dailyProgress'] });
    },
  });
}

/**
 * Get recent logged entries for quick-log suggestions
 */
export function useRecentEntries(type?: 'meal' | 'workout' | 'weight', limit = 5) {
  const queryParams = new URLSearchParams();
  if (type) queryParams.append('type', type);
  queryParams.append('limit', limit.toString());

  return useQuery({
    queryKey: ['recentEntries', type, limit],
    queryFn: async () => {
      const response = await apiClient.get(`/logging/recent?${queryParams.toString()}`);
      return response.data.data as LoggedEntry[];
    },
    // Don't throw errors - return empty array on failure
    retry: false,
    // Return empty array on error instead of crashing
    placeholderData: [],
  });
}

/**
 * Get favorite logged entries
 */
export function useFavoriteEntries(type?: 'meal' | 'workout') {
  const queryParams = new URLSearchParams();
  if (type) queryParams.append('type', type);

  return useQuery({
    queryKey: ['favoriteEntries', type],
    queryFn: async () => {
      const response = await apiClient.get(`/logging/favorites?${queryParams.toString()}`);
      return response.data.data as LoggedEntry[];
    },
  });
}

/**
 * Get weight history for trend analysis
 */
export function useWeightHistory(days = 30) {
  return useQuery({
    queryKey: ['weightHistory', days],
    queryFn: async () => {
      const response = await apiClient.get(`/logging/weight-history?days=${days}`);
      return response.data.data as WeightHistoryResponse;
    },
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate totals from parsed meal items
 */
export function calculateMealTotals(items: ParsedMealData['items']): {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
} {
  return items.reduce(
    (acc, item) => ({
      totalCalories: acc.totalCalories + item.calories,
      totalProtein: acc.totalProtein + item.protein,
      totalCarbs: acc.totalCarbs + item.carbs,
      totalFat: acc.totalFat + item.fat,
    }),
    { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
  );
}

/**
 * Format weight change for display
 */
export function formatWeightChange(
  current: number,
  previous: number | null
): { text: string; direction: 'up' | 'down' | 'same' } | null {
  // Guard against null or undefined previous value
  if (previous === null || previous === undefined) return null;

  // Guard against NaN values
  if (isNaN(current) || isNaN(previous)) return null;

  const diff = current - previous;
  const absDiff = Math.abs(Math.round(diff * 10) / 10);

  // Guard against NaN result
  if (isNaN(absDiff)) return null;

  if (absDiff < 0.1) {
    return { text: 'Same as last', direction: 'same' };
  }

  return {
    text: `${diff > 0 ? '+' : '-'}${absDiff.toFixed(1)} lbs from last`,
    direction: diff > 0 ? 'up' : 'down',
  };
}
