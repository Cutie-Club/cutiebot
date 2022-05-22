FROM node:lts-alpine
LABEL org.opencontainers.image.source https://github.com/cutie-club/cutiebot

RUN apk add --no-cache yarn python3 build-base

WORKDIR /usr/cutiebot
COPY . /usr/cutiebot
RUN yarn --prod

CMD [ "yarn", "run", "start" ]
