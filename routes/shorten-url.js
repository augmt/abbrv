'use strict';

const randomstring = require('randomstring');

module.exports = async function (ctx) {
  const host = ctx.get('host');

  if (ctx.captures[1].startsWith(host)) ctx.throw(403);

  const aliases = ctx.db.collection('aliases');
  const url = ctx.captures.join('');
  const document = await aliases.findOne({url});
  const alias = (document && document.alias) || randomstring.generate(3);

  if (document === null) await aliases.insert({alias, url});

  ctx.body = {'shortened_url': `https://${host}/${alias}`};
  ctx.type = 'application/json';
};
