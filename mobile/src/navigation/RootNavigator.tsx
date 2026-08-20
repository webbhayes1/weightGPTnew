/**
 * Root Navigator
 * Phase 3: Main app navigator with tab navigation + modal stacks
 * Modals: MealSwap, WorkoutSwap, AILogging, WeeklyPlanning
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation.types';

// Main navigation
import BottomTabNavigator from './BottomTabNavigator';

// Modal screens (placeholders for now - will implement in later phases)
// import MealSwapModal from '../screens/modals/MealSwapModal';
// import WorkoutSwapModal from '../screens/modals/WorkoutSwapModal';
// import AILoggingModal from '../screens/modals/AILoggingModal';
// import WeeklyPlanningModal from '../screens/modals/WeeklyPlanningModal';

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'transparentModal',
        cardStyle: { backgroundColor: 'transparent' },
      }}
    >
      {/* Main app (tab navigation) */}
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />

      {/* Modal screens - to be implemented in later phases */}
      {/*
      <Stack.Screen
        name="MealSwapModal"
        component={MealSwapModal}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WorkoutSwapModal"
        component={WorkoutSwapModal}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AILoggingModal"
        component={AILoggingModal}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WeeklyPlanningModal"
        component={WeeklyPlanningModal}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      */}
    </Stack.Navigator>
  );
}