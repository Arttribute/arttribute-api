FROM node:20.11.1

WORKDIR /app

COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:20.11.1
WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY --from=0 /app/dist ./dist
RUN npm run build
CMD npm run start:prod