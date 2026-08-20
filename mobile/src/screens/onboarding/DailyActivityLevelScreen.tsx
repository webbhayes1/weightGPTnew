/**
 * Daily Activity Level Screen (Step 7/12)
 * Q1 Onboarding - Select daily activity level
 * Prompt: "How active are you?"
 * Options:
 * - Sedentary: Desk job, little to no exercise
 * - Moderately Active: Exercise 3-5 days/week, active job
 * - Very Active: Exercise 6-7 days/week, physically demanding job
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import { ActivityLevel } from '../../types/onboarding.types';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

type DailyActivityLevelScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'DailyActivityLevel'>;

interface DailyActivityLevelScreenProps {
  navigation: DailyActivityLevelScreenNavigationProp;
}

interface ActivityOption {
  value: ActivityLevel;
  label: string;
  description: string;
  icon: string;
}

const activityOptions: ActivityOption[] = [
  {
    value: 'sedentary',
    label: 'Sedentary',
    description: 'Desk job, little to no exercise',
    icon: '🪑',
  },
  {
    value: 'moderately_active',
    label: 'Moderately Active',
    description: 'Exercise 3-5 days/week or active job',
    icon: '🚶',
  },
  {
    value: 'very_active',
    label: 'Very Active',
    description: 'Exercise 6-7 days/week or physically demanding job',
    icon: '🏃',
  },
];

export default function DailyActivityLevelScreen({ navigation }: DailyActivityLevelScreenProps) {
  const { data, setActivityLevel } = useOnboardingStore();

  const [selectedLevel, setSelectedLevel] = useState<ActivityLevel | null>(
    data.activityLevel || null
  );

  const handleSelectLevel = (level: ActivityLevel) => {
    setSelectedLevel(level);
  };

  const handleContinue = () => {
    if (!selectedLevel) return;

    // Store activity level
    setActivityLevel(selectedLevel);

    // Navigate to Loading Break 1 (calculation screen)
    navigation.navigate('LoadingBreak1');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isValid = selectedLevel !== null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(7/12) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            How active{'\n'}are you?
          </Text>
        </View>

        {/* Activity Options */}
        <View style={styles.optionsContainer}>
          {activityOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                selectedLevel === option.value && styles.optionCardSelected,
              ]}
              onPress={() => handleSelectLevel(option.value)}
            >
              <View style={styles.optionContent}>
                {option.icon && <Text style={styles.optionIcon}>{option.icon}</Text>}
                <View style={styles.optionTextContainer}>
                  <Text
                    style={[
                      styles.optionLabel,
                      selectedLevel === option.value && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      selectedLevel === option.value && styles.optionDescriptionSelected,
                    ]}
                  >
                    {option.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Helper Text */}
        <View style={styles.helperContainer}>
          <Text style={styles.helperText}>
            This helps us calculate your daily calorie needs accurately
          </Text>
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
  helperContainer: {
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: tokens.borderRadius.md,
  },
  helperText: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
    textAlign: 'center' as const,
  },
  bottomContainer: {
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xl,
    paddingTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.borders.light,
  },
});
