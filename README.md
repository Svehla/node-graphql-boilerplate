# node-graphql-boilerplate

This repository contains best practises and necessary configuration for smap/medium/larger nodejs backend
application based on graphQl backend


All source codes are written in typescript and test coverage is higher than 90%

## Requirments
- install on your OS: `node`, `yarn`, `docker`
- Nodejs at least 8.9.3, yarn and postgres.

If you haven't postgres db on local machine, you can use docker and docker-compose with nodejs and postgres db container.

## Configuration
copy .env.example file to .env a config your local varibales

if you want change port of app and you use docker -> you have to reconfigure `docker-compose.yml`

## Installation
1. run `yarn` or `npm install` to install dependecies
1. run `yarn run docker-db-hard-init` to install dependecies
3. run `yarn run docker-start` to start app and database

## Developing (local vs docker)
for developing you can use docker or install your own server

In package json is every script available via docker with `docker-` prefix

fox example:
- `start` script VS `docker-start` script
- `test` script VS `docker-test` script
- `test:watch` script VS `docker-test:watch` script

if you want to init db schema use `npm start db-init` (or `npm start docker-db-init` for docker instance)


## Tests
this package contains 2 types of tests:
- integration: GraphQL HTTP endpoins
- models: check if graphQl contains all necessary properties


### run tests
- `test` (or `docker-npm start docker-db-init` for docker instance)

### run tests with watch mode
- `test:watch` script VS `docker-test:watch` script


## Production build
### !!!THIS IS NOT IMPLEMENTED YET!!!
1. run `yarn build` to build static js files


## Authorization
How to get token from logged user

```graphql
mutation UserLoginMutation {
  UserLoginMutation(input: {
    email: "john0@example.com",
    password: "1111"
  }) {
    token
    user {
      id 
      name
    }
  }
}
```

this mutation return jwt -> you can put this jwt to `Authorization` 

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNTMwOTQ3MTI4fQ.0roGF3qFgXaIk5hgTNGd0kY2Kc927CoO1xcDWpBy_SY"
}
```


TODO:
- require .env for testing without docker
- dont remove prod db with clean script (cant remove db without warning)
- deploy on server
- build typescript

## production startup
```

// pm2 docker shutdown
// http://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/#enabling-graceful-shutdown
process.on('SIGINT', () => {
  db.stop((err) => {
    process.exit(err ? 1 : 0);
  });
});

```
not implemented yet (db does not lost connection)
http://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/#starting-a-configuration-file
