/**
 * Goal Type Screen (Step 2/12)
 * Q1 Onboarding - Select main goal
 * Prompt: "What's your main goal right now?"
 * Options: Gain Weight / Lose Weight / Maintain Weight
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList, GoalType } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';

type GoalTypeScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'GoalType'>;

interface GoalTypeScreenProps {
  navigation: GoalTypeScreenNavigationProp;
}

export default function GoalTypeScreen({ navigation }: GoalTypeScreenProps) {
  const { setGoalType } = useOnboardingStore();
  // Start with no selection - user must choose on first visit
  const [selectedGoal, setSelectedGoal] = React.useState<GoalType | null>(null);

  const handleGoalSelection = (goalType: GoalType) => {
    setSelectedGoal(goalType);
    setGoalType(goalType);
    navigation.navigate('CurrentWeight');
  };

  const handleBack = () => {
    navigation.goBack();
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
            <View style={[styles.progressFill, { width: `${(2/12) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            What's your main{'\n'}goal right now?
          </Text>
        </View>

        {/* Goal Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedGoal === 'lose_weight' && styles.optionButtonSelected,
            ]}
            onPress={() => handleGoalSelection('lose_weight')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.optionText,
              selectedGoal === 'lose_weight' && styles.optionTextSelected,
            ]}>Lose Weight</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedGoal === 'maintain' && styles.optionButtonSelected,
            ]}
            onPress={() => handleGoalSelection('maintain')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.optionText,
              selectedGoal === 'maintain' && styles.optionTextSelected,
            ]}>Maintain Weight</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedGoal === 'gain_weight' && styles.optionButtonSelected,
            ]}
            onPress={() => handleGoalSelection('gain_weight')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.optionText,
              selectedGoal === 'gain_weight' && styles.optionTextSelected,
            ]}>Gain Weight</Text>
          </TouchableOpacity>
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
    marginBottom: tokens.spacing['2xl'],
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
  },
  optionButton: {
    paddingVertical: tokens.spacing['2xl'],
    paddingHorizontal: tokens.spacing.xl,
    borderRadius: tokens.borderRadius.rounded,
    backgroundColor: tokens.colors.background.frostedGlass,
    borderWidth: 2,
    borderColor: tokens.colors.nutrition.blue,
    alignItems: 'center',
    ...tokens.shadows.card,
  },
  optionButtonSelected: {
    borderColor: 'transparent',
    backgroundColor: tokens.colors.nutrition.blue,
  },
  optionText: {
    ...tokens.typography.heading.h2,
    color: tokens.colors.text.primary,
  },
  optionTextSelected: {
    color: tokens.colors.text.white,
    fontWeight: '700' as const,
  },
});
