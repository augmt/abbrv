'use strict';

const mongo = require('mongodb').MongoClient;

module.exports = async function (app) {
  const db = app.context.db = await mongo.connect(process.env.MONGO_URL);
  await db.collection('aliases').createIndex({alias: 1, url: 1}, {unique: true});
};
