/**
 * Meal Swap Endpoint Tests
 * Tests for GET /api/meals/:id/alternatives and PATCH /api/meals/:id/swap
 */

import request from 'supertest';
import express from 'express';

// Mock Prisma - must be before imports that use it
const mockMealFindUnique = jest.fn();
const mockMealFindMany = jest.fn();
const mockMealUpdate = jest.fn();
const mockTransaction = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    meal: {
      findUnique: mockMealFindUnique,
      findMany: mockMealFindMany,
      update: mockMealUpdate,
    },
    $transaction: mockTransaction,
  })),
}));

// Mock Firebase auth middleware
jest.mock('../../src/middleware/auth.middleware', () => ({
  verifyFirebaseToken: (req: any, _res: any, next: any) => {
    req.user = { userId: 'test-user-id' };
    next();
  },
}));

import mealsRouter from '../../src/routes/meals.routes';

const app = express();
app.use(express.json());
app.use('/api/meals', mealsRouter);

describe('Meal Swap Endpoints', () => {
  beforeEach(() => {
    mockMealFindUnique.mockReset();
    mockMealFindMany.mockReset();
    mockMealUpdate.mockReset();
    mockTransaction.mockReset();
  });

  describe('GET /api/meals/:id/alternatives', () => {
    const mockMeal = {
      id: 'meal-1',
      userId: 'test-user-id',
      name: 'Protein Pancakes',
      mealType: 'breakfast',
      calories: 380,
      macros: { protein: 32, carbs: 45, fat: 12 },
    };

    const mockAlternatives = [
      {
        id: 'meal-2',
        userId: 'test-user-id',
        name: 'Oatmeal with Protein',
        mealType: 'breakfast',
        dayOfWeek: 2,
        calories: 400,
        macros: { protein: 30, carbs: 52, fat: 10 },
        isFavorite: false,
        isDisliked: false,
      },
      {
        id: 'meal-3',
        userId: 'test-user-id',
        name: 'Scrambled Eggs',
        mealType: 'breakfast',
        dayOfWeek: 3,
        calories: 420,
        macros: { protein: 28, carbs: 38, fat: 16 },
        isFavorite: true,
        isDisliked: false,
      },
    ];

    it('should return alternatives for a meal', async () => {
      mockMealFindUnique.mockResolvedValue(mockMeal);
      mockMealFindMany.mockResolvedValue(mockAlternatives);

      const response = await request(app)
        .get('/api/meals/meal-1/alternatives')
        .expect(200);

      expect(response.body.originalMeal).toEqual({
        id: 'meal-1',
        name: 'Protein Pancakes',
        mealType: 'breakfast',
        calories: 380,
      });
      expect(response.body.alternatives).toHaveLength(2);
      expect(response.body.alternatives[0].name).toBe('Oatmeal with Protein');
    });

    it('should return 404 if meal not found', async () => {
      mockMealFindUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/meals/invalid-id/alternatives')
        .expect(404);

      expect(response.body.error).toBe('Meal not found');
    });

    it('should return 403 if meal belongs to different user', async () => {
      mockMealFindUnique.mockResolvedValue({
        ...mockMeal,
        userId: 'different-user',
      });

      const response = await request(app)
        .get('/api/meals/meal-1/alternatives')
        .expect(403);

      expect(response.body.error).toBe('Access denied');
    });

    it('should return empty array if no alternatives exist', async () => {
      mockMealFindUnique.mockResolvedValue(mockMeal);
      mockMealFindMany.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/meals/meal-1/alternatives')
        .expect(200);

      expect(response.body.alternatives).toHaveLength(0);
    });
  });

  describe('PATCH /api/meals/:id/swap', () => {
    const mockOriginalMeal = {
      id: 'meal-1',
      userId: 'test-user-id',
      name: 'Protein Pancakes',
      mealType: 'breakfast',
      dayOfWeek: 1,
    };

    const mockReplacementMeal = {
      id: 'meal-2',
      userId: 'test-user-id',
      name: 'Oatmeal with Protein',
      mealType: 'breakfast',
      dayOfWeek: 2,
    };

    it('should swap two meals successfully', async () => {
      mockMealFindUnique
        .mockResolvedValueOnce(mockOriginalMeal)
        .mockResolvedValueOnce(mockReplacementMeal)
        .mockResolvedValueOnce({ ...mockOriginalMeal, dayOfWeek: 2 })
        .mockResolvedValueOnce({ ...mockReplacementMeal, dayOfWeek: 1 });

      mockTransaction.mockResolvedValue([]);

      const response = await request(app)
        .patch('/api/meals/meal-1/swap')
        .send({ replacementMealId: 'meal-2' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Meals swapped successfully');
      expect(response.body.swappedMeals.original.newDayOfWeek).toBe(2);
      expect(response.body.swappedMeals.replacement.newDayOfWeek).toBe(1);
    });

    it('should return 400 if replacementMealId is missing', async () => {
      const response = await request(app)
        .patch('/api/meals/meal-1/swap')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('replacementMealId is required');
    });

    it('should return 404 if original meal not found', async () => {
      mockMealFindUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockReplacementMeal);

      const response = await request(app)
        .patch('/api/meals/invalid-id/swap')
        .send({ replacementMealId: 'meal-2' })
        .expect(404);

      expect(response.body.error).toBe('One or both meals not found');
    });

    it('should return 404 if replacement meal not found', async () => {
      mockMealFindUnique
        .mockResolvedValueOnce(mockOriginalMeal)
        .mockResolvedValueOnce(null);

      const response = await request(app)
        .patch('/api/meals/meal-1/swap')
        .send({ replacementMealId: 'invalid-id' })
        .expect(404);

      expect(response.body.error).toBe('One or both meals not found');
    });

    it('should return 403 if meals belong to different users', async () => {
      mockMealFindUnique
        .mockResolvedValueOnce(mockOriginalMeal)
        .mockResolvedValueOnce({ ...mockReplacementMeal, userId: 'different-user' });

      const response = await request(app)
        .patch('/api/meals/meal-1/swap')
        .send({ replacementMealId: 'meal-2' })
        .expect(403);

      expect(response.body.error).toBe('Access denied');
    });

    it('should return 400 if meals have different types', async () => {
      mockMealFindUnique
        .mockResolvedValueOnce(mockOriginalMeal)
        .mockResolvedValueOnce({ ...mockReplacementMeal, mealType: 'lunch' });

      const response = await request(app)
        .patch('/api/meals/meal-1/swap')
        .send({ replacementMealId: 'meal-2' })
        .expect(400);

      expect(response.body.error).toBe('Cannot swap meals of different types');
    });
  });
});
