/**
 * Workout Detail Screen
 * Phase 3: Q3.0 App Shell - Full workout view with exercise list and actions
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HomeStackScreenProps } from '../../types/navigation.types';
import { useWorkoutDetail } from '../../hooks/useWorkoutDetail';
import SwapWorkoutModal from '../../components/workouts/SwapWorkoutModal';
import tokens from '../../theme/tokens';

type Props = HomeStackScreenProps<'WorkoutDetail'>;

export default function WorkoutDetailScreen({ route, navigation }: Props) {
  const { workoutId } = route.params;
  const [showSwapModal, setShowSwapModal] = useState(false);

  // Fetch workout details from API
  const { data: workout, isLoading, error } = useWorkoutDetail(workoutId);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#14B8A6" />
          <Text style={styles.loadingText}>Loading workout details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !workout) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>Failed to load workout</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getWorkoutTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      strength: '#14B8A6',
      cardio: '#F97316',
      hiit: '#EF4444',
      flexibility: '#8B5CF6',
      yoga: '#EC4899',
    };
    return colors[type] || '#14B8A6';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.titleSection}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <View style={styles.badgeRow}>
                <View style={[styles.typeBadge, { backgroundColor: getWorkoutTypeColor(workout.type) }]}>
                  <Text style={styles.typeBadgeText}>{workout.type}</Text>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{workout.workoutCategory}</Text>
                </View>
              </View>
            </View>
            {workout.isFavorited && (
              <Ionicons name="heart" size={24} color="#EF4444" />
            )}
          </View>

          {/* Stats Summary */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color={tokens.colors.text.secondary} />
              <Text style={styles.statValue}>{workout.durationMinutes}</Text>
              <Text style={styles.statLabel}>minutes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="flame-outline" size={20} color={tokens.colors.text.secondary} />
              <Text style={styles.statValue}>{workout.estimatedCalories}</Text>
              <Text style={styles.statLabel}>cal burn</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="barbell-outline" size={20} color={tokens.colors.text.secondary} />
              <Text style={styles.statValue}>{workout.exercises.length}</Text>
              <Text style={styles.statLabel}>exercises</Text>
            </View>
          </View>
        </View>

        {/* Exercises Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={24} color={tokens.colors.text.primary} />
            <Text style={styles.sectionTitle}>Exercises</Text>
          </View>
          {workout.exercises.length === 0 ? (
            <View style={styles.emptyExercisesContainer}>
              <Text style={styles.emptyExercisesText}>
                No exercises available
              </Text>
            </View>
          ) : (
            <View style={styles.exercisesList}>
              {workout.exercises.map((exercise, index) => (
                <View key={exercise.id} style={styles.exerciseItem}>
                  <View style={styles.exerciseNumber}>
                    <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.exerciseContent}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <View style={styles.exerciseDetails}>
                      <Text style={styles.exerciseSetsReps}>
                        {exercise.sets} sets × {exercise.reps} reps
                      </Text>
                    </View>
                    {exercise.equipment && exercise.equipment.length > 0 && (
                      <View style={styles.equipmentRow}>
                        <Ionicons name="fitness-outline" size={14} color={tokens.colors.text.secondary} />
                        <Text style={styles.equipmentText}>
                          {exercise.equipment.join(', ')}
                        </Text>
                      </View>
                    )}
                    {exercise.notes && (
                      <View style={styles.notesRow}>
                        <Ionicons name="information-circle-outline" size={14} color={tokens.colors.text.secondary} />
                        <Text style={styles.notesText}>{exercise.notes}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Bottom Padding for Action Buttons */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.swapButton}
          onPress={() => setShowSwapModal(true)}
        >
          <Ionicons name="swap-horizontal" size={20} color={tokens.colors.text.primary} />
          <Text style={styles.swapButtonText}>Swap</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => console.log('Start workout')}
        >
          <Ionicons name="play" size={20} color="#fff" />
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>

      {/* Swap Workout Modal */}
      <SwapWorkoutModal
        visible={showSwapModal}
        onClose={() => setShowSwapModal(false)}
        workoutId={workoutId}
        onSwapComplete={(message) => {
          console.log(message);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background.white,
  },
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background.white,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
    gap: tokens.spacing.md,
  },
  errorText: {
    ...tokens.typography.body.l,
    color: tokens.colors.text.primary,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    backgroundColor: '#14B8A6',
    borderRadius: 12,
    marginTop: tokens.spacing.md,
  },
  retryButtonText: {
    ...tokens.typography.body.m,
    fontWeight: '600' as const,
    color: '#fff',
  },
  header: {
    padding: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.borders.light,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.md,
  },
  titleSection: {
    flex: 1,
    gap: tokens.spacing.sm,
  },
  workoutName: {
    ...tokens.typography.heading.h1,
    fontSize: 28,
    color: tokens.colors.text.primary,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: 16,
  },
  typeBadgeText: {
    ...tokens.typography.body.s,
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#fff',
    textTransform: 'capitalize',
  },
  categoryBadge: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: 16,
    backgroundColor: tokens.colors.background.offWhite,
  },
  categoryBadgeText: {
    ...tokens.typography.body.s,
    fontSize: 12,
    fontWeight: '600' as const,
    color: tokens.colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  statValue: {
    ...tokens.typography.heading.h2,
    fontSize: 24,
    color: tokens.colors.text.primary,
  },
  statLabel: {
    ...tokens.typography.body.s,
    fontSize: 12,
    color: tokens.colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: tokens.colors.borders.light,
  },
  section: {
    padding: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.borders.light,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  sectionTitle: {
    ...tokens.typography.heading.h2,
    fontSize: 20,
    color: tokens.colors.text.primary,
    flex: 1,
  },
  emptyExercisesContainer: {
    paddingVertical: tokens.spacing['2xl'],
    alignItems: 'center',
  },
  emptyExercisesText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  exercisesList: {
    gap: tokens.spacing.lg,
  },
  exerciseItem: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseNumberText: {
    ...tokens.typography.body.m,
    fontWeight: '700' as const,
    color: '#fff',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    ...tokens.typography.body.l,
    fontWeight: '600' as const,
    color: tokens.colors.text.primary,
    marginBottom: 4,
  },
  exerciseDetails: {
    marginBottom: 4,
  },
  exerciseSetsReps: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
  },
  equipmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  equipmentText: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
  },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 4,
  },
  notesText: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
    flex: 1,
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: 100,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.borders.light,
    backgroundColor: tokens.colors.background.white,
  },
  swapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: tokens.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tokens.colors.borders.divider,
    backgroundColor: tokens.colors.background.white,
  },
  swapButtonText: {
    ...tokens.typography.body.m,
    fontWeight: '600' as const,
    color: tokens.colors.text.primary,
  },
  startButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: tokens.spacing.md,
    borderRadius: 12,
    backgroundColor: '#14B8A6',
  },
  startButtonText: {
    ...tokens.typography.body.m,
    fontWeight: '600' as const,
    color: '#fff',
  },
});
