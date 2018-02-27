/* eslint-disable node/no-unsupported-features, no-param-reassign */

import test from 'ava';
import faker from 'faker';

import getLogger from '../helpers/get-logger';

test.beforeEach(t => {
  t.context.prefix = faker.random.word();
});

test('should return object', t => {
  const { prefix } = t.context;

  const logger = getLogger(prefix);

  t.is(typeof logger, 'object');
});

test('.info should be a function', t => {
  const { prefix } = t.context;

  const logger = getLogger(prefix);

  t.is(typeof logger.info, 'function');
});

test('.warn should be a function', t => {
  const { prefix } = t.context;

  const logger = getLogger(prefix);

  t.is(typeof logger.warn, 'function');
});

test('.error should be a function', t => {
  const { prefix } = t.context;

  const logger = getLogger(prefix);

  t.is(typeof logger.error, 'function');
});

test('.debug should be a function', t => {
  const { prefix } = t.context;

  const logger = getLogger(prefix);

  t.is(typeof logger.debug, 'function');
});
