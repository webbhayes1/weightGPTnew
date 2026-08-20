/**
 * Budget Preference Screen (Step 12/17)
 * Q1 Onboarding - Select budget preference (optional with skip)
 * Prompt: "Do you prefer budget-friendly ingredients?"
 * Options:
 * - Yes (prioritize affordable options)
 * - No (any ingredients)
 * - Skip (defaults to No)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

type BudgetPreferenceScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'BudgetPreference'>;

interface BudgetPreferenceScreenProps {
  navigation: BudgetPreferenceScreenNavigationProp;
}

interface BudgetOption {
  value: boolean;
  label: string;
  description: string;
  icon: string;
}

const budgetOptions: BudgetOption[] = [
  {
    value: true,
    label: 'Yes',
    description: 'Prioritize affordable options',
    icon: '💰',
  },
  {
    value: false,
    label: 'No',
    description: 'Any ingredients are fine',
    icon: '🛒',
  },
];

export default function BudgetPreferenceScreen({ navigation }: BudgetPreferenceScreenProps) {
  const { data, setBudgetPreference } = useOnboardingStore();

  const [selectedBudget, setSelectedBudget] = useState<boolean | null>(
    data.budgetConscious
  );

  const handleSelectBudget = (value: boolean) => {
    setSelectedBudget(value);
  };

  const handleContinue = () => {
    if (selectedBudget === null) return;

    // Store budget preference
    setBudgetPreference(selectedBudget);

    // Navigate to Grocery Shopping Day (Step 13)
    navigation.navigate('GroceryShoppingDay');
  };

  const handleSkip = () => {
    // Skip: set to null (defaults to No in backend)
    setBudgetPreference(null);

    // Navigate to Grocery Shopping Day (Step 13)
    navigation.navigate('GroceryShoppingDay');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isValid = selectedBudget !== null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip →</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(12/17) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            Do you prefer{'\n'}budget-friendly{'\n'}ingredients?
          </Text>
        </View>

        {/* Budget Options */}
        <View style={styles.optionsContainer}>
          {budgetOptions.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.optionCard,
                selectedBudget === option.value && styles.optionCardSelected,
              ]}
              onPress={() => handleSelectBudget(option.value)}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <View style={styles.optionTextContainer}>
                  <Text
                    style={[
                      styles.optionLabel,
                      selectedBudget === option.value && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      selectedBudget === option.value && styles.optionDescriptionSelected,
                    ]}
                  >
                    {option.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Helper Text */}
        <View style={styles.helperContainer}>
          <Text style={styles.helperText}>
            We'll prioritize affordable options if you select Yes
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!isValid}
          context="nutrition"
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
  skipButton: {
    height: 44,
    justifyContent: 'center',
    position: 'absolute',
    top: tokens.spacing.md,
    right: tokens.spacing.xl,
    zIndex: 10,
  },
  skipButtonText: {
    fontSize: 16,
    color: tokens.colors.nutrition.blue,
    fontWeight: '600',
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
    backgroundColor: tokens.colors.nutrition.blue,
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
  },
  promptText: {
    fontSize: 32,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    lineHeight: 40,
    textAlign: 'center' as const,
  },
  optionsContainer: {
    gap: tokens.spacing.lg,
    marginBottom: tokens.spacing['2xl'],
  },
  optionCard: {
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: tokens.spacing.lg,
    minHeight: 100,
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: 'transparent',
    backgroundColor: tokens.colors.nutrition.blue,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  optionIcon: {
    fontSize: 32,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  optionLabelSelected: {
    color: tokens.colors.text.white,
    fontWeight: '700' as const,
  },
  optionDescription: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    lineHeight: 20,
  },
  optionDescriptionSelected: {
    color: tokens.colors.text.white,
  },
  helperContainer: {
    paddingHorizontal: tokens.spacing.md,
    marginTop: tokens.spacing.lg,
  },
  helperText: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    lineHeight: 20,
    textAlign: 'center',
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
