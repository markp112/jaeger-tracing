FROM node:slim
RUN apt-get update -y && apt-get install -y openssl

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

RUN npm ci

COPY prisma ./prisma/
COPY . .

ARG DATABASE_URL=postgresql://USER:PASSWORD@postgresql:5432/auth?schema=public

RUN echo ${URL}

RUN touch .env

RUN echo ${URL} > ./.env 

RUN npx prisma generate

RUN npm run build
# RUN npx prisma migrate save --name initial --experimental
# RUN npx prisma migrate up --experimental

EXPOSE 3010


CMD [ "node", "dist/server.js" ]