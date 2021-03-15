# node-graphql-boilerplate


This repository contains my best practices, libraries setups, boilerplate examples 
and basic configurations for nodejs backend based on these technologies:

- Code
  - Typescript
  - GraphQL
  - custom Graphql Typescript framework
  - Type-orm
  - environment variable parsing
  - sending emails via *ethereal* or *AWS SES*
- Security
  - oAuth2 (google authorization)
  - local bearer authorization
- Database
  - Postgres
- *devops*
  - Docker
  - AWS serverless monorepo deployment
  - terraformed infrastructure

## TODO:
- save terraform files somewhere
- pm production setup
- tests
- check the keycloak support
- apollo tracking does not work after webpack build
- add FB oAuth2
- AWS
  - what about serverless RDS?
  - add xray AWS lambda tracing
  - S3 cloud-front Route53 public domain setup
  - add multiple deployment environments (test|prod|test|etc...)
  - support more stages
  - test AWS SES
  - extract TF backend state into s3 + add dynamo locking

## Requirements
- nodejs14+
- docker
- docker-compose

## Configuration

Copy `.env.example` file into `.env` and setup your local variables.

Environment details are described in the `/src/appConfig.ts`.

Database docker container environments are setted in the `/docker-compose.yml`.

## setup terraform:

```sh
terraform workspace new production
terraform workspace new development  
```

## Installation

All npm scripts are available also with the `docker:` prefix to call them directly in the running container

### with docker
1. run `npm install`
2. run `npm run docker:db:hard-init` - to setup database into init state
3. run `npm run docker:dev`  - to start app and database


### without docker
1. run `npm install`
2. run `npm run db:hard-init` - to setup database into init state
3. run `npm run dev` - to start app and database