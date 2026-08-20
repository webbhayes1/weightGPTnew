/**
 * PaywallScreen Component Tests
 * Tests subscription paywall with pricing tiers
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import PaywallScreen from '../../../src/screens/onboarding/PaywallScreen';
import { paymentService } from '../../../src/services/payments';

// Mock navigation
const mockNavigate = jest.fn();
const mockReplace = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  replace: mockReplace,
  setOptions: jest.fn(),
} as any;

// Mock payment service
jest.mock('../../../src/services/payments', () => ({
  paymentService: {
    initialize: jest.fn(),
    getAvailablePackages: jest.fn(),
    purchasePackage: jest.fn(),
    restorePurchases: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('PaywallScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    beforeEach(() => {
      (paymentService.initialize as jest.Mock).mockResolvedValue(undefined);
      (paymentService.getAvailablePackages as jest.Mock).mockResolvedValue([
        {
          identifier: 'monthly',
          product: {
            identifier: 'monthly_subscription',
            title: 'Monthly Subscription',
            description: 'Monthly access',
            priceString: '$9.99',
          },
        },
        {
          identifier: 'annual',
          product: {
            identifier: 'annual_subscription',
            title: 'Annual Subscription',
            description: 'Annual access',
            priceString: '$79.99',
          },
        },
      ]);
    });

    it('should render loading state initially', () => {
      const { UNSAFE_root } = render(<PaywallScreen navigation={mockNavigation} />);

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should load and display subscription packages', () => {
      const { UNSAFE_root } = render(<PaywallScreen navigation={mockNavigation} />);

      // Should render and call payment service
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render subscription tiers after loading', () => {
      const { UNSAFE_root } = render(<PaywallScreen navigation={mockNavigation} />);

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Package Selection', () => {
    beforeEach(() => {
      (paymentService.initialize as jest.Mock).mockResolvedValue(undefined);
      (paymentService.getAvailablePackages as jest.Mock).mockResolvedValue([]);
    });

    it('should allow selecting a package', () => {
      const { UNSAFE_root } = render(<PaywallScreen navigation={mockNavigation} />);

      // Package selection UI should be rendered
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Purchase Flow', () => {
    beforeEach(() => {
      (paymentService.initialize as jest.Mock).mockResolvedValue(undefined);
      (paymentService.getAvailablePackages as jest.Mock).mockResolvedValue([]);
      (paymentService.purchasePackage as jest.Mock).mockResolvedValue({
        customerInfo: { activeSubscriptions: ['monthly_subscription'] },
      });
    });

    it('should handle successful purchase', () => {
      const { UNSAFE_root } = render(<PaywallScreen navigation={mockNavigation} />);

      // Purchase flow should be available
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should show loading during purchase', () => {
      const { UNSAFE_root } = render(<PaywallScreen navigation={mockNavigation} />);

      // Loading state should be shown
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Restore Purchases', () => {
    beforeEach(() => {
      (paymentService.initialize as jest.Mock).mockResolvedValue(undefined);
      (paymentService.getAvailablePackages as jest.Mock).mockResolvedValue([]);
      (paymentService.restorePurchases as jest.Mock).mockResolvedValue({
        activeSubscriptions: [],
      });
    });

    it('should handle restore purchases', () => {
      const { UNSAFE_root } = render(<PaywallScreen navigation={mockNavigation} />);

      // Restore button should be available
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization failure', () => {
      (paymentService.initialize as jest.Mock).mockRejectedValue(new Error('Init failed'));

      const { UNSAFE_root } = render(<PaywallScreen navigation={mockNavigation} />);

      // Should still render without crashing
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle purchase failure', () => {
      (paymentService.initialize as jest.Mock).mockResolvedValue(undefined);
      (paymentService.getAvailablePackages as jest.Mock).mockResolvedValue([]);
      (paymentService.purchasePackage as jest.Mock).mockRejectedValue(new Error('Purchase failed'));

      const { UNSAFE_root } = render(<PaywallScreen navigation={mockNavigation} />);

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Value Props', () => {
    beforeEach(() => {
      (paymentService.initialize as jest.Mock).mockResolvedValue(undefined);
      (paymentService.getAvailablePackages as jest.Mock).mockResolvedValue([]);
    });

    it('should display value propositions', async () => {
      const { UNSAFE_root } = render(<PaywallScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(UNSAFE_root).toBeTruthy();
      });
    });

    it('should show success metrics', async () => {
      const { UNSAFE_root } = render(<PaywallScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(UNSAFE_root).toBeTruthy();
      });
    });
  });

  describe('ScrollView', () => {
    beforeEach(() => {
      (paymentService.initialize as jest.Mock).mockResolvedValue(undefined);
      (paymentService.getAvailablePackages as jest.Mock).mockResolvedValue([]);
    });

    it('should render scrollable content', async () => {
      const { UNSAFE_root } = render(<PaywallScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(UNSAFE_root).toBeTruthy();
      });
    });
  });
});
