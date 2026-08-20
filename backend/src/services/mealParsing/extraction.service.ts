/**
 * AI Extraction Service - MINIMAL PROMPT
 *
 * This service has ONE job: extract what the user said.
 * It does NOT decide follow-ups or calculate macros.
 *
 * Benefits:
 * - ~80% smaller prompt = lower cost
 * - AI focuses on what it's good at (NLP)
 * - Faster responses
 * - Predictable output
 */

import OpenAI from 'openai';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Schema for extracted meal info - just facts, no decisions
const ExtractedItemSchema = z.object({
  name: z.string(),
  quantity: z.number().nullable(),
  unit: z.string().nullable(),
  preparation: z.string().nullable(),
});

const ExtractionResponseSchema = z.object({
  items: z.array(ExtractedItemSchema),
  source: z.string().nullable(), // restaurant name, "homemade", or null
  accompaniments: z.array(z.string()), // sauces, dips, sides mentioned
  rawInput: z.string(), // echo back for debugging
});

export type ExtractedItem = z.infer<typeof ExtractedItemSchema>;
export type ExtractionResponse = z.infer<typeof ExtractionResponseSchema>;

/**
 * MINIMAL PROMPT - just extraction, no rules
 * ~200 tokens vs ~1500 tokens in the old prompt
 */
const EXTRACTION_PROMPT = `Extract food items from the input. Report ONLY what was explicitly mentioned.

Return JSON:
{
  "items": [{ "name": "food name", "quantity": number or null, "unit": "unit" or null, "preparation": "method" or null }],
  "source": "restaurant name" or "homemade" or null,
  "accompaniments": ["sauces", "dips", "sides mentioned"],
  "rawInput": "echo the input"
}

Rules:
- quantity: null if not specified (don't guess)
- preparation: null if not mentioned (don't assume)
- source: null if not mentioned (don't assume fast food)
- accompaniments: empty array if none mentioned

Examples:
"6 grilled chicken nuggets with bbq sauce" → quantity:6, preparation:"grilled", accompaniments:["bbq sauce"]
"chicken nuggets" → quantity:null, preparation:null, accompaniments:[]
"McDonald's fries" → source:"McDonald's", accompaniments:[]`;

/**
 * Extract meal information from user input
 * Returns ONLY what was mentioned - no assumptions
 */
export async function extractMealInfo(input: string): Promise<ExtractionResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content: input },
      ],
      temperature: 0.1, // Low temperature for consistent extraction
      max_tokens: 300,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from AI');
    }

    const parsed = JSON.parse(content);
    const result = ExtractionResponseSchema.safeParse(parsed);

    if (!result.success) {
      console.error('[Extraction] Validation error:', result.error);
      // Return minimal fallback
      return {
        items: [{ name: input, quantity: null, unit: null, preparation: null }],
        source: null,
        accompaniments: [],
        rawInput: input,
      };
    }

    return result.data;
  } catch (error) {
    console.error('[Extraction] Error:', error);
    // Return the input as a single item for manual processing
    return {
      items: [{ name: input, quantity: null, unit: null, preparation: null }],
      source: null,
      accompaniments: [],
      rawInput: input,
    };
  }
}

/**
 * Re-extract with additional context (after follow-up answer)
 */
export async function extractWithContext(
  originalInput: string,
  followUpQuestion: string,
  followUpAnswer: string
): Promise<ExtractionResponse> {
  const contextualInput = `${originalInput}. ${followUpQuestion}: ${followUpAnswer}`;
  return extractMealInfo(contextualInput);
}
