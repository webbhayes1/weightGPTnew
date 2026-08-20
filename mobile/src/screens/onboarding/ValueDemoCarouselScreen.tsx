/**
 * Value Demo Carousel Screen
 * Swipeable container for the 3 value demo screens
 * Allows horizontal swiping between:
 * 1. Success Path (Weight projection graph)
 * 2. Daily Nutrition (Calorie/macro targets)
 * 3. Workouts (Workout schedule preview)
 */

import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import ValueDemoSuccessPathScreen from './ValueDemoSuccessPathScreen';
import ValueDemoDailyNutritionScreen from './ValueDemoDailyNutritionScreen';
import ValueDemoWorkoutsScreen from './ValueDemoWorkoutsScreen';

type ValueDemoCarouselNavigationProp = StackNavigationProp<OnboardingStackParamList>;

interface ValueDemoCarouselScreenProps {
  navigation: ValueDemoCarouselNavigationProp;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ValueDemoCarouselScreen({
  navigation,
}: ValueDemoCarouselScreenProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < 2) {
      scrollViewRef.current?.scrollTo({
        x: SCREEN_WIDTH * (currentPage + 1),
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {/* Page 1: Success Path */}
        <View style={styles.page}>
          <ValueDemoSuccessPathScreen
            navigation={navigation}
            currentPage={currentPage}
            totalPages={3}
            onNextPage={handleNextPage}
          />
        </View>

        {/* Page 2: Daily Nutrition */}
        <View style={styles.page}>
          <ValueDemoDailyNutritionScreen
            navigation={navigation}
            currentPage={currentPage}
            totalPages={3}
            onNextPage={handleNextPage}
          />
        </View>

        {/* Page 3: Workouts */}
        <View style={styles.page}>
          <ValueDemoWorkoutsScreen
            navigation={navigation}
            currentPage={currentPage}
            totalPages={3}
            onNextPage={handleNextPage}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width: SCREEN_WIDTH,
  },
});
