/**
 * Food Categories for Deterministic Follow-up Logic
 *
 * These categories define what follow-up questions are needed based on food type.
 * The logic is in TypeScript, not in AI prompts, making it:
 * - Predictable and testable
 * - Fast (no AI calls for follow-up decisions)
 * - Easy to maintain and extend
 */

// Foods that are counted in discrete units (need quantity question if not specified)
export const COUNTABLE_PATTERNS = [
  // Individual items
  'nugget', 'wing', 'egg', 'cookie', 'brownie', 'muffin', 'donut', 'doughnut',
  'slice', 'piece', 'strip', 'tender', 'finger', 'stick', 'roll', 'biscuit',
  'pancake', 'waffle', 'taco', 'burrito', 'wrap', 'sandwich', 'burger',
  'hot dog', 'sausage', 'bacon strip', 'toast', 'croissant', 'bagel',
  'cupcake', 'macaron', 'truffle', 'candy', 'gummy', 'chip', 'cracker',
  'shrimp', 'scallop', 'oyster', 'clam', 'mussel', 'crab cake',
  'meatball', 'dumpling', 'potsticker', 'spring roll', 'egg roll',
  'pizza slice', 'quesadilla', 'empanada', 'samosa', 'pierogi',
  'ravioli', 'tortellini', 'wonton', 'gyoza',
  'rib', 'drumstick', 'thigh', 'breast',
  'oreo', 'cookie', 'cracker',
];

// Foods measured by portion/serving size (need portion question if not specified)
// These are bulk foods where we need to know how much was eaten
export const PORTION_PATTERNS = [
  // Pasta and noodles
  'pasta', 'spaghetti', 'penne', 'fettuccine', 'linguine', 'macaroni',
  'noodle', 'ramen', 'udon', 'lo mein', 'pad thai', 'mac and cheese',
  // Rice and grains
  'rice', 'fried rice', 'risotto', 'quinoa', 'couscous', 'bulgur',
  'oatmeal', 'oat', 'porridge', 'grits', 'polenta',
  // Cereals
  'cereal', 'granola', 'muesli',
  // Proteins without clear portions
  'chicken', 'beef', 'steak', 'pork', 'fish', 'salmon', 'tuna',
  'turkey', 'ham', 'lamb', 'shrimp', 'lobster', 'crab',
  // Salads and bowls
  'salad', 'bowl', 'poke bowl', 'acai bowl', 'buddha bowl',
  // Soups and stews
  'soup', 'stew', 'chili', 'chowder', 'broth',
  // Sides
  'mashed potato', 'fries', 'french fries', 'potato',
  'beans', 'corn', 'peas', 'broccoli', 'spinach', 'kale',
  // Ice cream and desserts
  'ice cream', 'gelato', 'frozen yogurt', 'froyo', 'pudding', 'custard',
];

// Foods that commonly come with sauces/dips (need accompaniment question)
export const SAUCE_FOOD_PATTERNS = [
  'nugget', 'tender', 'strip', 'finger', 'wing',
  'fry', 'fries', 'tots', 'wedge',
  'chip', 'nacho', 'tortilla chip',
  'mozzarella stick', 'onion ring', 'jalapeno popper',
  'egg roll', 'spring roll', 'dumpling', 'potsticker',
  'pretzel', 'bread stick', 'breadstick',
  'carrot', 'celery', 'veggie', 'crudite',
];

// Foods where preparation method significantly affects calories
export const PREPARATION_PATTERNS = [
  'chicken', 'fish', 'salmon', 'tuna', 'cod', 'tilapia', 'shrimp',
  'steak', 'beef', 'pork', 'lamb',
  'egg', 'eggs',
  'potato', 'potatoes',
  'vegetable', 'vegetables', 'veggies',
  'tofu', 'tempeh',
];

// Common preparation methods
export const PREPARATION_METHODS = [
  'fried', 'deep fried', 'pan fried',
  'grilled', 'chargrilled', 'bbq', 'barbecue',
  'baked', 'roasted', 'oven',
  'steamed', 'boiled', 'poached',
  'sauteed', 'stir fried', 'stir-fried',
  'raw', 'fresh',
  'air fried', 'air-fried',
  'smoked', 'blackened', 'cajun',
  'scrambled', 'sunny side', 'over easy', 'hard boiled', 'soft boiled',
];

