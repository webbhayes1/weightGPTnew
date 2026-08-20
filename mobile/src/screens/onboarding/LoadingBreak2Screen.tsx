/**
 * Loading Break 2 Screen
 * Q1 Onboarding - Show workout plan recommendations
 * This screen:
 * 1. Shows loading animation (2 seconds)
 * 2. Displays workout recommendations based on goal
 * 3. Auto-navigates to Workout Schedule (Step 15)
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

type LoadingBreak2ScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'LoadingBreak2'>;

interface LoadingBreak2ScreenProps {
  navigation: LoadingBreak2ScreenNavigationProp;
}

// Workout recommendations by goal
const WORKOUT_RECOMMENDATIONS = {
  lose_weight: {
    daysPerWeek: 5,
    strength: 3,
    cardio: 2,
  },
  gain_weight: {
    daysPerWeek: 4,
    strength: 4,
    cardio: 0,
  },
  maintain: {
    daysPerWeek: 3,
    strength: 2,
    cardio: 1,
  },
};

export default function LoadingBreak2Screen({ navigation }: LoadingBreak2ScreenProps) {
  const { data } = useOnboardingStore();

  const [showResults, setShowResults] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const loadingProgress = useRef(new Animated.Value(0)).current;
  const resultsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate loading progress from 0 to 100% over 2 seconds
    Animated.timing(loadingProgress, {
      toValue: 100,
      duration: 2000,
      useNativeDriver: false, // Width animation requires layout driver
    }).start();

    // Update percentage display
    const intervalId = setInterval(() => {
      setProgressPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(intervalId);
          return 100;
        }
        return prev + 1;
      });
    }, 20); // Update every 20ms for smooth counting (100 updates in 2 seconds)

    // Show results after 2 seconds with fade-in
    const timer = setTimeout(() => {
      setShowResults(true);
      Animated.timing(resultsOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(intervalId);
    };
  }, []);

  const handleContinue = () => {
    // Navigate to Equipment Access (Step 10) - Ask equipment before schedule
    navigation.navigate('EquipmentAccess');
  };

  // Get recommendations based on goal
  const goalType = data.goalType || 'maintain';
  const recommendation = WORKOUT_RECOMMENDATIONS[goalType];

  // Format goal text
  const goalText = goalType === 'lose_weight'
    ? 'weight loss'
    : goalType === 'gain_weight'
    ? 'muscle gain'
    : 'maintenance';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {!showResults ? (
          // Loading Phase
          <>
            <Text style={styles.loadingText}>Designing your optimal workout plan...</Text>
            <View style={styles.progressBarContainer}>
              {/* Progress Bar */}
              <View style={styles.progressBarBackground}>
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      width: loadingProgress.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
              {/* Percentage below bar */}
              <Text style={styles.percentageText}>{progressPercentage}%</Text>
            </View>
          </>
        ) : (
          // Results Phase
          <>
            <Animated.View style={[styles.resultsContainer, { opacity: resultsOpacity }]}>
              {/* Success Checkmark */}
              <View style={styles.checkmarkContainer}>
                <Text style={styles.checkmark}>✓</Text>
              </View>

              {/* Title */}
              <Text style={styles.resultsTitle}>Workout Plan Optimized</Text>

              {/* Recommendation */}
              <View style={styles.recommendationContainer}>
                <Text style={styles.recommendationText}>
                  Based on your <Text style={styles.goalHighlight}>{goalText}</Text> goal, we recommend:
                </Text>

                <View style={styles.workoutSummary}>
                  <Text style={styles.summaryText}>{recommendation.daysPerWeek} workout days per week</Text>
                </View>

                <View style={styles.workoutBreakdown}>
                  {recommendation.strength > 0 && (
                    <Text style={styles.breakdownItem}>• {recommendation.strength} strength sessions</Text>
                  )}
                  {recommendation.cardio > 0 && (
                    <Text style={styles.breakdownItem}>• {recommendation.cardio} cardio sessions</Text>
                  )}
                </View>

                <Text style={styles.helperText}>
                  You'll select which specific days work best for you next
                </Text>
              </View>
            </Animated.View>

            {/* Continue Button */}
            <View style={styles.buttonContainer}>
              <Button
                title="Continue"
                onPress={handleContinue}
                context="progress"
                fullWidth
              />
            </View>
          </>
        )}
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xl,
  },
  // Loading Phase
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: tokens.colors.text.primary,
    textAlign: 'center',
    marginBottom: tokens.spacing['3xl'],
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
    gap: tokens.spacing.lg,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: tokens.colors.borders.light,
    borderRadius: tokens.borderRadius.pill,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: tokens.colors.progress.emerald,
    borderRadius: tokens.borderRadius.pill,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: tokens.colors.progress.emerald,
  },
  // Results Phase
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: tokens.colors.progress.emerald,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing['2xl'],
  },
  checkmark: {
    fontSize: 48,
    color: tokens.colors.text.white,
    fontWeight: 'bold',
  },
  resultsTitle: {
    fontSize: 32,
    fontWeight: '200',
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing['2xl'],
    textAlign: 'center',
    letterSpacing: -1,
  },
  recommendationContainer: {
    width: '100%',
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: 20,
    padding: tokens.spacing.xl,
    borderWidth: 2,
    borderColor: tokens.colors.progress.emerald,
  },
  recommendationText: {
    fontSize: 16,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    marginBottom: tokens.spacing.lg,
    lineHeight: 24,
  },
  goalHighlight: {
    color: tokens.colors.progress.emerald,
    fontWeight: '700',
  },
  workoutSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.lg,
  },
  summaryText: {
    fontSize: 20,
    fontWeight: '700',
    color: tokens.colors.progress.emerald,
  },
  workoutBreakdown: {
    marginBottom: tokens.spacing.lg,
    alignItems: 'center',
  },
  breakdownItem: {
    fontSize: 16,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
    lineHeight: 24,
    textAlign: 'center' as const,
  },
  helperText: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    paddingTop: tokens.spacing.xl,
    paddingBottom: tokens.spacing.md,
  },
});
