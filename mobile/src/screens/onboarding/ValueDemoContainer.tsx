/**
 * Value Demo Container
 * Swipeable container for the three value demonstration screens
 * Allows users to swipe between Success Path, Daily Nutrition, and Workouts
 */

import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import { ScrollView } from 'react-native-gesture-handler';

// Import the three value demo screens
import ValueDemoSuccessPathScreen from './ValueDemoSuccessPathScreen';
import ValueDemoDailyNutritionScreen from './ValueDemoDailyNutritionScreen';
import ValueDemoWorkoutsScreen from './ValueDemoWorkoutsScreen';

type ValueDemoContainerNavigationProp = StackNavigationProp<OnboardingStackParamList>;

interface ValueDemoContainerProps {
  navigation: ValueDemoContainerNavigationProp;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ValueDemoContainer({
  navigation,
}: ValueDemoContainerProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        style={styles.scrollView}
      >
        {/* Screen 1: Success Path */}
        <View style={styles.screenContainer}>
          <ValueDemoSuccessPathScreen navigation={navigation} />
        </View>

        {/* Screen 2: Daily Nutrition */}
        <View style={styles.screenContainer}>
          <ValueDemoDailyNutritionScreen navigation={navigation} />
        </View>

        {/* Screen 3: Workouts */}
        <View style={styles.screenContainer}>
          <ValueDemoWorkoutsScreen navigation={navigation} />
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
  screenContainer: {
    width: SCREEN_WIDTH,
  },
});
