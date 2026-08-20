/**
 * Today's Meals Display Component
 * Phase 3: Q3.0 App Shell - Home Tab
 * Shows planned meals with checkboxes for quick-logging
 * Spec: IMPLEMENTATION_PLAN.md lines 1392-1412
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import tokens from '../../theme/tokens';

interface MealData {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isLogged: boolean;
  loggedAt?: string; // Time string (e.g., "12:45 PM")
  isFavorited?: boolean;
}

interface Props {
  meals: MealData[];
  onMealPress: (mealId: string) => void;
  onCheckboxPress: (mealId: string) => void;
  onFavoritePress?: (mealId: string) => void;
  onViewWeekPress?: () => void;
}

// Meal type colors from Q3.0 spec
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

export default function TodaysMealsDisplay({ meals, onMealPress, onCheckboxPress, onFavoritePress, onViewWeekPress }: Props) {
  const renderMealCard = (meal: MealData) => {
    return (
      <TouchableOpacity
        key={meal.id}
        style={[styles.mealCard, meal.isLogged && styles.mealCardLogged]}
        onPress={() => onMealPress(meal.id)}
        activeOpacity={0.7}
      >
        {/* Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => onCheckboxPress(meal.id)}
          activeOpacity={0.6}
        >
          <View style={[styles.checkbox, meal.isLogged && styles.checkboxChecked]}>
            {meal.isLogged && <View style={styles.checkboxInner} />}
          </View>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.mealContent}>
          {/* Title Row */}
          <View style={styles.titleRow}>
            <Text style={styles.mealName} numberOfLines={1}>
              {meal.name}
            </Text>
            {meal.isLogged && (
              <View style={styles.loggedBadge}>
                <Text style={styles.loggedBadgeText}>Logged</Text>
              </View>
            )}
          </View>

          {/* Meal Type + Calories */}
          <View style={styles.metaRow}>
            <View
              style={[
                styles.mealTypePill,
                { backgroundColor: `${MEAL_TYPE_COLORS[meal.mealType]}20` },
              ]}
            >
              <Text style={[styles.mealTypeText, { color: MEAL_TYPE_COLORS[meal.mealType] }]}>
                {MEAL_TYPE_LABELS[meal.mealType]}
              </Text>
            </View>
            <Text style={styles.calorieText}>• {meal.calories} cal</Text>
          </View>

          {/* Macros */}
          <Text style={styles.macrosText}>
            {meal.protein}g protein • {meal.carbs}g carbs • {meal.fat}g fat
          </Text>

          {/* Logged timestamp */}
          {meal.isLogged && meal.loggedAt && (
            <Text style={styles.loggedAtText}>Logged at {meal.loggedAt}</Text>
          )}
        </View>

        {/* Actions: Favorite + Arrow */}
        <View style={styles.actionsContainer}>
          {onFavoritePress && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => onFavoritePress(meal.id)}
              activeOpacity={0.6}
            >
              <Text style={[styles.favoriteIcon, meal.isFavorited && styles.favoriteIconActive]}>
                {meal.isFavorited ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          )}
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </View>
      </TouchableOpacity>
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

      {/* Meal Cards */}
      <View style={styles.mealsContainer}>
        {meals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Generating your meal plan...</Text>
            <Text style={styles.emptyStateText}>
              This will take just a moment
            </Text>
          </View>
        ) : (
          meals.map((meal) => renderMealCard(meal))
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
    backgroundColor: '#FFB347',
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
    backgroundColor: '#FFB347',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 24,
    fontWeight: '300' as const,
    color: tokens.colors.text.white,
  },
  mealsContainer: {
    gap: tokens.spacing.sm,
  },
  mealCard: {
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
  mealCardLogged: {
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
  mealContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: tokens.spacing.xs,
  },
  mealName: {
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
    gap: 6,
  },
  mealTypePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  mealTypeText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  calorieText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  macrosText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  loggedAtText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 20,
    color: '#C7C7CC',
  },
  favoriteIconActive: {
    color: '#FFB347', // Amber for nutrition mode
  },
  arrowContainer: {
    marginLeft: tokens.spacing.xs,
  },
  arrow: {
    fontSize: 24,
    color: '#C7C7CC',
    fontWeight: '300' as const,
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
