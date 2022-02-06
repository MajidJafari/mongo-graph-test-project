<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Test project utilizing Mongo Graph.

## Installation

```bash
$ npm i -g yarn @nest/cli
$ yarn
```

## Notes before running the app

Set your constant config in the `src/configs/constants.ts` file. Please note the mongo URL string you enter here, should be the one you will enter must be the same as `<YOUR_MONGODB_URL_STRING>` in running the seeder.


## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod

# initialize the DB with necessary data
$ node dist/store-seeder-script.js <YOUR_MONGODB_URL_STRING>
```



## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e
```

## License

[MIT licensed](LICENSE).

>## Notice

- I added `status` field to soft-delete entities, so I don't remove them from DB.
- I aggregate user API with different type of `MANAGER` and `EMPLOYEE` in one API as I think it makes sense to do so because they are different in only `type` query filter.
- I could reference the child stores in `store` model but I preferred to save `parenetStore` as the project could grow, and it is not efficient to save let’s say for example `50` entries as `childStore` for each `store.`
- I used `bcryptjs` for hashing `password`s for the sake of simplicity, but in production projects, we should use `bcrypt` as it uses `C` under the hood and is almost `100` times faster than `bcryptjs` which uses `JavaScript` for the same tasks.

- I used the `name` as `username` and `password` of the users in the `seeder script` for the sake of brevity.
- I used the DB properties as inputs and outputs for the sake of simplicity, but in the production project, I prefer `snake_case_keys` for request and response and `camelCase` for database schema.
- Right now the `refreshToken` field of the user model is useless, I would add another API to get the same `accessToken` as its response with `refreshToken` as its request to provide a better DX for clients.
- The `Authorization` mechanism which uses only one `Interceptor` is so fragile and is completely route-dependent and I could use `CASL` or `casbin` libraries in the production project, considering whether I had the time to implement it.


>## Future development

This project can be improved with the following developments:

- [ ]  Replace`bcryptjs` with `bcrypt`.
- [ ]  Refactor the project so inputs and outputs keys would not be the same as DB fields. For example, replace `_id` with `id` and remove `__v` field using `toJSON` mongoose built-in virtual.
- [ ]  Add an API that accepts `refresh_token` as its request body and returns the `OAuth2` standard response.
- [ ]  Overhaul the `Authorization` with `CASL` or `casbin` libraries.

***Thank You :)***
