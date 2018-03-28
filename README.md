# events-aggregator-backend

Starter kit for the simple web services powered by [Monterosa](https://www.monterosa.co/).

* Based on the [Koa2]()
* Has tests with AVA, NYC, Sinon and Faker
* Has `.env` file for the environment specific settings
* Has ESLint and Prettier integration
* Has secure features: `eslint-plugin-security` and `koa-helmet` middleware
* Has the private `/:privateUUID/health` and `/:privateUUID/version` routes
* Has a middleware to validate the errors in the one place
* Has a pretty logger with date time, file path and colors

## Installation

Just clone the repository:

```
git clone git@github.com:z4o4z/events-aggregator-backend
```

## Start

Just run the folowing command:

```
node ./app.js
```

## Usage

### `.env` and `.env.erb` files

The service uses `.env` file for the environment specific settings(HTTP port, MongoDB pass, MongoDB username and etc).
We are using [dotenv](https://www.npmjs.com/package/dotenv) lib to move variables from `.env` file to the `process.env`.
`.env` file added to `.gitignore` to be sure not putting private data into the repository.
`.env.erb` this is template file for the developers and DevOps team to generate `.env` file with the right keys.

#### `.env.erb` structure

```
# mysql config
MONGO_DB_HOST=<%= @mongodb_host %>
MONGO_DB_PORT=<%= @mongodb_service_port %>
MONGO_DB_NAME=<%= @mongodb_service_user_name %>

# uuid for the private routes
HEALTH_UUID=<%= @health_uuid %>

# http port
HTTP_PORT=<%= @http_port %>
```

You can add custom environment variables to the `.env.erb` template file to use them in the service.

##### NOTE: All variables are strings!

##### By default (look into `/helpers/env.js` file) `NODE_ENV` variable will be `production` to disable development logs and switch `koa` to the production mode. To override it just add `NODE_ENV=development` to your local or dev `.env` file.

### ESLint and Prettier

For [eslint](https://eslint.org/) we are using the following configs: `airbnb-base`, `plugin:security/recommended`, `plugin:node/recommended` and plugings: `node`, `security`, `prettier`.

We are using [prettier](https://prettier.io/) for pretty code style in the team.

To run eslint use the following command:

```
npm run lint
```

To run prettier use the following command:

```
npm run format
```

### Tests

For tests we are using [AVA](https://github.com/avajs/ava/tree/v0.25.0), for coverage - [NYC](https://istanbul.js.org/), for mocks - [Sinon](http://sinonjs.org/) and for fake data - (Faker)[https://rawgit.com/Marak/faker.js/master/examples/browser/index.html].

All tests placed in the `tests` folder and has `.spec` postfix.

To run tests use the following command:

```
npm run test
```

you can add `-- --watch` to autorun tests when files change.

You can use this `npm run test:report` command to generate report HTML page.

### Logger

We are using [Winston](https://github.com/winstonjs/winston) lib for the logs with some additional features.
To get logger just include the `get-logger` file from the `helpers` folder to your file and pass the prefix to the `getLogger` function. We reccomend to use the `__filename` for the prefix.

Example:

```
const logger = require('./helpers/get-logger')(__filename);

/*
 ...
*/

logger.info('App started successfully on the port %s', process.env.HTTP_PORT); // [2018-02-23T09:28:43.499Z] [info] /path/to/your/file.js - App started successfully on the port 8080
```

#### Log levels

* `.warn` - yellow color
* `.error` - red color
* `.debug` - grey color
* `.info` - green color

### Routes

For routing we using [koa-router](https://github.com/alexmingoia/koa-router) and for validation [koa-validate](https://github.com/RocksonZeta/koa-validate) libs. All routes placed in the `/controllers` folder and the main router is `/router.js`.

The router has two private routes:

* `/:privateUUID/health` - the health information for this service
* `/:privateUUID/version` - the current version of the service

To access this router user needs to know `HEALTH UUID` set in the `.env` file.

## Contributing

I welcome contributions! Please open an issue if you have any feature ideas
or find any bugs. I also accept pull requests with open arms. I will
go over the issues when I have time. :)
