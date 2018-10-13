// config for prod pm2
// http://pm2.keymetrics.io/docs/usage/application-declaration/
module.exports = {
  apps : [
    {
      name: 'gql-awesome-backend-prod',
      script: "build/src/main.js",
    },
    {
      name: 'gql-awesome-backend-stage',
      script: "build/src/main.js",
    },
  ],
}
