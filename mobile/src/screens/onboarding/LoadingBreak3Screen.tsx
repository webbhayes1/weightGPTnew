/**
 * Loading Break 3 Screen (Final)
 * Q1 Onboarding - Generate personalized meal and workout plans
 * This screen:
 * 1. Phase 1: Create personalized plan (10 seconds with tips)
 * 2. Phase 2: Finalize plan (2 seconds)
 * 3. Shows success and completes onboarding
 *
 * TODO (Future): Integrate with OpenAI API for actual plan generation
 * TODO (Future): Implement multi-tier fallback system (Retry → Templates → Error)
 * TODO (Future): Navigate to main app Home screen instead of Welcome
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';
import Svg, { Circle } from 'react-native-svg';

type LoadingBreak3ScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'LoadingBreak3'>;

interface LoadingBreak3ScreenProps {
  navigation: LoadingBreak3ScreenNavigationProp;
}

// Motivational tips shown during loading
const LOADING_TIPS = [
  'Progressive overload is key to getting stronger',
  'Consistency beats intensity every time',
  'Small daily improvements lead to stunning results',
  'Your future self will thank you for starting today',
  'Track your progress to stay motivated',
];

type LoadingPhase = 'phase1' | 'phase2' | 'complete';

export default function LoadingBreak3Screen({ navigation }: LoadingBreak3ScreenProps) {
  const { data } = useOnboardingStore();

  const [phase, setPhase] = useState<LoadingPhase>('phase1');
  const [progress, setProgress] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Phase 1: Creating personalized plan (10 seconds)
    const phase1Duration = 10000;
    const phase1Start = Date.now();

    const phase1Interval = setInterval(() => {
      const elapsed = Date.now() - phase1Start;
      const newProgress = Math.min((elapsed / phase1Duration) * 50, 50); // 0-50%
      setProgress(newProgress);

      // Rotate tips every 3 seconds
      if (elapsed % 3000 < 100) {
        setCurrentTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
      }

      if (elapsed >= phase1Duration) {
        clearInterval(phase1Interval);
        setPhase('phase2');
      }
    }, 100);

    return () => clearInterval(phase1Interval);
  }, []);

  useEffect(() => {
    if (phase !== 'phase2') return;

    // Phase 2: Finalizing (2 seconds)
    const phase2Duration = 2000;
    const phase2Start = Date.now();

    const phase2Interval = setInterval(() => {
      const elapsed = Date.now() - phase2Start;
      const newProgress = 50 + Math.min((elapsed / phase2Duration) * 50, 50); // 50-100%
      setProgress(newProgress);

      if (elapsed >= phase2Duration) {
        clearInterval(phase2Interval);
        setProgress(100);
        setPhase('complete');

        // Show success modal after brief delay
        setTimeout(() => {
          setShowSuccess(true);
        }, 500);
      }
    }, 100);

    return () => clearInterval(phase2Interval);
  }, [phase]);

  const handleComplete = () => {
    // Navigate to Value Demo screens (Phase 2.5)
    setShowSuccess(false);
    navigation.navigate('ValueDemoSuccessPath');
  };

  // Get user's goal for personalized message
  const goalType = data.goalType || 'maintain';
  const goalText = goalType === 'lose_weight'
    ? 'weight loss'
    : goalType === 'gain_weight'
    ? 'muscle gain'
    : 'maintenance';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Circular Progress Ring */}
        <View style={styles.circularProgressContainer}>
          <Svg width={200} height={200} style={styles.svgContainer}>
            {/* Background Circle (static, full 360°) */}
            <Circle
              cx="100"
              cy="100"
              r="92"
              stroke={tokens.colors.borders.light}
              strokeWidth="8"
              fill="none"
            />

            {/* Progress Circle (animated stroke fills clockwise) */}
            <Circle
              cx="100"
              cy="100"
              r="92"
              stroke={tokens.colors.progress.emerald}
              strokeWidth="8"
              fill="none"
              strokeDasharray={2 * Math.PI * 92}
              strokeDashoffset={2 * Math.PI * 92 * (1 - progress / 100)}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
          </Svg>

          {/* Centered Percentage */}
          <View style={styles.percentageContainer}>
            <Text style={styles.percentageText}>{Math.round(progress)}%</Text>
          </View>
        </View>

        {/* Phase Message */}
        <Text style={styles.phaseMessage}>
          {phase === 'phase1' && 'Creating your personalized plan...'}
          {phase === 'phase2' && 'Finalizing your personalized plan...'}
          {phase === 'complete' && 'Your plan is ready!'}
        </Text>

        {/* Rotating Tips (only during loading phases) */}
        {phase !== 'complete' && (
          <View style={styles.tipContainer}>
            <Text style={styles.tipText}>{LOADING_TIPS[currentTipIndex]}</Text>
          </View>
        )}
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccess}
        transparent={true}
        animationType="fade"
        onRequestClose={handleComplete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Success Checkmark */}
            <View style={styles.successCheckmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>

            {/* Success Title */}
            <Text style={styles.successTitle}>Your Plan is Ready</Text>

            {/* Success Message */}
            <Text style={styles.successMessage}>
              Personalized {goalText} plan tailored to your goals and schedule
            </Text>

            {/* Plan Summary */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>
                    {data.dailyCalories ? Math.round(data.dailyCalories) : '—'}
                  </Text>
                  <Text style={styles.summaryLabel}>calories/day</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>
                    {data.workoutDaysPreferred?.length || 0}
                  </Text>
                  <Text style={styles.summaryLabel}>workout days</Text>
                </View>
              </View>
            </View>

            {/* CTA Button */}
            <Button
              title="Let's Go"
              onPress={handleComplete}
              context="progress"
              fullWidth
            />
          </View>
        </View>
      </Modal>
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
  circularProgressContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing['3xl'],
    position: 'relative' as const,
  },
  svgContainer: {
    position: 'absolute' as const,
  },
  percentageContainer: {
    position: 'absolute' as const,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 56,
    fontWeight: '200',
    color: tokens.colors.text.primary,
    textAlign: 'center',
    letterSpacing: -2,
  },
  phaseMessage: {
    fontSize: 18,
    fontWeight: '400',
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    marginBottom: tokens.spacing['4xl'],
  },
  tipContainer: {
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xl,
    minHeight: 60,
    justifyContent: 'center',
  },
  tipText: {
    fontSize: 15,
    color: tokens.colors.text.primary,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '400',
  },
  // Success Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: tokens.colors.background.white,
    borderRadius: 32,
    padding: tokens.spacing['3xl'],
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  successCheckmark: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: tokens.colors.progress.emerald,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing['2xl'],
  },
  checkmarkText: {
    fontSize: 40,
    color: tokens.colors.text.white,
    fontWeight: '600' as const,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '200',
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.md,
    textAlign: 'center',
    letterSpacing: -1,
  },
  successMessage: {
    fontSize: 15,
    fontWeight: '400',
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: tokens.spacing['2xl'],
  },
  summaryContainer: {
    width: '100%',
    marginBottom: tokens.spacing['2xl'],
  },
  summaryRow: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.xl,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 40,
    fontWeight: '200',
    color: tokens.colors.progress.emerald,
    letterSpacing: -1,
    marginBottom: tokens.spacing.xs,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: tokens.colors.text.secondary,
    textAlign: 'center' as const,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: tokens.colors.borders.light,
  },
});
