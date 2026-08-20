/**
 * Progress Screen
 * Phase 3: Placeholder - Weight graph, weekly summaries, streaks, and achievements
 * Will be implemented in Phase 7 (Q3.3 Progress Tab)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainTabScreenProps } from '../../types/navigation.types';
import tokens from '../../theme/tokens';

type Props = MainTabScreenProps<'Progress'>;

export default function ProgressScreen({ navigation: _navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.comingSoonBanner}>
          <Text style={styles.bannerText}>Coming in Phase 7</Text>
        </View>
        <Text style={styles.title}>Progress</Text>
        <Text style={styles.subtitle}>Track your journey</Text>
        <Text style={styles.description}>
          • Weight graph with trend line{'\n'}
          • Weekly & monthly summaries{'\n'}
          • Streak system (90-day calendar){'\n'}
          • Achievements & badges
        </Text>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing['3xl'],
    paddingBottom: 100, // Account for tab bar
  },
  comingSoonBanner: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.sm,
    borderRadius: 8,
    marginBottom: tokens.spacing.xl,
  },
  bannerText: {
    ...tokens.typography.body.s,
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#856404',
  },
  title: {
    ...tokens.typography.display.l,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.md,
  },
  subtitle: {
    ...tokens.typography.heading.h2,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.xl,
    textAlign: 'center',
  },
  description: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
