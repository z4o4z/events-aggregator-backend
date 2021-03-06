const Router = require('koa-router');

const events = require('./controllers/events');
const health = require('./controllers/health');
const version = require('./controllers/version');
const rowPage = require('./controllers/row-page');

const validatePrivateUUID = require('./middlewares/validate-private-uuid');

const router = new Router();

router
  .use('/events', events.routes(), events.allowedMethods())
  .use('', rowPage.routes(), rowPage.allowedMethods())
  .use('/:privateUUID/health', validatePrivateUUID(), health.routes(), health.allowedMethods())
  .use('/:privateUUID/version', validatePrivateUUID(), version.routes(), version.allowedMethods());

module.exports = router;
