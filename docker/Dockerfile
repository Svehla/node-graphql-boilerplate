FROM node:9.11-alpine

LABEL maintainer="Jakub Svehla <svehl.jakub@gmail.com>"

# RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64

# RUN chmod +x /usr/local/bin/dumb-init

# RUN apt-get update && apt-get install yarn

# wait for mysql to start
RUN apk update
RUN apk add dumb-init

WORKDIR /app

EXPOSE 3020

ENTRYPOINT ["dumb-init"]

