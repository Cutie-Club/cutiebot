FROM node:lts-alpine3.16
WORKDIR /usr/cutiebot
COPY . /usr/cutiebot

LABEL org.opencontainers.image.source https://github.com/cutie-club/cutiebot
ENV NODE_ENV production

ARG GIT_SHA
ENV GIT_SHA $GIT_SHA

ARG COMMIT_MESSAGE
ENV COMMIT_MESSAGE $COMMIT_MESSAGE

RUN yarn set version berry
RUN yarn install

CMD yarn node deploy-commands.js && yarn node index.js
