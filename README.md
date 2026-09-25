## Description

This repository uses [Nest](https://github.com/nestjs/nest) TypeScript back-end framework,
and has minimal test coverage : only one e2e that test the only endpoint (without calling the real openweather API behind).

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run e2e tests

```bash

$ docker compose up --wait -d weather-api
$ npm run test:e2e

```

## Deployment

For deployment, [Render](https://render.com) is used (free plan), in coordination with a private docker hub (free plan too).
What happens is that when the github 'cd' job pushes a latest tag of the image, docker hub calls a webhook that triggers [render](https://render.com) deployment. [Render](https://render.com) also checks healthcheck with a '/health' path.

## Observability

For observability, [dd-trace](https://github.com/DataDog/dd-trace-js) (datadog's nodejs sdk) was used, with minimal setup.
I also added logging both in dev and prod mode, with [pino](https://github.com/pinojs/pino) and [pino-pretty](https://github.com/pinojs/pino-pretty).

## Resources

- [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
