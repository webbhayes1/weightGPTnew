/**
 * Workout Time Circle Component
 * Phase 3: Q3.0 App Shell - Dual concentric circles
 * Outer circle: Total workout time (teal gradient)
 * Inner circle: Calories burned (red)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useAnimatedProps, withTiming } from 'react-native-reanimated';
import tokens from '../../theme/tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface WorkoutData {
  warmUpMinutes: number;
  mainWorkoutMinutes: number;
  caloriesBurned: number;
  caloriesTarget: number;
}

interface Props {
  data: WorkoutData;
}

// Dual circle configuration
// Outer circle: Total workout time (warm-up + main workout)
// Inner circle: Calories burned
const OUTER_RADIUS = 100;
const INNER_RADIUS = 70;
const CENTER_X = 140;
const CENTER_Y = 140;
const STROKE_WIDTH = 12;
const EMPTY_COLOR = '#E7E7E8';

export default function WorkoutTimeCircle({ data }: Props) {
  // Total workout time excludes cool-down
  const totalMinutes = data.warmUpMinutes + data.mainWorkoutMinutes;
  const isEmpty = totalMinutes === 0;

  // Calculate percentages for arcs
  const timePercentage = 100; // Full circle for total time
  const caloriesPercentage = data.caloriesTarget > 0
    ? Math.min((data.caloriesBurned / data.caloriesTarget) * 100, 100)
    : 0;

  // Render a circle with animated progress
  const renderCircle = (radius: number, percentage: number, colors: string[], isCalories = false) => {
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (circumference * percentage) / 100;

    const animatedProps = useAnimatedProps(() => ({
      strokeDashoffset: withTiming(strokeDashoffset, { duration: 600 }),
    }));

    const gradientId = isCalories ? 'gradient-calories' : 'gradient-time';

    return (
      <React.Fragment key={gradientId}>
        {/* Background circle (gray, full circle) */}
        <Circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={radius}
          stroke={EMPTY_COLOR}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />

        {/* Colored arc with gradient */}
        {percentage > 0 && (
          <>
            <Defs>
              <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={colors[0]} />
                <Stop offset="100%" stopColor={colors[1]} />
              </LinearGradient>
            </Defs>
            <AnimatedCircle
              cx={CENTER_X}
              cy={CENTER_Y}
              r={radius}
              stroke={`url(#${gradientId})`}
              strokeWidth={STROKE_WIDTH}
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

  // Empty state - no workout logged
  if (isEmpty) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>No workout logged today</Text>
          <Text style={styles.emptyStateText}>
            Tap the Log tab to record your workout
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Dual Concentric Circles */}
      <View style={styles.circleContainer}>
        <Svg width={CENTER_X * 2} height={CENTER_Y * 2}>
          {/* Outer circle - Total workout time (teal gradient) */}
          {renderCircle(OUTER_RADIUS, timePercentage, ['#5EEAD4', '#14B8A6'], false)}

          {/* Inner circle - Calories burned (red) */}
          {renderCircle(INNER_RADIUS, caloriesPercentage, ['#FF6B6B', '#FF5252'], true)}
        </Svg>

        {/* Center text - Total duration */}
        <View style={styles.centerTextContainer}>
          <Text style={styles.centerNumber}>{totalMinutes}</Text>
          <Text style={styles.centerLabel}>minutes</Text>
        </View>
      </View>

      {/* Legend below circle */}
      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: '#14B8A6' }]} />
          <Text style={styles.legendText}>
            Warm-up: {data.warmUpMinutes} min
          </Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: '#14B8A6' }]} />
          <Text style={styles.legendText}>
            Main workout: {data.mainWorkoutMinutes} min
          </Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
          <Text style={styles.legendText}>
            Calories: {data.caloriesBurned}/{data.caloriesTarget} cal
          </Text>
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
  circleContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  centerTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerNumber: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: '#1F3A5F',
    marginBottom: 4,
  },
  centerLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500' as const,
  },
  legend: {
    gap: tokens.spacing.sm,
    alignItems: 'flex-start',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 16,
    color: '#2C2C2E',
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
