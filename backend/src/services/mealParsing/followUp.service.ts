/**
 * Deterministic Follow-up Logic Service
 *
 * This service decides what follow-up questions are needed based on:
 * 1. What information is missing from extraction
 * 2. What type of food it is (from categories)
 *
 * Benefits:
 * - 100% predictable (same input = same follow-ups)
 * - Testable with unit tests
 * - No AI calls needed for decisions
 * - Easy to add new rules
 */

import { ExtractedItem, ExtractionResponse } from './extraction.service';
import {
  isCountable,
  needsPortionQuestion,
  needsSauceQuestion,
  needsPreparationQuestion,
  needsBrandQuestion,
  QUICK_OPTIONS,
} from './foodCategories';

export type FollowUpType =
  | 'quantity'
  | 'portion'
  | 'preparation'
  | 'sauce'
  | 'source'
  | 'brand'
  | 'size';

export interface FollowUp {
  type: FollowUpType;
  question: string;
  quickOptions: string[];
  priority: number; // Lower = ask first
  itemIndex: number; // Which item this applies to
}

/**
 * Determine what follow-up questions are needed
 * Returns them in priority order (most important first)
 */
export function getRequiredFollowUps(extraction: ExtractionResponse): FollowUp[] {
  const followUps: FollowUp[] = [];

  for (let i = 0; i < extraction.items.length; i++) {
    const item = extraction.items[i];
    const itemFollowUps = getItemFollowUps(item, i, extraction);
    followUps.push(...itemFollowUps);
  }

  // Sort by priority (lower = more important = ask first)
  return followUps.sort((a, b) => a.priority - b.priority);
}

/**
 * Get follow-ups needed for a specific item
 */
function getItemFollowUps(
  item: ExtractedItem,
  index: number,
  extraction: ExtractionResponse
): FollowUp[] {
  const followUps: FollowUp[] = [];
  const itemName = item.name.toLowerCase();

  // Priority 1: Quantity for countable items
  if (item.quantity === null && isCountable(itemName)) {
    followUps.push({
      type: 'quantity',
      question: `How many ${item.name}?`,
      quickOptions: QUICK_OPTIONS.quantity,
      priority: 1,
      itemIndex: index,
    });
  }

  // Priority 1.5: Portion size for bulk foods (pasta, rice, etc.)
  // Only ask if no quantity AND no unit specified
  if (item.quantity === null && !item.unit && needsPortionQuestion(itemName)) {
    followUps.push({
      type: 'portion',
      question: `How much ${item.name} did you have?`,
      quickOptions: QUICK_OPTIONS.portion,
      priority: 1.5,
      itemIndex: index,
    });
  }

  // Priority 2: Preparation method for items where it affects macros
  if (item.preparation === null && needsPreparationQuestion(itemName)) {
    followUps.push({
      type: 'preparation',
      question: `How was the ${item.name} prepared?`,
      quickOptions: QUICK_OPTIONS.preparation,
      priority: 2,
      itemIndex: index,
    });
  }

  // Priority 3: Sauce/dip for items that commonly come with them
  const hasSauceMentioned = extraction.accompaniments.length > 0;
  if (!hasSauceMentioned && needsSauceQuestion(itemName)) {
    followUps.push({
      type: 'sauce',
      question: `Any dipping sauce with the ${item.name}?`,
      quickOptions: QUICK_OPTIONS.sauce,
      priority: 3,
      itemIndex: index,
    });
  }

  // Priority 4: Brand for items where it matters
  if (needsBrandQuestion(itemName)) {
    followUps.push({
      type: 'brand',
      question: `What brand of ${item.name}?`,
      quickOptions: getBrandOptions(itemName),
      priority: 4,
      itemIndex: index,
    });
  }

  return followUps;
}

/**
 * Get the next follow-up question to ask
 * Returns null if no more questions needed
 */
export function getNextFollowUp(extraction: ExtractionResponse): FollowUp | null {
  const followUps = getRequiredFollowUps(extraction);
  return followUps.length > 0 ? followUps[0] : null;
}

/**
 * Check if all required information is present
 */
export function isComplete(extraction: ExtractionResponse): boolean {
  return getRequiredFollowUps(extraction).length === 0;
}

/**
 * Apply a follow-up answer to the extraction
 * Returns updated extraction with the new information
 */
