/**
 * Weekly Workouts Screen
 * Shows all workouts for the current week's workout plan
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeStackScreenProps } from '../../types/navigation.types';
import { useWeeklyWorkouts } from '../../hooks/useWeeklyWorkouts';
import { useWorkoutPlanGeneration } from '../../hooks/useWorkoutPlanGeneration';
import tokens from '../../theme/tokens';
import { AxiosError } from 'axios';

type Props = HomeStackScreenProps<'WeeklyWorkouts'>;

// Day names for display
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Workout type colors
const WORKOUT_TYPE_COLORS = {
  strength: '#4C9EEB',
  cardio: '#14B8A6',
};

const WORKOUT_TYPE_LABELS = {
  strength: 'Strength',
  cardio: 'Cardio',
};

export default function WeeklyWorkoutsScreen({ navigation }: Props) {
  const { data: weeklyData, isLoading, error, refetch } = useWeeklyWorkouts();
  const generateMutation = useWorkoutPlanGeneration();

  // Check if error is a 404 (no workout plan exists)
  const isNotFound = error && (error as AxiosError)?.response?.status === 404;

  const handleGenerateWorkoutPlan = async () => {
    try {
      await generateMutation.mutateAsync({});
    } catch (err) {
      // Error is handled by mutation state
      console.error('Failed to generate workout plan:', err);
    }
  };

  // Loading state - either fetching or generating
  if (isLoading || generateMutation.isPending) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#14B8A6" />
          <Text style={styles.loadingText}>
            {generateMutation.isPending
              ? 'Generating your personalized workout plan...'
              : 'Loading your workout plan...'}
          </Text>
          {generateMutation.isPending && (
            <Text style={styles.loadingSubtext}>
              This may take 10-20 seconds
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Empty state - no workout plan exists yet
  if (isNotFound || (!weeklyData && !error)) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💪</Text>
          <Text style={styles.emptyTitle}>No Workout Plan Yet</Text>
          <Text style={styles.emptyText}>
            Generate a personalized weekly workout plan based on your fitness level and goals.
          </Text>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateWorkoutPlan}
            disabled={generateMutation.isPending}
          >
            <Text style={styles.generateButtonText}>Generate Workout Plan</Text>
          </TouchableOpacity>
          {generateMutation.isError && (
            <Text style={styles.errorMessage}>
              {generateMutation.error instanceof Error
                ? generateMutation.error.message
                : 'Failed to generate workout plan. Please try again.'}
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Error state - actual error (not 404)
  if (error && !isNotFound) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to load workout plan</Text>
          <Text style={styles.errorText}>
            {error?.message || 'Please try again'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // No data after all checks
  if (!weeklyData) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>No workout plan available</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Group workouts by day
  const workoutsByDay: Record<number, typeof weeklyData.workouts> = {};
  for (let i = 0; i < 7; i++) {
    workoutsByDay[i] = [];
  }
  weeklyData.workouts.forEach(workout => {
    workoutsByDay[workout.dayOfWeek].push(workout);
  });

  const handleWorkoutPress = (workoutId: string, dayOfWeek: number) => {
    // Calculate the date for this day
    const weekStart = new Date(weeklyData.weekStartDate);
    const workoutDate = new Date(weekStart);
    workoutDate.setDate(weekStart.getDate() + dayOfWeek);
    const dateStr = workoutDate.toISOString().split('T')[0];

    // @ts-ignore - Navigation typing issue with nested navigators
    navigation.navigate('WorkoutDetail', { workoutId, date: dateStr });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Week header */}
        <View style={styles.weekHeader}>
          <Text style={styles.weekTitle}>Weekly Workout Plan</Text>
          <Text style={styles.weekDates}>
            {weeklyData.weekStartDate} to {weeklyData.weekEndDate}
          </Text>
        </View>

        {/* Days */}
        {[0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => {
          const dayWorkouts = workoutsByDay[dayOfWeek];
          const dayTotalMinutes = dayWorkouts.reduce((sum, workout) => sum + workout.durationMinutes, 0);
          const dayTotalCalories = dayWorkouts.reduce((sum, workout) => sum + workout.estimatedCalories, 0);

          return (
            <View key={dayOfWeek} style={styles.daySection}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayName}>{DAY_NAMES[dayOfWeek]}</Text>
                {dayWorkouts.length > 0 && (
                  <Text style={styles.dayStats}>
                    {dayTotalMinutes} min • {dayTotalCalories} cal
                  </Text>
                )}
              </View>

              {dayWorkouts.length === 0 ? (
                <View style={styles.emptyDay}>
                  <Text style={styles.emptyDayText}>Rest day</Text>
                </View>
              ) : (
                dayWorkouts.map(workout => (
                  <TouchableOpacity
                    key={workout.id}
                    style={styles.workoutCard}
                    onPress={() => handleWorkoutPress(workout.id, dayOfWeek)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.workoutContent}>
                      <View style={styles.workoutHeader}>
                        <View
                          style={[
                            styles.workoutTypePill,
                            { backgroundColor: `${WORKOUT_TYPE_COLORS[workout.type]}20` },
                          ]}
                        >
                          <Text
                            style={[
                              styles.workoutTypeText,
                              { color: WORKOUT_TYPE_COLORS[workout.type] },
                            ]}
                          >
                            {WORKOUT_TYPE_LABELS[workout.type]}
                          </Text>
                        </View>
                        <Text style={styles.workoutDuration}>{workout.durationMinutes} min</Text>
                      </View>
                      <Text style={styles.workoutName} numberOfLines={1}>
                        {workout.name}
                      </Text>
                      <Text style={styles.workoutMeta}>
                        {workout.exercises.length} exercises • ~{workout.estimatedCalories} cal
                      </Text>
                    </View>
                    <Text style={styles.arrow}>›</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  loadingText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
  },
  loadingSubtext: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.tertiary,
    marginTop: tokens.spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: tokens.spacing.lg,
  },
  emptyTitle: {
    ...tokens.typography.heading.h2,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    marginBottom: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.lg,
  },
  generateButton: {
    backgroundColor: '#14B8A6',
    paddingHorizontal: tokens.spacing['2xl'],
    paddingVertical: tokens.spacing.md,
    borderRadius: 12,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: tokens.colors.text.white,
  },
  errorMessage: {
    ...tokens.typography.body.s,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
  },
  errorTitle: {
    ...tokens.typography.heading.h3,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.sm,
  },
  errorText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    marginBottom: tokens.spacing.lg,
  },
  retryButton: {
    backgroundColor: '#14B8A6',
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.md,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: tokens.colors.text.white,
  },
  weekHeader: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E8',
  },
  weekTitle: {
    ...tokens.typography.heading.h2,
    color: tokens.colors.text.primary,
  },
  weekDates: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    marginTop: 4,
  },
  daySection: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E8',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  dayName: {
    ...tokens.typography.heading.h3,
    color: tokens.colors.text.primary,
  },
  dayStats: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: tokens.colors.text.secondary,
  },
  emptyDay: {
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
  },
  emptyDayText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.tertiary,
    fontStyle: 'italic',
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  workoutContent: {
    flex: 1,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  workoutTypePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  workoutTypeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  workoutDuration: {
    fontSize: 12,
    color: '#8E8E93',
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: tokens.colors.text.primary,
    marginBottom: 2,
  },
  workoutMeta: {
    fontSize: 12,
    color: '#8E8E93',
  },
  arrow: {
    fontSize: 20,
    color: '#C7C7CC',
    fontWeight: '300',
    marginLeft: tokens.spacing.sm,
  },
});
