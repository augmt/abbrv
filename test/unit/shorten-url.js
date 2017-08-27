'use strict';

const test = require('tape');
const Random = require('random-js');
const simple = require('simple-mock');
const shortenUrl = require('../../shorten-url.js');

test('shortenUrl', t => {
  const origin = 'http://127.0.0.1:8080/';
  const aliasLength = 3;

  let factory = shortenUrl(undefined, origin, aliasLength);
  t.deepEqual(factory(null), {error: 'Invalid URL'}, 'when passed no originalurl and no document');

  const mt = Random.engines.mt19937().seed(0);
  const randomstring = Random.string();
  simple.mock(Random, 'string').returnWith((_, length) => randomstring(mt, length));

  factory = shortenUrl('http://example.com/', origin, aliasLength);
  t.deepEqual(factory(null), {alias: 'SV1', originalurl: 'http://example.com/', shorturl: 'http://127.0.0.1:8080/SV1'}, 'when passed an originalurl but no document');

  simple.restore();

  const doc = {alias: 'dNj', originalurl: 'http://example.net/', shorturl: 'http://127.0.0.1:8080/dNj'};
  t.deepEqual(factory(doc), doc, 'when passed a document');

  t.end();
});
