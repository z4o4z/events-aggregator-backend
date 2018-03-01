/*
  eslint-disable
    class-methods-use-this,
    node/no-unsupported-features,
    node/no-unpublished-require
*/

const sinon = require('sinon');
const faker = require('faker');
const mysql = require('mysql');
const Promise = require('bluebird');
const EventEmitter = require('events');

process.env.DB_HOST = faker.internet.ip();
process.env.DB_PORT = faker.random.number({ min: 100, max: 9999 });
process.env.DB_USER = faker.lorem.slug();
process.env.DB_PASS = faker.internet.password();
process.env.DB_NAME = faker.lorem.slug();
process.env.DB_CONNECTION_LIMIT = faker.random.number({ min: 0, max: 100 });

class Pool extends EventEmitter {
  getConnection(cb) {
    cb(null, new EventEmitter());
  }

  end(cb) {
    cb();
  }
}

class FatalPull extends Pool {
  getConnection(cb) {
    cb(new Error('fatal error'), new EventEmitter());
  }
}

const pool = new Pool();
const fatalPool = new FatalPull();

Promise.promisifyAll(pool);
Promise.promisifyAll(fatalPool);

function stub() {
  const createPool = sinon.stub(mysql, 'createPool');

  createPool.returns(pool);
}

function spy() {
  sinon.spy(pool, 'end');
  sinon.spy(pool, 'getConnection');
}

function restoreSpy() {
  pool.end.restore();
  pool.getConnection.restore();
}

function restoreStub() {
  mysql.createPool.restore();
}

module.exports = {
  spy,
  stub,
  fatalPool,
  restoreSpy,
  restoreStub
};
