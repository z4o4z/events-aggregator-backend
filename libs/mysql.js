const mysql = require('mysql');
const Promise = require('bluebird');

const logger = require('../helpers/get-logger')(__filename);
const setAsyncTimeout = require('../helpers/set-async-timeout');

class MySQL {
  constructor(config) {
    logger.info('constructor');

    this.config = config;
    this.reconections = 0;
  }

  async connect() {
    logger.info('connect');

    try {
      await this._connect();

      logger.info('connect - done');
    } catch (error) {
      logger.error('connect - message=%s, stack=%s', error.message, error.stack);

      throw error;
    }
  }

  disconnect() {
    logger.info('disconnect');

    this.connection.removeAllListeners('error');

    this.connection.destroy();
  }

  query(...args) {
    return this.connection.queryAsync(...args);
  }

  startTransaction() {
    return this.connection.beginTransactionAsync();
  }

  rollbackTransaction() {
    return this.connection.rollbackAsync();
  }

  endTransaction() {
    return this.connection.commitAsync();
  }

  async _connect() {
    logger.info('_connect');

    this.connection = mysql.createConnection(this.config);

    Promise.promisifyAll(this.connection);

    logger.info('_connect 2');

    this.connection.on('error', err => this._onError(err));

    logger.info('_connect 3');

    await this.connection.connectAsync();

    this.reconections = 0;

    logger.info('_connect - done');
  }

  async _onError(err) {
    if (!err.fatal) {
      logger.warn('_onError - error=%j', err);
      return;
    }

    logger.error('_onError - error=%j', err);

    this.connection.removeAllListeners('error');

    await setAsyncTimeout(Math.min(this.reconections * 2000), 15000);

    this.reconections += 1;

    try {
      await this._connect();
    } catch (errror) {
      this._onError(errror);
    }
  }
}

module.exports = new MySQL({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});
