FROM node:16.14-alpine
COPY . /usr/cutiebot

RUN apk update
RUN apk upgrade --available
RUN apk add yarn

WORKDIR /usr/cutiebot
RUN yarn

CMD [ "yarn", "run", "start" ]
