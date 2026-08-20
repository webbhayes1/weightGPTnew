/**
 * Workout Schedule Screen (Step 11/12)
 * Q1 Onboarding - Select workout days and session duration
 * Prompt: "Let's plan your workout schedule"
 * Inputs:
 * - Workout Days: Weekly calendar (Mon-Sun), tap to select multiple
 * - Session Duration: 20 / 30 / 45 / 60 minutes
 * Shows recommendation based on goal
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

type WorkoutScheduleScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'WorkoutSchedule'>;

interface WorkoutScheduleScreenProps {
  navigation: WorkoutScheduleScreenNavigationProp;
}

interface DayOption {
  index: number; // 0-6 (0=Sunday, 6=Saturday - standard JS convention)
  label: string;
  short: string;
}

const DAYS: DayOption[] = [
  { index: 0, label: 'Sunday', short: 'Sun' },
  { index: 1, label: 'Monday', short: 'Mon' },
  { index: 2, label: 'Tuesday', short: 'Tue' },
  { index: 3, label: 'Wednesday', short: 'Wed' },
  { index: 4, label: 'Thursday', short: 'Thu' },
  { index: 5, label: 'Friday', short: 'Fri' },
  { index: 6, label: 'Saturday', short: 'Sat' },
];

const DURATIONS = [20, 30, 45, 60] as const;

// Recommendations by goal (from Loading Break 2)
const RECOMMENDED_DAYS = {
  lose_weight: 5,
  gain_weight: 4,
  maintain: 3,
};

export default function WorkoutScheduleScreen({ navigation }: WorkoutScheduleScreenProps) {
  const { data, setWorkoutSchedule } = useOnboardingStore();

  const [selectedDays, setSelectedDays] = useState<number[]>(
    data.workoutDaysPreferred || []
  );
  const [selectedDuration, setSelectedDuration] = useState<20 | 30 | 45 | 60 | null>(
    data.sessionLength || null
  );

  const handleToggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      // Remove day
      setSelectedDays(selectedDays.filter(d => d !== dayIndex));
    } else {
      // Add day
      setSelectedDays([...selectedDays, dayIndex].sort());
    }
  };

  const handleSelectDuration = (duration: 20 | 30 | 45 | 60) => {
    setSelectedDuration(duration);
  };

  const handleContinue = () => {
    // Duration is still required, but days can be empty (will auto-default)
    if (!selectedDuration) return;

    // If no days selected, auto-default to recommended number of days starting from current day
    let finalDays: number[];
    if (selectedDays.length === 0) {
      // Get current day (standard JS: 0=Sunday, 6=Saturday)
      const currentDayIndex = new Date().getDay();

      // Generate recommended number of consecutive days starting from today
      finalDays = [];
      for (let i = 0; i < recommendedCount; i++) {
        finalDays.push((currentDayIndex + i) % 7);
      }
    } else {
      finalDays = selectedDays;
    }

    // Store workout schedule
    setWorkoutSchedule(finalDays, selectedDuration);

    // Navigate to Loading Break 3 (Plan Generation)
    navigation.navigate('LoadingBreak3');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Get recommendation
  const goalType = data.goalType || 'maintain';
  const recommendedCount = RECOMMENDED_DAYS[goalType];

  // Validate selection - only duration is required now
  const isValid = selectedDuration !== null;
  const showWarning = selectedDays.length > 0 && selectedDays.length < recommendedCount - 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(11/12) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            Let's plan your{'\n'}workout schedule
          </Text>
        </View>

        {/* Section: Workout Days */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Days (Optional)</Text>
          <Text style={styles.helperText}>
            We recommend <Text style={styles.highlightText}>{recommendedCount}</Text> workout days. Select the days that fit your schedule, or skip to use today as your starting day.
          </Text>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {DAYS.map((day) => (
              <TouchableOpacity
                key={day.index}
                style={[
                  styles.dayButton,
                  selectedDays.includes(day.index) && styles.dayButtonSelected,
                ]}
                onPress={() => handleToggleDay(day.index)}
              >
                <Text
                  style={[
                    styles.dayLabel,
                    selectedDays.includes(day.index) && styles.dayLabelSelected,
                  ]}
                >
                  {day.short}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Warning if too few days */}
          {showWarning && (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                ⚠️ Selecting fewer days may slow progress
              </Text>
            </View>
          )}

          {/* Selected count */}
          {selectedDays.length > 0 && (
            <Text style={styles.selectedCountText}>
              {selectedDays.length} {selectedDays.length === 1 ? 'day' : 'days'} selected
            </Text>
          )}
        </View>

        {/* Section: Session Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Duration</Text>

          <View style={styles.durationContainer}>
            {DURATIONS.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.durationButton,
                  selectedDuration === duration && styles.durationButtonSelected,
                ]}
                onPress={() => handleSelectDuration(duration)}
              >
                <Text
                  style={[
                    styles.durationLabel,
                    selectedDuration === duration && styles.durationLabelSelected,
                  ]}
                >
                  {duration} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomContainer}>
        <Text style={[styles.helperText, { textAlign: 'center' }]}>
          You can change these anytime in Settings
        </Text>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!isValid}
          context="workout"
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
    paddingTop: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    position: 'absolute',
    top: tokens.spacing.md,
    left: tokens.spacing.xl,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 28,
    color: tokens.colors.text.primary,
  },
  progressContainer: {
    marginTop: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: tokens.colors.borders.light,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: tokens.colors.workout.red,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: tokens.colors.text.secondary,
    marginTop: tokens.spacing.xs,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing['2xl'],
    paddingBottom: tokens.spacing['3xl'],
  },
  promptContainer: {
    marginBottom: tokens.spacing['3xl'],
    alignItems: 'center',
  },
  promptText: {
    fontSize: 32,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    lineHeight: 40,
    textAlign: 'center' as const,
  },
  section: {
    marginBottom: tokens.spacing['2xl'],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.md,
  },
  helperText: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.lg,
    lineHeight: 20,
  },
  highlightText: {
    color: tokens.colors.workout.navy,
    fontWeight: '700',
  },
  // Calendar Grid
  calendarGrid: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  dayButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  dayButtonSelected: {
    backgroundColor: tokens.colors.workout.red,
    borderColor: '#C82333', // Deeper red for outline
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: tokens.colors.text.primary,
  },
  dayLabelSelected: {
    color: tokens.colors.text.white,
    fontWeight: '700',
  },
  warningContainer: {
    backgroundColor: '#FFF4E5', // Light yellow/orange background
    borderRadius: 12,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
    borderWidth: 1,
    borderColor: '#FFB84D',
  },
  warningText: {
    fontSize: 14,
    color: tokens.colors.text.primary,
    textAlign: 'center',
  },
  selectedCountText: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
  },
  // Duration Selection
  durationContainer: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    flexWrap: 'wrap',
  },
  durationButton: {
    flex: 1,
    minWidth: 70,
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.sm,
    alignItems: 'center',
    minHeight: 44,
  },
  durationButtonSelected: {
    backgroundColor: tokens.colors.workout.red,
    borderColor: 'transparent',
  },
  durationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.colors.text.primary,
  },
  durationLabelSelected: {
    color: tokens.colors.text.white,
    fontWeight: '700' as const,
  },
  bottomContainer: {
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xl,
    paddingTop: tokens.spacing.md,
    backgroundColor: tokens.colors.background.white,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.borders.light,
  },
});
