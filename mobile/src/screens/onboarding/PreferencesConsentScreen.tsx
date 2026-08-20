/**
 * Preferences & Consent Screen (Step 16/16 - FINAL)
 * Q1 Onboarding - Set notification preferences and accept health disclaimer
 * Prompt: "Just a few more preferences"
 * Inputs:
 * - Notification preferences (4 toggles)
 * - Health disclaimer (required checkbox)
 *
 * NOTE: Step 17 (Data Storage) removed - account setup moved to AFTER paywall
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

type PreferencesConsentScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'PreferencesConsent'>;

interface PreferencesConsentScreenProps {
  navigation: PreferencesConsentScreenNavigationProp;
}

export default function PreferencesConsentScreen({ navigation }: PreferencesConsentScreenProps) {
  const { data, setNotificationPreferences, setDisclaimerAccepted } = useOnboardingStore();

  // Notification preferences (default all true per store initialData)
  const [notificationPrefs, setNotificationPrefs] = useState({
    dailyWeighIn: data.notificationPreferences?.dailyWeighIn ?? true,
    mealLogging: data.notificationPreferences?.mealLogging ?? true,
    workoutReminders: data.notificationPreferences?.workoutReminders ?? true,
    motivationalCheckins: data.notificationPreferences?.motivationalCheckins ?? true,
  });

  // Health disclaimer (required)
  const [disclaimerAccepted, setDisclaimerAcceptedLocal] = useState(data.disclaimerAccepted || false);

  const handleToggleNotification = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleToggleDisclaimer = () => {
    setDisclaimerAcceptedLocal(!disclaimerAccepted);
  };

  const handleContinue = () => {
    if (!disclaimerAccepted) return;

    // Store preferences
    setNotificationPreferences(notificationPrefs);
    setDisclaimerAccepted(disclaimerAccepted);

    // Final step - onboarding complete!
    // TODO: Navigate to Home screen once Phase 3 is implemented
    // For now, navigate to Welcome (will be replaced with Home)
    navigation.navigate('Welcome');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Can only continue if disclaimer is accepted
  const isValid = disclaimerAccepted;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(12/12) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>Step 12 of 12</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            Just a few more{'\n'}preferences
          </Text>
        </View>

        {/* Section: Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Text style={styles.helperText}>
            Choose which reminders you'd like to receive
          </Text>

          <View style={styles.toggleContainer}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleLabel}>Daily weigh-in reminders</Text>
                <Text style={styles.toggleDescription}>Morning reminder to log your weight</Text>
              </View>
              <Switch
                value={notificationPrefs.dailyWeighIn}
                onValueChange={() => handleToggleNotification('dailyWeighIn')}
                trackColor={{ false: tokens.colors.borders.light, true: tokens.colors.progress.emerald }}
                thumbColor={tokens.colors.background.white}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleLabel}>Meal logging reminders</Text>
                <Text style={styles.toggleDescription}>Reminders after typical meal times</Text>
              </View>
              <Switch
                value={notificationPrefs.mealLogging}
                onValueChange={() => handleToggleNotification('mealLogging')}
                trackColor={{ false: tokens.colors.borders.light, true: tokens.colors.progress.emerald }}
                thumbColor={tokens.colors.background.white}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleLabel}>Workout reminders</Text>
                <Text style={styles.toggleDescription}>Reminders on your selected workout days</Text>
              </View>
              <Switch
                value={notificationPrefs.workoutReminders}
                onValueChange={() => handleToggleNotification('workoutReminders')}
                trackColor={{ false: tokens.colors.borders.light, true: tokens.colors.progress.emerald }}
                thumbColor={tokens.colors.background.white}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleLabel}>Motivational check-ins</Text>
                <Text style={styles.toggleDescription}>Weekly progress updates and encouragement</Text>
              </View>
              <Switch
                value={notificationPrefs.motivationalCheckins}
                onValueChange={() => handleToggleNotification('motivationalCheckins')}
                trackColor={{ false: tokens.colors.borders.light, true: tokens.colors.progress.emerald }}
                thumbColor={tokens.colors.background.white}
              />
            </View>
          </View>
        </View>

        {/* Section: Health Disclaimer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Disclaimer</Text>

          <TouchableOpacity
            style={styles.disclaimerContainer}
            onPress={handleToggleDisclaimer}
            activeOpacity={0.7}
          >
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, disclaimerAccepted && styles.checkboxChecked]}>
                {disclaimerAccepted && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
            </View>
            <View style={styles.disclaimerTextContainer}>
              <Text style={styles.disclaimerText}>
                I understand this app provides general wellness information and is not medical advice
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.additionalInfoContainer}>
            <Text style={styles.additionalInfoText}>
              ⚠️ If you have any medical conditions, please consult your doctor before starting any new diet or exercise program
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!isValid}
          context="progress"
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
    backgroundColor: tokens.colors.progress.emerald,
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
  },
  section: {
    marginBottom: tokens.spacing['3xl'],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.sm,
  },
  helperText: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.lg,
    lineHeight: 20,
  },
  // Notification Toggles
  toggleContainer: {
    gap: tokens.spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.colors.background.offWhite,
    padding: tokens.spacing.lg,
    borderRadius: 12,
    minHeight: 70,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: tokens.spacing.md,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  toggleDescription: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
    lineHeight: 18,
  },
  // Health Disclaimer
  disclaimerContainer: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.background.offWhite,
    padding: tokens.spacing.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: tokens.colors.borders.light,
    marginBottom: tokens.spacing.md,
  },
  checkboxContainer: {
    marginRight: tokens.spacing.md,
    paddingTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: tokens.colors.borders.light,
    backgroundColor: tokens.colors.background.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: tokens.colors.progress.emerald,
    borderColor: tokens.colors.progress.emerald,
  },
  checkboxCheck: {
    color: tokens.colors.text.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimerTextContainer: {
    flex: 1,
  },
  disclaimerText: {
    fontSize: 14,
    color: tokens.colors.text.primary,
    lineHeight: 20,
  },
  additionalInfoContainer: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
  },
  additionalInfoText: {
    fontSize: 12,
    color: tokens.colors.text.secondary,
    lineHeight: 16,
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
