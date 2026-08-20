/**
 * Meal Detail Screen
 * Phase 4: Q2 Meal Planning - Full recipe view with ingredients, instructions, and actions
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HomeStackScreenProps } from '../../types/navigation.types';
import { useMealDetail } from '../../hooks/useMealDetail';
import SwapMealChoiceModal from '../../components/meals/SwapMealChoiceModal';
import QuickSwapMealModal from '../../components/meals/QuickSwapMealModal';
import AIGenerateMealModal from '../../components/meals/AIGenerateMealModal';
import MealFeedbackModal from '../../components/meals/MealFeedbackModal';
import tokens from '../../theme/tokens';

type Props = HomeStackScreenProps<'MealDetail'>;

export default function MealDetailScreen({ route, navigation }: Props) {
  const { mealId } = route.params;
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showQuickSwapModal, setShowQuickSwapModal] = useState(false);
  const [showAIGenerateModal, setShowAIGenerateModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Fetch meal details from API
  const { data: meal, isLoading, error, refetch } = useMealDetail(mealId);

  const handleSwapComplete = (message: string) => {
    // Navigate back to the meal plan view since the old meal no longer exists
    navigation.goBack();
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFB347" />
          <Text style={styles.loadingText}>Loading meal details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !meal) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>Failed to load meal</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getMealTypeColor = (type: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const colors = {
      breakfast: '#FFB347',
      lunch: '#E0A458',
      dinner: '#C08497',
      snack: '#5BC0BE',
    };
    return colors[type];
  };

  const formatQuantity = (quantity: number) => {
    // Format decimal quantities nicely (0.5 → ½, 0.25 → ¼, etc.)
    if (quantity === 0.5) return '½';
    if (quantity === 0.25) return '¼';
    if (quantity === 0.75) return '¾';
    if (quantity === 0.33) return '⅓';
    if (quantity === 0.67) return '⅔';
    if (quantity % 1 === 0) return quantity.toString();
    return quantity.toFixed(1);
  };

  const totalTime = (meal.prepTimeMin || 0) + (meal.cookTimeMin || 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        {meal.imageUrl && (
          <Image
            source={{ uri: meal.imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        )}

        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.titleSection}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <View style={[styles.mealTypeBadge, { backgroundColor: getMealTypeColor(meal.mealType) }]}>
                <Text style={styles.mealTypeBadgeText}>{meal.mealType}</Text>
              </View>
            </View>
          </View>

          {/* Macros Summary */}
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{meal.calories}</Text>
              <Text style={styles.macroLabel}>Calories</Text>
            </View>
            <View style={styles.macroDivider} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{meal.protein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroDivider} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{meal.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroDivider} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{meal.fat}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>

          {/* Time Info */}
          <View style={styles.timeContainer}>
            {meal.prepTimeMin && (
              <View style={styles.timeItem}>
                <Ionicons name="time-outline" size={16} color={tokens.colors.text.secondary} />
                <Text style={styles.timeText}>Prep: {meal.prepTimeMin} min</Text>
              </View>
            )}
            {meal.cookTimeMin && (
              <View style={styles.timeItem}>
                <Ionicons name="flame-outline" size={16} color={tokens.colors.text.secondary} />
                <Text style={styles.timeText}>Cook: {meal.cookTimeMin} min</Text>
              </View>
            )}
            {totalTime > 0 && (
              <View style={styles.timeItem}>
                <Ionicons name="timer-outline" size={16} color={tokens.colors.text.secondary} />
                <Text style={styles.timeText}>Total: {totalTime} min</Text>
              </View>
            )}
          </View>
        </View>

        {/* Ingredients Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={24} color={tokens.colors.text.primary} />
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.servingsText}>Serves 1</Text>
          </View>
          {meal.ingredients && meal.ingredients.length > 0 ? (
            <View style={styles.ingredientsList}>
              {meal.ingredients.map((ingredient) => (
                <View key={ingredient.id} style={styles.ingredientItem}>
                  <View style={styles.ingredientCheckbox} />
                  <Text style={styles.ingredientText}>
                    <Text style={styles.ingredientQuantity}>
                      {formatQuantity(ingredient.quantity)} {ingredient.unit}
                    </Text>
                    {' '}
                    {ingredient.name}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFB347" />
              <Text style={styles.loadingText}>Loading recipe...</Text>
            </View>
          )}
        </View>

        {/* Instructions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={24} color={tokens.colors.text.primary} />
            <Text style={styles.sectionTitle}>Instructions</Text>
          </View>
          {meal.recipeSteps && meal.recipeSteps.length > 0 ? (
            <View style={styles.instructionsList}>
              {meal.recipeSteps.map((step) => (
                <View key={step.stepNumber} style={styles.instructionItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
                  </View>
                  <Text style={styles.instructionText}>{step.instruction}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFB347" />
              <Text style={styles.loadingText}>Loading instructions...</Text>
            </View>
          )}
        </View>

        {/* Bottom Padding for Action Buttons */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={() => setShowFeedbackModal(true)}
        >
          <Ionicons name="thumbs-up-outline" size={20} color={tokens.colors.text.primary} />
          <Text style={styles.feedbackButtonText}>Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.swapButton}
          onPress={() => setShowChoiceModal(true)}
        >
          <Ionicons name="swap-horizontal" size={20} color="#fff" />
          <Text style={styles.swapButtonText}>Swap Meal</Text>
        </TouchableOpacity>
      </View>

      {/* Swap Choice Modal (initial modal with 2 options) */}
      <SwapMealChoiceModal
        visible={showChoiceModal}
        onClose={() => setShowChoiceModal(false)}
        onQuickSwap={() => {
          setShowChoiceModal(false);
          setShowQuickSwapModal(true);
        }}
        onAIGenerate={() => {
          setShowChoiceModal(false);
          setShowAIGenerateModal(true);
        }}
      />

      {/* Quick Swap Modal (choose from week) */}
      <QuickSwapMealModal
        visible={showQuickSwapModal}
        onClose={() => setShowQuickSwapModal(false)}
        mealId={mealId}
        onSwapComplete={handleSwapComplete}
      />

      {/* AI Generate Modal (AI alternatives) */}
      <AIGenerateMealModal
        visible={showAIGenerateModal}
        onClose={() => setShowAIGenerateModal(false)}
        mealId={mealId}
        onSwapComplete={handleSwapComplete}
      />

      {/* Feedback Modal */}
      <MealFeedbackModal
        visible={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        mealId={mealId}
        mealName={meal.name}
        ingredients={meal.ingredients}
        onFeedbackComplete={() => refetch()}
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
    backgroundColor: '#FFB347',
    borderRadius: 12,
    marginTop: tokens.spacing.md,
  },
  retryButtonText: {
    ...tokens.typography.body.m,
    fontWeight: '600' as const,
    color: '#fff',
  },
  heroImage: {
    width: '100%',
    height: 240,
    backgroundColor: tokens.colors.background.offWhite,
  },
  header: {
    padding: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.borders.light,
  },
  headerTop: {
    marginBottom: tokens.spacing.md,
  },
  titleSection: {
    gap: tokens.spacing.sm,
  },
  mealName: {
    ...tokens.typography.heading.h1,
    fontSize: 28,
    color: tokens.colors.text.primary,
  },
  mealTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: 16,
  },
  mealTypeBadgeText: {
    ...tokens.typography.body.s,
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#fff',
    textTransform: 'capitalize',
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: 12,
    marginBottom: tokens.spacing.md,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    ...tokens.typography.heading.h2,
    fontSize: 24,
    color: tokens.colors.text.primary,
    marginBottom: 4,
  },
  macroLabel: {
    ...tokens.typography.body.s,
    fontSize: 12,
    color: tokens.colors.text.secondary,
  },
  macroDivider: {
    width: 1,
    height: 40,
    backgroundColor: tokens.colors.borders.light,
  },
  timeContainer: {
    flexDirection: 'row',
    gap: tokens.spacing.lg,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
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
  servingsText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
  },
  ingredientsList: {
    gap: tokens.spacing.md,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: tokens.spacing.md,
  },
  ingredientCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: tokens.colors.borders.divider,
    marginTop: 2,
  },
  ingredientText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.primary,
    flex: 1,
  },
  ingredientQuantity: {
    fontWeight: '600' as const,
    color: tokens.colors.text.primary,
  },
  instructionsList: {
    gap: tokens.spacing.lg,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tokens.colors.nutrition.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    ...tokens.typography.body.m,
    fontWeight: '700' as const,
    color: '#fff',
  },
  instructionText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.primary,
    flex: 1,
    lineHeight: 22,
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
  feedbackButton: {
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
  feedbackButtonText: {
    ...tokens.typography.body.m,
    fontWeight: '600' as const,
    color: tokens.colors.text.primary,
  },
  swapButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: tokens.spacing.md,
    borderRadius: 12,
    backgroundColor: tokens.colors.nutrition.blue,
  },
  swapButtonText: {
    ...tokens.typography.body.m,
    fontWeight: '600' as const,
    color: '#fff',
  },
});
