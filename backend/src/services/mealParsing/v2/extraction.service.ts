/**
 * Universal AI Extraction Service
 * v2 Meal Parsing System
 *
 * Single AI call to extract archetype + structured attributes.
 * No multi-turn Q&A - follow-ups handled deterministically.
 */

import OpenAI from 'openai';
import { z } from 'zod';
import {
  UniversalExtraction,
  ExtractionResult,
  ConfidenceScores,
} from './archetypes';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: parseInt(process.env.OPENAI_TIMEOUT || '30000'),
  maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES || '2'),
});

// ============================================================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================================================

const ConfidenceSchema = z.object({
  base_food: z.number().min(0).max(1),
  portion: z.number().min(0).max(1),
  protein: z.number().min(0).max(1),
  sauce_or_dressing: z.number().min(0).max(1),
  cooking_method: z.number().min(0).max(1),
  extras: z.number().min(0).max(1),
});

const UniversalExtractionSchema = z.object({
  archetype: z.enum([
    'SINGLE_ITEM',
    'PASTA_GRAIN_BOWL',
    'SALAD',
    'SANDWICH_WRAP',
    'SOUP_STEW',
    'PLATED_MEAL',
    'SNACK_DESSERT',
    'DRINK',
    'PACKAGED_FOOD',
    'MULTI_ITEM',
  ]),
  base_food: z.string().nullable(),
  portion: z.string().nullable(),
  protein: z.string().nullable(),
  cooking_method: z.string().nullable(),
  carb_component: z.string().nullable(),
  fat_component: z.string().nullable(),
  sauce_or_dressing: z.string().nullable(),
  extras: z.array(z.string()),
  brand_or_name: z.string().nullable(),
  packaged_flag: z.boolean(),
  confidence: ConfidenceSchema,
});

const MultiItemExtractionSchema = z.object({
  archetype: z.literal('MULTI_ITEM'),
  items: z.array(UniversalExtractionSchema),
  overall_confidence: z.number().min(0).max(1),
});

// ============================================================================
// AI PROMPT
// ============================================================================

const EXTRACTION_PROMPT = `You are a nutrition extraction engine. Convert meal descriptions into structured JSON.

TASK: Given free-text meal input, extract structured data and classify into ONE archetype.

ARCHETYPES (pick the BEST match):
1. SINGLE_ITEM - Single food: apple, banana, protein bar, egg
2. PASTA_GRAIN_BOWL - Pasta, rice bowl, quinoa, noodles
3. SALAD - Any salad with greens as base
4. SANDWICH_WRAP - Sandwich, wrap, burger, taco, sub
5. SOUP_STEW - Soup, stew, curry, chili
6. PLATED_MEAL - Protein + sides (chicken with rice and veggies)
7. SNACK_DESSERT - Cookies, chips, ice cream, candy
8. DRINK - Coffee, smoothie, protein shake, juice
9. PACKAGED_FOOD - Branded items (Quest bar, Lean Cuisine)
10. MULTI_ITEM - Multiple distinct items logged together

OUTPUT SCHEMA:
{
  "archetype": "ARCHETYPE_NAME",
  "base_food": "main item" | null,
  "portion": "amount/size" | null,
  "protein": "protein source" | null,
  "cooking_method": "grilled/fried/baked/etc" | null,
  "carb_component": "rice/bread/pasta if separate" | null,
  "fat_component": "butter/oil/cheese/avocado" | null,
  "sauce_or_dressing": "sauce name" | null,
  "extras": ["toppings", "add-ons"],
  "brand_or_name": "brand or restaurant" | null,
  "packaged_flag": true/false,
  "confidence": {
    "base_food": 0.0-1.0,
    "portion": 0.0-1.0,
    "protein": 0.0-1.0,
    "sauce_or_dressing": 0.0-1.0,
    "cooking_method": 0.0-1.0,
    "extras": 0.0-1.0
  }
}

For MULTI_ITEM, return:
{
  "archetype": "MULTI_ITEM",
  "items": [<array of extractions for each item>],
  "overall_confidence": 0.0-1.0
}

CONFIDENCE RULES:
- 1.0 = explicitly stated in input
- 0.7-0.9 = reasonably inferred
- 0.3-0.6 = guessed based on typical patterns
- 0.0 = not mentioned, unknown

IMPORTANT:
- Fill fields only when confident
- Set to null if not mentioned
- Never make up specific details
- For vague inputs like "pasta", set portion/sauce/protein confidence LOW
- Return ONLY valid JSON, no markdown`;

// ============================================================================
// EXTRACTION FUNCTION
// ============================================================================

/**
 * Extract structured data from meal input using AI
 */
export async function extractMealData(input: string): Promise<ExtractionResult> {
  console.log('[v2 Extraction] Input:', input);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: EXTRACTION_PROMPT,
        },
        {
          role: 'user',
          content: input,
        },
      ],
      temperature: 0.2, // Low temperature for consistency
      max_tokens: 800,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    console.log('[v2 Extraction] Raw response:', content);

    const parsed = JSON.parse(content);

    // Validate and normalize the response
    if (parsed.archetype === 'MULTI_ITEM' && parsed.items) {
      const validated = MultiItemExtractionSchema.parse(parsed);
      console.log('[v2 Extraction] Multi-item extraction:', validated.items.length, 'items');
      return validated;
    } else {
      const validated = UniversalExtractionSchema.parse(parsed);
      console.log('[v2 Extraction] Single extraction:', validated.archetype);
      return validated as UniversalExtraction;
    }
  } catch (error) {
    console.error('[v2 Extraction] Error:', error);

    // Return a minimal fallback extraction
    return createFallbackExtraction(input);
  }
}

/**
 * Create a fallback extraction when AI fails
 */
function createFallbackExtraction(input: string): UniversalExtraction {
  return {
    archetype: 'SINGLE_ITEM',
    base_food: input.slice(0, 100), // Use input as base food
    portion: null,
    protein: null,
    cooking_method: null,
    carb_component: null,
    fat_component: null,
    sauce_or_dressing: null,
    extras: [],
    brand_or_name: null,
    packaged_flag: false,
    confidence: {
      base_food: 0.3,
      portion: 0,
      protein: 0,
      sauce_or_dressing: 0,
      cooking_method: 0,
      extras: 0,
    },
  };
}

/**
 * Apply a follow-up answer to an extraction
 * Updates the relevant field and sets confidence to 1.0
 */
export function applyFollowUpToExtraction(
  extraction: UniversalExtraction,
  field: keyof ConfidenceScores,
  answer: string
): UniversalExtraction {
  const updated = { ...extraction };
  const updatedConfidence = { ...extraction.confidence };

  switch (field) {
    case 'base_food':
      updated.base_food = answer;
      break;
    case 'portion':
      updated.portion = answer;
      break;
    case 'protein':
      updated.protein = answer.toLowerCase() === 'none' ? null : answer;
      break;
    case 'sauce_or_dressing':
      updated.sauce_or_dressing = answer.toLowerCase() === 'none' ? null : answer;
      break;
    case 'cooking_method':
      updated.cooking_method = answer;
      break;
    case 'extras':
      if (answer.toLowerCase() !== 'none') {
        updated.extras = [...extraction.extras, answer];
      }
      break;
  }

  // Mark field as high confidence since user provided it
  updatedConfidence[field] = 1.0;
  updated.confidence = updatedConfidence;

  return updated;
}
