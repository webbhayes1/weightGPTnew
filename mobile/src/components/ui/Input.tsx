/**
 * Input Component
 * Text input with glassmorphism styling
 * Based on DESIGN_SYSTEM.md specifications
 */

import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import tokens from '../../theme/tokens';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
}

export default function Input({
  label,
  error,
  helperText,
  containerStyle,
  style,
  ...textInputProps
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = [
    styles.input,
    isFocused && styles.inputFocused,
    error && styles.inputError,
    style,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputWrapper}>
        <TextInput
          {...textInputProps}
          style={inputStyle}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          placeholderTextColor={tokens.colors.text.tertiary}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {!error && helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.md,
  },
  label: {
    ...tokens.typography.body.s,
    fontWeight: '600',
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.sm,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: tokens.colors.background.frostedGlass,
    borderWidth: 1,
    borderColor: tokens.colors.borders.light,
    borderRadius: tokens.borderRadius.sm,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    ...tokens.typography.body.m,
    color: tokens.colors.text.primary,
    minHeight: 48,
  },
  inputFocused: {
    borderColor: tokens.colors.nutrition.blue,
    borderWidth: 2,
  },
  inputError: {
    borderColor: tokens.colors.semantic.error,
    borderWidth: 2,
  },
  errorText: {
    ...tokens.typography.body.caption,
    color: tokens.colors.semantic.error,
    marginTop: tokens.spacing.xs,
  },
  helperText: {
    ...tokens.typography.body.caption,
    color: tokens.colors.text.secondary,
    marginTop: tokens.spacing.xs,
  },
});
