/**
 * Unified Progress Rings Component
 * Phase 3: Q3.0 App Shell - Enhanced macro-segmented progress visualization
 * Outer ring: Macro-segmented calories (carbs, protein, fat)
 * Inner ring: Exercise time with calories burned overlay
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  withTiming,
  useSharedValue,
  Easing
} from 'react-native-reanimated';
import tokens from '../../theme/tokens';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface UnifiedProgressData {
  calories: {
    consumed: number;
    target: number;
  };
  macros: {
    carbs: {
      consumed: number;
      target: number;
    };
    protein: {
      consumed: number;
      target: number;
    };
    fat: {
      consumed: number;
      target: number;
    };
  };
  exercise: {
    minutes: {
      completed: number;
      target: number;
    };
    calories: {
      burned: number;
      target: number;
    };
  };
}

interface Props {
  data: UnifiedProgressData;
}

// Circle configuration
const OUTER_RADIUS = 85;
const INNER_RADIUS = 60;
const CENTER_X = 110;
const CENTER_Y = 110;
const STROKE_WIDTH = 14;
const EMPTY_COLOR = '#E7E7E8';

// Macro colors
const MACRO_COLORS = {
  carbs: '#FFB347', // Amber
  protein: '#FF6B9D', // Pink
  fat: '#A78BFA', // Purple
};

export default function UnifiedProgressRings({ data }: Props) {
  // Show empty state only if there's no plan (no targets set)
  const isEmpty = data.calories.target === 0 && data.exercise.minutes.target === 0;

  // Calculate macro percentages of total calories
  const totalMacroTarget = data.macros.carbs.target + data.macros.protein.target + data.macros.fat.target;
  const carbsPercentageOfRing = totalMacroTarget > 0 ? (data.macros.carbs.target / totalMacroTarget) * 100 : 33;
  const proteinPercentageOfRing = totalMacroTarget > 0 ? (data.macros.protein.target / totalMacroTarget) * 100 : 33;
  const fatPercentageOfRing = totalMacroTarget > 0 ? (data.macros.fat.target / totalMacroTarget) * 100 : 34;

  // Calculate progress for each macro
  const carbsProgress = data.macros.carbs.target > 0
    ? Math.min((data.macros.carbs.consumed / data.macros.carbs.target) * 100, 100)
    : 0;
  const proteinProgress = data.macros.protein.target > 0
    ? Math.min((data.macros.protein.consumed / data.macros.protein.target) * 100, 100)
    : 0;
  const fatProgress = data.macros.fat.target > 0
    ? Math.min((data.macros.fat.consumed / data.macros.fat.target) * 100, 100)
    : 0;

  // Calculate exercise progress
  const exerciseMinutesProgress = data.exercise.minutes.target > 0
    ? Math.min((data.exercise.minutes.completed / data.exercise.minutes.target) * 100, 100)
    : 0;
  const exerciseCaloriesProgress = data.exercise.calories.target > 0
    ? Math.min((data.exercise.calories.burned / data.exercise.calories.target) * 100, 100)
    : 0;

  // Animated values for progress
  const animatedCarbsProgress = useSharedValue(0);
  const animatedProteinProgress = useSharedValue(0);
  const animatedFatProgress = useSharedValue(0);
  const animatedExerciseProgress = useSharedValue(0);

  // Animate progress values when data changes
  useEffect(() => {
    animatedCarbsProgress.value = withTiming(carbsProgress, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    animatedProteinProgress.value = withTiming(proteinProgress, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    animatedFatProgress.value = withTiming(fatProgress, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    animatedExerciseProgress.value = withTiming(exerciseMinutesProgress, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [carbsProgress, proteinProgress, fatProgress, exerciseMinutesProgress]);

  /**
   * Create SVG path for a circular segment
   * @param radius - Circle radius
   * @param startAngle - Starting angle in degrees (0 = top)
   * @param endAngle - Ending angle in degrees
   * @param progress - Fill progress (0-100)
   */
  const createSegmentPath = (
    radius: number,
    startAngle: number,
    endAngle: number,
    progress: number
  ): string => {
    'worklet';
    const fillAngle = startAngle + ((endAngle - startAngle) * progress) / 100;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const fillRad = ((fillAngle - 90) * Math.PI) / 180;

    const x1 = CENTER_X + radius * Math.cos(startRad);
    const y1 = CENTER_Y + radius * Math.sin(startRad);
    const x2 = CENTER_X + radius * Math.cos(fillRad);
    const y2 = CENTER_Y + radius * Math.sin(fillRad);

    const largeArcFlag = fillAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  // Calculate segment angles (starting from top, going clockwise)
  const carbsStartAngle = 0;
  const carbsEndAngle = carbsStartAngle + (carbsPercentageOfRing / 100) * 360;
  const proteinStartAngle = carbsEndAngle;
  const proteinEndAngle = proteinStartAngle + (proteinPercentageOfRing / 100) * 360;
  const fatStartAngle = proteinEndAngle;
  const fatEndAngle = fatStartAngle + (fatPercentageOfRing / 100) * 360;

  // Animated props for each macro segment
  const carbsAnimatedProps = useAnimatedProps(() => ({
    d: createSegmentPath(OUTER_RADIUS, carbsStartAngle, carbsEndAngle, animatedCarbsProgress.value),
  }));

  const proteinAnimatedProps = useAnimatedProps(() => ({
    d: createSegmentPath(OUTER_RADIUS, proteinStartAngle, proteinEndAngle, animatedProteinProgress.value),
  }));

  const fatAnimatedProps = useAnimatedProps(() => ({
    d: createSegmentPath(OUTER_RADIUS, fatStartAngle, fatEndAngle, animatedFatProgress.value),
  }));

  // Animated props for exercise circle
  const exerciseAnimatedProps = useAnimatedProps(() => {
    const circumference = 2 * Math.PI * INNER_RADIUS;
    return {
      strokeDashoffset: circumference * (1 - animatedExerciseProgress.value / 100),
    };
  });

  // Empty state
  if (isEmpty) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>No activity logged today</Text>
          <Text style={styles.emptyStateText}>
            Start logging meals and workouts to track your progress
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainRow}>
        {/* Left side: Calories and Macros info */}
        <View style={styles.leftInfo}>
          {/* Calories */}
          <View style={styles.caloriesContainer}>
            <Text style={styles.caloriesNumber}>{data.calories.consumed}</Text>
            <Text style={styles.caloriesLabel}>/ {data.calories.target} cal</Text>
          </View>

          {/* Macros breakdown */}
          <View style={styles.macrosContainer}>
            <View style={styles.macroRow}>
              <View style={[styles.macroDot, { backgroundColor: MACRO_COLORS.carbs }]} />
              <Text style={styles.macroText}>
                Carbs {data.macros.carbs.consumed}g / {data.macros.carbs.target}g
              </Text>
            </View>
            <View style={styles.macroRow}>
              <View style={[styles.macroDot, { backgroundColor: MACRO_COLORS.protein }]} />
              <Text style={styles.macroText}>
                Protein {data.macros.protein.consumed}g / {data.macros.protein.target}g
              </Text>
            </View>
            <View style={styles.macroRow}>
              <View style={[styles.macroDot, { backgroundColor: MACRO_COLORS.fat }]} />
              <Text style={styles.macroText}>
                Fat {data.macros.fat.consumed}g / {data.macros.fat.target}g
              </Text>
            </View>
          </View>
        </View>

        {/* Right side: Circles */}
        <View style={styles.circlesContainer}>
          <Svg width={CENTER_X * 2} height={CENTER_Y * 2}>
            {/* Outer ring background */}
            <Circle
              cx={CENTER_X}
              cy={CENTER_Y}
              r={OUTER_RADIUS}
              stroke={EMPTY_COLOR}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />

            {/* Macro segments */}
            {/* Carbs segment */}
            {carbsProgress > 0 && (
              <AnimatedPath
                animatedProps={carbsAnimatedProps}
                stroke={MACRO_COLORS.carbs}
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeLinecap="round"
              />
            )}

            {/* Protein segment */}
            {proteinProgress > 0 && (
              <AnimatedPath
                animatedProps={proteinAnimatedProps}
                stroke={MACRO_COLORS.protein}
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeLinecap="round"
              />
            )}

            {/* Fat segment */}
            {fatProgress > 0 && (
              <AnimatedPath
                animatedProps={fatAnimatedProps}
                stroke={MACRO_COLORS.fat}
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeLinecap="round"
              />
            )}

            {/* Inner ring background */}
            <Circle
              cx={CENTER_X}
              cy={CENTER_Y}
              r={INNER_RADIUS}
              stroke={EMPTY_COLOR}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />

            {/* Inner ring - Exercise time (full circle progress) */}
            {exerciseMinutesProgress > 0 && (
              <AnimatedCircle
                cx={CENTER_X}
                cy={CENTER_Y}
                r={INNER_RADIUS}
                stroke="#14B8A6"
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeDasharray={2 * Math.PI * INNER_RADIUS}
                animatedProps={exerciseAnimatedProps}
                strokeLinecap="round"
                transform={`rotate(-90 ${CENTER_X} ${CENTER_Y})`}
              />
            )}
          </Svg>
        </View>
      </View>

      {/* Bottom: Exercise info */}
      <View style={styles.exerciseInfo}>
        <View style={styles.exerciseRow}>
          <View style={[styles.exerciseDot, { backgroundColor: '#14B8A6' }]} />
          <Text style={styles.exerciseText}>
            Exercise: {data.exercise.minutes.completed} / {data.exercise.minutes.target} min
          </Text>
        </View>
        <View style={styles.exerciseRow}>
          <View style={[styles.exerciseDot, { backgroundColor: '#FF6B6B' }]} />
          <Text style={styles.exerciseText}>
            Burned: {data.exercise.calories.burned} / {data.exercise.calories.target} cal
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.xl,
    backgroundColor: tokens.colors.background.white,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.lg,
  },
  leftInfo: {
    flex: 1,
    paddingRight: tokens.spacing.lg,
  },
  caloriesContainer: {
    marginBottom: tokens.spacing.md,
  },
  caloriesNumber: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: tokens.colors.text.primary,
    lineHeight: 36,
  },
  caloriesLabel: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    fontWeight: '500' as const,
  },
  macrosContainer: {
    gap: tokens.spacing.xs,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  macroDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  macroText: {
    fontSize: 13,
    color: tokens.colors.text.primary,
    fontWeight: '500' as const,
  },
  circlesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseInfo: {
    gap: tokens.spacing.xs,
    paddingLeft: tokens.spacing.md,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exerciseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  exerciseText: {
    fontSize: 13,
    color: tokens.colors.text.primary,
    fontWeight: '500' as const,
  },
  emptyStateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: tokens.spacing['4xl'],
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.sm,
  },
  emptyStateText: {
    fontSize: 14,
    color: tokens.colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: tokens.spacing.xl,
  },
});
