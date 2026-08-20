/**
 * Bottom Tab Navigator
 * 3-tab navigation: Home, Log, Progress
 * Phase 3: Q3.0 App Shell implementation with frosted glass styling
 */

import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from '../types/navigation.types';
import tokens from '../theme/tokens';

// Helper to determine if tab bar should be hidden
function getTabBarVisibility(route: any): boolean {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeScreen';
  // Hide tab bar on detail screens (Home and Log stacks)
  const hideOnScreens = [
    'MealDetail',
    'WorkoutDetail',
    'MealConfirmation',
    'WorkoutConfirmation',
    'WeightLog',
    'ManualMealEntry',
    'ManualWorkoutEntry',
  ];
  return !hideOnScreens.includes(routeName);
}

// Navigators and Screens
import HomeStackNavigator from './HomeStackNavigator';
import LogStackNavigator from './LogStackNavigator';
import ProgressScreen from '../screens/progress/ProgressScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom tab bar background with frosted glass effect
function TabBarBackground() {
  return (
    <BlurView
      intensity={20}
      tint="systemMaterialLight"
      style={StyleSheet.absoluteFill}
    />
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        // Hide default headers (Home screen has its own header with dual-mode toggle)
        headerShown: false,

        // Tab bar styling with frosted glass
        tabBarStyle: {
          position: 'absolute',
          height: Platform.OS === 'ios' ? 80 : 70,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => <TabBarBackground />,

        // Active/inactive colors (teal for active, gray for inactive per spec)
        tabBarActiveTintColor: '#14B8A6', // Teal
        tabBarInactiveTintColor: '#9CA3AF', // Gray

        // Label styling
        tabBarLabelStyle: {
          ...tokens.typography.body.s,
          fontSize: 11,
          fontWeight: '500' as const,
          marginTop: 4,
        },

        // Icon styling
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={({ route }) => ({
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
          tabBarStyle: getTabBarVisibility(route)
            ? {
                position: 'absolute',
                height: Platform.OS === 'ios' ? 80 : 70,
                paddingBottom: Platform.OS === 'ios' ? 20 : 10,
                paddingTop: 10,
                borderTopWidth: 0,
                elevation: 0,
                backgroundColor: 'transparent',
              }
            : { display: 'none' },
        })}
      />
      <Tab.Screen
        name="Log"
        component={LogStackNavigator}
        options={({ route }) => ({
          title: 'Log',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={size}
              color={color}
            />
          ),
          tabBarStyle: getTabBarVisibility(route)
            ? {
                position: 'absolute',
                height: Platform.OS === 'ios' ? 80 : 70,
                paddingBottom: Platform.OS === 'ios' ? 20 : 10,
                paddingTop: 10,
                borderTopWidth: 0,
                elevation: 0,
                backgroundColor: 'transparent',
              }
            : { display: 'none' },
        })}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          title: 'Progress',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'bar-chart' : 'bar-chart-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
