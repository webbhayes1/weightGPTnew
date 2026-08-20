/**
 * Grocery List Screen
 * Q3.4: Weekly Planning & Grocery Management
 *
 * Features:
 * - View grocery list grouped by category
 * - Check/uncheck items as purchased
 * - Generate list from current meal plan
 * - Add custom items
 * - Delete items
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HomeStackScreenProps } from '../../types/navigation.types';
import {
  useGroceryList,
  useGenerateGroceryList,
  useUpdateGroceryItem,
  useDeleteGroceryItem,
  getCategoryDisplayName,
} from '../../hooks/useGroceryList';
import { useToast } from '../../components/common/Toast';
import tokens from '../../theme/tokens';

type Props = HomeStackScreenProps<'GroceryList'>;

export default function GroceryListScreen({ navigation }: Props) {
  const { data, isLoading, refetch } = useGroceryList();
  const generateMutation = useGenerateGroceryList();
  const updateMutation = useUpdateGroceryItem();
  const deleteMutation = useDeleteGroceryItem();
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleGenerate = () => {
    console.log('[GroceryListScreen] Generate button pressed');
    Alert.alert(
      'Generate Grocery List',
      'This will create a new grocery list from your current meal plan. Any custom items will be preserved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: async () => {
            console.log('[GroceryListScreen] User confirmed generation');
            try {
              console.log('[GroceryListScreen] Calling generateMutation.mutateAsync()');
              const result = await generateMutation.mutateAsync();
              console.log('[GroceryListScreen] Generation result:', result);
              showToast('Grocery list generated!', 'success');
            } catch (error) {
              console.error('[GroceryListScreen] Generation error:', error);
              showToast('Failed to generate list', 'error');
            }
          },
        },
      ]
    );
  };

  const handleToggleItem = async (itemId: string, currentState: boolean) => {
    try {
      await updateMutation.mutateAsync({
        itemId,
        updates: { purchased: !currentState },
      });
    } catch (error) {
      showToast('Failed to update item', 'error');
    }
  };

  const handleDeleteItem = (itemId: string, itemName: string) => {
    Alert.alert('Delete Item', `Remove "${itemName}" from your grocery list?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(itemId);
            showToast('Item deleted', 'success');
          } catch (error) {
            showToast('Failed to delete item', 'error');
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFB347" />
          <Text style={styles.loadingText}>Loading grocery list...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const hasItems = data && data.total > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        {/* Header Stats */}
        {hasItems && (
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{data.total}</Text>
              <Text style={styles.statLabel}>Total Items</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{data.checked}</Text>
              <Text style={styles.statLabel}>Checked</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {data.total > 0 ? Math.round((data.checked / data.total) * 100) : 0}%
              </Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
          </View>
        )}

        {/* Generate Button */}
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerate}
          disabled={generateMutation.isPending}
        >
          <Ionicons name="sparkles" size={20} color="#fff" />
          <Text style={styles.generateButtonText}>
            {hasItems ? 'Regenerate List' : 'Generate List'}
          </Text>
        </TouchableOpacity>

        {/* Grocery List */}
        {!hasItems ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={64} color={tokens.colors.text.secondary} />
            <Text style={styles.emptyTitle}>No Grocery List Yet</Text>
            <Text style={styles.emptyText}>
              Tap "Generate List" to create a grocery list from your meal plan for this week.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          >
            {Object.entries(data.items).map(([category, items]) => (
              <View key={category} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>{getCategoryDisplayName(category)}</Text>
                {items.map((item: any) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.itemCard,
                      item.purchased && styles.itemCardPurchased,
                    ]}
                    onPress={() => handleToggleItem(item.id, item.purchased)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.itemLeft}>
                      <View
                        style={[
                          styles.checkbox,
                          item.purchased && styles.checkboxChecked,
                        ]}
                      >
                        {item.purchased && (
                          <Ionicons name="checkmark" size={16} color="#fff" />
                        )}
                      </View>
                      <View style={styles.itemInfo}>
                        <Text
                          style={[
                            styles.itemName,
                            item.purchased && styles.itemNamePurchased,
                          ]}
                        >
                          {item.itemName}
                        </Text>
                        <Text style={styles.itemQuantity}>
                          {item.quantity} {item.unit}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteItem(item.id, item.itemName)}
                      style={styles.deleteButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={tokens.colors.text.secondary}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background.offWhite,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  loadingText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.background.white,
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...tokens.typography.heading.h2,
    fontSize: 24,
    color: tokens.colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: tokens.colors.borders.light,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFB347',
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
    paddingVertical: 14,
    borderRadius: 12,
  },
  generateButtonText: {
    ...tokens.typography.body.l,
    fontWeight: '600' as const,
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xl,
    gap: tokens.spacing.md,
  },
  emptyTitle: {
    ...tokens.typography.heading.h2,
    fontSize: 20,
    color: tokens.colors.text.primary,
    textAlign: 'center',
  },
  emptyText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    maxWidth: 300,
  },
  listContainer: {
    flex: 1,
  },
  categorySection: {
    marginBottom: tokens.spacing.lg,
  },
  categoryTitle: {
    ...tokens.typography.heading.h3,
    fontSize: 14,
    fontWeight: '700' as const,
    letterSpacing: 1,
    color: tokens.colors.text.secondary,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.sm,
    backgroundColor: tokens.colors.background.offWhite,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.colors.background.white,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.borders.light,
  },
  itemCardPurchased: {
    backgroundColor: tokens.colors.background.offWhite,
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: tokens.colors.borders.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...tokens.typography.body.l,
    color: tokens.colors.text.primary,
    marginBottom: 2,
  },
  itemNamePurchased: {
    textDecorationLine: 'line-through',
    color: tokens.colors.text.secondary,
  },
  itemQuantity: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
  },
  deleteButton: {
    padding: tokens.spacing.xs,
  },
  bottomSpacer: {
    height: tokens.spacing.xl,
  },
});
