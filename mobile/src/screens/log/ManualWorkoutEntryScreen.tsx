/**
 * Manual Workout Entry Screen
 * Phase 6: Q3.2 AI-Powered Logging
 *
 * Fallback for when AI parsing fails
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LogStackParamList } from '../../types/navigation.types';
import { useCreateLoggedEntry } from '../../hooks/useLogging';
import { useToast } from '../../components/common/Toast';
import tokens from '../../theme/tokens';

type NavigationProp = NativeStackNavigationProp<LogStackParamList, 'ManualWorkoutEntry'>;

export default function ManualWorkoutEntryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { showToast } = useToast();

  const [workoutName, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState<'cardio' | 'strength' | 'balanced'>('strength');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [intensity, setIntensity] = useState<'easy' | 'moderate' | 'hard'>('moderate');
  const [isFavorite, setIsFavorite] = useState(false);

  const createEntryMutation = useCreateLoggedEntry();

  const isValid =
    workoutName.trim() &&
    duration &&
    !isNaN(parseInt(duration)) &&
    calories &&
    !isNaN(parseInt(calories));

  const handleSubmit = async () => {
    if (!isValid) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      await createEntryMutation.mutateAsync({
        type: 'workout',
        date: new Date().toISOString(),
        workout: {
          name: workoutName.trim(),
          type: workoutType,
          durationMinutes: parseInt(duration),
          intensity,
          caloriesBurned: parseInt(calories),
          isManualEntry: true,
        },
        isFavorite,
      });

      showToast('Workout logged!', 'success');
      navigation.popToTop();
    } catch (error) {
      console.error('Failed to log workout:', error);
      showToast('Failed to log workout', 'error');
    }
  };

  const workoutTypes: Array<'cardio' | 'strength' | 'balanced'> = ['cardio', 'strength', 'balanced'];
  const intensities: Array<'easy' | 'moderate' | 'hard'> = ['easy', 'moderate', 'hard'];

  const intensityColors: Record<string, string> = {
    easy: '#22C55E',
    moderate: '#F59E0B',
    hard: '#EF4444',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Workout Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Workout Name</Text>
            <TextInput
              style={styles.textInput}
              value={workoutName}
              onChangeText={setWorkoutName}
              placeholder="e.g., Morning Run"
              placeholderTextColor={tokens.colors.text.tertiary}
              autoCapitalize="words"
            />
          </View>

          {/* Workout Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeSelector}>
              {workoutTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    workoutType === type && styles.typeButtonActive,
                  ]}
                  onPress={() => setWorkoutType(type)}
                >
                  <Ionicons
                    name={
                      type === 'cardio'
                        ? 'heart'
                        : type === 'strength'
                        ? 'barbell'
                        : 'fitness'
                    }
                    size={20}
                    color={
                      workoutType === type ? '#fff' : tokens.colors.text.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      workoutType === type && styles.typeButtonTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Intensity */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Intensity</Text>
            <View style={styles.intensitySelector}>
              {intensities.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.intensityButton,
                    intensity === level && {
                      backgroundColor: intensityColors[level] + '20',
                      borderColor: intensityColors[level],
                      borderWidth: 1,
                    },
                  ]}
                  onPress={() => setIntensity(level)}
                >
                  <Text
                    style={[
                      styles.intensityButtonText,
                      intensity === level && { color: intensityColors[level] },
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Duration */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration</Text>
            <View style={styles.numberInputContainer}>
              <TextInput
                style={styles.numberInput}
                value={duration}
                onChangeText={setDuration}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={tokens.colors.text.tertiary}
                maxLength={4}
              />
              <Text style={styles.inputUnit}>min</Text>
            </View>
          </View>

          {/* Calories */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calories Burned</Text>
            <View style={styles.numberInputContainer}>
              <TextInput
                style={styles.numberInput}
                value={calories}
                onChangeText={setCalories}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={tokens.colors.text.tertiary}
                maxLength={5}
              />
              <Text style={styles.inputUnit}>cal</Text>
            </View>
          </View>

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

        {/* Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!isValid || createEntryMutation.isPending) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isValid || createEntryMutation.isPending}
          >
            {createEntryMutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Log Workout</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: tokens.spacing.lg,
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: tokens.spacing.lg,
  },
  label: {
    ...tokens.typography.body.s,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.sm,
  },
  textInput: {
    backgroundColor: tokens.colors.background.white,
    borderRadius: 12,
    padding: tokens.spacing.md,
    ...tokens.typography.body.m,
    color: tokens.colors.text.primary,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.md,
    borderRadius: 12,
    backgroundColor: tokens.colors.background.white,
    gap: tokens.spacing.xs,
  },
  typeButtonActive: {
    backgroundColor: tokens.colors.primary.teal,
  },
  typeButtonText: {
    ...tokens.typography.body.s,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  intensitySelector: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  intensityButton: {
    flex: 1,
    paddingVertical: tokens.spacing.sm,
    borderRadius: 8,
    backgroundColor: tokens.colors.background.white,
    alignItems: 'center',
  },
  intensityButtonText: {
    ...tokens.typography.body.s,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
  },
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.background.white,
    borderRadius: 12,
    padding: tokens.spacing.md,
  },
  numberInput: {
    flex: 1,
    ...tokens.typography.body.m,
    color: tokens.colors.text.primary,
  },
  inputUnit: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    marginLeft: tokens.spacing.sm,
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
    backgroundColor: tokens.colors.background.white,
    padding: tokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border.light,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.primary.teal,
    paddingVertical: tokens.spacing.md,
    borderRadius: 12,
    gap: tokens.spacing.sm,
  },
  submitButtonDisabled: {
    backgroundColor: tokens.colors.text.tertiary,
  },
  submitButtonText: {
    ...tokens.typography.body.m,
    fontWeight: '600',
    color: '#fff',
  },
});
