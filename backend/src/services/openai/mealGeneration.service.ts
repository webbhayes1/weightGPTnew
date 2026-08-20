/**
 * Meal Generation Service
 * OpenAI-powered weekly meal plan generation
 */

import OpenAI from 'openai';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Auto-expire old meal plans
 * Marks any active meal plans as 'past' if their weekEndDate is before today
 * Called on app open / when fetching daily meals
 */
export async function autoExpireOldMealPlans(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await prisma.mealPlan.updateMany({
    where: {
      userId,
      status: 'active',
      weekEndDate: {
        lt: today, // weekEndDate < today
      },
    },
    data: {
      status: 'past',
    },
  });

  if (result.count > 0) {
    console.log(`[MealPlan] Auto-expired ${result.count} old meal plan(s) for user ${userId}`);
  }

  return result.count;
}

// Valid enum values
type Unit = 'count' | 'oz' | 'lb' | 'cup' | 'tbsp' | 'tsp' | 'package';
type IngredientCategory = 'proteins' | 'produce' | 'dairy_eggs' | 'pantry' | 'spices' | 'frozen' | 'bakery' | 'other';

// Map string unit to valid Unit enum
function mapUnit(unit: string | undefined | null): Unit {
  // Handle undefined/null/empty unit
  if (!unit || typeof unit !== 'string') {
    console.warn('[mapUnit] Invalid unit provided:', unit, '- defaulting to "count"');
    return 'count';
  }

  const unitMap: Record<string, Unit> = {
    count: 'count',
    piece: 'count',
    pieces: 'count',
    oz: 'oz',
    ounce: 'oz',
    ounces: 'oz',
    lb: 'lb',
    lbs: 'lb',
    pound: 'lb',
    pounds: 'lb',
    cup: 'cup',
    cups: 'cup',
    tbsp: 'tbsp',
    tablespoon: 'tbsp',
    tablespoons: 'tbsp',
    tsp: 'tsp',
    teaspoon: 'tsp',
    teaspoons: 'tsp',
    package: 'package',
    pkg: 'package',
  };
  return unitMap[unit.toLowerCase()] || 'count';
}

// Map string category to valid IngredientCategory enum
function mapCategory(category: string | undefined): IngredientCategory {
  if (!category) return 'other';
  const categoryMap: Record<string, IngredientCategory> = {
    proteins: 'proteins',
    protein: 'proteins',
    meat: 'proteins',
    produce: 'produce',
    vegetable: 'produce',
    vegetables: 'produce',
    fruit: 'produce',
    fruits: 'produce',
    dairy_eggs: 'dairy_eggs',
    dairy: 'dairy_eggs',
    eggs: 'dairy_eggs',
    pantry: 'pantry',
    grains: 'pantry',
    spices: 'spices',
    herbs: 'spices',
    seasonings: 'spices',
    frozen: 'frozen',
    bakery: 'bakery',
    bread: 'bakery',
    other: 'other',
  };
  return categoryMap[category.toLowerCase()] || 'other';
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: parseInt(process.env.OPENAI_TIMEOUT || '180000'), // 180 seconds (3 min) for generating full week of meals
  maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES || '2'), // Reduce retries to avoid cascading timeouts
});

// Zod schema for individual ingredient
const IngredientSchema = z.object({
  name: z.string(),
  quantity: z.number().positive().max(1000, 'Ingredient quantity must be <= 1000'),
  unit: z.string(),
  category: z.string().optional(),
});

// Zod schema for individual meal (ingredients/instructions optional - generated on-demand)
const GeneratedMealSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  dayOfWeek: z.number().min(0).max(6), // 0=Sunday, 6=Saturday
  calories: z.number().positive(),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  prepTimeMin: z.number().min(0).optional(),
  cookTimeMin: z.number().min(0).optional(),
  ingredients: z.array(IngredientSchema).optional(), // Optional - generated later
  instructions: z.array(z.string()).optional(), // Optional - generated later
});

// Zod schema for full meal plan response
const MealPlanResponseSchema = z.object({
  meals: z.array(GeneratedMealSchema),
});

export type GeneratedMeal = z.infer<typeof GeneratedMealSchema>;
export type MealPlanResponse = z.infer<typeof MealPlanResponseSchema>;

// User profile data for meal generation
interface UserProfile {
  goal: string;
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  dietaryRestrictions: string[];
  dislikedFoods: string[];
  preferredCuisines: string[];
  eatingPattern: {
    mealsPerDay: number;
    mealTypes: string[];
  };
}

