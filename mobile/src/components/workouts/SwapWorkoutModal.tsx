/**
 * Swap Workout Modal
 * Bottom sheet modal for selecting an alternative workout to swap with
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useWorkoutSwapAlternatives, useSwapWorkout, getDayName, WorkoutSwapAlternative } from '../../hooks/useWorkoutSwap';
import { useToast } from '../common/Toast';
import tokens from '../../theme/tokens';

interface SwapWorkoutModalProps {
  visible: boolean;
  onClose: () => void;
  workoutId: string;
  onSwapComplete: (message: string) => void;
}

export default function SwapWorkoutModal({
  visible,
  onClose,
  workoutId,
  onSwapComplete,
}: SwapWorkoutModalProps) {
  const { data, isLoading, error } = useWorkoutSwapAlternatives(workoutId, visible);
  const swapMutation = useSwapWorkout();
  const { showToast } = useToast();

  const handleSwap = async (alternative: WorkoutSwapAlternative) => {
    try {
      await swapMutation.mutateAsync({
        workoutId,
        replacementWorkoutId: alternative.id,
      });

      // Haptic feedback on success
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Show toast notification
      showToast(`Swapped to ${alternative.name}`, 'success');

      onClose();
      onSwapComplete(`Swapped to ${alternative.name}`);
    } catch (err) {
      console.error('Swap failed:', err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showToast('Failed to swap workout', 'error');
    }
  };

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

  // Group alternatives by day
  const groupedAlternatives = React.useMemo(() => {
    if (!data?.alternatives) return {};

    return data.alternatives.reduce((acc, workout) => {
      const day = getDayName(workout.dayOfWeek);
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(workout);
      return acc;
    }, {} as Record<string, WorkoutSwapAlternative[]>);
  }, [data?.alternatives]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={tokens.colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Swap This Workout</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Original Workout Reference */}
          {data?.originalWorkout && (
            <View style={styles.originalWorkout}>
              <Text style={styles.originalLabel}>Swapping:</Text>
              <Text style={styles.originalName}>{data.originalWorkout.name}</Text>
              <View style={styles.originalDetails}>
                <View style={[styles.typeBadge, { backgroundColor: getWorkoutTypeColor(data.originalWorkout.type) }]}>
                  <Text style={styles.typeBadgeText}>{data.originalWorkout.type}</Text>
                </View>
                <Text style={styles.originalStats}>
                  {data.originalWorkout.durationMinutes} min • {data.originalWorkout.estimatedCalories} cal
                </Text>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* Content */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#14B8A6" />
              <Text style={styles.loadingText}>Finding alternatives...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
              <Text style={styles.errorText}>Failed to load alternatives</Text>
            </View>
          ) : data?.alternatives.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="barbell-outline" size={48} color={tokens.colors.text.secondary} />
              <Text style={styles.emptyTitle}>No alternatives available</Text>
              <Text style={styles.emptyText}>
                There are no other workouts to swap with.
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.alternativesList} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionTitle}>Choose a workout to swap with:</Text>

              {Object.entries(groupedAlternatives).map(([day, workouts]) => (
                <View key={day}>
                  <Text style={styles.dayLabel}>{day}</Text>
                  {workouts.map((alternative) => (
                    <TouchableOpacity
                      key={alternative.id}
                      style={styles.alternativeCard}
                      onPress={() => handleSwap(alternative)}
                      disabled={swapMutation.isPending}
                    >
                      <View style={styles.alternativeContent}>
                        <View style={styles.alternativeHeader}>
                          <Text style={styles.alternativeName}>{alternative.name}</Text>
                          {alternative.isFavorite && (
                            <Ionicons name="heart" size={16} color="#EF4444" />
                          )}
                        </View>
                        <View style={styles.alternativeDetails}>
                          <View style={[styles.smallTypeBadge, { backgroundColor: getWorkoutTypeColor(alternative.type) }]}>
                            <Text style={styles.smallTypeBadgeText}>{alternative.type}</Text>
                          </View>
                          <Text style={styles.alternativeStats}>
                            {alternative.durationMinutes} min • {alternative.estimatedCalories} cal
                          </Text>
                        </View>
                      </View>
                      <Ionicons
                        name="swap-horizontal"
                        size={20}
                        color={tokens.colors.text.secondary}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              ))}

              <View style={styles.bottomSpacer} />
            </ScrollView>
          )}

          {/* Loading overlay during swap */}
          {swapMutation.isPending && (
            <View style={styles.swapOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.swapOverlayText}>Swapping...</Text>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: tokens.colors.background.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.borders.light,
  },
  closeButton: {
    padding: tokens.spacing.xs,
  },
  title: {
    ...tokens.typography.heading.h2,
    fontSize: 20,
    color: tokens.colors.text.primary,
  },
  placeholder: {
    width: 32,
  },
  originalWorkout: {
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.background.offWhite,
  },
  originalLabel: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
    marginBottom: 4,
  },
  originalName: {
    ...tokens.typography.heading.h2,
    fontSize: 18,
    color: tokens.colors.text.primary,
    marginBottom: 8,
  },
  originalDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  typeBadgeText: {
    ...tokens.typography.body.s,
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#fff',
    textTransform: 'capitalize',
  },
  originalStats: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: tokens.colors.borders.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
    gap: tokens.spacing.md,
  },
  emptyTitle: {
    ...tokens.typography.heading.h2,
    fontSize: 18,
    color: tokens.colors.text.primary,
  },
  emptyText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
  },
  alternativesList: {
    flex: 1,
    padding: tokens.spacing.lg,
  },
  sectionTitle: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.md,
  },
  dayLabel: {
    ...tokens.typography.heading.h3,
    fontSize: 16,
    color: tokens.colors.text.primary,
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  alternativeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.background.white,
    borderRadius: 12,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.borders.light,
  },
  alternativeContent: {
    flex: 1,
  },
  alternativeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    marginBottom: 4,
  },
  alternativeName: {
    ...tokens.typography.body.l,
    fontWeight: '600' as const,
    color: tokens.colors.text.primary,
    flex: 1,
  },
  alternativeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  smallTypeBadge: {
    paddingHorizontal: tokens.spacing.xs,
    paddingVertical: 1,
    borderRadius: 8,
  },
  smallTypeBadgeText: {
    ...tokens.typography.body.s,
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#fff',
    textTransform: 'capitalize',
  },
  alternativeStats: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
  },
  bottomSpacer: {
    height: tokens.spacing.xl,
  },
  swapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: tokens.spacing.md,
  },
  swapOverlayText: {
    ...tokens.typography.body.l,
    color: '#fff',
    fontWeight: '600' as const,
  },
});
