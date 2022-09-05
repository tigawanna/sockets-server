FROM node:latest

COPY . .

RUN npm install

CMD node dist/index.js