/**
 * Build the prompt for OpenAI meal generation
 */
function buildMealGenerationPrompt(profile: UserProfile): string {
  const goalDescription = {
    lose_weight: 'Lose weight with a caloric deficit',
    gain_weight: 'Gain muscle/weight with a caloric surplus',
    maintain: 'Maintain current weight',
  }[profile.goal] || 'Maintain current weight';

  const restrictions = profile.dietaryRestrictions.length > 0
    ? profile.dietaryRestrictions.join(', ')
    : 'None';

  const dislikes = profile.dislikedFoods.length > 0
    ? profile.dislikedFoods.join(', ')
    : 'None';

  const cuisines = profile.preferredCuisines.length > 0
    ? profile.preferredCuisines.join(', ')
    : 'Any';

  const mealTypes = profile.eatingPattern.mealTypes.join(', ');

  return `Generate a complete 7-day meal plan for a user with the following profile:

**Goal:** ${goalDescription}

**Daily Nutritional Targets:**
- Calories: ${profile.dailyCalories} kcal/day
- Protein: ${profile.macros.protein}g/day
- Carbs: ${profile.macros.carbs}g/day
- Fat: ${profile.macros.fat}g/day

**Eating Pattern:** ${profile.eatingPattern.mealsPerDay} meals per day (${mealTypes})

**Dietary Restrictions:** ${restrictions}

**🚨 ABSOLUTELY FORBIDDEN FOODS - NEVER USE THESE: ${dislikes}**
${profile.dislikedFoods.length > 0 ? `The user is ALLERGIC or has STRICT RESTRICTIONS against: ${dislikes}. Do NOT include ANY meals that contain these foods in ANY form.` : ''}

**Preferred Cuisines:** ${cuisines}

**CRITICAL REQUIREMENTS:**
1. Generate EXACTLY ${profile.eatingPattern.mealsPerDay * 7} meals total
2. For EACH of the 7 days (Sunday=0 through Saturday=6), generate EXACTLY ${profile.eatingPattern.mealsPerDay} meals
3. The meal types for each day must be: ${mealTypes}
4. Each meal must include: name, description, mealType, dayOfWeek, calories, protein, carbs, fat, prepTimeMin, cookTimeMin
5. DO NOT include ingredients or instructions
6. **MACRO TARGETING WITH DAILY FLEXIBILITY:** Each day's ${profile.eatingPattern.mealsPerDay} meals should target approximately ${profile.dailyCalories} calories, ${profile.macros.protein}g protein, ${profile.macros.carbs}g carbs, and ${profile.macros.fat}g fat. IMPORTANT: Allow ±10% daily variation (e.g., one day might be ${Math.round(profile.dailyCalories * 0.9)}-${Math.round(profile.dailyCalories * 1.1)} calories) to create realistic, sustainable meal plans. The WEEKLY AVERAGE across all 7 days should hit the targets.
7. Distribute macros across all ${profile.eatingPattern.mealsPerDay} meals each day (approximately ${Math.round(profile.dailyCalories / profile.eatingPattern.mealsPerDay)} calories per meal, but can vary)
8. Include variety - avoid repeating the same meal more than twice per week
9. All meals must align with dietary restrictions: ${restrictions}
10. 🚨 CRITICAL - ABSOLUTE REQUIREMENT: DO NOT include ANY meals containing these FORBIDDEN FOODS: ${dislikes}. This is NON-NEGOTIABLE. Check every meal name and description carefully before including it.

**EXAMPLE OUTPUT STRUCTURE (for ${profile.eatingPattern.mealsPerDay} meals/day):**
{
  "meals": [
    // Day 0 (Sunday) - ${profile.eatingPattern.mealsPerDay} meals
    {"name": "Scrambled Eggs with Toast", "mealType": "breakfast", "dayOfWeek": 0, "calories": 400, "protein": 25, "carbs": 40, "fat": 15, "prepTimeMin": 5, "cookTimeMin": 10},
    {"name": "Grilled Chicken Salad", "mealType": "lunch", "dayOfWeek": 0, "calories": 500, "protein": 40, "carbs": 35, "fat": 20, "prepTimeMin": 10, "cookTimeMin": 15},
    {"name": "Salmon with Rice and Vegetables", "mealType": "dinner", "dayOfWeek": 0, "calories": 600, "protein": 45, "carbs": 55, "fat": 25, "prepTimeMin": 10, "cookTimeMin": 20},
    // Day 1 (Monday) - ${profile.eatingPattern.mealsPerDay} meals
    {"name": "Oatmeal with Berries", "mealType": "breakfast", "dayOfWeek": 1, "calories": 350, "protein": 15, "carbs": 50, "fat": 10, "prepTimeMin": 5, "cookTimeMin": 5},
    {"name": "Turkey Sandwich", "mealType": "lunch", "dayOfWeek": 1, "calories": 550, "protein": 35, "carbs": 45, "fat": 22, "prepTimeMin": 5, "cookTimeMin": 0},
    {"name": "Beef Stir Fry", "mealType": "dinner", "dayOfWeek": 1, "calories": 650, "protein": 50, "carbs": 60, "fat": 28, "prepTimeMin": 15, "cookTimeMin": 15},
    // Continue for all 7 days...
  ]
}

Generate the complete meal plan NOW with all ${profile.eatingPattern.mealsPerDay * 7} meals.`;
}

