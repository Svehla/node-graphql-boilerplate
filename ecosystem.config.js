// pm2 setup:
// TODO: add docs
module.exports = {
  apps: [
    {
      name: 'admin-service-production',
      script: 'build/src/main.js',
    },
    {
      name: 'admin-service-stage',
      script: 'build/src/main.js',
    },
  ],
}
