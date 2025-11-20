const { getOrCreateCollection, client } = require('./server');
const DB_NAME = process.env.MONGO_DB_NAME || 'aij';
const COLLECTION_NAME = process.env.MONGO_COLLECTION_NAME || 'articles';

// This script inserts 10 sample author+article documents directly into MongoDB

function buildSampleArticle(index) {
  const now = new Date();
  return {
    author: {
      firstName: 'Test',
      lastName: `Author${index + 1}`,
      registrationTime: now,
    },
    article: {
      title: `Sample Article ${index + 1}`,
      description: `This is a sample description for article ${index + 1}.`,
      text: `This is the full text content of sample article ${index + 1}.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      tags: ['sample', 'seed', `tag-${(index % 3) + 1}`],
      addedTime: now,
      changedTime: now,
      viewsCount: 0,
      clickCount: 0,
    },
  };
}

async function main() {
  console.log(`Inserting 10 articles into MongoDB collection "${COLLECTION_NAME}" (DB: "${DB_NAME}") ...`);
  try {
    const col = await getOrCreateCollection(DB_NAME, COLLECTION_NAME);
    const docs = [];
    for (let i = 10; i < 20; i++) {
      docs.push(buildSampleArticle(i));
    }
    const result = await col.insertMany(docs);
    const insertedCount = result.insertedCount ?? Object.keys(result.insertedIds || {}).length;
    console.log(`✔ Inserted ${insertedCount}/10 documents`);
    const ids = Object.values(result.insertedIds || {}).map((id) => String(id));
    if (ids.length) console.log(`IDs: ${ids.join(', ')}`);
  } catch (e) {
    console.error('Failed to insert sample articles:', e?.message || e);
    process.exitCode = 1;
  } finally {
    try { await client.close(); } catch {}
  }
}

main().catch((e) => {
  console.error('Unexpected error:', e);
  process.exitCode = 1;
});