export function applyFollowUpAnswer(
  extraction: ExtractionResponse,
  followUp: FollowUp,
  answer: string
): ExtractionResponse {
  const updated = { ...extraction, items: [...extraction.items] };

  switch (followUp.type) {
    case 'quantity':
      // Parse quantity from answer
      const qty = parseQuantity(answer);
      if (qty !== null) {
        updated.items[followUp.itemIndex] = {
          ...updated.items[followUp.itemIndex],
          quantity: qty,
        };
      }
      break;

    case 'portion':
      // Parse portion size and set as unit
      const portionInfo = parsePortionSize(answer);
      updated.items[followUp.itemIndex] = {
        ...updated.items[followUp.itemIndex],
        quantity: portionInfo.quantity,
        unit: portionInfo.unit,
      };
      break;

    case 'preparation':
      updated.items[followUp.itemIndex] = {
        ...updated.items[followUp.itemIndex],
        preparation: answer.toLowerCase(),
      };
      break;

    case 'sauce':
      if (answer.toLowerCase() !== 'no sauce' && answer.toLowerCase() !== 'none') {
        updated.accompaniments = [...updated.accompaniments, answer];
      }
      break;

    case 'source':
      updated.source = answer;
      break;

    case 'brand':
      // Prepend brand to item name
      updated.items[followUp.itemIndex] = {
        ...updated.items[followUp.itemIndex],
        name: `${answer} ${updated.items[followUp.itemIndex].name}`,
      };
      break;
  }

  return updated;
}

/**
 * Parse portion size from user answer
 * Returns quantity and unit
 */
function parsePortionSize(answer: string): { quantity: number; unit: string } {
  const normalized = answer.toLowerCase().trim();

  // Check for specific portion patterns
  if (normalized.includes('small') || normalized.includes('1/2 cup') || normalized.includes('half cup')) {
    return { quantity: 0.5, unit: 'cup' };
  }
  if (normalized.includes('1 cup') || normalized === '1 cup') {
    return { quantity: 1, unit: 'cup' };
  }
  if (normalized.includes('1.5 cup') || normalized.includes('1 1/2 cup')) {
    return { quantity: 1.5, unit: 'cup' };
  }
  if (normalized.includes('2 cup')) {
    return { quantity: 2, unit: 'cups' };
  }
  if (normalized.includes('large plate') || normalized.includes('big plate')) {
    return { quantity: 2.5, unit: 'cups' };
  }
  if (normalized.includes('bowl')) {
    return { quantity: 1.5, unit: 'cups' };
  }
  if (normalized.includes('plate')) {
    return { quantity: 2, unit: 'cups' };
  }

  // Try to extract number and unit
  const cupMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:cups?)/i);
  if (cupMatch) {
    return { quantity: parseFloat(cupMatch[1]), unit: cupMatch[1] === '1' ? 'cup' : 'cups' };
  }

  const ozMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:oz|ounces?)/i);
  if (ozMatch) {
    return { quantity: parseFloat(ozMatch[1]), unit: 'oz' };
  }

  // Default to 1 serving
  return { quantity: 1, unit: 'serving' };
}

/**
 * Parse quantity from user answer
 */
function parseQuantity(answer: string): number | null {
  const normalized = answer.toLowerCase().trim();

  // Word numbers
  const wordMap: Record<string, number> = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'dozen': 12, 'half dozen': 6,
  };

  if (wordMap[normalized]) {
    return wordMap[normalized];
  }

  // Try parsing as number
  const num = parseInt(normalized, 10);
  if (!isNaN(num) && num > 0) {
    return num;
  }

  // Extract number from text like "about 6" or "6 pieces"
  const match = normalized.match(/(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }

  return null;
}

/**
 * Get brand-specific quick options
 */
function getBrandOptions(itemName: string): string[] {
  const name = itemName.toLowerCase();

  if (name.includes('protein') && (name.includes('shake') || name.includes('powder'))) {
    return ['Optimum Nutrition', 'Premier Protein', 'Muscle Milk', 'Fairlife', 'Homemade'];
  }

  if (name.includes('yogurt')) {
    return ['Chobani', 'Fage', 'Oikos', 'Yoplait', 'Store brand'];
  }

  if (name.includes('energy bar') || name.includes('protein bar')) {
    return ['Quest', 'RXBar', 'Kind', 'Clif', 'Store brand'];
  }

  return ['Name brand', 'Store brand', 'Homemade'];
}

/**
 * Convert follow-up type to the type expected by frontend
 */
export function toFrontendFollowUpType(type: FollowUpType): string {
  // Map our internal types to the frontend types
  const typeMap: Record<FollowUpType, string> = {
    quantity: 'quantity',
    portion: 'portion',
    preparation: 'preparation',
    sauce: 'portion', // Reuse portion type for sauce questions
    source: 'restaurant',
    brand: 'brand',
    size: 'portion',
  };
  return typeMap[type] || 'confirmation';
}
