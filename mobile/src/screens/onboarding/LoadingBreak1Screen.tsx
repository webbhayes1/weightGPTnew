/**
 * Loading Break 1 Screen
 * Q1 Onboarding - Calculate and display BMR, TDEE, and daily calorie target
 * This screen:
 * 1. Calculates BMR using Mifflin-St Jeor formula
 * 2. Calculates TDEE (BMR × activity multiplier)
 * 3. Applies calorie adjustment based on goal/weekly rate
 * 4. Calculates macro distribution
 * 5. Stores values and auto-navigates to next screen
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';

type LoadingBreak1ScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'LoadingBreak1'>;

interface LoadingBreak1ScreenProps {
  navigation: LoadingBreak1ScreenNavigationProp;
}

// Activity multipliers (matching backend)
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  moderately_active: 1.55,
  very_active: 1.725,
};

// Macro splits by goal (matching backend)
const MACRO_SPLITS = {
  lose_weight: { protein: 0.4, carbs: 0.4, fat: 0.2 },
  gain_weight: { protein: 0.35, carbs: 0.5, fat: 0.15 },
  maintain: { protein: 0.3, carbs: 0.45, fat: 0.25 },
};

export default function LoadingBreak1Screen({ navigation }: LoadingBreak1ScreenProps) {
  const { data, setCalculatedValues } = useOnboardingStore();

  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [calories, setCalories] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const hasNavigatedRef = useRef(false);
  const loadingOpacity = useRef(new Animated.Value(0)).current;
  const bmrOpacity = useRef(new Animated.Value(0)).current;
  const tdeeOpacity = useRef(new Animated.Value(0)).current;
  const caloriesOpacity = useRef(new Animated.Value(0)).current;

  // Navigate to next screen (can be triggered by tap or auto)
  const navigateToNext = () => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;

    // Clear all pending timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];

    navigation.navigate('FoodPreferences');
  };

  useEffect(() => {
    // Check if calculations already exist (user returning via back button)
    const hasExistingCalculations = data.bmr && data.tdee && data.dailyCalories;

    if (hasExistingCalculations) {
      // User is returning - show results immediately without animation
      setBmr(data.bmr);
      setTdee(data.tdee);
      setCalories(data.dailyCalories);
      setShowResults(true);

      // Set all opacities to 1 immediately
      bmrOpacity.setValue(1);
      tdeeOpacity.setValue(1);
      caloriesOpacity.setValue(1);

      return; // Skip calculations and animations
    }

    // Animate loading dots (only for first-time visitors)
    Animated.loop(
      Animated.sequence([
        Animated.timing(loadingOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(loadingOpacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Perform calculations
    const calculate = () => {
      try {
        // Validate required data
        if (!data.currentWeight || !data.height || !data.age || !data.sex || !data.activityLevel) {
          throw new Error('Missing required data for calculations');
        }

        // Step 1: Calculate BMR (Mifflin-St Jeor formula)
        const weightKg = data.currentWeight * 0.453592;
        const heightCm = data.height * 2.54;
        let calculatedBmr = 10 * weightKg + 6.25 * heightCm - 5 * data.age;

        // Adjust for sex (male: +5, female: -161)
        if (data.sex === 'male') {
          calculatedBmr += 5;
        } else if (data.sex === 'female') {
          calculatedBmr -= 161;
        }

        calculatedBmr = Math.round(calculatedBmr);

        // Step 2: Calculate TDEE
        const activityMultiplier = ACTIVITY_MULTIPLIERS[data.activityLevel];
        const calculatedTdee = Math.round(calculatedBmr * activityMultiplier);

        // Step 3: Calculate daily calories
        let calculatedCalories = calculatedTdee;

        if (data.goalType && data.goalType !== 'maintain' && data.weeklyRate) {
          // Apply calorie adjustment based on weekly rate
          // 1 lb = 3500 calories, daily adjustment = (weekly_rate * 3500) / 7
          const dailyAdjustment = (data.weeklyRate * 3500) / 7;

          // Apply adjustment in correct direction based on goal
          if (data.goalType === 'lose_weight') {
            // Weight loss: subtract to create calorie deficit
            calculatedCalories = Math.round(calculatedTdee - dailyAdjustment);
          } else if (data.goalType === 'gain_weight') {
            // Weight gain: add to create calorie surplus
            calculatedCalories = Math.round(calculatedTdee + dailyAdjustment);
          }
        }

        // Step 4: Calculate macros
        const goalType = data.goalType || 'maintain';
        const split = MACRO_SPLITS[goalType];

        const proteinCalories = calculatedCalories * split.protein;
        const carbsCalories = calculatedCalories * split.carbs;
        const fatCalories = calculatedCalories * split.fat;

        const macros = {
          protein_g: Math.round(proteinCalories / 4),
          carbs_g: Math.round(carbsCalories / 4),
          fat_g: Math.round(fatCalories / 9),
        };

        // Store calculated values
        setCalculatedValues(calculatedBmr, calculatedTdee, calculatedCalories, macros);

        // Show results with staggered fade-in animations
        timeoutsRef.current.push(setTimeout(() => {
          setBmr(calculatedBmr);
          Animated.timing(bmrOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, 800));

        timeoutsRef.current.push(setTimeout(() => {
          setTdee(calculatedTdee);
          Animated.timing(tdeeOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, 1600));

        timeoutsRef.current.push(setTimeout(() => {
          setCalories(calculatedCalories);
          setShowResults(true);
          Animated.timing(caloriesOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, 2400));

        // Auto-navigate after showing results for 3 seconds (total 5.4s from start)
        timeoutsRef.current.push(setTimeout(() => {
          navigateToNext();
        }, 5400));
      } catch (error) {
        console.error('Calculation error:', error);
        // Navigate anyway to not block the flow
        timeoutsRef.current.push(setTimeout(() => {
          navigateToNext();
        }, 2000));
      }
    };

    calculate();

    // Cleanup timeouts on unmount
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={navigateToNext}>
        <View style={styles.content}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Calculating your{'\n'}calorie targets</Text>
          </View>

          {/* Calculations Display */}
          <View style={styles.resultsContainer}>
            {/* BMR */}
            <Animated.View style={[styles.resultRow, bmr ? styles.resultRowVisible : null, { opacity: bmrOpacity }]}>
              <Text style={styles.resultLabel}>Basal Metabolic Rate</Text>
              <Text style={styles.resultValue}>
                {bmr ? `${bmr.toLocaleString()} cal/day` : '---'}
              </Text>
              {bmr ? <Text style={styles.resultHint}>Calories burned at rest</Text> : null}
            </Animated.View>

            {/* TDEE */}
            <Animated.View style={[styles.resultRow, tdee ? styles.resultRowVisible : null, { opacity: tdeeOpacity }]}>
              <Text style={styles.resultLabel}>Total Daily Energy</Text>
              <Text style={styles.resultValue}>
                {tdee ? `${tdee.toLocaleString()} cal/day` : '---'}
              </Text>
              {tdee ? <Text style={styles.resultHint}>With your activity level</Text> : null}
            </Animated.View>

            {/* Daily Target */}
            <Animated.View style={[styles.resultRow, styles.targetRow, calories ? styles.resultRowVisible : null, { opacity: caloriesOpacity }]}>
              <Text style={styles.targetLabel}>Your Daily Target</Text>
              <Text style={styles.targetValue}>
                {calories ? `${calories.toLocaleString()}` : '---'}
              </Text>
              <Text style={styles.targetUnit}>calories/day</Text>
              {calories && data.goalType && (
                <Text style={styles.targetHint}>
                  {data.goalType === 'lose_weight' && 'Optimized for weight loss'}
                  {data.goalType === 'gain_weight' && 'Optimized for muscle gain'}
                  {data.goalType === 'maintain' && 'Optimized for maintenance'}
                </Text>
              )}
            </Animated.View>
          </View>

          {/* Loading Dots */}
          {!showResults && (
            <View style={styles.loadingContainer}>
              <Animated.Text style={[styles.loadingText, { opacity: loadingOpacity }]}>
                ●●●
              </Animated.Text>
            </View>
          )}

          {showResults && (
            <View style={styles.checkmarkContainer}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.doneText}>Plan Ready!</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: tokens.spacing.xl,
    justifyContent: 'center',
    paddingTop: tokens.spacing['4xl'],
  },
  titleContainer: {
    marginBottom: tokens.spacing['4xl'],
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '200',
    color: tokens.colors.text.primary,
    textAlign: 'center' as const,
    lineHeight: 40,
    letterSpacing: -1,
  },
  resultsContainer: {
    gap: tokens.spacing['2xl'],
  },
  resultRow: {
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.rounded,
    backgroundColor: tokens.colors.background.offWhite,
    opacity: 0.3,
  },
  resultRowVisible: {
    opacity: 1,
    backgroundColor: tokens.colors.progress.emeraldLight,
  },
  resultLabel: {
    ...tokens.typography.caption.l,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.xs,
  },
  resultValue: {
    ...tokens.typography.display.m,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  resultHint: {
    ...tokens.typography.caption.m,
    color: tokens.colors.text.secondary,
  },
  targetRow: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl,
  },
  targetLabel: {
    ...tokens.typography.body.l,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.sm,
  },
  targetValue: {
    ...tokens.typography.display.xl,
    color: tokens.colors.text.primary,
    fontWeight: '700' as const,
  },
  targetUnit: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.md,
  },
  targetHint: {
    ...tokens.typography.caption.l,
    color: tokens.colors.text.secondary,
  },
  loadingContainer: {
    marginTop: tokens.spacing['4xl'],
    alignItems: 'center',
  },
  loadingText: {
    ...tokens.typography.display.m,
    color: tokens.colors.nutrition.blue,
    letterSpacing: 8,
  },
  checkmarkContainer: {
    marginTop: tokens.spacing['4xl'],
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  checkmark: {
    fontSize: 56,
    color: tokens.colors.semantic.success,
  },
  doneText: {
    ...tokens.typography.heading.h1,
    color: tokens.colors.semantic.success,
  },
});
