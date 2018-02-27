/*
  eslint-disable
    class-methods-use-this,
    node/no-unsupported-features,
    node/no-unpublished-require
*/

const sinon = require('sinon');
const faker = require('faker');
const redis = require('redis');
const EventEmitter = require('events');

process.env.REDIS_DB = faker.random.number({ min: 0, max: 9 });
process.env.REDIS_HOST = faker.internet.ip();
process.env.REDIS_PORT = faker.random.number({ min: 100, max: 9999 });

class Client extends EventEmitter {
  quit() {}

  pingAsync() {}
}

const client = new Client();

function stub() {
  sinon.stub(redis, 'createClient').returns(client);
}

function restoreStub() {
  redis.createClient.restore();
}

function spy() {
  sinon.spy(client, 'on');
  sinon.spy(client, 'quit');
  sinon.spy(client, 'pingAsync');
  sinon.spy(client, 'removeAllListeners');
}

function restoreSpy() {
  client.on.restore();
  client.quit.restore();
  client.pingAsync.restore();
  client.removeAllListeners.restore();
}

module.exports = {
  spy,
  stub,
  client,
  restoreSpy,
  restoreStub
};
