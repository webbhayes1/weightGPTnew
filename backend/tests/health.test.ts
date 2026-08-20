/**
 * Health Endpoint Tests
 * Tests for the /health endpoint
 */

import request from 'supertest';
import app from '../src/index';

describe('GET /health', () => {
  it('should return 200 OK with health status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('database', 'connected');
    expect(response.body).toHaveProperty('version', '1.0.0');
    expect(response.body).toHaveProperty('environment');
  });

  it('should have a valid timestamp', async () => {
    const response = await request(app).get('/health');

    expect(typeof response.body.timestamp).toBe('number');
    expect(response.body.timestamp).toBeGreaterThan(0);

    // Timestamp should be recent (within last 10 seconds)
    const now = Date.now();
    const diff = now - response.body.timestamp;
    expect(diff).toBeLessThan(10000);
  });

  it('should confirm database is connected', async () => {
    const response = await request(app).get('/health');

    expect(response.body.database).toBe('connected');
  });
});
