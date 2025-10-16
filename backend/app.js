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
app.use('/api/articles', require('./routes/articles'));

// Server-rendered article page
const DB_NAME = process.env.MONGO_DB_NAME || 'aij';
const COLLECTION_NAME = process.env.MONGO_COLLECTION_NAME || 'articles';

// Latest article redirect
app.get('/articles/latest', async (req, res) => {
  try {
    const col = await getOrCreateCollection(DB_NAME, COLLECTION_NAME);
    const latest = await col.find({}).sort({ 'article.changedTime': -1, 'article.addedTime': -1 }).limit(1).toArray();
    if (!latest.length) return res.status(404).send('No articles');
    return res.redirect(`/articles/${latest[0]._id.toString()}`);
  } catch (err) {
    return res.status(500).send(err?.message || 'Server error');
  }
});

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


