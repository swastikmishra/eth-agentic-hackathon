FROM node:22-bullseye

RUN yarn global add ts-node nodemon pm2 typescript

EXPOSE 3000

WORKDIR /app