const Promise = require('bluebird');

module.exports = function setAsyncTimeout(timeout) {
  return new Promise(res => setTimeout(() => res(), timeout));
};
