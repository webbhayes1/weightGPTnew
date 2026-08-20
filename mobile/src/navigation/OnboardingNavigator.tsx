/**
 * Onboarding Navigator
 * Stack navigator for Q1 17-step onboarding flow
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../types/onboarding.types';
import tokens from '../theme/tokens';

// Import screens (will create these next)
// Step 1-7: Goal & Stats
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import GoalTypeScreen from '../screens/onboarding/GoalTypeScreen';
import CurrentWeightScreen from '../screens/onboarding/CurrentWeightScreen';
import GoalWeightScreen from '../screens/onboarding/GoalWeightScreen';
import GoalDateScreen from '../screens/onboarding/GoalDateScreen';
import PersonalDetailsScreen from '../screens/onboarding/PersonalDetailsScreen';
import DailyActivityLevelScreen from '../screens/onboarding/DailyActivityLevelScreen';

// Loading Break 1
import LoadingBreak1Screen from '../screens/onboarding/LoadingBreak1Screen';

// Step 8-9: Food Preferences (Budget, Meal Prep Time, Meal Variety, Grocery Day moved to Settings)
import FoodPreferencesScreen from '../screens/onboarding/FoodPreferencesScreen';
import EatingPatternScreen from '../screens/onboarding/EatingPatternScreen';

// Step 10-11: Workout
import EquipmentAccessScreen from '../screens/onboarding/EquipmentAccessScreen';

// Loading Break 2
import LoadingBreak2Screen from '../screens/onboarding/LoadingBreak2Screen';

import WorkoutScheduleScreen from '../screens/onboarding/WorkoutScheduleScreen';

// Step 12: Final Step (Steps removed: Meal Prep Time, Meal Variety, Budget, Grocery Day → moved to Settings)
import PreferencesConsentScreen from '../screens/onboarding/PreferencesConsentScreen';

// Loading Break 3 (Final - Plan Generation)
import LoadingBreak3Screen from '../screens/onboarding/LoadingBreak3Screen';

// Phase 2.5: Value Demo Screens
import ValueDemoCarouselScreen from '../screens/onboarding/ValueDemoCarouselScreen';

// Phase 2.5: Paywall
import PaywallScreen from '../screens/onboarding/PaywallScreen';

// Session 35: Post-Paywall Account Creation
import AccountSetupScreen from '../screens/onboarding/AccountSetupScreen';
import EmailAuthScreen from '../screens/onboarding/EmailAuthScreen';

// Post-Paywall: Rating
import RatingScreen from '../screens/onboarding/RatingScreen';

const Stack = createStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false, // Custom header with progress bar in each screen
        gestureEnabled: false, // Prevent swipe back (use explicit back button)
        cardStyle: {
          backgroundColor: tokens.colors.background.white,
        },
        animationEnabled: true,
        cardStyleInterpolator: ({ current }: any) => ({
          cardStyle: {
            opacity: current.progress,
          },
        }),
      }}
    >
      {/* Step 1: Welcome */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />

      {/* Step 2: Goal Type */}
      <Stack.Screen name="GoalType" component={GoalTypeScreen} />

      {/* Step 3: Current Weight */}
      <Stack.Screen name="CurrentWeight" component={CurrentWeightScreen} />

      {/* Step 4: Goal Weight (skipped for maintain) */}
      <Stack.Screen name="GoalWeight" component={GoalWeightScreen} />

      {/* Step 5: Goal Date (skipped for maintain) */}
      <Stack.Screen name="GoalDate" component={GoalDateScreen} />

      {/* Step 6: Personal Details */}
      <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />

      {/* Step 7: Daily Activity Level */}
      <Stack.Screen name="DailyActivityLevel" component={DailyActivityLevelScreen} />

      {/* Loading Break 1: Calculate BMR/TDEE/Calories */}
      <Stack.Screen name="LoadingBreak1" component={LoadingBreak1Screen} />

      {/* Step 8: Food Preferences */}
      <Stack.Screen name="FoodPreferences" component={FoodPreferencesScreen} />

      {/* Step 9: Eating Pattern */}
      <Stack.Screen name="EatingPattern" component={EatingPatternScreen} />

      {/* Loading Break 2: Workout Recommendations (calculate before asking equipment) */}
      <Stack.Screen name="LoadingBreak2" component={LoadingBreak2Screen} />

      {/* Step 10: Equipment Access */}
      <Stack.Screen name="EquipmentAccess" component={EquipmentAccessScreen} />

      {/* Step 11: Workout Schedule */}
      <Stack.Screen name="WorkoutSchedule" component={WorkoutScheduleScreen} />

      {/* Loading Break 3: Final - Plan Generation */}
      <Stack.Screen name="LoadingBreak3" component={LoadingBreak3Screen} />

      {/* Phase 2.5: Value Demo Carousel (swipeable between 3 screens) */}
      <Stack.Screen
        name="ValueDemoSuccessPath"
        component={ValueDemoCarouselScreen}
        options={{
          gestureEnabled: false, // Swiping handled by carousel
        }}
      />

      {/* Phase 2.5: Paywall */}
      <Stack.Screen name="Paywall" component={PaywallScreen} />

      {/* Session 35: Post-Paywall Account Creation */}
      <Stack.Screen name="AccountSetup" component={AccountSetupScreen} />
      <Stack.Screen name="EmailAuth" component={EmailAuthScreen} />

      {/* Post-Paywall: Rating */}
      <Stack.Screen name="Rating" component={RatingScreen} />

      {/* FINAL: Step 12 - Notification Preferences & Consent */}
      <Stack.Screen name="PreferencesConsent" component={PreferencesConsentScreen} />
    </Stack.Navigator>
  );
}
