/**
 * Meal Variety Preference Screen (Step 10/17)
 * Q1 Onboarding - Select meal variety preference for weekly meal plan
 * Prompt: "How do you prefer your weekly meal plan?"
 * Options:
 * - Meal prep style (fewer recipes, repeat meals throughout week)
 * - Maximum variety (different meals every day)
 * - Balanced (some variety, some repeats)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList, MealVarietyPreference } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

type MealVarietyScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'MealVariety'>;

interface MealVarietyScreenProps {
  navigation: MealVarietyScreenNavigationProp;
}

interface VarietyOption {
  value: MealVarietyPreference;
  label: string;
  description: string;
  icon: string;
}

const varietyOptions: VarietyOption[] = [
  {
    value: 'meal_prep_style',
    label: 'Meal Prep Style',
    description: 'Fewer recipes, repeat meals throughout week',
    icon: '',
  },
  {
    value: 'maximum_variety',
    label: 'Maximum Variety',
    description: 'Different meals every day',
    icon: '',
  },
  {
    value: 'balanced',
    label: 'Balanced',
    description: 'Some variety, some repeats',
    icon: '',
  },
];

export default function MealVarietyScreen({ navigation }: MealVarietyScreenProps) {
  const { data, setMealVarietyPreference } = useOnboardingStore();

  const [selectedVariety, setSelectedVariety] = useState<MealVarietyPreference | null>(
    data.mealVarietyPreference || null
  );

  const handleSelectVariety = (variety: MealVarietyPreference) => {
    setSelectedVariety(variety);
  };

  const handleContinue = () => {
    if (!selectedVariety) return;

    // Store meal variety preference
    setMealVarietyPreference(selectedVariety);

    // Navigate to Eating Pattern (Step 11)
    navigation.navigate('EatingPattern');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isValid = selectedVariety !== null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(10/17) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            How do you prefer{'\n'}your weekly{'\n'}meal plan?
          </Text>
        </View>

        {/* Variety Options */}
        <View style={styles.optionsContainer}>
          {varietyOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                selectedVariety === option.value && styles.optionCardSelected,
              ]}
              onPress={() => handleSelectVariety(option.value)}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionTextContainer}>
                  <Text
                    style={[
                      styles.optionLabel,
                      selectedVariety === option.value && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      selectedVariety === option.value && styles.optionDescriptionSelected,
                    ]}
                  >
                    {option.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingBottom: tokens.spacing.xl,
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
  optionsContainer: {
    gap: tokens.spacing.lg,
    marginBottom: tokens.spacing.xl,
  },
  optionCard: {
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.rounded,
    backgroundColor: tokens.colors.background.offWhite,
    borderWidth: 2,
    borderColor: 'transparent',
    ...tokens.shadows.card,
  },
  optionCardSelected: {
    backgroundColor: tokens.colors.nutrition.blueLight,
    borderColor: 'transparent',
  },
  optionContent: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: tokens.spacing.lg,
  },
  optionIcon: {
    fontSize: 40,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    ...tokens.typography.heading.h2,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  optionLabelSelected: {
    color: tokens.colors.text.white,
    fontWeight: '700' as const,
  },
  optionDescription: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
  },
  optionDescriptionSelected: {
    color: tokens.colors.text.white,
  },
  bottomContainer: {
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xl,
    paddingTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.borders.light,
  },
});
