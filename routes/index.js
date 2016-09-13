'use strict';

const Router = require('koa-router');

const shortenURL = require('./shorten-url.js');
const redirect = require('./redirect.js');

const router = module.exports = new Router();

const rURL = /^\/https?:\/\/.+?\/*$/i;
const rAlphaNum = /^\/([0-9a-zA-Z]{3})\/*$/;

router.get('/', (ctx) => {
  ctx.throw(404, 'ERROR: Must specify a URL');
});

router.get(rURL, shortenURL);
router.get(rAlphaNum, redirect);
