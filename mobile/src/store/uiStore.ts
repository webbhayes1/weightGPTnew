/**
 * UI Store
 * Phase 3: Manages UI state for app shell
 * - Dual-mode toggle (Nutrition ⟷ Workout)
 * - Selected date for day selector
 * - Other UI preferences
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UIState {
  // Dual-mode toggle: true = Nutrition mode, false = Workout mode
  isDualModeNutrition: boolean;
  setDualMode: (isNutrition: boolean) => void;
  toggleDualMode: () => void;

  // Selected date for day selector (ISO string)
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;

  // Reset to defaults
  reset: () => void;

  // Initialize from storage (called on app start)
  initializeFromStorage: () => Promise<void>;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Dual-mode state (defaults)
  isDualModeNutrition: true,
  selectedDate: new Date().toISOString().split('T')[0],

  setDualMode: (isNutrition: boolean) => {
    AsyncStorage.setItem('isDualModeNutrition', JSON.stringify(isNutrition));
    set({ isDualModeNutrition: isNutrition });
  },

  toggleDualMode: () => {
    const current = get().isDualModeNutrition;
    const newValue = !current;
    AsyncStorage.setItem('isDualModeNutrition', JSON.stringify(newValue));
    set({ isDualModeNutrition: newValue });
  },

  // Date selection state
  setSelectedDate: (date: string) => {
    AsyncStorage.setItem('selectedDate', date);
    set({ selectedDate: date });
  },

  goToPreviousDay: () => {
    const current = new Date(get().selectedDate);
    current.setDate(current.getDate() - 1);
    const newDate = current.toISOString().split('T')[0];
    AsyncStorage.setItem('selectedDate', newDate);
    set({ selectedDate: newDate });
  },

  goToNextDay: () => {
    const current = new Date(get().selectedDate);
    current.setDate(current.getDate() + 1);
    const newDate = current.toISOString().split('T')[0];
    AsyncStorage.setItem('selectedDate', newDate);
    set({ selectedDate: newDate });
  },

  // Reset
  reset: () => {
    const today = new Date().toISOString().split('T')[0];
    AsyncStorage.setItem('isDualModeNutrition', JSON.stringify(true));
    AsyncStorage.setItem('selectedDate', today);
    set({
      isDualModeNutrition: true,
      selectedDate: today,
    });
  },

  // Initialize from storage
  initializeFromStorage: async () => {
    try {
      const [dualModeStr, dateStr] = await Promise.all([
        AsyncStorage.getItem('isDualModeNutrition'),
        AsyncStorage.getItem('selectedDate'),
      ]);

      set({
        isDualModeNutrition: dualModeStr ? JSON.parse(dualModeStr) : true,
        selectedDate: dateStr || new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Failed to load UI state from storage:', error);
    }
  },
}));