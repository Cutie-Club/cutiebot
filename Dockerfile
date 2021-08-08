FROM node:16.6.1-alpine3.14
COPY . /usr/cutiebot

RUN apk add build-base python3
RUN npm i -g node-gyp

WORKDIR /usr/cutiebot
RUN npm i
RUN npm run test

CMD [ "npm", "run", "start" ]
