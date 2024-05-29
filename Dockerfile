FROM node:20.11.1 as build

WORKDIR /app

COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:20.11.1
WORKDIR /app
COPY package.json .
RUN npm install 
COPY --from=build /app/dist ./dist


CMD npm run start:prod