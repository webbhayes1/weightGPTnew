/**
 * Quick Swap Meal Modal
 * Bottom sheet modal for selecting an alternative meal from the current week
 * This is the "Choose from Week" option in the meal swap flow
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
import { useSwapAlternatives, useSwapMeal, getDayName, SwapAlternative, useSwappedMeals, SwappedMeal } from '../../hooks/useMealSwap';
import { useToast } from '../common/Toast';
import tokens from '../../theme/tokens';

interface QuickSwapMealModalProps {
  visible: boolean;
  onClose: () => void;
  mealId: string;
  onSwapComplete: (message: string) => void;
}

export default function QuickSwapMealModal({
  visible,
  onClose,
  mealId,
  onSwapComplete,
}: QuickSwapMealModalProps) {
  const { data, isLoading, error } = useSwapAlternatives(mealId, visible);
  const { data: swappedData } = useSwappedMeals();
  const swapMutation = useSwapMeal();
  const { showToast } = useToast();

  const handleSwap = async (alternative: SwapAlternative) => {
    try {
      await swapMutation.mutateAsync({
        mealId,
        replacementMealId: alternative.id,
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
      showToast('Failed to swap meal', 'error');
    }
  };

  const handleSwapBack = async (swappedMeal: SwappedMeal) => {
    try {
      await swapMutation.mutateAsync({
        mealId,
        replacementMealId: swappedMeal.id,
      });

      // Haptic feedback on success
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Show toast notification
      showToast(`Swapped back to ${swappedMeal.name}`, 'success');

      onClose();
      onSwapComplete(`Swapped back to ${swappedMeal.name}`);
    } catch (err) {
      console.error('Swap back failed:', err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showToast('Failed to swap meal', 'error');
    }
  };

  const getMealTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      breakfast: '#FFB347',
      lunch: '#E0A458',
      dinner: '#C08497',
      snack: '#5BC0BE',
    };
    return colors[type] || '#FFB347';
  };

  // Group alternatives by day
  const groupedAlternatives = React.useMemo(() => {
    if (!data?.alternatives) return {};

    return data.alternatives.reduce((acc, meal) => {
      const day = getDayName(meal.dayOfWeek);
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(meal);
      return acc;
    }, {} as Record<string, SwapAlternative[]>);
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
            <Text style={styles.title}>Swap This Meal</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Original Meal Reference */}
          {data?.originalMeal && (
            <View style={styles.originalMeal}>
              <Text style={styles.originalLabel}>Swapping:</Text>
              <Text style={styles.originalName}>{data.originalMeal.name}</Text>
              <View style={styles.originalDetails}>
                <View style={[styles.mealTypeBadge, { backgroundColor: getMealTypeColor(data.originalMeal.mealType) }]}>
                  <Text style={styles.mealTypeBadgeText}>{data.originalMeal.mealType}</Text>
                </View>
                <Text style={styles.originalCalories}>{data.originalMeal.calories} cal</Text>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* Content */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFB347" />
              <Text style={styles.loadingText}>Finding alternatives...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
              <Text style={styles.errorText}>Failed to load alternatives</Text>
            </View>
          ) : data?.alternatives.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={48} color={tokens.colors.text.secondary} />
              <Text style={styles.emptyTitle}>No alternatives available</Text>
              <Text style={styles.emptyText}>
                There are no other {data?.originalMeal.mealType} meals to swap with.
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.alternativesList} showsVerticalScrollIndicator={false}>
              {/* Recently Swapped Section */}
              {swappedData?.meals && swappedData.meals.length > 0 && (
                <View style={styles.swappedSection}>
                  <View style={styles.swappedHeader}>
                    <Ionicons name="time-outline" size={20} color="#FFB347" />
                    <Text style={styles.swappedTitle}>Recently Swapped</Text>
                  </View>
                  <Text style={styles.swappedSubtitle}>Tap to swap back to these meals</Text>

                  {swappedData.meals.map((swappedMeal) => (
                    <TouchableOpacity
                      key={swappedMeal.id}
                      style={styles.swappedCard}
                      onPress={() => handleSwapBack(swappedMeal)}
                      disabled={swapMutation.isPending}
                    >
                      <View style={styles.alternativeContent}>
                        <View style={styles.alternativeHeader}>
                          <Text style={styles.alternativeName}>{swappedMeal.name}</Text>
                        </View>
                        <View style={styles.alternativeMacros}>
                          <Text style={styles.alternativeCalories}>{swappedMeal.calories} cal</Text>
                          <Text style={styles.macroText}>
                            {swappedMeal.protein}g P • {swappedMeal.carbs}g C • {swappedMeal.fat}g F
                          </Text>
                        </View>
                        <Text style={styles.swappedTime}>
                          Swapped {getDayName(swappedMeal.dayOfWeek)}
                        </Text>
                      </View>
                      <Ionicons
                        name="arrow-undo"
                        size={20}
                        color="#FFB347"
                      />
                    </TouchableOpacity>
                  ))}

                  <View style={styles.sectionDivider} />
                </View>
              )}

              <Text style={styles.sectionTitle}>Choose a meal to swap with:</Text>

              {Object.entries(groupedAlternatives).map(([day, meals]) => (
                <View key={day}>
                  <Text style={styles.dayLabel}>{day}</Text>
                  {meals.map((alternative) => (
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
                        <View style={styles.alternativeMacros}>
                          <Text style={styles.alternativeCalories}>{alternative.calories} cal</Text>
                          <Text style={styles.macroText}>
                            {alternative.protein}g P • {alternative.carbs}g C • {alternative.fat}g F
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
  originalMeal: {
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
  mealTypeBadge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  mealTypeBadgeText: {
    ...tokens.typography.body.s,
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#fff',
    textTransform: 'capitalize',
  },
  originalCalories: {
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
  alternativeMacros: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  alternativeCalories: {
    ...tokens.typography.body.m,
    fontWeight: '600' as const,
    color: tokens.colors.text.primary,
  },
  macroText: {
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
  swappedSection: {
    marginBottom: tokens.spacing.lg,
  },
  swappedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  swappedTitle: {
    ...tokens.typography.heading.h3,
    fontSize: 16,
    color: tokens.colors.text.primary,
  },
  swappedSubtitle: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.md,
  },
  swappedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 179, 71, 0.05)',
    borderRadius: 12,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 179, 71, 0.2)',
  },
  swappedTime: {
    ...tokens.typography.body.s,
    fontSize: 12,
    color: tokens.colors.text.secondary,
    marginTop: 4,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: tokens.colors.borders.light,
    marginVertical: tokens.spacing.lg,
  },
});
