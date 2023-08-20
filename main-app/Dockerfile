FROM node:slim
RUN apt-get update -y && apt-get install -y openssl

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY ./main-app/package*.json ./

RUN npm install

RUN npm ci

COPY ./main-app/. .

RUN npm run build


EXPOSE 3000
CMD [ "node", "dist/server.js" ]