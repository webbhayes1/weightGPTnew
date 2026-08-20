/**
 * Equipment Access Screen (Step 10/12)
 * Q1 Onboarding - Select workout equipment availability
 * Prompt: "What kind of workout setup do you have?"
 * Options:
 * - Home (bodyweight only)
 * - Home (dumbbells/resistance bands)
 * - Full gym access
 *
 * NOTE: This is the first workout-themed screen (uses navy/blue, not orange)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList, EquipmentType } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

type EquipmentAccessScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'EquipmentAccess'>;

interface EquipmentAccessScreenProps {
  navigation: EquipmentAccessScreenNavigationProp;
}

interface EquipmentOption {
  value: EquipmentType;
  label: string;
  description: string;
  icon: string;
}

const equipmentOptions: EquipmentOption[] = [
  {
    value: 'home_bodyweight',
    label: 'Home',
    description: 'Bodyweight only',
    icon: '🏠',
  },
  {
    value: 'home_equipment',
    label: 'Home gym',
    description: 'Dumbbells/resistance bands',
    icon: '🏋️',
  },
  {
    value: 'full_gym',
    label: 'Full gym access',
    description: 'Complete equipment range',
    icon: '💪',
  },
];

export default function EquipmentAccessScreen({ navigation }: EquipmentAccessScreenProps) {
  const { data, setEquipmentType } = useOnboardingStore();

  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>(
    data.equipmentType || null
  );

  const handleSelectEquipment = (equipment: EquipmentType) => {
    setSelectedEquipment(equipment);
  };

  const handleContinue = () => {
    if (!selectedEquipment) return;

    // Store equipment type
    setEquipmentType(selectedEquipment);

    // Navigate to Workout Schedule (Step 11) - LoadingBreak2 already completed
    navigation.navigate('WorkoutSchedule');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isValid = selectedEquipment !== null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(10/12) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            What kind of{'\n'}workout setup{'\n'}do you have?
          </Text>
        </View>

        {/* Equipment Options */}
        <View style={styles.optionsContainer}>
          {equipmentOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                selectedEquipment === option.value && styles.optionCardSelected,
              ]}
              onPress={() => handleSelectEquipment(option.value)}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <View style={styles.optionTextContainer}>
                  <Text
                    style={[
                      styles.optionLabel,
                      selectedEquipment === option.value && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      selectedEquipment === option.value && styles.optionDescriptionSelected,
                    ]}
                  >
                    {option.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomContainer}>
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
    backgroundColor: tokens.colors.workout.red,
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
  bottomContainer: {
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xl,
    paddingTop: tokens.spacing.md,
    backgroundColor: tokens.colors.background.white,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.borders.light,
  },
});
