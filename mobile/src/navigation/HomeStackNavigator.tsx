/**
 * Home Stack Navigator
 * Nested stack navigator for Home tab
 * Enables navigation to meal/workout detail screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/navigation.types';
import HomeScreen from '../screens/home/HomeScreen';
import MealDetailScreen from '../screens/meals/MealDetailScreen';
import WorkoutDetailScreen from '../screens/workouts/WorkoutDetailScreen';
import WeeklyMealsScreen from '../screens/meals/WeeklyMealsScreen';
import WeeklyWorkoutsScreen from '../screens/workouts/WeeklyWorkoutsScreen';
import GroceryListScreen from '../screens/meals/GroceryListScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }} // Home has its own header
      />
      <Stack.Screen
        name="MealDetail"
        component={MealDetailScreen}
        options={{
          title: 'Meal Details',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{
          title: 'Workout Details',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="WeeklyMeals"
        component={WeeklyMealsScreen}
        options={{
          title: 'My Week',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="WeeklyWorkouts"
        component={WeeklyWorkoutsScreen}
        options={{
          title: 'My Week',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="GroceryList"
        component={GroceryListScreen}
        options={{
          title: 'Grocery List',
          presentation: 'card',
        }}
      />
    </Stack.Navigator>
  );
}
