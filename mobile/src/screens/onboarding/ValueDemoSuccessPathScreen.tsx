/**
 * Value Demo Screen 1: Your Success Path
 * Shows projected weight loss/gain graph based on user's goal
 * Q1 Spec: Lines 438-458
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';
import Svg, { Line, Polygon } from 'react-native-svg';

type ValueDemoSuccessPathNavigationProp = StackNavigationProp<OnboardingStackParamList>;

interface ValueDemoSuccessPathScreenProps {
  navigation: ValueDemoSuccessPathNavigationProp;
  currentPage?: number; // For carousel mode
  totalPages?: number; // For carousel mode
  onNextPage?: () => void; // For carousel mode - advance to next page
}

// Chart dimensions (for future graph library integration)
const CHART_HEIGHT = 240;
const BADGE_WIDTH = 110;
const BADGE_HEIGHT = 52;

export default function ValueDemoSuccessPathScreen({
  navigation,
  currentPage = 0,
  totalPages = 3,
  onNextPage,
}: ValueDemoSuccessPathScreenProps) {
  const { data } = useOnboardingStore();
  const [chartWidth, setChartWidth] = React.useState<number | null>(null);

  // Calculate timeline data
  const timelineData = useMemo(() => {
    const currentWeight = data.currentWeight || 180;
    const goalWeight = data.goalWeight || currentWeight;
    const goalType = data.goalType || 'lose_weight';
    // For maintain_weight, weeklyRate should be 0, not 1.5
    const weeklyRate = goalType === 'maintain_weight' ? 0 : (data.weeklyRate || 1.5);

    // Calculate number of weeks
    let weeks = 16; // default
    if (data.goalDate) {
      const now = new Date();
      const goal = new Date(data.goalDate);
      weeks = Math.ceil((goal.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7));
    }

    const weightDiff = Math.abs(goalWeight - currentWeight);

    return {
      currentWeight,
      goalWeight,
      goalType,
      weeklyRate: Math.abs(weeklyRate),
      weeks,
      weightDiff,
    };
  }, [data]);

  // TODO: Generate chart data points for future graph library integration
  // const chartPoints = useMemo(() => {
  //   const { currentWeight, goalWeight, weeks } = timelineData;
  //   const points: { week: number; weight: number }[] = [];
  //   for (let week = 0; week <= weeks; week++) {
  //     const progress = week / weeks;
  //     const weight = currentWeight + (goalWeight - currentWeight) * progress;
  //     points.push({ week, weight });
  //   }
  //   return points;
  // }, [timelineData]);

  const handleContinue = () => {
    navigation.navigate('ValueDemoDailyNutrition');
  };

  const formatDate = () => {
    if (!data.goalDate) return 'Your Goal Date';
    const date = new Date(data.goalDate);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get pace category (matching GoalDateScreen logic)
  const getPaceCategory = () => {
    const { weeklyRate, goalType } = timelineData;
    const absRate = Math.abs(weeklyRate);

    if (goalType === 'lose_weight') {
      if (absRate <= 1.5) return { label: 'Healthy Pace', color: tokens.colors.semantic.success };
      if (absRate <= 2.0) return { label: 'Ambitious', color: tokens.colors.semantic.warning };
      return { label: 'Aggressive', color: tokens.colors.semantic.error };
    } else if (goalType === 'gain_weight') {
      if (absRate <= 0.5) return { label: 'Healthy Pace', color: tokens.colors.semantic.success };
      if (absRate <= 1.0) return { label: 'Ambitious', color: tokens.colors.semantic.warning };
      return { label: 'Aggressive', color: tokens.colors.semantic.error };
    }

    return { label: 'Safe & Sustainable', color: tokens.colors.progress.emerald };
  };

  const paceCategory = getPaceCategory();

  // Calculate dynamic positioning for data points
  const getDataPointPositions = () => {
    const { currentWeight, goalWeight } = timelineData;
    const minWeight = Math.min(currentWeight, goalWeight);
    const maxWeight = Math.max(currentWeight, goalWeight);
    let weightRange = maxWeight - minWeight;

    // Handle edge case: maintain goal where current === goal (would cause NaN)
    if (weightRange === 0) {
      weightRange = 10; // Use a small range for visual purposes
    }

    // We want centers between 25% and 75% vertically
    const MIN_CENTER = 0.25;
    const MAX_CENTER = 0.75;
    const span = MAX_CENTER - MIN_CENTER; // 0.5

    const mapWeightToCenter = (weight: number) => {
      // ratio: 0 at max weight (top), 1 at min weight (bottom)
      const ratio = (maxWeight - weight) / weightRange;
      return MIN_CENTER + ratio * span;
    };

    const startCenter = mapWeightToCenter(currentWeight);
    const goalCenter = mapWeightToCenter(goalWeight);

    return {
      startCenter, // 0–1, center of badge
      goalCenter,
    };
  };

  const dataPointPositions = getDataPointPositions();

  // Derive badge top values from centers
  const badgeOffsetFrac = BADGE_HEIGHT / (2 * CHART_HEIGHT); // half badge height as fraction of chart
  const startTopPct = (dataPointPositions.startCenter - badgeOffsetFrac) * 100;
  const goalTopPct = (dataPointPositions.goalCenter - badgeOffsetFrac) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Content Area - Not Scrollable */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Here's Your Path{'\n'}to Success</Text>
        </View>

        {/* Chart Container */}
        <View style={styles.chartContainer}>
          {/* Pace Badge - Positioned at top of graph */}
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: paceCategory.color + '15', borderColor: paceCategory.color }]}>
              <Text style={[styles.badgeIcon, { color: paceCategory.color }]}>✓</Text>
              <Text style={[styles.badgeText, { color: paceCategory.color }]}>{paceCategory.label}</Text>
            </View>
          </View>
          {/* Y-axis labels */}
          <View style={styles.yAxisLabels}>
            <Text style={styles.yAxisLabel}>{Math.round(Math.max(timelineData.currentWeight, timelineData.goalWeight))} lbs</Text>
            <Text style={styles.yAxisLabel}>{Math.round((timelineData.currentWeight + timelineData.goalWeight) / 2)} lbs</Text>
            <Text style={styles.yAxisLabel}>{Math.round(Math.min(timelineData.currentWeight, timelineData.goalWeight))} lbs</Text>
          </View>

          {/* Chart area */}
          <View
            style={styles.chartArea}
            onLayout={(e) => {
              setChartWidth(e.nativeEvent.layout.width);
            }}
          >
            {/* Background grid */}
            <View style={styles.gridLine} />
            <View style={[styles.gridLine, { top: '50%' }]} />
            <View style={[styles.gridLine, { top: '100%' }]} />

            {/* SVG Layer for line and shaded area */}
            <Svg
              width="100%"
              height={CHART_HEIGHT}
              style={styles.svgLayer}
            >
              {chartWidth && (() => {
                const startCenterY = dataPointPositions.startCenter * CHART_HEIGHT;
                const goalCenterY = dataPointPositions.goalCenter * CHART_HEIGHT;

                const startRightX = BADGE_WIDTH;               // right edge of left badge
                const goalLeftX = chartWidth - BADGE_WIDTH;    // left edge of right badge

                const chartBottom = CHART_HEIGHT;

                return (
                  <>
                    {/* Left section: Below start box - horizontal top edge */}
                    <Polygon
                      points={`0,${startCenterY} ${startRightX},${startCenterY} ${startRightX},${chartBottom} 0,${chartBottom}`}
                      fill={paceCategory.color}
                      opacity={0.15}
                    />

                    {/* Middle section: Below trend line between boxes */}
                    <Polygon
                      points={`${startRightX},${startCenterY} ${goalLeftX},${goalCenterY} ${goalLeftX},${chartBottom} ${startRightX},${chartBottom}`}
                      fill={paceCategory.color}
                      opacity={0.15}
                    />

                    {/* Right section: Below goal box - horizontal top edge */}
                    <Polygon
                      points={`${goalLeftX},${goalCenterY} ${chartWidth},${goalCenterY} ${chartWidth},${chartBottom} ${goalLeftX},${chartBottom}`}
                      fill={paceCategory.color}
                      opacity={0.15}
                    />

                    {/* Straight diagonal line */}
                    <Line
                      x1={startRightX}
                      y1={startCenterY}
                      x2={goalLeftX}
                      y2={goalCenterY}
                      stroke={paceCategory.color}
                      strokeWidth={3}
                      strokeLinecap="round"
                    />
                  </>
                );
              })()}
            </Svg>

            {/* Data Point Badges */}
            <View style={styles.progressLine}>
              {/* Starting point */}
              <View style={[
                styles.dataPoint,
                {
                  position: 'absolute',
                  top: `${startTopPct}%`,
                  left: 0,
                  borderColor: paceCategory.color,
                  zIndex: 2,
                }
              ]}>
                <Text style={styles.pointLabel}>Start</Text>
                <Text style={styles.pointValue}>{timelineData.currentWeight} lbs</Text>
              </View>

              {/* Goal point */}
              <View style={[
                styles.dataPoint,
                {
                  position: 'absolute',
                  top: `${goalTopPct}%`,
                  right: 0,
                  borderColor: paceCategory.color,
                  zIndex: 2,
                }
              ]}>
                <Text style={styles.pointLabel}>Goal</Text>
                <Text style={styles.pointValue}>{timelineData.goalWeight} lbs</Text>
              </View>
            </View>

            {/* X-axis labels */}
            <View style={styles.xAxisLabels}>
              <Text style={styles.xAxisLabel}>Today</Text>
              <Text style={styles.xAxisLabel}>{formatDate()}</Text>
            </View>
          </View>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            {/* Row 1 */}
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{timelineData.currentWeight} lbs</Text>
              <Text style={styles.statLabel}>Starting Weight</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{timelineData.goalWeight} lbs</Text>
              <Text style={styles.statLabel}>Goal Weight</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            {/* Row 2 */}
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{timelineData.weeks} weeks</Text>
              <Text style={styles.statLabel}>Timeline</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {timelineData.weeklyRate === 0
                  ? '0 lbs'
                  : `${timelineData.goalType === 'lose_weight' ? '-' : '+'}${timelineData.weeklyRate.toFixed(1)} lbs`
                }
              </Text>
              <Text style={styles.statLabel}>Per Week</Text>
            </View>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimer}>
            Your personalized plan is designed to help you reach your goal safely and sustainably
          </Text>
        </View>
      </View>

      {/* Fixed Bottom Section - Button + Progress Indicator */}
      <View style={styles.fixedBottomSection}>
        {/* CTA Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={currentPage === totalPages - 1 ? "See Your Full Plan" : "Continue"}
            onPress={currentPage < totalPages - 1 && onNextPage ? onNextPage : handleContinue}
            variant="primary"
            size="large"
            fullWidth
            gradientColors={[paceCategory.color, paceCategory.color] as const}
          />
        </View>

        {/* Progress indicator */}
        <View style={styles.progressIndicator}>
          <View style={[styles.dot, currentPage === 0 && styles.dotActive, currentPage === 0 && { backgroundColor: paceCategory.color }]} />
          <View style={[styles.dot, currentPage === 1 && styles.dotActive, currentPage === 1 && { backgroundColor: paceCategory.color }]} />
          <View style={[styles.dot, currentPage === 2 && styles.dotActive, currentPage === 2 && { backgroundColor: paceCategory.color }]} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.lg,
  },
  fixedBottomSection: {
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    backgroundColor: tokens.colors.background.white,
  },
  header: {
    marginBottom: tokens.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '200',
    color: tokens.colors.text.primary,
    textAlign: 'center' as const,
    lineHeight: 40,
    letterSpacing: -1,
  },
  chartContainer: {
    flexDirection: 'row' as const,
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
    minHeight: 240,
    position: 'relative' as const,
  },
  yAxisLabels: {
    width: 50,
    justifyContent: 'space-between',
    paddingRight: tokens.spacing.sm,
  },
  yAxisLabel: {
    ...tokens.typography.caption.s,
    color: tokens.colors.text.tertiary,
    textAlign: 'right' as const,
  },
  chartArea: {
    flex: 1,
    height: CHART_HEIGHT,
    position: 'relative' as const,
    overflow: 'visible' as const,
  },
  gridLine: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: tokens.colors.borders.light,
    top: 0,
  },
  svgLayer: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Above background, below badges
  },
  progressLine: {
    position: 'relative' as const,
    height: '100%',
    justifyContent: 'space-between',
    overflow: 'visible' as const,
  },
  dataPoint: {
    width: BADGE_WIDTH,
    height: BADGE_HEIGHT,
    backgroundColor: tokens.colors.background.white,
    padding: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.sm,
    borderWidth: 2,
    ...tokens.shadows.card,
    zIndex: 2, // Ensure badges are above line and shaded area
  },
  pointLabel: {
    fontSize: 10,
    color: tokens.colors.text.tertiary,
    marginBottom: 2,
  },
  pointValue: {
    fontSize: 14,
    color: tokens.colors.text.primary,
    fontWeight: '600' as const,
  },
  xAxisLabels: {
    position: 'absolute' as const,
    bottom: -24,
    left: 0,
    right: 0,
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
  },
  xAxisLabel: {
    ...tokens.typography.caption.s,
    color: tokens.colors.text.tertiary,
  },
  statsContainer: {
    backgroundColor: tokens.colors.background.white,
    padding: tokens.spacing.xl,
    paddingVertical: tokens.spacing.lg,
    marginTop: tokens.spacing.xl,
    marginBottom: 0,
  },
  statsGrid: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: tokens.colors.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    textAlign: 'center' as const,
  },
  disclaimerContainer: {
    backgroundColor: tokens.colors.background.white,
    borderRadius: tokens.borderRadius.rounded,
    padding: tokens.spacing.md,
    marginTop: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
  disclaimer: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
    textAlign: 'center' as const,
    lineHeight: 18,
  },
  badgeContainer: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  badge: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.pill,
    borderWidth: 1,
  },
  badgeIcon: {
    fontSize: 12,
    marginRight: tokens.spacing.xs,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  buttonContainer: {
    marginBottom: tokens.spacing.lg,
  },
  swipeHintContainer: {
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
  },
  swipeHintText: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    fontWeight: '600' as const,
  },
  progressIndicator: {
    flexDirection: 'row' as const,
    justifyContent: 'center',
    gap: tokens.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: tokens.borderRadius.circle,
    backgroundColor: tokens.colors.borders.light,
  },
  dotActive: {
    width: 24,
    // backgroundColor set inline based on paceCategory
  },
});
