'use strict';

const URL = require('url').URL;
const test = require('tape');
const normalizeUrl = require('../../normalize-url.js');

test('normalizeUrl', t => {
  t.deepEqual(normalizeUrl('http://example.com/'), new URL('http://example.com/'), 'vanilla url');
  t.deepEqual(normalizeUrl('http://www.example.com/'), new URL('http://www.example.com/'), 'preserve www');
  t.deepEqual(normalizeUrl('http://www.example.org/foo.html#bar'), new URL('http://www.example.org/foo.html#bar'), 'preserve fragment identifier');
  t.deepEqual(normalizeUrl('http://example.com/over/there?name=ferret'), new URL('http://example.com/over/there?name=ferret'), 'preserve query parameters');
  try {
    t.deepEqual(normalizeUrl('http://'), {}, 'invalid url');
  } catch (err) {
    t.fail(err);
  }
  t.end();
});
