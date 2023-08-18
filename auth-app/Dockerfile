FROM node:slim
RUN apt-get update -y && apt-get install -y openssl

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

RUN npm ci

COPY . .

RUN npm run build

ARG URL = postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public

ENV DATABASE_URL = $URL

EXPOSE 3010
RUN npx prisma generate

RUN npx prisma migrate dev --name init

CMD [ "node", "dist/server.js" ]