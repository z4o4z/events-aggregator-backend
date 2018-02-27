/*
  eslint-disable
    class-methods-use-this,
    node/no-unsupported-features,
    node/no-unpublished-require
*/

const sinon = require('sinon');
const faker = require('faker');
const mysql = require('mysql');
const EventEmitter = require('events');

process.env.DB_HOST = faker.internet.ip();
process.env.DB_PORT = faker.random.number({ min: 100, max: 9999 });
process.env.DB_USER = faker.lorem.slug();
process.env.DB_PASS = faker.internet.password();
process.env.DB_NAME = faker.lorem.slug();

function getFatalError() {
  const error = new Error('fatal error');
  error.fatal = true;

  return error;
}

class SuccessConnecttion extends EventEmitter {
  connect(cb) {
    cb();
  }

  query(data, cb) {
    cb();
  }
  commit(cb) {
    cb();
  }
  destroy() {}
  rollback(cb) {
    cb();
  }
  beginTransaction(cb) {
    cb();
  }
}

class FailConnecttion extends SuccessConnecttion {
  connect(cb) {
    cb(getFatalError());
  }
}

function getFailConnection() {
  return new FailConnecttion();
}

function getSuccessConnection() {
  return new SuccessConnecttion();
}

function spy() {
  const createConnection = sinon.stub(mysql, 'createConnection');
  const connection = getSuccessConnection();

  createConnection.returns(connection);

  sinon.spy(connection, 'query');
  sinon.spy(connection, 'commit');
  sinon.spy(connection, 'destroy');
  sinon.spy(connection, 'rollback');
  sinon.spy(connection, 'beginTransaction');

  return connection;
}

function restoreSpy(connection) {
  connection.query.restore();
  connection.commit.restore();
  connection.destroy.restore();
  connection.rollback.restore();
  connection.beginTransaction.restore();

  mysql.createConnection.restore();
}

module.exports = {
  spy,
  restoreSpy,
  getFatalError,
  getFailConnection,
  getSuccessConnection
};
