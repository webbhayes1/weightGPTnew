/**
 * Jest Test Setup
 * Runs before all tests to set up environment
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '7d';
process.env.PORT = '3001'; // Use different port for tests
