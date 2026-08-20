/**
 * Payment Service Entry Point
 *
 * This file exports the active PaymentService implementation.
 * Switch between Mock and RevenueCat here.
 *
 * CURRENT STATE (Phase 2.5):
 * - Using MockPaymentService for development
 * - No RevenueCat SDK installed yet
 *
 * FUTURE (Phase 3+):
 * - Install react-native-purchases
 * - Create RevenueCatPaymentService.ts (implements PaymentService interface)
 * - Update USE_REVENUECAT flag to true
 * - No changes needed in PaywallScreen or other consuming code!
 *
 * HOW TO INTEGRATE REVENUECAT LATER:
 *
 * 1. Install SDK:
 *    npm install react-native-purchases
 *    cd ios && pod install && cd ..
 *
 * 2. Create RevenueCatPaymentService.ts:
 *    - Import Purchases from 'react-native-purchases'
 *    - Implement PaymentService interface
 *    - Map RevenueCat types to our types
 *
 * 3. Update this file:
 *    - Change USE_REVENUECAT to true
 *    - Or use: __DEV__ ? mockPaymentService : revenueCatPaymentService
 *
 * 4. Done! All screens will automatically use real payments.
 */

import { PaymentService } from './types';
import { mockPaymentService } from './MockPaymentService';

// TODO (Phase 3+): Import RevenueCat service when ready
// import { revenueCatPaymentService } from './RevenueCatPaymentService';

/**
 * Feature flag to control which payment service to use
 *
 * DEVELOPMENT: Set to false (uses MockPaymentService)
 * PRODUCTION: Set to true (uses RevenueCatPaymentService)
 *
 * NOTE: RevenueCatPaymentService not yet implemented.
 * When implementing, you can also use: const USE_REVENUECAT = !__DEV__
 */
const USE_REVENUECAT = false;

/**
 * Active payment service instance
 *
 * This is what all screens/components should import and use.
 * The implementation switches based on USE_REVENUECAT flag.
 */
export const paymentService: PaymentService = USE_REVENUECAT
  ? // TODO: Replace with actual RevenueCat service when implemented
    // revenueCatPaymentService
    mockPaymentService // Fallback to mock if RevenueCat not ready
  : mockPaymentService;

// Re-export types for convenience
export * from './types';

/**
 * INTEGRATION CHECKLIST (For Future Session):
 *
 * [ ] Install react-native-purchases npm package
 * [ ] Run pod install (iOS)
 * [ ] Create RevenueCatPaymentService.ts
 * [ ] Implement all PaymentService interface methods
 * [ ] Add RevenueCat API keys to .env
 * [ ] Update USE_REVENUECAT flag above
 * [ ] Test purchase flow on iOS/Android
 * [ ] Set up RevenueCat webhooks (backend)
 * [ ] Test restore purchases flow
 *
 * IMPORTANT: The PaywallScreen and all consuming code will work
 * with ZERO changes once RevenueCat is integrated. Just update
 * the USE_REVENUECAT flag and you're done!
 */
