FROM node:18.4.0-alpine

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait
RUN apk add --no-cache --virtual .build-deps alpine-sdk python3

RUN mkdir -p /var/www/user
WORKDIR /var/www/user

COPY package*.json ./
COPY . .
RUN yarn install
CMD yarn run:user
