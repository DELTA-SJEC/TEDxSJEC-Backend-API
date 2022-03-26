FROM node:alpine

WORKDIR /var/mynode


COPY ./package.json ./

RUN yarn install

COPY . .

CMD [ "yarn", "start" ]