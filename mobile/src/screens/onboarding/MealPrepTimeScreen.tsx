/**
 * Meal Prep Time Screen (Step 9/17)
 * Q1 Onboarding - Select typical meal prep time with horizontal slider
 * Prompt: "How much time do you typically have for meal prep?"
 * Options: <15 min, 30 min, 60+ min (horizontal segmented control)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList, MealPrepTime } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

type MealPrepTimeScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'MealPrepTime'>;

interface MealPrepTimeScreenProps {
  navigation: MealPrepTimeScreenNavigationProp;
}

interface PrepTimeOption {
  value: MealPrepTime;
  label: string;
  description: string;
}

const prepTimeOptions: PrepTimeOption[] = [
  {
    value: 'minimal',
    label: '<15',
    description: 'minutes per meal',
  },
  {
    value: 'moderate',
    label: '30',
    description: 'minutes per meal',
  },
  {
    value: 'extended',
    label: '60+',
    description: 'minutes per meal',
  },
];

export default function MealPrepTimeScreen({ navigation }: MealPrepTimeScreenProps) {
  const { data, setMealPrepTime } = useOnboardingStore();

  const [selectedTime, setSelectedTime] = useState<MealPrepTime | null>(
    data.mealPrepTime || null
  );

  const handleSelectTime = (time: MealPrepTime) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (!selectedTime) return;

    // Store meal prep time
    setMealPrepTime(selectedTime);

    // Navigate to Meal Variety Preference (Step 10)
    navigation.navigate('MealVariety');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isValid = selectedTime !== null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(9/17) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            How much time{'\n'}do you have{'\n'}for meal prep?
          </Text>
        </View>

        {/* Horizontal Segmented Control */}
        <View style={styles.sliderContainer}>
          <View style={styles.segmentedControl}>
            {prepTimeOptions.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.segment,
                  index === 0 && styles.segmentFirst,
                  index === prepTimeOptions.length - 1 && styles.segmentLast,
                  selectedTime === option.value && styles.segmentSelected,
                ]}
                onPress={() => handleSelectTime(option.value)}
              >
                <Text
                  style={[
                    styles.segmentLabel,
                    selectedTime === option.value && styles.segmentLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description below slider */}
          {selectedTime && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>
                {prepTimeOptions.find(opt => opt.value === selectedTime)?.description}
              </Text>
            </View>
          )}
        </View>

        {/* Helper Text */}
        <View style={styles.helperContainer}>
          <Text style={styles.helperText}>
            We'll tailor recipes to fit your available time
          </Text>
        </View>
      </View>

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
  content: {
    flex: 1,
    paddingHorizontal: tokens.spacing.xl,
    justifyContent: 'center',
  },
  promptContainer: {
    marginBottom: tokens.spacing['4xl'],
    alignItems: 'center',
  },
  promptText: {
    ...tokens.typography.display.l,
    color: tokens.colors.text.primary,
    textAlign: 'center' as const,
    lineHeight: 40,
  },
  sliderContainer: {
    marginBottom: tokens.spacing['3xl'],
  },
  segmentedControl: {
    flexDirection: 'row' as const,
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: tokens.borderRadius.pill,
    padding: 4,
    ...tokens.shadows.card,
  },
  segment: {
    flex: 1,
    paddingVertical: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.borderRadius.pill,
    backgroundColor: 'transparent',
  },
  segmentFirst: {
    // No additional styles needed, handled by parent border radius
  },
  segmentLast: {
    // No additional styles needed, handled by parent border radius
  },
  segmentSelected: {
    backgroundColor: tokens.colors.nutrition.blue,
    ...tokens.shadows.button,
  },
  segmentLabel: {
    ...tokens.typography.heading.h2,
    color: tokens.colors.text.secondary,
    fontWeight: '600' as const,
  },
  segmentLabelSelected: {
    color: tokens.colors.text.white,
    fontWeight: '700' as const,
  },
  descriptionContainer: {
    marginTop: tokens.spacing.lg,
    alignItems: 'center',
  },
  descriptionText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    textAlign: 'center' as const,
  },
  helperContainer: {
    paddingHorizontal: tokens.spacing.lg,
  },
  helperText: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.tertiary,
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
