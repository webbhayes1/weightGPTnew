/**
 * Log Stack Navigator
 * Phase 6: Q3.2 AI-Powered Logging
 *
 * Navigation stack for the Log tab
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogStackParamList } from '../types/navigation.types';
import tokens from '../theme/tokens';

// Screens
import LogScreen from '../screens/log/LogScreen';
import MealConfirmationScreen from '../screens/log/MealConfirmationScreen';
import WorkoutConfirmationScreen from '../screens/log/WorkoutConfirmationScreen';
import WeightLogScreen from '../screens/log/WeightLogScreen';
import ManualMealEntryScreen from '../screens/log/ManualMealEntryScreen';
import ManualWorkoutEntryScreen from '../screens/log/ManualWorkoutEntryScreen';

const Stack = createNativeStackNavigator<LogStackParamList>();

export default function LogStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: tokens.colors.background.white,
        },
        headerTintColor: tokens.colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: tokens.colors.background.offWhite,
        },
      }}
    >
      <Stack.Screen
        name="LogScreen"
        component={LogScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MealConfirmation"
        component={MealConfirmationScreen}
        options={{ title: 'Confirm Meal' }}
      />
      <Stack.Screen
        name="WorkoutConfirmation"
        component={WorkoutConfirmationScreen}
        options={{ title: 'Confirm Workout' }}
      />
      <Stack.Screen
        name="WeightLog"
        component={WeightLogScreen}
        options={{ title: 'Log Weight' }}
      />
      <Stack.Screen
        name="ManualMealEntry"
        component={ManualMealEntryScreen}
        options={{ title: 'Manual Meal Entry' }}
      />
      <Stack.Screen
        name="ManualWorkoutEntry"
        component={ManualWorkoutEntryScreen}
        options={{ title: 'Manual Workout Entry' }}
      />
    </Stack.Navigator>
  );
}
