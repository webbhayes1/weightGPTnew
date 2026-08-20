/**
 * Dual-Mode Toggle Component
 * Phase 3: Q3.0 App Shell - Home Tab
 * Pill-shaped toggle: Nutrition ⟷ Workout
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useUIStore } from '../../store/uiStore';
import tokens from '../../theme/tokens';

export default function DualModeToggle() {
  const { isDualModeNutrition, toggleDualMode } = useUIStore();

  // Animated style for the sliding background
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(isDualModeNutrition ? 0 : 160, {
            duration: 300,
          }),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        {/* Sliding background indicator */}
        <Animated.View style={[styles.activeBackground, animatedBackgroundStyle]} />

        {/* Nutrition button */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => {
            if (!isDualModeNutrition) toggleDualMode();
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              isDualModeNutrition && styles.activeText,
            ]}
          >
            Nutrition
          </Text>
        </TouchableOpacity>

        {/* Workout button */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => {
            if (isDualModeNutrition) toggleDualMode();
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              !isDualModeNutrition && styles.activeText,
            ]}
          >
            Workout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.lg,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: 28,
    height: 56,
    position: 'relative',
    padding: 4,
  },
  activeBackground: {
    position: 'absolute',
    left: 4,
    top: 4,
    bottom: 4,
    width: 156, // Half width minus padding
    backgroundColor: '#FFB347', // Amber per Q3.0 spec
    borderRadius: 24,
    ...tokens.shadows.button,
  },
  toggleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  toggleText: {
    ...tokens.typography.body.m,
    fontSize: 16,
    fontWeight: '600' as const,
    color: tokens.colors.text.secondary,
  },
  activeText: {
    color: tokens.colors.text.primary,
    fontWeight: '700' as const,
  },
});
