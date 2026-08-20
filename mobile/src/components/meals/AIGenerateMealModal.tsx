/**
 * AI Generate Meal Modal
 * Shows loading state while generating, then displays 3 AI alternatives
 * Per Q3.3 spec lines 507-599
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useQueryClient } from '@tanstack/react-query';
import { useGenerateMealAlternatives, useReplaceWithAIAlternative, MealAlternative } from '../../hooks/useGenerateMealAlternatives';
import { useToast } from '../common/Toast';
import tokens from '../../theme/tokens';

interface AIGenerateMealModalProps {
  visible: boolean;
  onClose: () => void;
  mealId: string;
  onSwapComplete: (message: string) => void;
}

export default function AIGenerateMealModal({
  visible,
  onClose,
  mealId,
  onSwapComplete,
}: AIGenerateMealModalProps) {
  const queryClient = useQueryClient();
  const generateMutation = useGenerateMealAlternatives();
  const replaceMutation = useReplaceWithAIAlternative();
  const { showToast } = useToast();
  const [regenerationCount, setRegenerationCount] = React.useState(0);

  // Trigger generation when modal becomes visible
  useEffect(() => {
    if (visible && !generateMutation.data && !generateMutation.isPending) {
      generateMutation.mutate(mealId);
    }
  }, [visible, mealId]);

  // Reset regeneration count when modal closes
  useEffect(() => {
    if (!visible) {
      setRegenerationCount(0);
    }
  }, [visible]);

  const handleSelectAlternative = async (alternative: MealAlternative) => {
    try {
      // Call the API to replace the meal
      await replaceMutation.mutateAsync({ mealId, alternative });

      // Invalidate relevant queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['mealDetail', mealId] });
      queryClient.invalidateQueries({ queryKey: ['dailyMeals'] });
      queryClient.invalidateQueries({ queryKey: ['weeklyMeals'] });
      queryClient.invalidateQueries({ queryKey: ['dailyProgress'] });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast(`Replaced with ${alternative.name}`, 'success');

      onClose();
      onSwapComplete(`Successfully replaced with ${alternative.name}`);
    } catch (error) {
      console.error('Error replacing meal:', error);
      showToast('Failed to replace meal', 'error');
    }
  };

  const handleGenerateMore = () => {
    if (regenerationCount >= 2) {
      showToast('Maximum regenerations reached', 'error');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRegenerationCount((prev) => prev + 1);
    generateMutation.mutate(mealId);
  };

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FFB347" />
      <Text style={styles.loadingTitle}>Generating alternatives...</Text>
      <Text style={styles.loadingSubtitle}>This usually takes 3-5 seconds</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
      <Text style={styles.errorTitle}>Generation Failed</Text>
      <Text style={styles.errorText}>{generateMutation.error?.message || 'Unknown error'}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => generateMutation.mutate(mealId)}
      >
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderResults = () => {
    const { data } = generateMutation;
    if (!data) return null;

    return (
      <>
        {/* Original Meal Reference */}
        {data.originalMeal && (
          <View style={styles.originalMeal}>
            <Text style={styles.originalLabel}>Replacing:</Text>
            <Text style={styles.originalName}>{data.originalMeal.name}</Text>
            <Text style={styles.originalDetails}>
              {data.originalMeal.calories} cal • {data.originalMeal.protein}g P • {data.originalMeal.carbs}g C • {data.originalMeal.fat}g F
            </Text>
          </View>
        )}

        <ScrollView style={styles.alternativesList} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Choose an alternative:</Text>

          {data.alternatives.map((alternative, index) => (
            <TouchableOpacity
              key={index}
              style={styles.alternativeCard}
              onPress={() => handleSelectAlternative(alternative)}
              activeOpacity={0.7}
            >
              <View style={styles.alternativeContent}>
                <Text style={styles.alternativeName}>{alternative.name}</Text>
                {alternative.description && (
                  <Text style={styles.alternativeDescription} numberOfLines={2}>
                    {alternative.description}
                  </Text>
                )}
                <View style={styles.alternativeMacros}>
                  <Text style={styles.alternativeCalories}>{alternative.calories} cal</Text>
                  <Text style={styles.macroText}>
                    {alternative.protein}g P • {alternative.carbs}g C • {alternative.fat}g F
                  </Text>
                </View>
                {(alternative.prepTimeMin || alternative.cookTimeMin) && (
                  <Text style={styles.timeText}>
                    {alternative.prepTimeMin ? `Prep: ${alternative.prepTimeMin} min` : ''}
                    {alternative.prepTimeMin && alternative.cookTimeMin ? ' • ' : ''}
                    {alternative.cookTimeMin ? `Cook: ${alternative.cookTimeMin} min` : ''}
                  </Text>
                )}
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={tokens.colors.text.secondary}
              />
            </TouchableOpacity>
          ))}

        </ScrollView>

        {/* Generate More Button */}
        <View style={styles.generateMoreContainer}>
          <TouchableOpacity
            style={[
              styles.generateMoreButton,
              regenerationCount >= 2 && styles.generateMoreButtonDisabled,
            ]}
            onPress={handleGenerateMore}
            disabled={regenerationCount >= 2}
            activeOpacity={0.7}
          >
            <Ionicons
              name="sparkles"
              size={20}
              color={regenerationCount >= 2 ? tokens.colors.text.secondary : '#FFB347'}
            />
            <Text
              style={[
                styles.generateMoreText,
                regenerationCount >= 2 && styles.generateMoreTextDisabled,
              ]}
            >
              Generate More ({2 - regenerationCount} left)
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={tokens.colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>
              {generateMutation.isPending ? 'Generating...' : 'Select Alternative'}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          {generateMutation.isPending && renderLoading()}
          {generateMutation.isError && renderError()}
          {generateMutation.isSuccess && renderResults()}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: tokens.colors.background.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.borders.light,
  },
  closeButton: {
    padding: tokens.spacing.xs,
  },
  title: {
    ...tokens.typography.heading.h2,
    fontSize: 20,
    color: tokens.colors.text.primary,
  },
  placeholder: {
    width: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
    gap: tokens.spacing.md,
  },
  loadingTitle: {
    ...tokens.typography.heading.h2,
    fontSize: 18,
    fontWeight: '600' as const,
    color: tokens.colors.text.primary,
  },
  loadingSubtitle: {
    ...tokens.typography.body.s,
    fontSize: 14,
    color: tokens.colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
    gap: tokens.spacing.md,
  },
  errorTitle: {
    ...tokens.typography.heading.h2,
    fontSize: 18,
    color: tokens.colors.text.primary,
  },
  errorText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FFB347',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: tokens.spacing.md,
  },
  retryButtonText: {
    ...tokens.typography.body.m,
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  originalMeal: {
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.background.offWhite,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.borders.light,
  },
  originalLabel: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
    marginBottom: 4,
  },
  originalName: {
    ...tokens.typography.heading.h2,
    fontSize: 16,
    color: tokens.colors.text.primary,
    marginBottom: 4,
  },
  originalDetails: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
  },
  alternativesList: {
    flex: 1,
    padding: tokens.spacing.lg,
  },
  sectionTitle: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.md,
  },
  alternativeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.background.white,
    borderRadius: 12,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.borders.light,
  },
  alternativeContent: {
    flex: 1,
  },
  alternativeName: {
    ...tokens.typography.body.l,
    fontWeight: '600' as const,
    color: tokens.colors.text.primary,
    marginBottom: 4,
  },
  alternativeDescription: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
    marginBottom: 8,
  },
  alternativeMacros: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    marginBottom: 4,
  },
  alternativeCalories: {
    ...tokens.typography.body.m,
    fontWeight: '600' as const,
    color: tokens.colors.text.primary,
  },
  macroText: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
  },
  timeText: {
    ...tokens.typography.body.s,
    fontSize: 12,
    color: tokens.colors.text.secondary,
  },
  generateMoreContainer: {
    padding: tokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.borders.light,
    backgroundColor: tokens.colors.background.white,
  },
  generateMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFB347',
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
  },
  generateMoreButtonDisabled: {
    borderColor: tokens.colors.borders.divider,
    backgroundColor: tokens.colors.background.offWhite,
  },
  generateMoreText: {
    ...tokens.typography.body.m,
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFB347',
  },
  generateMoreTextDisabled: {
    color: tokens.colors.text.secondary,
  },
});
