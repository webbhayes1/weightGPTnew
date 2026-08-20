/**
 * WeightGPT Mobile App
 * Root component with navigation and providers
 */

import 'react-native-gesture-handler'; // Must be at the top!
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import OnboardingNavigator from './src/navigation/OnboardingNavigator';
import { queryClient } from './src/services/queryClient';
import { initializeDatabase } from './src/db';
import { signInAnonymously, onAuthStateChange } from './src/services/auth/firebaseAuth';
import { useAuthStore } from './src/store/authStore';
import { ToastProvider } from './src/components/common/Toast';

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Subscribe to auth state
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const setupApp = async () => {
      try {
        // Step 1: Initialize auth store from SecureStore
        console.log('[App] Initializing auth store from SecureStore...');
        await useAuthStore.getState().initialize();
        console.log('[App] Auth store initialized');

        // Step 2: Initialize database
        console.log('[App] Initializing database...');
        await initializeDatabase();
        console.log('[App] Database ready!');

        // Check if already authenticated (from SecureStore)
        const isAlreadyAuthenticated = useAuthStore.getState().isAuthenticated;

        if (isAlreadyAuthenticated) {
          console.log('[App] User already authenticated, skipping anonymous sign-in');
        } else {
          // Step 3: Firebase Anonymous Sign-In (for onboarding)
          console.log('[App] Signing in anonymously for onboarding...');
          const { user } = await signInAnonymously();
          console.log('[App] Anonymous sign-in successful, UID:', user.uid);

          // Get Firebase ID token
          const idToken = await user.getIdToken();
          console.log('[App] Firebase ID token retrieved');

          // Store anonymous session (token for API calls, but NOT authenticated)
          // This allows onboarding to make API calls while still showing onboarding flow
          await useAuthStore.getState().setAnonymousSession(
            {
              id: user.uid,
              email: user.email || '',
              firebaseUid: user.uid,
              createdAt: user.metadata.creationTime || new Date().toISOString(),
            },
            idToken
          );

          // Verify token was stored
          const storedToken = useAuthStore.getState().token;
          console.log('[App] Token stored in authStore:', storedToken ? `${storedToken.substring(0, 20)}...` : 'NO TOKEN');
          console.log('[App] isAuthenticated:', useAuthStore.getState().isAuthenticated);
        }

        // Step 4: Mark app as ready (will render main app)
        setIsAppReady(true);
        console.log('[App] App ready to render');
      } catch (error) {
        console.error('[App] Initialization failed:', error);
        setDbError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    setupApp();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        console.log('[App] Auth state changed, UID:', firebaseUser.uid, 'isAnonymous:', firebaseUser.isAnonymous);

        // Get fresh ID token
        const idToken = await firebaseUser.getIdToken();

        const userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          firebaseUid: firebaseUser.uid,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        };

        if (firebaseUser.isAnonymous) {
          // Anonymous user - keep in onboarding flow
          await useAuthStore.getState().setAnonymousSession(userData, idToken);
        } else {
          // Authenticated user (email, Google, Apple) - show main app
          await useAuthStore.getState().login(userData, idToken);
        }
      } else {
        // Auth state changed to null - only logout if we currently have a token
        // This prevents clearing the token during app initialization
        const currentToken = useAuthStore.getState().token;
        if (currentToken) {
          console.log('[App] ⚠️ Auth state changed to NULL - user signed out!');
          console.log('[App] Clearing authStore token');
          await useAuthStore.getState().logout();
          console.log('[App] Token cleared');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Show loading screen while app initializes
  if (!isAppReady && !dbError) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
            Setting up your app...
          </Text>
        </View>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  }

  // Show error screen if database initialization failed
  if (dbError) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FF3B30', marginBottom: 8 }}>
            Database Error
          </Text>
          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
            {dbError}
          </Text>
        </View>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  }

  // Show onboarding if not authenticated, main app if authenticated
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <NavigationContainer>
            {isAuthenticated ? <BottomTabNavigator /> : <OnboardingNavigator />}
            <StatusBar style="auto" />
          </NavigationContainer>
        </ToastProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
