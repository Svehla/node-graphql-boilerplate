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

### steps to create this boilerplate into new project

- Create SQL database and get Credentials
- Create dynamo table
- Setup .env(stage-1|production) file
- change AWS S3 Terraform backend
- Setup tfvars.(stage-1|production) files
- deploy infrastructure

## How to run & reconfigure this fullstack repository

### Run local development

```sh
git clone .....


```

setup local env variables

```sh
# setup envs
cp .example.env .env
cp .example.env .env
cp .example.env .env

# install dependencies
npm install
```

change database name + change db_name in `docker-compose.yml`

```sh
# run database:
npm run docker:db:up

# add init data
npm run docker:db:hard-init
```

### deployment

#### Postgre database

In AWS console create new RDS and set it public with proper settings of security groups.

Then connect into this created instance and add a new user. you can use scripts like this:

```sql
CREATE DATABASE my_app_production

CREATE USER my_app_production_user WITH PASSWORD 'my-secret-password';

GRANT ALL PRIVILEGES ON DATABASE "my_app_production" to my_app_production_user;

-- in scope of newly created db create uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

[add pg user tutorial](https://medium.com/@mohammedhammoud/postgresql-create-user-create-database-grant-privileges-access-aabb2507c0aa)

#### DynamoDB database

Go to AWS console and create new dynamo table with PK named: `PK` and SK named: `SK`

#### setup .env.(production|stage-1).env files which will be deployed with your code into the AWS lambda

```sh
cp .example.env .env
cp .example.env .env.stage-1.env
cp .example.env .env.production
```

now you should setup

- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB_NAME
- POSTGRES_HOST
- AWS_ACCESS_KEY_ID -> this should be removed in the near future
- AWS_SECRET_ACCESS_KEY -> this should be removed in the near future
- AWS_DYNAMO_LOG_TABLE_NAME=node-boilerplate-stage-1
- ...

#### terraform state

go to `init-terraform-backend/setup-backend.tf` and change name of your dynamodb table + s3 bucket

```sh
cd init-terraform-backend

terraform init
terraform apply

```

then set your newly created resources into `/terraform/main` > `terraform` > `backend "s3"` > `bucket` + `dynamodb_table`

#### Setup Terraform variables

Don't forget you have to be logged into AWS CLI from PC which deploy your terraform infrastructure

go to `/terraform` folder and change `globalLocals.tf` variables

Now you should deploy both your environments with just simple scripts:

```sh
terraform init

npm run deploy:infrastructure # or d:i
npm run deploy:code:production # or d:c:p
npm run deploy:code:stage-1 # or d:c:s

```

#### rename deploy scripts

by name of your lambdas change `.sh` scripts in the `deploy-scripts` folder
