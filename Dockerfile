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

EXPOSE ${HTTP_PORT:-8080}

CMD ["npm", "run", "start:docker"]

USER node

