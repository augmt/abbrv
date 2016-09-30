'use strict';

import Koa from 'koa';
import router from './routes.js';
import dbPromise from './db.js';

const app = new Koa();

app.name = 'url-shortener-microservice';

dbPromise(app)
  .catch((err) => app.emit('error', err))
  .then(() => app.use(router.routes()));

export default app;
