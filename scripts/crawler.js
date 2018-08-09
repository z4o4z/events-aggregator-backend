const { JSDOM } = require('jsdom');

const logger = require('../helpers/get-logger')(__filename);

class Crawler {
  static trim(text) {
    return (text || '').trim();
  }

  static getTextFromNode(node = {}) {
    return Crawler.trim(node.textContent || node.text);
  }

  static getHTMLFromNode(node = {}) {
    return Crawler.trim(node.innerHTML);
  }

  static getNextSiblingText(node = {}) {
    return Crawler.trim(node.nextSibling.wholeText);
  }

  constructor({ endpoint }) {
    logger.debug('constructor - endpoint=%s', endpoint);

    this.endpoint = endpoint;
  }

  async getDomFromURL(postfix = '') {
    logger.debug('getDocumentFromURL - postfix=%s', postfix);

    const dom = await JSDOM.fromURL(`${this.endpoint}${postfix}`);

    return dom;
  }
}

module.exports = Crawler;
