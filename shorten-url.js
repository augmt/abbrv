'use strict';

const Random = require('random-js');

const mt = Random.engines.mt19937().autoSeed();

class ShortUrl {
  constructor(isValid, object) {
    Object.defineProperty(this, 'isValid', {value: isValid});
    if (object) {
      Object.assign(this, object);
    }
  }
}
class ValidShortUrl extends ShortUrl {
  constructor(alias, originalurl, shorturl) {
    super(true);
    this.alias = alias;
    this.originalurl = originalurl;
    this.shorturl = shorturl;
    Object.defineProperty(this, 'new', {value: true});
  }
}
class InvalidShortUrl extends ShortUrl {
  constructor() {
    super(false);
    this.error = 'Invalid URL';
  }
}

function shortenUrl(originalurl, origin, aliasLength) {
  return function (doc) {
    if (doc) {
      return new ShortUrl(true, doc);
    }
    if (originalurl !== undefined) {
      const alias = Random.string()(mt, aliasLength);
      const shorturl = origin + alias;
      return new ValidShortUrl(alias, originalurl, shorturl);
    }
    return new InvalidShortUrl();
  };
}

module.exports = shortenUrl;
