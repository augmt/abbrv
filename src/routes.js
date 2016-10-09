'use strict';

import Router from 'koa-router';
import { generate as randomstring } from 'randomstring';

const router = new Router();

let origin = {};

// @stephenhay's url validation regex via
// https://mathiasbynens.be/demo/url-regex
router.get(/^\/https?:\/\/[^\s/$.?#].[^\s]*$/, async (ctx) => {
  if (!origin.href) {
    origin.href = `${ctx.hostname}${ctx.get('x-forwarded-path')}\/`;
    origin.regex = new RegExp(`^https?:\/\/${origin.href}.+$`);
  }

  const url = ctx.url.slice(1);

  if (origin.regex.test(url)) ctx.throw(403);

  const aliases = ctx.db.collection('aliases');
  const document = await aliases.findOne({url});
  const alias = (document && document.alias) || randomstring(3);

  if (document === null) await aliases.insert({alias, url});

  ctx.body = {'shortened_url': `https://${origin.href}${alias}`};
  ctx.type = 'json';
});

router.get('/([0-9a-zA-Z]{3})', async (ctx) => {
  const aliases = ctx.db.collection('aliases');
  const document = await aliases.findOne({alias: ctx.captures[0]});

  if (document === null) ctx.throw(404);

  ctx.status = 301;
  ctx.redirect(document.url);
});

export default router;
