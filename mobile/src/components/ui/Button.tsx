/**
 * Button Component
 * Primary and secondary buttons with glassmorphism effects
 * Based on DESIGN_SYSTEM.md specifications
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import tokens from '../../theme/tokens';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'large' | 'medium' | 'small';
export type ButtonContext = 'nutrition' | 'workout' | 'progress' | 'lightBlue';

export interface ButtonProps {
  // Content
  title: string;
  onPress: () => void;

  // Style
  variant?: ButtonVariant;
  size?: ButtonSize;
  context?: ButtonContext;
  fullWidth?: boolean;
  gradientColors?: readonly [string, string]; // Custom gradient colors override

  // State
  disabled?: boolean;
  loading?: boolean;

  // Custom styles
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  context = 'nutrition',
  fullWidth = false,
  gradientColors: customGradientColors,
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  // Get gradient colors based on context (only for primary buttons)
  const getGradientColors = (): readonly [string, string] => {
    // Use custom gradient colors if provided
    if (customGradientColors) {
      return customGradientColors;
    }

    switch (context) {
      case 'nutrition':
        return tokens.gradients.nutritionButton;
      case 'workout':
        return tokens.gradients.workoutButton;
      case 'progress':
        return tokens.gradients.progressFill;
      case 'lightBlue':
        return tokens.gradients.lightBlueButton;
      default:
        return tokens.gradients.nutritionButton;
    }
  };

  // Get button height based on size
  const getHeight = () => {
    switch (size) {
      case 'large':
        return tokens.sizes.button.large;
      case 'medium':
        return tokens.sizes.button.medium;
      case 'small':
        return tokens.sizes.button.small;
      default:
        return tokens.sizes.button.large;
    }
  };

  // Get font size based on size
  const getFontSize = () => {
    switch (size) {
      case 'large':
        return tokens.typography.button.l;
      case 'medium':
        return tokens.typography.button.m;
      case 'small':
        return tokens.typography.button.s;
      default:
        return tokens.typography.button.l;
    }
  };

  const buttonStyle: ViewStyle = {
    height: getHeight(),
    borderRadius: tokens.borderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing['2xl'],
    width: fullWidth ? '100%' : 'auto',
    ...tokens.shadows.button,
    opacity: isDisabled ? 0.4 : 1,
  };

  const textStyles: TextStyle = {
    ...getFontSize(),
    color: variant === 'primary' ? tokens.colors.text.white : tokens.colors.workout.navy,
    ...textStyle,
  };

  // Primary button with gradient
  if (variant === 'primary') {
    const gradientColors = getGradientColors();

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[buttonStyle, style]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          {loading ? (
            <ActivityIndicator color={tokens.colors.text.white} />
          ) : (
            <Text style={textStyles}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Secondary button with glassmorphism
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        buttonStyle,
        {
          backgroundColor: tokens.colors.background.frostedGlass,
          borderWidth: 1,
          borderColor: tokens.colors.borders.light,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={tokens.colors.workout.navy} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    width: '100%',
    borderRadius: tokens.borderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
