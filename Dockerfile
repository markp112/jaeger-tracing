FROM node as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

RUN npm ci

COPY . .

RUN npm run build

FROM node:slim

ENV NODE_ENV production
USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
RUN npx prisma generate
CMD [ "node", "dist/server.js" ]