// Foods where brand/type matters significantly
export const BRANDED_PATTERNS = [
  'protein shake', 'protein powder', 'whey', 'casein',
  'energy bar', 'protein bar', 'granola bar', 'snack bar',
  'energy drink', 'sports drink',
  'yogurt', 'greek yogurt',
  'cereal', 'oatmeal',
  'peanut butter', 'almond butter', 'nut butter',
  'bread', 'bagel',
  'ice cream', 'frozen yogurt',
  'milk', 'almond milk', 'oat milk',
];

// Common sauces/dips and their approximate calories per serving
export const SAUCE_CALORIES: Record<string, { calories: number; fat: number; carbs: number; protein: number }> = {
  'bbq sauce': { calories: 70, fat: 0, carbs: 17, protein: 0 },
  'ranch': { calories: 130, fat: 14, carbs: 1, protein: 0 },
  'honey mustard': { calories: 90, fat: 7, carbs: 6, protein: 0 },
  'buffalo sauce': { calories: 10, fat: 0, carbs: 2, protein: 0 },
  'ketchup': { calories: 20, fat: 0, carbs: 5, protein: 0 },
  'mayo': { calories: 100, fat: 11, carbs: 0, protein: 0 },
  'mustard': { calories: 5, fat: 0, carbs: 0, protein: 0 },
  'hot sauce': { calories: 5, fat: 0, carbs: 1, protein: 0 },
  'sweet and sour': { calories: 60, fat: 0, carbs: 15, protein: 0 },
  'teriyaki': { calories: 40, fat: 0, carbs: 8, protein: 1 },
  'soy sauce': { calories: 10, fat: 0, carbs: 1, protein: 2 },
  'sriracha': { calories: 15, fat: 0, carbs: 3, protein: 0 },
  'blue cheese': { calories: 150, fat: 16, carbs: 1, protein: 1 },
  'caesar': { calories: 170, fat: 18, carbs: 1, protein: 1 },
  'italian': { calories: 80, fat: 8, carbs: 2, protein: 0 },
  'balsamic': { calories: 90, fat: 9, carbs: 3, protein: 0 },
  'thousand island': { calories: 120, fat: 11, carbs: 5, protein: 0 },
  'french': { calories: 70, fat: 6, carbs: 5, protein: 0 },
  'guacamole': { calories: 50, fat: 4, carbs: 3, protein: 1 },
  'salsa': { calories: 15, fat: 0, carbs: 3, protein: 0 },
  'sour cream': { calories: 60, fat: 5, carbs: 1, protein: 1 },
  'hummus': { calories: 70, fat: 5, carbs: 4, protein: 2 },
  'no sauce': { calories: 0, fat: 0, carbs: 0, protein: 0 },
  'none': { calories: 0, fat: 0, carbs: 0, protein: 0 },
};

// Common quick options for different question types
export const QUICK_OPTIONS = {
  quantity: ['1', '2', '3', '4', '6', '8', '10', '12'],
  preparation: ['Grilled', 'Fried', 'Baked', 'Steamed', 'Raw'],
  sauce: ['BBQ sauce', 'Ranch', 'Honey mustard', 'Ketchup', 'No sauce'],
  source: ['Homemade', 'Restaurant', 'Fast food', 'Frozen/store-bought'],
  size: ['Small', 'Medium', 'Large', 'Extra large'],
  scoops: ['1 scoop', '2 scoops', '3 scoops'],
  portion: ['Small (1/2 cup)', '1 cup', '1.5 cups', '2 cups', 'Large plate'],
};

/**
 * Check if a food name matches any pattern in the list
 */
export function matchesPattern(foodName: string, patterns: string[]): boolean {
  const normalized = foodName.toLowerCase();
  return patterns.some(pattern => normalized.includes(pattern.toLowerCase()));
}

/**
 * Check if food is countable (needs quantity if not specified)
 */
export function isCountable(foodName: string): boolean {
  return matchesPattern(foodName, COUNTABLE_PATTERNS);
}

/**
 * Check if food needs a portion size question (bulk foods like pasta, rice, etc.)
 */
