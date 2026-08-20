/**
 * Manual Meal Entry Screen
 * Phase 6: Q3.2 AI-Powered Logging
 *
 * Fallback for when AI parsing fails
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LogStackParamList } from '../../types/navigation.types';
import { useCreateLoggedEntry } from '../../hooks/useLogging';
import { useToast } from '../../components/common/Toast';
import tokens from '../../theme/tokens';

type NavigationProp = NativeStackNavigationProp<LogStackParamList, 'ManualMealEntry'>;

export default function ManualMealEntryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { showToast } = useToast();

  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [isFavorite, setIsFavorite] = useState(false);

  const createEntryMutation = useCreateLoggedEntry();

  const isValid =
    mealName.trim() &&
    calories &&
    !isNaN(parseInt(calories)) &&
    protein &&
    !isNaN(parseInt(protein)) &&
    carbs &&
    !isNaN(parseInt(carbs)) &&
    fat &&
    !isNaN(parseInt(fat));

  const handleSubmit = async () => {
    if (!isValid) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      await createEntryMutation.mutateAsync({
        type: 'meal',
        date: new Date().toISOString(),
        meal: {
          items: [
            {
              name: mealName.trim(),
              quantity: 1,
              unit: 'serving',
              calories: parseInt(calories),
              protein: parseInt(protein),
              carbs: parseInt(carbs),
              fat: parseInt(fat),
            },
          ],
          totalCalories: parseInt(calories),
          totalProtein: parseInt(protein),
          totalCarbs: parseInt(carbs),
          totalFat: parseInt(fat),
          mealType,
          isManualEntry: true,
        },
        isFavorite,
      });

      showToast('Meal logged!', 'success');
      navigation.popToTop();
    } catch (error) {
      console.error('Failed to log meal:', error);
      showToast('Failed to log meal', 'error');
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
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Meal Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Meal Name</Text>
            <TextInput
              style={styles.textInput}
              value={mealName}
              onChangeText={setMealName}
              placeholder="e.g., Grilled Chicken Salad"
              placeholderTextColor={tokens.colors.text.tertiary}
              autoCapitalize="words"
            />
          </View>

          {/* Meal Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Meal Type</Text>
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

          {/* Calories */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calories</Text>
            <View style={styles.numberInputContainer}>
              <TextInput
                style={styles.numberInput}
                value={calories}
                onChangeText={setCalories}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={tokens.colors.text.tertiary}
                maxLength={5}
              />
              <Text style={styles.inputUnit}>cal</Text>
            </View>
          </View>

          {/* Macros */}
          <View style={styles.macrosRow}>
            <View style={styles.macroInput}>
              <Text style={styles.label}>Protein</Text>
              <View style={styles.numberInputContainer}>
                <TextInput
                  style={styles.numberInput}
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={tokens.colors.text.tertiary}
                  maxLength={4}
                />
                <Text style={styles.inputUnit}>g</Text>
              </View>
            </View>

            <View style={styles.macroInput}>
              <Text style={styles.label}>Carbs</Text>
              <View style={styles.numberInputContainer}>
                <TextInput
                  style={styles.numberInput}
                  value={carbs}
                  onChangeText={setCarbs}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={tokens.colors.text.tertiary}
                  maxLength={4}
                />
                <Text style={styles.inputUnit}>g</Text>
              </View>
            </View>

            <View style={styles.macroInput}>
              <Text style={styles.label}>Fat</Text>
              <View style={styles.numberInputContainer}>
                <TextInput
                  style={styles.numberInput}
                  value={fat}
                  onChangeText={setFat}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={tokens.colors.text.tertiary}
                  maxLength={4}
                />
                <Text style={styles.inputUnit}>g</Text>
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

        {/* Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!isValid || createEntryMutation.isPending) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isValid || createEntryMutation.isPending}
          >
            {createEntryMutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Log Meal</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: tokens.spacing.lg,
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: tokens.spacing.lg,
  },
  label: {
    ...tokens.typography.body.s,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.sm,
  },
  textInput: {
    backgroundColor: tokens.colors.background.white,
    borderRadius: 12,
    padding: tokens.spacing.md,
    ...tokens.typography.body.m,
    color: tokens.colors.text.primary,
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
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.background.white,
    borderRadius: 12,
    padding: tokens.spacing.md,
  },
  numberInput: {
    flex: 1,
    ...tokens.typography.body.m,
    color: tokens.colors.text.primary,
  },
  inputUnit: {
    ...tokens.typography.body.m,
    color: tokens.colors.text.secondary,
    marginLeft: tokens.spacing.sm,
  },
  macrosRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  macroInput: {
    flex: 1,
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
    backgroundColor: tokens.colors.background.white,
    padding: tokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border.light,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.primary.teal,
    paddingVertical: tokens.spacing.md,
    borderRadius: 12,
    gap: tokens.spacing.sm,
  },
  submitButtonDisabled: {
    backgroundColor: tokens.colors.text.tertiary,
  },
  submitButtonText: {
    ...tokens.typography.body.m,
    fontWeight: '600',
    color: '#fff',
  },
});
