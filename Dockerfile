FROM node:20.15-alpine as base

RUN corepack enable


FROM base as builder

WORKDIR /home/node/app
COPY package*.json ./
COPY . .

RUN npm install
RUN npm run build


FROM base as runtime

ENV NODE_ENV=production

WORKDIR /home/node/app
COPY package*.json  ./
# COPY pnpm-lock.yaml ./

# Production packages only and ignore running the prepare script
RUN npm install --omit=dev --ignore-scripts

COPY --from=builder /home/node/app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/nest/main.js"]
