const express = require('express');
const cors = require('cors');
const path = require('path');
const { checkConnection, getOrCreateCollection } = require('./server');

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', async (req, res) => {
  try {
    await checkConnection();
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err?.message || 'unknown error' });
  }
});

// Routes
// app.use('/api/articles', require('./routes/articles'));

// Server-rendered article page
const DB_NAME = process.env.MONGO_DB_NAME || 'aij';
const COLLECTION_NAME = process.env.MONGO_COLLECTION_NAME || 'articles';

/**
 * Fetches latest articles from database using the same logic as /articles/latest
 * @param {number} limit - Maximum number of articles to fetch
 * @returns {Promise<Array>} Array of article documents
 */
async function fetchLatestArticles(limit = 10) {
  const col = await getOrCreateCollection(DB_NAME, COLLECTION_NAME);
  const latest = await col.find({}).sort({ 'article.changedTime': -1, 'article.addedTime': -1 }).limit(limit).toArray();
  return latest;
}



// API endpoint to get latest articles (JSON)
app.get('/api/articles/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const articles = await fetchLatestArticles(limit);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Server error' });
  }
});

// API endpoint to get latest articles grouped by 2 for cards
app.get('/api/articles/latest/cards', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const articles = await fetchLatestArticles(limit);
    
    // Group articles by 2 for cards
    const groupedCards = [];
    for (let i = 0; i < articles.length; i += 2) {
      const group = articles.slice(i, i + 2);
      groupedCards.push({
        articles: group,
        imageUrl: group[0]?.article?.imageUrl || null
      });
    }
    
    res.json(groupedCards);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Server error' });
  }
});

// Routes
app.use('/api/articles', require('./routes/articles'));


app.get('/articles/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const col = await getOrCreateCollection(DB_NAME, COLLECTION_NAME);
    const item = await col.findOne({ _id: new ObjectId(req.params.id) });
    if (!item) return res.status(404).send('Article not found');
    return res.render('article', {
      author: item.author || {},
      article: item.article || {},
    });
  } catch (err) {
    return res.status(400).send(err?.message || 'Bad request');
  }
});

module.exports = app;


