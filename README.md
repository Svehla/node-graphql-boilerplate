# node-graphql-boilerplate

This repository contains my best practices, libraries setups, boilerplate examples
and basic configurations for nodejs backend based on these technologies:

- Code
  - Typescript
  - GraphQL
  - custom Graphql Typescript framework
  - Type-orm
  - environment variable parsing
  - sending emails via _ethereal_ or _AWS SES_
- Security
  - oAuth2 (google authorization)
  - local bearer authorization
- Database
  - Postgres
- _devops_
  - Docker
  - AWS serverless monorepo deployment
  - add multiple deployment environments (test|prod|test|etc...)
  - terraformed infrastructure
  - extract TF backend state into s3 + add dynamo locking

## TODO:

- Add notifications table
- Add DF Posts Categories
- Create custom GQL ID type
- Add cursor pagination
- AWS
  - test AWS SES
  - add more lambdas + dynamo (no-sql) support
  - what about serverless RDS?
  - add xray AWS lambda tracing
- Add RDS setup/EC2 puppet postgres config
- apollo tracking does not work after webpack build
- add FB oAuth2
- tests
- sql migrations
- check the keycloak support
- add pgadmin into docker-compose

## Requirements

- nodejs14+
- docker
- docker-compose

## Configuration

Setup RDS (or whatever you want) by hand (RDS setup is not included in the .tf files)

Copy `.env.example` file into `.env` and setup your local variables.

Environment details are described in the `/src/appConfig.ts`.

Database docker container environments are setted in the `/docker-compose.yml`.

## setup terraform:

```sh
cd init-terraform-backend

terraform init
terraform apply

cd ..
cd terraform

terraform init

terraform workspace new production
terraform workspace new development
```

## Installation

All npm scripts are available also with the `docker:` prefix to call them directly in the running container

### with docker

1. run `npm install`
2. run `npm run docker:db:hard-init` - to setup database into init state
3. run `npm run docker:dev` - to start app and database

### without docker

1. run `npm install`
2. run `npm run db:hard-init` - to setup database into init state
3. run `npm run dev` - to start app and database

## Helper script

```bash
kill $(lsof -ti:2020)
```
