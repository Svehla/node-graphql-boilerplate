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

- Create custom GQL ID type with `prefix:UUID`
- AWS
  - test AWS SES
  - add xray AWS lambda tracing
- apollo tracking does not work after webpack build
- add FB oAuth2
- tests
- sql migrations
- check the keycloak support
- add pgadmin into docker-compose?

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

## Create database permissions

[add pg user tutorial](https://medium.com/@mohammedhammoud/postgresql-create-user-create-database-grant-privileges-access-aabb2507c0aa)

```sql
CREATE DATABASE my_app_production

CREATE USER my_app_production_user WITH PASSWORD 'my-secret-password';

GRANT ALL PRIVILEGES ON DATABASE "my_app_production" to my_app_production_user;

-- in scope of newly created db create uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### steps to create this boilerplate into new project

- Create SQL database and get Credentials
- Create dynamo table
- Setup .env(development|production) file
- change AWS S3 Terraform backend
- Setup tfvars.(production|development) files
- deploy infrastructure