/**
 * Fetch user profile for meal generation
 */
async function getUserProfile(userId: string): Promise<UserProfile> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      goal: true,
      dailyCalories: true,
      macros: true,
      dietaryRestrictions: true,
      dislikedFoods: true,
      preferredCuisines: true,
      eatingPattern: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Default macros if not set
  const defaultMacros = { protein: 150, carbs: 200, fat: 65 };
  const macros = user.macros as { protein: number; carbs: number; fat: number } | null;

  // Default eating pattern if not set
  const defaultEatingPattern = {
    mealsPerDay: 3,
    mealTypes: ['breakfast', 'lunch', 'dinner'],
  };
  const rawEatingPattern = user.eatingPattern as { mealsPerDay?: number; mealTypes?: string[]; snacksPerDay?: number } | null;

  // Build eating pattern with proper defaults
  let eatingPattern = defaultEatingPattern;
  if (rawEatingPattern) {
    const mealsPerDay = rawEatingPattern.mealsPerDay || 3;
    let mealTypes = rawEatingPattern.mealTypes;

    // If mealTypes not provided, generate based on mealsPerDay
    if (!mealTypes || mealTypes.length === 0) {
      if (mealsPerDay === 2) {
        mealTypes = ['lunch', 'dinner'];
      } else if (mealsPerDay >= 3) {
        mealTypes = ['breakfast', 'lunch', 'dinner'];
      } else {
        mealTypes = ['dinner'];
      }
      // Add snacks if specified
      if (rawEatingPattern.snacksPerDay && rawEatingPattern.snacksPerDay > 0) {
        mealTypes.push('snack');
      }
    }

    eatingPattern = { mealsPerDay, mealTypes };
  }

  // Handle arrays that might be null/undefined (users can intentionally leave these blank)
  const dietaryRestrictions = Array.isArray(user.dietaryRestrictions)
    ? user.dietaryRestrictions as string[]
    : [];
  const dislikedFoods = Array.isArray(user.dislikedFoods)
    ? user.dislikedFoods as string[]
    : [];
  const preferredCuisines = Array.isArray(user.preferredCuisines)
    ? user.preferredCuisines as string[]
    : [];

  return {
    goal: user.goal || 'maintain',
    dailyCalories: user.dailyCalories || 2000,
    macros: macros || defaultMacros,
    dietaryRestrictions,
    dislikedFoods,
    preferredCuisines,
    eatingPattern,
  };
}

/**
 * Validate weekly macro balance
 * Returns true if within ±5% of targets
 */
