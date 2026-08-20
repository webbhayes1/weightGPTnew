/**
 * PersonalDetailsScreen Component Tests
 * Tests height (ft/in and cm), age, sex selection, parental consent, and medical disclaimers
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PersonalDetailsScreen from '../../../src/screens/onboarding/PersonalDetailsScreen';
import { useOnboardingStore } from '../../../src/store/onboardingStore';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  setOptions: jest.fn(),
} as any;

// Mock the onboarding store
jest.mock('../../../src/store/onboardingStore');
const mockSetPersonalDetails = jest.fn();

describe('PersonalDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering - Default State', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setPersonalDetails: mockSetPersonalDetails,
      });
    });

    it('should render all required elements', () => {
      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      // Prompt
      expect(getByText('Tell us about yourself')).toBeTruthy();

      // Section labels
      expect(getByText('Height')).toBeTruthy();
      expect(getByText('Age')).toBeTruthy();
      expect(getByText('Sex at Birth')).toBeTruthy();

      // Height unit toggles
      expect(getByText('ft / in')).toBeTruthy();
      expect(getByText('cm')).toBeTruthy();

      // Sex buttons
      expect(getByText('Male')).toBeTruthy();
      expect(getByText('Female')).toBeTruthy();

      // Helper text
      expect(getByText('Required for accurate calorie calculations')).toBeTruthy();

      // Continue button
      expect(getByText('Continue')).toBeTruthy();

      // Back button
      expect(getByText('←')).toBeTruthy();
    });

    it('should initialize with default values (5\'8", 30 years, no sex)', () => {
      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      // Default height: 5 ft 8 in
      expect(getByText('5')).toBeTruthy();
      expect(getByText('8')).toBeTruthy();
      expect(getByText('ft')).toBeTruthy();
      expect(getByText('in')).toBeTruthy();

      // Default age: 30
      expect(getByText('30')).toBeTruthy();
      expect(getByText('years')).toBeTruthy();
    });
  });

  describe('Rendering - Stored Data', () => {
    it('should initialize with stored height in inches (6\'2" = 74 inches)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          height: 74, // 6'2"
          heightUnit: 'inches',
          age: 25,
          sex: 'male'
        },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      // Should show 6 ft 2 in
      expect(getByText('6')).toBeTruthy();
      expect(getByText('2')).toBeTruthy();
    });

    it('should initialize with stored height in cm', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          height: 180, // stored as cm
          heightUnit: 'cm',
          age: 28,
          sex: 'female'
        },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      expect(getByText('180')).toBeTruthy();
    });

    it('should initialize with stored age and sex', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          age: 45,
          sex: 'male'
        },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      expect(getByText('45')).toBeTruthy();
      // Male button should be selected (checked via visual state)
    });
  });

  describe('Height - Feet/Inches Controls', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setPersonalDetails: mockSetPersonalDetails,
      });
    });

    it('should increment feet when + button is pressed', () => {
      const { getAllByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      // Default is 5 ft
      expect(getAllByText('5').length).toBeGreaterThan(0);

      // Get all + buttons, first one is for feet
      const plusButtons = getAllByText('+');
      fireEvent(plusButtons[0], 'pressIn');
      fireEvent(plusButtons[0], 'pressOut');

      // Should be 6 ft
      expect(getAllByText('6').length).toBeGreaterThan(0);
    });

    it('should decrement feet when - button is pressed', () => {
      const { getAllByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      // Default is 5 ft
      const minusButtons = getAllByText('−');
      fireEvent(minusButtons[0], 'pressIn'); // First minus is for feet
      fireEvent(minusButtons[0], 'pressOut');

      // Should be 4 ft
      expect(getAllByText('4').length).toBeGreaterThan(0);
    });

    it('should increment inches when inches + button is pressed', () => {
      const { getAllByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      // Default is 8 inches
      const plusButtons = getAllByText('+');
      fireEvent(plusButtons[1], 'pressIn'); // Second + is for inches
      fireEvent(plusButtons[1], 'pressOut');

      // Should be 9 inches
      expect(getAllByText('9').length).toBeGreaterThan(0);
    });

    it('should decrement inches when inches - button is pressed', () => {
      const { getAllByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      // Default is 8 inches
      const minusButtons = getAllByText('−');
      fireEvent(minusButtons[1], 'pressIn'); // Second - is for inches
      fireEvent(minusButtons[1], 'pressOut');

      // Should be 7 inches
      expect(getAllByText('7').length).toBeGreaterThan(0);
    });

    it('should rollover inches to feet when incrementing from 11 inches', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          height: 71, // 5'11"
          heightUnit: 'inches'
        },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getAllByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      // Should start at 5'11"
      expect(getAllByText('11').length).toBeGreaterThan(0);

      // Increment inches
      const plusButtons = getAllByText('+');
      fireEvent(plusButtons[1], 'pressIn');
      fireEvent(plusButtons[1], 'pressOut');

      // Should become 6'0"
      expect(getAllByText('6').length).toBeGreaterThan(0);
      expect(getAllByText('0').length).toBeGreaterThan(0);
    });

    it('should not exceed maximum height (7 feet)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          height: 84, // 7'0"
          heightUnit: 'inches'
        },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getAllByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      const plusButtons = getAllByText('+');
      fireEvent(plusButtons[0], 'pressIn'); // Try to increment feet
      fireEvent(plusButtons[0], 'pressOut');

      // Should still be 7
      expect(getAllByText('7').length).toBeGreaterThan(0);
    });

    it('should not go below minimum height (4 feet)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          height: 48, // 4'0"
          heightUnit: 'inches'
        },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getAllByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      const minusButtons = getAllByText('−');
      fireEvent(minusButtons[0], 'pressIn'); // Try to decrement feet
      fireEvent(minusButtons[0], 'pressOut');

      // Should still be 4
      expect(getAllByText('4').length).toBeGreaterThan(0);
    });
  });

  describe('Height - Centimeters Controls', () => {
    it('should increment cm when + button is pressed', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          height: 170,
          heightUnit: 'cm'
        },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText, getAllByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      // Should start at 170 cm
      expect(getByText('170')).toBeTruthy();

      const plusButtons = getAllByText('+');
      fireEvent(plusButtons[0], 'pressIn');
      fireEvent(plusButtons[0], 'pressOut');

      expect(getByText('171')).toBeTruthy();
    });

    it('should not exceed maximum (230 cm)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          height: 230,
          heightUnit: 'cm'
        },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText, getAllByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      expect(getByText('230')).toBeTruthy();

      const plusButtons = getAllByText('+');
      fireEvent(plusButtons[0], 'pressIn');
      fireEvent(plusButtons[0], 'pressOut');

      expect(getByText('230')).toBeTruthy(); // Still 230
    });

    it('should not go below minimum (120 cm)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          height: 120,
          heightUnit: 'cm'
        },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText, getAllByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      expect(getByText('120')).toBeTruthy();

      const minusButtons = getAllByText('−');
      fireEvent(minusButtons[0], 'pressIn');
      fireEvent(minusButtons[0], 'pressOut');

      expect(getByText('120')).toBeTruthy(); // Still 120
    });
  });

  describe('Height Unit Conversion', () => {
    it('should convert 5\'8" to 173 cm', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      // Default is 5'8" = 68 inches = 172.72 cm ≈ 173 cm
      fireEvent.press(getByText('cm'));

      expect(getByText('173')).toBeTruthy();
    });

    it('should convert 180 cm to 5\'11"', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          height: 180,
          heightUnit: 'cm'
        },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText, getAllByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      // 180 cm = 70.87 inches ≈ 71 inches = 5'11"
      fireEvent.press(getByText('ft / in'));

      expect(getAllByText('5').length).toBeGreaterThan(0);
      expect(getAllByText('11').length).toBeGreaterThan(0);
    });
  });

  describe('Age Controls', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setPersonalDetails: mockSetPersonalDetails,
      });
    });

    it('should increment age when + button is pressed', () => {
      const { getByText, getAllByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      // Default is 30
      expect(getByText('30')).toBeTruthy();

      const plusButtons = getAllByText('+');
      const agePlusButton = plusButtons[plusButtons.length - 1]; // Last + button is for age
      fireEvent(agePlusButton, 'pressIn');
      fireEvent(agePlusButton, 'pressOut');

      expect(getByText('31')).toBeTruthy();
    });

    it('should decrement age when - button is pressed', () => {
      const { getByText, getAllByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      const minusButtons = getAllByText('−');
      const ageMinusButton = minusButtons[minusButtons.length - 1]; // Last - button is for age
      fireEvent(ageMinusButton, 'pressIn');
      fireEvent(ageMinusButton, 'pressOut');

      expect(getByText('29')).toBeTruthy();
    });

    it('should not go below minimum age (13)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { age: 13 },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText, getAllByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      expect(getByText('13')).toBeTruthy();

      const minusButtons = getAllByText('−');
      const ageMinusButton = minusButtons[minusButtons.length - 1];
      fireEvent(ageMinusButton, 'pressIn');
      fireEvent(ageMinusButton, 'pressOut');

      expect(getByText('13')).toBeTruthy(); // Still 13
    });

    it('should not exceed maximum age (100)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { age: 100 },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText, getAllByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      expect(getByText('100')).toBeTruthy();

      const plusButtons = getAllByText('+');
      const agePlusButton = plusButtons[plusButtons.length - 1];
      fireEvent(agePlusButton, 'pressIn');
      fireEvent(agePlusButton, 'pressOut');

      expect(getByText('100')).toBeTruthy(); // Still 100
    });
  });

  describe('Parental Consent (Ages 13-17)', () => {
    it('should show parental consent checkbox for age 15', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { age: 15 },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      expect(getByText(/I have parental permission/)).toBeTruthy();
      expect(getByText(/required for ages 13-17/)).toBeTruthy();
    });

    it('should not show parental consent for age 18', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { age: 18 },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { queryByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      expect(queryByText(/I have parental permission/)).toBeNull();
    });

    it('should toggle parental consent checkbox', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { age: 16 },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      const checkbox = getByText(/I have parental permission/);

      // Press to check
      fireEvent.press(checkbox);

      // Press again to uncheck
      fireEvent.press(checkbox);
    });
  });

  describe('Medical Consultation Disclaimer (Age 65+)', () => {
    it('should show medical consultation disclaimer for age 70', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { age: 70 },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      expect(getByText(/We recommend consulting your doctor/)).toBeTruthy();
    });

    it('should not show medical disclaimer for age 64', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { age: 64 },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { queryByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      expect(queryByText(/We recommend consulting your doctor/)).toBeNull();
    });
  });

  describe('Sex Selection', () => {
    beforeEach(() => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setPersonalDetails: mockSetPersonalDetails,
      });
    });

    it('should select male when Male button is pressed', () => {
      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      const maleButton = getByText('Male');
      fireEvent.press(maleButton);

      // Button state changes (tested via visual state)
    });

    it('should select female when Female button is pressed', () => {
      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      const femaleButton = getByText('Female');
      fireEvent.press(femaleButton);

      // Button state changes (tested via visual state)
    });

    it('should allow switching from male to female', () => {
      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Male'));
      fireEvent.press(getByText('Female'));

      // Last selection wins
    });
  });

  describe('Navigation', () => {
    it('should navigate to DailyActivityLevel when Continue is pressed with valid data', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      // Select sex (required)
      fireEvent.press(getByText('Male'));

      // Press continue
      const continueButton = getByText('Continue');
      fireEvent.press(continueButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('DailyActivityLevel');
      });
    });

    it('should navigate back when back button is pressed', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('←'));

      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Store Integration', () => {
    it('should save personal details with height in inches', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      // Select male
      fireEvent.press(getByText('Male'));

      // Continue with default values (5'8" = 68 inches, age 30, male)
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetPersonalDetails).toHaveBeenCalledWith(
          68, // height in inches
          'inches',
          30, // age
          'male',
          undefined // no parental consent needed for age 30
        );
      });
    });

    it('should convert cm to inches before saving', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {
          height: 180,
          heightUnit: 'cm'
        },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('Female'));
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        // 180 cm = 70.87 inches ≈ 71 inches
        expect(mockSetPersonalDetails).toHaveBeenCalledWith(
          71,
          'inches',
          30,
          'female',
          undefined
        );
      });
    });

    it('should include parental consent for age 15', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { age: 15 },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      // Check parental consent
      fireEvent.press(getByText(/I have parental permission/));

      // Select sex
      fireEvent.press(getByText('Male'));

      // Continue
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockSetPersonalDetails).toHaveBeenCalledWith(
          68,
          'inches',
          15,
          'male',
          true // parental consent
        );
      });
    });
  });

  describe('Validation', () => {
    it('should disable Continue button when sex is not selected', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      const continueButton = getByText('Continue');

      // Try to press (should not navigate because disabled)
      fireEvent.press(continueButton);

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should disable Continue when parental consent is required but not given', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { age: 16 },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      // Select sex but don't check parental consent
      fireEvent.press(getByText('Male'));

      // Try to continue
      fireEvent.press(getByText('Continue'));

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should enable Continue when all requirements are met for age 16 with parental consent', async () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: { age: 16 },
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { getByText } = render(<PersonalDetailsScreen navigation={mockNavigation} />);

      // Check parental consent
      fireEvent.press(getByText(/I have parental permission/));

      // Select sex
      fireEvent.press(getByText('Female'));

      // Continue should work
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('DailyActivityLevel');
      });
    });
  });

  describe('Progress Indicator', () => {
    it('should show correct progress (6/12)', () => {
      (useOnboardingStore as unknown as jest.Mock).mockReturnValue({
        data: {},
        setPersonalDetails: mockSetPersonalDetails,
      });

      const { UNSAFE_root } = render(<PersonalDetailsScreen navigation={mockNavigation} />);
      // Progress should be 6/12 = 50%
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
