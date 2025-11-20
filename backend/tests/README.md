# Backend Tests

This directory contains unit tests for the backend API.

## Test Structure

- `articles-cards.test.js` - Unit tests for the `/api/articles/latest/cards` endpoint
- `setup.js` - Jest configuration and test setup

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

The tests cover:
- ✅ Successful API requests with various limits
- ✅ Article grouping (2 articles per card)
- ✅ Edge cases (empty database, invalid parameters, etc.)
- ✅ Response structure validation
- ✅ Date sorting verification
- ✅ Image URL handling

## Test Environment

Tests use the same database connection as the main application. Make sure your `.env` file is configured with the correct `MONGO_URI`.

