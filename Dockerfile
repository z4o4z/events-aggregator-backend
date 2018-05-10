FROM node:8-alpine

RUN apk update && apk upgrade && apk add --no-cache bash git openssh

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
ENV NPM_CONFIG_LOGLEVEL warn

RUN npm i pm2 -g
RUN npm i --production

COPY . ./

ARG EXPOSE_PORT
ENV HTTP_PORT=$EXPOSE_PORT

EXPOSE ${EXPOSE_PORT:-8080}

CMD ["pm2-runtime", "start", "pm2.json"]

USER node

