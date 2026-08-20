/**
 * Food Preferences Screen (Step 8/12)
 * Q1 Onboarding - Collect dietary preferences, foods to avoid, and favorite cuisines
 * Prompt: "Tell us about your food preferences"
 * Inputs:
 * - Dietary Preference (tap-to-select buttons)
 * - Foods to Avoid (pre-populated chips with + Add More)
 * - Favorite Cuisines (multi-select chips with Skip option)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList, DietaryPreference } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

type FoodPreferencesScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'FoodPreferences'>;

interface FoodPreferencesScreenProps {
  navigation: FoodPreferencesScreenNavigationProp;
}

interface DietaryOption {
  value: DietaryPreference;
  label: string;
}

const dietaryOptions: DietaryOption[] = [
  { value: 'none', label: 'None' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'pescatarian', label: 'Pescatarian' },
  { value: 'keto', label: 'Keto' },
  { value: 'custom', label: 'Custom' },
];

const commonFoods = [
  'Dairy', 'Gluten', 'Nuts', 'Shellfish', 'Eggs', 'Soy', 'Fish',
];

const extendedFoods = [
  'Peanuts', 'Tree Nuts', 'Sesame', 'Wheat', 'Milk', 'Cheese', 'Yogurt',
  'Shrimp', 'Crab', 'Lobster', 'Salmon', 'Tuna', 'Pork', 'Beef',
  'Chicken', 'Turkey', 'Tomatoes', 'Onions', 'Garlic', 'Mushrooms',
  'Bell Peppers', 'Spicy Foods', 'Citrus', 'Avocado', 'Beans', 'Lentils',
];

const cuisineOptions = [
  'Mediterranean', 'Asian', 'Mexican', 'American', 'Italian', 'Indian', 'Greek',
];

export default function FoodPreferencesScreen({ navigation }: FoodPreferencesScreenProps) {
  const { data, setFoodPreferences } = useOnboardingStore();

  const [selectedDietary, setSelectedDietary] = useState<DietaryPreference>(
    data.dietaryPreference || 'none'
  );
  const [selectedFoods, setSelectedFoods] = useState<string[]>(data.avoidFoods || []);
  const [showExtendedFoods, setShowExtendedFoods] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(data.preferredCuisines || []);

  const handleSelectDietary = (dietary: DietaryPreference) => {
    setSelectedDietary(dietary);
  };

  const handleToggleFood = (food: string) => {
    if (selectedFoods.includes(food)) {
      setSelectedFoods(selectedFoods.filter((f) => f !== food));
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  };

  const handleToggleCuisine = (cuisine: string) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter((c) => c !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  const handleSkipCuisines = () => {
    setSelectedCuisines([]);
  };

  const handleContinue = () => {
    // Store food preferences
    setFoodPreferences(selectedDietary, selectedFoods, selectedCuisines);

    // Navigate to Eating Pattern (Step 9) - Meal Prep Time & Meal Variety moved to Settings
    navigation.navigate('EatingPattern');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isValid = selectedDietary !== null;

  const allFoodsToDisplay = showExtendedFoods
    ? [...commonFoods, ...extendedFoods]
    : commonFoods;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(8/12) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            Tell us about{'\n'}your food preferences
          </Text>
        </View>

        {/* Dietary Preference Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Dietary Preference</Text>
          <View style={styles.dietaryOptionsContainer}>
            {dietaryOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dietaryButton,
                  selectedDietary === option.value && styles.dietaryButtonSelected,
                ]}
                onPress={() => handleSelectDietary(option.value)}
              >
                <Text
                  style={[
                    styles.dietaryButtonText,
                    selectedDietary === option.value && styles.dietaryButtonTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Foods to Avoid Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Foods to Avoid (Optional)</Text>
          <Text style={styles.sectionHelper}>Tap any foods you'd like to avoid</Text>
          <View style={styles.chipsContainer}>
            {allFoodsToDisplay.map((food) => (
              <TouchableOpacity
                key={food}
                style={[
                  styles.chip,
                  selectedFoods.includes(food) && styles.chipSelected,
                ]}
                onPress={() => handleToggleFood(food)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedFoods.includes(food) && styles.chipTextSelected,
                  ]}
                >
                  {food}
                </Text>
              </TouchableOpacity>
            ))}
            {!showExtendedFoods && (
              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={() => setShowExtendedFoods(true)}
              >
                <Text style={styles.addMoreButtonText}>+ Add More</Text>
              </TouchableOpacity>
            )}
          </View>
          {selectedFoods.length > 0 && (
            <Text style={styles.selectedCount}>
              {selectedFoods.length} food{selectedFoods.length !== 1 ? 's' : ''} selected
            </Text>
          )}
        </View>

        {/* Favorite Cuisines Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Favorite Cuisines (Optional)</Text>
            <TouchableOpacity onPress={handleSkipCuisines}>
              <Text style={styles.skipButton}>Skip Cuisines →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionHelper}>Select cuisines you enjoy</Text>
          <View style={styles.chipsContainer}>
            {cuisineOptions.map((cuisine) => (
              <TouchableOpacity
                key={cuisine}
                style={[
                  styles.chip,
                  selectedCuisines.includes(cuisine) && styles.chipSelected,
                ]}
                onPress={() => handleToggleCuisine(cuisine)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedCuisines.includes(cuisine) && styles.chipTextSelected,
                  ]}
                >
                  {cuisine}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing['3xl'],
  },
  promptContainer: {
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing['3xl'],
    alignItems: 'center',
  },
  promptText: {
    ...tokens.typography.display.l,
    color: tokens.colors.text.primary,
    textAlign: 'center' as const,
    lineHeight: 40,
  },
  section: {
    marginBottom: tokens.spacing['3xl'],
  },
  sectionLabel: {
    ...tokens.typography.heading.h2,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.sm,
  },
  sectionHelper: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  skipButton: {
    ...tokens.typography.body.s,
    color: tokens.colors.nutrition.blue,
    fontWeight: '600' as const,
  },
  dietaryOptionsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: tokens.spacing.md,
  },
  dietaryButton: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.borderRadius.pill,
    backgroundColor: tokens.colors.background.offWhite,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dietaryButtonSelected: {
    backgroundColor: tokens.colors.nutrition.blue,
    borderColor: tokens.colors.nutrition.blue,
  },
  dietaryButtonText: {
    ...tokens.typography.button.m,
    color: tokens.colors.text.secondary,
  },
  dietaryButtonTextSelected: {
    color: tokens.colors.text.white,
    fontWeight: '700' as const,
  },
  chipsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: tokens.spacing.sm,
  },
  chip: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.pill,
    backgroundColor: tokens.colors.background.offWhite,
    borderWidth: 1,
    borderColor: tokens.colors.borders.light,
  },
  chipSelected: {
    backgroundColor: tokens.colors.nutrition.blueLight,
    borderColor: tokens.colors.nutrition.blue,
  },
  chipText: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
  },
  chipTextSelected: {
    color: tokens.colors.workout.navy,
    fontWeight: '600' as const,
  },
  addMoreButton: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.pill,
    backgroundColor: tokens.colors.background.offWhite,
    borderWidth: 1,
    borderColor: tokens.colors.nutrition.blue,
  },
  addMoreButtonText: {
    ...tokens.typography.body.s,
    color: tokens.colors.nutrition.blue,
    fontWeight: '600' as const,
  },
  selectedCount: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
    marginTop: tokens.spacing.md,
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
