'use strict';

const test = require('tape');
const request = require('supertest');
const Random = require('random-js');
const simple = require('simple-mock');
const app = require('../../app.js');

const server = app.listen(8080);

test('server', async t => {
  t.plan(4);

  function runRedirectTest() {
    request(server)
      .get('/SV1')
      .expect(302)
      .expect('location', 'http://example.com/')
      .end(err => t.error(err, '302 GET /:alias', err));
  }

  const mt = Random.engines.mt19937().seed(0);
  const randomstring = Random.string();
  simple.mock(Random, 'string').returnWith((_, length) => randomstring(mt, length));

  await app.context.db.get('shorturls').remove();

  request(server)
    .post('/new/http://example.com/')
    .expect('content-type', /json/)
    .expect(200, {originalurl: 'http://example.com/', shorturl: 'http://127.0.0.1:8080/SV1'})
    .then(
      res => {
        t.pass('200 POST /new/:url');
        runRedirectTest();
      },
      err => {
        t.fail(err);
        t.skip('302 GET /:alias');
      }
    )
    .then(() => simple.restore());

  request(server)
    .post('/new/http://')
    .expect('content-type', /json/)
    .expect(400, {error: 'Invalid URL'})
    .end(err => t.error(err, '400 POST /new/:url', err));

  request(server)
    .get('/404')
    .expect(404)
    .end(err => t.error(err, '404 GET /:alias', err));
});

test.onFinish(async () => {
  await app.context.db.get('shorturls').remove();
  await app.context.db.close();
  await server.close();
});
