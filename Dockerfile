FROM node:slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

RUN npm ci

COPY . .

RUN npm run build


EXPOSE 3000
RUN npx prisma generate
CMD [ "node", "dist/server.js" ]