FROM node:slim
RUN apt-get update -y && apt-get install -y openssl

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY ./auth-app/package*.json ./

RUN npm install

RUN npm ci

COPY ./auth-app/. .

RUN npm run build


EXPOSE 3010

CMD [ "node", "dist/server.js" ]