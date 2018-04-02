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

async function main() {
  await db.connect();

  app.listen(process.env.HTTP_PORT);
  logger.info('App started successfully on the port %s', process.env.HTTP_PORT);
}

main();
