'use strict';

module.exports = async function (ctx) {
  const aliases = ctx.db.collection('aliases');
  const document = await aliases.findOne({alias: ctx.captures[0]});

  if (document === null) ctx.throw(404);

  ctx.status = 301;
  ctx.redirect(document.url);
};
