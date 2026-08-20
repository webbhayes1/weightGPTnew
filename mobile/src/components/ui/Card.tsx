/**
 * Card Component
 * Glassmorphism card with frosted glass effect
 * Based on DESIGN_SYSTEM.md specifications
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import tokens from '../../theme/tokens';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof tokens.spacing;
  noPadding?: boolean;
}

export default function Card({
  children,
  style,
  padding = 'lg',
  noPadding = false,
}: CardProps) {
  const cardStyle: ViewStyle = {
    backgroundColor: tokens.colors.background.frostedGlass,
    borderRadius: tokens.borderRadius.rounded,
    borderWidth: 1,
    borderColor: tokens.colors.borders.glass,
    padding: noPadding ? 0 : tokens.spacing[padding],
    ...tokens.shadows.card,
  };

  return <View style={[styles.card, cardStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    // Base card styles
    overflow: 'hidden',
  },
});