export function needsPortionQuestion(foodName: string): boolean {
  return matchesPattern(foodName, PORTION_PATTERNS);
}

/**
 * Check if food commonly comes with sauce
 */
export function needsSauceQuestion(foodName: string): boolean {
  return matchesPattern(foodName, SAUCE_FOOD_PATTERNS);
}

/**
 * Check if preparation method significantly affects nutrition
 */
export function needsPreparationQuestion(foodName: string): boolean {
  return matchesPattern(foodName, PREPARATION_PATTERNS);
}

/**
 * Check if brand/type matters for this food
 */
export function needsBrandQuestion(foodName: string): boolean {
  return matchesPattern(foodName, BRANDED_PATTERNS);
}

/**
 * Check if a preparation method was mentioned in the text
 */
export function extractPreparation(text: string): string | null {
  const normalized = text.toLowerCase();
  for (const method of PREPARATION_METHODS) {
    if (normalized.includes(method)) {
      return method;
    }
  }
  return null;
}

/**
 * Extract quantity from text if present
 * Returns null if no clear quantity found
 */
export function extractQuantity(text: string): number | null {
  // Match patterns like "6 nuggets", "twelve wings", "a dozen eggs"
  const numberWords: Record<string, number> = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'dozen': 12, 'half dozen': 6,
    'a': 1, 'an': 1, 'couple': 2, 'few': 3, 'several': 4,
  };

  const normalized = text.toLowerCase();

  // Check for word numbers first
  for (const [word, num] of Object.entries(numberWords)) {
    if (normalized.includes(word + ' ')) {
      return num;
    }
  }

  // Check for numeric digits
  const numMatch = normalized.match(/(\d+)\s*(piece|nugget|wing|egg|slice|cookie|item|x\s)/i);
  if (numMatch) {
    return parseInt(numMatch[1], 10);
  }

  // Check for standalone numbers at start
  const startMatch = normalized.match(/^(\d+)\s+/);
  if (startMatch) {
    return parseInt(startMatch[1], 10);
  }

  return null;
}

/**
 * Check if any sauce/accompaniment was mentioned
 */
export function extractSauce(text: string): string | null {
  const normalized = text.toLowerCase();

  // Check for common sauce mentions
  const saucePatterns = Object.keys(SAUCE_CALORIES);
  for (const sauce of saucePatterns) {
    if (normalized.includes(sauce)) {
      return sauce;
    }
  }

  // Check for "with X sauce" pattern
  const withMatch = normalized.match(/with\s+(\w+(?:\s+\w+)?)\s*(?:sauce|dip|dipping)/i);
  if (withMatch) {
    return withMatch[1];
  }

  // Check for explicit no sauce
  if (normalized.includes('no sauce') || normalized.includes('plain') || normalized.includes('dry')) {
    return 'none';
  }

  return null;
}

/**
 * Check if restaurant was mentioned
 */
export function extractSource(text: string): string | null {
  const normalized = text.toLowerCase();

  // Common restaurant patterns
  const restaurants = [
    'mcdonald', 'burger king', 'wendy', 'chick-fil-a', 'chickfila', 'popeye',
    'kfc', 'taco bell', 'chipotle', 'subway', 'panera', 'starbucks',
    'dunkin', 'domino', 'pizza hut', 'papa john', 'little caesar',
    'five guys', 'shake shack', 'in-n-out', 'sonic', 'arby', 'dairy queen',
    'panda express', 'olive garden', 'applebee', 'chili', 'outback',
    'ihop', 'denny', 'waffle house', 'cracker barrel',
  ];

  for (const restaurant of restaurants) {
    if (normalized.includes(restaurant)) {
      // Return properly capitalized
      return restaurant.charAt(0).toUpperCase() + restaurant.slice(1);
    }
  }

  // Check for generic mentions
  if (normalized.includes('restaurant') || normalized.includes('takeout') || normalized.includes('take out')) {
    return 'restaurant';
  }

  if (normalized.includes('homemade') || normalized.includes('home made') || normalized.includes('i made')) {
    return 'homemade';
  }

  if (normalized.includes('frozen') || normalized.includes('store bought') || normalized.includes('store-bought')) {
    return 'frozen';
  }

  return null;
}
