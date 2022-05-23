FROM node:16-alpine3.15
LABEL org.opencontainers.image.source https://github.com/cutie-club/cutiebot

RUN apk add --no-cache yarn

WORKDIR /usr/cutiebot
COPY . /usr/cutiebot
RUN yarn --prod

CMD [ "yarn", "run", "start" ]
