FROM node:20-slim AS base
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
RUN npx prisma generate
CMD [ "node", "dist/server.js" ]