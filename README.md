## Important: Before downloading and using this directory structure, please read the following article:

[https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/breakintcomponents.md](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/breakintcomponents.md)

## According to this article, the directory structure like this project is not bad, consider it before using it and refer to it.

# Disclaimer of all responsibility related to this project.

# Typescript with Node.js

## Powered by

[![DS112](https://i.imgur.com/iXgnqXG.png)](https://github.com/3Tea)

<img align="right" width="200" height="183" src="https://cloud.githubusercontent.com/assets/532272/21507867/3376e9fe-cc4a-11e6-9350-7ec4f680da36.gif">

# Introduction

## Status

![TravisCi](https://img.shields.io/travis/com/onepiecehung/typescript-nodejs-v2/develop?style=for-the-badge&logo=travis-ci)
![CircleCI](https://img.shields.io/circleci/build/github/onepiecehung/typescript-nodejs-v2/develop?logo=circleci&style=for-the-badge)
![Gitlab pipeline status](https://img.shields.io/gitlab/pipeline/onepiecehung/typescript-nodejs-v2/develop?logo=gitlab&style=for-the-badge)
![Issues](https://img.shields.io/github/issues/onepiecehung/typescript-nodejs-v2?style=for-the-badge&logo=github)
![Forks](https://img.shields.io/github/forks/onepiecehung/typescript-nodejs-v2?style=for-the-badge&logo=github)
![Starts](https://img.shields.io/github/stars/onepiecehung/typescript-nodejs-v2?style=for-the-badge&logo=github)
![License](https://img.shields.io/github/license/onepiecehung/typescript-nodejs-v2?style=for-the-badge&logo=apache)
![Twitter](https://img.shields.io/twitter/url?style=for-the-badge&url=https%3A%2F%2Fgithub.com%2Fonepiecehung%2Ftypescript-nodejs-v2&logo=twitter)

## Cross-platform, JavaScript runtime environment

![NPM 7](https://img.shields.io/badge/Npm-7.0.x-brightgreen.svg?logo=npm&style=for-the-badge)
![Node 15](https://img.shields.io/badge/NodeJS-15.0.x-brightgreen.svg?logo=node.js&style=for-the-badge)
![Webpack](https://img.shields.io/badge/Webpack-4.4.x-brightgreen.svg?logo=webpack&style=for-the-badge)

## Language

![Typescript](https://img.shields.io/badge/Typescript-4.2.x.dev-brightgreen.svg?logo=typescript&style=for-the-badge)

## Database

![MongoDB 4](https://img.shields.io/badge/MongoDB-4.4.x-brightgreen.svg?logo=mongodb&style=for-the-badge)
![Cassandra](https://img.shields.io/badge/Cassandra-3.11.9-brightgreen.svg?logo=Apache-Cassandra&style=for-the-badge)

## Back end web application framework

![Express 4](https://img.shields.io/badge/ExpressJS-4.17.x-brightgreen.svg?logo=node.js&style=for-the-badge)

## Cache

![Redis 6](https://img.shields.io/badge/Redis-6.0.8-brightgreen.svg?logo=redis&style=for-the-badge)

## Message broker

![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.8.9.management.alpine-brightgreen.svg?logo=rabbitmq&style=for-the-badge)
![ErLang](https://img.shields.io/badge/ErLang-23.1.3-brightgreen.svg?logo=erlang&style=for-the-badge)

## OS-level virtualization

![Docker](https://img.shields.io/badge/Docker-19.03.13.build.4484c46d9d-brightgreen.svg?logo=docker&style=for-the-badge)
![Docker-compose](https://img.shields.io/badge/Docker_compose-3.8.x-brightgreen.svg?logo=docker&style=for-the-badge)

## Load balancing

![HAProxy](https://img.shields.io/badge/HAProxy-1.9.x-brightgreen.svg?logo=nginx&style=for-the-badge)

# 1.Quick install

## Install the environment

This application requires

-   RabbitMQ - [Normal installation](https://www.rabbitmq.com/)
-   Redis - [Normal installation](https://redis.io/)
-   MongoDB - [Normal installation](https://www.mongodb.com/)

### Install with Docker

-   RabbitMQ

```sh
$ docker run -d --hostname my-rabbit --name some-rabbit rabbitmq:3
```

-   Redis

```sh
$ docker run --name some-redis -d redis
```

-   MongoDB

```sh
$ docker run --name some-mongo -d mongo:tag
```

### Setup file `.env`

```env
NODE_ENV=production #When running on production

RABBIT_URL=your_url_rabbitmq
#https://www.npmjs.com/package/amqplib

REDIS_URL=your_url_redis
#https://www.npmjs.com/package/ioredis

DB_URL=your_url_mongodb
#example: mongodb://localhost:27017/test
#https://mongoosejs.com/

#Port application
PORT=8018
```

## Install package

```npm
npm install
```

## Run

```npm
npm run dev
```

**_Successfully deployed the application_**

<div style="text-align:center">
<img width="100%" src="https://i.imgur.com/OxLd05c.png">
</div>

# 2. Project structure

```
./src/
    /api
    /bin
    /components
        /user
        /workers
        /something
    /config
    /connector
    /middleware
    /utils
```

### Simple Architecture

<div style="text-align:center">
Not available
</div>

### The flow of application

<div style="text-align:center">
Not available
</div>

### Wait...bruh...i forgot what to do next... :confused: :worried: :sleeping:

# Refer [Your wiki](https://github.com/onepiecehung/typescript-nodejs-v2/wiki)
