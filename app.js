'use strict';

const Koa = require('koa');

const cors = require('kcors');
const json = require('koa-json');
const router = require('./routes');

const app = module.exports = new Koa();

require('./db.js')(app);

app.use(cors());
app.use(json());
app.use(router.routes());
