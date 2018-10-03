# this dockerfile is for dev instance
FROM node:9.11-alpine
EXPOSE 2020

RUN mkdir -p /app
WORKDIR /app

RUN apk update

RUN apk add dumb-init

# first copy only dependency files for caching yarn install
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN cd /app
# install nodejs packages
RUN yarn install

ENTRYPOINT ["dumb-init"]