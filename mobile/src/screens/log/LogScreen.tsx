/**
 * Log Screen
 * Phase 6: Q3.2 AI-Powered Logging
 *
 * Main logging interface with type selector and AI input
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LogStackParamList, ParsedMealData, ParsedWorkoutData } from '../../types/navigation.types';
import { useParseMeal, useParseWorkout, useRecentEntries, useDeleteLoggedEntry } from '../../hooks/useLogging';
import { useToast } from '../../components/common/Toast';
import FollowUpModal, { FollowUpType } from '../../components/log/FollowUpModal';
import tokens from '../../theme/tokens';

type LogType = 'meal' | 'workout' | 'weight';

type NavigationProp = NativeStackNavigationProp<LogStackParamList, 'LogScreen'>;

// Follow-up state interface
interface FollowUpState {
  visible: boolean;
  type: FollowUpType;
  question: string;
  quickOptions: string[] | null; // AI-provided context-appropriate quick options
  originalInput: string;
  partialResult: ParsedMealData | ParsedWorkoutData | null;
  logType: 'meal' | 'workout';
  isLoading: boolean; // Track loading state within modal
}

export default function LogScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { showToast } = useToast();

  const [selectedType, setSelectedType] = useState<LogType>('meal');
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<TextInput>(null);

  // Follow-up question state
  const [followUp, setFollowUp] = useState<FollowUpState>({
    visible: false,
    type: 'portion',
    question: '',
    quickOptions: null,
    originalInput: '',
    partialResult: null,
    logType: 'meal',
    isLoading: false,
  });

  const parseMealMutation = useParseMeal();
  const parseWorkoutMutation = useParseWorkout();
  const deleteLoggedEntryMutation = useDeleteLoggedEntry();

  const { data: recentMeals } = useRecentEntries('meal', 3);
  const { data: recentWorkouts } = useRecentEntries('workout', 3);

  // Handle delete recent entry
  const handleDeleteRecent = (entryId: string) => {
    deleteLoggedEntryMutation.mutate(entryId, {
      onSuccess: () => {
        showToast('Entry deleted', 'success');
      },
      onError: () => {
        showToast('Failed to delete entry', 'error');
      },
    });
  };

  const isParsing = parseMealMutation.isPending || parseWorkoutMutation.isPending;

  const placeholders: Record<LogType, string> = {
    meal: 'What did you eat? (e.g., grilled chicken with rice)',
    workout: 'What workout did you do? (e.g., 30 min run)',
    weight: 'Enter your weight',
  };

  const handleTypeSelect = (type: LogType) => {
    setSelectedType(type);
    setInputText('');
    if (type === 'weight') {
      navigation.navigate('WeightLog');
    }
  };

  const handleSubmit = async (followUpContext?: string) => {
    const textToParse = followUpContext ? followUp.originalInput : inputText;
    if (!textToParse.trim()) return;

    // If this is a follow-up, show loading in modal; otherwise dismiss keyboard
    if (followUpContext) {
      setFollowUp((prev) => ({ ...prev, isLoading: true }));
    } else {
      Keyboard.dismiss();
    }

    try {
      if (selectedType === 'meal' || (followUpContext && followUp.logType === 'meal')) {
        const result = await parseMealMutation.mutateAsync({
          input: textToParse,
          followUpContext,
        });

        // Check if AI needs another follow-up
        if (result.followUpNeeded && result.followUpQuestion && result.followUpType) {
          setFollowUp((prev) => ({
            ...prev,
            visible: true,
            type: result.followUpType as FollowUpType,
            question: result.followUpQuestion,
            quickOptions: result.quickOptions || null,
            originalInput: textToParse,
            partialResult: result,
            logType: 'meal',
            isLoading: false,
          }));
          return;
        }

        if (result.items.length === 0 || result.confidence === 'low') {
          setFollowUp((prev) => ({ ...prev, visible: false, isLoading: false }));
          showToast('Could not parse meal. Try manual entry.', 'error');
          navigation.navigate('ManualMealEntry');
          return;
        }

        // Success - clear follow-up state and navigate
        setFollowUp((prev) => ({ ...prev, visible: false, isLoading: false }));
        setInputText('');
        navigation.navigate('MealConfirmation', { parsedMeal: result });
      } else if (selectedType === 'workout' || (followUpContext && followUp.logType === 'workout')) {
        const result = await parseWorkoutMutation.mutateAsync({
          input: textToParse,
          followUpContext,
        });

        // Check if AI needs another follow-up
        if (result.followUpNeeded && result.followUpQuestion && result.followUpType) {
          setFollowUp((prev) => ({
            ...prev,
            visible: true,
            type: result.followUpType as FollowUpType,
            question: result.followUpQuestion,
            quickOptions: result.quickOptions || null,
            originalInput: textToParse,
            partialResult: result,
            logType: 'workout',
            isLoading: false,
          }));
          return;
        }

        if (result.confidence === 'low') {
          setFollowUp((prev) => ({ ...prev, visible: false, isLoading: false }));
          showToast('Could not parse workout. Try manual entry.', 'error');
          navigation.navigate('ManualWorkoutEntry');
          return;
        }

        // Success - clear follow-up state and navigate
        setFollowUp((prev) => ({ ...prev, visible: false, isLoading: false }));
        setInputText('');
        navigation.navigate('WorkoutConfirmation', { parsedWorkout: result });
      }
    } catch (error) {
      console.error('Parse error:', error);
      setFollowUp((prev) => ({ ...prev, visible: false, isLoading: false }));
      showToast('Failed to parse input. Try manual entry.', 'error');

      if (selectedType === 'meal' || (followUpContext && followUp.logType === 'meal')) {
        navigation.navigate('ManualMealEntry');
      } else {
        navigation.navigate('ManualWorkoutEntry');
      }
    }
  };

  // Handle follow-up answer
  const handleFollowUpAnswer = async (answer: string) => {
    // Build follow-up context string
    const context = `User was asked: "${followUp.question}" and answered: "${answer}"`;

    // Don't close modal - handleSubmit will show loading state inside modal
    // Re-parse with follow-up context
    await handleSubmit(context);
  };

  // Handle follow-up skip (use best guess)
  const handleFollowUpSkip = () => {
    setFollowUp((prev) => ({ ...prev, visible: false, isLoading: false }));

    // Navigate directly with partial result if available
    if (followUp.partialResult) {
      if (followUp.logType === 'meal') {
        navigation.navigate('MealConfirmation', {
          parsedMeal: followUp.partialResult as ParsedMealData,
        });
      } else {
        navigation.navigate('WorkoutConfirmation', {
          parsedWorkout: followUp.partialResult as ParsedWorkoutData,
        });
      }
    }
    setInputText('');
  };

  // Handle follow-up cancel
  const handleFollowUpCancel = () => {
    setFollowUp((prev) => ({ ...prev, visible: false, isLoading: false }));
  };

  const handleQuickLog = (entry: any) => {
    if (entry.type === 'meal' && entry.meal) {
      navigation.navigate('MealConfirmation', {
        parsedMeal: {
          items: entry.meal.items || [],
          confidence: 'high',
          followUpNeeded: false,
        },
        entryId: entry.id, // Pass entry ID for edit mode
      });
    } else if (entry.type === 'workout' && entry.workout) {
      navigation.navigate('WorkoutConfirmation', {
        parsedWorkout: {
          ...entry.workout,
          confidence: 'high',
          followUpNeeded: false,
        },
        entryId: entry.id, // Pass entry ID for edit mode
      });
    }
  };

  const recentEntries = selectedType === 'meal' ? recentMeals : recentWorkouts;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Log</Text>
            <Text style={styles.subtitle}>What would you like to log?</Text>
          </View>

          {/* Type Selector */}
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === 'meal' && styles.typeButtonActive,
              ]}
              onPress={() => handleTypeSelect('meal')}
            >
              <Ionicons
                name="restaurant"
                size={24}
                color={selectedType === 'meal' ? '#fff' : tokens.colors.text.secondary}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === 'meal' && styles.typeButtonTextActive,
                ]}
              >
                Meal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === 'workout' && styles.typeButtonActive,
              ]}
              onPress={() => handleTypeSelect('workout')}
            >
              <Ionicons
                name="fitness"
                size={24}
                color={selectedType === 'workout' ? '#fff' : tokens.colors.text.secondary}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === 'workout' && styles.typeButtonTextActive,
                ]}
              >
                Workout
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === 'weight' && styles.typeButtonActive,
              ]}
              onPress={() => handleTypeSelect('weight')}
            >
              <Ionicons
                name="scale"
                size={24}
                color={selectedType === 'weight' ? '#fff' : tokens.colors.text.secondary}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === 'weight' && styles.typeButtonTextActive,
                ]}
              >
                Weight
              </Text>
            </TouchableOpacity>
          </View>

          {/* AI Input (not shown for weight) */}
          {selectedType !== 'weight' && (
            <View style={styles.inputSection}>
              <View style={styles.inputContainer}>
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  placeholder={placeholders[selectedType]}
                  placeholderTextColor={tokens.colors.text.tertiary}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={500}
                  autoCapitalize="sentences"
                  returnKeyType="done"
                  blurOnSubmit
                />
                <Text style={styles.charCount}>{inputText.length}/500</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!inputText.trim() || isParsing) && styles.submitButtonDisabled,
                ]}
                onPress={() => handleSubmit()}
                disabled={!inputText.trim() || isParsing}
              >
                {isParsing ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="sparkles" size={20} color="#fff" />
                    <Text style={styles.submitButtonText}>Log It</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Manual Entry Link */}
              <TouchableOpacity
                style={styles.manualEntryLink}
                onPress={() =>
                  navigation.navigate(
                    selectedType === 'meal' ? 'ManualMealEntry' : 'ManualWorkoutEntry'
                  )
                }
              >
                <Text style={styles.manualEntryText}>
                  Prefer manual entry?
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Recent Entries */}
          {selectedType !== 'weight' && recentEntries && recentEntries.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={styles.recentTitle}>Recent</Text>
              {recentEntries.map((entry) => (
                <View key={entry.id} style={styles.recentItem}>
                  <TouchableOpacity
                    style={styles.recentItemTouchable}
                    onPress={() => handleQuickLog(entry)}
                  >
                    <Ionicons
                      name={entry.type === 'meal' ? 'restaurant-outline' : 'fitness-outline'}
                      size={20}
                      color={tokens.colors.text.secondary}
                    />
                    <View style={styles.recentItemContent}>
                      <Text style={styles.recentItemName} numberOfLines={1}>
                        {entry.type === 'meal'
                          ? (entry.meal as any)?.items?.[0]?.name || 'Meal'
                          : (entry.workout as any)?.name || 'Workout'}
                      </Text>
                      <Text style={styles.recentItemMeta}>
                        {entry.type === 'meal'
                          ? `${(entry.meal as any)?.totalCalories || 0} cal`
                          : `${(entry.workout as any)?.durationMinutes || 0} min`}
                      </Text>
                    </View>
                    <Ionicons
                      name="add-circle-outline"
                      size={24}
                      color={tokens.colors.primary.teal}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.recentDeleteButton}
                    onPress={() => handleDeleteRecent(entry.id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color="#EF4444"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>Tips</Text>
            {selectedType === 'meal' && (
              <>
                <Text style={styles.tipText}>
                  "8oz grilled chicken with 1 cup rice"
                </Text>
                <Text style={styles.tipText}>
                  "chipotle burrito bowl with double chicken"
                </Text>
                <Text style={styles.tipText}>
                  "2 eggs, toast with butter, orange juice"
                </Text>
              </>
            )}
            {selectedType === 'workout' && (
              <>
                <Text style={styles.tipText}>
                  "30 minute run at moderate pace"
                </Text>
                <Text style={styles.tipText}>
                  "chest and triceps workout for 45 min"
                </Text>
                <Text style={styles.tipText}>
                  "20 min HIIT session"
                </Text>
              </>
            )}
            {selectedType === 'weight' && (
              <Text style={styles.tipText}>
                Tap the Weight button above to log your weight
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Follow-Up Question Modal */}
      <FollowUpModal
        visible={followUp.visible}
        type={followUp.type}
        question={followUp.question}
        isLoading={followUp.isLoading}
        quickOptions={followUp.quickOptions}
        onAnswer={handleFollowUpAnswer}
        onSkip={handleFollowUpSkip}
        onCancel={handleFollowUpCancel}
      />
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
    backgroundColor: tokens.colors.background.offWhite,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    padding: tokens.spacing.xl,
    paddingBottom: tokens.spacing.lg,
    backgroundColor: tokens.colors.background.white,
  },
  title: {
    ...tokens.typography.display.l,
    color: tokens.colors.text.primary,
  },
  subtitle: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    marginTop: tokens.spacing.xs,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.background.white,
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
    gap: tokens.spacing.sm,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.md,
    borderRadius: 12,
    backgroundColor: tokens.colors.background.offWhite,
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
  inputSection: {
    padding: tokens.spacing.xl,
  },
  inputContainer: {
    backgroundColor: tokens.colors.background.white,
    borderRadius: 16,
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.primary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    ...tokens.typography.body.xs,
    color: tokens.colors.text.tertiary,
    textAlign: 'right',
    marginTop: tokens.spacing.sm,
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
  manualEntryLink: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
  },
  manualEntryText: {
    ...tokens.typography.body.s,
    color: tokens.colors.primary.teal,
  },
  recentSection: {
    paddingHorizontal: tokens.spacing.xl,
    marginBottom: tokens.spacing.xl,
  },
  recentTitle: {
    ...tokens.typography.heading.h3,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.md,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.background.white,
    borderRadius: 12,
    marginBottom: tokens.spacing.sm,
  },
  recentItemTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.md,
    gap: tokens.spacing.md,
  },
  recentItemContent: {
    flex: 1,
  },
  recentDeleteButton: {
    padding: tokens.spacing.md,
    paddingLeft: tokens.spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: tokens.colors.border.light,
  },
  recentItemName: {
    ...tokens.typography.body.m,
    fontWeight: '500',
    color: tokens.colors.text.primary,
  },
  recentItemMeta: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
  },
  tipsSection: {
    paddingHorizontal: tokens.spacing.xl,
  },
  tipsTitle: {
    ...tokens.typography.heading.h3,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.md,
  },
  tipText: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: tokens.spacing.sm,
    paddingLeft: tokens.spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: tokens.colors.primary.teal + '40',
  },
});
