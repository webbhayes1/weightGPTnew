/**
 * Workout Swap Endpoint Tests
 * Tests for GET /api/workout-plans/workouts/:id/alternatives and PATCH /api/workout-plans/workouts/:id/swap
 */

import request from 'supertest';
import express from 'express';
import workoutPlanRouter from '../../src/routes/workoutPlan.routes';

// Mock Prisma
const mockPrisma = {
  workout: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn(),
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}));

// Mock Firebase auth middleware
jest.mock('../../src/middleware/auth.middleware', () => ({
  verifyFirebaseToken: (req: any, res: any, next: any) => {
    req.user = { userId: 'test-user-id' };
    next();
  },
}));

const app = express();
app.use(express.json());
app.use('/api/workout-plans', workoutPlanRouter);

describe('Workout Swap Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/workout-plans/workouts/:id/alternatives', () => {
    const mockWorkout = {
      id: 'workout-1',
      userId: 'test-user-id',
      name: 'Upper Body Strength',
      type: 'strength',
      workoutCategory: 'upper_body',
      durationMin: 45,
      estimatedCalories: 280,
    };

    const mockAlternatives = [
      {
        id: 'workout-2',
        userId: 'test-user-id',
        name: 'Lower Body Power',
        type: 'strength',
        workoutCategory: 'lower_body',
        dayOfWeek: 3,
        durationMin: 50,
        estimatedCalories: 320,
        isFavorite: false,
        isDisliked: false,
      },
      {
        id: 'workout-3',
        userId: 'test-user-id',
        name: 'HIIT Cardio',
        type: 'cardio',
        workoutCategory: 'hiit',
        dayOfWeek: 4,
        durationMin: 30,
        estimatedCalories: 220,
        isFavorite: true,
        isDisliked: false,
      },
    ];

    it('should return alternatives for a workout', async () => {
      mockPrisma.workout.findUnique.mockResolvedValue(mockWorkout);
      mockPrisma.workout.findMany.mockResolvedValue(mockAlternatives);

      const response = await request(app)
        .get('/api/workout-plans/workouts/workout-1/alternatives')
        .expect(200);

      expect(response.body.originalWorkout).toEqual({
        id: 'workout-1',
        name: 'Upper Body Strength',
        type: 'strength',
        workoutCategory: 'upper_body',
        durationMinutes: 45,
        estimatedCalories: 280,
      });
      expect(response.body.alternatives).toHaveLength(2);
      expect(response.body.alternatives[0].name).toBe('Lower Body Power');
    });

    it('should return 404 if workout not found', async () => {
      mockPrisma.workout.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/workout-plans/workouts/invalid-id/alternatives')
        .expect(404);

      expect(response.body.error).toBe('Workout not found');
    });

    it('should return 403 if workout belongs to different user', async () => {
      mockPrisma.workout.findUnique.mockResolvedValue({
        ...mockWorkout,
        userId: 'different-user',
      });

      const response = await request(app)
        .get('/api/workout-plans/workouts/workout-1/alternatives')
        .expect(403);

      expect(response.body.error).toBe('Access denied');
    });

    it('should return empty array if no alternatives exist', async () => {
      mockPrisma.workout.findUnique.mockResolvedValue(mockWorkout);
      mockPrisma.workout.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/workout-plans/workouts/workout-1/alternatives')
        .expect(200);

      expect(response.body.alternatives).toHaveLength(0);
    });
  });

  describe('PATCH /api/workout-plans/workouts/:id/swap', () => {
    const mockOriginalWorkout = {
      id: 'workout-1',
      userId: 'test-user-id',
      name: 'Upper Body Strength',
      type: 'strength',
      dayOfWeek: 1,
    };

    const mockReplacementWorkout = {
      id: 'workout-2',
      userId: 'test-user-id',
      name: 'Lower Body Power',
      type: 'strength',
      dayOfWeek: 3,
    };

    it('should swap two workouts successfully', async () => {
      mockPrisma.workout.findUnique
        .mockResolvedValueOnce(mockOriginalWorkout)
        .mockResolvedValueOnce(mockReplacementWorkout)
        .mockResolvedValueOnce({ ...mockOriginalWorkout, dayOfWeek: 3 })
        .mockResolvedValueOnce({ ...mockReplacementWorkout, dayOfWeek: 1 });

      mockPrisma.$transaction.mockResolvedValue([]);

      const response = await request(app)
        .patch('/api/workout-plans/workouts/workout-1/swap')
        .send({ replacementWorkoutId: 'workout-2' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Workouts swapped successfully');
      expect(response.body.swappedWorkouts.original.newDayOfWeek).toBe(3);
      expect(response.body.swappedWorkouts.replacement.newDayOfWeek).toBe(1);
    });

    it('should return 400 if replacementWorkoutId is missing', async () => {
      const response = await request(app)
        .patch('/api/workout-plans/workouts/workout-1/swap')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('replacementWorkoutId is required');
    });

    it('should return 404 if original workout not found', async () => {
      mockPrisma.workout.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockReplacementWorkout);

      const response = await request(app)
        .patch('/api/workout-plans/workouts/invalid-id/swap')
        .send({ replacementWorkoutId: 'workout-2' })
        .expect(404);

      expect(response.body.error).toBe('One or both workouts not found');
    });

    it('should return 404 if replacement workout not found', async () => {
      mockPrisma.workout.findUnique
        .mockResolvedValueOnce(mockOriginalWorkout)
        .mockResolvedValueOnce(null);

      const response = await request(app)
        .patch('/api/workout-plans/workouts/workout-1/swap')
        .send({ replacementWorkoutId: 'invalid-id' })
        .expect(404);

      expect(response.body.error).toBe('One or both workouts not found');
    });

    it('should return 403 if workouts belong to different users', async () => {
      mockPrisma.workout.findUnique
        .mockResolvedValueOnce(mockOriginalWorkout)
        .mockResolvedValueOnce({ ...mockReplacementWorkout, userId: 'different-user' });

      const response = await request(app)
        .patch('/api/workout-plans/workouts/workout-1/swap')
        .send({ replacementWorkoutId: 'workout-2' })
        .expect(403);

      expect(response.body.error).toBe('Access denied');
    });

    it('should allow swapping workouts of different types', async () => {
      // Unlike meals, workouts can be swapped regardless of type
      mockPrisma.workout.findUnique
        .mockResolvedValueOnce(mockOriginalWorkout)
        .mockResolvedValueOnce({ ...mockReplacementWorkout, type: 'cardio' })
        .mockResolvedValueOnce({ ...mockOriginalWorkout, dayOfWeek: 3 })
        .mockResolvedValueOnce({ ...mockReplacementWorkout, dayOfWeek: 1 });

      mockPrisma.$transaction.mockResolvedValue([]);

      const response = await request(app)
        .patch('/api/workout-plans/workouts/workout-1/swap')
        .send({ replacementWorkoutId: 'workout-2' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
