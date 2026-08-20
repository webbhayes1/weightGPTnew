/**
 * Value Demo Screen 3: Your Workout Schedule
 * Shows personalized workout plan with calendar view
 * CTA: "Unlock Your Plan" → Navigate to Paywall
 * Q1 Spec: Lines 486-510
 */

import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

type ValueDemoWorkoutsNavigationProp = StackNavigationProp<OnboardingStackParamList>;

interface ValueDemoWorkoutsScreenProps {
  navigation: ValueDemoWorkoutsNavigationProp;
  currentPage?: number; // For carousel mode
  totalPages?: number; // For carousel mode
  onNextPage?: () => void; // For carousel mode - advance to next page
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_INDEX_TO_SHORT: { [key: number]: string } = {
  0: 'Mon',
  1: 'Tue',
  2: 'Wed',
  3: 'Thu',
  4: 'Fri',
  5: 'Sat',
  6: 'Sun',
};

export default function ValueDemoWorkoutsScreen({
  navigation,
  currentPage = 2,
}: ValueDemoWorkoutsScreenProps) {
  const { data } = useOnboardingStore();

  const goalType = data.goalType || 'lose_weight';
  const sessionLength = data.sessionLength || 45;
  const selectedDayIndices = data.workoutDaysPreferred || [];

  // Pulsing animation for unlock button
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Generate sample workout schedule based on user's selected days and goal
  const sampleWorkouts = useMemo(() => {
    // Convert day indices to day names
    const selectedDays = selectedDayIndices.map((idx) => DAY_INDEX_TO_SHORT[idx]);

    // Define workout templates based on goal
    let workoutTemplates: Array<{ type: string; name: string; duration: number; icon: string }> = [];

    if (goalType === 'lose_weight') {
      workoutTemplates = [
        { type: 'strength', name: 'Upper Body', duration: sessionLength, icon: '🏋️' },
        { type: 'cardio', name: 'Cardio HIIT', duration: 30, icon: '🏃' },
        { type: 'strength', name: 'Lower Body', duration: sessionLength, icon: '🏋️' },
        { type: 'strength', name: 'Full Body', duration: sessionLength, icon: '🏋️' },
        { type: 'cardio', name: 'Cardio Steady', duration: 30, icon: '🏃' },
      ];
    } else if (goalType === 'gain_weight') {
      workoutTemplates = [
        { type: 'strength', name: 'Push Day', duration: sessionLength, icon: '🏋️' },
        { type: 'strength', name: 'Pull Day', duration: sessionLength, icon: '🏋️' },
        { type: 'strength', name: 'Leg Day', duration: sessionLength, icon: '🏋️' },
        { type: 'strength', name: 'Full Body', duration: sessionLength, icon: '🏋️' },
      ];
    } else {
      // Maintain
      workoutTemplates = [
        { type: 'strength', name: 'Upper Body', duration: sessionLength, icon: '🏋️' },
        { type: 'strength', name: 'Lower Body', duration: sessionLength, icon: '🏋️' },
        { type: 'cardio', name: 'Active Recovery', duration: 30, icon: '🏃' },
      ];
    }

    // Map templates to actual selected days
    return selectedDays.slice(0, workoutTemplates.length).map((day, index) => ({
      day,
      ...workoutTemplates[index],
    }));
  }, [goalType, sessionLength, selectedDayIndices]);

  const handleUnlock = () => {
    navigation.navigate('Paywall');
  };

  // Check if a day has a workout
  const getDayWorkout = (day: string) => {
    return sampleWorkouts.find((w) => w.day === day);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Scrollable Content Area */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Custom{'\n'}Workout Plan</Text>
        </View>

        {/* Weekly Calendar */}
        <View style={styles.calendarContainer}>
          <Text style={styles.sectionLabel}>Weekly Schedule:</Text>
          <View style={styles.calendar}>
            {DAYS_OF_WEEK.map((day) => {
              const workout = getDayWorkout(day);
              const isWorkoutDay = !!workout;
              const isRestDay = !isWorkoutDay;

              return (
                <View
                  key={day}
                  style={[
                    styles.dayCard,
                    isWorkoutDay && styles.dayCardActive,
                    isRestDay && styles.dayCardRest,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayLabel,
                      isWorkoutDay && styles.dayLabelActive,
                    ]}
                  >
                    {day}
                  </Text>
                  {isWorkoutDay && workout && (
                    <Text style={styles.dayWorkout}>{workout.icon}</Text>
                  )}
                  {isRestDay && <Text style={styles.restLabel}>Rest</Text>}
                </View>
              );
            })}
          </View>
        </View>

        {/* Workout Details */}
        <View style={styles.workoutsContainer}>
          {sampleWorkouts.map((workout, index) => (
            <View key={index} style={styles.workoutCard}>
              <View style={styles.workoutIcon}>
                <Text style={styles.workoutEmoji}>{workout.icon}</Text>
              </View>
              <View style={styles.workoutDetails}>
                <Text style={styles.workoutDay}>{workout.day}</Text>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutDuration}>
                  {workout.duration} min
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Rest Days */}
        <View style={styles.restDaysContainer}>
          <Text style={styles.restDaysLabel}>Rest Days:</Text>
          <Text style={styles.restDaysValue}>
            {DAYS_OF_WEEK.filter((day) => !getDayWorkout(day)).join(', ')}
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Section - Button + Progress Indicator */}
      <View style={styles.fixedBottomSection}>
        {/* CTA Button - Unlock with pulsing animation */}
        <Animated.View style={[styles.buttonContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Button
            title="Unlock Your Plan 🔒"
            onPress={handleUnlock}
            variant="primary"
            context="workout"
            size="large"
            fullWidth
          />
        </Animated.View>

        {/* Progress indicator */}
        <View style={styles.progressIndicator}>
          <View style={[styles.dot, currentPage === 0 && styles.dotActive]} />
          <View style={[styles.dot, currentPage === 1 && styles.dotActive]} />
          <View style={[styles.dot, currentPage === 2 && styles.dotActive]} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.xl,
    paddingBottom: tokens.spacing.md,
  },
  fixedBottomSection: {
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    backgroundColor: tokens.colors.background.white,
  },
  header: {
    marginBottom: tokens.spacing.lg,
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
  calendarContainer: {
    marginBottom: tokens.spacing.lg,
  },
  sectionLabel: {
    ...tokens.typography.heading.h3,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.md,
  },
  calendar: {
    flexDirection: 'row' as const,
    gap: tokens.spacing.xs,
    justifyContent: 'space-between',
  },
  dayCard: {
    flex: 1,
    height: 60,
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: tokens.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 40,
  },
  dayCardActive: {
    backgroundColor: tokens.colors.workout.red,
    borderColor: tokens.colors.workout.red,
  },
  dayCardRest: {
    backgroundColor: tokens.colors.background.offWhite,
    borderColor: tokens.colors.borders.light,
  },
  dayLabel: {
    ...tokens.typography.caption.s,
    color: tokens.colors.text.secondary,
    fontWeight: '600' as const,
    marginBottom: tokens.spacing.xs,
  },
  dayLabelActive: {
    color: tokens.colors.text.white,
    fontWeight: '700' as const,
  },
  dayWorkout: {
    fontSize: 20,
  },
  restLabel: {
    ...tokens.typography.caption.s,
    color: tokens.colors.text.tertiary,
  },
  workoutsContainer: {
    marginBottom: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
  workoutCard: {
    flexDirection: 'row' as const,
    backgroundColor: tokens.colors.background.frostedGlass,
    borderRadius: tokens.borderRadius.rounded,
    padding: tokens.spacing.lg,
    alignItems: 'center',
    ...tokens.shadows.card,
  },
  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: tokens.borderRadius.circle,
    backgroundColor: tokens.colors.workout.navy + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
  },
  workoutEmoji: {
    fontSize: 24,
  },
  workoutDetails: {
    flex: 1,
  },
  workoutDay: {
    ...tokens.typography.caption.m,
    color: tokens.colors.text.tertiary,
    marginBottom: tokens.spacing.xs,
  },
  workoutName: {
    ...tokens.typography.heading.h3,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  workoutDuration: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
  },
  restDaysContainer: {
    flexDirection: 'row' as const,
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: tokens.borderRadius.rounded,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
    alignItems: 'center',
  },
  restDaysLabel: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    fontWeight: '600' as const,
    marginRight: tokens.spacing.sm,
  },
  restDaysValue: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.primary,
  },
  buttonContainer: {
    marginBottom: tokens.spacing.lg,
  },
  swipeHintContainer: {
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
  },
  swipeHintText: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    fontWeight: '600' as const,
  },
  progressIndicator: {
    flexDirection: 'row' as const,
    justifyContent: 'center',
    gap: tokens.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: tokens.borderRadius.circle,
    backgroundColor: tokens.colors.borders.light,
  },
  dotActive: {
    backgroundColor: tokens.colors.workout.navy,
    width: 24,
  },
});
