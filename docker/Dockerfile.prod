# this dockerfile is for prod instance
FROM keymetrics/pm2:latest-alpine
EXPOSE 2020

RUN mkdir -p /app
WORKDIR /app

RUN apk update

RUN apk add dumb-init

# copy whole project (except .dockerignore) to docker machine
COPY . /app/

# install nodejs packages
RUN yarn install

# build app
RUN yarn run build

CMD ["pm2-runtime", "process.yml"]