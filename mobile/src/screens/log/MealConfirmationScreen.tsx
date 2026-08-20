/**
 * Meal Confirmation Screen
 * Phase 6: Q3.2 AI-Powered Logging
 *
 * Review and confirm AI-parsed meal before logging
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format, isToday, isYesterday, subDays } from 'date-fns';
import { LogStackParamList, ParsedMealItem } from '../../types/navigation.types';
import { useCreateLoggedEntry, useUpdateLoggedEntry, calculateMealTotals } from '../../hooks/useLogging';
import { useToast } from '../../components/common/Toast';
import tokens from '../../theme/tokens';

type NavigationProp = NativeStackNavigationProp<LogStackParamList, 'MealConfirmation'>;
type RouteType = RouteProp<LogStackParamList, 'MealConfirmation'>;

/**
 * Auto-detect meal type based on current time of day
 * Breakfast: 5am-10am
 * Lunch: 10am-3pm
 * Dinner: 3pm-9pm
 * Snack: 9pm-5am
 */
function getMealTypeFromTime(): 'breakfast' | 'lunch' | 'dinner' | 'snack' {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 10) {
    return 'breakfast';
  } else if (hour >= 10 && hour < 15) {
    return 'lunch';
  } else if (hour >= 15 && hour < 21) {
    return 'dinner';
  } else {
    return 'snack';
  }
}

