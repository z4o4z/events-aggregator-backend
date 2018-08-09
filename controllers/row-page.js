const Router = require('koa-router');

const logger = require('../helpers/get-logger')(__filename);

const Page = require('../models/page');

const router = new Router();

async function get(ctx) {
  const page = ctx
    .checkQuery('page')
    .default(1)
    .toInt().value;

  const res = await Page.findOne({ uri: `/?page=${page}` }, 'html');

  logger.info('get - page=%s', page);

  ctx.body = res ? res.html : '';
}

async function getByUri(ctx) {
  const eventUri = ctx.checkParams('eventUri').notBlank(0).value;

  ctx.assert(!ctx.errors);

  const res = await Page.findOne({ uri: `/${eventUri}` }, 'html');

  logger.info('get - eventUri=%s', eventUri);

  ctx.body = res ? res.html : '';
}

router.get('/', get).get('/:eventUri', getByUri);

module.exports = router;
