'use strict';

import { MongoClient as mongo } from 'mongodb';

export default async function (app) {
  const db = app.context.db = await mongo.connect(process.env.MONGO_URL, {bufferMaxEntries: 0});
  await db.collection('aliases').createIndex({alias: 1, url: 1}, {unique: true});
}
