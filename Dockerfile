FROM node:18-alpine
WORKDIR /app
# RUN apk add openjdk8-jre
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . .
# CMD [ "npm", "run", "start" ]
