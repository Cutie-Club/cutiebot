FROM node:16-alpine3.15 as build
WORKDIR /usr/cutiebot
COPY . /usr/cutiebot
RUN yarn install --prod

FROM alpine:3.15
LABEL org.opencontainers.image.source https://github.com/cutie-club/cutiebot
ENV NODE_ENV production

RUN apk add --no-cache nodejs

WORKDIR /usr/cutiebot
COPY --from=build  /usr/cutiebot /usr/cutiebot

CMD [ "node", "deploy-commands.js", "&&", "node", "index.js" ]
