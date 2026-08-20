/**
 * Current Weight Screen (Step 3/12)
 * Q1 Onboarding - Enter current weight
 * Prompt: "What's your current weight?"
 * Input: Number picker with increment/decrement buttons (lbs/kg toggle)
 * Range: 80-400 lbs, 35-180 kg
 */

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

type CurrentWeightScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'CurrentWeight'>;

interface CurrentWeightScreenProps {
  navigation: CurrentWeightScreenNavigationProp;
}

export default function CurrentWeightScreen({ navigation }: CurrentWeightScreenProps) {
  const { data, setCurrentWeight } = useOnboardingStore();

  // Initialize with stored value or default
  const [unit, setUnit] = useState<'lbs' | 'kg'>(data.weightUnit || 'lbs');
  const [weight, setWeight] = useState<number>(
    data.currentWeight || (unit === 'lbs' ? 150 : 68)
  );

  // Weight ranges
  const MIN_LBS = 80;
  const MAX_LBS = 400;
  const MIN_KG = 35;
  const MAX_KG = 180;

  const min = unit === 'lbs' ? MIN_LBS : MIN_KG;
  const max = unit === 'lbs' ? MAX_LBS : MAX_KG;

  // Refs for hold-down functionality
  const incrementIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const decrementIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleIncrement = () => {
    setWeight((prev) => (prev < max ? prev + 1 : prev));
  };

  const handleDecrement = () => {
    setWeight((prev) => (prev > min ? prev - 1 : prev));
  };

  // Hold-down handlers for increment
  const handleIncrementPressIn = () => {
    handleIncrement(); // Immediate single increment
    // Wait 1 second before starting rapid increment
    const timeoutId = setTimeout(() => {
      incrementIntervalRef.current = setInterval(() => {
        handleIncrement();
      }, 50); // Repeat every 50ms after delay
    }, 1000);
    // Store timeout ID so we can clear it if user releases early
    (incrementIntervalRef as any).timeoutId = timeoutId;
  };

  const handleIncrementPressOut = () => {
    if ((incrementIntervalRef as any).timeoutId) {
      clearTimeout((incrementIntervalRef as any).timeoutId);
      (incrementIntervalRef as any).timeoutId = null;
    }
    if (incrementIntervalRef.current) {
      clearInterval(incrementIntervalRef.current);
      incrementIntervalRef.current = null;
    }
  };

  // Hold-down handlers for decrement
  const handleDecrementPressIn = () => {
    handleDecrement(); // Immediate single decrement
    // Wait 1 second before starting rapid decrement
    const timeoutId = setTimeout(() => {
      decrementIntervalRef.current = setInterval(() => {
        handleDecrement();
      }, 50); // Repeat every 50ms after delay
    }, 1000);
    // Store timeout ID so we can clear it if user releases early
    (decrementIntervalRef as any).timeoutId = timeoutId;
  };

  const handleDecrementPressOut = () => {
    if ((decrementIntervalRef as any).timeoutId) {
      clearTimeout((decrementIntervalRef as any).timeoutId);
      (decrementIntervalRef as any).timeoutId = null;
    }
    if (decrementIntervalRef.current) {
      clearInterval(decrementIntervalRef.current);
      decrementIntervalRef.current = null;
    }
  };

  const handleUnitToggle = () => {
    const newUnit = unit === 'lbs' ? 'kg' : 'lbs';
    // Convert weight
    const convertedWeight = unit === 'lbs'
      ? Math.round(weight * 0.453592) // lbs to kg
      : Math.round(weight * 2.20462); // kg to lbs
    setUnit(newUnit);
    setWeight(convertedWeight);
  };

  const handleContinue = () => {
    // Store weight in lbs (backend expects lbs)
    const weightInLbs = unit === 'kg' ? Math.round(weight * 2.20462) : weight;
    setCurrentWeight(weightInLbs, unit);

    // Navigate based on goal type
    // If maintain weight, skip Goal Weight and Goal Date screens
    if (data.goalType === 'maintain') {
      navigation.navigate('PersonalDetails');
    } else {
      navigation.navigate('GoalWeight');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isValid = weight >= min && weight <= max;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(3/12) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            What's your{'\n'}current weight?
          </Text>
        </View>

        {/* Unit Toggle */}
        <View style={styles.unitToggleContainer}>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'lbs' && styles.unitButtonActive]}
            onPress={() => unit !== 'lbs' && handleUnitToggle()}
          >
            <Text style={[styles.unitText, unit === 'lbs' && styles.unitTextActive]}>lbs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'kg' && styles.unitButtonActive]}
            onPress={() => unit !== 'kg' && handleUnitToggle()}
          >
            <Text style={[styles.unitText, unit === 'kg' && styles.unitTextActive]}>kg</Text>
          </TouchableOpacity>
        </View>

        {/* Weight Picker */}
        <View style={styles.pickerContainer}>
          <TouchableOpacity
            style={[styles.pickerButton, weight <= min && styles.pickerButtonDisabled]}
            onPressIn={handleDecrementPressIn}
            onPressOut={handleDecrementPressOut}
            disabled={weight <= min}
          >
            <Text style={[styles.pickerButtonText, weight <= min && styles.pickerButtonTextDisabled]}>
              −
            </Text>
          </TouchableOpacity>

          <View style={styles.weightDisplay}>
            <Text style={styles.weightValue}>{weight}</Text>
            <Text style={styles.weightUnit}>{unit}</Text>
          </View>

          <TouchableOpacity
            style={[styles.pickerButton, weight >= max && styles.pickerButtonDisabled]}
            onPressIn={handleIncrementPressIn}
            onPressOut={handleIncrementPressOut}
            disabled={weight >= max}
          >
            <Text style={[styles.pickerButtonText, weight >= max && styles.pickerButtonTextDisabled]}>
              +
            </Text>
          </TouchableOpacity>
        </View>

        {/* Range hint */}
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>
            Range: {min}-{max} {unit}
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
  progressText: {
    ...tokens.typography.caption.m,
    color: tokens.colors.text.tertiary,
    textAlign: 'center' as const,
  },
  content: {
    flex: 1,
    paddingHorizontal: tokens.spacing.xl,
    justifyContent: 'center',
  },
  promptContainer: {
    marginBottom: tokens.spacing['3xl'],
    alignItems: 'center',
  },
  promptText: {
    ...tokens.typography.display.l,
    color: tokens.colors.text.primary,
    textAlign: 'center' as const,
    lineHeight: 40,
  },
  unitToggleContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing['3xl'],
  },
  unitButton: {
    paddingHorizontal: tokens.spacing['2xl'],
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.borderRadius.pill,
    backgroundColor: tokens.colors.background.offWhite,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: tokens.colors.nutrition.blue,
    borderColor: tokens.colors.nutrition.blue,
  },
  unitText: {
    ...tokens.typography.button.m,
    color: tokens.colors.text.secondary,
  },
  unitTextActive: {
    color: tokens.colors.text.white,
    fontWeight: '700' as const,
  },
  pickerContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing['3xl'],
    marginBottom: tokens.spacing.lg,
  },
  pickerButton: {
    width: 64,
    height: 64,
    borderRadius: tokens.borderRadius.circle,
    backgroundColor: tokens.colors.background.frostedGlass,
    borderWidth: 2,
    borderColor: tokens.colors.borders.light,
    justifyContent: 'center',
    alignItems: 'center',
    ...tokens.shadows.card,
  },
  pickerButtonDisabled: {
    opacity: 0.3,
  },
  pickerButtonText: {
    fontSize: 32,
    color: tokens.colors.text.primary,
    fontWeight: '300' as const,
  },
  pickerButtonTextDisabled: {
    color: tokens.colors.text.tertiary,
  },
  weightDisplay: {
    alignItems: 'center',
    minWidth: 120,
  },
  weightValue: {
    ...tokens.typography.display.xl,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  weightUnit: {
    ...tokens.typography.body.l,
    color: tokens.colors.text.secondary,
  },
  hintContainer: {
    alignItems: 'center',
  },
  hintText: {
    ...tokens.typography.caption.l,
    color: tokens.colors.text.tertiary,
  },
  bottomContainer: {
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xl,
  },
});
