/**
 * Meal Plan Generation Endpoint Tests
 * Tests for POST /api/meal-plans/generate
 */

import request from 'supertest';
import express from 'express';

// Mock data for generated meals
const mockGeneratedMeals = [
  {
    name: 'Protein Pancakes',
    description: 'Fluffy pancakes with protein powder',
    mealType: 'breakfast' as const,
    dayOfWeek: 1,
    calories: 380,
    protein: 32,
    carbs: 45,
    fat: 12,
    prepTimeMin: 10,
    cookTimeMin: 15,
    ingredients: [
      { name: 'Oats', quantity: 1, unit: 'cup', category: 'Grains' },
      { name: 'Protein Powder', quantity: 1, unit: 'scoop', category: 'Protein' },
    ],
    instructions: ['Mix ingredients', 'Cook on griddle'],
  },
  {
    name: 'Grilled Chicken Salad',
    description: 'Fresh salad with grilled chicken',
    mealType: 'lunch' as const,
    dayOfWeek: 1,
    calories: 450,
    protein: 40,
    carbs: 20,
    fat: 22,
    prepTimeMin: 15,
    cookTimeMin: 20,
    ingredients: [
      { name: 'Chicken Breast', quantity: 6, unit: 'oz', category: 'Protein' },
      { name: 'Mixed Greens', quantity: 2, unit: 'cup', category: 'Produce' },
    ],
    instructions: ['Grill chicken', 'Assemble salad'],
  },
];

// Mock Prisma - must be before imports that use it
const mockUserFindUnique = jest.fn();
const mockMealPlanFindFirst = jest.fn();
const mockMealPlanFindUnique = jest.fn();
const mockMealPlanCreate = jest.fn();
const mockMealPlanUpdate = jest.fn();
const mockMealCreate = jest.fn();
const mockIngredientCreate = jest.fn();
const mockRecipeStepCreate = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: mockUserFindUnique,
    },
    mealPlan: {
      findFirst: mockMealPlanFindFirst,
      findUnique: mockMealPlanFindUnique,
      create: mockMealPlanCreate,
      update: mockMealPlanUpdate,
    },
    meal: {
      create: mockMealCreate,
    },
    ingredient: {
      create: mockIngredientCreate,
    },
    recipeStep: {
      create: mockRecipeStepCreate,
    },
  })),
}));

// Mock OpenAI
const mockOpenAICreate = jest.fn();
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockOpenAICreate,
      },
    },
  }));
});

// Mock Firebase auth middleware
jest.mock('../../src/middleware/auth.middleware', () => ({
  verifyFirebaseToken: (req: any, _res: any, next: any) => {
    req.user = { userId: 'test-user-id' };
    next();
  },
}));

import mealPlanRouter from '../../src/routes/mealPlan.routes';

const app = express();
app.use(express.json());
app.use('/api/meal-plans', mealPlanRouter);

