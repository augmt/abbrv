'use strict';

const URL = require('url').URL;
const normalizeUrl = require('normalize-url');

const opts = {
  removeQueryParameters: [],
  stripFragment: false,
  stripWWW: false
};

function urlAdapter(url) {
  try {
    return new URL(normalizeUrl(url, opts));
  } catch (err) {
    // don't throw. just return an object.
  }
  return {};
}

module.exports = urlAdapter;
