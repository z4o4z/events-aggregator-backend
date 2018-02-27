require('./helpers/env');

const Koa = require('koa');
const helmet = require('koa-helmet');
const validate = require('koa-validate');
const bodyParser = require('koa-bodyparser');

const logger = require('./helpers/get-logger')(__filename);

const mysql = require('./libs/mysql');
const redis = require('./libs/redis');

const errors = require('./middlewares/errors');

const router = require('./router');

const app = new Koa();

app.env = process.env.NODE_ENV;

app.context.db = mysql;
app.context.redis = redis;

validate(app);

app.use(helmet());
app.use(errors());
app.use(bodyParser());

app.use(router.routes());
app.use(router.allowedMethods());

async function main() {
  await mysql.connect();

  app.listen(process.env.HTTP_PORT);
  logger.info('App started successfully on the port %s', process.env.HTTP_PORT);
}

main();
