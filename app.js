/* eslint-disable no-process-exit */

require('./helpers/env');

const Koa = require('koa');
const helmet = require('koa-helmet');
const validate = require('koa-validate');
const bodyParser = require('koa-bodyparser');

const logger = require('./helpers/get-logger')(__filename);

const errors = require('./middlewares/errors');

const MongoDB = require('./libs/mongo-db');

const router = require('./router');

const app = new Koa();

const db = new MongoDB({
  port: process.env.MONGO_DB_PORT,
  host: process.env.MONGO_DB_HOST,
  name: process.env.MONGO_DB_NAME,
  autoReconnect: true
});

app.env = process.env.NODE_ENV;

validate(app);

app.use(helmet());
app.use(errors());
app.use(bodyParser());

app.use(router.routes());
app.use(router.allowedMethods());

async function onStop() {
  try {
    await Promise.all([db.disconnect()]);

    logger.info('server successfully stopped');

    process.exit(0);
  } catch (err) {
    logger.warn('server stopped with error %s', err);

    process.exit(1);
  }
}

async function main() {
  process.on('SIGINT', onStop);

  await db.connect();

  app.listen(process.env.HTTP_PORT);
  logger.info('App started successfully on the port %s', process.env.HTTP_PORT);
}

main().catch(err => {
  logger.error("App doesn't started, error: %s", err);

  process.exit(1);
});
