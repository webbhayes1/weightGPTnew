/**
 * Account Setup Screen (Post-Paywall)
 * Step: After paywall conversion
 * Purpose: Allow users to create authenticated account or skip (device-only mode)
 *
 * Flow:
 * 1. User completes paywall → Subscribe
 * 2. AccountSetupScreen appears
 * 3. User chooses auth method:
 *    - Email/Password → EmailAuthScreen
 *    - Google Sign-In → linkAnonymousToGoogle()
 *    - Apple Sign-In → linkAnonymousToApple()
 *    - Skip → Device-only mode (navigate to Home)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from '../../services/auth/firebaseAuth';
import { syncOnboardingDataToBackend } from '../../services/auth/dataMigration';
import { useAuthStore } from '../../store/authStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

export default function AccountSetupScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle Email/Password auth
   * Navigate to EmailAuthScreen for user to sign in or sign up
   */
  const handleEmailAuth = () => {
    navigation.navigate('EmailAuth');
  };

  /**
   * Handle Google Sign-In
   * TODO: Implement in Phase 2 (requires @react-native-google-signin/google-signin)
   */
  const handleGoogleAuth = async () => {
    Alert.alert(
      'Coming Soon',
      'Google Sign-In will be available in the next update.',
      [{ text: 'OK' }]
    );

    // TODO: Implement Google Sign-In
    // try {
    //   setIsLoading(true);
    //   const { previousUid, newUid } = await linkAnonymousToGoogle();
    //   await migrateUserData(previousUid, newUid);
    //   await syncOnboardingDataToBackend(newUid, idToken);
    //   navigation.navigate('Home');
    // } catch (error) {
    //   Alert.alert('Error', 'Google sign-in failed. Please try again.');
    // } finally {
    //   setIsLoading(false);
    // }
  };

  /**
   * Handle Apple Sign-In
   * TODO: Implement in Phase 2 (requires @invertase/react-native-apple-authentication)
   */
  const handleAppleAuth = async () => {
    Alert.alert(
      'Coming Soon',
      'Apple Sign-In will be available in the next update.',
      [{ text: 'OK' }]
    );

    // TODO: Implement Apple Sign-In
    // try {
    //   setIsLoading(true);
    //   const { previousUid, newUid } = await linkAnonymousToApple();
    //   await migrateUserData(previousUid, newUid);
    //   await syncOnboardingDataToBackend(newUid, idToken);
    //   navigation.navigate('Home');
    // } catch (error) {
    //   Alert.alert('Error', 'Apple sign-in failed. Please try again.');
    // } finally {
    //   setIsLoading(false);
    // }
  };

  /**
   * Handle Skip (Device-Only Mode)
   * - User stays anonymous
   * - Data only stored locally
   * - Warn user about data loss risk
   */
  const handleSkip = () => {
    Alert.alert(
      'Continue without account?',
      'Your data will only be stored on this device. You won\'t be able to access it from other devices or if you lose this device.',
      [
        {
          text: 'Create Account',
          style: 'cancel',
        },
        {
          text: 'Continue Anyway',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);

              // Mark as device-only mode
              await AsyncStorage.setItem('device_only_mode', 'true');

              // Get current anonymous user
              const user = getCurrentUser();
              console.log('[AccountSetup] Skipping account creation');
              console.log('[AccountSetup] Anonymous UID:', user?.uid);
              console.log('[AccountSetup] Device-only mode enabled');

              // Authenticate the anonymous user for device-only mode
              // This allows them to access the main app
              if (user) {
                const idToken = await user.getIdToken();

                // Save onboarding data to AsyncStorage before syncing
                console.log('[AccountSetup] Saving onboarding data to storage...');
                await useOnboardingStore.getState().saveToStorage();

                // Sync onboarding data to backend (needed for meal generation)
                console.log('[AccountSetup] Syncing onboarding data to backend...');
                await syncOnboardingDataToBackend(user.uid, idToken);
                console.log('[AccountSetup] Onboarding data synced');

                await useAuthStore.getState().login(
                  {
                    id: user.uid,
                    email: '',
                    firebaseUid: user.uid,
                    createdAt: user.metadata.creationTime || new Date().toISOString(),
                  },
                  idToken
                );
                console.log('[AccountSetup] Anonymous user authenticated for device-only mode');
              }

              // Navigate to Rating screen
              navigation.navigate('Rating');
            } catch (error) {
              console.error('[AccountSetup] Skip failed:', error);
              Alert.alert('Error', 'Failed to complete setup. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>
            Secure your data and access from any device
          </Text>
        </View>

        {/* Auth Method Options */}
        <View style={styles.authOptions}>
          {/* Email/Password */}
          <Pressable
            style={({ pressed }) => [
              styles.authButton,
              styles.emailButton,
              pressed && styles.authButtonPressed,
            ]}
            onPress={handleEmailAuth}
            disabled={isLoading}
          >
            <Text style={styles.authButtonIcon}>@</Text>
            <Text style={styles.authButtonText}>Continue with Email</Text>
          </Pressable>

          {/* Google Sign-In */}
          <Pressable
            style={({ pressed }) => [
              styles.authButton,
              styles.googleButton,
              pressed && styles.authButtonPressed,
            ]}
            onPress={handleGoogleAuth}
            disabled={isLoading}
          >
            <Text style={styles.authButtonIcon}>G</Text>
            <Text style={styles.authButtonText}>Continue with Google</Text>
          </Pressable>

          {/* Apple Sign-In */}
          <Pressable
            style={({ pressed }) => [
              styles.authButton,
              styles.appleButton,
              pressed && styles.authButtonPressed,
            ]}
            onPress={handleAppleAuth}
            disabled={isLoading}
          >
            <Ionicons name="logo-apple" size={24} color="#FFFFFF" style={{ marginRight: 12 }} />
            <Text style={styles.authButtonText}>Continue with Apple</Text>
          </Pressable>
        </View>

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#14B8A6" />
            <Text style={styles.loadingText}>Setting up your account...</Text>
          </View>
        )}

        {/* Skip Option */}
        {!isLoading && (
          <View style={styles.skipSection}>
            <Pressable
              onPress={handleSkip}
              style={({ pressed }) => [
                styles.skipButton,
                pressed && styles.skipButtonPressed,
              ]}
            >
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </Pressable>

            <Text style={styles.skipWarning}>
              Without an account, your data is only stored on this device
            </Text>
          </View>
        )}

        {/* Terms & Privacy */}
        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light background
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '200',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  authOptions: {
    gap: 16,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  authButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  emailButton: {
    backgroundColor: '#4C9EEB',
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  authButtonIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 12,
  },
  authButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  skipSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonPressed: {
    opacity: 0.6,
  },
  skipButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#6B7280',
  },
  skipWarning: {
    marginTop: 8,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  termsText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
    paddingBottom: 24,
  },
  termsLink: {
    color: '#14B8A6',
    fontWeight: '600',
  },
});
