/**
 * useGroceryList Hook
 * TanStack Query hooks for grocery list functionality
 * Q3.4: Weekly Planning & Grocery Management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, patch, del } from '../services/apiClient';

export interface GroceryItem {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  category: string | null;
  purchased: boolean;
  notes?: string | null;
}

export interface GroceryListResponse {
  items: Record<string, GroceryItem[]>; // Grouped by category
  total: number;
  checked: number;
  weekStart: string;
  weekEnd: string;
}

export interface GenerateGroceryListResponse {
  message: string;
  totalItems: number;
  items: GroceryItem[];
}

/**
 * Fetch current week's grocery list
 */
export const fetchGroceryList = async (): Promise<GroceryListResponse> => {
  return get<GroceryListResponse>('/grocery-lists');
};

/**
 * Generate/regenerate grocery list from current meal plan
 */
export const generateGroceryList = async (): Promise<GenerateGroceryListResponse> => {
  return post<GenerateGroceryListResponse>('/grocery-lists/generate', {});
};

/**
 * Update a grocery item (toggle purchased, edit quantity, etc.)
 */
export const updateGroceryItem = async (
  itemId: string,
  updates: { purchased?: boolean; quantity?: number; unit?: string; notes?: string }
): Promise<GroceryItem> => {
  return patch<GroceryItem>(`/grocery-lists/${itemId}`, updates);
};

/**
 * Add custom grocery item
 */
export const addGroceryItem = async (item: {
  itemName: string;
  quantity?: number;
  unit?: string;
  category?: string;
  notes?: string;
}): Promise<GroceryItem> => {
  return post<GroceryItem>('/grocery-lists/items', item);
};

/**
 * Delete grocery item
 */
export const deleteGroceryItem = async (itemId: string): Promise<void> => {
  return del(`/grocery-lists/${itemId}`);
};

/**
 * useGroceryList Hook
 * Fetches current week's grocery list
 */
export const useGroceryList = () => {
  return useQuery({
    queryKey: ['groceryList'],
    queryFn: fetchGroceryList,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * useGenerateGroceryList Hook
 * Mutation to generate/regenerate grocery list
 */
export const useGenerateGroceryList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateGroceryList,
    onSuccess: (data) => {
      console.log('[useGroceryList] Generate success:', data);
      queryClient.invalidateQueries({ queryKey: ['groceryList'] });
    },
    onError: (error) => {
      console.error('[useGroceryList] Generate error:', error);
    },
  });
};

/**
 * useUpdateGroceryItem Hook
 * Mutation to update a grocery item
 */
export const useUpdateGroceryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, updates }: { itemId: string; updates: any }) =>
      updateGroceryItem(itemId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceryList'] });
    },
  });
};

/**
 * useAddGroceryItem Hook
 * Mutation to add a custom grocery item
 */
export const useAddGroceryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addGroceryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceryList'] });
    },
  });
};

/**
 * useDeleteGroceryItem Hook
 * Mutation to delete a grocery item
 */
export const useDeleteGroceryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteGroceryItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceryList'] });
    },
  });
};

/**
 * Get display name for category
 */
export const getCategoryDisplayName = (category: string): string => {
  const displayNames: Record<string, string> = {
    'proteins': 'PROTEINS',
    'produce': 'PRODUCE',
    'dairy-eggs': 'DAIRY/EGGS',
    'pantry': 'PANTRY',
    'spices': 'SPICES',
    'frozen': 'FROZEN',
    'bakery': 'BAKERY',
    'other': 'OTHER',
  };
  return displayNames[category] || category.toUpperCase();
};

export default useGroceryList;
