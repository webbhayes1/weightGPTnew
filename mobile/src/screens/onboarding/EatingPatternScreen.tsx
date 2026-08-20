/**
 * Eating Pattern Screen (Step 9/12)
 * Q1 Onboarding - Select meals per day and which meals to eat
 * Prompt: "How many meals do you typically eat per day?"
 * Options: 2 meals, 3 meals (recommended), 4-5 meals (including snacks)
 * Follow-up: "Which meals do you eat?"
 * Multi-select: Breakfast, Lunch, Dinner, Snacks between meals
 * Default selections based on meals per day choice
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

type EatingPatternScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'EatingPattern'>;

interface EatingPatternScreenProps {
  navigation: EatingPatternScreenNavigationProp;
}

interface MealsPerDayOption {
  value: 2 | 3 | 4;
  label: string;
  recommended?: boolean;
}

interface MealOption {
  value: string;
  label: string;
  icon: string;
}

const mealsPerDayOptions: MealsPerDayOption[] = [
  { value: 2, label: '2 meals' },
  { value: 3, label: '3 meals', recommended: true },
  { value: 4, label: '4-5 meals (including snacks)' },
];

const mealOptions: MealOption[] = [
  { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { value: 'lunch', label: 'Lunch', icon: '☀️' },
  { value: 'dinner', label: 'Dinner', icon: '🌙' },
  { value: 'snacks', label: 'Snacks between meals', icon: '🍎' },
];

export default function EatingPatternScreen({ navigation }: EatingPatternScreenProps) {
  const { data, setEatingPattern } = useOnboardingStore();

  const [selectedMealsPerDay, setSelectedMealsPerDay] = useState<2 | 3 | 4 | null>(
    data.mealsPerDay || null
  );
  const [selectedMeals, setSelectedMeals] = useState<string[]>(
    data.mealPattern || []
  );
  const [includesSnacks, setIncludesSnacks] = useState<boolean>(
    data.includesSnacks || false
  );

  // Apply default selections when meals per day changes
  useEffect(() => {
    if (selectedMealsPerDay === null) return;

    // Only apply defaults if user hasn't manually customized yet
    if (selectedMeals.length === 0 || data.mealsPerDay !== selectedMealsPerDay) {
      if (selectedMealsPerDay === 2) {
        // Pre-select Lunch + Dinner
        setSelectedMeals(['lunch', 'dinner']);
        setIncludesSnacks(false);
      } else if (selectedMealsPerDay === 3) {
        // Pre-select all three main meals
        setSelectedMeals(['breakfast', 'lunch', 'dinner']);
        setIncludesSnacks(false);
      } else if (selectedMealsPerDay === 4) {
        // Pre-select all three + snacks
        setSelectedMeals(['breakfast', 'lunch', 'dinner']);
        setIncludesSnacks(true);
      }
    }
  }, [selectedMealsPerDay]);

  const handleSelectMealsPerDay = (count: 2 | 3 | 4) => {
    setSelectedMealsPerDay(count);
  };

  const handleToggleMeal = (meal: string) => {
    if (meal === 'snacks') {
      setIncludesSnacks(!includesSnacks);
    } else {
      if (selectedMeals.includes(meal)) {
        setSelectedMeals(selectedMeals.filter((m) => m !== meal));
      } else {
        setSelectedMeals([...selectedMeals, meal]);
      }
    }
  };

  const handleContinue = () => {
    if (!selectedMealsPerDay || selectedMeals.length === 0) return;

    // Store eating pattern
    setEatingPattern(selectedMealsPerDay, selectedMeals, includesSnacks);

    // Navigate to Loading Break 2 (Workout Recommendations) - Calculate before asking equipment
    navigation.navigate('LoadingBreak2');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isValid = selectedMealsPerDay !== null && selectedMeals.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(9/12) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Prompt 1: Meals Per Day */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            How many meals{'\n'}do you eat per day?
          </Text>
        </View>

        {/* Meals Per Day Options */}
        <View style={styles.section}>
          <View style={styles.mealsPerDayContainer}>
            {mealsPerDayOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.mealsPerDayButton,
                  selectedMealsPerDay === option.value && styles.mealsPerDayButtonSelected,
                ]}
                onPress={() => handleSelectMealsPerDay(option.value)}
              >
                <Text
                  style={[
                    styles.mealsPerDayButtonText,
                    selectedMealsPerDay === option.value && styles.mealsPerDayButtonTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {option.recommended && (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedBadgeText}>Recommended</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Prompt 2: Which Meals (shown after selecting meals per day) */}
        {selectedMealsPerDay !== null && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Which meals do you eat?</Text>
              <Text style={styles.sectionHelper}>
                We'll create a plan that fits your eating style
              </Text>

              {/* Meal Selection Grid */}
              <View style={styles.mealOptionsGrid}>
                {mealOptions.map((meal) => {
                  const isSelected = meal.value === 'snacks'
                    ? includesSnacks
                    : selectedMeals.includes(meal.value);

                  return (
                    <TouchableOpacity
                      key={meal.value}
                      style={[
                        styles.mealOptionCard,
                        isSelected && styles.mealOptionCardSelected,
                      ]}
                      onPress={() => handleToggleMeal(meal.value)}
                    >
                      <Text style={styles.mealOptionIcon}>{meal.icon}</Text>
                      <Text
                        style={[
                          styles.mealOptionLabel,
                          isSelected && styles.mealOptionLabelSelected,
                        ]}
                      >
                        {meal.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          context="nutrition"
          size="large"
          fullWidth
          disabled={!isValid}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background.white,
  },
  header: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  backButtonText: {
    fontSize: 28,
    color: tokens.colors.text.primary,
  },
  progressContainer: {
    gap: tokens.spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: tokens.colors.borders.light,
    borderRadius: tokens.borderRadius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: tokens.colors.nutrition.blue,
    borderRadius: tokens.borderRadius.pill,
  },
  progressText: {
    ...tokens.typography.caption.m,
    color: tokens.colors.text.tertiary,
    textAlign: 'center' as const,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing['3xl'],
  },
  promptContainer: {
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing['3xl'],
    alignItems: 'center',
  },
  promptText: {
    ...tokens.typography.display.l,
    color: tokens.colors.text.primary,
    textAlign: 'center' as const,
    lineHeight: 40,
  },
  section: {
    marginBottom: tokens.spacing['3xl'],
  },
  sectionLabel: {
    ...tokens.typography.heading.h2,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.sm,
  },
  sectionHelper: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.lg,
  },
  mealsPerDayContainer: {
    gap: tokens.spacing.md,
  },
  mealsPerDayButton: {
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.rounded,
    backgroundColor: tokens.colors.background.offWhite,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative' as const,
  },
  mealsPerDayButtonSelected: {
    backgroundColor: tokens.colors.nutrition.blue,
    borderColor: 'transparent',
  },
  mealsPerDayButtonText: {
    ...tokens.typography.heading.h2,
    color: tokens.colors.text.primary,
    textAlign: 'center' as const,
  },
  mealsPerDayButtonTextSelected: {
    color: tokens.colors.text.white,
    fontWeight: '700' as const,
  },
  recommendedBadge: {
    position: 'absolute' as const,
    top: tokens.spacing.sm,
    right: tokens.spacing.sm,
    backgroundColor: tokens.colors.nutrition.blue,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: tokens.borderRadius.xs,
  },
  recommendedBadgeText: {
    ...tokens.typography.caption.s,
    color: tokens.colors.text.white,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  },
  mealOptionsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: tokens.spacing.md,
  },
  mealOptionCard: {
    width: '47%',
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.rounded,
    backgroundColor: tokens.colors.background.offWhite,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    position: 'relative' as const,
    minHeight: 100,
  },
  mealOptionCardSelected: {
    backgroundColor: tokens.colors.nutrition.blue,
    borderColor: 'transparent',
  },
  mealOptionIcon: {
    fontSize: 32,
    marginBottom: tokens.spacing.sm,
  },
  mealOptionLabel: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.primary,
    textAlign: 'center' as const,
  },
  mealOptionLabelSelected: {
    color: tokens.colors.text.white,
    fontWeight: '700' as const,
  },
  bottomContainer: {
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xl,
    paddingTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.borders.light,
  },
});
