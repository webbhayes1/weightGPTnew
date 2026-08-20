/**
 * Follow-Up Question Modal
 * Phase 6: Q3.2 AI-Powered Logging
 *
 * Shows follow-up questions when AI needs clarification
 * Always shows a text input for flexible responses
 * Supports loading state and smooth slide transitions
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tokens from '../../theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type FollowUpType = 'portion' | 'preparation' | 'restaurant' | 'confirmation' | 'intensity' | 'duration' | 'exercises' | 'brand' | 'specification' | 'quantity';

interface FollowUpModalProps {
  visible: boolean;
  type: FollowUpType;
  question: string;
  isLoading?: boolean;
  quickOptions?: string[] | null; // AI-provided quick options
  onAnswer: (answer: string) => void;
  onSkip: () => void;
  onCancel: () => void;
}

// Fallback quick suggestion chips for different follow-up types (used if AI doesn't provide options)
const FALLBACK_SUGGESTIONS: Record<FollowUpType, string[]> = {
  quantity: ['1', '2', '3', '4', '6', '8'],
  portion: ['Small', 'Medium', 'Large', '1 scoop', '2 scoops'],
  preparation: ['Grilled', 'Fried', 'Baked', 'Raw'],
  restaurant: ['Homemade', 'From a restaurant'],
  confirmation: [], // No suggestions for open-ended questions
  intensity: ['Light', 'Moderate', 'Hard'],
  duration: ['15 min', '30 min', '45 min', '1 hour'],
  exercises: ['Cardio', 'Strength', 'HIIT', 'Yoga'],
  brand: ['Homemade', 'Store brand', 'Premium brand'],
  specification: [],
};

export default function FollowUpModal({
  visible,
  type,
  question,
  isLoading = false,
  quickOptions,
  onAnswer,
  onSkip,
  onCancel,
}: FollowUpModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [previousQuestion, setPreviousQuestion] = useState(question);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Use AI-provided quickOptions if available, otherwise fall back to type-based suggestions
  const suggestions = (quickOptions && quickOptions.length > 0)
    ? quickOptions
    : (FALLBACK_SUGGESTIONS[type] || []);

  // Animate when question changes (new follow-up)
  useEffect(() => {
    if (question !== previousQuestion && question && !isLoading) {
      // Slide out old content, then slide in new
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -SCREEN_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_WIDTH,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      setPreviousQuestion(question);
    }
  }, [question, isLoading]);

  // Reset animation when modal opens
  useEffect(() => {
    if (visible) {
      slideAnim.setValue(0);
      fadeAnim.setValue(1);
    }
  }, [visible]);

  const handleSubmit = () => {
    if (inputValue.trim() && !isLoading) {
      onAnswer(inputValue.trim());
      setInputValue('');
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    if (!isLoading) {
      onAnswer(suggestion);
      setInputValue('');
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setInputValue('');
      onCancel();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
          disabled={isLoading}
        />
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.handle} />
          </View>

          {/* Loading State */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={tokens.colors.primary.teal} />
              <Text style={styles.loadingText}>Processing your answer...</Text>
            </View>
          ) : (
            <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
              {/* Question */}
              <View style={styles.questionSection}>
                <Ionicons
                  name="help-circle"
                  size={32}
                  color={tokens.colors.primary.teal}
                />
                <Text style={styles.questionText}>{question}</Text>
              </View>

              {/* Text Input */}
              <View style={styles.inputSection}>
                <TextInput
                  style={styles.textInput}
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder="Type your answer..."
                  placeholderTextColor={tokens.colors.text.tertiary}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  multiline={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!inputValue.trim() || isLoading) && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Quick Suggestions */}
              {suggestions.length > 0 && (
                <View style={styles.suggestionsSection}>
                  <Text style={styles.suggestionsLabel}>Quick options:</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.suggestionsContainer}
                  >
                    {suggestions.map((suggestion) => (
                      <TouchableOpacity
                        key={suggestion}
                        style={[
                          styles.suggestionChip,
                          isLoading && styles.suggestionChipDisabled,
                        ]}
                        onPress={() => handleSuggestionPress(suggestion)}
                        disabled={isLoading}
                      >
                        <Text style={styles.suggestionText}>{suggestion}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Skip Button */}
              <TouchableOpacity
                style={[styles.skipButton, isLoading && styles.skipButtonDisabled]}
                onPress={onSkip}
                disabled={isLoading}
              >
                <Text style={[styles.skipButtonText, isLoading && styles.skipButtonTextDisabled]}>
                  Skip - Use Best Guess
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: tokens.colors.background.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    minHeight: 320,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: tokens.colors.text.tertiary,
    borderRadius: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: tokens.spacing.lg,
  },
  loadingText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
  },
  questionSection: {
    alignItems: 'center',
    padding: tokens.spacing.xl,
    paddingTop: tokens.spacing.md,
    gap: tokens.spacing.md,
  },
  questionText: {
    ...tokens.typography.heading.h3,
    color: tokens.colors.text.primary,
    textAlign: 'center',
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
    gap: tokens.spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: tokens.colors.background.offWhite,
    padding: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: 24,
    ...tokens.typography.body.m,
    color: tokens.colors.text.primary,
  },
  submitButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: tokens.colors.primary.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: tokens.colors.text.tertiary,
  },
  suggestionsSection: {
    paddingTop: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.lg,
  },
  suggestionsLabel: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.sm,
  },
  suggestionsContainer: {
    gap: tokens.spacing.sm,
  },
  suggestionChip: {
    backgroundColor: tokens.colors.background.offWhite,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: 20,
    marginRight: tokens.spacing.sm,
  },
  suggestionChipDisabled: {
    opacity: 0.5,
  },
  suggestionText: {
    ...tokens.typography.body.s,
    fontWeight: '500',
    color: tokens.colors.text.primary,
  },
  skipButton: {
    marginHorizontal: tokens.spacing.lg,
    marginTop: tokens.spacing.xl,
    padding: tokens.spacing.md,
    alignItems: 'center',
  },
  skipButtonDisabled: {
    opacity: 0.5,
  },
  skipButtonText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
  },
  skipButtonTextDisabled: {
    color: tokens.colors.text.tertiary,
  },
});
