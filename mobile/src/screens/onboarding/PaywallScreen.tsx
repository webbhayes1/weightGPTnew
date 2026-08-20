/**
 * Paywall Screen
 * Modern iOS-style modal with premium subscription tiers
 * Features: Frosted glass design, success metrics, value props, 3 pricing tiers
 *
 * DEVELOPMENT MODE:
 * - Set BYPASS_PAYWALL_IN_DEV = true to skip paywall (navigate to Home)
 * - Set BYPASS_PAYWALL_IN_DEV = false to test paywall UI with mock purchases
 *
 * PRODUCTION:
 * - BYPASS_PAYWALL_IN_DEV will be false
 * - paymentService will use RevenueCat (when integrated)
 * - Real purchases will go through Apple/Google payment systems
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types/onboarding.types';
import { paymentService, SubscriptionPackage } from '../../services/payments';
import tokens from '../../theme/tokens';

/**
 * DEV BYPASS FLAG
 *
 * Set to true: Skip paywall entirely, navigate directly to Home
 * Set to false: Show paywall UI, test with mock purchases
 *
 * TODO (Production): Remove this flag or set to false permanently
 */
const BYPASS_PAYWALL_IN_DEV = true;

type PaywallNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  'Paywall'
>;

interface PaywallScreenProps {
  navigation: PaywallNavigationProp;
}

