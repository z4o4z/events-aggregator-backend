/* eslint-disable node/no-unsupported-features, no-param-reassign */

import test from 'ava';
import faker from 'faker';
import Promise from 'bluebird';

import setAsyncTimeout from '../helpers/set-async-timeout';

test.beforeEach(t => {
  t.context.timeout = faker.random.number({
    min: 100,
    max: 1500
  });
});

test('should return instance of Bluebird', t => {
  const { timeout } = t.context;

  t.true(setAsyncTimeout(timeout) instanceof Promise);
});
