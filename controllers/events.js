const Router = require('koa-router');

const logger = require('../helpers/get-logger')(__filename);

const Event = require('../models/event');

const router = new Router();

const LIMIT = 10;

async function get(ctx) {
  const page = ctx
    .checkQuery('page')
    .default(0)
    .toInt().value;
  const search = ctx.checkQuery('search').default('').value;
  const startDate = ctx.checkQuery('startDate').toInt().value;
  const finishDate = ctx.checkQuery('finishDate').toInt().value;

  ctx.assert(!ctx.errors);

  const query = {};

  if (search) {
    query.$text = { $search: search };
  }

  if (startDate) {
    query.start_date = { $gte: startDate };
  }

  if (finishDate) {
    query.finish_date = { $lt: finishDate };
  }

  const events = await Event.find(
    query,
    '_id uri title address start_time start_date finish_time finish_date hero_image_url',
    {
      skip: page * LIMIT,
      sort: { start_at: -1, start_time: -1 },
      limit: LIMIT
    }
  );

  logger.info('get - page=%s', page);

  ctx.body = events.map((event, i) => {
    // eslint-disable-next-line no-param-reassign
    event.hero_image_url = `${event.hero_image_url}?${i}`;

    return event;
  });
}

async function getById(ctx) {
  const id = ctx.checkParams('eventId').notBlank(0).value;

  ctx.assert(!ctx.errors);

  const event = await Event.findById(id);

  logger.info('get - id=%s', id);

  ctx.body = event;
}

router.get('/', get).get('/:eventId', getById);

module.exports = router;