export default function PaywallScreen({ navigation }: PaywallScreenProps) {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<SubscriptionPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    // Initialize payment service and load packages
    initializePaywall();
  }, []);

  const initializePaywall = async () => {
    console.log('🔧 [Paywall] Starting initialization...');
    try {
      // DEV BYPASS: Skip paywall entirely in development
      if (__DEV__ && BYPASS_PAYWALL_IN_DEV) {
        console.log('🔧 [Paywall] BYPASSED - Navigating to AccountSetup (dev mode)');
        // Navigate to AccountSetup for account creation
        navigation.replace('AccountSetup');
        return;
      }

      console.log('🔧 [Paywall] Setting loading to true');
      setLoading(true);

      // Initialize payment service
      console.log('🔧 [Paywall] Initializing payment service...');
      await paymentService.initialize();
      console.log('🔧 [Paywall] Payment service initialized');

      // Fetch subscription packages
      console.log('🔧 [Paywall] Fetching packages...');
      const availablePackages = await paymentService.getPackages();
      console.log('🔧 [Paywall] Packages fetched:', availablePackages.length);
      setPackages(availablePackages);

      // Pre-select annual package (best value)
      const annualPkg = availablePackages.find((p) => p.packageType === 'annual');
      console.log('🔧 [Paywall] Annual package:', annualPkg ? 'found' : 'not found');
      if (annualPkg) {
        setSelectedPackage(annualPkg);
      }

      console.log('🔧 [Paywall] Setting loading to false');
      setLoading(false);
      console.log('🔧 [Paywall] Initialization complete!');
    } catch (error) {
      console.error('[Paywall] Failed to initialize:', error);
      console.error('[Paywall] Error details:', JSON.stringify(error));
      setLoading(false);
      Alert.alert(
        'Error',
        'Failed to load subscription options. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      Alert.alert('Error', 'Please select a subscription plan');
      return;
    }

    try {
      setPurchasing(true);

      const result = await paymentService.purchasePackage(selectedPackage);

      if (result.userCancelled) {
        console.log('[Paywall] User cancelled purchase');
        setPurchasing(false);
        return;
      }

      // Purchase successful!
      console.log('[Paywall] Purchase successful:', result.productIdentifier);

      // Show success message
      Alert.alert(
        'Welcome to WeightGPT! 🎉',
        "You're all set! Your 7-day free trial has started.",
        [
          {
            text: 'Get Started',
            onPress: () => {
              // Navigate to AccountSetup for account creation
              navigation.replace('AccountSetup');
            },
          },
        ]
      );

      setPurchasing(false);
    } catch (error: any) {
      console.error('[Paywall] Purchase failed:', error);
      setPurchasing(false);

      Alert.alert(
        'Purchase Failed',
        error.message || 'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  /**
   * TODO: Add "Restore Purchases" button to UI
   * Apple App Store requires this for subscription apps
   * This function is ready to use - just needs a button to call it
   */
  // const handleRestorePurchases = async () => {
  //   try {
  //     const customerInfo = await paymentService.restorePurchases();
  //
  //     if (customerInfo.activeSubscriptions.length > 0) {
  //       // User has active subscription
  //       Alert.alert(
  //         'Purchases Restored',
  //         'Your subscription has been restored!',
  //         [
  //           {
  //             text: 'Continue',
  //             onPress: () => {
  //               // Navigate to AccountSetup for account creation
  //               navigation.replace('AccountSetup');
  //             },
  //           },
  //         ]
  //       );
  //     } else {
  //       // No active subscriptions found
  //       Alert.alert(
  //         'No Purchases Found',
  //         'No active subscriptions found. If you believe this is an error, please contact support.',
  //         [{ text: 'OK' }]
  //       );
  //     }
  //   } catch (error) {
  //     console.error('[Paywall] Restore failed:', error);
  //
  //     Alert.alert(
  //       'Restore Failed',
  //       'Failed to restore purchases. Please try again.',
  //       [{ text: 'OK' }]
  //     );
  //   }
  // };

  // Pricing tiers as specified
  const PRICING_TIERS = [
    { id: 'monthly', label: 'Monthly', price: '$12.99/month', badge: null },
    { id: 'quarterly', label: 'Quarterly', price: '$24.99/quarter', badge: 'Save 35%' },
    { id: 'annual', label: 'Annual', price: '$79.99/year', badge: 'Best Value' },
  ];

  // Value props
  const VALUE_PROPS = [
    'Personalized meal plans tailored to your goals',
    'Automated grocery lists for easy shopping',
    'Precise calorie & macro targets',
    'Custom workout programs',
    'Progress tracking & analytics',
    'Meal feedback learning (improves weekly)',
    'Recipe database with 1000+ options',
    'Priority support & coaching',
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.nutrition.blue} />
          <Text style={styles.loadingText}>Loading subscription options...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Section */}
        <View>
          {/* Success Metrics - At top */}
          <View style={styles.metricsSection}>
            <Text style={styles.metricTextHighlight}>92% hit their goals in 90 days</Text>
            <View style={styles.secondaryMetrics}>
              <Text style={styles.metricText}>87% love our meal plans</Text>
              <Text style={styles.metricSeparator}>•</Text>
              <Text style={styles.metricText}>4.8★ rating</Text>
            </View>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Unlock Your Full Plan</Text>
            <Text style={styles.subtitle}>Get complete access to:</Text>
          </View>

          {/* Value Props */}
          <View style={styles.valueStack}>
            {VALUE_PROPS.map((prop, index) => (
              <View key={index} style={styles.valueRow}>
                <Text style={styles.valueIcon}>✓</Text>
                <Text style={styles.valueText}>{prop}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Section - Pricing, Button, Fine Print */}
        <View>
          {/* Pricing Tiers */}
          <View style={styles.pricingSection}>
            {PRICING_TIERS.map((tier) => (
              <TouchableOpacity
                key={tier.id}
                style={[
                  styles.pricingTier,
                  selectedPackage?.identifier.includes(tier.id) && styles.pricingTierSelected,
                ]}
                onPress={() => {
                  // Find matching package
                  const pkg = packages.find(p => p.packageType === tier.id);
                  if (pkg) setSelectedPackage(pkg);
                }}
                activeOpacity={0.7}
              >
                {tier.badge && (
                  <View style={styles.tierBadge}>
                    <Text style={styles.tierBadgeText}>{tier.badge}</Text>
                  </View>
                )}
                <Text style={styles.tierLabel}>{tier.label}</Text>
                <Text style={styles.tierPrice}>{tier.price}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CTA Button - Apple Pay Style */}
          <TouchableOpacity
            style={[styles.unlockButton, purchasing && styles.unlockButtonDisabled]}
            onPress={handlePurchase}
            disabled={purchasing || !selectedPackage}
            activeOpacity={0.8}
          >
            <Text style={styles.unlockButtonText}>
              {purchasing ? 'Processing...' : 'Unlock My Plan'}
            </Text>
          </TouchableOpacity>

          {/* Fine print */}
          <Text style={styles.finePrint}>
            7-day free trial • Cancel anytime • Auto-renews unless cancelled
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: tokens.spacing.lg,
    backgroundColor: tokens.colors.background.white,
  },
  loadingText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: tokens.spacing.xl,
    paddingTop: tokens.spacing['2xl'],
    paddingBottom: tokens.spacing.lg,
  },
  // Success Metrics
  metricsSection: {
    alignItems: 'center',
    marginBottom: tokens.spacing['2xl'],
    gap: tokens.spacing.xs,
  },
  metricTextHighlight: {
    ...tokens.typography.caption.m,
    fontWeight: '700' as const,
    color: tokens.colors.text.primary,
    textAlign: 'center' as const,
  },
  secondaryMetrics: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  metricText: {
    ...tokens.typography.caption.m,
    fontWeight: '700' as const,
    color: tokens.colors.text.primary,
  },
  metricSeparator: {
    ...tokens.typography.caption.m,
    color: tokens.colors.text.tertiary,
    marginHorizontal: tokens.spacing.xs,
  },
  // Header
  header: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  title: {
    fontSize: 34,
    fontWeight: '700' as const,
    color: tokens.colors.text.primary,
    textAlign: 'center' as const,
    marginBottom: tokens.spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    textAlign: 'center' as const,
  },
  // Value Props
  valueStack: {
    marginBottom: tokens.spacing.xl,
    gap: tokens.spacing.md,
  },
  valueRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start',
    gap: tokens.spacing.md,
  },
  valueIcon: {
    fontSize: 16,
    color: tokens.colors.progress.emerald,
    marginTop: 2,
  },
  valueText: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.primary,
    flex: 1,
    lineHeight: 22,
  },
  // Pricing Tiers
  pricingSection: {
    flexDirection: 'row' as const,
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  pricingTier: {
    flex: 1,
    backgroundColor: tokens.colors.background.offWhite,
    borderRadius: tokens.borderRadius.sm,
    padding: tokens.spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
    position: 'relative' as const,
  },
  pricingTierSelected: {
    backgroundColor: tokens.colors.nutrition.blue + '15',
    borderColor: tokens.colors.nutrition.blue,
  },
  tierBadge: {
    position: 'absolute' as const,
    top: -10,
    backgroundColor: tokens.colors.progress.emerald,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.xs,
  },
  tierBadgeText: {
    ...tokens.typography.caption.s,
    fontWeight: '700' as const,
    color: tokens.colors.text.white,
  },
  tierLabel: {
    ...tokens.typography.body.s,
    fontWeight: '600' as const,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  tierPrice: {
    ...tokens.typography.caption.m,
    fontWeight: '500' as const,
    color: tokens.colors.text.secondary,
  },
  // CTA Button - Apple Pay Style
  unlockButton: {
    backgroundColor: '#000000',
    borderRadius: tokens.borderRadius.sm,
    paddingVertical: tokens.spacing.lg,
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
    ...tokens.shadows.button,
  },
  unlockButtonDisabled: {
    opacity: 0.6,
  },
  unlockButtonText: {
    ...tokens.typography.button.l,
    fontWeight: '600' as const,
    color: tokens.colors.text.white,
  },
  // Continue without premium
  continueWithoutLink: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm,
  },
  continueWithoutText: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.tertiary,
    textDecorationLine: 'underline' as const,
  },
  // Fine print
  finePrint: {
    ...tokens.typography.caption.s,
    color: tokens.colors.text.tertiary,
    textAlign: 'center' as const,
    lineHeight: 14,
  },
});
