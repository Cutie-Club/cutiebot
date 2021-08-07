FROM node:16.6-alpine3.14
COPY . /usr/cutiebot

WORKDIR /usr/cutiebot
RUN npm i
RUN npm run test

CMD [ "npm", "run", "start" ]