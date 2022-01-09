FROM node:16-alpine3.14


RUN mkdir /app
RUN mkdir /app/src

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
COPY . /app

RUN yarn install
RUN yarn build
CMD ["yarn", "start"]




