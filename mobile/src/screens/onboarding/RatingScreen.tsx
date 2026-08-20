/**
 * Rating Screen (Post-Account Setup)
 * Prompts user to rate the app on the App Store
 * Flow: AccountSetup → Rating → NotificationPermissions (final)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

export default function RatingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  /**
   * Handle star rating selection
   */
  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
  };

  /**
   * Handle "Rate Now" button
   * If 4-5 stars: Open App Store (future implementation)
   * If 1-3 stars: Show feedback form (future implementation)
   * For now, just navigate to notifications
   */
  const handleRateNow = () => {
    if (!selectedRating) {
      Alert.alert('Please select a rating', 'Tap on the stars to rate your experience');
      return;
    }

    // TODO: Phase 3 - Implement actual app store rating
    // if (selectedRating >= 4) {
    //   // Open App Store rating
    //   Linking.openURL('itms-apps://itunes.apple.com/app/YOUR_APP_ID');
    // } else {
    //   // Show feedback form for lower ratings
    //   navigation.navigate('FeedbackForm');
    // }

    // For now, show thank you and navigate
    Alert.alert(
      'Thank you!',
      'Your feedback helps us improve.',
      [
        {
          text: 'Continue',
          onPress: () => navigation.navigate('PreferencesConsent'),
        },
      ]
    );
  };

  /**
   * Handle "Maybe Later" button
   * Skip rating and go to notifications
   */
  const handleMaybeLater = () => {
    navigation.navigate('PreferencesConsent');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>⭐</Text>
          <Text style={styles.title}>Enjoying the app?</Text>
          <Text style={styles.subtitle}>
            Your feedback helps us create a better experience for everyone
          </Text>
        </View>

        {/* Star Rating */}
        <View style={styles.ratingContainer}>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => handleRatingSelect(star)}
                style={({ pressed }) => [
                  styles.starButton,
                  pressed && styles.starButtonPressed,
                ]}
              >
                <Text style={[
                  styles.star,
                  selectedRating !== null && star <= selectedRating ? styles.starSelected : null,
                ]}>
                  {selectedRating !== null && star <= selectedRating ? '⭐' : '☆'}
                </Text>
              </Pressable>
            ))}
          </View>

          {selectedRating && (
            <Text style={styles.ratingLabel}>
              {selectedRating === 5 && 'Amazing!'}
              {selectedRating === 4 && 'Great!'}
              {selectedRating === 3 && 'Good'}
              {selectedRating === 2 && 'Okay'}
              {selectedRating === 1 && 'Needs improvement'}
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <Button
            title={selectedRating ? 'Submit Rating' : 'Rate Now'}
            onPress={handleRateNow}
            variant="primary"
            context="progress"
            size="large"
            fullWidth
          />

          <Pressable
            onPress={handleMaybeLater}
            style={({ pressed }) => [
              styles.laterButton,
              pressed && styles.laterButtonPressed,
            ]}
          >
            <Text style={styles.laterButtonText}>Maybe Later</Text>
          </Pressable>
        </View>

        {/* Privacy Note */}
        <Text style={styles.privacyNote}>
          Your rating is anonymous and helps us improve
        </Text>
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
    paddingTop: tokens.spacing['4xl'],
    paddingBottom: tokens.spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: tokens.spacing['4xl'],
  },
  emoji: {
    fontSize: 64,
    marginBottom: tokens.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '200',
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.md,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: tokens.spacing.lg,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: tokens.spacing['4xl'],
  },
  starsRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  starButton: {
    padding: tokens.spacing.xs,
  },
  starButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  star: {
    fontSize: 48,
    color: tokens.colors.borders.light,
  },
  starSelected: {
    color: '#FFB800', // Gold color for selected stars
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: tokens.colors.progress.emerald,
    marginTop: tokens.spacing.sm,
  },
  buttonsContainer: {
    gap: tokens.spacing.md,
  },
  laterButton: {
    paddingVertical: tokens.spacing.lg,
    alignItems: 'center',
  },
  laterButtonPressed: {
    opacity: 0.6,
  },
  laterButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
  },
  privacyNote: {
    fontSize: 13,
    color: tokens.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: tokens.spacing.lg,
  },
});
