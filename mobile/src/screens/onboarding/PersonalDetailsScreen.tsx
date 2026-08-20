/**
 * Personal Details Screen (Step 6/12)
 * Q1 Onboarding - Enter height, age, and sex at birth
 * Prompt: "Tell us about yourself"
 * Inputs:
 * - Height: ft/in or cm toggle with pickers
 * - Age: Number picker (13-100)
 * - Sex at Birth: Male / Female buttons (required for accurate calorie calculations)
 * Disclaimers:
 * - Age 13-17: Parental consent checkbox
 * - Age 65+: Medical consultation recommendation
 */

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

type PersonalDetailsScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'PersonalDetails'>;

interface PersonalDetailsScreenProps {
  navigation: PersonalDetailsScreenNavigationProp;
}

export default function PersonalDetailsScreen({ navigation }: PersonalDetailsScreenProps) {
  const { data, setPersonalDetails } = useOnboardingStore();

  // Height state
  const [heightUnit, setHeightUnit] = useState<'inches' | 'cm'>(data.heightUnit || 'inches');
  const [feet, setFeet] = useState<number>(
    data.height && data.heightUnit === 'inches' ? Math.floor(data.height / 12) : 5
  );
  const [inches, setInches] = useState<number>(
    data.height && data.heightUnit === 'inches' ? data.height % 12 : 8
  );
  const [cm, setCm] = useState<number>(
    data.height && data.heightUnit === 'cm' ? data.height : 173
  );

  // Age state
  const [age, setAge] = useState<number>(data.age || 30);

  // Sex state
  const [sex, setSex] = useState<'male' | 'female' | null>(data.sex || null);

  // Parental consent for ages 13-17
  const [hasParentalConsent, setHasParentalConsent] = useState<boolean>(
    data.hasParentalConsent || false
  );

  // Height ranges
  const MIN_FEET = 4;
  const MAX_FEET = 7;
  const MIN_INCHES = 0;
  const MAX_INCHES = 11;
  const MIN_CM = 120;
  const MAX_CM = 230;

  // Age range
  const MIN_AGE = 13;
  const MAX_AGE = 100;

  // Refs for hold-down functionality
  const feetIncrementRef = useRef<NodeJS.Timeout | null>(null);
  const feetDecrementRef = useRef<NodeJS.Timeout | null>(null);
  const inchesIncrementRef = useRef<NodeJS.Timeout | null>(null);
  const inchesDecrementRef = useRef<NodeJS.Timeout | null>(null);
  const cmIncrementRef = useRef<NodeJS.Timeout | null>(null);
  const cmDecrementRef = useRef<NodeJS.Timeout | null>(null);
  const ageIncrementRef = useRef<NodeJS.Timeout | null>(null);
  const ageDecrementRef = useRef<NodeJS.Timeout | null>(null);

  const handleHeightUnitToggle = () => {
    const newUnit = heightUnit === 'inches' ? 'cm' : 'inches';

    if (newUnit === 'cm') {
      // Convert ft/in to cm
      const totalInches = feet * 12 + inches;
      const convertedCm = Math.round(totalInches * 2.54);
      setCm(convertedCm);
    } else {
      // Convert cm to ft/in
      const totalInches = Math.round(cm / 2.54);
      setFeet(Math.floor(totalInches / 12));
      setInches(totalInches % 12);
    }

    setHeightUnit(newUnit);
  };

  const handleFeetIncrement = () => {
    setFeet((prev) => (prev < MAX_FEET ? prev + 1 : prev));
  };

  const handleFeetDecrement = () => {
    setFeet((prev) => (prev > MIN_FEET ? prev - 1 : prev));
  };

  const handleInchesIncrement = () => {
    setInches((prev) => {
      if (prev < MAX_INCHES) return prev + 1;
      if (feet < MAX_FEET) {
        setFeet(feet + 1);
        return 0;
      }
      return prev;
    });
  };

  const handleInchesDecrement = () => {
    setInches((prev) => {
      if (prev > MIN_INCHES) return prev - 1;
      if (feet > MIN_FEET) {
        setFeet(feet - 1);
        return 11;
      }
      return prev;
    });
  };

  const handleCmIncrement = () => {
    setCm((prev) => (prev < MAX_CM ? prev + 1 : prev));
  };

  const handleCmDecrement = () => {
    setCm((prev) => (prev > MIN_CM ? prev - 1 : prev));
  };

  const handleAgeIncrement = () => {
    setAge((prev) => (prev < MAX_AGE ? prev + 1 : prev));
  };

  const handleAgeDecrement = () => {
    setAge((prev) => (prev > MIN_AGE ? prev - 1 : prev));
  };

  // Hold-down handlers
  const createPressInHandler = (handler: () => void, ref: React.MutableRefObject<NodeJS.Timeout | null>) => () => {
    handler(); // Immediate single increment/decrement
    // Wait 1 second before starting rapid increment/decrement
    const timeoutId = setTimeout(() => {
      ref.current = setInterval(handler, 50);
    }, 1000);
    (ref as any).timeoutId = timeoutId;
  };

  const createPressOutHandler = (ref: React.MutableRefObject<NodeJS.Timeout | null>) => () => {
    if ((ref as any).timeoutId) {
      clearTimeout((ref as any).timeoutId);
      (ref as any).timeoutId = null;
    }
    if (ref.current) {
      clearInterval(ref.current);
      ref.current = null;
    }
  };

  const handleFeetIncrementPressIn = createPressInHandler(handleFeetIncrement, feetIncrementRef);
  const handleFeetIncrementPressOut = createPressOutHandler(feetIncrementRef);
  const handleFeetDecrementPressIn = createPressInHandler(handleFeetDecrement, feetDecrementRef);
  const handleFeetDecrementPressOut = createPressOutHandler(feetDecrementRef);

  const handleInchesIncrementPressIn = createPressInHandler(handleInchesIncrement, inchesIncrementRef);
  const handleInchesIncrementPressOut = createPressOutHandler(inchesIncrementRef);
  const handleInchesDecrementPressIn = createPressInHandler(handleInchesDecrement, inchesDecrementRef);
  const handleInchesDecrementPressOut = createPressOutHandler(inchesDecrementRef);

  const handleCmIncrementPressIn = createPressInHandler(handleCmIncrement, cmIncrementRef);
  const handleCmIncrementPressOut = createPressOutHandler(cmIncrementRef);
  const handleCmDecrementPressIn = createPressInHandler(handleCmDecrement, cmDecrementRef);
  const handleCmDecrementPressOut = createPressOutHandler(cmDecrementRef);

  const handleAgeIncrementPressIn = createPressInHandler(handleAgeIncrement, ageIncrementRef);
  const handleAgeIncrementPressOut = createPressOutHandler(ageIncrementRef);
  const handleAgeDecrementPressIn = createPressInHandler(handleAgeDecrement, ageDecrementRef);
  const handleAgeDecrementPressOut = createPressOutHandler(ageDecrementRef);

  const handleContinue = () => {
    if (!isValid) return;

    // Convert height to inches for storage
    const heightInInches = heightUnit === 'cm'
      ? Math.round(cm / 2.54)
      : feet * 12 + inches;

    setPersonalDetails(
      heightInInches,
      'inches',
      age,
      sex!,
      age >= 13 && age <= 17 ? hasParentalConsent : undefined
    );

    // Navigate to Daily Activity Level screen
    navigation.navigate('DailyActivityLevel');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Validation
  const isHeightValid = heightUnit === 'inches'
    ? feet >= MIN_FEET && feet <= MAX_FEET && inches >= MIN_INCHES && inches <= MAX_INCHES
    : cm >= MIN_CM && cm <= MAX_CM;

  const isAgeValid = age >= MIN_AGE && age <= MAX_AGE;
  const isSexSelected = sex !== null;
  const needsParentalConsent = age >= 13 && age <= 17;
  const needsMedicalConsultation = age >= 65;

  const isValid = isHeightValid && isAgeValid && isSexSelected &&
    (!needsParentalConsent || hasParentalConsent);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(6/12) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>Tell us about yourself</Text>
        </View>

        {/* Height Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Height</Text>

          {/* Unit Toggle */}
          <View style={styles.unitToggleContainer}>
            <TouchableOpacity
              style={[styles.unitButton, heightUnit === 'inches' && styles.unitButtonActive]}
              onPress={() => heightUnit !== 'inches' && handleHeightUnitToggle()}
            >
              <Text style={[styles.unitText, heightUnit === 'inches' && styles.unitTextActive]}>
                ft / in
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitButton, heightUnit === 'cm' && styles.unitButtonActive]}
              onPress={() => heightUnit !== 'cm' && handleHeightUnitToggle()}
            >
              <Text style={[styles.unitText, heightUnit === 'cm' && styles.unitTextActive]}>
                cm
              </Text>
            </TouchableOpacity>
          </View>

          {/* Height Pickers */}
          {heightUnit === 'inches' ? (
            <View style={styles.heightPickersRow}>
              {/* Feet Picker */}
              <View style={styles.heightPickerGroup}>
                <TouchableOpacity
                  style={[styles.smallPickerButton, feet >= MAX_FEET && styles.pickerButtonDisabled]}
                  onPressIn={handleFeetIncrementPressIn}
                  onPressOut={handleFeetIncrementPressOut}
                  disabled={feet >= MAX_FEET}
                >
                  <Text style={[styles.pickerButtonText, feet >= MAX_FEET && styles.pickerButtonTextDisabled]}>
                    +
                  </Text>
                </TouchableOpacity>
                <View style={styles.heightDisplay}>
                  <Text style={styles.heightValue}>{feet}</Text>
                  <Text style={styles.heightLabel}>ft</Text>
                </View>
                <TouchableOpacity
                  style={[styles.smallPickerButton, feet <= MIN_FEET && styles.pickerButtonDisabled]}
                  onPressIn={handleFeetDecrementPressIn}
                  onPressOut={handleFeetDecrementPressOut}
                  disabled={feet <= MIN_FEET}
                >
                  <Text style={[styles.pickerButtonText, feet <= MIN_FEET && styles.pickerButtonTextDisabled]}>
                    −
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Inches Picker */}
              <View style={styles.heightPickerGroup}>
                <TouchableOpacity
                  style={[
                    styles.smallPickerButton,
                    (inches >= MAX_INCHES && feet >= MAX_FEET) && styles.pickerButtonDisabled
                  ]}
                  onPressIn={handleInchesIncrementPressIn}
                  onPressOut={handleInchesIncrementPressOut}
                  disabled={inches >= MAX_INCHES && feet >= MAX_FEET}
                >
                  <Text style={[
                    styles.pickerButtonText,
                    (inches >= MAX_INCHES && feet >= MAX_FEET) && styles.pickerButtonTextDisabled
                  ]}>
                    +
                  </Text>
                </TouchableOpacity>
                <View style={styles.heightDisplay}>
                  <Text style={styles.heightValue}>{inches}</Text>
                  <Text style={styles.heightLabel}>in</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.smallPickerButton,
                    (inches <= MIN_INCHES && feet <= MIN_FEET) && styles.pickerButtonDisabled
                  ]}
                  onPressIn={handleInchesDecrementPressIn}
                  onPressOut={handleInchesDecrementPressOut}
                  disabled={inches <= MIN_INCHES && feet <= MIN_FEET}
                >
                  <Text style={[
                    styles.pickerButtonText,
                    (inches <= MIN_INCHES && feet <= MIN_FEET) && styles.pickerButtonTextDisabled
                  ]}>
                    −
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={[styles.pickerButton, cm <= MIN_CM && styles.pickerButtonDisabled]}
                onPressIn={handleCmDecrementPressIn}
                onPressOut={handleCmDecrementPressOut}
                disabled={cm <= MIN_CM}
              >
                <Text style={[styles.pickerButtonText, cm <= MIN_CM && styles.pickerButtonTextDisabled]}>
                  −
                </Text>
              </TouchableOpacity>
              <View style={styles.valueDisplay}>
                <Text style={styles.value}>{cm}</Text>
                <Text style={styles.unit}>cm</Text>
              </View>
              <TouchableOpacity
                style={[styles.pickerButton, cm >= MAX_CM && styles.pickerButtonDisabled]}
                onPressIn={handleCmIncrementPressIn}
                onPressOut={handleCmIncrementPressOut}
                disabled={cm >= MAX_CM}
              >
                <Text style={[styles.pickerButtonText, cm >= MAX_CM && styles.pickerButtonTextDisabled]}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Age Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Age</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[styles.pickerButton, age <= MIN_AGE && styles.pickerButtonDisabled]}
              onPressIn={handleAgeDecrementPressIn}
              onPressOut={handleAgeDecrementPressOut}
              disabled={age <= MIN_AGE}
            >
              <Text style={[styles.pickerButtonText, age <= MIN_AGE && styles.pickerButtonTextDisabled]}>
                −
              </Text>
            </TouchableOpacity>
            <View style={styles.valueDisplay}>
              <Text style={styles.value}>{age}</Text>
              <Text style={styles.unit}>years</Text>
            </View>
            <TouchableOpacity
              style={[styles.pickerButton, age >= MAX_AGE && styles.pickerButtonDisabled]}
              onPressIn={handleAgeIncrementPressIn}
              onPressOut={handleAgeIncrementPressOut}
              disabled={age >= MAX_AGE}
            >
              <Text style={[styles.pickerButtonText, age >= MAX_AGE && styles.pickerButtonTextDisabled]}>
                +
              </Text>
            </TouchableOpacity>
          </View>

          {/* Age Disclaimers */}
          {needsParentalConsent && (
            <View style={styles.disclaimer}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setHasParentalConsent(!hasParentalConsent)}
              >
                <View style={[styles.checkbox, hasParentalConsent && styles.checkboxChecked]}>
                  {hasParentalConsent && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.disclaimerText}>
                  I have parental permission to use this app (required for ages 13-17)
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {needsMedicalConsultation && (
            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerText}>
                💡 We recommend consulting your doctor before starting any new fitness or nutrition program.
              </Text>
            </View>
          )}
        </View>

        {/* Sex Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Sex at Birth</Text>
          <Text style={styles.helperText}>Required for accurate calorie calculations</Text>
          <View style={styles.sexButtonsContainer}>
            <TouchableOpacity
              style={[styles.sexButton, sex === 'male' && styles.sexButtonSelected]}
              onPress={() => setSex('male')}
            >
              <Text style={[styles.sexButtonText, sex === 'male' && styles.sexButtonTextSelected]}>
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sexButton, sex === 'female' && styles.sexButtonSelected]}
              onPress={() => setSex('female')}
            >
              <Text style={[styles.sexButtonText, sex === 'female' && styles.sexButtonTextSelected]}>
                Female
              </Text>
            </TouchableOpacity>
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
    paddingBottom: tokens.spacing.xl,
  },
  promptContainer: {
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing['2xl'],
    alignItems: 'center',
  },
  promptText: {
    ...tokens.typography.display.m,
    color: tokens.colors.text.primary,
    textAlign: 'center' as const,
  },
  section: {
    marginBottom: tokens.spacing['3xl'],
  },
  sectionLabel: {
    ...tokens.typography.heading.h2,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.sm,
  },
  helperText: {
    ...tokens.typography.caption.l,
    color: tokens.colors.text.tertiary,
    marginBottom: tokens.spacing.md,
  },
  unitToggleContainer: {
    flexDirection: 'row' as const,
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  unitButton: {
    flex: 1,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.borderRadius.pill,
    backgroundColor: tokens.colors.background.offWhite,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: tokens.colors.nutrition.blue,
    borderColor: tokens.colors.nutrition.blue,
  },
  unitText: {
    ...tokens.typography.button.m,
    color: tokens.colors.text.secondary,
  },
  unitTextActive: {
    color: tokens.colors.text.white,
    fontWeight: '700' as const,
  },
  heightPickersRow: {
    flexDirection: 'row' as const,
    justifyContent: 'center',
    gap: tokens.spacing['2xl'],
  },
  heightPickerGroup: {
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  smallPickerButton: {
    width: 48,
    height: 48,
    borderRadius: tokens.borderRadius.circle,
    backgroundColor: tokens.colors.background.frostedGlass,
    borderWidth: 2,
    borderColor: tokens.colors.borders.light,
    justifyContent: 'center',
    alignItems: 'center',
    ...tokens.shadows.card,
  },
  pickerContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.xl,
  },
  pickerButton: {
    width: 56,
    height: 56,
    borderRadius: tokens.borderRadius.circle,
    backgroundColor: tokens.colors.background.frostedGlass,
    borderWidth: 2,
    borderColor: tokens.colors.borders.light,
    justifyContent: 'center',
    alignItems: 'center',
    ...tokens.shadows.card,
  },
  pickerButtonDisabled: {
    opacity: 0.3,
  },
  pickerButtonText: {
    fontSize: 28,
    color: tokens.colors.text.primary,
    fontWeight: '300' as const,
  },
  pickerButtonTextDisabled: {
    color: tokens.colors.text.tertiary,
  },
  heightDisplay: {
    alignItems: 'center',
    minWidth: 60,
  },
  heightValue: {
    ...tokens.typography.display.l,
    color: tokens.colors.text.primary,
  },
  heightLabel: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
  },
  valueDisplay: {
    alignItems: 'center',
    minWidth: 100,
  },
  value: {
    ...tokens.typography.display.l,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  unit: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
  },
  sexButtonsContainer: {
    flexDirection: 'row' as const,
    gap: tokens.spacing.md,
  },
  sexButton: {
    flex: 1,
    paddingVertical: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.rounded,
    backgroundColor: tokens.colors.background.offWhite,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  sexButtonSelected: {
    backgroundColor: tokens.colors.nutrition.blue,
    borderColor: tokens.colors.nutrition.blue,
  },
  sexButtonText: {
    ...tokens.typography.button.m,
    color: tokens.colors.text.secondary,
  },
  sexButtonTextSelected: {
    color: tokens.colors.text.white,
    fontWeight: '700' as const,
  },
  disclaimer: {
    marginTop: tokens.spacing.lg,
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: tokens.borderRadius.md,
  },
  checkboxRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start',
    gap: tokens.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: tokens.borderRadius.xs,
    borderWidth: 2,
    borderColor: tokens.colors.borders.divider,
    backgroundColor: tokens.colors.background.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: tokens.colors.nutrition.blue,
    borderColor: tokens.colors.nutrition.blue,
  },
  checkmark: {
    fontSize: 16,
    color: tokens.colors.text.white,
    fontWeight: '700' as const,
  },
  disclaimerText: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xl,
    paddingTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.borders.light,
  },
});
