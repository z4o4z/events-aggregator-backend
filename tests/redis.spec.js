/*
  eslint-disable
    global-require,
    no-param-reassign,
    class-methods-use-this,
    node/no-unsupported-features,
*/

import test from 'ava';
import redisLib from 'redis';

import { spy, stub, client, restoreSpy, restoreStub } from './utils/redis.mock';

stub();

const redis = require('../libs/redis');

test.beforeEach(t => {
  spy();

  t.context.config = {
    db: process.env.REDIS_DB,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  };
});

test.afterEach(() => {
  restoreSpy();
});

test.after(() => {
  restoreStub();
});

test.serial('.constructor should call redis.createClient', t => {
  const { config } = t.context;

  t.true(redisLib.createClient.calledOnce);
  t.true(redisLib.createClient.calledWithMatch(config));
});

test.serial('config.retry_strategy should return Math.min(option.attempt * 100, 150000)', t => {
  const { retry_strategy: retry } = redisLib.createClient.args[0][0];

  t.is(retry({ attempt: 0 }), 0);
  t.is(retry({ attempt: 10 }), 1000);
  t.is(retry({ attempt: 50 }), 5000);
  t.is(retry({ attempt: 100 }), 10000);
  t.is(retry({ attempt: 149 }), 14900);
  t.is(retry({ attempt: 150 }), 15000);
  t.is(retry({ attempt: 200 }), 15000);
});

test.serial('.ping should call client.pingAsync', async t => {
  await redis.ping();

  t.true(client.pingAsync.calledOnce);
  t.true(client.pingAsync.calledWith());
});

test.serial('.disconnect should call client.removeAllListeners', async t => {
  await redis.disconnect();

  t.is(client.removeAllListeners.callCount, 5);
  t.true(client.removeAllListeners.calledWith('end'));
  t.true(client.removeAllListeners.calledWith('error'));
  t.true(client.removeAllListeners.calledWith('ready'));
  t.true(client.removeAllListeners.calledWith('connect'));
  t.true(client.removeAllListeners.calledWith('reconnecting'));
});

test.serial('.disconnect should call client.quit', async t => {
  await redis.disconnect();

  t.true(client.quit.calledOnce);
  t.true(client.quit.calledWith());
});

test.serial('._remooveEventListeners should call client.removeAllListeners', async t => {
  await redis._remooveEventListeners();

  t.is(client.removeAllListeners.callCount, 5);
  t.true(client.removeAllListeners.calledWith('end'));
  t.true(client.removeAllListeners.calledWith('error'));
  t.true(client.removeAllListeners.calledWith('ready'));
  t.true(client.removeAllListeners.calledWith('connect'));
  t.true(client.removeAllListeners.calledWith('reconnecting'));
});

test.serial('._addEventListeners should call client.on', async t => {
  await redis._addEventListeners();

  client.emit('end');
  client.emit('error');
  client.emit('ready');
  client.emit('connect');
  client.emit('reconnecting');

  t.is(client.on.callCount, 5);
  t.true(client.on.calledWithMatch('end'));
  t.true(client.on.calledWithMatch('error'));
  t.true(client.on.calledWithMatch('ready'));
  t.true(client.on.calledWithMatch('connect'));
  t.true(client.on.calledWithMatch('reconnecting'));
});