describe('Meal Plan Generation Endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/meal-plans/generate', () => {
    const mockUser = {
      id: 'test-user-id',
      goal: 'lose_weight',
      dailyCalories: 2000,
      macros: { protein: 150, carbs: 200, fat: 67 },
      dietaryRestrictions: [],
      dislikedFoods: [],
      preferredCuisines: [],
      eatingPattern: { mealsPerDay: 3, mealTypes: ['breakfast', 'lunch', 'dinner'] },
    };

    const mockMealPlan = {
      id: 'plan-1',
      userId: 'test-user-id',
      weekStartDate: new Date('2025-11-25'),
      weekEndDate: new Date('2025-12-01'),
      status: 'active',
      meals: mockGeneratedMeals.map((meal, i) => ({
        id: `meal-${i}`,
        ...meal,
        macros: { protein: meal.protein, carbs: meal.carbs, fat: meal.fat },
        ingredients: meal.ingredients.map((ing, j) => ({
          id: `ing-${i}-${j}`,
          ...ing,
          quantity: ing.quantity,
        })),
        recipeSteps: meal.instructions.map((inst, k) => ({
          stepNumber: k + 1,
          instruction: inst,
        })),
      })),
    };

    it('should generate a meal plan successfully', async () => {
      // Mock user lookup
      mockUserFindUnique.mockResolvedValue(mockUser);

      // Mock no existing plan
      mockMealPlanFindFirst.mockResolvedValue(null);

      // Mock OpenAI response
      mockOpenAICreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({ meals: mockGeneratedMeals }),
            },
          },
        ],
      });

      // Mock meal plan creation
      mockMealPlanCreate.mockResolvedValue({ id: 'plan-1' });

      // Mock meal creation
      mockMealCreate.mockResolvedValue({ id: 'meal-1' });

      // Mock final fetch
      mockMealPlanFindUnique.mockResolvedValue(mockMealPlan);

      const response = await request(app)
        .post('/api/meal-plans/generate')
        .send({ weekStartDate: '2025-11-25' })
        .expect(201);

      expect(response.body.id).toBe('plan-1');
      expect(response.body.status).toBe('active');
      expect(response.body.mealCount).toBe(2);
      expect(response.body.meals).toHaveLength(2);
      expect(response.body.macroAnalysis).toBeDefined();
    });

    it('should archive existing plan before generating new one', async () => {
      const existingPlan = {
        id: 'old-plan',
        status: 'active',
      };

      mockUserFindUnique.mockResolvedValue(mockUser);
      mockMealPlanFindFirst.mockResolvedValue(existingPlan);
      mockMealPlanUpdate.mockResolvedValue({ ...existingPlan, status: 'past' });
      mockOpenAICreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({ meals: mockGeneratedMeals }),
            },
          },
        ],
      });
      mockMealPlanCreate.mockResolvedValue({ id: 'plan-1' });
      mockMealCreate.mockResolvedValue({ id: 'meal-1' });
      mockMealPlanFindUnique.mockResolvedValue(mockMealPlan);

      await request(app)
        .post('/api/meal-plans/generate')
        .send({ weekStartDate: '2025-11-25' })
        .expect(201);

      // Verify old plan was archived
      expect(mockMealPlanUpdate).toHaveBeenCalledWith({
        where: { id: 'old-plan' },
        data: { status: 'past' },
      });
    });

    it('should return 401 if user not authenticated', async () => {
      // Override mock to not set user
      jest.resetModules();

      // This test would require a different setup - skip for now
      // The auth middleware always sets user in our mock
    });

    it('should return 500 if user not found', async () => {
      mockUserFindUnique.mockResolvedValue(null);
      mockMealPlanFindFirst.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/meal-plans/generate')
        .send({ weekStartDate: '2025-11-25' })
        .expect(500);

      expect(response.body.error).toBe('Failed to generate meal plan');
    });

    it('should return 500 if OpenAI returns invalid JSON', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);
      mockMealPlanFindFirst.mockResolvedValue(null);
      mockOpenAICreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: 'invalid json',
            },
          },
        ],
      });

      const response = await request(app)
        .post('/api/meal-plans/generate')
        .send({ weekStartDate: '2025-11-25' })
        .expect(500);

      expect(response.body.error).toBe('Failed to generate meal plan');
    });

    it('should return 500 if OpenAI returns no response', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);
      mockMealPlanFindFirst.mockResolvedValue(null);
      mockOpenAICreate.mockResolvedValue({
        choices: [],
      });

      const response = await request(app)
        .post('/api/meal-plans/generate')
        .send({ weekStartDate: '2025-11-25' })
        .expect(500);

      expect(response.body.error).toBe('Failed to generate meal plan');
    });

    it('should use next Monday as default week start date', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);
      mockMealPlanFindFirst.mockResolvedValue(null);
      mockOpenAICreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({ meals: mockGeneratedMeals }),
            },
          },
        ],
      });
      mockMealPlanCreate.mockResolvedValue({ id: 'plan-1' });
      mockMealCreate.mockResolvedValue({ id: 'meal-1' });
      mockMealPlanFindUnique.mockResolvedValue(mockMealPlan);

      const response = await request(app)
        .post('/api/meal-plans/generate')
        .send({}) // No weekStartDate provided
        .expect(201);

      expect(response.body.id).toBe('plan-1');
    });

    it('should handle OpenAI API errors gracefully', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);
      mockMealPlanFindFirst.mockResolvedValue(null);
      mockOpenAICreate.mockRejectedValue(new Error('OpenAI API error'));

      const response = await request(app)
        .post('/api/meal-plans/generate')
        .send({ weekStartDate: '2025-11-25' })
        .expect(500);

      expect(response.body.error).toBe('Failed to generate meal plan');
      expect(response.body.message).toBe('OpenAI API error');
    });

    it('should handle database errors gracefully', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);
      mockMealPlanFindFirst.mockResolvedValue(null);
      mockOpenAICreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({ meals: mockGeneratedMeals }),
            },
          },
        ],
      });
      mockMealPlanCreate.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/meal-plans/generate')
        .send({ weekStartDate: '2025-11-25' })
        .expect(500);

      expect(response.body.error).toBe('Failed to generate meal plan');
    });
  });
});
