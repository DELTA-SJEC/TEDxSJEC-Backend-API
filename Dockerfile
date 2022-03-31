FROM node:14

WORKDIR /var/mynode

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

CMD [ "yarn", "start" ]