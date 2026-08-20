/**
 * Mock Payment Service
 * Development-only implementation for testing paywall flow
 *
 * IMPORTANT: This is a TEMPORARY mock for development.
 * DO NOT use in production. Replace with RevenueCatPaymentService.
 *
 * Usage:
 * - Set BYPASS_PAYWALL_IN_DEV = true to skip paywall entirely
 * - Set BYPASS_PAYWALL_IN_DEV = false to test paywall UI with mock purchases
 */

import {
  PaymentService,
  SubscriptionPackage,
  CustomerInfo,
  PurchaseResult,
} from './types';

/**
 * MockPaymentService
 *
 * Simulates payment operations for development without RevenueCat SDK.
 * All methods return hardcoded/mock data after a realistic delay.
 */
export class MockPaymentService implements PaymentService {
  private mockSubscribed: boolean = false;

  async initialize(): Promise<void> {
    console.log('🔧 [MockPaymentService] Initializing (no-op in dev)');
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  async getPackages(): Promise<SubscriptionPackage[]> {
    console.log('🔧 [MockPaymentService] Fetching packages (mock data)');

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock subscription packages matching Q1 spec
    return [
      {
        identifier: 'monthly',
        packageType: 'monthly',
        product: {
          identifier: 'com.weightgpt.monthly',
          description: 'Monthly subscription to WeightGPT',
          title: 'Monthly',
          price: 9.99,
          priceString: '$9.99',
          currencyCode: 'USD',
        },
        offeringIdentifier: 'default',
      },
      {
        identifier: 'quarterly',
        packageType: 'quarterly',
        product: {
          identifier: 'com.weightgpt.quarterly',
          description: 'Quarterly subscription to WeightGPT (Save 17%)',
          title: 'Quarterly',
          price: 24.99,
          priceString: '$24.99',
          currencyCode: 'USD',
        },
        offeringIdentifier: 'default',
      },
      {
        identifier: 'annual',
        packageType: 'annual',
        product: {
          identifier: 'com.weightgpt.annual',
          description: 'Annual subscription to WeightGPT (Best Value - Save 33%)',
          title: 'Annual',
          price: 79.99,
          priceString: '$79.99',
          currencyCode: 'USD',
        },
        offeringIdentifier: 'default',
      },
    ];
  }

  async purchasePackage(pkg: SubscriptionPackage): Promise<PurchaseResult> {
    console.log(
      `🔧 [MockPaymentService] Purchasing ${pkg.packageType} package (mock)`
    );

    // Simulate purchase delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock successful purchase
    this.mockSubscribed = true;

    const mockCustomerInfo: CustomerInfo = {
      activeSubscriptions: [pkg.product.identifier],
      allPurchasedProductIdentifiers: [pkg.product.identifier],
      entitlements: {
        active: {
          premium: {
            identifier: 'premium',
            isActive: true,
            willRenew: true,
            productIdentifier: pkg.product.identifier,
            expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          },
        },
        all: {
          premium: {
            identifier: 'premium',
            isActive: true,
            willRenew: true,
            productIdentifier: pkg.product.identifier,
            expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      originalAppUserId: 'mock_user_id',
      requestDate: new Date(),
    };

    return {
      customerInfo: mockCustomerInfo,
      productIdentifier: pkg.product.identifier,
      userCancelled: false,
    };
  }

  async restorePurchases(): Promise<CustomerInfo> {
    console.log('🔧 [MockPaymentService] Restoring purchases (mock)');

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return mock customer info (subscribed if previously "purchased")
    return {
      activeSubscriptions: this.mockSubscribed
        ? ['com.weightgpt.annual']
        : [],
      allPurchasedProductIdentifiers: this.mockSubscribed
        ? ['com.weightgpt.annual']
        : [],
      entitlements: {
        active: this.mockSubscribed
          ? {
              premium: {
                identifier: 'premium',
                isActive: true,
                willRenew: true,
                productIdentifier: 'com.weightgpt.annual',
                expirationDate: new Date(
                  Date.now() + 365 * 24 * 60 * 60 * 1000
                ),
              },
            }
          : {},
        all: this.mockSubscribed
          ? {
              premium: {
                identifier: 'premium',
                isActive: true,
                willRenew: true,
                productIdentifier: 'com.weightgpt.annual',
                expirationDate: new Date(
                  Date.now() + 365 * 24 * 60 * 60 * 1000
                ),
              },
            }
          : {},
      },
      originalAppUserId: 'mock_user_id',
      requestDate: new Date(),
    };
  }

  async getCustomerInfo(): Promise<CustomerInfo> {
    console.log('🔧 [MockPaymentService] Getting customer info (mock)');

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      activeSubscriptions: this.mockSubscribed
        ? ['com.weightgpt.annual']
        : [],
      allPurchasedProductIdentifiers: this.mockSubscribed
        ? ['com.weightgpt.annual']
        : [],
      entitlements: {
        active: this.mockSubscribed
          ? {
              premium: {
                identifier: 'premium',
                isActive: true,
                willRenew: true,
                productIdentifier: 'com.weightgpt.annual',
                expirationDate: new Date(
                  Date.now() + 365 * 24 * 60 * 60 * 1000
                ),
              },
            }
          : {},
        all: this.mockSubscribed
          ? {
              premium: {
                identifier: 'premium',
                isActive: true,
                willRenew: true,
                productIdentifier: 'com.weightgpt.annual',
                expirationDate: new Date(
                  Date.now() + 365 * 24 * 60 * 60 * 1000
                ),
              },
            }
          : {},
      },
      originalAppUserId: 'mock_user_id',
      requestDate: new Date(),
    };
  }

  async isSubscribed(): Promise<boolean> {
    console.log(
      `🔧 [MockPaymentService] Checking subscription status (mock): ${this.mockSubscribed}`
    );
    return this.mockSubscribed;
  }

  /**
   * Dev-only method to reset subscription state
   * Useful for testing paywall flow multiple times
   */
  resetMockState(): void {
    console.log('🔧 [MockPaymentService] Resetting mock subscription state');
    this.mockSubscribed = false;
  }
}

// Export singleton instance
export const mockPaymentService = new MockPaymentService();