function validateMacroBalance(
  meals: GeneratedMeal[],
  dailyTargets: { calories: number; protein: number; carbs: number; fat: number }
): { valid: boolean; analysis: string } {
  const weeklyTargets = {
    calories: dailyTargets.calories * 7,
    protein: dailyTargets.protein * 7,
    carbs: dailyTargets.carbs * 7,
    fat: dailyTargets.fat * 7,
  };

  const weeklyActual = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const tolerance = 0.05; // 5%

  const caloriesDiff = Math.abs(weeklyActual.calories - weeklyTargets.calories) / weeklyTargets.calories;
  const proteinDiff = Math.abs(weeklyActual.protein - weeklyTargets.protein) / weeklyTargets.protein;
  const carbsDiff = Math.abs(weeklyActual.carbs - weeklyTargets.carbs) / weeklyTargets.carbs;
  const fatDiff = Math.abs(weeklyActual.fat - weeklyTargets.fat) / weeklyTargets.fat;

  const valid = caloriesDiff <= tolerance && proteinDiff <= tolerance && carbsDiff <= tolerance && fatDiff <= tolerance;

  const analysis = `Weekly Totals - Calories: ${weeklyActual.calories}/${weeklyTargets.calories} (${(caloriesDiff * 100).toFixed(1)}% diff), ` +
    `Protein: ${weeklyActual.protein}g/${weeklyTargets.protein}g (${(proteinDiff * 100).toFixed(1)}% diff), ` +
    `Carbs: ${weeklyActual.carbs}g/${weeklyTargets.carbs}g (${(carbsDiff * 100).toFixed(1)}% diff), ` +
    `Fat: ${weeklyActual.fat}g/${weeklyTargets.fat}g (${(fatDiff * 100).toFixed(1)}% diff)`;

  return { valid, analysis };
}

/**
 * Generate a weekly meal plan using OpenAI
 */
export async function generateWeeklyMealPlan(userId: string): Promise<{
  meals: GeneratedMeal[];
  macroAnalysis: string;
}> {
  // Get user profile
  const profile = await getUserProfile(userId);

  // Build prompt
  const prompt = buildMealGenerationPrompt(profile);

  console.log('[MealGen] Sending prompt to OpenAI...');
  console.log('[MealGen] Generating', profile.eatingPattern.mealsPerDay * 7, 'meals WITHOUT recipes');
  console.log('[MealGen] Model:', process.env.OPENAI_MODEL || 'gpt-4o-mini');

  const startTime = Date.now();
  console.log('[MealGen] OpenAI request started at:', new Date(startTime).toISOString());

  // Call OpenAI
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a professional nutritionist and meal planner. Generate detailed, healthy meal plans that meet specific nutritional requirements. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const endTime = Date.now();
  const durationSec = ((endTime - startTime) / 1000).toFixed(2);
  console.log('[MealGen] OpenAI response received after:', durationSec, 'seconds');

  const responseContent = completion.choices[0]?.message?.content;

  if (!responseContent) {
    throw new Error('No response from OpenAI');
  }

  // Parse JSON response
  let parsedResponse: unknown;
  try {
    parsedResponse = JSON.parse(responseContent);
  } catch (error) {
    console.error('Failed to parse OpenAI response:', responseContent);
    throw new Error('Invalid JSON response from OpenAI');
  }

  // Validate with Zod
  const validationResult = MealPlanResponseSchema.safeParse(parsedResponse);

  if (!validationResult.success) {
    console.error('Zod validation failed:', validationResult.error.errors);
    throw new Error(`Invalid meal plan format: ${validationResult.error.errors.map(e => e.message).join(', ')}`);
  }

  const { meals } = validationResult.data;

  // Validate macro balance
  const macroValidation = validateMacroBalance(meals, {
    calories: profile.dailyCalories,
    protein: profile.macros.protein,
    carbs: profile.macros.carbs,
    fat: profile.macros.fat,
  });

  if (!macroValidation.valid) {
    console.warn('Macro balance outside tolerance:', macroValidation.analysis);
    // We continue anyway but log the warning
  }

  return {
    meals,
    macroAnalysis: macroValidation.analysis,
  };
}

/**
 * Store generated meal plan in database
 */
export async function storeMealPlan(
  userId: string,
  meals: GeneratedMeal[],
  weekStartDate: Date
): Promise<string> {
  // Calculate week end date (6 days after start)
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  // Create meal plan
  const mealPlan = await prisma.mealPlan.create({
    data: {
      userId,
      weekStartDate,
      weekEndDate,
      status: 'active',
    },
  });

  // Create meals (without ingredients/instructions - those are generated on-demand)
  for (const meal of meals) {
    await prisma.meal.create({
      data: {
        userId,
        mealPlanId: mealPlan.id,
        name: meal.name,
        description: meal.description || '',
        mealType: meal.mealType,
        dayOfWeek: meal.dayOfWeek,
        calories: meal.calories,
        macros: {
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
        },
        prepTimeMin: meal.prepTimeMin || 0,
        cookTimeMin: meal.cookTimeMin || 0,
        // Note: ingredients and recipeSteps will be generated on-demand when user views the meal
      },
    });
  }

  return mealPlan.id;
}

