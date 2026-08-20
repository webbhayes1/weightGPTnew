/**
 * Email Authentication Screen
 * Purpose: Handle email/password sign-in and sign-up
 *
 * Features:
 * - Toggle between Sign In and Sign Up modes
 * - Email and password validation
 * - Link anonymous account to email credential
 * - Migrate data after account linking
 * - Navigate to Home after success
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import {
  linkAnonymousToEmail,
  signInWithEmail,
  getCurrentUser,
  getAuthErrorMessage,
} from '../../services/auth/firebaseAuth';
import { migrateUserData, syncOnboardingDataToBackend } from '../../services/auth/dataMigration';
import { useAuthStore } from '../../store/authStore';
import { useOnboardingStore } from '../../store/onboardingStore';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

type AuthMode = 'signin' | 'signup';

export default function EmailAuthScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Mode toggle
  const [mode, setMode] = useState<AuthMode>('signup'); // Default to sign up

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

  /**
   * Validate email format
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate password strength
   */
  const validatePassword = (password: string): boolean => {
    // Min 8 characters, at least 1 uppercase, 1 lowercase, 1 number
    return password.length >= 8;
  };

  /**
   * Validate form before submission
   */
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation (sign up only)
    if (mode === 'signup') {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signin') {
        // Direct sign-in for existing users
        console.log('[EmailAuth] Signing in with email:', email);

        const { user } = await signInWithEmail(email, password);

        console.log('[EmailAuth] Sign-in successful');
        console.log('[EmailAuth] User UID:', user.uid);

        // Get Firebase ID token for backend authentication
        const idToken = await user.getIdToken();

        // Store in auth store
        useAuthStore.getState().login(
          {
            id: user.uid, // Will be replaced by backend user ID
            email: user.email || email,
            firebaseUid: user.uid,
            createdAt: new Date().toISOString(),
          },
          idToken
        );

        console.log('[EmailAuth] Sign-in complete!');

        // Navigate to main app (Home)
        // The RootNavigator should handle this based on isAuthenticated state
        Alert.alert(
          'Welcome Back!',
          'You have been signed in successfully.',
          [
            {
              text: 'Continue',
              onPress: () => {
                // Navigation will be handled by auth state change
              },
            },
          ]
        );
      } else {
        // Sign-up mode: Link anonymous account to email
        // Get current anonymous user
        const anonymousUser = getCurrentUser();
        if (!anonymousUser || !anonymousUser.isAnonymous) {
          throw new Error('No anonymous user found');
        }

        console.log('[EmailAuth] Linking anonymous account to email...');
        console.log('[EmailAuth] Anonymous UID:', anonymousUser.uid);

        // Link anonymous account to email credential
        const { previousUid, newUid, user } = await linkAnonymousToEmail(email, password);

        console.log('[EmailAuth] Account linked successfully');
        console.log('[EmailAuth] Previous UID:', previousUid);
        console.log('[EmailAuth] New UID:', newUid);

        // Migrate data from anonymous to authenticated
        console.log('[EmailAuth] Migrating user data...');
        const migrationResult = await migrateUserData(previousUid, newUid);

        if (!migrationResult.success) {
          console.warn('[EmailAuth] Data migration had errors:', migrationResult.errors);
          // Continue anyway - data might be recoverable
        }

        // Get Firebase ID token for backend authentication
        const idToken = await user.getIdToken();

        // Save onboarding data to AsyncStorage before syncing
        console.log('[EmailAuth] Saving onboarding data to storage...');
        await useOnboardingStore.getState().saveToStorage();

        // Sync onboarding data to backend
        console.log('[EmailAuth] Syncing data to backend...');
        await syncOnboardingDataToBackend(newUid, idToken);

        // Store in auth store (sets isAuthenticated = true)
        useAuthStore.getState().login(
          {
            id: user.uid,
            email: user.email || email,
            firebaseUid: user.uid,
            createdAt: new Date().toISOString(),
          },
          idToken
        );

        console.log('[EmailAuth] Authentication complete!');

        // Success! Navigate to Rating
        Alert.alert(
          'Account Created!',
          'Your account has been created successfully.',
          [
            {
              text: 'Continue',
              onPress: () => {
                // Navigate to Rating screen
                navigation.navigate('Rating');
              },
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('[EmailAuth] Authentication failed:', error);

      // Get user-friendly error message
      const errorMessage = error.code ? getAuthErrorMessage(error) : error.message || 'Authentication failed';

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle between sign in and sign up modes
   */
  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setErrors({});
    setConfirmPassword('');
  };

  /**
   * Handle back button
   */
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </Pressable>

            <Text style={styles.title}>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Text>
            <Text style={styles.subtitle}>
              {mode === 'signin'
                ? 'Welcome back! Sign in to continue.'
                : 'Create an account to secure your data'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="your@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                placeholder="Min 8 characters"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                textContentType="none"
                autoComplete="off"
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password Input (Sign Up only) */}
            {mode === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={[styles.input, errors.confirmPassword && styles.inputError]}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  placeholder="Re-enter password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  textContentType="none"
                  autoComplete="off"
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>
            )}

            {/* Submit Button */}
            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed,
                isLoading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </Pressable>

            {/* Mode Toggle */}
            <View style={styles.modeToggle}>
              <Text style={styles.modeToggleText}>
                {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              </Text>
              <Pressable onPress={toggleMode} disabled={isLoading}>
                <Text style={styles.modeToggleLink}>
                  {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 32,
  },
  backButton: {
    paddingVertical: 8,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 17,
    color: '#14B8A6',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#14B8A6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modeToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  modeToggleText: {
    fontSize: 15,
    color: '#6B7280',
  },
  modeToggleLink: {
    fontSize: 15,
    color: '#14B8A6',
    fontWeight: '600',
  },
});
