FROM node:16-alpine3.15 as build
WORKDIR /usr/cutiebot
COPY . /usr/cutiebot
RUN apk add --no-cache python3 build-base && yarn install --prod

FROM alpine:3.15
LABEL org.opencontainers.image.source https://github.com/cutie-club/cutiebot
ENV NODE_ENV production

ARG GIT_SHA
ENV GIT_SHA $GIT_SHA

ARG COMMIT_MESSAGE
ENV COMMIT_MESSAGE $COMMIT_MESSAGE

RUN apk add --no-cache nodejs

WORKDIR /usr/cutiebot
COPY --from=build  /usr/cutiebot /usr/cutiebot

CMD node deploy-commands.js && node index.js