/**
 * Generate recipe (ingredients + instructions) for a specific meal
 * Called on-demand when user views a meal
 */
export async function generateMealRecipe(
  mealId: string,
  mealName: string,
  mealDescription: string,
  targetMacros: { calories: number; protein: number; carbs: number; fat: number },
  userId?: string
): Promise<{ ingredients: any[]; instructions: string[] }> {
  // Fetch user dietary restrictions if userId provided
  let dislikedFoods: string[] = [];
  let dietaryRestrictions: string[] = [];
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { dislikedFoods: true, dietaryRestrictions: true },
    });
    dislikedFoods = (user?.dislikedFoods as string[]) || [];
    dietaryRestrictions = (user?.dietaryRestrictions as string[]) || [];
  }

  const forbiddenContext = dislikedFoods.length > 0
    ? `\n\n**🚨 CRITICAL - FORBIDDEN INGREDIENTS:** The user CANNOT eat: ${dislikedFoods.join(', ')}. DO NOT include these in ANY form.`
    : '';

  const dietaryContext = dietaryRestrictions.length > 0
    ? `\n**Dietary Restrictions:** ${dietaryRestrictions.join(', ')}`
    : '';

  const prompt = `Generate a detailed recipe for this meal:

**Meal:** ${mealName}
**Description:** ${mealDescription}

**Target Macros:**
- Calories: ${targetMacros.calories} kcal
- Protein: ${targetMacros.protein}g
- Carbs: ${targetMacros.carbs}g
- Fat: ${targetMacros.fat}g${dietaryContext}${forbiddenContext}

**Requirements:**
1. Provide a complete list of ingredients with quantities and units
2. Provide step-by-step cooking instructions
3. Ensure ingredients and portions match the target macros
4. Use common, accessible ingredients
5. Keep instructions clear and concise
6. 🚨 CRITICAL: DO NOT use any of these forbidden ingredients: ${dislikedFoods.join(', ') || 'None'}

Return ONLY valid JSON in this exact format:
{
  "ingredients": [
    { "name": "Chicken breast", "quantity": 6, "unit": "oz", "category": "Protein" },
    { "name": "Romaine lettuce", "quantity": 2, "unit": "cup", "category": "Produce" }
  ],
  "instructions": [
    "Season chicken breast with salt and pepper",
    "Grill chicken for 6-7 minutes per side until internal temp reaches 165°F",
    "Let chicken rest for 5 minutes, then slice",
    "Chop romaine lettuce and place in large bowl",
    "Add sliced chicken and toss with caesar dressing"
  ]
}`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a professional chef and nutritionist. Generate detailed, accurate recipes that meet specific nutritional requirements. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const responseContent = completion.choices[0]?.message?.content;

  if (!responseContent) {
    throw new Error('No response from OpenAI for recipe generation');
  }

  // Parse JSON response
  let parsedResponse: any;
  try {
    parsedResponse = JSON.parse(responseContent);
  } catch (error) {
    console.error('Failed to parse OpenAI recipe response:', responseContent);
    throw new Error('Invalid JSON response from OpenAI');
  }

  // Validate response has required fields
  if (!parsedResponse.ingredients || !parsedResponse.instructions) {
    throw new Error('Recipe response missing required fields');
  }

  // Store ingredients and instructions in database
  await prisma.$transaction(async (tx) => {
    // Create ingredients (with validation)
    let validIngredientCount = 0;
    for (let i = 0; i < parsedResponse.ingredients.length; i++) {
      const ing = parsedResponse.ingredients[i];

      // Validate quantity is reasonable (reject absurd values from OpenAI)
      if (ing.quantity <= 0 || ing.quantity > 1000 || !isFinite(ing.quantity)) {
        console.warn(`[MealGeneration] Skipping ingredient with invalid quantity: ${ing.name} (${ing.quantity} ${ing.unit})`);
        continue;
      }

      await tx.ingredient.create({
        data: {
          mealId,
          name: ing.name,
          quantity: ing.quantity,
          unit: mapUnit(ing.unit),
          category: mapCategory(ing.category),
          displayOrder: validIngredientCount + 1,
        },
      });
      validIngredientCount++;
    }

    console.log(`[MealGeneration] Saved ${validIngredientCount}/${parsedResponse.ingredients.length} ingredients for meal ${mealId}`);

    // Create recipe steps
    for (let i = 0; i < parsedResponse.instructions.length; i++) {
      await tx.recipeStep.create({
        data: {
          mealId,
          stepNumber: i + 1,
          instruction: parsedResponse.instructions[i],
        },
      });
    }
  });

  return {
    ingredients: parsedResponse.ingredients,
    instructions: parsedResponse.instructions,
  };
}

