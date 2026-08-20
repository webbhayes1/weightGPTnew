/**
 * Nutrition Progress Circles Component
 * Phase 3: Q3.0 App Shell - Russian doll concentric circles
 * Spec: IMPLEMENTATION_PLAN.md lines 1344-1357
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useAnimatedProps, withTiming } from 'react-native-reanimated';
import tokens from '../../theme/tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface MacroData {
  protein: { consumed: number; target: number };
  carbs: { consumed: number; target: number };
  fat: { consumed: number; target: number };
  calories: { consumed: number; target: number };
}

interface Props {
  data: MacroData;
}

// Russian doll configuration from IMPLEMENTATION_PLAN.md
// Inner → Outer: Protein (innermost) → Calories → Fat → Carbs (outermost)
const CIRCLES = [
  { key: 'carbs', radius: 120, stroke: 12, gradient: ['#FDE68A', '#FCD34D'], label: 'Carbs' },    // Outer (240px diameter)
  { key: 'fat', radius: 100, stroke: 12, gradient: ['#FBBF24', '#F59E0B'], label: 'Fat' },        // Circle 3 (200px diameter)
  { key: 'calories', radius: 80, stroke: 12, gradient: ['#FB923C', '#F97316'], label: 'Calories' }, // Circle 2 (160px diameter)
  { key: 'protein', radius: 60, stroke: 12, gradient: ['#14B8A6', '#0D9488'], label: 'Protein' },  // Inner (120px diameter)
] as const;

const CENTER_X = 140;
const CENTER_Y = 140;
const EMPTY_COLOR = '#E7E7E8';

export default function NutritionProgressCircles({ data }: Props) {
  // Calculate percentages
  const getPercentage = (consumed: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((consumed / target) * 100, 100);
  };

  const caloriesPercent = getPercentage(data.calories.consumed, data.calories.target);
  const proteinPercent = getPercentage(data.protein.consumed, data.protein.target);
  const carbsPercent = getPercentage(data.carbs.consumed, data.carbs.target);
  const fatPercent = getPercentage(data.fat.consumed, data.fat.target);

  const percentages = {
    calories: caloriesPercent,
    protein: proteinPercent,
    carbs: carbsPercent,
    fat: fatPercent,
  };

  // Check if exceeded or empty
  const isEmpty = data.calories.target === 0;

  const renderCircle = (config: typeof CIRCLES[number], percentage: number, _index: number) => {
    const circumference = 2 * Math.PI * config.radius;
    const strokeDashoffset = circumference - (circumference * percentage) / 100;

    const animatedProps = useAnimatedProps(() => ({
      strokeDashoffset: withTiming(strokeDashoffset, { duration: 600 }),
    }));

    const gradientId = `gradient-${config.key}`;

    return (
      <React.Fragment key={config.key}>
        {/* Background circle (gray, full circle) */}
        <Circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={config.radius}
          stroke={EMPTY_COLOR}
          strokeWidth={config.stroke}
          fill="none"
        />

        {/* Colored arc (partial circle) with gradient */}
        {percentage > 0 && (
          <>
            <Defs>
              <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={config.gradient[0]} />
                <Stop offset="100%" stopColor={config.gradient[1]} />
              </LinearGradient>
            </Defs>
            <AnimatedCircle
              cx={CENTER_X}
              cy={CENTER_Y}
              r={config.radius}
              stroke={`url(#${gradientId})`}
              strokeWidth={config.stroke}
              fill="none"
              strokeDasharray={circumference}
              animatedProps={animatedProps}
              strokeLinecap="round"
              transform={`rotate(-90 ${CENTER_X} ${CENTER_Y})`}
            />
          </>
        )}
      </React.Fragment>
    );
  };

  // Empty state - no targets set
  if (isEmpty) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>No nutrition targets set</Text>
          <Text style={styles.emptyStateText}>
            Set up your nutrition goals in the profile to start tracking
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Russian Doll Circles - Centered */}
      <View style={styles.ringsCenter}>
        <Svg width={CENTER_X * 2} height={CENTER_Y * 2}>
          {CIRCLES.map((config, index) => renderCircle(config, percentages[config.key], index))}
        </Svg>

        {/* Center text - Total calories */}
        <View style={styles.centerTextContainer}>
          <View style={styles.centerNumberRow}>
            <Text style={styles.centerNumberConsumed}>{data.calories.consumed}</Text>
            <Text style={styles.centerNumberTarget}>/{data.calories.target}</Text>
          </View>
          <Text style={styles.centerLabel}>calories</Text>
        </View>
      </View>

      {/* Macro labels outside circles */}
      <View style={styles.macrosColumn}>
        <View style={styles.macroRow}>
          <Text style={styles.macroText}>Protein: {data.protein.consumed}/{data.protein.target}g</Text>
        </View>
        <View style={styles.macroRow}>
          <Text style={styles.macroText}>Fat: {data.fat.consumed}/{data.fat.target}g</Text>
        </View>
        <View style={styles.macroRow}>
          <Text style={styles.macroText}>Carbs: {data.carbs.consumed}/{data.carbs.target}g</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing['2xl'],
  },
  ringsCenter: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.lg,
    position: 'relative',
  },
  centerTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerNumberRow: {
    flexDirection: 'row' as const,
    alignItems: 'baseline',
    marginBottom: 4,
  },
  centerNumberConsumed: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: tokens.colors.text.primary,
  },
  centerNumberTarget: {
    fontSize: 20,
    fontWeight: '200' as const,
    color: tokens.colors.text.secondary,
    letterSpacing: -0.5,
  },
  centerLabel: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    fontWeight: '500' as const,
  },
  macrosColumn: {
    gap: tokens.spacing.sm,
  },
  macroRow: {
    flexDirection: 'row' as const,
    alignItems: 'center',
  },
  macroText: {
    fontSize: 16,
    color: tokens.colors.text.primary,
    fontWeight: '500' as const,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: tokens.spacing['4xl'],
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#8E8E93',
    marginBottom: tokens.spacing.sm,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#C7C7CC',
    textAlign: 'center',
    paddingHorizontal: tokens.spacing.xl,
  },
});
