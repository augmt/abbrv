'use strict';

const Koa = require('koa');

const cors = require('kcors');
const json = require('koa-json');
const router = require('./routes');

const dbPromise = require('./db.js');

const app = module.exports = new Koa();

dbPromise(app).catch(err => app.emit('error', err)).then(() => {
  app.use(cors());
  app.use(json());
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      app.emit('error', err);
      ctx.body = err.message;
      ctx.status = err.status || 500;
    }
  });
  app.use(router.routes());
});
