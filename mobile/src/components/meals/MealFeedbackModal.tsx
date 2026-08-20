/**
 * Meal Feedback Modal
 * Bottom sheet modal for rating a meal with thumbs up/down and optional comments
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useMealFeedback, FeedbackRequest } from '../../hooks/useMealFeedback';
import { useToast } from '../common/Toast';
import tokens from '../../theme/tokens';

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

interface MealFeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  mealId: string;
  mealName: string;
  ingredients: Ingredient[];
  onFeedbackComplete: () => void;
}

type FeedbackStep = 'rating' | 'followup';

export default function MealFeedbackModal({
  visible,
  onClose,
  mealId,
  mealName,
  ingredients,
  onFeedbackComplete,
}: MealFeedbackModalProps) {
  const [step, setStep] = useState<FeedbackStep>('rating');
  const [rating, setRating] = useState<1 | -1 | null>(null);
  const [comment, setComment] = useState('');
  const [dislikedIngredients, setDislikedIngredients] = useState<string[]>([]);

  const feedbackMutation = useMealFeedback();
  const { showToast } = useToast();

  const handleRatingSelect = (selectedRating: 1 | -1) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRating(selectedRating);
    setStep('followup');
  };

  const toggleIngredient = (ingredientId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDislikedIngredients(prev =>
      prev.includes(ingredientId)
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const handleSubmit = async () => {
    if (!rating) return;

    try {
      const feedback: FeedbackRequest = {
        rating,
        comment: comment.trim() || undefined,
        dislikedIngredients: rating === -1 && dislikedIngredients.length > 0
          ? dislikedIngredients
          : undefined,
      };

      await feedbackMutation.mutateAsync({ mealId, feedback });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast(
        rating === 1 ? 'Thanks for your feedback!' : 'Feedback saved',
        'success'
      );

      handleClose();
      onFeedbackComplete();
    } catch (error) {
      console.error('Feedback failed:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showToast('Failed to save feedback', 'error');
    }
  };

  const handleClose = () => {
    // Reset state
    setStep('rating');
    setRating(null);
    setComment('');
    setDislikedIngredients([]);
    onClose();
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep('rating');
    setComment('');
    setDislikedIngredients([]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            {step === 'followup' ? (
              <TouchableOpacity onPress={handleBack} style={styles.closeButton}>
                <Ionicons name="arrow-back" size={24} color={tokens.colors.text.primary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={tokens.colors.text.primary} />
              </TouchableOpacity>
            )}
            <Text style={styles.title}>
              {step === 'rating' ? 'Rate This Meal' : rating === 1 ? 'Great!' : 'Tell Us More'}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Meal Name */}
          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>{mealName}</Text>
          </View>

          <View style={styles.divider} />

          {/* Content based on step */}
          {step === 'rating' ? (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingPrompt}>How was this meal?</Text>
              <View style={styles.ratingButtons}>
                <TouchableOpacity
                  style={styles.ratingButton}
                  onPress={() => handleRatingSelect(1)}
                >
                  <View style={[styles.ratingIcon, styles.thumbsUpIcon]}>
                    <Ionicons name="thumbs-up" size={32} color="#fff" />
                  </View>
                  <Text style={styles.ratingLabel}>Loved it</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.ratingButton}
                  onPress={() => handleRatingSelect(-1)}
                >
                  <View style={[styles.ratingIcon, styles.thumbsDownIcon]}>
                    <Ionicons name="thumbs-down" size={32} color="#fff" />
                  </View>
                  <Text style={styles.ratingLabel}>Not for me</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <ScrollView style={styles.followupContainer} showsVerticalScrollIndicator={false}>
              {rating === 1 ? (
                /* Thumbs Up Follow-up */
                <View style={styles.followupContent}>
                  <Text style={styles.followupPrompt}>
                    What did you like about it? (optional)
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="E.g., Great flavor, easy to make..."
                    placeholderTextColor={tokens.colors.text.tertiary}
                    value={comment}
                    onChangeText={setComment}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              ) : (
                /* Thumbs Down Follow-up */
                <View style={styles.followupContent}>
                  <Text style={styles.followupPrompt}>
                    What didn't you like?
                  </Text>

                  {/* Ingredient checkboxes */}
                  {ingredients.length > 0 && (
                    <View style={styles.ingredientsSection}>
                      <Text style={styles.ingredientsLabel}>
                        Any ingredients you want to avoid?
                      </Text>
                      {ingredients.map((ingredient) => (
                        <TouchableOpacity
                          key={ingredient.id}
                          style={styles.ingredientRow}
                          onPress={() => toggleIngredient(ingredient.id)}
                        >
                          <View style={[
                            styles.checkbox,
                            dislikedIngredients.includes(ingredient.id) && styles.checkboxChecked
                          ]}>
                            {dislikedIngredients.includes(ingredient.id) && (
                              <Ionicons name="checkmark" size={14} color="#fff" />
                            )}
                          </View>
                          <Text style={styles.ingredientName}>{ingredient.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <Text style={styles.commentLabel}>Additional comments (optional)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="E.g., Too spicy, took too long..."
                    placeholderTextColor={tokens.colors.text.tertiary}
                    value={comment}
                    onChangeText={setComment}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              )}

              <View style={styles.bottomSpacer} />
            </ScrollView>
          )}

          {/* Submit Button (only on follow-up step) */}
          {step === 'followup' && (
            <View style={styles.submitContainer}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  feedbackMutation.isPending && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={feedbackMutation.isPending}
              >
                {feedbackMutation.isPending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.submitButtonText}>Submit Feedback</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
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
    minHeight: '40%',
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
  mealInfo: {
    padding: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.md,
    backgroundColor: tokens.colors.background.offWhite,
  },
  mealName: {
    ...tokens.typography.heading.h2,
    fontSize: 18,
    color: tokens.colors.text.primary,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: tokens.colors.borders.light,
  },
  ratingContainer: {
    padding: tokens.spacing.xl,
    alignItems: 'center',
  },
  ratingPrompt: {
    ...tokens.typography.body.l,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xl,
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: tokens.spacing.xl,
  },
  ratingButton: {
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  ratingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbsUpIcon: {
    backgroundColor: '#22C55E',
  },
  thumbsDownIcon: {
    backgroundColor: '#EF4444',
  },
  ratingLabel: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.primary,
    fontWeight: '600' as const,
  },
  followupContainer: {
    flex: 1,
  },
  followupContent: {
    padding: tokens.spacing.lg,
  },
  followupPrompt: {
    ...tokens.typography.body.l,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.md,
  },
  textInput: {
    ...tokens.typography.body.m,
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: 12,
    padding: tokens.spacing.md,
    minHeight: 100,
    color: tokens.colors.text.primary,
    borderWidth: 1,
    borderColor: tokens.colors.borders.light,
  },
  ingredientsSection: {
    marginBottom: tokens.spacing.lg,
  },
  ingredientsLabel: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.md,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
    gap: tokens.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: tokens.colors.borders.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  ingredientName: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.primary,
    flex: 1,
  },
  commentLabel: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.sm,
  },
  bottomSpacer: {
    height: tokens.spacing.xl,
  },
  submitContainer: {
    padding: tokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.borders.light,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: tokens.colors.nutrition.blue,
    paddingVertical: tokens.spacing.md,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    ...tokens.typography.body.m,
    fontWeight: '600' as const,
    color: '#fff',
  },
});
