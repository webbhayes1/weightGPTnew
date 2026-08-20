/**
 * Grocery Shopping Day Screen (Step 13/17)
 * Q1 Onboarding - Select grocery shopping day (optional with skip)
 * Prompt: "When do you typically grocery shop?"
 * Options:
 * - Sunday (week starts Monday)
 * - Saturday (week starts Sunday)
 * - Mid-week (week starts Thursday)
 * - Skip (defaults to Flexible)
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import { useOnboardingStore } from '../../store/onboardingStore';
import tokens from '../../theme/tokens';
import Button from '../../components/ui/Button';

const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 5;

type GroceryShoppingDayScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'GroceryShoppingDay'>;

interface GroceryShoppingDayScreenProps {
  navigation: GroceryShoppingDayScreenNavigationProp;
}

interface ShoppingDayOption {
  value: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  label: string;
  icon: string;
}

const shoppingDayOptions: ShoppingDayOption[] = [
  { value: 'sunday', label: 'Sunday', icon: '📅' },
  { value: 'monday', label: 'Monday', icon: '📅' },
  { value: 'tuesday', label: 'Tuesday', icon: '📅' },
  { value: 'wednesday', label: 'Wednesday', icon: '📅' },
  { value: 'thursday', label: 'Thursday', icon: '📅' },
  { value: 'friday', label: 'Friday', icon: '📅' },
  { value: 'saturday', label: 'Saturday', icon: '📅' },
];

export default function GroceryShoppingDayScreen({ navigation }: GroceryShoppingDayScreenProps) {
  const { data, setGroceryShoppingDay } = useOnboardingStore();
  const scrollViewRef = useRef<ScrollView>(null);

  const [selectedIndex, setSelectedIndex] = useState<number>(() => {
    if (data.weekStartDay === 'flexible' || !data.weekStartDay) return 0;
    const index = shoppingDayOptions.findIndex(opt => opt.value === data.weekStartDay);
    return index >= 0 ? index : 0;
  });

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Scroll to selected index on mount
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }, 100);
  }, []);

  const handleScroll = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    setScrollY(yOffset);
  };

  const handleMomentumScrollEnd = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, shoppingDayOptions.length - 1));

    setSelectedIndex(clampedIndex);

    // Snap to position
    scrollViewRef.current?.scrollTo({
      y: clampedIndex * ITEM_HEIGHT,
      animated: true,
    });
  };

  const selectedDay = shoppingDayOptions[selectedIndex]?.value || null;

  const handleContinue = () => {
    if (!selectedDay) return;

    // Store grocery shopping day
    setGroceryShoppingDay(selectedDay);

    // Navigate to Equipment Access (Step 14)
    navigation.navigate('EquipmentAccess');
  };

  const handleSkip = () => {
    // Skip: set to flexible (defaults to week starts Sunday)
    setGroceryShoppingDay('flexible');

    // Navigate to Equipment Access (Step 14)
    navigation.navigate('EquipmentAccess');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isValid = selectedDay !== null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip →</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(13/17) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            When do you{'\n'}typically{'\n'}grocery shop?
          </Text>
        </View>

        {/* Picker Wheel */}
        <View style={styles.pickerContainer}>
          {/* Selection Box */}
          <View style={styles.selectionBox} />

          {/* Scrollable Days */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.pickerScroll}
            contentContainerStyle={styles.pickerContent}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            scrollEventThrottle={16}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
          >
            {/* Top padding */}
            <View style={{ height: ITEM_HEIGHT * 2 }} />

            {shoppingDayOptions.map((option, index) => {
              const position = index * ITEM_HEIGHT;
              const distance = Math.abs(scrollY - position);
              const scale = Math.max(0.7, 1 - distance / (ITEM_HEIGHT * 2));
              const opacity = Math.max(0.3, 1 - distance / (ITEM_HEIGHT * 2));
              const isSelected = index === selectedIndex;

              return (
                <View
                  key={option.value}
                  style={[
                    styles.pickerItem,
                    { opacity, transform: [{ scale }] },
                  ]}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      isSelected && styles.pickerItemTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>
              );
            })}

            {/* Bottom padding */}
            <View style={{ height: ITEM_HEIGHT * 2 }} />
          </ScrollView>
        </View>

        {/* Helper Text */}
        <View style={styles.helperContainer}>
          <Text style={styles.helperText}>
            We'll generate your meal plan based on when you shop
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!isValid}
          context="nutrition"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background.white,
  },
  header: {
    paddingTop: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    position: 'absolute',
    top: tokens.spacing.md,
    left: tokens.spacing.xl,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 28,
    color: tokens.colors.text.primary,
  },
  skipButton: {
    height: 44,
    justifyContent: 'center',
    position: 'absolute',
    top: tokens.spacing.md,
    right: tokens.spacing.xl,
    zIndex: 10,
  },
  skipButtonText: {
    fontSize: 16,
    color: tokens.colors.nutrition.blue,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: tokens.colors.borders.light,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: tokens.colors.nutrition.blue,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: tokens.colors.text.secondary,
    marginTop: tokens.spacing.xs,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing['2xl'],
    paddingBottom: tokens.spacing['3xl'],
  },
  promptContainer: {
    marginBottom: tokens.spacing['3xl'],
  },
  promptText: {
    fontSize: 32,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    lineHeight: 40,
    textAlign: 'center' as const,
  },
  optionsContainer: {
    gap: tokens.spacing.lg,
    marginBottom: tokens.spacing['2xl'],
  },
  optionCard: {
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: tokens.spacing.lg,
    minHeight: 100,
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: tokens.colors.nutrition.blue,
    backgroundColor: tokens.colors.nutrition.blueLight,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  optionIcon: {
    fontSize: 32,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  optionLabelSelected: {
    color: tokens.colors.workout.navy,
  },
  optionDescription: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    lineHeight: 20,
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: tokens.colors.nutrition.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: tokens.colors.text.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  helperContainer: {
    paddingHorizontal: tokens.spacing.md,
    marginTop: tokens.spacing.lg,
  },
  helperText: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    marginBottom: tokens.spacing['2xl'],
    position: 'relative' as const,
  },
  selectionBox: {
    position: 'absolute' as const,
    top: ITEM_HEIGHT * 2,
    left: tokens.spacing.xl,
    right: tokens.spacing.xl,
    height: ITEM_HEIGHT,
    borderWidth: 2,
    borderColor: tokens.colors.nutrition.blue,
    borderRadius: tokens.borderRadius.md,
    backgroundColor: tokens.colors.nutrition.blueLight + '20',
    zIndex: 1,
    pointerEvents: 'none',
  },
  pickerScroll: {
    flex: 1,
  },
  pickerContent: {
    paddingHorizontal: tokens.spacing.xl,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: 18,
    color: tokens.colors.text.secondary,
    fontWeight: '400',
  },
  pickerItemTextSelected: {
    fontSize: 22,
    color: tokens.colors.text.primary,
    fontWeight: '700',
  },
  bottomContainer: {
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xl,
    paddingTop: tokens.spacing.md,
    backgroundColor: tokens.colors.background.white,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.borders.light,
  },
});
