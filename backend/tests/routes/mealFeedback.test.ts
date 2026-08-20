/**
 * Meal Feedback Endpoint Tests
 * Tests for POST /api/meals/:id/feedback
 */

import request from 'supertest';
import express from 'express';

// Mock Prisma - must be before imports that use it
const mockMealFindUnique = jest.fn();
const mockMealUpdate = jest.fn();
const mockIngredientFindMany = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    meal: {
      findUnique: mockMealFindUnique,
      update: mockMealUpdate,
    },
    ingredient: {
      findMany: mockIngredientFindMany,
    },
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

describe('Meal Feedback Endpoint', () => {
  beforeEach(() => {
    mockMealFindUnique.mockReset();
    mockMealUpdate.mockReset();
    mockIngredientFindMany.mockReset();
  });

  describe('POST /api/meals/:id/feedback', () => {
    const mockMeal = {
      id: 'meal-1',
      userId: 'test-user-id',
      name: 'Protein Pancakes',
      mealType: 'breakfast',
      calories: 380,
      macros: { protein: 32, carbs: 45, fat: 12 },
      isFavorite: false,
      isDisliked: false,
      feedbackText: null,
      feedbackAt: null,
    };

    const mockUpdatedMealThumbsUp = {
      ...mockMeal,
      isFavorite: true,
      isDisliked: false,
      feedbackText: 'Great taste and easy to make',
      feedbackAt: new Date('2025-11-18T10:00:00Z'),
    };

    const mockUpdatedMealThumbsDown = {
      ...mockMeal,
      isFavorite: false,
      isDisliked: true,
      feedbackText: 'Too bland\nDisliked ingredients: Oats, Banana',
      feedbackAt: new Date('2025-11-18T10:00:00Z'),
    };

    it('should submit thumbs up feedback successfully', async () => {
      mockMealFindUnique.mockResolvedValue(mockMeal);
      mockMealUpdate.mockResolvedValue(mockUpdatedMealThumbsUp);

      const response = await request(app)
        .post('/api/meals/meal-1/feedback')
        .send({
          rating: 1,
          comment: 'Great taste and easy to make',
        })
        .expect(200);

      expect(response.body.id).toBe('meal-1');
      expect(response.body.isFavorite).toBe(true);
      expect(response.body.isDisliked).toBe(false);
      expect(response.body.feedbackText).toBe('Great taste and easy to make');
      expect(response.body.feedbackAt).toBeDefined();
    });

    it('should submit thumbs down feedback with disliked ingredients', async () => {
      mockMealFindUnique.mockResolvedValue(mockMeal);
      mockIngredientFindMany.mockResolvedValue([
        { name: 'Oats' },
        { name: 'Banana' },
      ]);
      mockMealUpdate.mockResolvedValue(mockUpdatedMealThumbsDown);

      const response = await request(app)
        .post('/api/meals/meal-1/feedback')
        .send({
          rating: -1,
          comment: 'Too bland',
          dislikedIngredients: ['ing-1', 'ing-2'],
        })
        .expect(200);

      expect(response.body.id).toBe('meal-1');
      expect(response.body.isFavorite).toBe(false);
      expect(response.body.isDisliked).toBe(true);
      expect(response.body.feedbackText).toContain('Too bland');
      expect(response.body.feedbackText).toContain('Disliked ingredients: Oats, Banana');
    });

    it('should submit thumbs up feedback without comment', async () => {
      const updatedMeal = {
        ...mockMeal,
        isFavorite: true,
        feedbackText: null,
        feedbackAt: new Date(),
      };
      mockMealFindUnique.mockResolvedValue(mockMeal);
      mockMealUpdate.mockResolvedValue(updatedMeal);

      const response = await request(app)
        .post('/api/meals/meal-1/feedback')
        .send({ rating: 1 })
        .expect(200);

      expect(response.body.isFavorite).toBe(true);
      expect(response.body.isDisliked).toBe(false);
    });

    it('should return 400 if rating is invalid', async () => {
      const response = await request(app)
        .post('/api/meals/meal-1/feedback')
        .send({ rating: 0 })
        .expect(400);

      expect(response.body.error).toBe('Rating must be 1 (thumbs up) or -1 (thumbs down)');
    });

    it('should return 400 if rating is missing', async () => {
      const response = await request(app)
        .post('/api/meals/meal-1/feedback')
        .send({ comment: 'Great meal' })
        .expect(400);

      expect(response.body.error).toBe('Rating must be 1 (thumbs up) or -1 (thumbs down)');
    });

    it('should return 404 if meal not found', async () => {
      mockMealFindUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/meals/invalid-id/feedback')
        .send({ rating: 1 })
        .expect(404);

      expect(response.body.error).toBe('Meal not found');
    });

    it('should return 403 if meal belongs to different user', async () => {
      mockMealFindUnique.mockResolvedValue({
        ...mockMeal,
        userId: 'different-user',
      });

      const response = await request(app)
        .post('/api/meals/meal-1/feedback')
        .send({ rating: 1 })
        .expect(403);

      expect(response.body.error).toBe('Access denied');
    });

    it('should handle thumbs down with only disliked ingredients (no comment)', async () => {
      const updatedMeal = {
        ...mockMeal,
        isDisliked: true,
        feedbackText: 'Disliked ingredients: Oats',
        feedbackAt: new Date(),
      };
      mockMealFindUnique.mockResolvedValue(mockMeal);
      mockIngredientFindMany.mockResolvedValue([{ name: 'Oats' }]);
      mockMealUpdate.mockResolvedValue(updatedMeal);

      const response = await request(app)
        .post('/api/meals/meal-1/feedback')
        .send({
          rating: -1,
          dislikedIngredients: ['ing-1'],
        })
        .expect(200);

      expect(response.body.isDisliked).toBe(true);
      expect(response.body.feedbackText).toBe('Disliked ingredients: Oats');
    });

    it('should handle server errors gracefully', async () => {
      mockMealFindUnique.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/meals/meal-1/feedback')
        .send({ rating: 1 })
        .expect(500);

      expect(response.body.error).toBe('Failed to submit feedback');
    });
  });
});
