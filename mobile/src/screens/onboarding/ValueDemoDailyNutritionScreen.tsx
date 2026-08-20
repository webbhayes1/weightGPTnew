/**
 * Value Demo Screen 2: Daily Nutrition Blueprint
 * Shows personalized calorie and macro targets with progress rings
 * Q1 Spec: Lines 462-482
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Circle } from 'react-native-svg';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

type ValueDemoDailyNutritionNavigationProp = StackNavigationProp<OnboardingStackParamList>;

interface ValueDemoDailyNutritionScreenProps {
  navigation: ValueDemoDailyNutritionNavigationProp;
  currentPage?: number; // For carousel mode
  totalPages?: number; // For carousel mode
  onNextPage?: () => void; // For carousel mode - advance to next page
}

export default function ValueDemoDailyNutritionScreen({
  navigation,
  currentPage = 1,
  totalPages = 3,
  onNextPage,
}: ValueDemoDailyNutritionScreenProps) {
  const { data } = useOnboardingStore();

  // Get calculated nutrition data
  const dailyCalories = data.dailyCalories || 2100;
  const macros = data.macros || { protein_g: 150, carbs_g: 220, fat_g: 65 };
  const activityLevel = data.activityLevel || 'moderately_active';
  const goalType = data.goalType || 'lose_weight';

  const handleContinue = () => {
    navigation.navigate('ValueDemoWorkouts');
  };

  const getActivityLabel = () => {
    switch (activityLevel) {
      case 'sedentary':
        return 'sedentary';
      case 'moderately_active':
        return 'moderate activity';
      case 'very_active':
        return 'very active';
      default:
        return 'moderate activity';
    }
  };

  const getGoalLabel = () => {
    switch (goalType) {
      case 'lose_weight':
        return 'weight loss';
      case 'gain_weight':
        return 'muscle gain';
      case 'maintain':
        return 'weight maintenance';
      default:
        return 'your';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Content Area - Not Scrollable */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Your Personalized{'\n'}Daily Targets
          </Text>
        </View>

        {/* Apple Fitness-Style Rings - Concentric Arcs */}
        <View style={styles.ringsContainer}>
          {/* Concentric Rings - Centered - Using SVG for partial arcs */}
          <View style={styles.ringsCenter}>
            <Svg width="240" height="240" viewBox="0 0 240 240">
              {/* Background circles (gray, full circles) */}
              <Circle
                cx="120"
                cy="120"
                r="114"
                stroke="#E5E5E7"
                strokeWidth="12"
                fill="none"
              />
              <Circle
                cx="120"
                cy="120"
                r="90"
                stroke="#E5E5E7"
                strokeWidth="12"
                fill="none"
              />
              <Circle
                cx="120"
                cy="120"
                r="66"
                stroke="#E5E5E7"
                strokeWidth="12"
                fill="none"
              />
              <Circle
                cx="120"
                cy="120"
                r="42"
                stroke="#E5E5E7"
                strokeWidth="12"
                fill="none"
              />

              {/* Colored arcs (partial circles) - rotated to start at top */}
              {/* Outer Ring - Calories (Primary Blue) - 85% */}
              <Circle
                cx="120"
                cy="120"
                r="114"
                stroke="#2A7FFE"
                strokeWidth="12"
                fill="none"
                strokeDasharray="716"
                strokeDashoffset="108"
                strokeLinecap="round"
                transform="rotate(-90 120 120)"
              />

              {/* Middle Ring - Protein (Bright Cyan-Blue) - 75% */}
              <Circle
                cx="120"
                cy="120"
                r="90"
                stroke="#35BEF0"
                strokeWidth="12"
                fill="none"
                strokeDasharray="565"
                strokeDashoffset="141"
                strokeLinecap="round"
                transform="rotate(-90 120 120)"
              />

              {/* Inner Ring - Carbs (Soft Sky Blue) - 80% */}
              <Circle
                cx="120"
                cy="120"
                r="66"
                stroke="#7DD3FF"
                strokeWidth="12"
                fill="none"
                strokeDasharray="415"
                strokeDashoffset="83"
                strokeLinecap="round"
                transform="rotate(-90 120 120)"
              />

              {/* Innermost Ring - Fat (Muted Slate Blue) - 70% */}
              <Circle
                cx="120"
                cy="120"
                r="42"
                stroke="#5A7FAF"
                strokeWidth="12"
                fill="none"
                strokeDasharray="264"
                strokeDashoffset="79"
                strokeLinecap="round"
                transform="rotate(-90 120 120)"
              />
            </Svg>
          </View>

          {/* Calories - Large number below rings */}
          <View style={styles.caloriesSection}>
            <Text style={styles.calorieNumber}>{dailyCalories}</Text>
            <Text style={styles.calorieLabel}>Daily Calories</Text>
          </View>

          {/* Macros - Row of three below calories */}
          <View style={styles.macrosRow}>
            <View style={styles.macroItem}>
              <View style={[styles.macroIndicator, { backgroundColor: '#35BEF0' }]} />
              <Text style={styles.macroValue}>{macros.protein_g}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroIndicator, { backgroundColor: '#7DD3FF' }]} />
              <Text style={styles.macroValue}>{macros.carbs_g}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroIndicator, { backgroundColor: '#5A7FAF' }]} />
              <Text style={styles.macroValue}>{macros.fat_g}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Calculated specifically for your {getGoalLabel()} goal and {getActivityLabel()} lifestyle
          </Text>
        </View>
      </View>

      {/* Fixed Bottom Section - Button + Progress Indicator */}
      <View style={styles.fixedBottomSection}>
        {/* CTA Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={currentPage === totalPages - 1 ? "See Your Full Plan" : "Continue"}
            onPress={currentPage < totalPages - 1 && onNextPage ? onNextPage : handleContinue}
            variant="primary"
            context="nutrition"
            size="large"
            fullWidth
          />
        </View>

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
  content: {
    flex: 1,
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.lg,
  },
  fixedBottomSection: {
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    backgroundColor: tokens.colors.background.white,
  },
  header: {
    marginBottom: tokens.spacing.xl,
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
  // Apple Fitness-Style Rings Container
  ringsContainer: {
    alignItems: 'center',
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.lg,
  },
  // Rings Center - SVG Container
  ringsCenter: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.lg,
  },
  // Calories Section Below Rings
  caloriesSection: {
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  calorieNumber: {
    fontSize: 56,
    fontWeight: '700' as const,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  calorieLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: tokens.colors.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  // Macros Row - Three columns below calories
  macrosRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: tokens.spacing.xl,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: tokens.spacing.sm,
  },
  macroValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: tokens.colors.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  descriptionContainer: {
    backgroundColor: tokens.colors.background.frostedGlass,
    borderRadius: tokens.borderRadius.rounded,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  description: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
    textAlign: 'center' as const,
    lineHeight: 18,
  },
  buttonContainer: {
    marginBottom: tokens.spacing.lg,
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
    backgroundColor: tokens.colors.nutrition.blue,
    width: 24,
  },
});
