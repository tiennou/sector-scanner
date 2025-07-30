FROM node:18-slim

LABEL maintainer="Screeps Sector Scanner"
LABEL version="1.0"
LABEL description="Screeps Sector Scanner"

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
CMD ["yarn","start"]