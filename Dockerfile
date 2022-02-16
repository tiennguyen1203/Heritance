# syntax=docker/dockerfile:1
FROM node:14.15.4 as base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM base as prod
RUN npm ci
COPY . .
CMD ["npm", "run", "start"]