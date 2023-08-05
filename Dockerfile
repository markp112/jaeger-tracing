FROM node:20-slim AS base
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/dist

COPY package*.json /usr/src/app
RUN npm install 
COPY . .
RUN tsc
RUN npm run build

EXPOSE 3000
RUN npx prisma generate
CMD [ "node", "dist/server.js" ]