/* eslint-disable node/no-unsupported-features, no-param-reassign, class-methods-use-this */

import test from 'ava';
import sinon from 'sinon';
import faker from 'faker';
import mysqlLib from 'mysql';

import setAsyncTimeout from '../helpers/set-async-timeout';

import { spy, restoreSpy, getFatalError, getFailConnection } from './utils/mysql.mock';

const mysql = require('../libs/mysql');

test.beforeEach(t => {
  const connection = spy();

  t.context.query = faker.random.words().split(' ');
  t.context.config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  };
  t.context.connection = connection;
});

test.afterEach(t => {
  const { connection } = t.context;

  restoreSpy(connection);
});

test.serial('config should be correct ', t => {
  const { config } = t.context;

  t.deepEqual(mysql.config, config);
});

test.serial('reconections should be 0 ', t => {
  t.is(mysql.reconections, 0);
});

test.serial('.connect should call _connect', async t => {
  sinon.stub(mysql, '_connect');

  await mysql.connect();

  t.true(mysql._connect.calledOnce);

  mysql._connect.restore();
});

test.serial('.connect should throw an error', async t => {
  const { connection } = t.context;

  mysqlLib.createConnection.returns(getFailConnection());

  try {
    await mysql.connect();
  } catch (err) {
    t.true(err.fatal);
  }

  mysqlLib.createConnection.returns(connection);
});

test.serial(
  '.disconnect should call connection.removeAllListeners and connection.destroy',
  async t => {
    await mysql.connect();

    sinon.stub(mysql.connection, 'removeAllListeners');

    await mysql.disconnect();

    t.true(mysql.connection.destroy.calledOnce);
    t.true(mysql.connection.removeAllListeners.calledOnce);
    t.true(mysql.connection.removeAllListeners.calledWith('error'));

    mysql.connection.removeAllListeners.restore();
  }
);

test.serial('.query should call connection.query', async t => {
  const { query, connection } = t.context;

  await mysql.connect();

  await mysql.query(query);

  t.true(connection.query.calledOnce);
  t.true(connection.query.calledWith(query));
});

test.serial('.startTransaction should call connection.beginTransaction', async t => {
  const { connection } = t.context;

  await mysql.connect();

  await mysql.startTransaction();

  t.true(connection.beginTransaction.calledOnce);
  t.true(connection.beginTransaction.calledWith());
});

test.serial('.rollbackTransaction should call connection.rollback', async t => {
  const { connection } = t.context;

  await mysql.connect();

  await mysql.rollbackTransaction();

  t.true(connection.rollback.calledOnce);
  t.true(connection.rollback.calledWith());
});

test.serial('.endTransaction should call connection.commit', async t => {
  const { connection } = t.context;

  await mysql.connect();

  await mysql.endTransaction();

  t.true(connection.commit.calledOnce);
  t.true(connection.commit.calledWith());
});

test.serial('._connect should call mysql.createConnection with right config', async t => {
  const { config } = t.context;

  await mysql._connect();

  t.true(mysqlLib.createConnection.calledOnce);
  t.true(mysqlLib.createConnection.calledWith(config));
});

test.serial('.onError should do nothing when error is not fatal', async t => {
  const error = { fatal: false };
  const { connection } = t.context;

  await mysql._connect();

  t.true(mysqlLib.createConnection.calledOnce);

  connection.emit('error', error);

  t.true(mysqlLib.createConnection.calledOnce);
});

test.serial('.onError should reconnect when error is fatal', async t => {
  const { connection } = t.context;

  await mysql._connect();

  t.true(mysqlLib.createConnection.calledOnce);

  connection.emit('error', getFatalError());

  await setAsyncTimeout(2100);

  t.true(mysqlLib.createConnection.calledTwice);
});

test.serial(".onError should increase reconections when can't reconnect", async t => {
  const { connection } = t.context;

  await mysql._connect();

  t.is(mysql.reconections, 0);
  t.true(mysqlLib.createConnection.calledOnce);

  mysqlLib.createConnection.returns(getFailConnection());

  connection.emit('error', getFatalError());

  await setAsyncTimeout(100);

  t.is(mysql.reconections, 1);
  t.true(mysqlLib.createConnection.calledTwice);

  await setAsyncTimeout(2100);

  t.is(mysql.reconections, 2);
  t.true(mysqlLib.createConnection.calledThrice);

  mysqlLib.createConnection.returns(connection);

  await setAsyncTimeout(4100);

  t.is(mysql.reconections, 0);
  t.is(mysqlLib.createConnection.callCount, 4);
});
