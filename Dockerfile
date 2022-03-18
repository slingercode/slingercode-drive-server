FROM node:16.14.0-alpine as build

ARG APP_CORS_ORIGINS=
ARG APP_PORT=

ENV APP_CORS_ORIGINS=${APP_CORS_ORIGINS}
ENV APP_PORT=${APP_PORT}

WORKDIR /usr/app

COPY [".", "./"]

RUN npm install --production --no-audit --quiet

ENV NODE_ENV production

EXPOSE ${APP_PORT}

CMD ["npm", "start"]
