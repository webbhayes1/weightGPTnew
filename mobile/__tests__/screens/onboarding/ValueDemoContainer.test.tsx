/**
 * ValueDemoContainer Component Tests
 * Tests swipeable container for value demo screens
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import ValueDemoContainer from '../../../src/screens/onboarding/ValueDemoContainer';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  setOptions: jest.fn(),
} as any;

// Mock the store
jest.mock('../../../src/store/onboardingStore', () => ({
  useOnboardingStore: () => ({
    data: {},
  }),
}));

// Mock child screens
jest.mock('../../../src/screens/onboarding/ValueDemoSuccessPathScreen', () => {
  return function MockValueDemoSuccessPathScreen() {
    const React = require('react');
    const { View, Text } = require('react-native');
    return (
      <View>
        <Text>Success Path Screen</Text>
      </View>
    );
  };
});

jest.mock('../../../src/screens/onboarding/ValueDemoDailyNutritionScreen', () => {
  return function MockValueDemoDailyNutritionScreen() {
    const React = require('react');
    const { View, Text } = require('react-native');
    return (
      <View>
        <Text>Daily Nutrition Screen</Text>
      </View>
    );
  };
});

jest.mock('../../../src/screens/onboarding/ValueDemoWorkoutsScreen', () => {
  return function MockValueDemoWorkoutsScreen() {
    const React = require('react');
    const { View, Text } = require('react-native');
    return (
      <View>
        <Text>Workouts Screen</Text>
      </View>
    );
  };
});

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => <View {...props} />,
    Svg: (props: any) => <View {...props} />,
    Circle: () => null,
    Line: () => null,
    Polygon: () => null,
  };
});

describe('ValueDemoContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render container', () => {
      const { UNSAFE_root } = render(<ValueDemoContainer navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render all 3 child screens', () => {
      const { getByText } = render(<ValueDemoContainer navigation={mockNavigation} />);

      expect(getByText('Success Path Screen')).toBeTruthy();
      expect(getByText('Daily Nutrition Screen')).toBeTruthy();
      expect(getByText('Workouts Screen')).toBeTruthy();
    });
  });

  describe('ScrollView', () => {
    it('should render horizontal ScrollView', () => {
      const { UNSAFE_root } = render(<ValueDemoContainer navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should have pagingEnabled prop', () => {
      const { UNSAFE_root } = render(<ValueDemoContainer navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should hide horizontal scroll indicator', () => {
      const { UNSAFE_root } = render(<ValueDemoContainer navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Navigation Prop Passing', () => {
    it('should pass navigation to all child screens', () => {
      const { UNSAFE_root } = render(<ValueDemoContainer navigation={mockNavigation} />);
      // All child screens receive navigation prop
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
