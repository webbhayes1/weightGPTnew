/**
 * Workout Plan Generation Tests
 * Tests for POST /api/workout-plans/generate endpoint
 */

import request from 'supertest';
import express from 'express';
import workoutPlanRouter from '../../src/routes/workoutPlan.routes';

// Mock Prisma
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
  },
  workoutPlan: {
    findFirst: jest.fn(),
    create: jest.fn(),
    upsert: jest.fn(),
  },
  workout: {
    createMany: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn(),
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}));

// Mock OpenAI workout generation
jest.mock('../../src/services/openai/workoutGeneration.service', () => ({
  generateWeeklyWorkoutPlan: jest.fn(),
}));

import { generateWeeklyWorkoutPlan } from '../../src/services/openai/workoutGeneration.service';

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

describe('Workout Plan Generation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/workout-plans/generate', () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      weightGoal: 'lose_weight',
      activityLevel: 'moderately_active',
      fitnessLevel: 'intermediate',
      daysPerWeek: 4,
      workoutDurationPreference: 45,
      availableEquipment: ['dumbbells', 'resistance bands'],
    };

    const mockGeneratedWorkouts = [
      {
        name: 'Upper Body Strength',
        type: 'strength' as const,
        workoutCategory: 'Upper Body',
        dayOfWeek: 1,
        durationMin: 45,
        estimatedCalories: 300,
        exercises: [
          {
            name: 'Bench Press',
            sets: 4,
            reps: '8-10',
            equipment: ['barbell', 'bench'],
            notes: 'Focus on form',
          },
          {
            name: 'Rows',
            sets: 3,
            reps: '10-12',
            equipment: ['dumbbells'],
            notes: 'Pull to hip',
          },
        ],
      },
      {
        name: 'Lower Body Power',
        type: 'strength' as const,
        workoutCategory: 'Lower Body',
        dayOfWeek: 3,
        durationMin: 50,
        estimatedCalories: 350,
        exercises: [
          {
            name: 'Squats',
            sets: 4,
            reps: '8-10',
            equipment: ['barbell', 'squat rack'],
            notes: 'Deep depth',
          },
        ],
      },
      {
        name: 'HIIT Cardio',
        type: 'cardio' as const,
        workoutCategory: 'HIIT',
        dayOfWeek: 5,
        durationMin: 30,
        estimatedCalories: 280,
        exercises: [
          {
            name: 'Burpees',
            sets: 5,
            reps: '30 sec on / 30 sec off',
            equipment: [],
            notes: 'Max effort',
          },
        ],
      },
    ];

    const mockCreatedPlan = {
      id: 'plan-1',
      userId: 'test-user-id',
      weekStartDate: new Date('2025-11-24'),
      weekEndDate: new Date('2025-11-30'),
      status: 'active',
      workoutCount: 3,
    };

    it('should generate a new workout plan successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (generateWeeklyWorkoutPlan as jest.Mock).mockResolvedValue({
        workouts: mockGeneratedWorkouts,
      });
      mockPrisma.workoutPlan.findFirst.mockResolvedValue(null);
      mockPrisma.workoutPlan.create.mockResolvedValue(mockCreatedPlan);
      mockPrisma.workout.createMany.mockResolvedValue({ count: 3 });
      mockPrisma.workout.findMany.mockResolvedValue([
        {
          ...mockGeneratedWorkouts[0],
          id: 'workout-1',
          userId: 'test-user-id',
          workoutPlanId: 'plan-1',
        },
        {
          ...mockGeneratedWorkouts[1],
          id: 'workout-2',
          userId: 'test-user-id',
          workoutPlanId: 'plan-1',
        },
        {
          ...mockGeneratedWorkouts[2],
          id: 'workout-3',
          userId: 'test-user-id',
          workoutPlanId: 'plan-1',
        },
      ]);
      mockPrisma.$transaction.mockImplementation((callback) => callback(mockPrisma));

      const response = await request(app)
        .post('/api/workout-plans/generate')
        .send({ weekStartDate: '2025-11-24' })
        .expect(200);

      expect(response.body.id).toBe('plan-1');
      expect(response.body.workoutCount).toBe(3);
      expect(response.body.workouts).toHaveLength(3);
      expect(response.body.workouts[0].name).toBe('Upper Body Strength');
      expect(response.body.workouts[1].name).toBe('Lower Body Power');
      expect(response.body.workouts[2].name).toBe('HIIT Cardio');
    });

    it('should return 404 if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/workout-plans/generate')
        .send({ weekStartDate: '2025-11-24' })
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });

    it('should return 400 if user profile is incomplete', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        fitnessLevel: null,
        daysPerWeek: null,
      });

      const response = await request(app)
        .post('/api/workout-plans/generate')
        .send({ weekStartDate: '2025-11-24' })
        .expect(400);

      expect(response.body.error).toContain('Complete your profile');
    });

    it('should replace existing plan for the same week', async () => {
      const existingPlan = {
        id: 'existing-plan-1',
        userId: 'test-user-id',
        weekStartDate: new Date('2025-11-24'),
        weekEndDate: new Date('2025-11-30'),
        status: 'active',
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (generateWeeklyWorkoutPlan as jest.Mock).mockResolvedValue({
        workouts: mockGeneratedWorkouts,
      });
      mockPrisma.workoutPlan.findFirst.mockResolvedValue(existingPlan);
      mockPrisma.workout.deleteMany.mockResolvedValue({ count: 2 });
      mockPrisma.workoutPlan.upsert.mockResolvedValue({
        ...existingPlan,
        workoutCount: 3,
      });
      mockPrisma.workout.createMany.mockResolvedValue({ count: 3 });
      mockPrisma.workout.findMany.mockResolvedValue([
        {
          ...mockGeneratedWorkouts[0],
          id: 'workout-new-1',
          userId: 'test-user-id',
          workoutPlanId: 'existing-plan-1',
        },
      ]);
      mockPrisma.$transaction.mockImplementation((callback) => callback(mockPrisma));

      const response = await request(app)
        .post('/api/workout-plans/generate')
        .send({ weekStartDate: '2025-11-24' })
        .expect(200);

      expect(response.body.id).toBe('existing-plan-1');
      expect(mockPrisma.workout.deleteMany).toHaveBeenCalledWith({
        where: { workoutPlanId: 'existing-plan-1' },
      });
    });

    it('should handle OpenAI generation errors gracefully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (generateWeeklyWorkoutPlan as jest.Mock).mockRejectedValue(
        new Error('OpenAI API error: Rate limit exceeded')
      );

      const response = await request(app)
        .post('/api/workout-plans/generate')
        .send({ weekStartDate: '2025-11-24' })
        .expect(500);

      expect(response.body.error).toContain('Failed to generate workout plan');
    });

    it('should use current week if no weekStartDate provided', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (generateWeeklyWorkoutPlan as jest.Mock).mockResolvedValue({
        workouts: mockGeneratedWorkouts,
      });
      mockPrisma.workoutPlan.findFirst.mockResolvedValue(null);
      mockPrisma.workoutPlan.create.mockResolvedValue(mockCreatedPlan);
      mockPrisma.workout.createMany.mockResolvedValue({ count: 3 });
      mockPrisma.workout.findMany.mockResolvedValue([]);
      mockPrisma.$transaction.mockImplementation((callback) => callback(mockPrisma));

      const response = await request(app)
        .post('/api/workout-plans/generate')
        .send({})
        .expect(200);

      expect(response.body.workoutCount).toBe(3);
    });

    it('should respect user workout preferences', async () => {
      const userWithPrefs = {
        ...mockUser,
        daysPerWeek: 5,
        workoutDurationPreference: 30,
        availableEquipment: ['bodyweight'],
      };

      mockPrisma.user.findUnique.mockResolvedValue(userWithPrefs);
      (generateWeeklyWorkoutPlan as jest.Mock).mockResolvedValue({
        workouts: mockGeneratedWorkouts,
      });
      mockPrisma.workoutPlan.findFirst.mockResolvedValue(null);
      mockPrisma.workoutPlan.create.mockResolvedValue(mockCreatedPlan);
      mockPrisma.workout.createMany.mockResolvedValue({ count: 3 });
      mockPrisma.workout.findMany.mockResolvedValue([]);
      mockPrisma.$transaction.mockImplementation((callback) => callback(mockPrisma));

      await request(app)
        .post('/api/workout-plans/generate')
        .send({ weekStartDate: '2025-11-24' })
        .expect(200);

      expect(generateWeeklyWorkoutPlan).toHaveBeenCalledWith(
        expect.objectContaining({
          daysPerWeek: 5,
          preferredDuration: 30,
          availableEquipment: ['bodyweight'],
        })
      );
    });

    it('should include exercises in generated workouts', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (generateWeeklyWorkoutPlan as jest.Mock).mockResolvedValue({
        workouts: mockGeneratedWorkouts,
      });
      mockPrisma.workoutPlan.findFirst.mockResolvedValue(null);
      mockPrisma.workoutPlan.create.mockResolvedValue(mockCreatedPlan);
      mockPrisma.workout.createMany.mockResolvedValue({ count: 3 });
      mockPrisma.workout.findMany.mockResolvedValue([
        {
          ...mockGeneratedWorkouts[0],
          id: 'workout-1',
          userId: 'test-user-id',
          workoutPlanId: 'plan-1',
        },
      ]);
      mockPrisma.$transaction.mockImplementation((callback) => callback(mockPrisma));

      const response = await request(app)
        .post('/api/workout-plans/generate')
        .send({ weekStartDate: '2025-11-24' })
        .expect(200);

      const workout = response.body.workouts[0];
      expect(workout.exercises).toBeDefined();
      expect(workout.exercises.length).toBeGreaterThan(0);
      expect(workout.exercises[0]).toHaveProperty('name');
      expect(workout.exercises[0]).toHaveProperty('sets');
      expect(workout.exercises[0]).toHaveProperty('reps');
      expect(workout.exercises[0]).toHaveProperty('equipment');
    });

    it('should generate workouts matching user fitness level', async () => {
      const advancedUser = {
        ...mockUser,
        fitnessLevel: 'advanced',
      };

      mockPrisma.user.findUnique.mockResolvedValue(advancedUser);
      (generateWeeklyWorkoutPlan as jest.Mock).mockResolvedValue({
        workouts: mockGeneratedWorkouts,
      });
      mockPrisma.workoutPlan.findFirst.mockResolvedValue(null);
      mockPrisma.workoutPlan.create.mockResolvedValue(mockCreatedPlan);
      mockPrisma.workout.createMany.mockResolvedValue({ count: 3 });
      mockPrisma.workout.findMany.mockResolvedValue([]);
      mockPrisma.$transaction.mockImplementation((callback) => callback(mockPrisma));

      await request(app)
        .post('/api/workout-plans/generate')
        .send({ weekStartDate: '2025-11-24' })
        .expect(200);

      expect(generateWeeklyWorkoutPlan).toHaveBeenCalledWith(
        expect.objectContaining({
          fitnessLevel: 'advanced',
        })
      );
    });

    it('should generate workouts matching user goal', async () => {
      const gainWeightUser = {
        ...mockUser,
        weightGoal: 'gain_weight',
      };

      mockPrisma.user.findUnique.mockResolvedValue(gainWeightUser);
      (generateWeeklyWorkoutPlan as jest.Mock).mockResolvedValue({
        workouts: mockGeneratedWorkouts,
      });
      mockPrisma.workoutPlan.findFirst.mockResolvedValue(null);
      mockPrisma.workoutPlan.create.mockResolvedValue(mockCreatedPlan);
      mockPrisma.workout.createMany.mockResolvedValue({ count: 3 });
      mockPrisma.workout.findMany.mockResolvedValue([]);
      mockPrisma.$transaction.mockImplementation((callback) => callback(mockPrisma));

      await request(app)
        .post('/api/workout-plans/generate')
        .send({ weekStartDate: '2025-11-24' })
        .expect(200);

      expect(generateWeeklyWorkoutPlan).toHaveBeenCalledWith(
        expect.objectContaining({
          goal: 'gain_weight',
        })
      );
    });
  });
});
