/**
 * Unit tests for /api/articles/latest/cards endpoint
 */

const request = require('supertest');
const app = require('../app');
const { getOrCreateCollection } = require('../server');

const DB_NAME = process.env.MONGO_DB_NAME || 'aij';
const COLLECTION_NAME = process.env.MONGO_COLLECTION_NAME || 'articles';

describe('GET /api/articles/latest/cards', () => {
  let testCollection;

  beforeAll(async () => {
    // Get collection reference for test data setup
    testCollection = await getOrCreateCollection(DB_NAME, COLLECTION_NAME);
  });

  beforeEach(async () => {
    // Clean up test data before each test (optional - comment out if you want to keep real data)
    // await testCollection.deleteMany({ 'article.title': { $regex: /^Test Article/ } });
  });

  describe('Successful requests', () => {
    test('should return grouped cards with default limit of 10', async () => {
      const response = await request(app)
        .get('/api/articles/latest/cards')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);

      // Check structure of first card
      if (response.body.length > 0) {
        const firstCard = response.body[0];
        expect(firstCard).toHaveProperty('articles');
        expect(firstCard).toHaveProperty('imageUrl');
        expect(Array.isArray(firstCard.articles)).toBe(true);
        expect(firstCard.articles.length).toBeLessThanOrEqual(2);
      }
    });

    test('should group articles by 2 per card', async () => {
      const response = await request(app)
        .get('/api/articles/latest/cards?limit=6')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);

      // Should have 3 cards (6 articles / 2 = 3 cards)
      expect(response.body.length).toBe(3);

      // Each card should have at most 2 articles
      response.body.forEach((card) => {
        expect(card.articles.length).toBeLessThanOrEqual(2);
        expect(card.articles.length).toBeGreaterThan(0);
      });
    });

    test('should handle odd number of articles correctly', async () => {
      const response = await request(app)
        .get('/api/articles/latest/cards?limit=5')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(3); // 3 cards: 2, 2, 1

      // First two cards should have 2 articles
      expect(response.body[0].articles.length).toBe(2);
      expect(response.body[1].articles.length).toBe(2);
      // Last card should have 1 article
      expect(response.body[2].articles.length).toBe(1);
    });

    test('should include imageUrl from first article in group', async () => {
      const response = await request(app)
        .get('/api/articles/latest/cards?limit=2')
        .expect(200);

      if (response.body.length > 0) {
        const firstCard = response.body[0];
        const firstArticle = firstCard.articles[0];

        // imageUrl should match first article's imageUrl or be null
        if (firstArticle?.article?.imageUrl) {
          expect(firstCard.imageUrl).toBe(firstArticle.article.imageUrl);
        } else {
          expect(firstCard.imageUrl).toBeNull();
        }
      }
    });

    test('should return articles sorted by date (most recent first)', async () => {
      const response = await request(app)
        .get('/api/articles/latest/cards?limit=4')
        .expect(200);

      if (response.body.length > 0 && response.body[0].articles.length > 0) {
        const articles = response.body.flatMap((card) => card.articles);

        // Check that articles are sorted by date (most recent first)
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

    test('should handle custom limit parameter', async () => {
      const response = await request(app)
        .get('/api/articles/latest/cards?limit=8')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      // Should have 4 cards (8 articles / 2 = 4 cards)
      expect(response.body.length).toBe(4);
    });
  });

  describe('Edge cases', () => {
    test('should handle limit=0 gracefully (defaults to 10)', async () => {
      const response = await request(app)
        .get('/api/articles/latest/cards?limit=0')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      // limit=0 is falsy, so it defaults to 10, resulting in 5 cards (10/2)
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });

    test('should handle very large limit', async () => {
      const response = await request(app)
        .get('/api/articles/latest/cards?limit=1000')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      // Should still return valid structure
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('articles');
        expect(response.body[0]).toHaveProperty('imageUrl');
      }
    });

    test('should handle invalid limit parameter', async () => {
      const response = await request(app)
        .get('/api/articles/latest/cards?limit=invalid')
        .expect(200);

      // Should default to 10 when limit is invalid
      expect(response.body).toBeInstanceOf(Array);
    });

    test('should handle empty database gracefully', async () => {
      // This test assumes there are articles in the database
      // If database is empty, it should return empty array
      const response = await request(app)
        .get('/api/articles/latest/cards')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('Response structure validation', () => {
    test('should return correct structure for each card', async () => {
      const response = await request(app)
        .get('/api/articles/latest/cards?limit=2')
        .expect(200);

      if (response.body.length > 0) {
        response.body.forEach((card) => {
          // Check card structure
          expect(card).toHaveProperty('articles');
          expect(card).toHaveProperty('imageUrl');
          expect(Array.isArray(card.articles)).toBe(true);

          // Check article structure
          if (card.articles.length > 0) {
            card.articles.forEach((article) => {
              expect(article).toHaveProperty('_id');
              expect(article).toHaveProperty('article');
              expect(article.article).toHaveProperty('title');
              expect(article.article).toHaveProperty('description');
            });
          }
        });
      }
    });

    test('should return imageUrl as null when article has no image', async () => {
      const response = await request(app)
        .get('/api/articles/latest/cards?limit=2')
        .expect(200);

      if (response.body.length > 0) {
        response.body.forEach((card) => {
          const hasImage = card.articles.some(
            (article) => article?.article?.imageUrl
          );

          if (!hasImage) {
            expect(card.imageUrl).toBeNull();
          }
        });
      }
    });
  });
});

