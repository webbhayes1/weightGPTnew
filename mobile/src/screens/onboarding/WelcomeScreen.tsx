/**
 * Welcome Screen (Step 1/12)
 * Q1 Onboarding - First screen
 * Prompt: "Let's build your perfect plan."
 * CTA: "Start"
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

type WelcomeScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Welcome'>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const handleStart = () => {
    navigation.navigate('GoalType');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* App Logo / Branding Area */}
        <View style={styles.brandingContainer}>
          <Text style={styles.appName}>WeightGPT</Text>
          <View style={styles.logoContainer}>
            <Text style={styles.logoLetter}>W</Text>
          </View>
        </View>

        {/* Main Prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            Let's build your{'\n'}perfect plan.
          </Text>
        </View>

        {/* Supporting Text */}
        <View style={styles.supportingTextContainer}>
          <Text style={styles.supportingText}>
            Personalized nutrition and workouts{'\n'}
            designed just for you.
          </Text>
        </View>

        {/* CTA Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Start"
            onPress={handleStart}
            variant="primary"
            context="lightBlue"
            size="large"
            fullWidth
          />
        </View>

        {/* Footer Text */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Takes about 2 minutes
          </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: tokens.spacing['4xl'],
  },
  appName: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.md,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: tokens.borderRadius.circle,
    backgroundColor: tokens.colors.workout.blue,
    justifyContent: 'center',
    alignItems: 'center',
    ...tokens.shadows.card,
  },
  logoLetter: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: tokens.colors.background.white,
    letterSpacing: -1,
  },
  promptContainer: {
    marginBottom: tokens.spacing.lg,
    alignItems: 'center',
  },
  promptText: {
    ...tokens.typography.display.l,
    color: tokens.colors.text.primary,
    textAlign: 'center' as const,
    lineHeight: 40,
  },
  supportingTextContainer: {
    marginBottom: tokens.spacing['4xl'],
    alignItems: 'center',
  },
  supportingText: {
    ...tokens.typography.body.l,
    color: tokens.colors.text.secondary,
    textAlign: 'center' as const,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: tokens.spacing.lg,
  },
  footerContainer: {
    alignItems: 'center',
  },
  footerText: {
    ...tokens.typography.caption.m,
    color: tokens.colors.text.tertiary,
  },
});
