'use strict';

const randomstring = require('randomstring');

let hostname, re, path;

module.exports = async function (ctx) {
  hostname = hostname || ctx.hostname;
  re = re || new RegExp(`^${hostname}.+$`);
  path = path || ctx.header['x-forwarded-path'];

  const url = ctx.url.slice(1);

  if (re.test(url)) ctx.throw(403);

  const aliases = ctx.db.collection('aliases');
  const document = await aliases.findOne({url});
  const alias = (document && document.alias) || randomstring.generate(3);

  if (document === null) await aliases.insert({alias, url});

  ctx.body = {'shortened_url': `https://${hostname}${path}/${alias}`};
  ctx.type = 'application/json';
};
