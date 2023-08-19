FROM node:slim
RUN apt-get update -y && apt-get install -y openssl

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

RUN npm ci

COPY prisma ./prisma/
COPY .env ./
COPY . .

RUN npx prisma generate
RUN npx prisma migrate deploy

RUN npm run build


EXPOSE 3010


CMD [ "node", "dist/server.js" ]