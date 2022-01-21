FROM node:alpine

WORKDIR /app

COPY package*.json yarn.lock ./

COPY ./ ./

RUN npm i

CMD ["npm", "run", "start-client"]