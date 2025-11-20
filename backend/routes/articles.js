const express = require('express');
const router = express.Router();
const { getOrCreateCollection } = require('../server');

const DB_NAME = process.env.MONGO_DB_NAME || 'aij';
const COLLECTION_NAME = process.env.MONGO_COLLECTION_NAME || 'articles';

// shape helper
function buildArticle(doc) {
  const now = new Date();
  return {
    author: {
      firstName: doc?.author?.firstName || '',
      lastName: doc?.author?.lastName || '',
      registrationTime: doc?.author?.registrationTime ? new Date(doc.author.registrationTime) : now,
    },
    article: {
      title: doc?.article?.title || '',
      description: doc?.article?.description || '',
      text: doc?.article?.text || '',
      tags: Array.isArray(doc?.article?.tags) ? doc.article.tags : [],
      addedTime: doc?.article?.addedTime ? new Date(doc.article.addedTime) : now,
      changedTime: doc?.article?.changedTime ? new Date(doc.article.changedTime) : now,
      viewsCount: Number.isFinite(doc?.article?.viewsCount) ? doc.article.viewsCount : 0,
      clickCount: Number.isFinite(doc?.article?.clickCount) ? doc.article.clickCount : 0,
    }
  };
}

// GET all
router.get('/', async (req, res) => {
  try {
    const col = await getOrCreateCollection(DB_NAME, COLLECTION_NAME);
    const items = await col.find({}).toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'unknown error' });
  }
});

// GET by id (only match valid Mongo ObjectId-like strings to avoid catching '/latest')
router.get('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const col = await getOrCreateCollection(DB_NAME, COLLECTION_NAME);
    const item = await col.findOne({ _id: new ObjectId(req.params.id) });
    if (!item) return res.status(404).json({ error: 'not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err?.message || 'bad request' });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const col = await getOrCreateCollection(DB_NAME, COLLECTION_NAME);
    const toInsert = buildArticle(req.body);
    const result = await col.insertOne(toInsert);
    res.status(201).json({ _id: result.insertedId, ...toInsert });
  } catch (err) {
    res.status(400).json({ error: err?.message || 'bad request' });
  }
});

// PUT update (replace fields)
router.put('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const col = await getOrCreateCollection(DB_NAME, COLLECTION_NAME);
    const updated = buildArticle(req.body);
    updated.article.changedTime = new Date();
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updated },
      { returnDocument: 'after' }
    );
    if (!result.value) return res.status(404).json({ error: 'not found' });
    res.json(result.value);
  } catch (err) {
    res.status(400).json({ error: err?.message || 'bad request' });
  }
});

// PATCH partial update counts/fields
router.patch('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const col = await getOrCreateCollection(DB_NAME, COLLECTION_NAME);
    const $set = {};
    const $inc = {};
    if (req.body?.article?.title !== undefined) $set['article.title'] = String(req.body.article.title);
    if (req.body?.article?.description !== undefined) $set['article.description'] = String(req.body.article.description);
    if (req.body?.article?.text !== undefined) $set['article.text'] = String(req.body.article.text);
    if (Array.isArray(req.body?.article?.tags)) $set['article.tags'] = req.body.article.tags;
    if (Number.isFinite(req.body?.article?.viewsCount)) $set['article.viewsCount'] = req.body.article.viewsCount;
    if (Number.isFinite(req.body?.article?.clickCount)) $set['article.clickCount'] = req.body.article.clickCount;
    if (Number.isFinite(req.body?.incViewsBy)) $inc['article.viewsCount'] = Number(req.body.incViewsBy);
    if (Number.isFinite(req.body?.incClicksBy)) $inc['article.clickCount'] = Number(req.body.incClicksBy);
    $set['article.changedTime'] = new Date();
    const update = {};
    if (Object.keys($set).length) update.$set = $set;
    if (Object.keys($inc).length) update.$inc = $inc;
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      update,
      { returnDocument: 'after' }
    );
    if (!result.value) return res.status(404).json({ error: 'not found' });
    res.json(result.value);
  } catch (err) {
    res.status(400).json({ error: err?.message || 'bad request' });
  }
});

// DELETE by id
router.delete('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const col = await getOrCreateCollection(DB_NAME, COLLECTION_NAME);
    const result = await col.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'not found' });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err?.message || 'bad request' });
  }
});

module.exports = router;


