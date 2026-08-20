/**
 * Home Screen
 * Phase 3: Q3.0 App Shell - Unified dashboard with nutrition + workout progress
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeStackScreenProps } from '../../types/navigation.types';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { signOut } from '../../services/auth/firebaseAuth';
import { useDailyMeals } from '../../hooks/useDailyMeals';
import { useDailyWorkout } from '../../hooks/useDailyWorkout';
import { useDailyProgress } from '../../hooks/useDailyProgress';
import { useLogMeal } from '../../hooks/useLogMeal';
import { useLogWorkout } from '../../hooks/useLogWorkout';
import { useToggleFavorite } from '../../hooks/useToggleFavorite';
import { useToggleMealFavorite } from '../../hooks/useToggleMealFavorite';
import { useMealPlanGeneration } from '../../hooks/useMealPlanGeneration';
import { useWorkoutPlanGeneration } from '../../hooks/useWorkoutPlanGeneration';
import { useLoggedEntries, useDeleteLoggedEntry, LoggedEntry } from '../../hooks/useLogging';
import { Ionicons } from '@expo/vector-icons';
import DaySelector from '../../components/home/DaySelector';
import UnifiedProgressRings from '../../components/home/UnifiedProgressRings';
import TodaysMealsDisplay from '../../components/home/TodaysMealsDisplay';
import TodaysWorkoutDisplay from '../../components/home/TodaysWorkoutDisplay';
import tokens from '../../theme/tokens';

type Props = HomeStackScreenProps<'HomeScreen'>;

export default function HomeScreen({ navigation }: Props) {
  const { selectedDate } = useUIStore();

  // Fetch data from API with selected date
  const {
    data: mealsData,
    isLoading: mealsLoading,
    error: mealsError,
    refetch: refetchMeals
  } = useDailyMeals(selectedDate);

  const {
    data: workoutData,
    isLoading: workoutLoading,
    error: workoutError,
    refetch: refetchWorkout
  } = useDailyWorkout(selectedDate);

  const {
    data: progressData,
    isLoading: progressLoading,
    error: progressError,
    refetch: refetchProgress
  } = useDailyProgress(selectedDate);

  // Fetch logged entries (from AI parsing / manual entry) for the selected date
  const {
    data: loggedEntriesData,
    isLoading: loggedEntriesLoading,
    refetch: refetchLoggedEntries
  } = useLoggedEntries({ date: selectedDate });

  // Delete mutation for logged entries
  const deleteLoggedEntryMutation = useDeleteLoggedEntry();

  // Mutation hooks for logging and favorites
  const logMealMutation = useLogMeal();
  const logWorkoutMutation = useLogWorkout();
  const toggleFavoriteMutation = useToggleFavorite();
  const toggleMealFavoriteMutation = useToggleMealFavorite();
  const generateMealPlanMutation = useMealPlanGeneration();
  const generateWorkoutPlanMutation = useWorkoutPlanGeneration();

  // Track if auto-generation has been triggered (prevent multiple calls)
  const autoGenerationTriggered = useRef(false);

  // Auto-generate meal and workout plans on first app open
  useEffect(() => {
    // Only run once and only after data has loaded
    if (autoGenerationTriggered.current || mealsLoading || workoutLoading) {
      return;
    }

    const shouldAutoGenerate = !mealsData?.mealPlanId || !workoutData?.workoutPlanId;

    if (shouldAutoGenerate) {
      autoGenerationTriggered.current = true;

      // Auto-generate meal plan if missing
      if (!mealsData?.mealPlanId && !generateMealPlanMutation.isPending) {
        console.log('[HomeScreen] Auto-generating meal plan on first app open');
        generateMealPlanMutation.mutate({});
      }

      // Auto-generate workout plan if missing
      if (!workoutData?.workoutPlanId && !generateWorkoutPlanMutation.isPending) {
        console.log('[HomeScreen] Auto-generating workout plan on first app open');
        generateWorkoutPlanMutation.mutate({});
      }
    }
  }, [mealsData, workoutData, mealsLoading, workoutLoading, generateMealPlanMutation, generateWorkoutPlanMutation]);

  // Calculate current week's Monday-Sunday range (commented out - not currently used)
  // const getCurrentWeekRange = () => {
  //   const today = new Date();
  //   const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  //   const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 6 days since Monday

  //   const monday = new Date(today);
  //   monday.setDate(today.getDate() - daysSinceMonday);

  //   const sunday = new Date(monday);
  //   sunday.setDate(monday.getDate() + 6);

  //   const formatDate = (date: Date) => {
  //     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  //   };

  //   return {
  //     start: formatDate(monday),
  //     end: formatDate(sunday),
  //     display: `${formatDate(monday)} - ${formatDate(sunday)}`
  //   };
  // };

  // const weekRange = getCurrentWeekRange();

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    await Promise.all([
      refetchMeals(),
      refetchWorkout(),
      refetchProgress(),
      refetchLoggedEntries(),
    ]);
  }, [refetchMeals, refetchWorkout, refetchProgress, refetchLoggedEntries]);

  // Filter logged entries by type
  const loggedMealEntries = loggedEntriesData?.filter(e => e.type === 'meal') || [];
  const loggedWorkoutEntries = loggedEntriesData?.filter(e => e.type === 'workout') || [];

  // Handle delete logged entry
  const handleDeleteLoggedEntry = (entryId: string) => {
    deleteLoggedEntryMutation.mutate(entryId);
  };

  // Transform API data for unified progress rings
  const unifiedRingsData = progressData ? {
    calories: {
      consumed: progressData.nutrition.consumed.calories,
      target: progressData.nutrition.targets.calories
    },
    macros: {
      carbs: {
        consumed: progressData.nutrition.consumed.carbs,
        target: progressData.nutrition.targets.carbs
      },
      protein: {
        consumed: progressData.nutrition.consumed.protein,
        target: progressData.nutrition.targets.protein
      },
      fat: {
        consumed: progressData.nutrition.consumed.fat,
        target: progressData.nutrition.targets.fat
      }
    },
    exercise: {
      minutes: {
        completed: progressData.workout.completedMinutes,
        target: progressData.workout.targetMinutes
      },
      calories: {
        burned: progressData.workout.caloriesBurned,
        target: progressData.workout.caloriesTarget
      }
    },
  } : null;

  // Transform meals data for display
  const meals = mealsData?.meals.map(meal => ({
    id: meal.id,
    name: meal.name,
    mealType: meal.mealType,
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
    isLogged: meal.isLogged,
    loggedAt: meal.loggedAt ? new Date(meal.loggedAt).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    }) : undefined,
    isFavorited: meal.isFavorite,
  })) || [];

  // Transform workouts data for display
  const workouts = workoutData?.workouts.map(workout => ({
    id: workout.id,
    name: workout.name,
    durationMinutes: workout.durationMinutes,
    estimatedCalories: workout.estimatedCalories,
    actualCalories: workout.actualCalories || undefined,
    exerciseCount: workout.exerciseCount,
    isLogged: workout.isLogged,
    loggedAt: workout.loggedAt ? new Date(workout.loggedAt).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    }) : undefined,
    isFavorited: workout.isFavorited,
  })) || [];

  // Loading state
  const isLoading = mealsLoading || workoutLoading || progressLoading;
  const isGeneratingMeals = generateMealPlanMutation.isPending;
  const isGeneratingWorkouts = generateWorkoutPlanMutation.isPending;
  const isGenerating = isGeneratingMeals; // Only show loading state for meals, not workouts

  // Check for errors
  const hasError = mealsError || workoutError || progressError;

  // Check if we need to show empty plan states
  // FIX: Check for plan existence (mealPlanId/workoutPlanId), not meal/workout count
  // A plan can exist even if a specific day has 0 meals/workouts (e.g., Monday, rest days)
  const hasMealPlan = Boolean(mealsData?.mealPlanId);
  const hasWorkoutPlan = Boolean(workoutData?.workoutPlanId);

  // Distinguish between "no plan" and "rest day"
  const hasWorkoutPlanForWeek = Boolean(workoutData?.workoutPlanId);
  const isRestDay = hasWorkoutPlanForWeek && (workoutData?.workouts.length === 0);

  // const showEmptyMealState = !mealsLoading && !isGeneratingMeals && !hasMealPlan && !hasError;
  const showEmptyWorkoutState = !workoutLoading && !isGeneratingWorkouts && !hasWorkoutPlanForWeek && !workoutError;

  // Handlers
  const handleMealPress = (mealId: string) => {
    // @ts-ignore - Navigation typing issue with nested navigators
    navigation.navigate('MealDetail', { mealId, date: selectedDate });
  };

  const handleMealCheckbox = (mealId: string) => {
    console.log('Meal checkbox pressed:', mealId);
    logMealMutation.mutate({ mealId });
  };

  const handleMealFavorite = (mealId: string) => {
    console.log('Meal favorite pressed:', mealId);
    toggleMealFavoriteMutation.mutate({ mealId });
  };

  const handleWorkoutPress = (workoutId: string) => {
    // @ts-ignore - Navigation typing issue with nested navigators
    navigation.navigate('WorkoutDetail', { workoutId, date: selectedDate });
  };

  const handleWorkoutCheckbox = (workoutId: string) => {
    console.log('Workout checkbox pressed:', workoutId);
    logWorkoutMutation.mutate({ workoutId });
  };

  const handleWorkoutFavorite = (workoutId: string) => {
    console.log('Workout favorite pressed:', workoutId);
    toggleFavoriteMutation.mutate({ workoutId });
  };

  const handleViewWeek = () => {
    // @ts-ignore - Navigation typing issue with nested navigators
    navigation.navigate('WeeklyMeals');
  };

  const handleViewWorkoutWeek = () => {
    // @ts-ignore - Navigation typing issue with nested navigators
    navigation.navigate('WeeklyWorkouts');
  };

  const handleGenerateMealPlan = () => {
    console.log('[HomeScreen] Manual meal plan generation triggered');
    generateMealPlanMutation.mutate({});
  };

  const handleGenerateWorkoutPlan = () => {
    console.log('[HomeScreen] Manual workout plan generation triggered');
    generateWorkoutPlanMutation.mutate({});
  };

  // DEV ONLY: Logout handler for testing
  const handleDevLogout = async () => {
    console.log('[DEV] Logging out...');
    await signOut();
    await useAuthStore.getState().logout();
    console.log('[DEV] Logged out');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* DEV ONLY: Logout button for testing */}
        <Pressable
          onPress={handleDevLogout}
          style={styles.devLogoutButton}
        >
          <Text style={styles.devLogoutText}>DEV: Logout</Text>
        </Pressable>

        {/* Day selector */}
        <DaySelector />

        {/* Main content area - scrollable */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={onRefresh}
              tintColor="#14B8A6"
              colors={['#14B8A6']}
            />
          }
        >
          {/* Error state */}
          {hasError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Unable to load data. Pull down to retry.
              </Text>
            </View>
          )}

          {/* Loading state - show empty state while loading */}
          {isLoading && !progressData && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}

          {/* Unified Progress Rings */}
          {!isLoading && !isGenerating && unifiedRingsData && (
            <UnifiedProgressRings data={unifiedRingsData} />
          )}

          {/* Today's Meals Section - Always visible */}
          {!isLoading && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's Meals</Text>
              </View>

              {/* Generating meals state */}
              {isGeneratingMeals && (
                <View style={styles.inlineGeneratingContainer}>
                  <ActivityIndicator size="small" color="#FFB347" />
                  <Text style={styles.inlineGeneratingText}>
                    Creating your meal plan...
                  </Text>
                </View>
              )}

              {/* Empty state - show generate button */}
              {!isGeneratingMeals && !hasMealPlan && (
                <View style={styles.inlineEmptyContainer}>
                  <Text style={styles.inlineEmptyText}>
                    No meal plan for this week
                  </Text>
                  <TouchableOpacity
                    style={styles.inlineGenerateButton}
                    onPress={handleGenerateMealPlan}
                  >
                    <Text style={styles.inlineGenerateButtonText}>
                      Generate This Week's Plan
                    </Text>
                  </TouchableOpacity>
                  {generateMealPlanMutation.error && (
                    <Text style={styles.inlineErrorText}>
                      {generateMealPlanMutation.error instanceof Error
                        ? generateMealPlanMutation.error.message
                        : 'Failed to generate. Please try again.'}
                    </Text>
                  )}
                </View>
              )}

              {/* Meals list */}
              {!isGeneratingMeals && hasMealPlan && (
                <TodaysMealsDisplay
                  meals={meals}
                  onMealPress={handleMealPress}
                  onCheckboxPress={handleMealCheckbox}
                  onFavoritePress={handleMealFavorite}
                  onViewWeekPress={handleViewWeek}
                />
              )}

              {/* Logged Meals (from AI parsing / manual entry) */}
              {loggedMealEntries.length > 0 && (
                <View style={styles.loggedEntriesSection}>
                  <Text style={styles.loggedEntriesTitle}>Logged Today</Text>
                  {loggedMealEntries.map((entry) => {
                    const meal = entry.meal as {
                      items?: { name: string; calories: number; protein: number; carbs: number; fat: number }[];
                      totalCalories?: number;
                      totalProtein?: number;
                      totalCarbs?: number;
                      totalFat?: number;
                      mealType?: string;
                    } | null;
                    const mealName = meal?.items?.[0]?.name || 'Logged Meal';
                    const displayName = meal?.items && meal.items.length > 1
                      ? `${mealName} + ${meal.items.length - 1} more`
                      : mealName;

                    return (
                      <View key={entry.id} style={styles.loggedEntryCard}>
                        <View style={styles.loggedEntryCheckbox}>
                          <Ionicons name="checkmark-circle" size={24} color="#4BAE90" />
                        </View>
                        <View style={styles.loggedEntryContent}>
                          <Text style={styles.loggedEntryName} numberOfLines={1}>{displayName}</Text>
                          <Text style={styles.loggedEntryMacros}>
                            {meal?.totalCalories || 0} cal • {meal?.totalProtein || 0}g P • {meal?.totalCarbs || 0}g C • {meal?.totalFat || 0}g F
                          </Text>
                          <Text style={styles.loggedEntryTime}>
                            Logged at {new Date(entry.loggedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteLoggedEntry(entry.id)}
                        >
                          <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* Today's Workouts Section - Always visible */}
          {!isLoading && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's Workouts</Text>
              </View>

              {/* Generating workouts state */}
              {isGeneratingWorkouts && (
                <View style={styles.inlineGeneratingContainer}>
                  <ActivityIndicator size="small" color="#14B8A6" />
                  <Text style={styles.inlineGeneratingText}>
                    Creating your workout plan...
                  </Text>
                </View>
              )}

              {/* Rest day state - show rest day message */}
              {!isGeneratingWorkouts && isRestDay && (
                <View style={styles.inlineEmptyContainer}>
                  <Text style={styles.restDayText}>Rest Day</Text>
                  <Text style={styles.restDaySubtext}>
                    Take time to recover and recharge
                  </Text>
                </View>
              )}

              {/* Empty state - show generate button */}
              {!isGeneratingWorkouts && showEmptyWorkoutState && (
                <View style={styles.inlineEmptyContainer}>
                  <Text style={styles.inlineEmptyText}>
                    No workout plan for this week
                  </Text>
                  <TouchableOpacity
                    style={[styles.inlineGenerateButton, styles.inlineGenerateWorkoutButton]}
                    onPress={handleGenerateWorkoutPlan}
                  >
                    <Text style={styles.inlineGenerateButtonText}>
                      Generate This Week's Plan
                    </Text>
                  </TouchableOpacity>
                  {generateWorkoutPlanMutation.error && (
                    <Text style={styles.inlineErrorText}>
                      {generateWorkoutPlanMutation.error instanceof Error
                        ? generateWorkoutPlanMutation.error.message
                        : 'Failed to generate. Please try again.'}
                    </Text>
                  )}
                </View>
              )}

              {/* Workouts list */}
              {!isGeneratingWorkouts && hasWorkoutPlan && (
                <TodaysWorkoutDisplay
                  workouts={workouts}
                  onWorkoutPress={handleWorkoutPress}
                  onCheckboxPress={handleWorkoutCheckbox}
                  onFavoritePress={handleWorkoutFavorite}
                  onViewWeekPress={handleViewWorkoutWeek}
                />
              )}

              {/* Logged Workouts (from AI parsing / manual entry) */}
              {loggedWorkoutEntries.length > 0 && (
                <View style={styles.loggedEntriesSection}>
                  <Text style={styles.loggedEntriesTitle}>Logged Today</Text>
                  {loggedWorkoutEntries.map((entry) => {
                    const workout = entry.workout as {
                      name?: string;
                      durationMinutes?: number;
                      caloriesBurned?: number;
                      type?: string;
                    } | null;

                    return (
                      <View key={entry.id} style={styles.loggedEntryCard}>
                        <View style={styles.loggedEntryCheckbox}>
                          <Ionicons name="checkmark-circle" size={24} color="#14B8A6" />
                        </View>
                        <View style={styles.loggedEntryContent}>
                          <Text style={styles.loggedEntryName} numberOfLines={1}>
                            {workout?.name || 'Logged Workout'}
                          </Text>
                          <Text style={styles.loggedEntryMacros}>
                            {workout?.durationMinutes || 0} min • {workout?.caloriesBurned || 0} cal burned
                          </Text>
                          <Text style={styles.loggedEntryTime}>
                            Logged at {new Date(entry.loggedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteLoggedEntry(entry.id)}
                        >
                          <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background.white,
  },
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120, // Account for tab bar + extra space
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing['3xl'],
    minHeight: 400,
  },
  loadingText: {
    ...tokens.typography.body.l,
    color: tokens.colors.text.secondary,
  },
  section: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
  },
  sectionHeader: {
    marginBottom: tokens.spacing.md,
  },
  sectionTitle: {
    ...tokens.typography.heading.h2,
    fontSize: 20,
    color: tokens.colors.text.primary,
  },
  inlineGeneratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.md,
    paddingVertical: tokens.spacing.xl,
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: 12,
  },
  inlineGeneratingText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
  },
  inlineEmptyContainer: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.lg,
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: 12,
  },
  inlineEmptyText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.md,
  },
  inlineGenerateButton: {
    backgroundColor: '#FFB347',
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.md,
    borderRadius: 12,
  },
  inlineGenerateWorkoutButton: {
    backgroundColor: '#14B8A6',
  },
  inlineGenerateButtonText: {
    ...tokens.typography.body.m,
    fontWeight: '600' as const,
    color: tokens.colors.text.white,
  },
  inlineErrorText: {
    ...tokens.typography.body.s,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: tokens.spacing.sm,
  },
  restDayText: {
    ...tokens.typography.heading.h3,
    fontSize: 18,
    color: tokens.colors.text.primary,
    textAlign: 'center',
    marginBottom: tokens.spacing.xs,
  },
  restDaySubtext: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: tokens.spacing.lg,
    margin: tokens.spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    ...tokens.typography.body.m,
    color: '#991B1B',
    textAlign: 'center',
  },
  // DEV ONLY styles
  devLogoutButton: {
    backgroundColor: '#EF4444',
    padding: 8,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  devLogoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  // Logged entries styles
  loggedEntriesSection: {
    marginTop: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border.light,
  },
  loggedEntriesTitle: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.sm,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  loggedEntryCard: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: 12,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  loggedEntryCheckbox: {
    marginRight: tokens.spacing.md,
  },
  loggedEntryContent: {
    flex: 1,
  },
  loggedEntryName: {
    ...tokens.typography.body.m,
    fontWeight: '600' as const,
    color: tokens.colors.text.primary,
    marginBottom: 2,
  },
  loggedEntryMacros: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
  },
  loggedEntryTime: {
    ...tokens.typography.body.xs,
    color: tokens.colors.text.tertiary,
    marginTop: 2,
  },
  deleteButton: {
    padding: tokens.spacing.sm,
    marginLeft: tokens.spacing.sm,
  },
});
