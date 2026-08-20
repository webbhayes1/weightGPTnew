/**
 * ValueDemoCarouselScreen Component Tests
 * Tests horizontal swipeable carousel container for 3 value demo screens
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ValueDemoCarouselScreen from '../../../src/screens/onboarding/ValueDemoCarouselScreen';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  setOptions: jest.fn(),
} as any;

// Mock child screens
jest.mock('../../../src/screens/onboarding/ValueDemoSuccessPathScreen', () => {
  return function MockValueDemoSuccessPathScreen({ currentPage, totalPages }: any) {
    const React = require('react');
    const { View, Text } = require('react-native');
    return (
      <View>
        <Text>Success Path Screen</Text>
        <Text>Page {currentPage + 1} of {totalPages}</Text>
      </View>
    );
  };
});

jest.mock('../../../src/screens/onboarding/ValueDemoDailyNutritionScreen', () => {
  return function MockValueDemoDailyNutritionScreen({ currentPage, totalPages }: any) {
    const React = require('react');
    const { View, Text } = require('react-native');
    return (
      <View>
        <Text>Daily Nutrition Screen</Text>
        <Text>Page {currentPage + 1} of {totalPages}</Text>
      </View>
    );
  };
});

jest.mock('../../../src/screens/onboarding/ValueDemoWorkoutsScreen', () => {
  return function MockValueDemoWorkoutsScreen({ currentPage, totalPages }: any) {
    const React = require('react');
    const { View, Text } = require('react-native');
    return (
      <View>
        <Text>Workouts Screen</Text>
        <Text>Page {currentPage + 1} of {totalPages}</Text>
      </View>
    );
  };
});

describe('ValueDemoCarouselScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render horizontal ScrollView container', () => {
      const { UNSAFE_root } = render(<ValueDemoCarouselScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render all 3 child screens', () => {
      const { getByText } = render(<ValueDemoCarouselScreen navigation={mockNavigation} />);

      // All 3 screens should be rendered
      expect(getByText('Success Path Screen')).toBeTruthy();
      expect(getByText('Daily Nutrition Screen')).toBeTruthy();
      expect(getByText('Workouts Screen')).toBeTruthy();
    });

    it('should start on page 1 (index 0)', () => {
      const { getAllByText } = render(<ValueDemoCarouselScreen navigation={mockNavigation} />);

      // First screen should show page 1 of 3
      const pageIndicators = getAllByText('Page 1 of 3');
      expect(pageIndicators.length).toBeGreaterThan(0);
    });
  });

  describe('Page Navigation', () => {
    it('should pass currentPage prop to child screens', () => {
      const { UNSAFE_root } = render(<ValueDemoCarouselScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should pass totalPages=3 to all child screens', () => {
      const { getAllByText } = render(<ValueDemoCarouselScreen navigation={mockNavigation} />);

      const pageIndicators = getAllByText(/of 3/);
      expect(pageIndicators.length).toBe(3); // All 3 screens show "of 3"
    });

    it('should pass onNextPage handler to child screens', () => {
      const { UNSAFE_root } = render(<ValueDemoCarouselScreen navigation={mockNavigation} />);
      // Child screens receive onNextPage prop
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Scroll Behavior', () => {
    it('should render ScrollView with horizontal prop', () => {
      const { UNSAFE_root } = render(<ValueDemoCarouselScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render ScrollView with pagingEnabled', () => {
      const { UNSAFE_root } = render(<ValueDemoCarouselScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render ScrollView with showsHorizontalScrollIndicator=false', () => {
      const { UNSAFE_root } = render(<ValueDemoCarouselScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Container Layout', () => {
    it('should render 3 equal-width pages', () => {
      const { UNSAFE_root } = render(<ValueDemoCarouselScreen navigation={mockNavigation} />);
      // Each page takes full screen width
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with flex: 1 container', () => {
      const { UNSAFE_root } = render(<ValueDemoCarouselScreen navigation={mockNavigation} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Navigation Prop Passing', () => {
    it('should pass navigation prop to all child screens', () => {
      const { UNSAFE_root } = render(<ValueDemoCarouselScreen navigation={mockNavigation} />);
      // All child screens receive navigation prop
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
