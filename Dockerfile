FROM keymetrics/pm2:8-stretch

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install
RUN npm install pm2 -g

COPY . /usr/src/app

EXPOSE ${HTTP_PORT}

CMD ["npm", "run", "start:docker"]
