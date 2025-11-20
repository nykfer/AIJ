/**
 * Test setup file for Jest
 * This file runs before all tests
 */

// Set test environment variables if not already set
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'aij';
process.env.MONGO_COLLECTION_NAME = process.env.MONGO_COLLECTION_NAME || 'articles';

// Increase timeout for database operations
jest.setTimeout(30000);

