# syntax=docker/dockerfile:1

FROM node:16.17.0

WORKDIR "/app"
COPY . .
RUN npm install

RUN mkdir "/logs"

RUN npm run build
CMD ["npm", "run", "start"]
