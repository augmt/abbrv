'use strict';

import test from 'tape';
import { expect } from 'chai';
import request from 'supertest';
import app from './../src/app.js';

const server = app.listen();

test(app.name, (t) => {
  let alias;

  t.test('when passed a valid url', (t) => {
    t.plan(2);

    request(server)
      .get('/http://zombo.com')
      .expect('Content-Type', /json/)
      .end((err) => t.ifError(err, 'content-type should be json'));

    request(server)
      .get('/http://zombo.com')
      .expect((res) => expect(res.body).to.have.all.keys(['shortened_url']))
      .end((err, res) => {
        t.ifError(err, 'response properties should consist of all and only the specified properties');

        alias = res.body.shortened_url.slice(-3);
      });
  });

  t.test('when visiting a shortened url', (t) => {
    t.plan(1);

     request(server)
      .get('/' + alias)
      .expect(301)
      .expect((res) => expect(res.header.location).to.equal('http://zombo.com'))
      .end((err) => t.ifError(err, 'it should 301 redirect to the original link'));
  });
});

test.onFinish(() => server.close(() => app.context.db.close()));
