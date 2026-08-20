/**
 * Day Selector Component
 * Phase 3: Q3.0 App Shell - Home Tab
 * Horizontal scrollable week view with tap and swipe gestures
 * Selected day is always centered and larger (acts as anchor)
 */

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { format, startOfWeek, addDays, isToday, parseISO } from 'date-fns';
import { useUIStore } from '../../store/uiStore';
import tokens from '../../theme/tokens';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DAY_ITEM_WIDTH = 56;
const SELECTED_DAY_WIDTH = 70;

interface DayItem {
  date: string; // ISO date string (YYYY-MM-DD)
  dayOfWeek: string; // e.g., "Mon"
  dayOfMonth: number; // e.g., 6
  isToday: boolean;
  isSelected: boolean;
}

export default function DaySelector() {
  const { selectedDate, setSelectedDate } = useUIStore();
  const scrollViewRef = useRef<ScrollView>(null);

  // Generate array of 7 days for current week
  const getDaysOfWeek = (): DayItem[] => {
    const selected = parseISO(selectedDate);
    const weekStart = startOfWeek(selected, { weekStartsOn: 1 }); // Monday start

    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const dateString = format(date, 'yyyy-MM-dd');

      return {
        date: dateString,
        dayOfWeek: format(date, 'EEE'), // "Mon", "Tue", etc.
        dayOfMonth: parseInt(format(date, 'd'), 10),
        isToday: isToday(date),
        isSelected: dateString === selectedDate,
      };
    });
  };

  const daysOfWeek = getDaysOfWeek();

  // Always center the selected day when selectedDate changes
  useEffect(() => {
    const selectedIndex = daysOfWeek.findIndex((day) => day.isSelected);
    if (selectedIndex !== -1 && scrollViewRef.current) {
      // Calculate scroll position to center selected day
      // Center of screen minus half the selected day width
      const centerOffset = (SCREEN_WIDTH / 2) - (SELECTED_DAY_WIDTH / 2);
      // Position of selected day: sum of previous items + current item offset
      const selectedDayPosition = selectedIndex * DAY_ITEM_WIDTH + (SELECTED_DAY_WIDTH - DAY_ITEM_WIDTH) / 2;
      const scrollX = selectedDayPosition - centerOffset;

      scrollViewRef.current.scrollTo({ x: Math.max(0, scrollX), animated: true });
    }
  }, [selectedDate, daysOfWeek]);

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day.date}
            style={[
              styles.dayItem,
              day.isSelected && styles.dayItemSelected,
            ]}
            onPress={() => handleDayPress(day.date)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.dayOfWeek,
                day.isSelected && styles.dayOfWeekSelected,
              ]}
            >
              {day.dayOfWeek}
            </Text>
            <Text
              style={[
                styles.dayOfMonth,
                day.isSelected && styles.dayOfMonthSelected,
              ]}
            >
              {day.dayOfMonth}
            </Text>
            {day.isToday && (
              <View style={styles.todayIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: tokens.spacing.md,
  },
  scrollContent: {
    paddingHorizontal: SCREEN_WIDTH / 2 - SELECTED_DAY_WIDTH / 2, // Padding to allow centering
    gap: tokens.spacing.xs,
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: DAY_ITEM_WIDTH,
    paddingVertical: tokens.spacing.sm,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  dayItemSelected: {
    width: SELECTED_DAY_WIDTH,
    backgroundColor: tokens.colors.background.offWhite,
    transform: [{ scale: 1.05 }],
  },
  dayOfWeek: {
    ...tokens.typography.body.s,
    fontSize: 14,
    fontWeight: '500' as const,
    color: tokens.colors.text.secondary,
    marginBottom: 4,
  },
  dayOfWeekSelected: {
    color: tokens.colors.text.primary,
    fontWeight: '600' as const,
  },
  dayOfMonth: {
    ...tokens.typography.body.m,
    fontSize: 16,
    fontWeight: '600' as const,
    color: tokens.colors.text.secondary,
  },
  dayOfMonthSelected: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: tokens.colors.text.primary,
  },
  todayIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: tokens.colors.nutrition.blue,
    marginTop: 4,
  },
});
