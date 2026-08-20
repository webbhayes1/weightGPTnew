/**
 * Goal Date Screen (Step 5/12)
 * Q1 Onboarding - Select goal date with timeline validation
 * Prompt: "When do you want to reach your goal?"
 * Input: Date picker (month/year wheel)
 * Validation: Inline validation against safe rates (2 lbs/week loss, 1 lb/week gain)
 * Note: This screen is skipped if goalType === 'maintain'
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

type GoalDateScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'GoalDate'>;

interface GoalDateScreenProps {
  navigation: GoalDateScreenNavigationProp;
}

interface ValidationResult {
  valid: boolean;
  weeklyRate: number;
  weeks: number;
  error?: string;
  recommendedWeeks?: number;
  recommendedDate?: Date;
}

export default function GoalDateScreen({ navigation }: GoalDateScreenProps) {
  const { data, setGoalDate } = useOnboardingStore();

  // Initialize with stored value or 3 months from now
  const getDefaultDate = () => {
    if (data.goalDate) return new Date(data.goalDate);
    const defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() + 3);
    return defaultDate;
  };

  const [selectedDate, setSelectedDate] = useState<Date>(getDefaultDate());
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  // Generate month/year options
  const generateDateOptions = () => {
    const today = new Date();
    const options: Date[] = [];

    // Generate next 12 months
    for (let i = 1; i <= 12; i++) {
      const date = new Date(today);
      date.setMonth(date.getMonth() + i);
      date.setDate(1); // Set to first of month for consistency
      options.push(date);
    }

    return options;
  };

  const dateOptions = generateDateOptions();

  // Timeline validation logic (ported from backend)
  const validateTimeline = (goalDate: Date): ValidationResult => {
    if (!data.currentWeight || !data.goalWeight || !data.goalType) {
      return { valid: false, weeklyRate: 0, weeks: 0, error: 'Missing weight data' };
    }

    // Maintain goal always valid (shouldn't reach here, but safety check)
    if (data.goalType === 'maintain') {
      return { valid: true, weeklyRate: 0, weeks: 0 };
    }

    // Calculate weeks from today to goal_date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const normalizedGoalDate = new Date(goalDate);
    normalizedGoalDate.setHours(0, 0, 0, 0);

    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeks = Math.round((normalizedGoalDate.getTime() - today.getTime()) / millisecondsPerWeek);

    // Calculate weight difference and weekly rate (needed for all validations)
    const weightDiff = data.goalWeight - data.currentWeight;
    const weeklyRate = weeks > 0 ? weightDiff / weeks : 0;

    // Validate timeline range (4-52 weeks)
    if (weeks < 4) {
      const recommendedDate = new Date(today);
      recommendedDate.setDate(recommendedDate.getDate() + 4 * 7); // 4 weeks from today

      return {
        valid: false,
        weeklyRate,
        weeks,
        error: 'Minimum timeline is 4 weeks',
        recommendedWeeks: 4,
        recommendedDate,
      };
    }

    if (weeks > 52) {
      return {
        valid: false,
        weeklyRate,
        weeks,
        error: 'Maximum timeline is 52 weeks (1 year)',
      };
    }

    // Validate weight direction matches goal
    if (data.goalType === 'lose_weight' && weightDiff >= 0) {
      return {
        valid: false,
        weeklyRate,
        weeks,
        error: 'Goal weight must be lower than current weight for weight loss',
      };
    }

    if (data.goalType === 'gain_weight' && weightDiff <= 0) {
      return {
        valid: false,
        weeklyRate,
        weeks,
        error: 'Goal weight must be higher than current weight for weight gain',
      };
    }

    // Safety limits
    const MAX_LOSS_RATE = -2.0; // lbs/week (negative for loss)
    const MAX_GAIN_RATE = 1.0; // lbs/week (positive for gain)

    // Check weight loss rate
    if (data.goalType === 'lose_weight' && weeklyRate < MAX_LOSS_RATE) {
      const recommendedWeeks = Math.ceil(Math.abs(weightDiff) / 2.0);
      const recommendedDate = new Date(today);
      recommendedDate.setDate(recommendedDate.getDate() + recommendedWeeks * 7);

      return {
        valid: false,
        weeklyRate,
        weeks,
        error: 'Too fast! Maximum safe rate is 2 lbs/week',
        recommendedWeeks,
        recommendedDate,
      };
    }

    // Check weight gain rate
    if (data.goalType === 'gain_weight' && weeklyRate > MAX_GAIN_RATE) {
      const recommendedWeeks = Math.ceil(Math.abs(weightDiff) / 1.0);
      const recommendedDate = new Date(today);
      recommendedDate.setDate(recommendedDate.getDate() + recommendedWeeks * 7);

      return {
        valid: false,
        weeklyRate,
        weeks,
        error: 'Too fast! Maximum safe rate is 1 lb/week',
        recommendedWeeks,
        recommendedDate,
      };
    }

    // Timeline is safe
    return {
      valid: true,
      weeklyRate,
      weeks,
    };
  };

  // Validate whenever date changes
  useEffect(() => {
    const result = validateTimeline(selectedDate);
    setValidation(result);
  }, [selectedDate, data.currentWeight, data.goalWeight, data.goalType]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleUseRecommended = () => {
    if (validation?.recommendedDate) {
      setSelectedDate(validation.recommendedDate);
    }
  };

  const handleContinue = () => {
    // Allow proceeding even with invalid timeline (user accepts the warning)
    if (!validation) return;

    // Store goal date and weekly rate
    setGoalDate(selectedDate, Math.abs(validation.weeklyRate));

    // Navigate to Personal Details screen
    navigation.navigate('PersonalDetails');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isDateSelected = (date: Date) => {
    return (
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Categorize pace based on weekly rate
  const getPaceCategory = (weeklyRate: number, goalType: string) => {
    const absRate = Math.abs(weeklyRate);

    if (goalType === 'lose_weight') {
      if (absRate <= 1.5) return { label: 'Healthy Pace', color: tokens.colors.semantic.success };
      if (absRate <= 2.0) return { label: 'Ambitious', color: tokens.colors.semantic.warning };
      return { label: 'Aggressive', color: tokens.colors.semantic.error };
    } else if (goalType === 'gain_weight') {
      if (absRate <= 0.5) return { label: 'Healthy Pace', color: tokens.colors.semantic.success };
      if (absRate <= 1.0) return { label: 'Ambitious', color: tokens.colors.semantic.warning };
      return { label: 'Aggressive', color: tokens.colors.semantic.error };
    }

    return { label: '', color: tokens.colors.text.secondary };
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(5/12) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            When do you want to{'\n'}reach your goal?
          </Text>
        </View>

        {/* Rate Indicator (shown after selection) */}
        {validation && validation.weeklyRate !== 0 && data.goalType && (
          <View style={styles.rateIndicatorContainer}>
            <View style={styles.rateIndicator}>
              <Text style={styles.rateValue}>
                {Math.abs(validation.weeklyRate).toFixed(1)} lbs/week
              </Text>
              <View
                style={[
                  styles.paceBadge,
                  { backgroundColor: getPaceCategory(validation.weeklyRate, data.goalType).color + '20' }
                ]}
              >
                <Text
                  style={[
                    styles.paceLabel,
                    { color: getPaceCategory(validation.weeklyRate, data.goalType).color }
                  ]}
                >
                  {getPaceCategory(validation.weeklyRate, data.goalType).label}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Date Selection */}
        <View style={styles.dateListContainer}>
          {dateOptions.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateOption,
                isDateSelected(date) && styles.dateOptionSelected,
              ]}
              onPress={() => handleDateSelect(date)}
            >
              <Text
                style={[
                  styles.dateOptionText,
                  isDateSelected(date) && styles.dateOptionTextSelected,
                ]}
              >
                {formatMonthYear(date)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Validation Feedback */}
        {validation && (
          <View style={styles.validationContainer}>
            {validation.valid ? (
              <View style={styles.validationSuccess}>
                <Text style={styles.validationSuccessIcon}>✓</Text>
                <Text style={styles.validationSuccessText}>
                  Safe rate: {Math.abs(validation.weeklyRate).toFixed(1)} lbs/week over {validation.weeks} weeks
                </Text>
              </View>
            ) : (
              <View style={styles.validationError}>
                <Text style={styles.validationErrorIcon}>⚠</Text>
                <View style={styles.validationErrorContent}>
                  <Text style={styles.validationErrorText}>{validation.error}</Text>
                  {validation.recommendedDate && (
                    <TouchableOpacity
                      style={styles.recommendedButton}
                      onPress={handleUseRecommended}
                    >
                      <Text style={styles.recommendedButtonText}>
                        Try {formatMonthYear(validation.recommendedDate)}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomContainer}>
        {!validation?.valid && validation?.error && (
          <Text style={styles.warningFooter}>
            ⚠️ Proceeding with this timeline may not be safe or sustainable
          </Text>
        )}
        <Button
          title={!validation?.valid && validation?.recommendedDate ? "Continue Anyway" : "Continue"}
          onPress={handleContinue}
          variant="primary"
          context="nutrition"
          size="large"
          fullWidth
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
    marginTop: tokens.spacing['2xl'],
    marginBottom: tokens.spacing['3xl'],
    alignItems: 'center',
  },
  promptText: {
    ...tokens.typography.display.l,
    color: tokens.colors.text.primary,
    textAlign: 'center' as const,
    lineHeight: 40,
  },
  rateIndicatorContainer: {
    marginBottom: tokens.spacing['3xl'],
    alignItems: 'center',
  },
  rateIndicator: {
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  rateValue: {
    ...tokens.typography.heading.h1,
    color: tokens.colors.text.primary,
    fontWeight: '600' as const,
  },
  paceBadge: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.pill,
  },
  paceLabel: {
    ...tokens.typography.button.m,
    fontWeight: '600' as const,
  },
  dateListContainer: {
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.xl,
  },
  dateOption: {
    paddingVertical: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.xl,
    borderRadius: tokens.borderRadius.rounded,
    backgroundColor: tokens.colors.background.offWhite,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateOptionSelected: {
    backgroundColor: tokens.colors.nutrition.blueLight,
    borderColor: 'transparent',
  },
  dateOptionText: {
    ...tokens.typography.button.l,
    color: tokens.colors.text.secondary,
    textAlign: 'center' as const,
  },
  dateOptionTextSelected: {
    color: tokens.colors.text.white,
    fontWeight: '700' as const,
  },
  validationContainer: {
    marginTop: tokens.spacing.lg,
  },
  validationSuccess: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.progress.emeraldLight,
    borderRadius: tokens.borderRadius.rounded,
    borderWidth: 1,
    borderColor: tokens.colors.semantic.success,
  },
  validationSuccessIcon: {
    fontSize: 24,
    color: tokens.colors.semantic.success,
  },
  validationSuccessText: {
    ...tokens.typography.body.m,
    color: tokens.colors.progress.emerald,
    flex: 1,
  },
  validationError: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start',
    gap: tokens.spacing.md,
    padding: tokens.spacing.lg,
    backgroundColor: '#FFEBEE',
    borderRadius: tokens.borderRadius.rounded,
    borderWidth: 1,
    borderColor: tokens.colors.semantic.error,
  },
  validationErrorIcon: {
    fontSize: 24,
    color: tokens.colors.semantic.error,
  },
  validationErrorContent: {
    flex: 1,
    gap: tokens.spacing.md,
  },
  validationErrorText: {
    ...tokens.typography.body.m,
    color: tokens.colors.workout.red,
  },
  recommendedButton: {
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    backgroundColor: tokens.colors.semantic.error,
    borderRadius: tokens.borderRadius.md,
    alignSelf: 'flex-start',
  },
  recommendedButtonText: {
    ...tokens.typography.button.s,
    color: tokens.colors.text.white,
  },
  bottomContainer: {
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xl,
    paddingTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.borders.light,
  },
  warningFooter: {
    ...tokens.typography.caption.m,
    color: tokens.colors.semantic.error,
    textAlign: 'center' as const,
    marginBottom: tokens.spacing.md,
    fontWeight: '600' as const,
  },
});
