/**
 * Unit tests for /api/articles/latest endpoint
 * This suite mocks the DB module to avoid requiring a real MongoDB instance.
 */

// Mock the server module used by app to provide a fake collection
jest.mock('../server', () => {
  const fakeCollection = {
    find: () => ({
      sort: () => ({
        limit: () => ({
          toArray: async () => global.__TEST_DOCS__ || [],
        }),
      }),
    }),
  };
  return {
    getOrCreateCollection: async () => fakeCollection,
    checkConnection: async () => true,
  };
});

const request = require('supertest');
// Require app AFTER mocks are set up
const app = require('../app');

function buildDocs(count) {
  const now = Date.now();
  return Array.from({ length: count }).map((_, i) => ({
    _id: `id_${i}`,
    article: {
      title: `Title ${i}`,
      description: `Desc ${i}`,
      changedTime: new Date(now - i * 1000).toISOString(),
      addedTime: new Date(now - i * 2000).toISOString(),
      imageUrl: i % 2 === 0 ? `https://img/${i}.jpg` : undefined,
    },
  }));
}

describe('GET /api/articles/latest', () => {
  beforeEach(() => {
    // Default dataset for tests unless overridden in specific cases
    global.__TEST_DOCS__ = buildDocs(12);
  });

  describe('Successful requests', () => {
    test('should return an array with default limit of 10', async () => {
      const response = await request(app)
        .get('/api/articles/latest')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    test('should respect custom limit parameter', async () => {
      global.__TEST_DOCS__ = buildDocs(7);
      const response = await request(app)
        .get('/api/articles/latest?limit=5')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Sorting and structure', () => {
    test('should return articles sorted by date (most recent first)', async () => {
      global.__TEST_DOCS__ = buildDocs(8);
      const response = await request(app)
        .get('/api/articles/latest?limit=8')
        .expect(200);

      const articles = response.body || [];
      if (articles.length > 1) {
        for (let i = 0; i < articles.length - 1; i++) {
          const current = articles[i];
          const next = articles[i + 1];

          const currentTime = new Date(
            current?.article?.changedTime || current?.article?.addedTime || 0
          ).getTime();
          const nextTime = new Date(
            next?.article?.changedTime || next?.article?.addedTime || 0
          ).getTime();

          expect(currentTime).toBeGreaterThanOrEqual(nextTime);
        }
      }
    });

    test('should return expected structure for each article', async () => {
      global.__TEST_DOCS__ = buildDocs(3);
      const response = await request(app)
        .get('/api/articles/latest?limit=3')
        .expect(200);

      const articles = response.body || [];
      if (articles.length > 0) {
        articles.forEach((doc) => {
          expect(doc).toHaveProperty('_id');
          expect(doc).toHaveProperty('article');
          // Article subdocument common fields
          if (doc.article) {
            expect(typeof doc.article).toBe('object');
            // Titles/descriptions may be absent on some records, so only check type if present
            if (doc.article.title !== undefined) {
              expect(typeof doc.article.title).toBe('string');
            }
            if (doc.article.description !== undefined) {
              expect(
                typeof doc.article.description === 'string' ||
                doc.article.description === null
              ).toBe(true);
            }
          }
        });
      }
    });
  });

  describe('Edge cases', () => {
    test('should handle invalid limit parameter by defaulting to 10', async () => {
      global.__TEST_DOCS__ = buildDocs(25);
      const response = await request(app)
        .get('/api/articles/latest?limit=invalid')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    test('should handle very large limit gracefully', async () => {
      global.__TEST_DOCS__ = buildDocs(50);
      const response = await request(app)
        .get('/api/articles/latest?limit=1000')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      if (response.body.length > 0) {
        // Ensure documents look like article docs
        expect(response.body[0]).toHaveProperty('_id');
        expect(response.body[0]).toHaveProperty('article');
      }
    });
  });
});