export default function MealConfirmationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { showToast } = useToast();
  const { parsedMeal, entryId } = route.params;

  // Check if this is an edit (updating existing entry) or new entry
  const isEditMode = !!entryId;

  const [items, setItems] = useState<ParsedMealItem[]>(parsedMeal.items);
  const [isFavorite, setIsFavorite] = useState(false);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>(
    getMealTypeFromTime()
  );

  // Date picker state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Edit modal state
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<ParsedMealItem | null>(null);
  const [originalItem, setOriginalItem] = useState<ParsedMealItem | null>(null); // For quantity scaling

  const createEntryMutation = useCreateLoggedEntry();
  const updateEntryMutation = useUpdateLoggedEntry();

  const totals = calculateMealTotals(items);

  // Format date label for display
  const getDateLabel = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEE, MMM d');
  };

  // Handle date change from picker
  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS, close on Android
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleConfirm = async () => {
    const mealData = {
      items,
      totalCalories: totals.totalCalories,
      totalProtein: totals.totalProtein,
      totalCarbs: totals.totalCarbs,
      totalFat: totals.totalFat,
      mealType,
      restaurantName: parsedMeal.restaurantName,
    };

    try {
      if (isEditMode && entryId) {
        // Update existing entry
        await updateEntryMutation.mutateAsync({
          id: entryId,
          meal: mealData,
          isFavorite,
        });
        showToast('Meal updated!', 'success');
      } else {
        // Create new entry
        await createEntryMutation.mutateAsync({
          type: 'meal',
          date: selectedDate.toISOString(),
          meal: mealData,
          isFavorite,
        });
        showToast('Meal logged!', 'success');
      }

      navigation.popToTop();
    } catch (error) {
      console.error('Failed to save meal:', error);
      showToast(isEditMode ? 'Failed to update meal' : 'Failed to log meal', 'error');
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditItem = (index: number) => {
    setEditingIndex(index);
    setEditingItem({ ...items[index] });
    setOriginalItem({ ...items[index] }); // Store original for quantity scaling
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingItem) {
      setItems((prev) =>
        prev.map((item, i) => (i === editingIndex ? editingItem : item))
      );
      setIsEditModalVisible(false);
      setEditingIndex(null);
      setEditingItem(null);
      setOriginalItem(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
    setEditingIndex(null);
    setEditingItem(null);
    setOriginalItem(null);
  };

  const updateEditingItem = (field: keyof ParsedMealItem, value: string | number) => {
    if (!editingItem || !originalItem) return;

    // If quantity changes, scale macros proportionally
    if (field === 'quantity' && typeof value === 'number' && originalItem.quantity > 0) {
      const scaleFactor = value / originalItem.quantity;
      setEditingItem({
        ...editingItem,
        quantity: value,
        calories: Math.round(originalItem.calories * scaleFactor),
        protein: Math.round(originalItem.protein * scaleFactor),
        carbs: Math.round(originalItem.carbs * scaleFactor),
        fat: Math.round(originalItem.fat * scaleFactor),
      });
    } else {
      setEditingItem({ ...editingItem, [field]: value });
    }
  };

  const mealTypes: Array<'breakfast' | 'lunch' | 'dinner' | 'snack'> = [
    'breakfast',
    'lunch',
    'dinner',
    'snack',
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Confidence Banner */}
        {parsedMeal.confidence !== 'high' && (
          <View style={styles.confidenceBanner}>
            <Ionicons
              name="information-circle"
              size={20}
              color={parsedMeal.confidence === 'medium' ? '#B45309' : '#DC2626'}
            />
            <Text style={styles.confidenceText}>
              {parsedMeal.confidence === 'medium'
                ? 'Please review the parsed values'
                : 'Low confidence - values may be inaccurate'}
            </Text>
          </View>
        )}

        {/* Restaurant Badge */}
        {parsedMeal.isRestaurant && parsedMeal.restaurantName && (
          <View style={styles.restaurantBadge}>
            <Ionicons name="restaurant" size={16} color={tokens.colors.primary.teal} />
            <Text style={styles.restaurantText}>{parsedMeal.restaurantName}</Text>
          </View>
        )}

        {/* Date Selector */}
        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>Date</Text>
          <View style={styles.dateSelector}>
            <TouchableOpacity
              style={[
                styles.dateButton,
                isToday(selectedDate) && styles.dateButtonActive,
              ]}
              onPress={() => setSelectedDate(new Date())}
            >
              <Text style={[
                styles.dateButtonText,
                isToday(selectedDate) && styles.dateButtonTextActive,
              ]}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dateButton,
                isYesterday(selectedDate) && styles.dateButtonActive,
              ]}
              onPress={() => setSelectedDate(subDays(new Date(), 1))}
            >
              <Text style={[
                styles.dateButtonText,
                isYesterday(selectedDate) && styles.dateButtonTextActive,
              ]}>Yesterday</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dateButton,
                !isToday(selectedDate) && !isYesterday(selectedDate) && styles.dateButtonActive,
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons
                name="calendar-outline"
                size={16}
                color={!isToday(selectedDate) && !isYesterday(selectedDate) ? '#fff' : tokens.colors.text.secondary}
              />
              <Text style={[
                styles.dateButtonText,
                !isToday(selectedDate) && !isYesterday(selectedDate) && styles.dateButtonTextActive,
              ]}>
                {!isToday(selectedDate) && !isYesterday(selectedDate)
                  ? format(selectedDate, 'MMM d')
                  : 'Other'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Picker Modal (iOS) / Inline (Android) */}
        {showDatePicker && (
          Platform.OS === 'ios' ? (
            <Modal
              transparent
              animationType="slide"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View style={styles.datePickerModal}>
                <View style={styles.datePickerContainer}>
                  <View style={styles.datePickerHeader}>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.datePickerCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.datePickerTitle}>Select Date</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.datePickerDone}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    minimumDate={subDays(new Date(), 30)}
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={subDays(new Date(), 30)}
            />
          )
        )}

        {/* Meal Type Selector */}
        <View style={styles.mealTypeSection}>
          <Text style={styles.sectionTitle}>Meal Type</Text>
          <View style={styles.mealTypeSelector}>
            {mealTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.mealTypeButton,
                  mealType === type && styles.mealTypeButtonActive,
                ]}
                onPress={() => setMealType(type)}
              >
                <Text
                  style={[
                    styles.mealTypeButtonText,
                    mealType === type && styles.mealTypeButtonTextActive,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Food Items */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Items</Text>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.itemCard}
              onPress={() => handleEditItem(index)}
              activeOpacity={0.7}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.itemActions}>
                  <Ionicons name="pencil" size={16} color={tokens.colors.text.tertiary} style={styles.editIcon} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(index);
                    }}
                  >
                    <Ionicons name="close-circle" size={20} color={tokens.colors.text.tertiary} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.itemQuantity}>
                {item.quantity} {item.unit}
              </Text>
              <View style={styles.itemMacros}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{item.calories}</Text>
                  <Text style={styles.macroLabel}>cal</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{item.protein}g</Text>
                  <Text style={styles.macroLabel}>protein</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{item.carbs}g</Text>
                  <Text style={styles.macroLabel}>carbs</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{item.fat}g</Text>
                  <Text style={styles.macroLabel}>fat</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsCard}>
          <Text style={styles.totalsTitle}>Total</Text>
          <View style={styles.totalsGrid}>
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>{totals.totalCalories}</Text>
              <Text style={styles.totalLabel}>Calories</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>{totals.totalProtein}g</Text>
              <Text style={styles.totalLabel}>Protein</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>{totals.totalCarbs}g</Text>
              <Text style={styles.totalLabel}>Carbs</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>{totals.totalFat}g</Text>
              <Text style={styles.totalLabel}>Fat</Text>
            </View>
          </View>
        </View>

        {/* Favorite Toggle */}
        <TouchableOpacity
          style={styles.favoriteToggle}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#EF4444' : tokens.colors.text.secondary}
          />
          <Text style={styles.favoriteText}>Save to favorites</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (items.length === 0 || createEntryMutation.isPending || updateEntryMutation.isPending) &&
              styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={items.length === 0 || createEntryMutation.isPending || updateEntryMutation.isPending}
        >
          {(createEntryMutation.isPending || updateEntryMutation.isPending) ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.confirmButtonText}>
                {isEditMode ? 'Update Meal' : 'Confirm & Log'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Edit Item Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCancelEdit}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleCancelEdit}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Item</Text>
              <TouchableOpacity onPress={handleCancelEdit}>
                <Ionicons name="close" size={24} color={tokens.colors.text.secondary} />
              </TouchableOpacity>
            </View>

            {editingItem && (
              <ScrollView style={styles.modalBody}>
                {/* Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editingItem.name}
                    onChangeText={(text) => updateEditingItem('name', text)}
                    placeholder="Item name"
                    placeholderTextColor={tokens.colors.text.tertiary}
                  />
                </View>

                {/* Quantity & Unit Row */}
                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Quantity</Text>
                    <TextInput
                      style={styles.textInput}
                      value={String(editingItem.quantity)}
                      onChangeText={(text) => updateEditingItem('quantity', parseFloat(text) || 0)}
                      keyboardType="decimal-pad"
                      placeholder="0"
                      placeholderTextColor={tokens.colors.text.tertiary}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1, marginLeft: tokens.spacing.md }]}>
                    <Text style={styles.inputLabel}>Unit</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editingItem.unit}
                      onChangeText={(text) => updateEditingItem('unit', text)}
                      placeholder="serving"
                      placeholderTextColor={tokens.colors.text.tertiary}
                    />
                  </View>
                </View>

                {/* Macros */}
                <Text style={styles.macrosSectionTitle}>Nutritional Info</Text>
                <View style={styles.macrosGrid}>
                  <View style={styles.macroInputGroup}>
                    <Text style={styles.inputLabel}>Calories</Text>
                    <TextInput
                      style={styles.textInput}
                      value={String(editingItem.calories)}
                      onChangeText={(text) => updateEditingItem('calories', parseInt(text) || 0)}
                      keyboardType="number-pad"
                      placeholder="0"
                      placeholderTextColor={tokens.colors.text.tertiary}
                    />
                  </View>
                  <View style={styles.macroInputGroup}>
                    <Text style={styles.inputLabel}>Protein (g)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={String(editingItem.protein)}
                      onChangeText={(text) => updateEditingItem('protein', parseInt(text) || 0)}
                      keyboardType="number-pad"
                      placeholder="0"
                      placeholderTextColor={tokens.colors.text.tertiary}
                    />
                  </View>
                  <View style={styles.macroInputGroup}>
                    <Text style={styles.inputLabel}>Carbs (g)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={String(editingItem.carbs)}
                      onChangeText={(text) => updateEditingItem('carbs', parseInt(text) || 0)}
                      keyboardType="number-pad"
                      placeholder="0"
                      placeholderTextColor={tokens.colors.text.tertiary}
                    />
                  </View>
                  <View style={styles.macroInputGroup}>
                    <Text style={styles.inputLabel}>Fat (g)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={String(editingItem.fat)}
                      onChangeText={(text) => updateEditingItem('fat', parseInt(text) || 0)}
                      keyboardType="number-pad"
                      placeholder="0"
                      placeholderTextColor={tokens.colors.text.tertiary}
                    />
                  </View>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  content: {
    padding: tokens.spacing.lg,
    paddingBottom: 100,
  },
  confidenceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: tokens.spacing.md,
    borderRadius: 8,
    marginBottom: tokens.spacing.lg,
    gap: tokens.spacing.sm,
  },
  confidenceText: {
    ...tokens.typography.body.s,
    color: '#B45309',
    flex: 1,
  },
  restaurantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.primary.teal + '15',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: tokens.spacing.lg,
    gap: tokens.spacing.xs,
  },
  restaurantText: {
    ...tokens.typography.body.s,
    fontWeight: '600',
    color: tokens.colors.primary.teal,
  },
  mealTypeSection: {
    marginBottom: tokens.spacing.lg,
  },
  sectionTitle: {
    ...tokens.typography.heading.h3,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.md,
  },
  mealTypeSelector: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  mealTypeButton: {
    flex: 1,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: 8,
    backgroundColor: tokens.colors.background.white,
    alignItems: 'center',
  },
  mealTypeButtonActive: {
    backgroundColor: tokens.colors.primary.teal,
  },
  mealTypeButtonText: {
    ...tokens.typography.body.s,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
  },
  mealTypeButtonTextActive: {
    color: '#fff',
  },
  // Date picker styles
  dateSection: {
    marginBottom: tokens.spacing.lg,
  },
  dateSelector: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: 8,
    backgroundColor: tokens.colors.background.white,
    gap: tokens.spacing.xs,
  },
  dateButtonActive: {
    backgroundColor: tokens.colors.primary.teal,
  },
  dateButtonText: {
    ...tokens.typography.body.s,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
  },
  dateButtonTextActive: {
    color: '#fff',
  },
  datePickerModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    backgroundColor: tokens.colors.background.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border.light,
  },
  datePickerTitle: {
    ...tokens.typography.heading.h3,
    color: tokens.colors.text.primary,
  },
  datePickerCancel: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
  },
  datePickerDone: {
    ...tokens.typography.body.m,
    fontWeight: '600',
    color: tokens.colors.primary.teal,
  },
  itemsSection: {
    marginBottom: tokens.spacing.lg,
  },
  itemCard: {
    backgroundColor: tokens.colors.background.white,
    borderRadius: 12,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    ...tokens.typography.body.m,
    fontWeight: '600',
    color: tokens.colors.text.primary,
    flex: 1,
  },
  removeButton: {
    padding: tokens.spacing.xs,
  },
  itemQuantity: {
    ...tokens.typography.body.s,
    color: tokens.colors.text.secondary,
    marginTop: tokens.spacing.xs,
    marginBottom: tokens.spacing.sm,
  },
  itemMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    ...tokens.typography.body.s,
    fontWeight: '600',
    color: tokens.colors.text.primary,
  },
  macroLabel: {
    ...tokens.typography.body.xs,
    color: tokens.colors.text.tertiary,
  },
  totalsCard: {
    backgroundColor: tokens.colors.primary.teal + '10',
    borderRadius: 12,
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  totalsTitle: {
    ...tokens.typography.heading.h3,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.md,
    textAlign: 'center',
  },
  totalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  totalItem: {
    alignItems: 'center',
  },
  totalValue: {
    ...tokens.typography.heading.h2,
    color: tokens.colors.primary.teal,
  },
  totalLabel: {
    ...tokens.typography.body.xs,
    color: tokens.colors.text.secondary,
  },
  favoriteToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
  favoriteText: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: tokens.colors.background.white,
    padding: tokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border.light,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.primary.teal,
    paddingVertical: tokens.spacing.md,
    borderRadius: 12,
    gap: tokens.spacing.sm,
  },
  confirmButtonDisabled: {
    backgroundColor: tokens.colors.text.tertiary,
  },
  confirmButtonText: {
    ...tokens.typography.body.m,
    fontWeight: '600',
    color: '#fff',
  },
  // Item actions row
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  editIcon: {
    opacity: 0.6,
  },
  // Edit Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: tokens.colors.background.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border.light,
  },
  modalTitle: {
    ...tokens.typography.heading.h3,
    color: tokens.colors.text.primary,
  },
  modalBody: {
    padding: tokens.spacing.lg,
  },
  inputGroup: {
    marginBottom: tokens.spacing.md,
  },
  inputLabel: {
    ...tokens.typography.body.s,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.xs,
  },
  textInput: {
    backgroundColor: tokens.colors.background.offWhite,
    padding: tokens.spacing.md,
    borderRadius: 8,
    ...tokens.typography.body.m,
    color: tokens.colors.text.primary,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: tokens.spacing.md,
  },
  macrosSectionTitle: {
    ...tokens.typography.body.m,
    fontWeight: '600',
    color: tokens.colors.text.primary,
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
  },
  macrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
  },
  macroInputGroup: {
    width: '47%',
    marginBottom: tokens.spacing.sm,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border.light,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: tokens.spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: tokens.colors.background.offWhite,
  },
  cancelButtonText: {
    ...tokens.typography.body.m,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: tokens.spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: tokens.colors.primary.teal,
  },
  saveButtonText: {
    ...tokens.typography.body.m,
    fontWeight: '600',
    color: '#fff',
  },
});
