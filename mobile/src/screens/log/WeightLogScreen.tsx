/**
 * Weight Log Screen
 * Phase 6: Q3.2 AI-Powered Logging
 *
 * Simple weight logging with trend display
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LogStackParamList } from '../../types/navigation.types';
import {
  useCreateLoggedEntry,
  useWeightHistory,
  useRecentEntries,
  useDeleteLoggedEntry,
  formatWeightChange,
} from '../../hooks/useLogging';
import { useToast } from '../../components/common/Toast';
import tokens from '../../theme/tokens';

type NavigationProp = NativeStackNavigationProp<LogStackParamList, 'WeightLog'>;

export default function WeightLogScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { showToast } = useToast();

  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'lbs' | 'kg'>('lbs');

  const createEntryMutation = useCreateLoggedEntry();
  const deleteLoggedEntryMutation = useDeleteLoggedEntry();
  const { data: weightHistory } = useWeightHistory(30);
  const { data: recentWeights } = useRecentEntries('weight', 5);

  const previousWeight = weightHistory?.previousWeight;

  const handleDeleteRecent = (entryId: string) => {
    deleteLoggedEntryMutation.mutate(entryId, {
      onSuccess: () => {
        showToast('Weight entry deleted', 'success');
      },
      onError: () => {
        showToast('Failed to delete entry', 'error');
      },
    });
  };

  const formatRecentDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSubmit = async () => {
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      showToast('Please enter a valid weight', 'error');
      return;
    }

    // Convert to lbs for storage
    const weightLbs = unit === 'kg' ? weightValue * 2.20462 : weightValue;

    try {
      await createEntryMutation.mutateAsync({
        type: 'weight',
        date: new Date().toISOString(),
        weight: {
          weightLbs: Math.round(weightLbs * 10) / 10,
          originalValue: weightValue,
          originalUnit: unit,
        },
      });

      showToast('Weight logged!', 'success');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to log weight:', error);
      showToast('Failed to log weight', 'error');
    }
  };

  const weightValue = parseFloat(weight) || 0;
  const weightInLbs = unit === 'kg' ? weightValue * 2.20462 : weightValue;
  const change = weightInLbs > 0 ? formatWeightChange(weightInLbs, previousWeight) : null;

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              {/* Weight Input */}
              <View style={styles.inputSection}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.weightInput}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="decimal-pad"
                    placeholder="0.0"
                    placeholderTextColor={tokens.colors.text.tertiary}
                    autoFocus
                    maxLength={6}
                    returnKeyType="done"
                    onSubmitEditing={dismissKeyboard}
                  />
              <View style={styles.unitToggle}>
                <TouchableOpacity
                  style={[styles.unitButton, unit === 'lbs' && styles.unitButtonActive]}
                  onPress={() => setUnit('lbs')}
                >
                  <Text
                    style={[
                      styles.unitButtonText,
                      unit === 'lbs' && styles.unitButtonTextActive,
                    ]}
                  >
                    lbs
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.unitButton, unit === 'kg' && styles.unitButtonActive]}
                  onPress={() => setUnit('kg')}
                >
                  <Text
                    style={[
                      styles.unitButtonText,
                      unit === 'kg' && styles.unitButtonTextActive,
                    ]}
                  >
                    kg
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Trend Display */}
            {change && (
              <View
                style={[
                  styles.trendBadge,
                  {
                    backgroundColor:
                      change.direction === 'up'
                        ? '#FEE2E2'
                        : change.direction === 'down'
                        ? '#D1FAE5'
                        : '#F3F4F6',
                  },
                ]}
              >
                <Ionicons
                  name={
                    change.direction === 'up'
                      ? 'arrow-up'
                      : change.direction === 'down'
                      ? 'arrow-down'
                      : 'remove'
                  }
                  size={16}
                  color={
                    change.direction === 'up'
                      ? '#EF4444'
                      : change.direction === 'down'
                      ? '#10B981'
                      : tokens.colors.text.secondary
                  }
                />
                <Text
                  style={[
                    styles.trendText,
                    {
                      color:
                        change.direction === 'up'
                          ? '#EF4444'
                          : change.direction === 'down'
                          ? '#10B981'
                          : tokens.colors.text.secondary,
                    },
                  ]}
                >
                  {change.text}
                </Text>
              </View>
            )}

            {/* Previous Weight */}
            {previousWeight && (
              <Text style={styles.previousWeight}>
                Last weigh-in: {previousWeight.toFixed(1)} lbs
              </Text>
            )}
          </View>

          {/* Trend Summary */}
          {weightHistory?.trend && (
            <View style={styles.trendSummary}>
              <Text style={styles.trendSummaryTitle}>30-Day Trend</Text>
              <View style={styles.trendSummaryContent}>
                <Ionicons
                  name={
                    weightHistory.trend.direction === 'up'
                      ? 'trending-up'
                      : weightHistory.trend.direction === 'down'
                      ? 'trending-down'
                      : 'remove'
                  }
                  size={24}
                  color={
                    weightHistory.trend.direction === 'up'
                      ? '#EF4444'
                      : weightHistory.trend.direction === 'down'
                      ? '#10B981'
                      : tokens.colors.text.secondary
                  }
                />
                <Text style={styles.trendSummaryText}>
                  {weightHistory.trend.direction === 'stable'
                    ? 'Stable weight'
                    : `${weightHistory.trend.direction === 'down' ? '-' : '+'}${
                        isNaN(weightHistory.trend.amount) ? '0' : weightHistory.trend.amount.toFixed(1)
                      } lbs`}
                </Text>
              </View>
            </View>
          )}

          {/* Recent Weight Entries */}
          {recentWeights && recentWeights.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={styles.recentTitle}>Recent</Text>
              {recentWeights.map((entry) => {
                const weightData = entry.weight as any;
                return (
                  <View key={entry.id} style={styles.recentItem}>
                    <View style={styles.recentItemContent}>
                      <Ionicons
                        name="scale-outline"
                        size={20}
                        color={tokens.colors.text.secondary}
                      />
                      <View style={styles.recentItemInfo}>
                        <Text style={styles.recentItemWeight}>
                          {weightData?.originalValue?.toFixed(1)} {weightData?.originalUnit || 'lbs'}
                        </Text>
                        <Text style={styles.recentItemDate}>
                          {formatRecentDate(entry.loggedAt)}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.recentDeleteButton}
                      onPress={() => handleDeleteRecent(entry.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          {/* Submit Button - Inside scrollable area */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!weight || createEntryMutation.isPending) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!weight || createEntryMutation.isPending}
            >
              {createEntryMutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>Log Weight</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </TouchableWithoutFeedback>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: tokens.spacing.xl,
    justifyContent: 'center',
  },
  inputSection: {
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  weightInput: {
    fontSize: 64,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    minWidth: 150,
    textAlign: 'center',
  },
  unitToggle: {
    flexDirection: 'column',
    gap: tokens.spacing.xs,
  },
  unitButton: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: 8,
    backgroundColor: tokens.colors.background.white,
  },
  unitButtonActive: {
    backgroundColor: tokens.colors.primary.teal,
  },
  unitButtonText: {
    ...tokens.typography.body.m,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
  },
  unitButtonTextActive: {
    color: '#fff',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: 20,
    marginTop: tokens.spacing.lg,
    gap: tokens.spacing.xs,
  },
  trendText: {
    ...tokens.typography.body.s,
    fontWeight: '600',
  },
  previousWeight: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    marginTop: tokens.spacing.lg,
  },
  trendSummary: {
    backgroundColor: tokens.colors.background.white,
    borderRadius: 12,
    padding: tokens.spacing.lg,
    marginTop: tokens.spacing['2xl'],
  },
  trendSummaryTitle: {
    ...tokens.typography.body.s,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.sm,
  },
  trendSummaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  trendSummaryText: {
    ...tokens.typography.heading.h3,
    color: tokens.colors.text.primary,
  },
  footer: {
    padding: tokens.spacing.xl,
    paddingTop: tokens.spacing['2xl'],
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
  recentSection: {
    marginTop: tokens.spacing['2xl'],
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.background.white,
    borderRadius: 12,
  },
  recentTitle: {
    ...tokens.typography.heading.h3,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.md,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border.light,
  },
  recentItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    flex: 1,
  },
  recentItemInfo: {
    flex: 1,
  },
  recentItemWeight: {
    ...tokens.typography.body.m,
    fontWeight: '600',
    color: tokens.colors.text.primary,
  },
  recentItemDate: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
  },
  recentDeleteButton: {
    padding: tokens.spacing.sm,
  },
});
