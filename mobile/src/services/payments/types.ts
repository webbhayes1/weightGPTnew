/**
 * Payment Service Types
 * Abstraction layer for subscription/payment operations
 *
 * FUTURE: This interface will be implemented by RevenueCat service
 * CURRENT: Implemented by mock service for development
 */

export interface SubscriptionPackage {
  identifier: string;
  packageType: 'monthly' | 'quarterly' | 'annual';
  product: {
    identifier: string;
    description: string;
    title: string;
    price: number;
    priceString: string;
    currencyCode: string;
  };
  offeringIdentifier: string;
}

export interface CustomerInfo {
  activeSubscriptions: string[];
  allPurchasedProductIdentifiers: string[];
  entitlements: {
    active: Record<string, EntitlementInfo>;
    all: Record<string, EntitlementInfo>;
  };
  originalAppUserId: string;
  requestDate: Date;
}

export interface EntitlementInfo {
  identifier: string;
  isActive: boolean;
  willRenew: boolean;
  productIdentifier: string;
  expirationDate: Date | null;
}

export interface PurchaseResult {
  customerInfo: CustomerInfo;
  productIdentifier: string;
  userCancelled: boolean;
}

/**
 * PaymentService Interface
 *
 * All payment operations go through this interface.
 * This allows us to swap implementations without changing screen code.
 *
 * IMPLEMENTATIONS:
 * - MockPaymentService (current - for development)
 * - RevenueCatPaymentService (future - real payments)
 */
export interface PaymentService {
  /**
   * Initialize the payment service
   * RevenueCat: Calls Purchases.configure()
   * Mock: Does nothing
   */
  initialize(): Promise<void>;

  /**
   * Get available subscription packages
   * RevenueCat: Fetches from RevenueCat offerings
   * Mock: Returns hardcoded packages
   */
  getPackages(): Promise<SubscriptionPackage[]>;

  /**
   * Purchase a subscription package
   * RevenueCat: Calls Purchases.purchasePackage()
   * Mock: Simulates delay and returns success
   */
  purchasePackage(pkg: SubscriptionPackage): Promise<PurchaseResult>;

  /**
   * Restore previous purchases
   * RevenueCat: Calls Purchases.restorePurchases()
   * Mock: Returns mock customer info
   */
  restorePurchases(): Promise<CustomerInfo>;

  /**
   * Get current customer/subscription status
   * RevenueCat: Calls Purchases.getCustomerInfo()
   * Mock: Returns mock status
   */
  getCustomerInfo(): Promise<CustomerInfo>;

  /**
   * Check if user has active subscription
   * RevenueCat: Checks CustomerInfo.entitlements.active
   * Mock: Returns mock value
   */
  isSubscribed(): Promise<boolean>;
}
