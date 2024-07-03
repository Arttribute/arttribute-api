FROM node:20.15-alpine as build

RUN corepack enable


FROM base as builder

WORKDIR /home/node/app
COPY package*.json ./
COPY . .

RUN npm install
RUN npm build


FROM base as runtime

ENV NODE_ENV=production

WORKDIR /home/node/app
COPY package*.json  ./
# COPY pnpm-lock.yaml ./

RUN npm install --production

COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build

EXPOSE 8080

CMD ["node", "dist/nest/main.js"]
