'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const monk = require('monk');
const normalizeUrl = require('./normalize-url.js');
const shortenUrl = require('./shorten-url.js');

const app = new Koa();
const router = new Router();
const db = app.context.db = monk(process.env.MONGO_URI);

const ALIAS_LENGTH = 3;

router.post('/new/(.+)', async ctx => {
  const {href: originalurl} = normalizeUrl(ctx.captures[0]);
  // if requests are being served through a reverse proxy on a non-root path,
  // the (non-standard) x-forwarded-prefix header must be set on the proxy and
  // it must contain the path that points to this microservice
  const forwardedPrefix = ctx.get('x-forwarded-prefix') || '/';
  const origin = ctx.origin + forwardedPrefix;
  const doc = await db.get('shorturls').findOne({originalurl});
  const shortUrl = shortenUrl(originalurl, origin, ALIAS_LENGTH)(doc);

  ctx.body = shortUrl.isValid ? {originalurl, shorturl: shortUrl.shorturl} : shortUrl;
  ctx.type = 'json';
  ctx.status = shortUrl.isValid ? 200 : 400;

  if (shortUrl.new) {
    await db.get('shorturls').insert(shortUrl);
  }
});

router.get(`/([\\w-]{${ALIAS_LENGTH}})`, async ctx => {
  const doc = await db.get('shorturls').findOne({alias: ctx.captures[0]});
  if (doc) {
    ctx.redirect(doc.originalurl);
  } else {
    ctx.status = 404;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