/**
 * Generate AI-powered meal alternatives for swapping
 * Creates 3 alternative meals with similar macros
 */
export async function generateMealAlternatives(
  userId: string,
  originalMeal: {
    name: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }
): Promise<{ alternatives: GeneratedMeal[] }> {
  // Fetch user preferences
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const dietaryRestrictions = user.dietaryRestrictions as string[] || [];
  const dislikedFoods = user.dislikedFoods as string[] || [];
  const preferredCuisines = user.preferredCuisines as string[] || [];
  const eatingPattern = user.eatingPattern as string[] || [];

  // Calculate macro ranges (±50 cal, ±5g protein)
  const calorieRange = {
    min: originalMeal.calories - 50,
    max: originalMeal.calories + 50,
  };
  const proteinRange = {
    min: originalMeal.protein - 5,
    max: originalMeal.protein + 5,
  };

  // Build dietary context
  const dietaryContext = dietaryRestrictions.length > 0
    ? `\n- **Dietary Restrictions:** ${dietaryRestrictions.join(', ')}`
    : '';
  const dislikedContext = dislikedFoods.length > 0
    ? `\n- **Avoided Foods:** ${dislikedFoods.join(', ')}`
    : '';
  const cuisineContext = preferredCuisines.length > 0
    ? `\n- **Preferred Cuisines:** ${preferredCuisines.join(', ')}`
    : '';
  const patternContext = eatingPattern.length > 0
    ? `\n- **Eating Patterns:** ${eatingPattern.join(', ')}`
    : '';

  const prompt = `You are a nutritionist creating alternative meals for a meal swap.

**ORIGINAL MEAL:**
- Name: ${originalMeal.name}
- Type: ${originalMeal.mealType}
- Calories: ${originalMeal.calories} kcal
- Protein: ${originalMeal.protein}g
- Carbs: ${originalMeal.carbs}g
- Fat: ${originalMeal.fat}g

**USER PROFILE:**${dietaryContext}${dislikedContext}${cuisineContext}${patternContext}

**REQUIREMENTS:**
1. Generate exactly 3 alternative ${originalMeal.mealType} meals
2. Each meal must match these macro ranges:
   - Calories: ${calorieRange.min}-${calorieRange.max} kcal (±50 from ${originalMeal.calories})
   - Protein: ${proteinRange.min}-${proteinRange.max}g (±5g from ${originalMeal.protein})
   - Carbs and fat should be close but slightly flexible
3. All meals must respect dietary restrictions and avoided foods
4. Provide variety - make each alternative distinct from the original and from each other
5. Consider preferred cuisines if provided
6. Meals should be practical and achievable

**OUTPUT FORMAT (JSON only, no markdown):**
{
  "meals": [
    {
      "name": "Meal name",
      "description": "Brief description",
      "mealType": "${originalMeal.mealType}",
      "dayOfWeek": 0,
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "prepTimeMin": number,
      "cookTimeMin": number
    }
  ]
}

Generate the 3 alternatives now.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8, // Higher temperature for more variety
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error('Empty response from OpenAI');
    }

    const parsedResponse = JSON.parse(responseText);
    const alternatives = parsedResponse.meals || [];

    // Validate we got 3 meals
    if (alternatives.length !== 3) {
      console.warn(`Expected 3 alternatives, got ${alternatives.length}`);
    }

    // Validate macros are within range
    for (const meal of alternatives) {
      if (meal.calories < calorieRange.min || meal.calories > calorieRange.max) {
        console.warn(`Meal "${meal.name}" calories ${meal.calories} outside range ${calorieRange.min}-${calorieRange.max}`);
      }
      if (meal.protein < proteinRange.min || meal.protein > proteinRange.max) {
        console.warn(`Meal "${meal.name}" protein ${meal.protein}g outside range ${proteinRange.min}-${proteinRange.max}g`);
      }
    }

    return { alternatives };
  } catch (error) {
    console.error('Error generating meal alternatives:', error);
    throw error;
  }
}

export default {
  generateWeeklyMealPlan,
  storeMealPlan,
  generateMealRecipe,
  generateMealAlternatives,
};
