/**
 * Workout Confirmation Screen
 * Phase 6: Q3.2 AI-Powered Logging
 *
 * Review and confirm AI-parsed workout before logging
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format, isToday, isYesterday, subDays } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LogStackParamList } from '../../types/navigation.types';
import { useCreateLoggedEntry, useUpdateLoggedEntry } from '../../hooks/useLogging';
import { useToast } from '../../components/common/Toast';
import tokens from '../../theme/tokens';

type NavigationProp = NativeStackNavigationProp<LogStackParamList, 'WorkoutConfirmation'>;
type RouteType = RouteProp<LogStackParamList, 'WorkoutConfirmation'>;

export default function WorkoutConfirmationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { showToast } = useToast();
  const { parsedWorkout, entryId } = route.params;

  // Check if this is an edit (updating existing entry) or new entry
  const isEditMode = !!entryId;

  const [workout, setWorkout] = useState(parsedWorkout);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const createEntryMutation = useCreateLoggedEntry();
  const updateEntryMutation = useUpdateLoggedEntry();

  // Helper to format the date label
  const getDateLabel = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEE, MMM d');
  };

  // Handle date change from picker
  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleConfirm = async () => {
    const workoutData = {
      name: workout.name,
      type: workout.type,
      durationMinutes: workout.durationMinutes,
      intensity: workout.intensity,
      caloriesBurned: workout.caloriesBurned,
      exercises: workout.exercises,
    };

    try {
      if (isEditMode && entryId) {
        // Update existing entry
        await updateEntryMutation.mutateAsync({
          id: entryId,
          workout: workoutData,
          isFavorite,
        });
        showToast('Workout updated!', 'success');
      } else {
        // Create new entry
        await createEntryMutation.mutateAsync({
          type: 'workout',
          date: selectedDate.toISOString(),
          workout: workoutData,
          isFavorite,
        });
        showToast('Workout logged!', 'success');
      }

      navigation.popToTop();
    } catch (error) {
      console.error('Failed to save workout:', error);
      showToast(isEditMode ? 'Failed to update workout' : 'Failed to log workout', 'error');
    }
  };

  const intensityColors: Record<string, string> = {
    easy: '#22C55E',
    moderate: '#F59E0B',
    hard: '#EF4444',
  };

  const typeIcons: Record<string, string> = {
    cardio: 'heart',
    strength: 'barbell',
    balanced: 'fitness',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Confidence Banner */}
        {parsedWorkout.confidence !== 'high' && (
          <View style={styles.confidenceBanner}>
            <Ionicons
              name="information-circle"
              size={20}
              color={parsedWorkout.confidence === 'medium' ? '#B45309' : '#DC2626'}
            />
            <Text style={styles.confidenceText}>
              {parsedWorkout.confidence === 'medium'
                ? 'Please review the parsed values'
                : 'Low confidence - values may be inaccurate'}
            </Text>
          </View>
        )}

        {/* Date Selector */}
        <View style={styles.dateSection}>
          <Text style={styles.dateSectionLabel}>Log for:</Text>
          <View style={styles.dateSelector}>
            <TouchableOpacity
              style={[
                styles.dateButton,
                isToday(selectedDate) && styles.dateButtonActive,
              ]}
              onPress={() => setSelectedDate(new Date())}
            >
              <Text
                style={[
                  styles.dateButtonText,
                  isToday(selectedDate) && styles.dateButtonTextActive,
                ]}
              >
                Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dateButton,
                isYesterday(selectedDate) && styles.dateButtonActive,
              ]}
              onPress={() => setSelectedDate(subDays(new Date(), 1))}
            >
              <Text
                style={[
                  styles.dateButtonText,
                  isYesterday(selectedDate) && styles.dateButtonTextActive,
                ]}
              >
                Yesterday
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dateButton,
                !isToday(selectedDate) && !isYesterday(selectedDate) && styles.dateButtonActive,
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons
                name="calendar-outline"
                size={16}
                color={
                  !isToday(selectedDate) && !isYesterday(selectedDate)
                    ? '#fff'
                    : tokens.colors.text.secondary
                }
              />
              <Text
                style={[
                  styles.dateButtonText,
                  !isToday(selectedDate) && !isYesterday(selectedDate) && styles.dateButtonTextActive,
                ]}
              >
                {!isToday(selectedDate) && !isYesterday(selectedDate)
                  ? getDateLabel(selectedDate)
                  : 'Other'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* iOS Date Picker Modal */}
        {Platform.OS === 'ios' && showDatePicker && (
          <Modal transparent animationType="slide">
            <View style={styles.datePickerModal}>
              <View style={styles.datePickerContent}>
                <View style={styles.datePickerHeader}>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.datePickerDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              </View>
            </View>
          </Modal>
        )}

        {/* Android Date Picker (inline) */}
        {Platform.OS === 'android' && showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Workout Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.typeIconContainer}>
              <Ionicons
                name={typeIcons[workout.type] as any}
                size={24}
                color={tokens.colors.primary.teal}
              />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <View style={styles.summaryMeta}>
                <View
                  style={[
                    styles.intensityBadge,
                    { backgroundColor: intensityColors[workout.intensity] + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.intensityText,
                      { color: intensityColors[workout.intensity] },
                    ]}
                  >
                    {workout.intensity.charAt(0).toUpperCase() + workout.intensity.slice(1)}
                  </Text>
                </View>
                <Text style={styles.typeBadge}>
                  {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color={tokens.colors.text.secondary} />
              <Text style={styles.statValue}>{workout.durationMinutes}</Text>
              <Text style={styles.statLabel}>min</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="flame-outline" size={20} color={tokens.colors.text.secondary} />
              <Text style={styles.statValue}>{workout.caloriesBurned}</Text>
              <Text style={styles.statLabel}>cal</Text>
            </View>
          </View>
        </View>

        {/* Exercises (if any) */}
        {workout.exercises && workout.exercises.length > 0 && (
          <View style={styles.exercisesSection}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            {workout.exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseCard}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <View style={styles.exerciseDetails}>
                  {exercise.sets && exercise.reps && (
                    <Text style={styles.exerciseDetail}>
                      {exercise.sets} x {exercise.reps}
                      {exercise.weight && ` @ ${exercise.weight} ${exercise.weightUnit || 'lbs'}`}
                    </Text>
                  )}
                  {exercise.durationMin && (
                    <Text style={styles.exerciseDetail}>{exercise.durationMin} min</Text>
                  )}
                  {exercise.distance && (
                    <Text style={styles.exerciseDetail}>
                      {exercise.distance} {exercise.distanceUnit || 'miles'}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Favorite Toggle */}
        <TouchableOpacity
          style={styles.favoriteToggle}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#EF4444' : tokens.colors.text.secondary}
          />
          <Text style={styles.favoriteText}>Save to favorites</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (createEntryMutation.isPending || updateEntryMutation.isPending) && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={createEntryMutation.isPending || updateEntryMutation.isPending}
        >
          {(createEntryMutation.isPending || updateEntryMutation.isPending) ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.confirmButtonText}>
                {isEditMode ? 'Update Workout' : 'Confirm & Log'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background.offWhite,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: tokens.spacing.lg,
    paddingBottom: 100,
  },
  confidenceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: tokens.spacing.md,
    borderRadius: 8,
    marginBottom: tokens.spacing.lg,
    gap: tokens.spacing.sm,
  },
  confidenceText: {
    ...tokens.typography.body.s,
    color: '#B45309',
    flex: 1,
  },
  dateSection: {
    marginBottom: tokens.spacing.lg,
  },
  dateSectionLabel: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.sm,
  },
  dateSelector: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: 8,
    backgroundColor: tokens.colors.background.white,
    borderWidth: 1,
    borderColor: tokens.colors.border.light,
    gap: tokens.spacing.xs,
  },
  dateButtonActive: {
    backgroundColor: tokens.colors.primary.teal,
    borderColor: tokens.colors.primary.teal,
  },
  dateButtonText: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
  },
  dateButtonTextActive: {
    color: '#fff',
  },
  datePickerModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  datePickerContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border.light,
  },
  datePickerDone: {
    ...tokens.typography.body.m,
    color: tokens.colors.primary.teal,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: tokens.colors.background.white,
    borderRadius: 16,
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  typeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: tokens.colors.primary.teal + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  summaryInfo: {
    flex: 1,
  },
  workoutName: {
    ...tokens.typography.heading.h2,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  summaryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  intensityBadge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  intensityText: {
    ...tokens.typography.body.xs,
    fontWeight: '600',
  },
  typeBadge: {
    ...tokens.typography.body.xs,
    color: tokens.colors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: tokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border.light,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  statValue: {
    ...tokens.typography.heading.h2,
    color: tokens.colors.text.primary,
  },
  statLabel: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: tokens.colors.border.light,
  },
  exercisesSection: {
    marginBottom: tokens.spacing.lg,
  },
  sectionTitle: {
    ...tokens.typography.heading.h3,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.md,
  },
  exerciseCard: {
    backgroundColor: tokens.colors.background.white,
    borderRadius: 12,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  exerciseName: {
    ...tokens.typography.body.m,
    fontWeight: '600',
    color: tokens.colors.text.primary,
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginTop: tokens.spacing.xs,
  },
  exerciseDetail: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
  },
  favoriteToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
  favoriteText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: tokens.colors.background.white,
    padding: tokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border.light,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.primary.teal,
    paddingVertical: tokens.spacing.md,
    borderRadius: 12,
    gap: tokens.spacing.sm,
  },
  confirmButtonDisabled: {
    backgroundColor: tokens.colors.text.tertiary,
  },
  confirmButtonText: {
    ...tokens.typography.body.m,
    fontWeight: '600',
    color: '#fff',
  },
});
