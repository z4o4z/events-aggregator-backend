/* eslint-disable node/no-unsupported-features, no-param-reassign, class-methods-use-this */

import test from 'ava';
import mysqlLib from 'mysql';

import { stub, spy, fatalPool, restoreSpy, restoreStub } from './utils/mysql.mock';

stub();

const mysql = require('../libs/mysql');

test.beforeEach.serial(t => {
  spy();

  t.context.config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: +process.env.DB_CONNECTION_LIMIT
  };
});

test.afterEach.serial(() => {
  restoreSpy();
});

test.after.serial(() => {
  restoreStub();
});

test.serial('config should be correct ', t => {
  const { config } = t.context;

  t.deepEqual(mysql.config, config);
});

test.serial('.constructor should call musql.createPool', async t => {
  t.true(mysqlLib.createPool.calledOnce);
});

test.serial('.getConnection should call mysql.getConnection', async t => {
  await mysql.getConnection();

  t.true(mysql.pool.getConnection.calledOnce);
});

test.serial('.getConnection should throw an error', async t => {
  const { pool } = mysql;

  try {
    mysql.pool = fatalPool;
    await mysql.getConnection();
  } catch (err) {
    t.is(err.message, 'fatal error');
  }

  mysql.pool = pool;
});

test.serial('.end should call mysql.end', async t => {
  await mysql.end();

  t.true(mysql.pool.end.calledOnce);
});
