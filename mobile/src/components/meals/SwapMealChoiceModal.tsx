/**
 * Swap Meal Choice Modal
 * Initial modal that presents two swap options: Quick Swap or AI Generate
 * Per Q3.3 spec lines 327-390
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tokens from '../../theme/tokens';

interface SwapMealChoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onQuickSwap: () => void;
  onAIGenerate: () => void;
}

export default function SwapMealChoiceModal({
  visible,
  onClose,
  onQuickSwap,
  onAIGenerate,
}: SwapMealChoiceModalProps) {
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
            <Text style={styles.title}>Swap This Meal</Text>
            <Text style={styles.subtitle}>How would you like to swap?</Text>
          </View>

          {/* Option 1: Quick Swap */}
          <View style={styles.optionCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="swap-horizontal" size={24} color="#FFB347" />
            </View>
            <Text style={styles.optionTitle}>Quick Swap</Text>
            <Text style={styles.optionDescription}>
              Choose from other meals in this week's plan
            </Text>
            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={onQuickSwap}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FFD27D', '#FFB347']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Choose from Week</Text>
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Option 2: Generate New Meal */}
          <View style={styles.optionCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="sparkles" size={24} color="#FFB347" />
            </View>
            <Text style={styles.optionTitle}>Generate New Meal</Text>
            <Text style={styles.optionDescription}>
              AI creates alternatives with similar calories and macros
            </Text>
            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={onAIGenerate}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FFD27D', '#FFB347']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Generate Alternatives</Text>
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: tokens.colors.background.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.xl,
    paddingBottom: tokens.spacing['3xl'],
    minHeight: '50%',
  },
  header: {
    marginBottom: tokens.spacing.xl,
  },
  title: {
    ...tokens.typography.heading.h1,
    fontSize: 20,
    fontWeight: '700' as const,
    color: tokens.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    ...tokens.typography.body.m,
    fontSize: 16,
    color: '#6E6E73',
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 179, 71, 0.2)',
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
    // Frosted glass effect (iOS only, Android will show solid)
    ...Platform.select({
      ios: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
      },
    }),
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.sm,
  },
  optionTitle: {
    ...tokens.typography.heading.h2,
    fontSize: 18,
    fontWeight: '600' as const,
    color: tokens.colors.text.primary,
    marginBottom: 8,
  },
  optionDescription: {
    ...tokens.typography.body.s,
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: tokens.spacing.md,
    lineHeight: 20,
  },
  buttonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: tokens.spacing.lg,
    gap: 8,
  },
  buttonText: {
    ...tokens.typography.body.m,
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    marginTop: tokens.spacing.md,
  },
  cancelText: {
    ...tokens.typography.body.m,
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#6E6E73',
  },
});
