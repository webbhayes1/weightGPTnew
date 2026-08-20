/**
 * Weekly Meals Screen
 * Shows all meals for the current week's meal plan
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HomeStackScreenProps } from '../../types/navigation.types';
import { useWeeklyMeals } from '../../hooks/useWeeklyMeals';
import { useMealPlanGeneration } from '../../hooks/useMealPlanGeneration';
import tokens from '../../theme/tokens';
import { AxiosError } from 'axios';

type Props = HomeStackScreenProps<'WeeklyMeals'>;

// Day names for display
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Meal type colors
const MEAL_TYPE_COLORS = {
  breakfast: '#FFB347',
  lunch: '#E0A458',
  dinner: '#C08497',
  snack: '#5BC0BE',
};

const MEAL_TYPE_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

export default function WeeklyMealsScreen({ navigation }: Props) {
  const { data: weeklyData, isLoading, error, refetch } = useWeeklyMeals();
  const generateMutation = useMealPlanGeneration();

  // Check if error is a 404 (no meal plan exists)
  const isNotFound = error && (error as AxiosError)?.response?.status === 404;

  const handleGenerateMealPlan = async () => {
    try {
      await generateMutation.mutateAsync({});
    } catch (err) {
      // Error is handled by mutation state
      console.error('Failed to generate meal plan:', err);
    }
  };

  // Loading state - either fetching or generating
  if (isLoading || generateMutation.isPending) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFB347" />
          <Text style={styles.loadingText}>
            {generateMutation.isPending
              ? 'Generating your personalized meal plan...'
              : 'Loading your meal plan...'}
          </Text>
          {generateMutation.isPending && (
            <Text style={styles.loadingSubtext}>
              This may take 15-30 seconds
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Empty state - no meal plan exists yet
  if (isNotFound || (!weeklyData && !error)) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyTitle}>No Meal Plan Yet</Text>
          <Text style={styles.emptyText}>
            Generate a personalized weekly meal plan based on your goals and preferences.
          </Text>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateMealPlan}
            disabled={generateMutation.isPending}
          >
            <Text style={styles.generateButtonText}>Generate Meal Plan</Text>
          </TouchableOpacity>
          {generateMutation.isError && (
            <Text style={styles.errorMessage}>
              {generateMutation.error instanceof Error
                ? generateMutation.error.message
                : 'Failed to generate meal plan. Please try again.'}
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
          <Text style={styles.errorTitle}>Unable to load meal plan</Text>
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
          <Text style={styles.errorTitle}>No meal plan available</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Group meals by day
  const mealsByDay: Record<number, typeof weeklyData.meals> = {};
  for (let i = 0; i < 7; i++) {
    mealsByDay[i] = [];
  }
  weeklyData.meals.forEach(meal => {
    mealsByDay[meal.dayOfWeek].push(meal);
  });

  // Sort meals within each day by meal type
  const mealTypeOrder = ['breakfast', 'lunch', 'dinner', 'snack'];
  Object.keys(mealsByDay).forEach(day => {
    mealsByDay[parseInt(day)].sort((a, b) =>
      mealTypeOrder.indexOf(a.mealType) - mealTypeOrder.indexOf(b.mealType)
    );
  });

  const handleMealPress = (mealId: string, dayOfWeek: number) => {
    // Calculate the date for this day
    const weekStart = new Date(weeklyData.weekStartDate);
    const mealDate = new Date(weekStart);
    mealDate.setDate(weekStart.getDate() + dayOfWeek);
    const dateStr = mealDate.toISOString().split('T')[0];

    navigation.navigate('MealDetail', { mealId, date: dateStr });
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
          <Text style={styles.weekTitle}>Weekly Meal Plan</Text>
          <Text style={styles.weekDates}>
            {weeklyData.weekStartDate} to {weeklyData.weekEndDate}
          </Text>
        </View>

        {/* Grocery List Button */}
        <TouchableOpacity
          style={styles.groceryListButton}
          onPress={() => navigation.navigate('GroceryList')}
          activeOpacity={0.7}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <Text style={styles.groceryListButtonText}>View Grocery List</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Days */}
        {[0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => {
          const dayMeals = mealsByDay[dayOfWeek];
          const dayTotal = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);

          return (
            <View key={dayOfWeek} style={styles.daySection}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayName}>{DAY_NAMES[dayOfWeek]}</Text>
                <Text style={styles.dayCalories}>{dayTotal} cal</Text>
              </View>

              {dayMeals.length === 0 ? (
                <View style={styles.emptyDay}>
                  <Text style={styles.emptyDayText}>No meals planned</Text>
                </View>
              ) : (
                dayMeals.map(meal => (
                  <TouchableOpacity
                    key={meal.id}
                    style={styles.mealCard}
                    onPress={() => handleMealPress(meal.id, dayOfWeek)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.mealContent}>
                      <View style={styles.mealHeader}>
                        <View
                          style={[
                            styles.mealTypePill,
                            { backgroundColor: `${MEAL_TYPE_COLORS[meal.mealType]}20` },
                          ]}
                        >
                          <Text
                            style={[
                              styles.mealTypeText,
                              { color: MEAL_TYPE_COLORS[meal.mealType] },
                            ]}
                          >
                            {MEAL_TYPE_LABELS[meal.mealType]}
                          </Text>
                        </View>
                        <Text style={styles.mealCalories}>{meal.calories} cal</Text>
                      </View>
                      <Text style={styles.mealName} numberOfLines={1}>
                        {meal.name}
                      </Text>
                      <Text style={styles.mealMacros}>
                        {meal.protein}g P • {meal.carbs}g C • {meal.fat}g F
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
    backgroundColor: '#FFB347',
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
    backgroundColor: '#FFB347',
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
  dayCalories: {
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
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  mealContent: {
    flex: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  mealTypePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mealTypeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  mealCalories: {
    fontSize: 12,
    color: '#8E8E93',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: tokens.colors.text.primary,
    marginBottom: 2,
  },
  mealMacros: {
    fontSize: 12,
    color: '#8E8E93',
  },
  arrow: {
    fontSize: 20,
    color: '#C7C7CC',
    fontWeight: '300',
    marginLeft: tokens.spacing.sm,
  },
  groceryListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4CAF50',
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
    paddingVertical: 14,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groceryListButtonText: {
    flex: 1,
    textAlign: 'center',
    ...tokens.typography.body.l,
    fontWeight: '600' as const,
    color: '#fff',
  },
});
