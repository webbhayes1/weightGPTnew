/**
 * Today's Workout Display Component
 * Phase 3: Q3.0 App Shell - Home Tab
 * Shows planned workouts with checkboxes for quick-logging
 * Spec: IMPLEMENTATION_PLAN.md lines 1415-1430
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import tokens from '../../theme/tokens';

interface WorkoutData {
  id: string;
  name: string;
  durationMinutes: number;
  estimatedCalories: number;
  actualCalories?: number; // Only if logged
  exerciseCount: number;
  isLogged: boolean;
  loggedAt?: string; // Time string (e.g., "6:30 AM")
  isFavorited: boolean;
}

interface Props {
  workouts: WorkoutData[];
  isRestDay?: boolean;
  onWorkoutPress: (workoutId: string) => void;
  onCheckboxPress: (workoutId: string) => void;
  onFavoritePress: (workoutId: string) => void;
  onViewWeekPress?: () => void;
}

export default function TodaysWorkoutDisplay({
  workouts,
  isRestDay = false,
  onWorkoutPress,
  onCheckboxPress,
  onFavoritePress,
  onViewWeekPress,
}: Props) {
  const renderWorkoutCard = (workout: WorkoutData) => {
    return (
      <TouchableOpacity
        key={workout.id}
        style={[styles.workoutCard, workout.isLogged && styles.workoutCardLogged]}
        onPress={() => onWorkoutPress(workout.id)}
        activeOpacity={0.7}
      >
        {/* Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => onCheckboxPress(workout.id)}
          activeOpacity={0.6}
        >
          <View style={[styles.checkbox, workout.isLogged && styles.checkboxChecked]}>
            {workout.isLogged && <View style={styles.checkboxInner} />}
          </View>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.workoutContent}>
          {/* Title Row */}
          <View style={styles.titleRow}>
            <Text style={styles.workoutName} numberOfLines={1}>
              {workout.name}
            </Text>
            {workout.isLogged && (
              <View style={styles.loggedBadge}>
                <Text style={styles.loggedBadgeText}>Logged</Text>
              </View>
            )}
          </View>

          {/* Duration + Calories */}
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {workout.durationMinutes} min
            </Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>
              {workout.isLogged && workout.actualCalories
                ? `${workout.actualCalories} cal (actual)`
                : `~${workout.estimatedCalories} cal`}
            </Text>
          </View>

          {/* Exercise Count OR Logged timestamp */}
          {workout.isLogged && workout.loggedAt ? (
            <Text style={styles.loggedAtText}>Logged at {workout.loggedAt}</Text>
          ) : (
            <Text style={styles.exerciseCountText}>{workout.exerciseCount} exercises</Text>
          )}
        </View>

        {/* Favorite Heart Icon */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onFavoritePress(workout.id)}
          activeOpacity={0.6}
        >
          <Text style={[styles.favoriteIcon, workout.isFavorited && styles.favoriteIconActive]}>
            {workout.isFavorited ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>

        {/* Arrow */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRestDay = () => {
    return (
      <View style={styles.restDayCard}>
        <Text style={styles.restDayText}>No workouts for today!</Text>
        <Text style={styles.restDaySubtext}>
          Come back tomorrow to see your{'\n'}exercise plan.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <TouchableOpacity
            style={styles.viewWeekButton}
            activeOpacity={0.8}
            onPress={onViewWeekPress}
          >
            <Text style={styles.viewWeekButtonText}>View My Week</Text>
          </TouchableOpacity>
        </View>

        {/* Plus Button */}
        <TouchableOpacity style={styles.plusButton} activeOpacity={0.8}>
          <Text style={styles.plusIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Workout Cards */}
      <View style={styles.workoutsContainer}>
        {isRestDay ? (
          renderRestDay()
        ) : workouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Generating your workout plan...</Text>
            <Text style={styles.emptyStateText}>
              This will take just a moment
            </Text>
          </View>
        ) : (
          workouts.map((workout) => renderWorkoutCard(workout))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1F3A5F',
    marginBottom: tokens.spacing.xs,
  },
  viewWeekButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: 16,
    backgroundColor: '#4C9EEB', // Blue for workout mode
  },
  viewWeekButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: tokens.colors.text.white,
  },
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4C9EEB', // Blue for workout mode
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 24,
    fontWeight: '300' as const,
    color: tokens.colors.text.white,
  },
  workoutsContainer: {
    gap: tokens.spacing.sm,
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.background.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E7E8',
    padding: tokens.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutCardLogged: {
    backgroundColor: '#4BAE900D', // 5% opacity
  },
  checkboxContainer: {
    padding: 4,
    marginRight: tokens.spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E7E7E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: '#4BAE90',
    backgroundColor: '#4BAE90',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: tokens.colors.text.white,
  },
  workoutContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: tokens.spacing.xs,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1F3A5F',
    flex: 1,
  },
  loggedBadge: {
    backgroundColor: '#4BAE90',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  loggedBadgeText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: tokens.colors.text.white,
    textTransform: 'uppercase' as const,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  metaDot: {
    fontSize: 14,
    color: '#8E8E93',
  },
  exerciseCountText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  loggedAtText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  favoriteButton: {
    padding: 4,
    marginLeft: tokens.spacing.xs,
  },
  favoriteIcon: {
    fontSize: 20,
    color: '#C7C7CC',
  },
  favoriteIconActive: {
    color: '#4C9EEB',
  },
  arrowContainer: {
    marginLeft: tokens.spacing.sm,
  },
  arrow: {
    fontSize: 24,
    color: '#C7C7CC',
    fontWeight: '300' as const,
  },
  restDayCard: {
    backgroundColor: '#DADDE333', // 20% opacity
    borderRadius: 12,
    paddingVertical: tokens.spacing['2xl'],
    paddingHorizontal: tokens.spacing.lg,
    alignItems: 'center',
  },
  restDayText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#8E8E93',
    marginBottom: tokens.spacing.xs,
  },
  restDaySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: tokens.spacing['4xl'],
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#8E8E93',
    marginBottom: tokens.spacing.xs,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#C7C7CC',
  },
});
